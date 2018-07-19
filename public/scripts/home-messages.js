'use strict'
// --- Common Functions ---
function convertDate(date){
    return new Date(date).toDateString();
}
function defineDate(data){
    let newDate;
    if (data.modified != '') {
        newDate = `edited on ${convertDate(data.modified)}`;
    }
    else{
        newDate =`posted on ${convertDate(data.created)}`;
    }
    return newDate;
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
    let newDate = defineDate(data); 
       let newAnnouncement = `
        <div class = 'js-announcement-update'>
            <div class='media text-muted pt-1 announcement-post'>
                <img data-src='holder.js/32x32?theme=thumb&bg=007bff&fg=007bff&size=1' alt='' class='mr-2 rounded'>
                    <div class ='media-body pb-3 mb-0 small lh-125 border-bottom border-gray'>
                        <p><strong class='d-block text-gray-dark'>@${data.createdBy.username} ${newDate}</strong> 
                        ${data.text}
                        </p>
                    <div class="btn-group d-flex flex-row-reverse" role="group" aria-label="Button Group">
                        <button type='button' data-id = '${data._id}' data-userId= '${data.createdBy._id}' class='btn btn-outline-secondary mr-2 deleteAnnouncementButton'><i data-id = '${data._id}' data-userId= '${data.createdBy._id}' class="far fa-trash-alt"></i></button>
                        <button type='button' data-id = '${data._id}' data-userId= '${data.createdBy._id}' class='btn btn-outline-primary mr-2 editButton' data-toggle='modal' data-target='#editAnnModal'><i data-id = '${data._id}' data-userId= '${data.createdBy._id}' class="far fa-edit"></i></button>
                    </div>
            </div>
        </div>`
    return newAnnouncement
};
  
function generateBandpost(data){
    let newDate = defineDate(data)
    let video ='';
    let modalTarget;
    let newBandpost;
    
    if (data.posttype === 'Event_Eval'){
        modalTarget = 'editEventsModal';
    }    
    if (data.posttype === 'Training_Resource' && data.youtubeLink != ''){
        modalTarget = 'editTrainingModal'
        video = `<div class = ' align-items-center justify-content-center'> 
        <video id = 'video-${data._id}'  class ='video-js vjs-default-skin' controls= 'true' preload = 'true'   width='640' height='264' 
        data-setup='{ "techOrder": ["youtube"], "sources": [{ "type": "video/youtube", "src": "${data.youtubeLink}"}] }'>
        </video>
        </div>`;    
    }
    if (data.posttype === 'Training_Resource' && data.youtubeLink === ''){
        modalTarget ='editTrainingModal'
    }
            
    newBandpost = ` 
    <div class = 'js-bandpost-update'>
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
                    <button type='button' data-id = '${data._id}' data-userId= '${data.createdBy._id}' class='btn btn-outline-success mr-2 replyButton' data-toggle="collapse" data-target="#collapseReply${data._id}" aria-expanded="false" aria-controls="collapseReply${data._id}"><i data-id = '${data._id}' data-userId= '${data.createdBy._id}' class='fas fa-reply'></i></button>
                </div>
            </div>
        
            <div class="collapse" id="#collapseReply${data._id}"> 
                <div id = bandpost${data._id}> 8</div>
            </div>
        </div>
    </div>` 
    return newBandpost;
};