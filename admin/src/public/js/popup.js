const popup = document.getElementById("popup");

//incorrect-password: Incorrect password
//no-user: User does not exist
//unauthenticated: Unauthenticated - You need to log in first
//not-match: Passwords do not match

const arrInfo = {
  "incorrect-password": "Incorrect password",
  "no-user": "User does not exist",
  unauthenticated: "Unauthenticated - You need to log in first",
  "not-match": "Passwords do not match",
};

let { name: type, value: info } = popup;

function alertBox(type, info) {
  Swal.fire({
    icon: type,
    title: info,
    text: arrInfo[info],
  });
}

if (popup.name === "error") {
  if (popup.value === "incorrect-password") {
    alertBox(type, info);
  } else if (popup.value === "no-user") {
    alertBox(type, info);
  } else if (popup.value === "unauthenticated") {
    alertBox(type, info);
  } else if (popup.value === "not-match") {
    alertBox(type, info);
  }
}
