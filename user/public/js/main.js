(function ($) {
  "use strict"

/* 1. Proloder */
  $(window).on('load', function () {
    $('#preloader-active').delay(450).fadeOut('slow');
    $('body').delay(450).css({
      'overflow': 'visible'
    });
  });


/* 2. slick Nav */
// mobile_menu
  var menu = $('ul#navigation');
  if(menu.length){
    menu.slicknav({
      prependTo: ".mobile_menu",
      closedSymbol: '+',
      openedSymbol:'-'
    });
  };


/* 3. MainSlider-1 */
  function mainSlider() {
    var BasicSlider = $('.slider-active');
    BasicSlider.on('init', function (e, slick) {
      var $firstAnimatingElements = $('.single-slider:first-child').find('[data-animation]');
      doAnimations($firstAnimatingElements);
    });
    BasicSlider.on('beforeChange', function (e, slick, currentSlide, nextSlide) {
      var $animatingElements = $('.single-slider[data-slick-index="' + nextSlide + '"]').find('[data-animation]');
      doAnimations($animatingElements);
    });
    BasicSlider.slick({
      autoplay: false,
      autoplaySpeed: 10000,
      dots: false,
      fade: true,
      arrows: false, // Tắt arrows mặc định của slider chính nếu không cần thiết hoặc đã có custom
      prevArrow: '<button type="button" class="slick-prev"><i class="ti-shift-left"></i></button>',
      nextArrow: '<button type="button" class="slick-next"><i class="ti-shift-right"></i></button>',
      responsive: [{
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
          }
        },
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false
          }
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false
          }
        }
      ]
    });

    function doAnimations(elements) {
      var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
      elements.each(function () {
        var $this = $(this);
        var $animationDelay = $this.data('delay');
        var $animationType = 'animated ' + $this.data('animation');
        $this.css({
          'animation-delay': $animationDelay,
          '-webkit-animation-delay': $animationDelay
        });
        $this.addClass($animationType).one(animationEndEvents, function () {
          $this.removeClass($animationType);
        });
      });
    }
  }
  mainSlider();



/* 4. Testimonial Active*/
var testimonial = $('.h1-testimonial-active');
  if(testimonial.length){
  testimonial.slick({
      dots: false,
      infinite: true,
      speed: 1000,
      autoplay:false,
      loop:true,
      arrows: true,
      prevArrow: '<button type="button" class="slick-prev"><i class="ti-angle-left"></i></button>',
      nextArrow: '<button type="button" class="slick-next"><i class="ti-angle-right"></i></button>',
      slidesToShow: 1,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: false,
            arrow:false // Nên là arrows: false
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows:false
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows:false,
          }
        }
      ]
    });
  }


/* 5. Gallery Active */
  var client_list = $('.completed-active');
  if(client_list.length){
    client_list.owlCarousel({
      // slidesToShow: 2, // Thuộc tính của Slick, không phải OwlCarousel
      // slidesToScroll: 1, // Thuộc tính của Slick
      items: 3, // Sử dụng items cho OwlCarousel
      loop: true,
      autoplay:true,
      speed: 3000,
      smartSpeed:2000,
      nav: false,
      dots: false,
      margin: 15,

      autoplayHoverPause: true,
      responsive : {
        0 : {
          items: 1
        },
        768 : {
          items: 2
        },
        992 : {
          items: 2 // Có thể bạn muốn 3 ở đây nếu 1200 là 3
        },
        1200:{
          items: 3
        }
      }
    });
  }


/* 6. Nice Selectorp  */
var nice_Select = $('select');
  if(nice_Select.length){
    nice_Select.niceSelect();
  }

/* 7.  Custom Sticky Menu  */
  $(window).on('scroll', function () {
    var scroll = $(window).scrollTop();
    if (scroll < 245) {
      $(".header-sticky").removeClass("sticky-bar");
    } else {
      $(".header-sticky").addClass("sticky-bar");
    }
  });

  // Có vẻ đoạn này lặp lại logic, nếu class "sticky" và "sticky-bar" là một thì có thể gộp
  $(window).on('scroll', function () {
    var scroll = $(window).scrollTop();
    if (scroll < 245) {
        $(".header-sticky").removeClass("sticky");
    } else {
        $(".header-sticky").addClass("sticky");
    }
  });



