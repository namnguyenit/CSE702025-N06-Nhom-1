const addToCartList = document.querySelectorAll(".addToCart");

// Bởi vì chỉ trong products add to cart mới hoạt động
if (addToCartList) {
  addToCartList.forEach((item) => {
    item.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(item);
      try {
        const res = await fetch("/products/add", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          item.reset();
          const result = await res.json();
          Swal.fire({
            title: result.message,
            icon: "success",
            draggable: true,
          });
        }
      } catch (error) {
        console.log("ERROR:", error);
      }
    });
  });
}
