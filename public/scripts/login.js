'use strict'

function listenLoginSubmit(){
    $('.js-signin-form').submit(event =>{
        event.preventDefault();
        const usernameInput =$(event.currentTarget).find('#usernameInput');
        const username = usernameInput.val();
    });
}
        


function handleLogin(){
    listenLoginSubmit();
}


$(handleLogin);