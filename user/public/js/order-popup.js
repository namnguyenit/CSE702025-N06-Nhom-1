// Show popup after successful order placement
function showOrderSuccessPopup() {
  if (window.Swal) {
    Swal.fire({
      icon: 'success',
      title: 'Đặt hàng thành công!',
      text: 'Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được ghi nhận.',
      confirmButtonText: 'OK'
    });
  } else {
    alert('Đặt hàng thành công! Cảm ơn bạn đã đặt hàng.');
  }
}

function showLoginSuccessPopup() {
  if (window.Swal) {
    Swal.fire({
      icon: 'success',
      title: 'Đăng Nhập Thành Công 😊',
      confirmButtonText: 'OK'
    });
  } else {
    alert('Đăng nhập thành công!');
  }
}

function showAddToCartPopup() {
  if (window.Swal) {
    Swal.fire({
      icon: 'success',
      title: 'Đã thêm vào giỏ hàng!',
      confirmButtonText: 'OK'
    });
  } else {
    alert('Đã thêm vào giỏ hàng!');
  }
}

// Detect if redirected from checkout and show popup
if (window.location.pathname === '/checkout' && window.location.search.includes('success=1')) {
  showOrderSuccessPopup();
}
// Detect login success via query param
if (window.location.search.includes('login_success=1')) {
  showLoginSuccessPopup();
}
// Detect add-to-cart success via query param
if (window.location.search.includes('addcart_success=1')) {
  showAddToCartPopup();
}
