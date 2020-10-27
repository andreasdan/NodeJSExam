$(document).ready(() => {
    $('form').submit(e => {
        e.preventDefault();
        let username = $('#username').val();
        let password = $('#password').val();
        let repeatPassword = $('#repeatPassword').val();
        let email = $('#email').val();

        if (username && password && repeatPassword && email) {
            if (password !== repeatPassword) {
                return $('#error').text('Passwords do not match.');
            }

            //reset password values as safety
            $('#repeatPassword').val('');
            $('#email').val('');

            $.ajax({
                contentType: 'application/json',
                data: JSON.stringify({
                    "username": username,
                    "password": password,
                    "email": email
                }),
                dataType: 'text',
                success: (data, textStatus, jqXHR) => {
                    window.location.href = '/';
                },
                error: (jqXHR) => {
                    let errorMessage = JSON.parse(jqXHR.responseText)['response'];
                    $('#error').addClass('alert alert-danger');
                    $('#error').text(errorMessage);
                },
                processData: false,
                type: 'POST',
                url: '/signup'
            });

        } else {
            $('#error').addClass('alert alert-danger');
            $('#error').text('Please fill out all the fields');
        }
    });
});