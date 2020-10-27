$(document).ready(() => {
    const key = window.location.href.split('/').slice(-1)[0];
    $('form').submit((e) => {
        e.preventDefault();
        let newPassword = $('#newPassword').val();
        let repeatPassword = $('#repeatPassword').val();

        if (newPassword && repeatPassword) {
            if (newPassword !== repeatPassword) {
                return $('#alert').text('Passwords do not match.');
            }

            $('#newPassword').val('');
            $('#repeatPassword').val('');

            $.ajax({
                contentType: 'application/json',
                data: JSON.stringify({
                    "newPassword": newPassword,
                    "repeatPassword": repeatPassword
                }),
                dataType: 'text',
                success: (data) => {
                    let response = JSON.parse(data)['response'];
                    $('#alert').addClass('alert alert-success');
                    $('#alert').text(response);
                },
                error: (jqXHR) => {
                    let errorMessage = JSON.parse(jqXHR.responseText)['response'];
                    $('#alert').addClass('alert alert-danger');
                    $('#alert').text(errorMessage);
                },
                processData: false,
                type: 'POST',
                url: '/reset/' + key
            });

        } else {
            $('#error').addClass('alert alert-danger');
            $('#error').text('Please fill out all the fields');
        }
    });
});