let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".sidebarBtn");
sidebarBtn.onclick = function() {
    sidebar.classList.toggle("active");
    if (sidebar.classList.contains("active")) {
        sidebarBtn.classList.replace("bx-menu", "bx-menu-alt-right");
    } else
        sidebarBtn.classList.replace("bx-menu-alt-right", "bx-menu");
}

let page_title = document.getElementsByTagName("title")[0].innerText;
if (page_title != undefined && page_title != "Create Admin Account") {
    let active = document.getElementById(page_title);
    active.setAttribute("class", "active");
}