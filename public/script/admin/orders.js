var url;
var modal = document.getElementById('detail-modal');
modal.addEventListener('show.bs.modal', function (event) {
    // Button that triggered the modal
    var button = event.relatedTarget
    // Extract info from data-bs-* attributes
    var recipient = button.getAttribute('data-bs-whatever');
    url = '/admin/orders/' + recipient;
    fetch(url)
        .then(res => res.json())
        .then(json => {
            var items_container = document.getElementById('items');
            let table = document.createElement('table');
            table.setAttribute("class", 'details table-success table-hover table table-striped mb-3 align-middle');

            let thead = document.createElement('thead');
            let tr = document.createElement('tr');
            let th1 = document.createElement('th');
            let th2 = document.createElement('th');
            let th3 = document.createElement('th');
            th1.innerHTML = "Book's Name";
            th2.innerHTML = "Price";
            th3.innerHTML = "Quantity";
            tr.appendChild(th1);
            tr.appendChild(th2);
            tr.appendChild(th3);
            thead.appendChild(tr);
            table.appendChild(thead);
            let tbody = document.createElement('tbody');
            json.items.forEach(item => {
                let tr2 = document.createElement('tr');
                let td1 = document.createElement('td');
                td1.innerHTML = item.bookID.name;
                tr2.appendChild(td1);
                let td2 = document.createElement('td');
                td2.innerHTML = item.bookID.price;
                td2.setAttribute("class", "text-center");
                tr2.appendChild(td2);
                let td3 = document.createElement('td');
                td3.innerHTML = item.quantity;
                td3.setAttribute("class", "text-center");
                tr2.appendChild(td3);
                tbody.appendChild(tr2);
            })
            table.appendChild(tbody);
            items_container.appendChild(table);
            document.getElementById("fullName").innerHTML = "Customer: " + json.shippingDetails.fullName;
            document.getElementById("address").innerHTML = "Address: " + json.shippingDetails.address;
            document.getElementById("address2").innerHTML = "Address 2: " + json.shippingDetails.address2;
            document.getElementById("tel").innerHTML = "Telephone: " + json.shippingDetails.tel;
            document.getElementById("city").innerHTML = "City: " + json.shippingDetails.city;
            document.getElementById("zipCode").innerHTML = "Zip Code: " + json.shippingDetails.zipCode;

            document.getElementById("card-number").innerHTML = "Credit Card: " + json.paymentDetails.creditCard;
            document.getElementById("card-name").innerHTML = "Card Name: " + json.paymentDetails.cardName;
            var date = new Date(json.paymentDetails.expiredDate);
            document.getElementById("expired-date").innerHTML = "Expired Date: " + date.toDateString();
        })
})

function alertAndRefresh(message) {
    if (!alert(message)) { window.location.reload(); }
}

function clearDisplay() {
    var items_container = document.getElementById('items');
    items_container.innerHTML = "";

    let h5 = document.createElement('h5')
    h5.setAttribute('class', 'mb-3');
    h5.innerHTML = "Items";
    items_container.appendChild(h5);
}
function setStatus(status) {
    var data = { status: status };
    fetch(url, {
        method: 'PUT',
        body: JSON.stringify({ data }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(() => {
            alertAndRefresh(status + " order successfully!");
        })
        .catch(err => {
            alertAndRefresh("Error: " + err);
        })
}
