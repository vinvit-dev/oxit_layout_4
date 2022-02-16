
$(document).ready(function(){
    $('.courses').slick({
        infinite: true,
        autoplay: true,
        autoplaySpeed: 4000,
        speed: 700,
        cssEase: 'linear',
        arrows: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
              breakpoint: 850,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                dots: true
              }
            },
            {
                breakpoint: 596,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true
                }
            }
        ]
    });

    $('.comments').slick({
        infinite: true,
        autoplay: true,
        autoplaySpeed: 10000,
        speed: 700,
        cssEase: 'linear',
        arrows: false,
        dots: true,
        fade: true,
        adaptiveHeight: true
    });

    $('.mentors').slick({
        infinite: true,
        autoplay: true,
        autoplaySpeed: 6000,
        speed: 700,
        cssEase: 'linear',
        arrows: false,
        dots: true,
        adaptiveHeight: true
    });

});

let burger_btn = document.getElementById("burger-btn");
let burger = document.getElementById("burger");

function showHideBurger() {
    if (burger.style.display === "flex") {
        burger.style.opacity = 0;
        burger.style.display = "none";
    } else {
        burger.style.display = "flex";
        for(i = 0; i <= 1; i+=0.01) {
            setTimeout(function() {
                console.log(burger.style.opacity);
                burger.style.opacity = i;
            },1000/50)
        }
    }
}

burger_btn.addEventListener("click", showHideBurger);

let burger__items = document.querySelectorAll("#burger .menu__item");
burger__items.forEach(function (item) {
    item.addEventListener("click", showHideBurger);
});