'use strict'
let newAnnouncement;
let newErr;
let dispRecent;
let dispRest;
let newEvent;
// --- Common Functions ---
function convertDate(date){
    return new Date(date).toDateString();
}


// --- Display in the DOM ---
    //Announcements
function displayAnnouncements(){
    const settings = {
        url: '/api/announcements/',
        dataType: 'json',
        type: 'GET',
        success: function(data){
           handleAnnouncementPost(data);
        }
    }
        return $.ajax(settings)
        .fail(function (err){
            generateErrorMessage(err);
            clearForm();
    });
}
    //Display Recent and Collapsed Announcement posts
function handleAnnouncementPost(data){
    let dispAnnouncement = data.map(generateAnnouncement);
    dispAnnouncement.reverse();
    dispRecent = dispAnnouncement.slice(0,3);
    dispRest = dispAnnouncement.slice(3);
    dispRecent.join('');
    dispRest.join('');
    $('#js-recent-announcement').html(dispRecent);
    $('#js-all-announcement').html(dispRest);
}

function clearForm(){ 
    $('#message-text').val('');
}

function listenAnnouncement(){
    $('#js-post-announcement').submit(event =>{
        event.preventDefault();
        const settings = {
            url: '/api/announcements/',
            data: {
                "text": $('#message-text').val(),
                },
            dataType: 'json',
            type: 'POST',
            success: function(data){
               generateAnnouncement(data);
               prependAnnouncementEntry();
               clearForm();
               $('#announcementsModal').modal('hide');
            }
        }
            return $.ajax(settings)
            .fail(function (err){
                generateErrorMessage(err);
                $('#js-post-announcement').html(newErr)
                clearForm();
            });
    });
}
        



function generateAnnouncement(data){
    let date = convertDate(data.created);
    newAnnouncement = `
    <div id = '${data._id}' class='media text-muted pt-1'>
        <img data-src='holder.js/32x32?theme=thumb&bg=007bff&fg=007bff&size=1' alt='' class='mr-2 rounded'>
        <div class ='media-body pb-3 mb-0 small lh-125 border-bottom border-gray'>
            <p><strong class='d-block text-gray-dark'>@${data.createdBy.username} on ${date}</strong> 
            ${data.text}
            </p>
            <div class="btn-group d-flex flex-row-reverse" role="group" aria-label="Button Group">
                <button type="button" class="btn btn-outline-secondary mr-2 deleteButton"><i class="far fa-trash-alt"></i></button>
                <button type="button" class="btn btn-outline-primary mr-2 editButton"><i class="far fa-edit"></i></button></button>
        </div>
    </div>
`
    return newAnnouncement;
};

function generateErrorMessage(err){
    newErr = `<div class='modal-body'>
    <label for='message-text' class='col-form-label'>Message-text:</label>
    <textarea disabled class='form-control' id='message-text'></textarea>
    </div>
<div class='modal-footer'>
  <div class = 'text-danger'> ${err.responseText}. Please<a href = '/login'> Login </a></div>`
}

function prependAnnouncementEntry(){
    $('#js-recent-announcement').prepend(newAnnouncement);
}

function deleteAnnouncement(){
    $('.deleteButton').click(event => {
        event.preventDefault();
        $(event.currentTarget).parent("id")
    })    
}

function editAnnouncement(){
}


// -- Event Eval --
function listenEventEval(){
    $('#js-events').submit(event =>{
        event.preventDefault();
        const settings = {
            url: '/api/bandposts/',
            data: {
                'posttype': 'Event_Eval',
                'topic': $('#topic').val(),
                'description': $('#description').val(),
                },
            dataType: 'json',
            type: 'POST',
            success: function(data){
                generateEventEval(data);
                $('#js-new-events').append(newEvent);
            }
        }
        return $.ajax(settings)
            .fail(function (err){
                console.log(err);
            });
        });
};
        
            
    



function generateEventEval(data){
    newEvent =  `<h5 class='modal-title'> ${data.topic}</h5>
    <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
      <span aria-hidden='true'>&times;</span>
    </button>
    <div class='modal-body'>
      <label for='topic' class='col-form-label'>Topic:</label>
      <input name= 'topic' type='text' id='topic' class='form-control' placeholder='ex. SWS20180708' required autofocus>
      <label for='description' class='col-form-label'>description:</label>
      <textarea class='form-control' id='description'></textarea>
    </div>`
}

function onLoad(){
    displayAnnouncements();
    listenAnnouncement();
    deleteAnnouncement();
}




$(onLoad);