'use strict'
console.log("this is working")
function listenSignupSubmit(){
    $('#js-signup-form').submit(event =>{
        event.preventDefault();
        const settings = {
            url: '/api/users/',
            data:{
                "firstName": $('#firstName').val(),
                "lastName": $('#lastName').val(),
                "username": $('#username').val(),
                "password": $('#password').val(),
                },
            dataType: 'json',
            type: 'POST',
            success: function(res){
                $('#js-signup-form :input').prop('readonly',true);
                $('#js-response-message').html(`<div class = "text-success bg-dark"> New user successfully created <a href = "/login"> Login </a></div>`);
                //alert('New user successfully created!')
               //window.location.replace('/login');
            },
            error: function (res){
                console.log(res);
                let errorMessage = res.responseJSON.message;
                //alert(errorMessage);
                $('#js-response-message').html(`<div class = "text-danger bg-dark"> ${errorMessage}</div>`);
                clearForm();
            }
        }
        $.ajax(settings);
    });
}
        
function clearForm(){ 
    $('#firstName').val('');
    $('#lastName').val('');
    $('#username').val('');
    $('#password').val('');
}

function handleLogin(){
    listenSignupSubmit();
}


$(handleLogin);