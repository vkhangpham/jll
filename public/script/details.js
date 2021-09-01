function alertAndRefresh(message) {
    if (!alert(message)) { window.location.reload(); }
}

function addToCart() {
    var bookID = document.getElementById("book-id").innerHTML.replace(/(\r\n|\n|\r|\s+)/gm, "");
    var quantity = document.getElementById("qtym").value;
    $.post('/cart',
        {
            quantity: quantity,
            bookID: bookID
        },
        function (data, status) {
            alert("Add item to cart successfully!");
        }
    );
}
function submitReview() {
    var review = $("#review-text").val();
    var rating = $(".rating-section .bxs-star").length || 1;
    var url = window.location.href + "/reviews";
    $("#review-text").val("");
    $('.rating-section .bxs-star').removeClass('bxs-star').addClass('bx-star');

    $.post(url,
        {
            review: review,
            rating: rating,
        }
    ).done(() => {
        alertAndRefresh("Your review has been posted. Thank you!");
    });;

}
const ratingStars = [...document.getElementsByClassName("rating__star")];

$(document).ready(function () {
    $('.rating__star').hover(function () {
        if ($(this).hasClass('bx-star')) {
            $(this).removeClass('bx-star').addClass('bxs-star');
            $(this).prevAll(".rating__star").removeClass('bx-star').addClass('bxs-star');
            $(this).nextAll(".rating__star").removeClass('bxs-star').addClass('bx-star');
        }
        else if ($(this).hasClass('bxs-star') && !$(this).is('#final-star')) {
            $(this).prevAll(".rating__star").removeClass('bx-star').addClass('bxs-star');
            $(this).nextAll(".rating__star").removeClass('bxs-star').addClass('bx-star');
        }
    });
});

$(window).click(function () {
    $('.rating-section .bxs-star').removeClass('bxs-star').addClass('bx-star');
});
$('.rating-section').click(function (event) {
    event.stopPropagation();
});