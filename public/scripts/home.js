'use strict'
// Make render bandPosts and render Announcements 1 function using conditionals
// Figure out Video Js to make videos load properly
// Remove Equipment eval
// Try to use 1 modal for multiple bandposts - altering the content inside depending on posttype
 
// --- Global Variables ---
let newDate;
let newAnnouncement;
let newBandpost;
let newErr;
let eventButton;
let postId;
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
    
    $('#resourceTopic').val('');
    $('#resourceDescription').val('');
    /*
    $('#equipmentTopic').val('');
    $('#equipmentDescription').val('');
    */
}


function listenEditClick(){
    $(document).on('click', '.editButton', event => {
        event.preventDefault();
        eventButton = event.target;
        findDataIds(event);
   });
};

function findDataIds(event){
    eventButton = event.target;
    postId= eventButton.getAttribute('data-id');
    userId = eventButton.getAttribute('data-userId');
    console.log(`userId = ${userId}`);
    console.log(`postId = ${postId}`);
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
                <button type='button' data-id = '${data._id}' data-userId= '${data.createdBy._id}' class='btn btn-outline-secondary mr-2 deleteAnnouncementButton'><i data-id = '${data._id}' data-userId= '${data.createdBy._id}' class="far fa-trash-alt"></i></button>
                <button type='button' data-id = '${data._id}' data-userId= '${data.createdBy._id}' class='btn btn-outline-primary mr-2 editButton' data-toggle='modal' data-target='#editAnnModal'><i data-id = '${data._id}' data-userId= '${data.createdBy._id}' class="far fa-edit"></i></button>
        </div>
    </div>`
    return newAnnouncement
};
  
function generateBandpost(data){
    defineDate(data)
    let video;
    let modalTarget;
    if (data.posttype === 'Training_Resource' && data.youtubeLink != ''){
        video = `<div class = ' align-items-center justify-content-center'> 
        <video class ='video-js vjs-default-skin' controls= 'true' preload = 'true'   width='640' height='264' 
        data-setup='{ "techOrder": ["youtube"], "sources": [{ "type": "video/youtube", "src": "${data.youtubeLink}"}] }'>
        </video>
        </div>`;
        modalTarget ='editTrainingModal';
    }
    else{
        video ='';
        modalTarget = 'editEventsModal'
    }              
    newBandpost = ` 
        <div class='media text-muted pt-1 bandpost-post'>
         <img data-src='holder.js/32x32?theme=thumb&bg=007bff&fg=007bff&size=1' alt='' class='mr-2 rounded'>
            <div class ='media-body pb-3 mb-0 small lh-125 border-bottom border-gray'>
                <div class = 'container'>
                    <div><strong class='d-block text-gray-dark'>@${data.createdBy.username} on ${newDate}</strong></div>
                    <h3> ${data.topic}</h3>
                    <div class = 'd-flex align-items-center justify-content-center'>${video} </div>
                    <p>${data.description} </p>
                </div>
           
            <div class='btn-group d-flex flex-row-reverse' role='group' aria-label='Button Group'>
            <button type='button' data-id = '${data._id}' data-userId= '${data.createdBy._id}' class='btn btn-outline-secondary mr-2 deleteBandpostButton'><i data-id = '${data._id}' data-userId= '${data.createdBy._id}' class="far fa-trash-alt"></i>
            <button type='button' data-id = '${data._id}' data-userId= '${data.createdBy._id}' class='btn btn-outline-primary mr-2 editButton' data-toggle='modal' data-target='#${modalTarget}'><i data-id = '${data._id}' data-userId= '${data.createdBy._id}' class="far fa-edit"></i></button>
            <button type='button' data-id = '${data._id}' data-userId= '${data.createdBy._id}' class='btn btn-outline-success mr-2 replyButton' data-toggle="collapse" data-target="#collapseReply${data._id}" aria-expanded="false" aria-controls="collapseReply"><i data-id = '${data._id}' data-userId= '${data.createdBy._id}' class='fas fa-reply'></i></button>
            </div>
        </div>
        
        <div class="collapse" id="#collapseReply${data._id}">
        <div id = bandpost${data._id}> </div>
        <form id = 'js-post-announcement' class = 'js-error-message'>
            <label for='message-text' class='col-form-label'>Message-text:</label>
            <textarea class='form-control' id='message-text' required></textarea>
            <button type='submit' class='btn btn-primary' >Submit</button>
      </form>
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
           renderPosts(data);
        }
    }
        return $.ajax(settings)
        .fail(function (err){
           handlePostFail(err);
    });
}


    //Display Recent and Collapsed Posts
