'use strict'
// Figure out Video Js to make videos load properly
// Try to use 1 modal for multiple bandposts - altering the content inside depending on posttype
 
// --- Global Variables ---
let newErr;
let eventButton;
let postId;
let userId;

// --- Endpoints ---
let url = {
    'announcements' : '/api/announcements/',
    'bandposts': '/api/bandposts/',
    'events' : '/api/bandposts/events',
    'training': '/api/bandposts/training',   
}

function clearForm(){ 
    $(':input').val('');
}


function listenEditClick(){
    $(document).on('click', '.editButton', event => {
        event.preventDefault();
        eventButton = event.target;
        findDataIds(event);
   });
};

// --- Grabs The userId and postId for any entry to allow for deletion
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
    alert(`${err.responseText}.`);
}

    //Display Recent and Collapsed Posts
function preparePosts(post){
    let recentPosts; 
    let restPosts;
    post.reverse();
    recentPosts = post.slice(0,3);
    restPosts = post.slice(3);
    recentPosts.join('')
    restPosts.join('')
    let preparedPosts = [recentPosts , restPosts]
    return preparedPosts;
}   

function renderPosts(data){
    let bandpostPosttype;
    let preparedPosts;
    if (data.length === 0){
        return; 
    }
    bandpostPosttype = data[0].posttype;
    if (bandpostPosttype === 'Announcement'){
        let newAnnouncements = data.map(generateAnnouncementPost);
            preparedPosts = preparePosts(newAnnouncements);
        $('#js-recent-announcement').html(preparedPosts[0]);
        $('#js-all-announcement').html(preparedPosts[1]);  
    }
    else {
           let  newBandposts = data.map(generateBandpost);
           preparedPosts = preparePosts(newBandposts);
            if (bandpostPosttype === 'Event_Eval'){
                $('#js-recent-event').html(preparedPosts[0]);
                $('#js-all-event').html(preparedPosts[1]);
                }
            if(bandpostPosttype === 'Training_Resource'){

                $('#js-recent-training').html(preparedPosts[0]);
                $('#js-all-training').html(preparedPosts[1]);
                //let player  = videojs('vidplayer');
            };         
        }; 
};    



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
            url: `${url.announcements}${postId}`,
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
            $(`i[data-id= ${postId}]`).closest('div.js-announcement-update').html(newAnnouncement);
            $('#editAnnModal').modal('hide');
            clearForm();
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
function listenBandpostDelete(){
    $(document).on('click', '.deleteBandpostButton', event => {
        event.preventDefault();
        if (window.confirm('Proceed to delete?')){
        findDataIds(event);
        const settings = {
            url: `${url.bandposts}${postId}`,
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
              handlePostFail(err);
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
              handlePostFail(err);
            });
        });
};




// -- Training Resources --
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
               handlePostFail(err);
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
              handlePostFail(err);
            });
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