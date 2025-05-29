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