/*
function renderAnnouncements(data){
    if (data.length <1){
        return;
    }
    let dispPost;
    let dispRecent;
    let dispRest;
    let bandpostPosttype;
    dispPost = data.map(generateAnnouncementPost);
    dispPost.reverse();
    dispRecent = dispPost.slice(0,3);
    dispRest = dispPost.slice(3);
    dispRecent.join('');
    dispRest.join('');
    $('#js-recent-announcement').html(dispRecent);
    $('#js-all-announcement').html(dispRest);    
}
*/




    // function getRecent (data) { return data[0] }
function renderPosts(data){
    let dispPost;
    let dispRecent;
    // let dispRecent = getRecent(data);
    // dispRecent = 
    let dispRest;
    let bandpostPosttype;
    if (data.length === 0){
        return; 
    }
        bandpostPosttype = data[0].posttype;
        if (bandpostPosttype === 'Announcement'){
            dispPost = data.map(generateAnnouncementPost);
            dispPost.reverse();
            dispRecent = dispPost.slice(0,3);
            dispRest = dispPost.slice(3);
            dispRecent.join('');
            dispRest.join('');
            $('#js-recent-announcement').html(dispRecent);
            $('#js-all-announcement').html(dispRest);  
        }
        else {
            dispPost = data.map(generateBandpost);
            dispPost.reverse();
            dispRecent = dispPost.slice(0,3);
            dispRest = dispPost.slice(3);
            dispRecent.join('');
            dispRest.join('');
            if (bandpostPosttype === 'Event_Eval'){
                $('#js-recent-event').html(dispRecent);
                $('#js-all-event').html(dispRest);
                }
            if(bandpostPosttype === 'Training_Resource'){
                $('#js-recent-training').html(dispRecent);
                $('#js-all-training').html(dispRest);
            };         
        }; 
};    



function listenAnnouncementPost(){
    $('#js-post-announcement').submit(event =>{
        event.preventDefault();
        const settings = {
            url: '/api/announcements/',
            data: {
                'posttype': 'Announcement', 
                'text': $('#message-text').val(),
                },
            dataType: 'json',
            type: 'POST',
            success: function(data){
              console.log(data);
              renderPosts(data)
               $('#postAnnModal').modal('hide');
               clearForm();
            }
        }
            return $.ajax(settings)
            .fail(function (err){
               handlePostFail(err);
            });
    });
}
        
