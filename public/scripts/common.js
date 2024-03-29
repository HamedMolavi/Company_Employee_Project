$('.Modal').click(function (e) {
    if (!!e.target.id.match('Modal')) {
        $(this).removeClass('top-0');
        setTimeout(() => clearModal(e.target.id), 250);
    };
});

$('.Modal').on('click', 'input[type=text]', function () { this.select(); });

let myTimeout = setTimeout(null, 1);
let myTimeout2 = setTimeout(null, 1);
function sendForm(form, addOptions) {
    return new Promise((resolve, reject) => {
        let formData = new FormData(form);
        let data;
        let url;
        let options = {
            method: form.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        for (const key in addOptions) {
            if (Object.hasOwnProperty.call(addOptions, key)) {
                options[key] = addOptions[key];
            };
        };
        if (form.method.toUpperCase() === "GET" || !form.method) {
            url = [form.action, '?'];
            for (const [key, value] of formData) {
                url.push(key, '=', value, '&');
            };
            url = url.join('');
        } else {
            data = {};
            for (const [key, value] of formData) {
                data[key] = value;
            };
            options.body = JSON.stringify(data);
            url = form.action;
        };
        // Handle redirection
        if (addOptions.Redirect === 'manual') url += form.method.toUpperCase() === "GET" ? `redirect=manual` : `?redirect=manual`
        fetch(url, options)
            .then((response) => asyncreturnHttpResponse(response, {Redirect: addOptions.Redirect || 'follow'}))
            .then(data => {
                return resolve(data);
            })
            .catch((error) => {
                return reject(error);
            });
        ;
    });

};

function alert(message, alertClass) {
    clearTimeout(myTimeout);
    $('.alert').removeClass('d-none');
    $('.alert').addClass(`alert-${alertClass}`);
    $('#alertText').text(message);
    myTimeout = setTimeout(function () {
        $('.alert').addClass('d-none');
        $('.alert').removeClass(`alert-${alertClass}`);
    }, 4000);
};

function closeAlert() {
    clearTimeout(myTimeout);
    $('.alert').addClass('d-none');

};

function alert2(message, alertClass) {
    clearTimeout(myTimeout2);
    $('#alert2').addClass('active2');
    $('#alert2').addClass(`bg-${alertClass}`);
    $('#alertText2').text(message);
    myTimeout2 = setTimeout(function () {
        $('#alert2').removeClass('active2');
        $('#alert2').removeClass(`bg-${alertClass}`);
    }, 4000);
};

function confirm([title, prompt, alertMessage, alertClass], cbPromise) {
    $('#confirmTitle').text(title);
    $('#confirmPrompt').text(prompt);
    $('#confirmModalBtn').on('click', () => {
        cbPromise().then((successMessage) => {
            $('#confirmModal').removeClass('top-0');
            $('#confirmTitle').text("Title");
            $('#confirmPrompt').text("Ask Your Question");
            $('#confirmModalBtn').off('click');
            alert2(successMessage, 'success');
        }).catch(() => {
            alert2(alertMessage || "Something went wrong!", alertClass || "danger");
        });
    });
    $('#confirmModal').addClass('top-0');
};

async function asyncreturnHttpResponse(response, options = { Redirect: 'follow' }) {
    switch (response.status) {
        case 200:
            if (response.redirected) response.status = 302;
            else {
                res = await response.json();
                return { success: true, ...res }
            };
        case 301:
        case 302:
        case 303:
        if (options.Redirect === 'follow') return window.location.href = response.url;
        if (options.Redirect === 'manual') return { success: true, url: response.url };
        case 400: // Bad request
        case 401: // Not Authorized
        case 404: // Not Found
        case 406: // Not Acceptable
            return { success: false, status: parseInt(response.status) };
        case 403: // Forbidden
            return; // not implemented
        case 421: // Misdirected Request
            return; // not implemented
        case 429: // Too Many Requests
            return; // not implemented
        case 500 || 501: // Internal Server Error
            return window.location.href = '/error';
        case 502: // Bad Gateway
            return; // not implemented
        default: // ERROR?
            return;// not implemented
    };
};


function getCookie(name) {
    const arr = document.cookie.split('=');
    const pos = arr.indexOf(name) + 1;
    return !!pos ? arr[pos] : null
};