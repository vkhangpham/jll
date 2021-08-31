$(function () {
    if ($('.bbb_viewed_slider').length) {
        var viewedSlider = $('.bbb_viewed_slider');

        viewedSlider.owlCarousel(
            {
                loop: true,
                margin: 30,
                autoplay: true,
                autoplayTimeout: 6000,
                nav: false,
                dots: false,
                responsive:
                {
                    0: { items: 1 },
                    575: { items: 2 },
                    768: { items: 3 },
                    991: { items: 4 },
                    1199: { items: 6 }
                }
            });
    }
});


$('.bbb_viewed_prev').on('click', function () {
    var next = $(this);
    var slider = next.parent().parent().parent().find('.bbb_viewed_slider');
    slider.trigger('next.owl.carousel');
})

$('.bbb_viewed_next').on('click', function () {
    var prev = $(this);
    var slider = prev.parent().parent().parent().find('.bbb_viewed_slider');
    slider.trigger('prev.owl.carousel');
})