'use strict'
let username;
let password;
function disableNewInput(){
    $('#js-signup-form :input').prop('readonly',true);
    $('#js-signup-btn').prop('disabled',true);
}

function clearForm(){ 
    $(':input').val('');
}

function login(username, password){
        const settings = {
            url: '/api/auth/login/',
            data:{
                'username': username,
                'password': password
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
                $('#js-response-message').html(`<div class = 'text-danger bg-dark'> Incorrect Credentials</div>`);
                clearForm();
            });
        };

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
        let registerPromise = new Promise(function(resolve, reject) {
            resolve($.ajax(settings));
        });
        registerPromise.then(function (res){
          login(settings.data.username, settings.data.password)  
        });
    })
}


$(listenSignupSubmit);