/* 8. sildeBar scroll */ // Nên là "ScrollUp" hoặc "Sidebar Scroll"
  $.scrollUp({
    scrollName: 'scrollUp', // Element ID
    topDistance: '300', // Distance from top before showing element (px)
    topSpeed: 300, // Speed back to top (ms)
    animation: 'fade', // Fade, slide, none
    animationInSpeed: 200, // Animation in speed (ms)
    animationOutSpeed: 200, // Animation out speed (ms)
    scrollText: '<i class="ti-arrow-up"></i>', // Text for element
    activeOverlay: false, // Set CSS color to display scrollUp active point, e.g '#00FFFF'
  });


/* 9. data-background */
  $("[data-background]").each(function () {
    $(this).css("background-image", "url(" + $(this).attr("data-background") + ")")
    });


/* 10. WOW active */
  if (typeof WOW !== 'undefined') { // Kiểm tra WOW có tồn tại không
    new WOW().init();
  }

/* 11. Datepicker */
// Hiện tại không có code Datepicker nào ở đây

// 11. ---- Mailchimp js --------//  (Đánh số lại nếu Datepicker được thêm)
  function mailChimp() {
    // Kiểm tra sự tồn tại của element trước khi gọi plugin
    if ($('#mc_embed_signup').length > 0 && typeof $('#mc_embed_signup').find('form').ajaxChimp !== 'undefined') {
        $('#mc_embed_signup').find('form').ajaxChimp();
    }
  }
  mailChimp();


// 12 Pop Up Img
  var popUp = $('.single_gallery_part, .img-pop-up');
    if(popUp.length && typeof popUp.magnificPopup !== 'undefined'){ // Kiểm tra magnificPopup
      popUp.magnificPopup({
        type: 'image',
        gallery:{
          enabled:true
        }
      });
    }


/* ----------------- Other Inner page Start ------------------ */

// Popup Video
if (typeof $.fn.magnificPopup !== 'undefined') {
  $('.popup-youtube, .popup-vimeo').magnificPopup({
    // disableOn: 700, // Cân nhắc nếu cần
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false
  });
}

// Client Review Slider
var review = $('.client_review_slider');
if (review.length && typeof review.owlCarousel !== 'undefined') { // Kiểm tra owlCarousel
  review.owlCarousel({
    items: 1,
    loop: true,
    dots: true, // Có vẻ bạn muốn dots ở đây
    autoplay: true,
    autoplayHoverPause: true,
    autoplayTimeout: 5000,
    nav: true, // Và nav ở đây
    // dots: false, // Dòng này mâu thuẫn với dòng trên
    navText: [" <i class='ti-angle-left'></i> ", "<i class='ti-angle-right'></i> "],
    responsive: {
      0: {
        nav: false
      },
      768: {
        nav: false
      },
      991: {
        nav: true
      }
    }
  });
}

