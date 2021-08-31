const UPLOAD_BUTTON = document.getElementById("upload-button");
const FILE_INPUT = document.querySelector("#imageFile");
const AVATAR = document.getElementById("avatar");
const current_image = AVATAR.src;
UPLOAD_BUTTON.addEventListener("click", () => FILE_INPUT.click());
FILE_INPUT.addEventListener("change", event => {
    $("#upload-image-submit").prop('disabled', false);
    const file = event.target.files[0];
    var url = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
        AVATAR.setAttribute("src", url);
    };
});

function alertAndRefresh(message) {
    if (!alert(message)) { window.location.reload(); }
}
$(window).on("load", function () {
    var current_gender = $("#current-gender").text();
    $("#" + current_gender).prop("checked", true);

});

$("#cancel-avatar").on("click", function () {
    AVATAR.setAttribute("src", current_image);
    $("#upload-image-submit").prop('disabled', true);
});

$("#save").click(function () {
    var gender = $("input[name='gender']:checked").val();
    const data = { gender: gender };
    fetch('/users',
        {
            method: 'PUT',
            body: JSON.stringify({ data }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Accept": "application/json"
            }
        })
        .then((response) => {
            alert("Update profile successfully!");
        })
        .catch((error) => {
            alertAndRefresh(error);
        })
});

$(document).ready(function() {

    $('.modal').on('hidden.bs.modal', function(event) {
        $(this).removeClass( 'fv-modal-stack' );
        $('body').data( 'fv_open_modals', $('body').data( 'fv_open_modals' ) - 1 );
    });

    $('.modal').on('shown.bs.modal', function (event) {
        // keep track of the number of open modals
        if ( typeof( $('body').data( 'fv_open_modals' ) ) == 'undefined' ) {
            $('body').data( 'fv_open_modals', 0 );
        }

        // if the z-index of this modal has been set, ignore.
        if ($(this).hasClass('fv-modal-stack')) {
            return;
        }

        $(this).addClass('fv-modal-stack');
        $('body').data('fv_open_modals', $('body').data('fv_open_modals' ) + 1 );
        $(this).css('z-index', 1040 + (10 * $('body').data('fv_open_modals' )));
        $('.modal-backdrop').not('.fv-modal-stack').css('z-index', 1039 + (10 * $('body').data('fv_open_modals')));
        $('.modal-backdrop').not('fv-modal-stack').addClass('fv-modal-stack'); 

    });        
});