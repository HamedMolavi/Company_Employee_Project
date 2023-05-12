function addCompanyTableData(parent, data) {
    $(parent).append('<tr id="youNeverSetThis" class="companies-list"></tr>');
    //================================================
    //                      ID
    //================================================
    $('#youNeverSetThis').append(`
<td class="text-start">
    <span class="ps-3">${data._id}</span>
</td>`);
    //================================================
    //              Name and Information
    //================================================
    $('#youNeverSetThis').append(`
<td class="title justify-content-start">
    <div class="thumb">
        <img class="img-fluid" style="background:white;" src="${data.avatar}"
            alt="company avatar">
    </div>
    <div class="company-list-details">
        <div class="company-list-info">
            <div class="company-list-title">
                <h5 class="mb-0"><a target="_blank" rel="noopener noreferrer" class="fs-4" href="${data.website || '#'}">${data.companyname}</a></h5>
            </div>
            <div class="company-list-option">
                <ul class="list-unstyled">
                    <li><i class="far fa-registered pr-1"></i>Registeration Number: ${data.registeredNumber}</li>
                    <li><i class="fas fa-map-marker-alt pr-1"></i>${data.province}, ${data.city}</li>
                </ul>
            </div>
        </div>
    </div>
</td>
`);
    //================================================
    //              More information
    //================================================
    $('#youNeverSetThis').append(`
<td class="text-center">
<span class="company-list-time order-1">${data.createdAt.slice(0, 10)}</span>
</td>
<td class="text-center">
<span class="company-list-time order-2">${data.tel}</span>
</td>
`);

    //================================================
    //                      Settings
    //================================================
    $('#youNeverSetThis').append(`
    <td>
        <ul class="list-unstyled mb-0 d-flex justify-content-end">
            <li><a href="javascript:load('employee', 'companyname=${data.companyname}');" class="text-primary" data-toggle="tooltip" title=""
                    data-original-title="view"><i class="far fa-eye"></i></a></li>
            <li><a href="javascript:openCompanyModal('${data._id}');" class="text-info" data-toggle="tooltip" title=""
                    data-original-title="Edit"><i class="fas fa-pencil-alt"></i></a></li>
            <li><a href="javascript:deleteThis('${data._id}', 'company');" class="text-danger" data-toggle="tooltip" title=""
                    data-original-title="Delete"><i class="far fa-trash-alt"></i></a></li>
        </ul>
    </td>
`);

    $('#youNeverSetThis').attr('id', data._id);
};