// Product Image Slider (Trang chi tiết sản phẩm)
var product_slide = $('.product_img_slide');
if (product_slide.length && typeof product_slide.owlCarousel !== 'undefined') {
  product_slide.owlCarousel({
    items: 1,
    loop: true,
    dots: true,
    autoplay: true,
    autoplayHoverPause: true,
    autoplayTimeout: 5000,
    nav: true,
    // dots: false, // Mâu thuẫn
    navText: [" <i class='ti-angle-left'></i> ", "<i class='ti-angle-right'></i> "],
    responsive: {
      0: {
        nav: false
      },
      768: {
        nav: false
      },
      991: {
        nav: true
      }
    }
  });
}

  //product list slider (Có thể là slider trên trang danh sách sản phẩm hoặc widget)
  var product_list_slider = $('.product_list_slider');
  if (product_list_slider.length && typeof product_list_slider.owlCarousel !== 'undefined') {
    product_list_slider.owlCarousel({
        items: 1,
        loop: true,
        dots: false,
        autoplay: true,
        autoplayHoverPause: true,
        autoplayTimeout: 5000,
        nav: true,
        navText: ["next", "previous"], // Nên dùng icon hoặc class CSS cho đẹp hơn
        smartSpeed: 1000,
        responsive: {
          0: {
            margin: 15,
            nav: false,
            items: 1
          },
          600: {
            margin: 15,
            items: 1,
            nav: false
          },
          768: {
            margin: 30,
            nav: true,
            items: 1 // Xem lại có muốn nhiều items hơn ở đây không
          }
        }
      });
    }

    // Image Gallery Popup (lặp lại?)
    if ($('.img-gal').length > 0 && typeof $.fn.magnificPopup !== 'undefined') {
      $('.img-gal').magnificPopup({
        type: 'image',
        gallery: {
          enabled: true
        }
      });
    }

    // niceSelect js code (đã có ở trên, đảm bảo chỉ gọi 1 lần sau khi DOM sẵn sàng)
    // $(document).ready(function () {
    //   if(nice_Select.length){ // nice_Select đã được khai báo ở trên
    //     nice_Select.niceSelect();
    //   }
    // });

    // menu fixed js code
    $(window).scroll(function () {
      var window_top = $(window).scrollTop() + 1;
      if (window_top > 50) {
        $('.main_menu').addClass('menu_fixed animated fadeInDown');
      } else {
        $('.main_menu').removeClass('menu_fixed animated fadeInDown');
      }
    });

    // CounterUp (bị comment, nếu dùng thì bỏ comment và đảm bảo thư viện đã được nhúng)
    // if (typeof $.fn.counterUp !== 'undefined') {
    //   $('.counter').counterUp({
    //     delay: 10, // Thêm delay
    //     time: 2000
    //   });
    // }

    // Product Details Page Slider (Slick)
    if (typeof $.fn.slick !== 'undefined') {
      $('.slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false, // Tắt arrows nếu dùng asNavFor
        speed: 300,
        infinite: true,
        asNavFor: '.slider-nav-thumbnails',
        autoplay: true, // Xem xét có nên autoplay ở đây không
        pauseOnFocus: true, // Tốt
        dots: true, // Hiển thị dots cho slider chính
      });

      $('.slider-nav-thumbnails').slick({
        slidesToShow: 3, // Số lượng thumbnails hiển thị
        slidesToScroll: 1,
        asNavFor: '.slider',
        focusOnSelect: true,
        infinite: true,
        prevArrow: false, // Tắt arrows cho thumbnails nếu không muốn
        nextArrow: false,
        centerMode: true, // Thumbnail ở giữa sẽ active
        responsive: [{
          breakpoint: 480,
          settings: {
            centerMode: false, // Tắt centerMode trên mobile nếu cần
            slidesToShow: 2 // Giảm số lượng thumbnails trên mobile
          }
        }]
      });
    }


    // Search Toggle
    $("#search_input_box").hide();
    $("#search_1").on("click", function () {
      $("#search_input_box").slideToggle();
      $("#search_input").focus();
    });
    $("#close_search").on("click", function () {
      $('#search_input_box').slideUp(500);
    });

    //------- Mailchimp js --------//  (Đã có ở trên)
    // function mailChimp() {
    //   $('#mc_embed_signup').find('form').ajaxChimp();
    // }
    // mailChimp();

    //------- makeTimer js --------//
    function makeTimer() {
      // Kiểm tra sự tồn tại của các element trước khi thao tác
      if ($("#days").length === 0 || $("#hours").length === 0 || $("#minutes").length === 0 || $("#seconds").length === 0) {
        return; // Thoát nếu không tìm thấy element
      }

      // var endTime = new Date("29 April 2018 9:56:00 GMT+01:00");  // Thời gian cũ
      var endTime = new Date("27 Sep 2025 12:56:00 GMT+07:00"); // Cập nhật thời gian mới (ví dụ)
      endTime = (Date.parse(endTime) / 1000);

      var now = new Date();
      now = (Date.parse(now) / 1000);

      var timeLeft = endTime - now;

      if (timeLeft < 0) { // Nếu thời gian đã qua
        $("#days").html("<span>EXPIRED</span>0");
        $("#hours").html("<span></span>00");
        $("#minutes").html("<span></span>00");
        $("#seconds").html("<span></span>00");
        // clearInterval(timerInterval); // Dừng interval nếu đã hết giờ (cần khai báo timerInterval bên ngoài)
        return;
      }

      var days = Math.floor(timeLeft / 86400);
      var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
      var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600)) / 60);
      var seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));

      if (hours < 10) { // Sửa lỗi so sánh chuỗi và số
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      $("#days").html("<span>Days</span>" + days);
      $("#hours").html("<span>Hours</span>" + hours);
      $("#minutes").html("<span>Minutes</span>" + minutes);
      $("#seconds").html("<span>Seconds</span>" + seconds);
    }

  // Khai báo biến interval bên ngoài để có thể clear
  var timerInterval;
  // Chỉ chạy makeTimer nếu các element tồn tại
  if ($("#days").length > 0 && $("#hours").length > 0 && $("#minutes").length > 0 && $("#seconds").length > 0) {
      timerInterval = setInterval(function () {
        makeTimer();
      }, 1000);
  }


    // click counter js (Input Number) - Đoạn này có vẻ là một plugin/cách xử lý input number riêng
    // Nó không liên quan trực tiếp đến logic AJAX của giỏ hàng chúng ta đã thêm.
    // Nếu các nút +/- của giỏ hàng (.cart_quantity_button) dùng class "input-number" thì cần xem xét lại.
    // Hiện tại, logic giỏ hàng của chúng ta dùng class riêng (.cart_quantity_up, .cart_quantity_down)
    (function() {
      window.inputNumber = function(el) {
        var min = el.attr('min') || false;
        var max = el.attr('max') || false;
        var els = {};

        els.dec = el.prev(); // Giả sử nút giảm ở ngay trước input
        els.inc = el.next(); // Giả sử nút tăng ở ngay sau input

        el.each(function() {
          init($(this));
        });

        function init(currentEl) { // Đổi tên biến để tránh nhầm lẫn với 'el' bên ngoài
          // Gắn sự kiện cho nút tăng/giảm tương ứng của currentEl
          currentEl.prev().on('click', function() { decrement(currentEl); });
          currentEl.next().on('click', function() { increment(currentEl); });
        }

        function decrement(targetEl) {
          var value = parseInt(targetEl.val()); // Lấy giá trị từ input được truyền vào
          if (isNaN(value)) value = 0;
          value--;
          if (!min || value >= parseInt(min)) {
            targetEl.val(value);
          }
        }

        function increment(targetEl) {
          var value = parseInt(targetEl.val()); // Lấy giá trị từ input được truyền vào
          if (isNaN(value)) value = 0;
          value++;
          if (!max || value <= parseInt(max)) {
            targetEl.val(value); // Sửa lỗi value++ trong gán
          }
        }
      }
    })();

    // Gọi inputNumber cho các input có class 'input-number'
    // Đảm bảo rằng các input này có cấu trúc DOM prev() là nút giảm và next() là nút tăng
    if ($('.input-number').length > 0) {
        inputNumber($('.input-number'));
    }


    // Dropdown select option (custom select)
    $('.select_option_dropdown').hide();
    $(".select_option_list").click(function (e) { // Thêm e để stopPropagation nếu cần
      e.stopPropagation(); // Ngăn sự kiện click lan ra document
      var $dropdown = $(this).parent(".select_option").children(".select_option_dropdown");
      $(".select_option_dropdown").not($dropdown).slideUp('100'); // Đóng các dropdown khác
      $dropdown.slideToggle('100');
      $(this).find(".right").toggleClass("fas fa-caret-down fas fa-caret-up"); // Đảm bảo class đúng
      // Đóng các icon của dropdown khác
      $(".select_option_list").not(this).find(".right").removeClass("fas fa-caret-up").addClass("fas fa-caret-down");
    });

    // Đóng dropdown khi click ra ngoài
    $(document).click(function() {
        $('.select_option_dropdown').slideUp('100');
        $(".select_option_list").find(".right").removeClass("fas fa-caret-up").addClass("fas fa-caret-down");
    });


    // Mixitup (Filter gallery/products)
    if ($('.new_arrival_iner').length > 0 && typeof mixitup !== 'undefined') {
      var containerEl = document.querySelector('.new_arrival_iner');
      var mixer = mixitup(containerEl, {
          // Thêm options nếu cần, ví dụ animation
          // animation: {
          //     duration: 300
          // }
      });
    }

    // Filter controls active state
    $('.controls').on('click', function(){
      $(this).addClass('active').siblings().removeClass('active');
    });


