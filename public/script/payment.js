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
        window.location.replace("/shop");
    });
}