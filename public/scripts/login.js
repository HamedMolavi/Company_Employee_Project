$('#rememberMe').on('click', () => {
    $('#rememberMe').val($('#rememberMe').prop('checked'));
});


$('form').submit(function (e) {
    e.preventDefault();
    const form = e.target;
    sendForm(form, { Redirect: 'manual' })
        .then(result => {
            alert2(... !!result.success ? ['logged in successfully', 'success']
                : result.status === 401
                    ? ['Wrong username or password!', 'danger']
                    : ['Something went wrong!', 'danger']);
            setTimeout(() => {
                window.location.href = result.url;
            }, 1525);
        })
        .catch(err => {
            alert('something went wrong', 'danger');
            console.log(err);
        });

});

