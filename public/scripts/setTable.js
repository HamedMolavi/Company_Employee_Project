function setTable(mode, parent) {
    let html;
    mode === 'company'
        ? html = `<div class="row">
                    <div class="col-md-12">
                        <div class="user-dashboard-info-box table-responsive mb-0 bg-${!!day ? 'white' : 'black'} p-4 shadow-sm">
                            <table id="table" class="table manage-companies-top mb-0 text-${!!day ? 'dark' : 'light'}">
                                <thead>
                                    <tr>
                                        <td class="text-center">
                                            <main class="noData">
                                                <span>
                                                    <p class="text-${!!day ? 'dark' : 'light'}">No Data Found :(</p>
                                                </span>
                                            </main>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>`
        : html = `
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="main-box no-header clearfix bg-${!!day ? 'white' : 'black'}">
                                <div class="main-box-body clearfix">
                                    <div class="table-responsive">
                                        <table id="table" class="table user-list text-${!!day ? 'dark' : 'light'}">
                                            <thead>
                                                <tr>
                                                    <td class="text-center">
                                                        <main class="noData">
                                                            <span class="bg-before-${!!day ? 'black' : 'white'}">
                                                                <p class="text-${!!day ? 'dark' : 'light'}">No Data Found :(</p>
                                                            </span>
                                                        </main>
                                                    </td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
    $(parent).html(html);
};




function addTableHeader(parent, headers) {
    $(parent).html('<tr id="youNeverSetThis"></tr>');
    let i = headers.length;
    let first = true;
    let second = true;
    for (const item of headers) {
        $('#youNeverSetThis').append(`<th class="${i > 1 ? first ? "text-start" : "text-center" : "text-end"}"><span>${item}</span></th>`);
        i--;
        second
            ? second = false
            : first = false;
    };
    $('#youNeverSetThis').removeAttr('id');
};



function addPagination(parent, pages) {
    let html = [`<div class="text-center mt-3 mt-sm-3">
        <ul class="pagination justify-content-center mb-0">
            <li class="page-item disabled"> <span class="page-link">Prev</span> </li>
            <li class="page-item active" aria-current="page"><span class="page-link">1 </span> <span
                    class="sr-only">(current)</span></li>`];


    for (let i = 2; i <= pages; i++) {
        html.push(`<li class="page-item"><a class="page-link" href="#">${i}</a></li>`)
    };
    html.push(`<li class="page-item"> <a class="page-link" href="#">Next</a> </li>
</ul>
</div>`);

    $(parent).append(html.join('\n'));
};
