function alertAndRefresh(message) {
    if(!alert(message)){window.location.reload();}
}

function updateProduct() {
    var id = document.getElementById("update-target-id").value;
    var url = '/admin/products/' + id;
    var name = document.getElementById("new-name").value,
        image = document.getElementById("new-image").value,
        author = document.getElementById("new-author").value,
        category = document.getElementById("new-category").value,
        price = document.getElementById("new-price").value,
        quantity = document.getElementById("new-quantity").value,
        format = document.getElementById("new-format").value,
        description = document.getElementById("new-description").value;
    var update = {};
    if (name != undefined && name != '') {
        update.name = name;
    }
    if (image != undefined && image != '') {
        update.image = image;
    }
    if (category != undefined && category != '') {
        update.category = category;
    }
    if (author != undefined && author != '') {
        update.author = author;
    }
    if (price != undefined && price != '') {
        update.price = price;
    }
    if (quantity != undefined && quantity != '') {
        update.quantity = quantity;
    }
    if (format != undefined && format != '') {
        update.format = format;
    }
    if (description != undefined && description != '') {
        update.description = description;
    }
    fetch(url, {
        method: 'PUT',
        body: JSON.stringify({
            update
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(() => {
        alertAndRefresh("Update product \"" + id + "\" successfully!");
    })
    .catch(err => {
        alertAndRefresh("Error updating product: " + err);
    })
};

function changeProperty() {
    var id = document.getElementById('delete-target-id').value;
    if (id == "" || id == undefined) {
        $(':button[id="delete-submit"]').prop('disabled', true);
    }
    else {
        $(':button[id="delete-submit"]').prop('disabled', false);
        var modalbody = document.getElementById('modal-message');
        modalbody.innerHTML = "Are you sure you want to delete " + id + "?";
    }
};

$("#deleteProduct").on("click", function () {
    var id = document.getElementById("delete-target-id").value;
    var url = '/admin/products/' + id;
    fetch(url, { method: 'DELETE'})
        .then(() => {
            alertAndRefresh("Delete product successfully!");
        })
        .catch((err) => {
            alertAndRefresh("Error: " + err);
        })
});

function deleteAllProducts() {
    fetch('/admin/products/', { method: 'DELETE' })
    .then(() => {
        alertAndRefresh("Delete all products successfully!");
    })
    .catch(err => {
        alertAndRefresh("Error deleting all products: " + err);
    })
}