function proceed() {
    var shippingDetails = {};
    shippingDetails.fullName = document.getElementById('fullName').value;
    shippingDetails.tel = document.getElementById('tel').value;
    shippingDetails.address = document.getElementById('address').value;
    shippingDetails.address2 = document.getElementById('address2').value;
    shippingDetails.zipCode = document.getElementById('zipCode').value;
    shippingDetails.city = document.getElementById('city').value;
    $.post('/checkout/shipping',
        {
            shippingDetails: JSON.stringify(shippingDetails)
        },
        function () {
            window.location.replace("/checkout/payment");
        }
    );
}

function checkForm()
{
    var elements = $('input.input-check');

    var cansubmit= true;
    for(var i = 0; i < elements.length; i++)
    {
        if(elements[i].value.length == 0 && elements[i].type != "button")
        {
            cansubmit = false;
        }

    }
    if (cansubmit) {
        $("#next-button").prop('disabled', false).css("pointer-events", "auto");
    } else {
        $("#next-button").prop('disabled', true).css("pointer-events", "none");
    } 
};