$(document).ready(() => {
    fetch('/menu')
        .then(response => response.text())
        .then(html => {
            $('body').prepend(html); //prepend to make menu appear at the top of the body
        });
});