
/**
    cache for all video's under this category

    ref (path) for a certain video is root->"videos"->{categoryId}->{videoId}->VIDEO_DATA
    VIDEO_DATA is an object {title, desc, url}

    this will store properties with name = videoKey, value = {id: videoKey, data: videoData, html: Text}
    html for each video is created only once from videoData and stored here
 **/

let videosData = {}


/**
 * Adds realtime add/remove/update listeners for child nodes in video for this category only (which is specific for a user)
 */
function addFirebaseListenersForCategory(){
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('id');

    // path to the video's node is root->videos->{categoryId}
    let ref = firebase.database().ref("videos").child(categoryId)

    // ref.once('value', (snapshot) => {
    //     const allCategories = snapshot.val();
    //     updateFullCategory(allCategories)
    // })

    ref.on('child_added', (snapshot) => {
        // path here is ref->{videoId}
        const videoKey = snapshot.key
        const videoData = snapshot.val();
        updateVideo(videoKey, videoData)
    })

    ref.on('child_changed', (snapshot) => {
        const videoKey = snapshot.key
        const videoData = snapshot.val();
        updateVideo(videoKey, videoData)
    })

    ref.on('child_removed', (snapshot) => {
        const videoKey = snapshot.key
        removeVideo(videoKey)
    })
}

/**
 *
 * @param video = a specific video object from videosData cache
 * video has id, data = actual data from database
 * Now we add one more property (html) = this video specific html
 * So finally video has id, data = actual data from database, html = html for this video
 * @returns {string}
 */

function createHtmlForVideo(video){
    let title = video.data.title
    let description = video.data.description
    let url = video.data.url
    return `
    <div class="card" style="width: 18rem;">
        <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${description}</p>
            <a href="${url}"  class="btn btn-primary">Launch Video</a>
        
        <button onclick="removeVideoFromDatabase('${video.key}')">Remove</button>
        </div>
</div>
    `
}
function removeVideoFromDatabase(videoKey){
    let currentUsersUID = firebase.auth().currentUser.uid
    let ref = firebase.database().child("video").child("category.id").child("videoKey")
    ref.remove()
}

/**
 * Adds/Updates cache (videosData) for this video
 *
 * Cache (vid object in code) includes {videoKey, videoData, generated html for this video only}
 * After updating videosData (cache) it updates the UI.
 * @param videoKey = id of video in database
 * @param videoData = data of video in database (which is an object {title, desc, url})
 */
function updateVideo(videoKey, videoData){
    let vid = {
        id: videoKey,
        data: videoData
    }
    vid.html = createHtmlForVideo(vid)
    videosData[videoKey] = vid
    updateUIList()
}

/**
 * Remove the video from videosData when it's deleted from database
 * @param videoKey
 */
function removeVideo(videoKey){
    // simply delete the value with property name = videoKey
    delete videosData[videoKey]
    updateUIList()
}

/**
 * Updates UI based on pre-created (cached) html we have in videosData
 */
function updateUIList(){
    let html = ""
    // iterate over all the properties (which is videoKey itself) of videosData
    for(let videoKey in videosData){
        html += videosData[videoKey].html
    }

    // now html variable contains the full html for a all the video items currently available
    // update the page by setting innerHTML = html for the video list div
    document.getElementById("all_videos").innerHTML = html
}

/**
 * Created a new entry for video in database
 * categoryId is grabbed from url of page
 * title, desc, url from user's input
 */
function createNewVideo(){
    console.log("add video called")
    console.log(firebase)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('id');

    let ref = firebase.database().ref("videos").child(categoryId).push()
    let title = document.getElementById("video-title").value
    let url = document.getElementById("video-url").value
    let desc = document.getElementById("video-desc").value

    // add to database
    ref.set({title: title, description: desc, url: url})
}
