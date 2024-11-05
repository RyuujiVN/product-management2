module.exports = (query, totalProduct) => {
    const pagination = {
        limitItem: 4,
        currentPage: 1
    }

    if (query.page) {
        pagination.currentPage = parseInt(query.page);
    }

    if (pagination.currentPage) {
        pagination.skip = (pagination.currentPage - 1) * pagination.limitItem;
    }
    else {
        pagination.skip = 0;
    }

    const totalPage = Math.ceil(totalProduct / pagination.limitItem);
    pagination.totalPage = totalPage;

    return pagination;
}