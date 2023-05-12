function addEmployeeTableData(parent, data) {
    $(parent).append('<tr id="youNeverSetThis"></tr>');
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
    <td>
        <img src="${!!data.avatar ? data.avatar : data.gender === 'male' ? "https://bootdey.com/img/Content/user_1.jpg" : "https://bootdey.com/img/Content/user_2.jpg"}" alt="User Profile">
        <a target="_blank" rel="noopener noreferrer" href="${data.website || '#'}" class="user-link fs-4">${data.firstname} ${data.lastname}</a>
        <span class="user-subhead">${data.role}</span>
    </td>
`);
    //================================================
    //              More information
    //================================================
    $('#youNeverSetThis').append(`
    <td class="text-center">
        <a href="javascript:load('employee', 'companyname=${data.companies[0].companyname}');">${data.companies[0].companyname}</a>
    </td>
    <td class="text-center">
        <span class="label label-${day ? 'primary' : 'default'}">${data.nationalID}</span>
    </td>
`);

    //================================================
    //                      Settings
    //================================================
    $('#youNeverSetThis').append(`
    <td class="text-end pe-4 d-flex justify-content-center">
    <div id="info-${data._id}" class="email" onclick="this.classList.add('expand')">
    <div class="from">
        <div class="from-contents">
            <a href="#" class="table-link text-warning">
                <span class="fa-stack">
                    <i class="fa fa-square fa-stack-2x"></i>
                    <i class="fa fa-search-plus fa-stack-1x fa-inverse"></i>
                </span>
            </a>
        </div>
    </div>
    <div class="to">
        <div class="to-contents">
            <div class="top">
                <div class="avatar-large me">
                <img src="${!!data.avatar ? data.avatar : data.gender === 'male' ? "https://bootdey.com/img/Content/user_1.jpg" : "https://bootdey.com/img/Content/user_2.jpg"}">
                </div>
                <div class="name-large">${data.firstname} ${data.lastname}</div>
                <div class="x-touch"
                    onclick="$('#info-${data._id}').removeClass('expand');event.stopPropagation();">
                    <div class="x">
                        <div class="line1"></div>
                        <div class="line2"></div>
                    </div>
                </div>
            </div>
            <div class="d-flex flex-column bg-light p-2 gap-4">
                <div class="row">
                <p class="text-center fs-6">${data.about}</p>
                </div>
                <div class="row">
                </div>
            </div>
        </div>
    </div>
</div>
        <a href="javascript:openEmployeeModal('${data._id}');" class="table-link text-info">
            <span class="fa-stack">
                <i class="fa fa-square fa-stack-2x"></i>
                <i class="fa fa-pencil fa-stack-1x fa-inverse"></i>
            </span>
        </a>
        <a href="javascript:deleteThis('${data._id}', 'employee');" class="table-link danger">
            <span class="fa-stack">
                <i class="fa fa-square fa-stack-2x"></i>
                <i class="fa fa-trash-o fa-stack-1x fa-inverse"></i>
            </span>
        </a>
    </td>
`);

    $('#youNeverSetThis').attr('id', data._id);
};
