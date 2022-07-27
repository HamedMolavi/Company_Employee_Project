
$(document).ready(function () {
    console.log('Document Reading...');
});

function load(mode, searchBy) {
    $('#navbarSupportedContent ul li').removeClass("active");
    $(`#${mode}Link`).parent().addClass("active");
    move();
    if (mode === "dashboard") {
        return;
    };
    let searchFetch = '/admin/' + mode;

    !!searchBy
        ? searchFetch += '?' + searchBy
        : null;
    console.log(searchFetch);
    fetch(searchFetch)
        .then(response => response.json())
        .then(data => {
            arrangeTable(mode, data.results);
        })
        .catch(err => {
            console.log(err);
            alert2("Something went Wrong :(", 'danger')
        });
    ;
};


function arrangeTable(mode, data) {
    setTable(mode, $('#tableWrapper'));
    if (!!data) {
        if (mode === 'company') {
            addTableHeader($('#table > thead'), ['ID', 'Company', 'Created', 'Telephone', `<i class="fas fa-cog fa-spin"></i>`]);
            for (const company of data) {
                addCompanyTableData($('#table > tbody'), company);
            };
            // addPagination($('#tableWrapper'), 3);
            return;
        };
        addTableHeader($('#table > thead'), ['ID', 'User', 'Company', 'National ID', `<i class="fas fa-cog fa-spin"></i>`]);
        for (const employee of data) {
            addEmployeeTableData($('#table > tbody'), employee);
        };
    };
};