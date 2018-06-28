'use strict'

function listenLoginSubmit(){
    $('.js-signin-form').submit(event =>{
        event.preventDefault();
        const usernameInput =$(event.currentTarget).find('#usernameInput');
        const passwordInput = $(event.currentTarget).find('#passwordInput')
        const usernameEntry = usernameInput.val();
        const passwordEntry = passwordInput.val();
    });
}
        


function handleLogin(){
    listenLoginSubmit();
}


$(handleLogin);