/* ----------------- Other Inner page End ------------------ */

/* ===============================================
    CART FUNCTIONALITY (Added for user/views/cart.ejs)
   =============================================== */
  $(document).ready(function() {

    // Hàm cập nhật số lượng sản phẩm
    function updateCartQuantity(productId, newQuantity, stock) { // Thêm stock vào tham số
        // Kiểm tra newQuantity hợp lệ
        if (newQuantity < 1) {
            console.log("Quantity cannot be less than 1. To remove, use the delete button.");
            // Reset input về 1 nếu người dùng cố tình nhập số nhỏ hơn
            $(`input.cart_quantity_input[data-product-id="${productId}"]`).val(1);
            // Gọi API với số lượng là 1
            newQuantity = 1;
            // return; // Không return nữa mà sẽ update với newQuantity = 1
        }
        if (newQuantity > stock) {
            alert('Quantity exceeds available stock (' + stock + '). Setting to max available.');
            newQuantity = stock;
            $(`input.cart_quantity_input[data-product-id="${productId}"]`).val(newQuantity);
        }


        $.ajax({
            url: `/cart/api/${productId}`, // Đảm bảo URL này đúng với routes của Bạn
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ qty: newQuantity }),
            success: function(response) {
                console.log('Cart updated:', response.cart);
                // Cập nhật giao diện người dùng động
                const itemRow = $(`tr[data-product-id="${productId}"]`);
                if (response.cart && response.cart.items) {
                    const updatedItem = response.cart.items.find(item => item.product.toString() === productId.toString()); // So sánh ID cẩn thận
                    if (updatedItem) {
                        itemRow.find('.item_total_price').text(`$${(updatedItem.price * updatedItem.qty).toFixed(2)}`);
                        // Cập nhật lại giá trị input nếu server có điều chỉnh (ví dụ vượt stock)
                        $(`input.cart_quantity_input[data-product-id="${productId}"]`).val(updatedItem.qty);

                    } else { // Nếu sản phẩm bị xóa do số lượng = 0 từ server (hiện tại controller không làm vậy)
                        itemRow.remove();
                    }
                    updateCartSummary(response.cart);
                }

                // Cập nhật badge giỏ hàng trên header
                if (response.cart) {
                  var cartCount = 0;
                  if (response.cart.items && Array.isArray(response.cart.items)) {
                    cartCount = response.cart.items.reduce(function(sum, item) { return sum + (item.qty || 0); }, 0);
                  }
                  if (typeof window.updateHeaderBadges === 'function') {
                    window.updateHeaderBadges(undefined, cartCount);
                  }
                }
            },
            error: function(xhr, status, error) {
                console.error('Error updating cart:', xhr.responseText);
                alert(xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'Error updating cart. Please try again.');
                // Tải lại trang để đảm bảo dữ liệu đồng bộ sau lỗi
                window.location.reload();
            }
        });
    }

    // Hàm xóa sản phẩm khỏi giỏ hàng
    function removeCartItem(productId) {
        if (!confirm('Are you sure you want to remove this item from your cart?')) {
            return;
        }
        $.ajax({
            url: `/cart/api/${productId}`, // Đảm bảo URL này đúng
            type: 'DELETE',
            success: function(response) {
                console.log('Item removed:', response.cart);
                $(`tr[data-product-id="${productId}"]`).remove();
                updateCartSummary(response.cart);

                // Kiểm tra nếu giỏ hàng trống sau khi xóa
                if (!response.cart || !response.cart.items || response.cart.items.length === 0) {
                    showEmptyCartMessage();
                }

                // Cập nhật badge giỏ hàng trên header
                if (response.cart) {
                  var cartCount = 0;
                  if (response.cart.items && Array.isArray(response.cart.items)) {
                    cartCount = response.cart.items.reduce(function(sum, item) { return sum + (item.qty || 0); }, 0);
                  }
                  if (typeof window.updateHeaderBadges === 'function') {
                    window.updateHeaderBadges(undefined, cartCount);
                  }
                }
            },
            error: function(xhr, status, error) {
                console.error('Error removing item:', xhr.responseText);
                alert(xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'Error removing item. Please try again.');
            }
        });
    }

    // Hàm cập nhật phần tóm tắt giỏ hàng
    function updateCartSummary(cartData) {
        if (cartData) {
            // Tìm hàng Subtotal và cập nhật
            $('table tbody tr').each(function() {
                const $this = $(this);
                if ($this.find('td:nth-child(2) h5').text() === 'Subtotal') { // Giả sử cột thứ 2 của hàng Subtotal có chữ "Subtotal"
                    $this.find('td:nth-child(3) h5').text('$' + cartData.itemsPrice.toFixed(2)); // Cập nhật giá trị ở cột thứ 3
                }
                // Tương tự cho Shipping và Tax nếu có cấu trúc rõ ràng hơn
                // Ví dụ, nếu có class cụ thể:
                $('.cart-summary-subtotal').text('$' + cartData.itemsPrice.toFixed(2));
                $('.cart-summary-shipping').text('$' + cartData.shippingPrice.toFixed(2));
                $('.cart-summary-tax').text('$' + cartData.taxPrice.toFixed(2));
                $('.cart-summary-total').text('$' + cartData.totalPrice.toFixed(2));


                // Fallback nếu không tìm thấy class cụ thể, dựa vào cấu trúc EJS đã cung cấp
                const subtotalRow = $('table tbody tr:has(td:contains("Subtotal"))');
                if (subtotalRow.length) {
                    subtotalRow.find('td:last-child h5').text('$' + cartData.itemsPrice.toFixed(2));
                }
                 const shippingRow = $('table tbody tr.shipping_area');
                 if(shippingRow.length){
                    // Cập nhật phần shipping và tax trong shipping_area nếu cần
                    // Ví dụ:
                    let shippingText = `Calculated at checkout: $${cartData.shippingPrice.toFixed(2)}`;
                    if (cartData.taxPrice > 0) {
                        shippingText += `<br>Tax (Est.): $${cartData.taxPrice.toFixed(2)}`;
                    }
                    shippingRow.find('.shipping_box').html(shippingText); // Giả sử có class .shipping_box
                 }


            } );


            // Nếu giỏ hàng trống, hiển thị thông báo
            if (!cartData.items || cartData.items.length === 0) {
                showEmptyCartMessage();
            } else {
                 $('.checkout_btn_inner').show(); // Hiển thị lại nút nếu giỏ hàng có đồ
            }
        }
    }

    function showEmptyCartMessage() {
        $('.cart_inner .table-responsive').html(`
            <div class="text-center section_padding" style="padding: 50px 0;">
                <h4>Your cart is currently empty.</h4>
                <p>Before proceeding to checkout you must add some products to your shopping cart.</p>
                <a href="/shop" class="btn_1" style="margin-top: 20px;">Return to shop</a>
            </div>`);
        $('.checkout_btn_inner').hide(); // Ẩn nút checkout và continue shopping ở cuối
        // Có thể ẩn cả phần coupon nếu có
        $('.bottom_button').hide();
        $('tr.shipping_area').hide();
        $('table tbody tr:has(td:contains("Subtotal"))').hide();

    }

    // Kiểm tra giỏ hàng trống khi tải trang
    if ($('.cart_inner .table-responsive tbody tr[data-product-id]').length === 0 && $('.cart_inner .table-responsive').length > 0) {
        // Điều kiện này kiểm tra xem có hàng sản phẩm nào không, và .table-responsive có tồn tại không
        // Nếu không có sản phẩm nào và trang không phải là trang báo lỗi "cart is empty" từ server
        if ($('.cart_inner .text-center:contains("Your cart is currently empty")').length === 0) {
             showEmptyCartMessage();
        }
    }


    // Sự kiện click nút tăng số lượng
    // Sử dụng event delegation cho các phần tử được thêm động (nếu có)
    $('.cart_inner').on('click', '.cart_quantity_up', function() {
        const $input = $(this).siblings('input.cart_quantity_input');
        const productId = $input.data('product-id');
        const currentQty = parseInt($input.val());
        const stock = parseInt($(this).data('stock')); // Lấy stock từ data-stock của nút
        let newQuantity = currentQty + 1;

        if (newQuantity > stock) {
            alert('Cannot add more than available stock (' + stock + ').');
            newQuantity = stock;
        }
        $input.val(newQuantity); // Cập nhật input trước
        updateCartQuantity(productId, newQuantity, stock);
    });

    // Sự kiện click nút giảm số lượng
    $('.cart_inner').on('click', '.cart_quantity_down', function() {
        const $input = $(this).siblings('input.cart_quantity_input');
        const productId = $input.data('product-id');
        const currentQty = parseInt($input.val());
        const stock = parseInt($(this).siblings('.cart_quantity_up').data('stock')); // Lấy stock từ nút up
        let newQuantity = currentQty - 1;

        if (newQuantity < 1) {
            // Giữ ở 1, không cho giảm thêm qua nút này. Xóa bằng nút delete.
            newQuantity = 1;
        }
        $input.val(newQuantity); // Cập nhật input trước
        updateCartQuantity(productId, newQuantity, stock);
    });

    // Sự kiện thay đổi trực tiếp trên input số lượng
    let debounceTimerCart;
    $('.cart_inner').on('input', 'input.cart_quantity_input', function() { // Dùng 'input' thay cho 'change' để bắt sự kiện nhanh hơn
        clearTimeout(debounceTimerCart);
        const $input = $(this);
        const productId = $input.data('product-id');
        let newQuantity = parseInt($input.val());
        const stock = parseInt($input.closest('tr').find('.cart_quantity_up').data('stock')); // Lấy stock từ nút up trong cùng hàng

        if (isNaN(newQuantity)) { // Nếu người dùng xóa hết số hoặc nhập chữ
            // Không làm gì cả, đợi người dùng nhập số hợp lệ hoặc blur
            return;
        }

        if (newQuantity < 1) {
            // $input.val(1); // Không tự sửa ở đây, để hàm updateCartQuantity xử lý
            // newQuantity = 1;
             // Cho phép người dùng gõ số 0, nhưng khi blur hoặc gửi request sẽ xử lý
        }
        if (newQuantity > stock) {
            // $input.val(stock); // Không tự sửa ở đây
            // newQuantity = stock;
        }

        debounceTimerCart = setTimeout(function() {
            // Kiểm tra lại giá trị sau khi debounce
            let finalQuantity = parseInt($input.val());
            if (isNaN(finalQuantity) || finalQuantity < 1) finalQuantity = 1; // Nếu vẫn rỗng hoặc < 1, đặt là 1
            if (finalQuantity > stock) finalQuantity = stock;
            $input.val(finalQuantity); // Cập nhật input lần cuối trước khi gửi
            updateCartQuantity(productId, finalQuantity, stock);
        }, 750); // Tăng debounce time một chút
    });
     // Xử lý khi blur khỏi input để đảm bảo giá trị cuối cùng là hợp lệ
    $('.cart_inner').on('blur', 'input.cart_quantity_input', function() {
        clearTimeout(debounceTimerCart); // Hủy debounce nếu có
        const $input = $(this);
        const productId = $input.data('product-id');
        let newQuantity = parseInt($input.val());
        const stock = parseInt($input.closest('tr').find('.cart_quantity_up').data('stock'));

        if (isNaN(newQuantity) || newQuantity < 1) {
            newQuantity = 1;
        }
        if (newQuantity > stock) {
            newQuantity = stock;
        }
        $input.val(newQuantity); // Cập nhật lại input cho đúng
        // Gọi updateCartQuantity nếu giá trị đã thay đổi so với lần update cuối
        // Để đơn giản, có thể gọi luôn, hoặc kiểm tra xem có cần thiết không
        updateCartQuantity(productId, newQuantity, stock);
    });


    // Sự kiện click nút xóa sản phẩm
    $('.cart_inner').on('click', '.cart_delete', function() {
        const productId = $(this).data('product-id');
        removeCartItem(productId);
    });

  }); // End Cart Functionality $(document).ready()

