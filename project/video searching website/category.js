let categoriesData = {}

// need to use authentication uid to access database
// hence wait till valid authentication is recognised by firebase before trying to access database
firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
        addFirebaseListeners()
    }else{
        // user isn't logged in
        // clear ui list
        categoriesData = {}
    }
});

function addFirebaseListeners(){
    let currentUsersUID = firebase.auth().currentUser.uid
    console.log(currentUsersUID)

    let ref = firebase.database().ref("category").child(currentUsersUID)

    // ref.once('value', (snapshot) => {
    //     const allCategories = snapshot.val();
    //     updateFullCategory(allCategories)
    // })

    ref.on('child_added', (snapshot) => {
        const categoryKey = snapshot.key
        const categoryData = snapshot.val();
        updateCategory(categoryKey, categoryData)
    })

    ref.on('child_changed', (snapshot) => {
        const categoryKey = snapshot.key
        const categoryData = snapshot.val();
        updateCategory(categoryKey, categoryData)
    })

    ref.on('child_removed', (snapshot) => {
        const categoryKey = snapshot.key
        removeCategory(categoryKey)
    })
}

function createHtmlForCategory(category){
    let title = category.data.title
    let description = category.data.description
    return `
    <div class="card" style="width: 18rem;">
        <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${description}</p>
            <a href="category_items.html?id=${category.id}" class="btn btn-primary">Open</a>
        </div>
        <button onclick="removeCategoryFromDatabase('${category.id}')">Remove</button>
    </div>
    `
}

function removeCategoryFromDatabase(categoryId){
    let currentUsersUID = firebase.auth().currentUser.uid
    let ref = firebase.database().ref("category").child(currentUsersUID).child(categoryId)
    ref.remove()
}

// function updateFullCategory(allCategories){
//     for(let categoryKey in allCategories){
//         updateCategory(categoryKey, allCategories[categoryKey])
//     }
//     updateUIList()
// }

function updateCategory(categoryKey, categoryData){
    let cat = {
        id: categoryKey,
        data: categoryData
    }
    cat.html = createHtmlForCategory(cat)
    categoriesData[categoryKey] = cat
    updateUIList()
}

function removeCategory(categoryKey){
    delete categoriesData[categoryKey]
    updateUIList()
}

function updateUIList(){
    let html = ""
    for(let categoryKey in categoriesData){
        html += categoriesData[categoryKey].html
    }

    document.getElementById("all_categories").innerHTML = html
}

function createNewCategory(){
    console.log("add category called")
    console.log(firebase)

    let currentUsersUID = firebase.auth().currentUser.uid

    let ref = firebase.database().ref("category").child(currentUsersUID).push()
    let title = document.getElementById("category-title").value
    let desc = document.getElementById("category-desc").value
    ref.set({title: title, description: desc})
}
