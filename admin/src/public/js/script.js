const destroys = document.querySelectorAll(".btn-destroy");

// Bởi vì chỉ trong products add to cart mới hoạt động
if (destroys) {
  destroys.forEach((item) => {
    item.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(item);
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        console.log("123");
        const res = await fetch("/users/destroy", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          item.parentNode.parentNode.parentNode.remove();
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }
      }
    });
  });
}

const destroyOrder = document.querySelectorAll(".btn-destroy-order");

console.log(destroyOrder);

if (destroyOrder) {
  destroyOrder.forEach((item) => {
    item.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(item);
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        console.log("123");
        const res = await fetch("/orders/cancelled", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const status =
            item.parentNode.parentNode.parentNode.querySelector(
              "#chang-status"
            );
          status.innerHTML = "cancelled";
          const icon = item.parentNode.querySelector("#chang-status-icon");
          icon.innerHTML = `
<div class="form-button-action">
<button type="submit"
data-bs-toggle="tooltip"
title="cancelled"
class="btn btn-link btn-secondary">
<i
class="fa fa-hourglass-half"></i>
</button>
</div>
`;
          Swal.fire({
            title: "Cancelled!",
            text: "Your file has been cancelled.",
            icon: "success",
          });
        }
      }
    });
  });
}
