$(document).on('keydown', function (e) {
    if (!!$('.Modal.top-0')) {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            $('.Modal.top-0 button').eq(0).click();
        };
        if (e.code === 'Escape') return $('.Modal.top-0').removeClass('top-0');
    };
});



function openCompanyModal(companyID) {
    fetch('/admin/company?id=' + companyID)
        .then(asyncreturnHttpResponse)
        .then(data => {
            $('#companynameEdit').val(data.results.companyname);
            $('#registeredNumberEdit').val(data.results.registeredNumber);
            $('#cityEdit').val(data.results.city);
            $('#provinceEdit').val(data.results.province);
            $('#telEdit').val(data.results.tel);
            $('#avatarFile').attr('src', data.results.avatar);
            $('#submitCompanyBtn').attr('onclick', `editThis('${data.results._id}', 'company')`);
            $('#companyModal').addClass('top-0');
        })
        .catch(err => {
            alert2("Something went Wrong :(", 'danger')
        });
    ;
};


function openEmployeeModal(employeeID) {
    fetch('/admin/employee?id=' + employeeID)
        .then(asyncreturnHttpResponse)
        .then(data => {
            $('#employeeCompanynameEdit').val(data.results.companies[0].companyname);
            $('#employeeFirstnameEdit').val(data.results.firstname);
            $('#employeeLastnameEdit').val(data.results.lastname);
            $('#employeeBirthdayEdit').val(data.results.birthday.slice(0, 10));
            $('#employeeNationalIDEdit').val(data.results.nationalID);
            $('#employeeAboutEdit').val(data.results.about);
            $('#employeeAvatarFile').attr('src', data.results.avatar);
            $('#submitEmployeeBtn').attr('onclick', `editThis('${data.results._id}', 'employee')`);
            data.results.role === 'employee' ? $('#employeeCheck').prop('checked', true) : $('#managerCheck').prop('checked', true);
            data.results.gender === 'male' ? $('#maleCheck').prop('checked', true) : $('#femaleCheck').prop('checked', true);
            $('#employeeModal').addClass('top-0');
        })
        .catch(err => {
            console.log(err);
            alert2("Something went Wrong :(", 'danger')
        });
    ;
};



function clearModal(id) {
    if (!!id.match('company')) {
        $('#companynameEdit').val('');
        $('#registeredNumberEdit').val('');
        $('#cityEdit').val('');
        $('#provincdEdit').val('');
        $('#telEdit').val('');
        $('#avatarEdit').attr('src', '/Images/icons/companies/logo.png');
        $('#submitCompanyBtn').attr('onclick', ``);
        return;
    };

    if (!!id.match('employee')) {
        $('#employeeCompanynameEdit').val('');
        $('#employeeFirstnameEdit').val('');
        $('#employeeLastnameEdit').val('');
        $('#employeeBirthdayEdit').val('');
        $('#employeeNationalIDEdit').val('');
        $('#employeeAboutEdit').val('');
        $('#employeeAvatarFile').attr('src', '/Images/icons/companies/logo.png');
        $('#submitEmployeeBtn').attr('onclick', '');
        return;
    };
    if (!!id.match('confirm')) {
        return;
    };
};


async function editThis(id, mode) {
    let data;
    if (mode === 'company') {
        data = {
            id,
            companyname: $('#companynameEdit').val(),
            registeredNumber: $('#registeredNumberEdit').val(),
            province: $('#provinceEdit').val(),
            city: $('#cityEdit').val(),
            avatar: !$('#avatarEdit').val() ? '/Images/icons/companies/logo.png' : $('#avatarEdit').val(),
            tel: $('#telEdit').val()
        };
    } else if (mode === 'employee') {
        data = await fetch('/admin/company?searchBy=' + $('#employeeCompanynameEdit').val())
            .then(asyncreturnHttpResponse)
            .then((result) => !result.success ? alert('The company you entered does not exist !', 'danger') : result.results[0])
            .then((result) => !result ? undefined
                : {
                    id,
                    id_companies: result._id,
                    firstname: $('#employeeFirstnameEdit').val(),
                    lastname: $('#employeeLastnameEdit').val(),
                    birthday: $('#employeeBirthdayEdit').val(),
                    nationalID: $('#employeeNationalIDEdit').val(),
                    about: $('#employeeAboutEdit').val(),
                    avatar: $('#employeeAvatarEdit').val(),
                    role: $('#employeeCheck').is(':checked') ? 'employee' : 'manager',
                    gender: $('#maleCheck').is(':checked') ? 'male' : 'female',
                }
            );
    };
    if (!data) return;
    fetch(`/${mode}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(asyncreturnHttpResponse)
        .then((data) => {
            if (!!data.success) {
                alert2(`${mode} editted successfully :)`, 'success');
                load(mode);
                $(`#${mode}Modal`).removeClass('top-0');
                return setTimeout(() => clearModal(`${mode}Modal`), 250);
            };
            alert("Something went wrong!", 'danger');
        })
        .catch((error) => {
            alert2("Something went Wrong :(", 'danger')
        });
};


function deleteThis(id, mode) {
    confirm(["Careful...!", `Are you sure you want to delete this ${mode}'s data?`, "deleting faild :(", 'danger'],
        () => {
            return new Promise((resolve, reject) => {
                let data = {
                    id
                };
                fetch(`/${mode}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                    .then(asyncreturnHttpResponse)
                    .then((data) => {
                        if (!!data.success) {
                            load(mode);
                            return resolve(`${mode} deleted successfully :)`)
                        };
                        return reject();
                    })
                    .catch((error) => {
                        alert2("Something went Wrong :(", 'danger')
                        return reject();
                    });
            });
        });
};
