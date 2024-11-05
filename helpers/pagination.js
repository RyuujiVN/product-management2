module.exports = (query) => {
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

    return pagination;
}