// Wishlist (heart) button AJAX
$(document).on('click', '.wishlist-btn, .wishlist-heart-btn', function(e) {
    e.preventDefault();
    var $btn = $(this);
    var productName = $btn.data('product-name');
    $.ajax({
        url: '/products/wishlist/toggle',
        method: 'POST',
        data: { productName: productName },
        success: function(res) {
            if (res.success) {
                $btn.toggleClass('active', res.action === 'added');
                if (typeof res.wishlistCount !== 'undefined') {
                    window.updateHeaderBadges(res.wishlistCount);
                }
            } else {
                alert(res.message || 'Có lỗi xảy ra!');
            }
        },
        error: function(xhr) {
            if (xhr.status === 401) {
                window.location.href = '/auth/login';
            } else {
                alert('Có lỗi xảy ra!');
            }
        }
    });
});

// Add to cart from wishlist (AJAX, global)
$(document).on('click', '.wishlist-add-to-cart-btn', function(e) {
    e.preventDefault();
    var $btn = $(this);
    var productID = $btn.data('product-id');
    var type = $btn.data('type');
    var size = $btn.data('size');
    var orderNumber = parseInt($btn.data('order-number')) || 1;
    if (!productID || !type || !size) {
      alert('Thiếu thông tin sản phẩm (ID, loại, size). Vui lòng kiểm tra lại!');
      return;
    }
    $.ajax({
      url: '/cart/add',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ productID: productID, type: type, size: size, orderNumber: orderNumber }),
      success: function(res) {
        if (res.success) {
          // Hiển thị thông báo thành công, có thể cập nhật icon giỏ hàng ở header nếu muốn
          if (window.updateCartIcon) window.updateCartIcon();
          $btn.addClass('added');
          $btn.html('<i class="fas fa-check"></i>');
          setTimeout(function() {
            $btn.removeClass('added');
            $btn.html('<i class="fas fa-cart-plus"></i>');
          }, 1200);
        } else {
          alert(res.message || 'Không thể thêm vào giỏ hàng.');
        }
      },
      error: function(xhr) {
        if (xhr.status === 401) {
          window.location.href = '/auth/login';
        } else {
          alert('Có lỗi xảy ra khi thêm vào giỏ hàng!');
        }
      }
    });
});

