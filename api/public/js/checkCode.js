const firebaseConfig = {
  apiKey: "AIzaSyA7NsO6sEHcXfecjCLlkYc1pffZotYAVm8",
  authDomain: "authmobile-1640176421715.firebaseapp.com",
  databaseURL: "https://authmobile-1640176421715-default-rtdb.firebaseio.com",
  projectId: "authmobile-1640176421715",
  storageBucket: "authmobile-1640176421715.appspot.com",
  messagingSenderId: "888315524640",
  appId: "1:888315524640:web:63531ad588030071b0ee45",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
db.ref("code/" + "test1@test_com").set({
  email: "test1@test.com",
  code: "12345",
});
// db.ref("code/" + "test@test_com").set({
//   email: "test@test.com",
//   code: "12345",
// });
var submit = false;
$("#submit").click(function (e) {
  const clientEmail = $("#email").val();
  const clientCode = $("#code").val();
  db.ref("code").on("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      const email = childSnapshot.val().email;
      const code = childSnapshot.val().code;
      if (email === clientEmail && code === clientCode) {
        submit = true;
      }
    });
  });
  console.log(submit);
  if (!submit) {
    // $("#Form").submit();
    e.preventDefault();
    $("#error").text("the email or code selected is invalid !");
  } else {
    db.ref().child("code").child(clientEmail.replace(".", "_")).remove();
  }
});
