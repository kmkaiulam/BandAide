'use strict'
function clearForm(){ 
    $(':input').val('');
}

function listenLogin(){
    $('#js-login-form').submit(event =>{
        event.preventDefault();
        const settings = {
            url: '/api/auth/login/',
            data:{
                'username': $('#inputUsername').val(),
                'password': $('#inputPassword').val(),
                },
            dataType: 'json',
            type: 'POST',
            success: function(){
                console.log('success');
                window.location.replace('/');
            }
        }
        return $.ajax(settings)
            .fail(function (err){
                console.log(err);
                $('#js-response-message').html(`<div class = 'text-danger bg-dark'> Incorrect Credentials</div>`);
                clearForm();
            });
        });
}
$(listenLogin);