'use strict'


function listenDemoClick(){
    $('#demo-btn').click(event => {
        event.preventDefault();
        const settings = {
            url: '/api/auth/login/',
            data:{
                'username': 'Guest',
                'password': 'Password'
            },
            dataType: 'json',
            type: 'POST',
            success: function(){
                console.log('success');
                window.location.replace('/home');
            }
        }
        return $.ajax(settings)
            .fail(function (err){
                console.log(err);
            });
    });
}
$(listenDemoClick);