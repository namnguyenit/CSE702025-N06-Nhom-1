const popup = document.getElementById("popup");

//incorrect-password: Incorrect password
//no-user: User does not exist
//unauthenticated: Unauthenticated - You need to log in first
//not-match: Passwords do not match
//missing-data: Please fill out this field.

function init() {
  if (document.cookie) {
    const message = getMessage();
    if (!(message.icon && message.title)) {
      return;
    }
    Swal.fire({
      title: message.title,
      icon: message.icon,
      draggable: true,
    }).then((result) => {
      document.cookie = "icon=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "title=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    });
  }
}

init(); // gọi hàm

function getMessage() {
  const cookies = document.cookie.split("; ");
  const message = {};
  cookies.forEach((item) => {
    const [key, value] = item.split("=");
    message[key] = decodeURIComponent(value);
  });
  return message;
}
