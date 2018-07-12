'use strict'

// --- Global Variables ---
let newDate;
let newAnnouncement;
let newBandpost;
let newErr;
let eventButton;
let announcementsId;
let userId;


// --- Common Functions ---
function convertDate(date){
    return new Date(date).toDateString();
}
function defineDate(data){
    if (data.modified) {
        newDate = `edited on ${convertDate(data.modified)}`;
    }
    else{
        newDate =`posted on ${convertDate(data.created)}`;
    }
    return newDate;
}


function clearForm(){ 
    $('#message-text').val('');
    $('#topic').val('');
    $('#description').val('');
    $('#eventTopic').val('');
    $('#eventDescription').val('');
    $('#equipmentTopic').val('');
    $('#equipmentDescription').val('');
    $('#resourceTopic').val('');
    $('#resourceDescription').val('');
}


function listenEditClick(){
    $(document).on('click', '.editButton', event => {
        event.preventDefault();
        findDataIds(event);
        //$('.editButton').prop('disabled', true);   --------------- disable edit button - not won't need if i can fix the id issue
    });
};

function findDataIds(event){
    eventButton = event.target || event.srcElement;
    announcementsId= eventButton.getAttribute('data-id');
    userId = eventButton.getAttribute('data-userId');
    console.log(`userId = ${userId}`);
    console.log(`announcementsId = ${announcementsId}`);
}



function handlePostFail(err){
    generateErrorMessage(err);
    clearForm();
}

function handleDeleteFail(err){
    alert(`${err.responseText}. Please Login.`);
    window.location = '/login';
}

// --- Message Generation

function generateErrorMessage(err){
    newErr = `<div class='modal-body'>
    <label for='message-text' class='col-form-label'>Error:</label>
    <textarea disabled class='form-control' id='message-text'></textarea>
    </div>
<div class='modal-footer'>
  <div class = 'text-danger'> ${err.responseText}. Please<a href = '/login'> Login </a></div>`
  return $('.js-error-message').html(newErr);
}

function generateAnnouncementPost(data){
    defineDate(data); 
        newAnnouncement = `<div class='media text-muted pt-1 announcement-post'>
        <img data-src='holder.js/32x32?theme=thumb&bg=007bff&fg=007bff&size=1' alt='' class='mr-2 rounded'>
        <div class ='media-body pb-3 mb-0 small lh-125 border-bottom border-gray'>
            <p><strong class='d-block text-gray-dark'>@${data.createdBy.username} ${newDate}</strong> 
            ${data.text}
            </p>
            <div class="btn-group d-flex flex-row-reverse" role="group" aria-label="Button Group">
                <button type="button" class='btn btn-outline-secondary mr-2 deleteButton'><i data-id = '${data._id}' data-userId= '${data.createdBy._id}' class="far fa-trash-alt"></i></button>
                <button type='button' class='btn btn-outline-primary mr-2 editButton' data-toggle='modal' data-target='#editAnnModal'><i data-id = '${data._id}' data-userId= '${data.createdBy._id}' class="far fa-edit"></i></button>
        </div>
    </div>`
    return newAnnouncement
};
  
function generateBandpost(data){
    defineDate(data)
    newBandpost = `
        <div class='media text-muted pt-1'>
        <img data-src='holder.js/32x32?theme=thumb&bg=007bff&fg=007bff&size=1' alt='' class='mr-2 rounded'>
        <div class ='media-body pb-3 mb-0 small lh-125 border-bottom border-gray'>
            <p><strong class='d-block text-gray-dark'>@${data.createdBy.username} on ${newDate}</strong> 
                <h3> ${data.topic}</h3>
                ${data.description}
            </p>
            <div class="btn-group d-flex flex-row-reverse" role="group" aria-label="Button Group">
                <button type="button" class="btn btn-outline-secondary mr-2 deleteButton"><i class="far fa-trash-alt"></i></button>
                <button type="button" class="btn btn-outline-primary mr-2 editButton"><i class="far fa-edit"></i></button>
                <button type="button" class="btn btn-outline-success mr-2 replyButton"><i class="fas fa-reply"></i></button>
        </div>
    </div>`
    return newBandpost;
};



// --- Display in the DOM ---
    //Announcements
function displayAnnouncements(){
    const settings = {
        url: '/api/announcements/',
        dataType: 'json',
        type: 'GET',
        success: function(data){
            renderAnnouncements(data);
        }
    }
        return $.ajax(settings)
        .fail(function (err){
           handlePostFail(err);
    });
}


    //Display Recent and Collapsed Announcement posts
function renderAnnouncements(data){
    let dispAnnouncement = data.map(generateAnnouncementPost);
    let dispRecent;
    let dispRest;
    dispAnnouncement.reverse();
    dispRecent = dispAnnouncement.slice(0,3);
    dispRest = dispAnnouncement.slice(3);
    dispRecent.join('');
    dispRest.join('');
    $('#js-recent-announcement').html(dispRecent);
    $('#js-all-announcement').html(dispRest);
    clearForm();
}

function listenAnnouncementPostModal(){
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
              console.log(data);
              renderAnnouncements(data)
               $('#postAnnModal').modal('hide');
            
            }
        }
            return $.ajax(settings)
            .fail(function (err){
               handlePostFail(err);
            });
    });
}
        
