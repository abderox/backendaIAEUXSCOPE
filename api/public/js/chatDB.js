var emailDoctor = $("#doctorEmail").val();
var emailUser = "";
var isfirstTime = true;
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
const username = "ahmed";
$(".submit").click(function () {
  newMessage();
});
$(window).on("keydown", function (e) {
  if (e.which == 13) {
    newMessage();
    return false;
  }
});
// function newMessage()
const fetchList = db.ref();
var isDoctorExist = false;
$(".wrap p:first-child").text($("#doctorName").val());
$(".wrap img").attr("src", $("#doctorProfile").val());
db.ref("doctors").on("value", function (snapshot) {
  snapshot.forEach(function (childSnapshot) {
    const email = childSnapshot.val().email;
    if (email === emailDoctor) {
      isDoctorExist = true;
    }
  });
});
if (!isDoctorExist) {
  db.ref("doctors/" + emailDoctor.replace(".", "_")).set({
    email: emailDoctor,
    name: $("#doctorName").val(),
    profilePicUrl: $("#doctorProfile").val(),
  });
}
fetchList.on("child_added", function (snapshot) {
  if (emailUser != "") {
    getMessages();
  }
});
fetchList.on("child_added", function (snapshot) {
  $("#contacts ul li").remove();

  db.ref("chat").on("value", function (snapshot) {
    $("#contacts ul li").remove();
    snapshot.forEach(function (childSnapshot) {
      const doctor = childSnapshot.val().doctor;
      const current = childSnapshot.val().user;
      if (doctor == emailDoctor) {
        db.ref("users").on("value", function (snapshot) {
          snapshot.forEach(function (childSnapshot1) {
            const user = childSnapshot1.val();
            // console.log(user.email);
            if (user.email === current) {
              var LstMsg = "Last messges";
              childSnapshot.forEach((element) => {
                element.forEach((chatData) => {
                  if (
                    chatData.val().email === current ||
                    chatData.val().email === emailDoctor
                  )
                    LstMsg = chatData.val().msg;
                });
              });
              const ProfilePicUrl = user.profilePicUrl;
              const Name = user.name;
              const Email = user.email;
              // const LstMsg = "Last message";
              const msg =
                ' <li class="contact"><input type="hidden" value="' +
                Email +
                '" ><div class="wrap"><span class="contact-status online"></span><img src="' +
                ProfilePicUrl +
                '" alt="" /> <div class="meta"> <p class="name">' +
                Name +
                '</p> <p class="preview">' +
                LstMsg +
                "</p></div></div></li>";
              $("#contacts ul").append(msg);
              $(".contact").each(function (index, element) {
                if (emailUser === $(this).children("input").val()) {
                  $(this).addClass("active");
                }
                $(this).click(function (e) {
                  e.preventDefault();
                  if (isfirstTime) {
                    $(".message-input").removeClass("hide");
                    $(".messages").removeClass("hide");
                    isfirstTime = false;
                  }
                  $(".contact").each(function (index1, element1) {
                    $(this).removeClass("active");
                  });
                  $("#contact-profile-image").attr(
                    "src",
                    $("img", this).attr("src")
                  );
                  $(".contact-profile p").text(
                    $("p:nth-child(1)", this).text()
                  );
                  emailUser = $(this).children("input").val();
                  $(this).addClass("active");
                  $(".messages ul li").remove();
                  $(".messages").animate(
                    { scrollTop: $(document).height() },
                    "fast"
                  );
                  getMessages();
                });
              });
            }
          });
        });
      }
    });
  });
});
// search contacts
$(".search-container input").keyup(function (e) {
  $(".list ul li").remove();
  let search = $(this).val();
  db.ref("users").on("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      const email = childSnapshot.val().email;
      const name = email.substring(0, email.length - 10);
      if (name.includes(search)) {
        $(
          '<li><input type="hidden" value="' +
            childSnapshot.val().name +
            '" ><img src="' +
            childSnapshot.val().profilePicUrl +
            '" alt="" /><div>' +
            email +
            "</div></li>"
        ).appendTo($(".list ul"));
        $(".list ul li").each(function (index, element) {
          $(this).click(function (e) {
            e.preventDefault();
            $(".add-user-container").css("display", "none");
            $(".messages ul li").remove();
            if (isfirstTime) {
              $(".message-input").removeClass("hide");
              $(".messages").removeClass("hide");
              isfirstTime = false;
            }
            emailUser = $(this).children("div").text();
            $("#contact-profile-image").attr("src", $("img", this).attr("src"));
            $(".contact-profile p").text($(this).children("input").val());
          });
        });
      }
    });
  });
});
// add new message to database
function newMessage() {
  const message = $("#input").val();
  if (message != "") {
    $(".messages ul li").remove();
    if ($.trim(message) == "") {
      return false;
    }
    const _time = new Date().toLocaleTimeString("en-GB").substring(0, 5);
    $(".message-input input").val(null);
    $(".contact.active .preview").html("<span>You: </span>" + message);
    $(".messages").animate({ scrollTop: $(document).height() }, "fast");
    const timestamp = Date.now();
    var isExist = false;
    var chatId = 2;
    db.ref("chat").on("value", function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        const doctor = childSnapshot.val().doctor;
        const current = childSnapshot.val().user;
        if (doctor == emailDoctor && current === emailUser) {
          isExist = true;
          chatId = childSnapshot.key;
        }
      });
    });
    if (!isExist) {
      db.ref("chat").on("value", function (snapshot) {
        // childSn.forEach(function (childSnapshot) {
        console.log(snapshot.numChildren());
        chatId = snapshot.numChildren() + 1;
        // });
      });
      db.ref("chat/" + chatId).set({
        doctor: emailDoctor,
        user: emailUser,
        lastTime: String(timestamp - 1),
      });
      chatId = chatId - 1;
    }
    db.ref("chat/" + chatId + "/messages/" + timestamp).set({
      email: emailDoctor,
      msg: message,
      date: new Date()
        .toLocaleDateString("en-GB")
        .replace("/", "-")
        .replace("/", "-"),
      time: _time,
    });
    $(".messages").animate(
      { scrollTop: $(".messages").prop("scrollHeight") },
      0
    );
  }
}
// get messages from database
function getMessages() {
  var imgUser = "";
  var imgDoctor = "";
  db.ref("users").on("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      const email = childSnapshot.val().email;
      if (email === emailUser) {
        imgUser = childSnapshot.val().profilePicUrl;
      }
    });
  });
  db.ref("doctors").on("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      const email = childSnapshot.val().email;
      if (email === emailDoctor) {
        imgDoctor = childSnapshot.val().profilePicUrl;
      }
    });
  });
  db.ref("chat").on("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      const doctor = childSnapshot.val().doctor;
      const current = childSnapshot.val().user;
      if (emailDoctor == doctor && emailUser != "" && emailUser == current) {
        $(".messages ul li").remove();
        childSnapshot.forEach((element) => {
          element.forEach((chatData) => {
            const talk = chatData.val().email;
            var imgPath = "";
            let classe = "";
            if (talk == emailDoctor) {
              imgPath = imgDoctor;
              classe = "sent";
            } else {
              imgPath = imgUser;
              classe = "replies";
            }
            const message = chatData.val().msg;
            const time = chatData.val().time;
            $(
              '<li class="' +
                classe +
                '"><img src="' +
                imgPath +
                '" alt="" /><p>' +
                message +
                " <br> <span>" +
                time +
                "</span></p></li>"
            ).appendTo($(".messages ul"));
          });
        });
      }
    });
  });
  $(".messages").animate({ scrollTop: $(".messages").prop("scrollHeight") }, 0);
}
