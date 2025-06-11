// Hiệu ứng chuyển cảnh login/register sử dụng animate.css
$(document).ready(function() {
    // Chuyển sang trang đăng ký
    $('#gotoRegister').on('click', function(e) {
        e.preventDefault();
        $('.login_part_form').addClass('animate__animated animate__fadeOutLeft');
        $('.login_part_text').addClass('animate__animated animate__fadeOutRight');
        setTimeout(() => {
            window.location.href = $(this).attr('href');
        }, 600);
    });
    // Chuyển sang trang đăng nhập
    $('#gotoLogin').on('click', function(e) {
        e.preventDefault();
        $('.login_part_form').addClass('animate__animated animate__fadeOutLeft');
        $('.login_part_text').addClass('animate__animated animate__fadeOutRight');
        setTimeout(() => {
            window.location.href = $(this).attr('href');
        }, 600);
    });
    // Hiệu ứng khi submit form (chỉ animate, không redirect tự động)
    $('.login_part_form form').on('submit', function() {
        $('.login_part_form').addClass('animate__animated animate__fadeOutLeft');
        $('.login_part_text').addClass('animate__animated animate__fadeOutRight');
    });
});
