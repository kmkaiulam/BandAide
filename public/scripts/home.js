'use strict'
// --- Global Variables ---
let eventButton;
let postId;
let userId;
let replyId;

// --- Endpoints ---
let url = {
    'announcements' : '/api/announcements/',
    'bandposts': '/api/bandposts/',
    'events' : '/api/bandposts/events',
    'training': '/api/bandposts/training',
    'reply':'/api/bandposts/reply/'   
}

// --- Common Functions ---
function clearForm(){ 
    $(':input').val('');
}

function listenDataIdButton(){
    $(document).on('click', '.dataIdButton', event => {
        event.preventDefault();
        eventButton = event.target;
        findDataIds(event);
   });
};

function findDataIds(event){
   eventButton = event.target;
    postId= eventButton.closest('div.data').getAttribute('data-id');
    userId = eventButton.getAttribute('data-userId');
    replyId = eventButton.getAttribute('data-replyId');
    console.log(`userId = ${userId}`);
    console.log(`postId = ${postId}`);
    console.log(`replyId = ${replyId}`)
};

function handleFail(err){
    alert(`${err.responseText}`);
    clearForm();
};
// --- Announcements --- 
function listenAnnouncementPost(){
    $('#js-post-announcement').submit(event =>{
        event.preventDefault();
        const settings = {
            url: url.announcements,
            data: {
                'posttype': 'Announcement', 
                'text': $('#message-text').val(),
                },
            dataType: 'json',
            type: 'POST',
            success: function(data){
               let newAnnouncement= generateAnnouncementPost(data);
               $('#js-recent-announcement').prepend(newAnnouncement)
               $('#postAnnModal').modal('hide');
               clearForm();
            }
        }
            return $.ajax(settings)
            .fail(function (err){
               handleFail(err);
            });
    });
};
        
function listenAnnouncementDelete(){
    $(document).on('click', '.deleteAnnouncementButton', event => {
        event.preventDefault();
        if (window.confirm('Proceed to delete?')){
        const settings = {
            url: `${url.announcements}${postId}`,
            data: {
                'announcementsId':`${postId}`, 
                'createdById':`${userId}`
                },
            dataType: 'json',
            type: 'DELETE',
            success: function(data){
                $(`i[data-id= ${postId}]`).closest('div.js-announcement').hide();
                console.log('Deleted post');
            }
        }
        
        return $.ajax(settings)
            .fail(function (err){
               handleFail(err);
            });
        };
    })    
}

function listenAnnouncementEdit(){
    $('#js-edit-announcement').submit(event =>{
        event.preventDefault();
        const settings = {
        url: `${url.announcements}${postId}`,
        data: {
            'posttype': 'Announcements',
            'announcementsId':`${postId}`, 
            'createdById':`${userId}`,
            'text':  $('#message-edit').val(),
        },
        dataType: 'json',
        type: 'PUT',
        success: function(data){
            let newAnnouncement= generateAnnouncementPost(data)
            $(`i[data-id= ${postId}]`).closest('div.js-announcement').html(newAnnouncement);
            $('#editAnnModal').modal('hide');
            clearForm();
            console.log('Edited Post');
        }
    }
    return $.ajax(settings)
        .fail(function (err){
            handleFail(err);
        });
   
    });
};

// --- Common Bandpost Functions ---
function listenBandpostDelete(){
    $(document).on('click', '.deleteBandpostButton', event => {
        event.preventDefault();
        if (window.confirm('Proceed to delete?')){
        const settings = {
            url: `${url.bandposts}${postId}`,
            data: {
                'bandpostsId':`${postId}`, 
                'createdById':`${userId}`
                },
            dataType: 'json',
            type: 'DELETE',
            success: function(data){
                $(`i[data-id= ${postId}]`).closest('div.js-bandpost-update').hide();
                console.log('Deleted post');
            }
        }
        
        return $.ajax(settings)
            .fail(function (err){
               handleFail(err);
            });
        };
    });    
};

