const threadId = window.location.href.split('/').slice(-1)[0];
const socket = io.connect('localhost'); //connect with sockets io to recieve push notifications

$(document).ready(() => {

    fetchData(false); //fetch posts for the first time

    document.getElementById('replyForm').action += threadId; //add thread id to replyform action in order to make the correct post request

    //set special color on post referenced in post reply link
    $(document).on('mouseover', '.post-ref', element => {
        let id = $(element.target).attr('id').replace('post-', '');
        $('#' + id).css('background-color', '#ffeaa7');
    });

    //remove special color on reply linked post
    $(document).on('mouseleave', '.post-ref', element => {
        let id = $(element.target).attr('id').replace('post-', '');
        $('#' + id).css('background-color', '#e4eedd');
    });

    //send sockets message to broadcast push notification
    $('#replyForm').on('submit', () => {
        socket.emit('push', threadId);
    })

    socket.emit('join', threadId); //join room to recieve push notifications

    // handle push message recieval
    socket.on('push', data => {
        if (data === 'fetch') {
            setTimeout(fetchData, 1000, true); //wait 1 second to make sure post has processed
            $('#push-label').addClass('alert alert-warning');
            $('#push-label').text('New post submitted!'); //update notify label
            $('#push-label').append('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
        }
    });
});

function fetchData(hasFetched) {
    fetch('/fetch/thread/' + threadId)
        .then(response => response.json())
        .then(data => {
            let header = data['header'];

            //reset header and posts html
            if (hasFetched) {
                $('h2').text(''); //reset header
                $('#posts').text(''); //reset to rebuild posts div
                $('#board-breadcrumb-link').text(''); // reset bresadcrumb text
                $('#posts').text(''); //reset posts
            }

            //append header data
            $('h2').append(header.title);
            $('title').append(header.title);

            //breadcrumbs
            $('#board-breadcrumb-link').append(header.title);
            $('#board-breadcrumb-link').attr('href', '/board/' + header.url);

            // iterate over all the posts
            data['posts'].forEach(post => {

                let content = '';

                //add post headers
                content += '<div class="post" id="' + post.id + '">';
                content += '<span id="user" class="username">' + post.username + '</span>&emsp;';
                content += '<span class="timestamp">' + new Date(post.createdAt).toUTCString() + '</span>';
                content += '<span> #' + post.id + '</span>';
                content += '<span class="link"><a href="javascript:replyToPost('+ post.id + ')">[Reply]</a></span>';
                content += '<div class="flex-wrapper">';

                //add image tag if image exists
                if (post.image) {
                    content += '<div class="image-col"><img src="/images/' + post.image + '"/></div>';
                }

                //create text column wrapper
                content += '<div class="text-col">';
                let lines = post.content.split('\n'); //split each line
                lines.forEach(line => {
                    if (line.charAt(0) === '@') { //this is a reply link
                        let id = line.split('#')[1];
                        content += '<a class="post-ref" id="post-' + id + '" href="javascript:scrollToPost(' + id + ')">' + line + '</a>'; //make scroll to post link
                    } else {
                        content += line; //just append the line as is
                    }
                    content += '<br>'; //make new line
                });

                content += '</div></div></div>'; //close tags

                $('#posts').append(content); //append the html content
            });
        });
}

//scrolls the view onto the post in the referenced link
function scrollToPost(id) {
    document.getElementById(id).scrollIntoView(true);
}

//adds reply text to reply form
function replyToPost(id) {
    let username = $('#' + id).children('#user').text();
    document.getElementById('textInput').append('@' + username + '#' + id + '\n');
    document.getElementById('textInput').scrollIntoView(true);
}