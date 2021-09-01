function checkout() {
    var paymentDetails = {};
    paymentDetails.creditCard = document.getElementById('creditCard').value;
    paymentDetails.cvv = document.getElementById('cvv').value;
    paymentDetails.cardName = document.getElementById('cardName').value;

    let dateString = document.getElementById('expiredDate').value;
    let mm = Number.parseInt(dateString.slice(0,2)) - 1, yy = Number.parseInt("20" + dateString.slice(3)) ;
    paymentDetails.expiredDate = new Date(yy,mm);
    $.post('/orders',
        {
            paymentDetails: JSON.stringify(paymentDetails)
        }
    )
    .done(() => {
        if (!alert("Your order has been created. Thank you for your support!")) { window.location.replace("/shop"); }
    });
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
        $("#pay-button").prop('disabled', false).css("pointer-events", "auto");
    } else {
        $("#pay-button").prop('disabled', true).css("pointer-events", "none");
    } 
};