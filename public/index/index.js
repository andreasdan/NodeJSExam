$(document).ready(() => {
    fetch('/fetch/boards')
        .then(response => response.json())
        .then(boards => {
            boards.forEach(board => {
                $('#boards').append('<tr>')
                $('#boards').append('<td><a href="/board/' + board.url + '">' + board.title + '</a></td>');
                $('#boards').append('<td><span>' + board.threads + '</span></td>');
                $('#boards').append('</tr>');
            });
        });
});