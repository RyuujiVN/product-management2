const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("path");
    buttonChangeStatus.forEach((item) => {
        item.addEventListener("click", function () {
            const status = item.getAttribute("data-status");
            const id = item.getAttribute("data-id");
            const newStatus = status == "active" ? "inactive" : "active";
            const action = path + `/${newStatus}/${id}?_method=PATCH`;

            formChangeStatus.action = action;
            formChangeStatus.submit();
        })
    })
}