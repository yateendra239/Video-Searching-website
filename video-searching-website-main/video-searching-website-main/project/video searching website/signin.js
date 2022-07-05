
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyBw7NbChAE4CS4E0Y0p8db1KBUqJwtmRiQ",
    authDomain: "video-searching-website.firebaseapp.com",
    projectId: "video-searching-website",
    storageBucket: "video-searching-website.appspot.com",
    messagingSenderId: "729141570943",
    appId: "1:729141570943:web:d925bb1e3caf3a6bc3be4a",
    measurementId: "G-5G62H1TZP7"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  window.firebase = firebase

  firebase.auth.Auth.Persistence.LOCAL

  $("#btn-login").click(function()
  {
      var email = $("#email").val();
      var password = $("#password").val();

      if (email != "" && password != "")
      {
          var result = firebase.auth().signInWithEmailAndPassword(email,password);

          result.catch(function(error)
          {
              var errorCode = error.code;
              var errorMessage = error.message;

              console.log(errorCode);
              console.log(errorMessage);

              window.alert("Message : "+ errorMessage);
          })
      }

  });
  $("#btn-signup").click(function()
  {
      var email = $("#Email").val();
      var password = $("#Password").val();
      var Cpassword = $("#confirmpassword").val();

      if (email != "" && password != ""  && Cpassword != "")
      {
        if(password == Cpassword)
      {
          var result = firebase.auth().createUserWithEmailAndPassword(email,password);

          result.catch(function(error)
          {
              var errorCode = error.code;
              var errorMessage = error.message;

              console.log(errorCode);
              console.log(errorMessage);

              window.alert("Message : "+ errorMessage);
          })
      }
      else
      {
       window.alert("Password do not match with the confirm password.");
      }
    }
      else
      {
        window.alert("Form is incomplete.Please fill out all details.");
      }
  });



 $ ("#btn-resetpassword").click(function()
 {
   var auth = firebase.auth();
   var email = $("#email").val();

   if (email!= "")
   {
     auth.sendPasswordResetEmail(email).then(function()
     {
      window.alert("Email has sent to you. please check and verify.");
     })
     .catch(function(error)
     {
      var errorCode = error.code;
      var errorMessage = error.message;

      console.log(errorCode);
      console.log(errorMessage);

      window.alert("Message : "+ errorMessage);
     });
   }
 else
 {
  window.alert("Please write your email address.");
 }

 });

 $("#btn-update").click(function()
 {
 var phone = $("#phone").val();
 var address = $("#address").val();
 var bio = $("#bio").val();
 var gender = $("#gender").val();
 var fName = $("#firstName").val();
 var lName = $("#lastName").val();
 var country = $("#country").val();

 var rootRef = firebase.database().ref().child("Users");
 var userID = firebase.auth().currentUser.uid;
 var usersRef = rootRef.child(userID);

 if(fName!="" && lName!="" && gender!="" && bio!="" && country!="" && address!="" && phone!="")
 {
    var userData=
    {
      "phone":phone,
      "address": address,
      "bio": bio,
      "gender": gender,
      "firstName": fName,
      "lastName": lName,
      "country": country,

    };

    usersRef.set(userData,function(error)
    {
      if(error)
      {
        var errorCode = error.code;
              var errorMessage = error.message;

              console.log(errorCode);
              console.log(errorMessage);

              window.alert("Message : "+ errorMessage);
      }
      else{
         window.location.href = "main.html";
      }
    });
 }
else
{
  window.alert("Form is incomplete.Please fill out all details.");
}

});

$("#btn-logout").click(function()
{
firebase.auth().signOut();
});
