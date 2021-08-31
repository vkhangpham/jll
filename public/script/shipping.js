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