function alertAndRefresh(message) {
    if (!alert(message)) { window.location.reload(); }
}
async function updateCart() {
    var ids_nodes = [...document.querySelectorAll(".ids")];
    var quantities_nodes = [...document.querySelectorAll(".qtym")];
    var ids = [], quantities = [];
    ids_nodes.forEach(node => {
        ids.push(node.innerHTML.replace(/(\r\n|\n|\r|\s+)/gm, ""));
    });
    quantities_nodes.forEach(node => {
        quantities.push(node.value);
    });
    async function updateLoop() {
        for (let i = 0; i < quantities.length; i++) {
            var url = '/cart/' + ids[i];
            var data = { quantity: quantities[i] };
            fetch(url, {
                method: 'PUT',
                body: JSON.stringify({ data }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
                .then(() => {
                })
                .catch((err) => {
                    alertAndRefresh("Error: " + err);
                })
        }
    }
    const updateSubmit = async () => {
        const result = await updateLoop()
        alertAndRefresh("Update cart successfully!");
    }
    updateSubmit();

}

$(".button_qty").on("click", function () {

    var $button = $(this);
    var oldValue = $button.parent().find("input").val();

    if ($button.text() == "+") {
        var newVal = parseInt(oldValue) + 1;
    } else {
        // Don't allow decrementing below zero
        if (oldValue > 0) {
            var newVal = parseInt(oldValue) - 1;
        } else {
            newVal = 1;
        }
    }

    $button.parent().find("input").val(newVal);
});

$(".remove").on("click", function () {
    var $button = $(this);
    var id = $button.parent().find("span").text();
    var url = '/cart/' + id;
    fetch(url, { method: 'DELETE'})
        .then(() => {
            alertAndRefresh("Remove book successfully!");
        })
        .catch((err) => {
            alertAndRefresh("Error: " + err);
        })
});