// Hàm cập nhật số lượng badge trên header (dùng cho ::before)
window.updateHeaderBadges = function(wishlistCount, cartCount) {
  var $wishlist = $('.favorit-items');
  var $cartCard = $('.shopping-card');
  if (typeof wishlistCount !== 'undefined') {
    $wishlist.attr('favourite-count', wishlistCount > 0 ? wishlistCount : '');
  }
  if (typeof cartCount !== 'undefined') {
    $cartCard.attr('cart-count', cartCount > 0 ? cartCount : '');
  }
};

// Custom message auto-hide and close logic
$(document).ready(function() {
  // Hiển thị hiệu ứng fade in
  $('.custom-message').addClass('show');

  // Tự động ẩn sau 2.5s
  setTimeout(function() {
    $('.custom-message').each(function() {
      $(this).removeClass('show');
      setTimeout(() => $(this).remove(), 500); // Xóa khỏi DOM sau hiệu ứng
    });
  }, 2500);

  // Đóng thủ công
  $(document).on('click', '.custom-message-close', function() {
    var $msg = $(this).closest('.custom-message');
    $msg.removeClass('show');
    setTimeout(() => $msg.remove(), 500);
  });
});

// Gợi ý sản phẩm khi nhập từ khóa tìm kiếm (cho cả header và sidebar)
$(document).ready(function() {
  $("input[name='keyword']").each(function(idx, el) {
    var $searchInput = $(el);
    // Tạo box gợi ý riêng cho mỗi input
    var suggestBoxId = 'search-suggest-box-' + idx;
    var $suggestBox = $('<div></div>')
      .attr('id', suggestBoxId)
      .addClass('search-suggest-box')
      .css({
        position: 'absolute',
        background: '#fff',
        border: '1px solid #ddd',
        zIndex: 1000,
        display: 'none',
        maxHeight: '320px',
        overflowY: 'auto',
        borderRadius: '12px',
        boxShadow: '0 4px 16px #0001',
        padding: '0.5rem 0',
        minWidth: $searchInput.outerWidth()
      });
    // Thêm vào body để định vị tuyệt đối
    $('body').append($suggestBox);
    function updateSuggestBoxPosition() {
      var offset = $searchInput.offset();
      $suggestBox.css({
        top: offset.top + $searchInput.outerHeight() + 2,
        left: offset.left,
        minWidth: $searchInput.outerWidth()
      });
    }
    $searchInput.on('input focus', function() {
      var keyword = $searchInput.val().trim();
      updateSuggestBoxPosition();
      if (keyword.length < 2) {
        $suggestBox.hide();
        return;
      }
      $.get('/products/search', { q: keyword }, function(data) {
        if (data && data.length > 0) {
          var html = data.map(function(p) {
            return `<div class='suggest-item' style='padding:8px 18px;cursor:pointer;display:flex;align-items:center;'>
              <img src='${p.image}' style='width:36px;height:36px;object-fit:cover;border-radius:6px;margin-right:12px;'>
              <span>${p.name}</span>
            </div>`;
          }).join('');
          $suggestBox.html(html).show();
        } else {
          $suggestBox.html('<div style="padding:10px 18px;color:#888;">Không có gợi ý</div>').show();
        }
      });
    });
    $suggestBox.on('click', '.suggest-item', function() {
      var name = $(this).find('span').text();
      $searchInput.val(name);
      $suggestBox.hide();
      $searchInput.closest('form').submit();
    });
    $(window).on('resize scroll', updateSuggestBoxPosition);
    $(document).on('click', function(e) {
      if (!$(e.target).closest($searchInput).length && !$(e.target).closest($suggestBox).length) {
        $suggestBox.hide();
      }
    });
  });
});

})(jQuery);
