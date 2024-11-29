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

// Check Multi
const checkboxMulti = document.querySelector("#checkbox-multi");
if (checkboxMulti) {
    const inputCheckAll = document.querySelector("input[name='check-all']");
    const inputId = document.querySelectorAll("input[name='id']");

    // Check all
    inputCheckAll.addEventListener("click", function () {
        if (this.checked) {
            inputId.forEach(item => {
                item.checked = true;
            });
        }
        else {
            inputId.forEach(item => {
                item.checked = false;
            });
        }
    });

    // Check one
    inputId.forEach(input => {
        input.addEventListener("click", function () {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
            console.log(inputId.length);
            inputCheckAll.checked = countChecked == inputId.length ? true : false;
        })
    })
}
// End Check Multi

// Form Change Multi
const formChangeMulti = document.querySelector("#form-change-multi");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", function (e) {
        e.preventDefault();
        const checkedList = document.querySelectorAll("input[name='id']:checked");

        const type = e.target.elements.type.value;
        if (type == "delete-all") {
            const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm này?");

            if (!isConfirm) {
                return;
            }
        }

        if (checkedList.length > 0) {
            let ids = [];
            checkedList.forEach(item => {
                const id = item.value;

                if (type == "change-position") {
                    const position = item.closest("tr").querySelector("input[name='position']").value;
                    ids.push(`${id}-${position}`);
                    console.log(`${id}-${position}`);
                }
                else {
                    ids.push(id);
                }
            });
            const inputIds = formChangeMulti.querySelector("input[name='ids']");
            inputIds.value = ids.join(", ");
            formChangeMulti.submit();
        }
        else {
            alert("Vui lòng chọn ít nhất 1 bản ghi!");
        }

    })
}
// End Form Change Multi

// Delete Product
const buttonsDelete = document.querySelectorAll("[button-delete]");
if (buttonsDelete.length > 0) {
    const formDelete = document.querySelector("#form-delete-product");
    const path = formDelete.getAttribute("path");

    buttonsDelete.forEach(button => {
        button.addEventListener("click", function () {
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");

            if (isConfirm) {
                const id = this.getAttribute("data-id");
                const action = `${path}/${id}?_method=DELETE`;

                formDelete.action = action;
                formDelete.submit();
            }
        })
    })
}
// End Delete Product

// Picture Preview
const uploadImg = document.querySelector("[upload-image]");
if (uploadImg) {
    const uploadImgInput = uploadImg.querySelector("[upload-img-input]");
    const uploadImgPreview = uploadImg.querySelector("[upload-img-preview]");

    uploadImgInput.addEventListener("change", (e) => {
        const [file] = e.target.files;
        if (file) {
            uploadImgPreview.src = URL.createObjectURL(file);
        }
    })
}
// End Picture Preview

// Sort
const sort = document.querySelector("[sort]");
if (sort) {
    const sortSelect = sort.querySelector("[sort-select]");
    const sortClear = sort.querySelector("[sort-clear]");
    const url = new URL(window.location.href);

    sortSelect.addEventListener("change", (e) => {
        const value = e.target.value;
        const [sortKey, sortValue] = value.split("-");

        url.searchParams.set("sortkey", sortKey);
        url.searchParams.set("sortvalue", sortValue);

        window.location.href = url.href;
    });

    const sortKey = url.searchParams.get("sortkey");
    const sortValue = url.searchParams.get("sortvalue");
    if (sortKey && sortValue) {
        const sortString = `${sortKey}-${sortValue}`;
        const selectOption = document.querySelector(`option[value=${sortString}]`);
        selectOption.selected = true;
    }

    sortClear.addEventListener("click", () => {
        url.searchParams.delete("sortkey");
        url.searchParams.delete("sortvalue");
        window.location.href = url.href;
    })
}
// End Sort

