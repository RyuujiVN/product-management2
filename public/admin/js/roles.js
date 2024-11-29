// Permissions
const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
    const buttonPermissions = document.querySelector("[button-submit]");

    buttonPermissions.addEventListener("click", () => {
        const permissionsArray = [];

        const rows = tablePermissions.querySelectorAll("[data-name]");

        rows.forEach(row => {
            const name = row.getAttribute("data-name");
            const input = row.querySelectorAll("input");

            if (name === "id") {
                input.forEach(input => {
                    permissionsArray.push({
                        id: input.value,
                        permissions: []
                    })
                })
            }
            else {
                input.forEach((input, index) => {
                    const checked = input.checked;

                    if (checked) {
                        permissionsArray[index].permissions.push(name);
                    }
                })
            }
        })

        if (permissionsArray.length > 0) {
            const formChangePermissions = document.querySelector("#form-change-permissions");
            const inputChangePermissions = formChangePermissions.querySelector("input[name='permissions']");

            inputChangePermissions.value = JSON.stringify(permissionsArray);
            formChangePermissions.submit();
        }
    })
}
// End Permissions

// Permissions Default
const dataRecords = document.querySelector("[data-records]");
if (dataRecords) {
    const records = JSON.parse(dataRecords.getAttribute("data-records"));
    const tablePermissions = document.querySelector("[table-permissions]");

    records.forEach((record, index) => {
        const permissions = record.permissions;

        permissions.forEach(permission => {
            const row = tablePermissions.querySelector(`[data-name="${permission}"`);
            const input = row.querySelectorAll("input");

            input[index].checked = true;
        })
    })
}
// End Permissions Default