function listenDeleteAnnouncementClick(){
    $(document).on('click', '.deleteButton', event => {
        event.preventDefault();
        if (window.confirm('Proceed to delete?')){
        findDataIds(event);
        const settings = {
            url: `/api/announcements/${announcementsId}`,
            data: {
                'announcementsId':`${announcementsId}`, 
                'createdById':`${userId}`
                },
            dataType: 'json',
            type: 'DELETE',
            success: function(data){
                $(`i[data-id= ${announcementsId}]`).closest('div.announcement-post').hide();
                console.log('Deleted post');
            }
        }
        
        return $.ajax(settings)
            .fail(function (err){
               handleDeleteFail(err);
            });
        };
    })    
}


function listenEditAnnouncement(){
    $('#js-edit-announcement').submit(event =>{
        event.preventDefault();
        const settings = {
        url: `/api/announcements/${announcementsId}`,
        data: {
            'announcementsId':`${announcementsId}`, 
            'createdById':`${userId}`,
            'text':  $('#message-edit').val(),
        },
        dataType: 'json',
        type: 'PUT',
        success: function(data){
           renderAnnouncements(data)
            $('#editAnnModal').modal('hide');
           // $('.editButton').prop('disabled', false);  --------------- disable edit button - not won't need if i can fix the id issue
            console.log('Edited Post');
        }
    }
    return $.ajax(settings)
        .fail(function (err){
           // $('.editButton').prop('disabled', false);  --------------- disable edit button - not won't need if i can fix the id issue
            handlePostFail(err);
        });
   
    });
};

// -- Event Eval --
function displayBandposts(){
    const settings = {
        url: '/api/bandposts/',
        dataType: 'json',
        type: 'GET',
        success: function(data){
            renderBandposts(data);
        }
    }
        return $.ajax(settings)
        .fail(function (err){
           handlePostFail(err);
    });
}
function renderBandposts(data){
    let dispBandpost = data.map(generateBandpost);
    dispBandpost.reverse();
    let dispBandpostRecent = dispBandpost.slice(0,5);
    let dispBandpostRest = dispBandpost.slice(5);
    dispBandpostRecent.join('');
    dispBandpostRest.join('');
    //depending on 'posttype' display in DOM all posts in proper sections
    console.log(data);
    let bandpostPosttype = data[0].posttype 
        if(bandpostPosttype === 'Event_Eval'){
            $('#js-recent-events').html(dispBandpostRecent);
            $('#js-all-events').html(dispBandpostRest);
        }
        if(bandpostPosttype === 'Equipment_Eval'){  
            $('#js-recent-equipment').html(dispBandpostRecent);
            $('#js-all-equipment').html(dispBandpostRest);

            }
        if(bandpostPosttype === 'Training_Resource'){
            $('#js-recent-resources').html(dispBandpostRecent);
            $('#js-all-resources').html(dispBandpostRest);
        }
   
    clearForm();
};

function listenEventEval(){
    $('#js-events').submit(event =>{
        event.preventDefault();
        const settings = {
            url: '/api/bandposts/',
            data: {
                'posttype': 'Event_Eval',
                'topic': $('#eventTopic').val(),
                'description': $('#eventDescription').val(),
                },
            dataType: 'json',
            type: 'POST',
            success: function(data){
               renderBandposts(data);
                $('#eventsModal').modal('hide')
                console.log(data);
                clearForm();
            }
        }
        return $.ajax(settings)
            .fail(function (err){
              handlePostFail(err);
            });
        });
};

// -- Equipment Eval --
function listenEquipmentEval(){
    $('#js-equipment').submit(event =>{
        event.preventDefault();
        const settings = {
            url: '/api/bandposts/',
            data: {
                'posttype': 'Equipment_Eval',
                'topic': $('#equipmentTopic').val(),
                'description': $('#equipmentDescription').val(),
                },
            dataType: 'json',
            type: 'POST',
            success: function(data){
                console.log(data);
                generateBandpost(data);
                $('#js-new-equipment').append(newPost);
                $('#equipmentModal').modal('hide')
                clearForm();
            }
        }
        return $.ajax(settings)
            .fail(function (err){
                handlePostFail(err);
            });
        });
};

// -- Training Resources --
function listenTraining(){
    $('#js-resources').submit(event =>{
        event.preventDefault();
        const settings = {
            url: '/api/bandposts/',
            data: {
                'posttype': 'Training_Resource',
                'topic': $('#resourceTopic').val(),
                'description': $('#resourceDescription').val(),
                },
            dataType: 'json',
            type: 'POST',
            success: function(data){
                generateBandpost(data);
                $('#js-new-resources').append(newPost);
                $('#resourcesModal').modal('hide')
                clearForm();
            }
        }
        return $.ajax(settings)
            .fail(function (err){
               handlePostFail(err);
            });
        });
};
        
function displayInDom(){
    displayAnnouncements();
    displayBandposts();
}

function handleListenButtons(){
    listenEditClick();
    listenEditAnnouncement();
    listenAnnouncementPostModal();
    listenEventEval();
    listenEquipmentEval();
    listenTraining();
    listenDeleteAnnouncementClick();
}            
    





function onLoad(){
    handleListenButtons();
    displayInDom();
}




$(onLoad);