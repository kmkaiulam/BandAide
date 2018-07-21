'use strict'
// --- Common Functions ---
function convertDate(date){
    return new Date(date).toDateString();
}
function defineDate(post){
    let newDate;
    
    newDate =`posted on ${convertDate(post.created)}`
    if (post.modified != null) {
        newDate = `modified on ${convertDate(post.modified)}`;
    }
   
    return newDate;
}
function defineReplyDate(reply){
    let newReplyDate;
   // console.log(data);
    newReplyDate = `replied on ${convertDate(reply.created)}`
   return newReplyDate;
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

function generateAnnouncementPost(announcement){
    let newDate = defineDate(announcement); 
       let newAnnouncement = `
        <div data-id = '${announcement._id}' class = 'js-announcement-update data'>
            <div class='media  pt-1 announcement-post'>
                <img data-src='holder.js/32x32?theme=thumb&bg=007bff&fg=007bff&size=1' alt='' class='mr-2 rounded'>
                    <div class ='media-body pb-3 mb-0  border-bottom border-gray'>
                        <p><strong class='d-block text-gray-dark'>#${announcement.createdBy.username} ${newDate}</strong> 
                        ${announcement.text}
                        </p>
                    <div class='btn-group d-flex flex-row-reverse' role='group' aria-label='Button Group'>
                        <button type='button' data-id = '${announcement._id}' data-userId= '${announcement.createdBy._id}' class='btn btn-outline-secondary mr-2 deleteAnnouncementButton dataIdButton'><i data-id = '${announcement._id}' data-userId= '${announcement.createdBy._id}' class='far fa-trash-alt'></i></button>
                        <button type='button' data-id = '${announcement._id}' data-userId= '${announcement.createdBy._id}' class='btn btn-outline-primary mr-2 editButton dataIdButton' data-toggle='modal' data-target='#editAnnModal'><i data-id = '${announcement._id}' data-userId= '${announcement.createdBy._id}' class='far fa-edit'></i></button>
                    </div>
            </div>
        </div>`
    return newAnnouncement
};

  
function generateBandpost(post){
   // console.log(post);
    let repliesString = post.replies.map(reply => {
        return generateReply(reply)
    }).reverse().join('');
    let newDate = defineDate(post)
    let video='';
    let modalTarget;
    let newBandpost;
    
    if (post.posttype === 'Event_Eval'){
        modalTarget = 'editEventsModal';
    }    
    if (post.posttype === 'Training_Resource' && post.youtubeLink != ''){
        modalTarget = 'editTrainingModal'
        video = `<div class = ' align-items-center justify-content-center'> 
        <video id = '${post.id}'  class ='video-js vjs-default-skin' controls= 'true' preload = 'true'   width='640' height='264' 
        post-setup='{ "techOrder": ["youtube"], "sources": [{ "type": "video/youtube", "src": "${post.youtubeLink}"}] }'>
        </video>
        </div>`;    
    }
    if (post.posttype === 'Training_Resource' && post.youtubeLink === ''){
        modalTarget ='editTrainingModal'
    }
            
    newBandpost = ` 
    <div data-id = '${post._id}' class = 'js-bandpost-update data'>
        <div class='media pt-1 bandpost-post'>
            <img data-src='holder.js/32x32?theme=thumb&bg=007bff&fg=007bff&size=1' alt='' class='mr-2 rounded'>
            <div class ='media-body pb-3 mb-0  border border-gray'>
               
                <div class = 'container'>
                    <div><strong class='d-block text-gray-dark'>#${post.createdBy.username} ${newDate}</strong></div>
                    <h3> ${post.topic}</h3>
                    <div class = 'd-flex align-items-center justify-content-center'>${video} </div>
                    <p>${post.description}</p>
                </div>
           
                <div class='btn-group d-flex flex-row-reverse' role='group' aria-label='Button Group'>
                    <button type='button' data-id = '${post._id}' data-userId= '${post.createdBy._id}' class='btn btn-outline-secondary mr-2 deleteBandpostButton dataIdButton'><i data-id = '${post._id}' data-userId= '${post.createdBy._id}' class='far fa-trash-alt'></i>
                    <button type='button' data-id = '${post._id}' data-userId= '${post.createdBy._id}' class='btn btn-outline-primary mr-2 editButton dataIdButton' data-toggle='modal' data-target='#${modalTarget}'><i data-id = '${post._id}' data-userId= '${post.createdBy._id}' class='far fa-edit'></i></button>
                    <button type='button' data-id = '${post._id}' data-userId= '${post.createdBy._id}' class='btn btn-outline-success mr-2 showRepliesButton' data-toggle='collapse' data-target='#${post._id}replyCollapse' aria-expanded='false' aria-controls='${post._id}replyCollapse'><i data-id = '${post._id}' data-userId= '${post.createdBy._id}' class='far fa-comments'></i></button>
                </div>
            </div>
         </div>
         
    
        <div class='collapse bg-light ml-2' id='${post._id}replyCollapse'>  
            <div class = 'row mb-0'> 
                <h3 class = 'jumbotron jumbotron-fluid replySection'>@Reply</h3>
                ${repliesString}
            </div>
            
            <div id = 'js-reply-${post._id}' class = 'js-bandpost-reply replyAppend'></div>
            <div class='btn-group d-flex flex-row-reverse bg-light ml-2' role='group' aria-label='Button Group'> 
                <button type='button' data-id = '${post._id}' data-userId= '${post.createdBy._id}' class='btn btn-outline-warning mr-3 mt-4 replyButton dataIdButton' data-toggle='modal' data-target='#replyModal'><i data-id = '${post._id}' data-userId= '${post.createdBy._id}' class='fas fa-reply'></i></button>
            </div>
        </div>
    </div>` 
    return newBandpost;
};





function generateReply(reply){
    let newReplyDate = defineReplyDate(reply)
    let newReply = `<div class = 'js-reply-edit container-fluid col-9 border border-black mr-3'>
                        <div class = 'js-reply-modify'>
                            <div><strong class='d-block text-gray-dark'>#${reply.createdBy.username} ${newReplyDate}</strong></div>
                            <h3> ${reply.topic}</h3>
                            <p>${reply.reply}</p>
                            <div class='btn-group d-flex flex-row-reverse mb-2' role='group' aria-label='Button Group'>
                                <button type='button' data-replyid = '${reply._id}'  data-userId= '${reply.createdBy._id}' class='btn btn-outline-secondary deleteReplyButton dataIdButton'><i data-replyid = '${reply._id}' data-userId= '${reply.createdBy._id}' class='far fa-trash-alt'></i> 
                            </div>
                        </div>
                    </div>`
                
    return newReply
};

