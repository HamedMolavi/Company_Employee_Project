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
            let altsrc = '/Images/icons/companies/logo.png';
            $('#companyCompanynameEdit').val(data.results.companyname);
            $('#companyRegisteredNumberEdit').val(data.results.registeredNumber);
            $('#companyCityEdit').val(data.results.city);
            $('#companyProvinceEdit').val(data.results.province);
            $('#companyTelEdit').val(data.results.tel);
            $('#companyAvatarEdit').attr('src', data.results.avatar);
            $('#companyAvatarFile').attr('src', data.results.avatar || altsrc);
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
            let altsrc = `/Images/icons/employees/${data.results.gender === 'male' ? 'man-icon.png' : 'woman-icon.png'}`;
            $('#employeeCompanynameEdit').val(data.results.companies[0].companyname);
            $('#employeeFirstnameEdit').val(data.results.firstname);
            $('#employeeLastnameEdit').val(data.results.lastname);
            $('#employeeBirthdayEdit').val(data.results.birthday.slice(0, 10));
            $('#employeeNationalIDEdit').val(data.results.nationalID);
            $('#employeeAboutEdit').val(data.results.about);
            $('#employeeAvatarFile').attr('src', data.results.avatar || altsrc);
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
        $('#companyCompanynameEdit').val('');
        $('#companyRegisteredNumberEdit').val('');
        $('#companyCityEdit').val('');
        $('#companyProvinceEdit').val('');
        $('#companyTelEdit').val('');
        $('#companyAvatarEdit').attr('src', '/Images/icons/companies/logo.png');
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
    let data = {};
    try {
        if (!!$(`#${mode}AvatarEdit`).val()) {
            let fd = new FormData();
            fd.append('avatar', $(`#${mode}AvatarEdit`)[0].files[0]);
            var avatar = await fetch('/uploads/images/avatar', {
                method: 'POST',
                headers: {
                    'Accept': '*/*'
                },
                body: fd
            }).then(asyncreturnHttpResponse)
                .then(result => {
                    if (!result.success) throw new Error();
                    return result.results;
                });
        };
    } catch (error) {
        return alert2("Something went wrong :(", 'danger');
    };
    if (mode === 'company') {
        data = {
            id,
            companyname: $('#companyCompanynameEdit').val(),
            registeredNumber: $('#companyRegisteredNumberEdit').val(),
            province: $('#companyProvinceEdit').val(),
            city: $('#companyCityEdit').val(),
            tel: $('#companyTelEdit').val()
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
                    role: $('#employeeCheck').is(':checked') ? 'employee' : 'manager',
                    gender: $('#maleCheck').is(':checked') ? 'male' : 'female',
                }
            );
    };
    if (!data) return;
    if (!!avatar) data['avatar'] = 'uploads/images/' + avatar;
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

function updateAvatar(val) {

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
