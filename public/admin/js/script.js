//Button status
const buttonStatus = document.querySelectorAll("[button-status]");

if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);
    buttonStatus.forEach(item => {
        item.addEventListener('click', function () {
            const status = this.getAttribute("button-status");
            if (status.length > 0) {
                url.searchParams.set("status", status);
            }
            else {
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        });
    });
};
//End Button status

// Search Product
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const url = new URL(window.location.href);
        const keyword = e.target.elements.keyword.value;
        if (keyword) {
            url.searchParams.set("keyword", keyword);
        }
        else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;
    })
}
// End Search Product

// Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
console.log(buttonPagination);
if (buttonPagination.length > 0) {
    const url = new URL(window.location.href);
    buttonPagination.forEach((item) => {
        item.addEventListener("click", function () {
            const page = this.getAttribute("button-pagination");
            if (page) {
                url.searchParams.set("page", page);
            }
            else {
                url.searchParams.delete("page");
            }
            window.location.href = url.href;
        })
    })
}
// End Pagination

