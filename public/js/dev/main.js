$(function() {
    var $socket = io.connect();
    var $messageForm = $('#messageForm');
    var $message = $('#message');
    var $chat = $("#chat");
    var $messageArea = $('#messageArea');
    var $userFormArea = $('#userFormArea');
    var $userForm = $('#userForm');
    var $users = $('#users');
    var $username = $('#username');

    $messageForm.submit(function(e) {
        e.preventDefault();

        $socket.emit('send message',$message.val());
        $message.val('');
    });

    $socket.on("new message", function(data) {
        console.log(data.msg);
        $chat.append('<div class="well message">'+'<p class="messageBox"><span class="username">'+ data.user +':</span>'+' <span class="messageTxt">'+ data.msg +'</span></p></div>');
    });

    $userForm.submit(function(e) {
        e.preventDefault();

        $socket.emit('new user', $username.val(), function(data) {
            if(data) {
                $userFormArea.hide();
                $messageArea.show();
            }
        });
        $username.val('');
    });

    $socket.on('get users', function(data) {
        var html = '';
        var users = data.users;
        for(var i = 0; i < users.length; i++) {
            html += '<li class="list-group-item">'+users[i]+'</li>';
        }
        $users.html(html);
    })

});
