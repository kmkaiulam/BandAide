'use strict'

// --- Global Variables ---
let newAnnouncement;
let newBandpost;
let newErr;
let dispRecent;
let dispRest;
let eventButton;
let announcementsId;
let userId;


// --- Common Functions ---
function convertDate(date){
    return new Date(date).toDateString();
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
function findDataIds(event){
    eventButton = event.target || event.srcElement;
    announcementsId= eventButton.getAttribute('data-id');
    userId = eventButton.getAttribute('data-userId');
    console.log(`userId = ${userId}`);
    console.log(`announcementsId = ${announcementsId}`);
}

function listenEditClick(){
    $(document).on('click', '.editButton', event => {
        event.preventDefault();
        findDataIds(event);
    });
};
// --- Announcement Message Generation
function generateAnnouncement(data){
    let date;
    if (data.modified) {date = `edited on ${convertDate(data.modified)}`;}
    else{date =`posted on ${convertDate(data.created)}`;}
    newAnnouncement = `<div class='media text-muted pt-1 announcement-post'>
        <img data-src='holder.js/32x32?theme=thumb&bg=007bff&fg=007bff&size=1' alt='' class='mr-2 rounded'>
        <div class ='media-body pb-3 mb-0 small lh-125 border-bottom border-gray'>
            <p><strong class='d-block text-gray-dark'>@${data.createdBy.username} ${date}</strong> 
            ${data.text}
            </p>
            <div class="btn-group d-flex flex-row-reverse" role="group" aria-label="Button Group">
                <button type="button" class='btn btn-outline-secondary mr-2 deleteButton'><i data-id = '${data._id}' data-userId= '${data.createdBy._id}' class="far fa-trash-alt"></i></button>
                <button type='button' class='btn btn-outline-primary mr-2 editButton' data-toggle='modal' data-target='#editAnnModal'><i data-id = '${data._id}' data-userId= '${data.createdBy._id}' class="far fa-edit"></i></button>
        </div>
    </div>`
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


// --- Display in the DOM ---
    //Announcements
function displayAnnouncements(){
    const settings = {
        url: '/api/announcements/',
        dataType: 'json',
        type: 'GET',
        success: function(data){
           handleAnnouncementSubmit(data);
        }
    }
        return $.ajax(settings)
        .fail(function (err){
            generateErrorMessage(err);
            clearForm();
    });
}
    //Display Recent and Collapsed Announcement posts
function renderAnnouncements(data){
    let dispAnnouncement = data.map(generateAnnouncement);
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
              handleAnnouncementSubmit(data)
               $('#postAnnModal').modal('hide');
            
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
        
function handleDeleteAnnouncementClick(){
    $(document).on('click', '.deleteButton', event => {
        event.preventDefault();
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
                console.log(err);
                clearForm();
            });
       
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
            handleAnnouncementSubmit(data)
            $('#editAnnModal').modal('hide');
            console.log('Edited Post');
        }
    }
    return $.ajax(settings)
        .fail(function (err){
            console.log(err);
            clearForm();
        });
   
    });
};

// -- Event Eval --
function listenEventEval(){
    $('#js-events').submit(event =>{
        event.preventDefault();
        console.log(userId);
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
                generateBandPost(data);
                $('#js-new-events').append(newBandpost);
                $('#eventsModal').modal('hide')
                clearForm();
            }
        }
        return $.ajax(settings)
            .fail(function (err){
                console.log(err);
                clearForm();
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
                generateBandPost(data);
                $('#js-new-equipment').append(newBandpost);
                $('#equipmentModal').modal('hide')
                clearForm();
            }
        }
        return $.ajax(settings)
            .fail(function (err){
                clearForm();
                console.log(err);
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
                generateBandPost(data);
                $('#js-new-resources').append(newBandpost);
                $('#resourcesModal').modal('hide')
                clearForm();
            }
        }
        return $.ajax(settings)
            .fail(function (err){
                console.log(err);
                clearForm();
            });
        });
};
        
            
    



function generateBandPost(data){
    let date = convertDate(data.created);
    newBandpost = `
    <div id = '${data._id}' class='media text-muted pt-1'>
        <img data-src='holder.js/32x32?theme=thumb&bg=007bff&fg=007bff&size=1' alt='' class='mr-2 rounded'>
        <div class ='media-body pb-3 mb-0 small lh-125 border-bottom border-gray'>
            <p><strong class='d-block text-gray-dark'>@${data.createdBy.username} on ${date}</strong> 
            <h3> ${data.topic}</h3>
            ${data.description}
            </p>
            <div class="btn-group d-flex flex-row-reverse" role="group" aria-label="Button Group">
                <button type="button" class="btn btn-outline-secondary mr-2 deleteButton"><i class="far fa-trash-alt"></i></button>
                <button type="button" class="btn btn-outline-primary mr-2 editButton"><i class="far fa-edit"></i></button>
                <button type="button" class="btn btn-outline-success mr-2 replyButton"><i class="fas fa-reply"></i></button>
        </div>
    </div>`
}

function onLoad(){
    displayAnnouncements();
    listenEditClick();
    listenEditAnnouncement();
    listenAnnouncementPostModal();
    listenEventEval();
    listenEquipmentEval();
    listenTraining();
    handleDeleteAnnouncementClick();
}




$(onLoad);