$('form').submit(function (e) {
    const form = e.target;
    e.preventDefault();
    sendForm(form)
        .then(result => {
            alert2(result.message || 'logged in successfully', !!result.message ? 'danger' : 'success');
            !!result.key
                ? setTimeout(() => {
                    localStorage.setItem('token', result.key)
                    window.location.href = `login/dashboard`;
                }, 1525) : null;
        })
        .catch(err => {
            alert('something went wrong', 'danger');
            console.log(err);
        });

});

