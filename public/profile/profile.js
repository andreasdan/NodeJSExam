$(document).ready(() => {
    fetch('/fetch/profile')
        .then(response => response.json())
        .then(data => {
            $('#username').text(data['username']);
            $('#role').text(data['role']);
            $('#email').text(data['email']);
            $('#postCount').text(data['postCount']);
        });
});