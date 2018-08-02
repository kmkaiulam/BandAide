'use strict'

function disableNewInput(){
    $('#js-signup-form :input').prop('readonly',true);
    $('#js-signup-btn').prop('disabled',true);
}

function clearForm(){ 
    $(':input').val('');
}

function listenSignupSubmit(){
    $('#js-signup-form').submit(event =>{
        event.preventDefault();
        const settings = {
            url: '/api/users/',
            data:{
                'firstName': $('#firstName').val(),
                'lastName': $('#lastName').val(),
                'username': $('#username').val(),
                'password': $('#password').val(),
                },
            dataType: 'json',
            type: 'POST',
            success: function(res){
                disableNewInput();
                $('#js-response-message').html(`<div class = 'text-success bg-dark'> New user successfully created <a href = '/login'> Login </a></div>`);
            },
            error: function (res){
                let errorMessage = res.responseJSON.message;
                $('#js-response-message').html(`<div class = 'text-danger bg-dark'> ${errorMessage}</div>`);
                clearForm();
            }
        }
        $.ajax(settings);
    });
}
$(listenSignupSubmit);