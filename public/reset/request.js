$(document).ready(() => {
    $('form').submit(e => {
        e.preventDefault();
        let email = $('#email').val();

        if (email) {
            
            $('#email').val('');

            $.ajax({
                contentType: 'application/json',
                data: JSON.stringify({
                    "email": email
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
                url: '/request'
            });

        } else {
            $('#alert').addClass('alert alert-danger');
            $('#alert').text('Please fill out all the fields');
        }
    });
});