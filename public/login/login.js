$(document).ready(() => {
    $('form').submit(e => {
        e.preventDefault();
        
        let username = $('#username').val();
        let password = $('#password').val();

        if (username && password) {

            $('#username').val('');
            $('#password').val('');

            $.ajax({
                contentType: 'application/json',
                data: JSON.stringify({
                    "username": username,
                    "password": password
                }),
                dataType: 'text',
                success: (data) => {
                    window.location.href = '/';
                },
                error: (jqXHR) => {
                    let errorMessage = JSON.parse(jqXHR.responseText)['response'];
                    $('#error').addClass('alert alert-danger');
                    $('#error').text(errorMessage);
                },
                processData: false,
                type: 'POST',
                url: '/login'
            });

        } else {
            $('#error').addClass('alert alert-danger');
            $('#error').text('Please enter your username and password to login');
        }
    });
});