function listenAnnouncementDelete(){
    $(document).on('click', '.deleteAnnouncementButton', event => {
        event.preventDefault();
        if (window.confirm('Proceed to delete?')){
        findDataIds(event);
        const settings = {
            url: `/api/announcements/${postId}`,
            data: {
                'announcementsId':`${postId}`, 
                'createdById':`${userId}`
                },
            dataType: 'json',
            type: 'DELETE',
            success: function(data){
                $(`i[data-id= ${postId}]`).closest('div.announcement-post').hide();
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


function listenAnnouncementEdit(){
    $('#js-edit-announcement').submit(event =>{
        event.preventDefault();
        const settings = {
        url: `/api/announcements/${postId}`,
        data: {
            'posttype': 'Announcements',
            'announcementsId':`${postId}`, 
            'createdById':`${userId}`,
            'text':  $('#message-edit').val(),
        },
        dataType: 'json',
        type: 'PUT',
        success: function(data){
           renderPosts(data)
            $('#editAnnModal').modal('hide');
            console.log('Edited Post');
        }
    }
    return $.ajax(settings)
        .fail(function (err){
            handlePostFail(err);
        });
   
    });
};

// --- Common Bandpost Functions ---
//on load
function displayEventBandposts(){
    const settings = {
        url: '/api/bandposts/events',
        dataType: 'json',
        type: 'GET',
        success: function(data){
            renderPosts(data);
        }
    }
        return $.ajax(settings)
        .fail(function (err){
           handlePostFail(err);
    });
};
/*
function displayEquipmentBandposts(){
    const settings = {
        url: '/api/bandposts/equipment',
        dataType: 'json',
        type: 'GET',
        success: function(data){
            renderPosts(data);
        }
    }
        return $.ajax(settings)
        .fail(function (err){
           handlePostFail(err);
    });
};

*/
function displayTrainingBandposts(){
    const settings = {
        url: '/api/bandposts/training',
        dataType: 'json',
        type: 'GET',
        success: function(data){
            renderPosts(data);
        }
    }
        return $.ajax(settings)
        .fail(function (err){
           handlePostFail(err);
    });
};

function listenBandpostDelete(){
    $(document).on('click', '.deleteBandpostButton', event => {
        event.preventDefault();
        if (window.confirm('Proceed to delete?')){
        findDataIds(event);
        const settings = {
            url: `/api/bandposts/${postId}`,
            data: {
                'bandpostsId':`${postId}`, 
                'createdById':`${userId}`
                },
            dataType: 'json',
            type: 'DELETE',
            success: function(data){
                $(`i[data-id= ${postId}]`).closest('div.bandpost-post').hide();
                console.log('Deleted post');
            }
        }
        
        return $.ajax(settings)
            .fail(function (err){
               handleDeleteFail(err);
            });
        };
    });    
};

// -- Event Eval --
function listenEventEvalPost(){
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
                renderPosts(data);
                $('#eventsModal').modal('hide')
                clearForm();
            }
        }
        return $.ajax(settings)
            .fail(function (err){
              handlePostFail(err);
            });
        });
};


function listenEventEdit(){
    $('#js-edit-events').submit(event =>{
        event.preventDefault();
        const settings = {
            url: `/api/bandposts/${postId}`,
            data: {
                'bandpostsId':`${postId}`,
                'createdById':`${userId}`,
                'posttype': 'Event_Eval',
                'topic': $('#editEventTopic').val(),
                'description': $('#editEventDescription').val(),
                },
            dataType: 'json',
            type: 'PUT',
            success: function(data){
               console.log(data);
                renderPosts(data);
                $('#editEventsModal').modal('hide')
                clearForm();
            }
        }
        return $.ajax(settings)
            .fail(function (err){
              handlePostFail(err);
            });
        });
};


/*
// -- Equipment Eval --
function listenEquipmentEvalPost(){
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
                renderPosts(data)
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

function listenEquipmentEdit(){
    $('#js-edit-events').submit(event =>{
        event.preventDefault();
        const settings = {
            url: `/api/bandposts/${postId}`,
            data: {
                'bandpostsId':`${postId}`,
                'createdById':`${userId}`,
                'posttype': 'Event_Eval',
                'topic': $('#editEventTopic').val(),
                'description': $('#editEventDescription').val(),
                },
            dataType: 'json',
            type: 'PUT',
            success: function(data){
               console.log(data);
                renderPosts(data);
                $('#editEventsModal').modal('hide')
                clearForm();
            }
        }
        return $.ajax(settings)
            .fail(function (err){
              handlePostFail(err);
            });
        });
};

*/


// -- Training Resources --
function listenTrainingPost(){
    $('#js-training').submit(event =>{
        event.preventDefault();
        const settings = {
            url: '/api/bandposts/',
            data: {
                'posttype': 'Training_Resource',
                'topic': $('#trainingTopic').val(),
                'description': $('#trainingDescription').val(),
                'youtubeLink' : $('#trainingVideo').val()
                },
            dataType: 'json',
            type: 'POST',
            success: function(data){
                renderPosts(data);
               $('#trainingModal').modal('hide')
                clearForm();
            }
        }
        return $.ajax(settings)
            .fail(function (err){
               handlePostFail(err);
            });
        });
};

function listenTrainingEdit(){
    $('#js-edit-training').submit(event =>{
        event.preventDefault();
        const settings = {
            url: `/api/bandposts/${postId}`,
            data: {
                'bandpostsId':`${postId}`,
                'createdById':`${userId}`,
                'posttype': 'Training_Resource',
                'youtubeLink' : $('#editTrainingVideo').val(),
                'topic': $('#editTrainingTopic').val(),
                'description': $('#editTrainingDescription').val(),
                },
            dataType: 'json',
            type: 'PUT',
            success: function(data){
               console.log(data);
                renderPosts(data);
                $('#editTrainingModal').modal('hide')
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
    displayEventBandposts();
    //displayEquipmentBandposts();
    displayTrainingBandposts();
}

function handleListenAnnouncementButtons(){
    listenAnnouncementEdit();
    listenAnnouncementPost();
    listenAnnouncementDelete();
}
function handleListenBandpostButtons(){
    listenBandpostDelete();
    listenEventEvalPost();
    listenEventEdit();
  //  listenEquipmentEvalPost();
    listenTrainingPost(); 
    listenTrainingEdit();
}

function handleListenButtons(){
    listenEditClick();
    handleListenAnnouncementButtons();
    handleListenBandpostButtons();
}            
    





function onLoad(){
    displayInDom();
    handleListenButtons();
    
}




$(onLoad);