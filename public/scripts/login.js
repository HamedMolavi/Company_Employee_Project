$('form').submit(function (e) {
    const form = e.target;
    e.preventDefault();
    sendForm(form)
        .then(result => {
            alert2(result.message || 'logged in successfully', !!result.message ? 'danger' : 'success');
            !!result.ticket
                ? setTimeout(() => {
                    window.location.href = `login/dashboard?ticket=${result.ticket}`;
                }, 1525) : null;
        })
        .catch(err => {
            alert('something went wrong', 'danger');
            console.log(err);
        });

});

