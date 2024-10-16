module.exports = (query) => {
    const filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Dừng hoạt động",
            status: "inactive",
            class: ""
        }
    ];

    if (query.status) {
        const indexStatus = filterStatus.findIndex(item => item.status === query.status);
        filterStatus[indexStatus].class = "active";
    }
    else {
        const indexStatus = filterStatus.findIndex(item => item.status === "");
        filterStatus[indexStatus].class = "active";
    }
    return filterStatus;
}