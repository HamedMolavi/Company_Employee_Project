$('form').submit(function (e) {
    e.preventDefault();
    const form = e.target;
    sendForm(form)
        .then(result => {
            alert2(result.message || 'logged in successfully', !!result.message ? 'danger' : 'success');
            !!result.redirected
                ? setTimeout(() => {
                    window.location.href = result.url;
                }, 1525) : null;
        })
        .catch(err => {
            alert('something went wrong', 'danger');
            console.log(err);
        });

});

