$(document).ready(() => {
    //set board id
    let boardId = window.location.href.split('/').slice(-1)[0];
    fetch('/fetch/board/' + boardId)
        .then(response => response.json())
        .then(data => {
            //set header and breadcrumbs
            let header = data['header'];
            $('#active-breadcrumb').text(header.title);
            
            //append board id to create form's action
            document.getElementById('create-form').action += data['id'];

            // append header to doc title and h2
            $('title').append(header.title);
            $('h2').append(header.title);
            //iterate over all elements in thread json
            data['threads'].forEach(thread => {
                //append data to html elements
                $('#threads').append('<tr>')
                $('#threads').append('<td><a href="/thread/' + thread.id + '">' + thread.content + '</a></td>');
                $('#threads').append('<td><span>' + new Date(thread.createdAt).toUTCString() + '</span></td>');
                $('#threads').append('<td><span>' + new Date(thread.updatedAt).toUTCString() + '</span></td>');
                $('#threads').append('</tr>');
            });
        });
});