// --- Event Eval ---
function listenEventEvalPost(){
    $('#js-events').submit(event =>{
        event.preventDefault();
        const settings = {
            url: url.bandposts,
            data: {
                'posttype': 'Event_Eval',
                'topic': $('#eventTopic').val(),
                'description': $('#eventDescription').val(),
                },
            dataType: 'json',
            type: 'POST',
            success: function(data){
               let newBandpost= generateBandpost(data)
               $('#js-recent-event').prepend(newBandpost)
               $('#eventsModal').modal('hide')
               clearForm();
            }
        }
        return $.ajax(settings)
            .fail(function (err){
              handleFail(err);
            });
        });
};

function listenEventEdit(){
    $('#js-edit-events').submit(event =>{
        event.preventDefault();
        const settings = {
            url: `${url.bandposts}${postId}`,
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
                let newBandpost= generateBandpost(data)
                $(`i[data-id= ${postId}]`).closest('div.js-bandpost-update').html(newBandpost);
                $('#editEventsModal').modal('hide')
                clearForm();
            }
        }
        return $.ajax(settings)
            .fail(function (err){
              handleFail(err);
            });
        });
};

// --- Training Resources ---
function listenTrainingPost(){
    $('#js-training').submit(event =>{
        event.preventDefault();
        const settings = {
            url: url.bandposts,
            data: {
                'posttype': 'Training_Resource',
                'topic': $('#trainingTopic').val(),
                'description': $('#trainingDescription').val(),
                'youtubeLink' : $('#trainingVideo').val()
                },
            dataType: 'json',
            type: 'POST',
            success: function(data){
               let newBandpost= generateBandpost(data)
               $('#js-recent-training').prepend(newBandpost)
               $('#trainingModal').modal('hide')
                clearForm();
            }
        }
        return $.ajax(settings)
            .fail(function (err){
               handleFail(err);
            });
        });
};

function listenTrainingEdit(){
    $('#js-edit-training').submit(event =>{
        event.preventDefault();
        const settings = {
            url: `${url.bandposts}${postId}`,
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
                let newBandpost= generateBandpost(data)
                $(`i[data-id= ${postId}]`).closest('div.js-bandpost-update').html(newBandpost);
                $('#editTrainingModal').modal('hide')
                clearForm();
            }
        }
        return $.ajax(settings)
            .fail(function (err){
              handleFail(err);
            });
        });
};
        
function listenYoutubeClick(){
    $(document).on('click', 'button.container-youtube', function (){
        let playerId = $(this).siblings('.plyer').attr('id');
        let player = new Plyr(`#${playerId}`);
        $(this).hide();
    });
};

// --- Reply ---
function listenReplyPost(){
    $('#js-reply').submit(event =>{
        event.preventDefault();
        const settings = {
            url: `${url.reply}${postId}`,
            data: {
                'bandpostsId' : `${postId}`,
                'topic': $('#replyTopic').val(),
                'reply': $('#replyText').val(),
                },
            dataType: 'json',
            type: 'POST',
            success: function(data){
               let latestReply = data[data.length-1]
               let newReply = generateReply(latestReply)
               $(`#js-reply-${postId}`).append(newReply);
               $('#replyModal').modal('hide');
               clearForm();
            }
        }
        return $.ajax(settings)
            .fail(function (err){
              handleFail(err);
            });
        });
};

function listenReplyDelete(){
    $(document).on('click', '.deleteReplyButton', event => {
        event.preventDefault();
        if (window.confirm('Proceed to delete?')){
        const settings = {
            url: `${url.reply}${postId}`,
            data: {
                'bandpostsId':`${postId}`, 
                'replyId':`${replyId}`,
                'createdById':`${userId}`,
                },
            dataType: 'json',
            type: 'DELETE',
            success: function(data){
                $(`i[data-replyid= ${replyId}]`).closest('div.js-reply-modify').hide();
                console.log('Deleted reply');
            }
        }
        return $.ajax(settings)
            .fail(function (err){
                handleFail(err);
            });
        };
    });    
};

function handleListenAnnouncementButtons(){
    listenAnnouncementEdit();
    listenAnnouncementPost();
    listenAnnouncementDelete();
}
function handleListenBandpostButtons(){
    listenBandpostDelete();
    listenEventEvalPost();
    listenEventEdit();
    listenTrainingPost(); 
    listenTrainingEdit();
    listenYoutubeClick()
    listenReplyPost();
    listenReplyDelete();
}

function handleApp(){
    listenDataIdButton();
    handleListenAnnouncementButtons();
    handleListenBandpostButtons();
}            
    

$(handleApp);