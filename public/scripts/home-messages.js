'use strict'
// --- Common Functions ---
function convertDate(date){
    return new Date(date).toDateString();
}

function defineDate(post){
    let newDate;
    newDate =`posted on ${convertDate(post.created)}`
    if (post.modified != null){
        newDate = `modified on ${convertDate(post.modified)}`;
    }
    return newDate;
}

function defineReplyDate(reply){
    let newReplyDate;
    newReplyDate = `replied on ${convertDate(reply.created)}`
    return newReplyDate;
}

// --- Message Partials Generation ---
function generateReply(reply){
    let newReplyDate = defineReplyDate(reply)
    let newReply = `<div class = 'container-fluid col-9 border border-black mr-3 js-reply-modify'>
                        <div><strong class='d-block text-gray-dark'>#${reply.createdBy.username} ${newReplyDate}</strong></div>
                        <h3> ${reply.topic}</h3>
                        <p>${reply.reply}</p>
                        <div class='btn-group d-flex flex-row-reverse mb-2' role='group' aria-label='Button Group'>
                            <button aria-label= 'delete reply' type='button' data-replyid = '${reply._id}'  data-userId= '${reply.createdBy._id}' class='btn btn-outline-secondary deleteReplyButton dataIdButton'><i data-replyid = '${reply._id}' data-userId= '${reply.createdBy._id}' class='far fa-trash-alt'></i> 
                        </div>
                    </div>`
    return newReply
};

function generateCollapsedReplies(post){
    let repliesString = post.replies.map(reply => {
        return generateReply(reply)
    }).join('');

    let collapse = `<div class='collapse bg-light' id='${post._id}replyCollapse'>  
                        <div class = 'row mb-0'> 
                            <h3 class = 'jumbotron jumbotron-fluid replySection'>@Reply</h3>
                            ${repliesString}
                        </div>
                        <div id = 'js-reply-${post._id}' class = 'js-bandpost-reply replyAppend'></div>
                        <div class='btn-group d-flex flex-row-reverse bg-light ml-2' role='group' aria-label='Button Group'> 
                            <button aria-label= 'reply button' type='button' data-id = '${post._id}' data-userId= '${post.createdBy._id}' class='btn btn-outline-warning mr-3 mt-4 replyButton dataIdButton' data-toggle='modal' data-target='#replyModal' data-toggle='tooltip' title='Add a New Reply'><i data-id = '${post._id}' data-userId= '${post.createdBy._id}' class='fas fa-reply'></i></button>
                        </div>
                    </div>`          
    return collapse;
}

function generateVideo(post){
    let video='';
    if (post.posttype === 'Training_Resource' && post.youtubeLink != ''){
        video = `<div class='borderless-card borderless-card-body video'>
                    <button aria-label= 'play video' class = 'container-youtube btn btn-danger btn' data-toggle='tooltip' title='Play Video'><i  class='fab fa-youtube-square'></i></button>
                    <div id ='player-${post._id}' class= 'plyer borderless-card borderless-card-body' data-plyr-provider='youtube' data-plyr-embed-id='${post.youtubeLink}'></div>
                 </div>`
    }
    return video;
};
function generateModifyButtons(post){
    let modifyButtons;
    let modalTarget;
    if (post.posttype === 'Event_Eval'){
        modalTarget = 'editEventsModal';
    }
    else{
        modalTarget = 'editTrainingModal';
    }

    if (post.replies.length === 0){
        modifyButtons = `<div class='btn-group d-flex flex-row-reverse' role='group' aria-label='Button Group'>
                            <button aria-label= 'delete bandpost button' type='button' data-id = '${post._id}' data-userId= '${post.createdBy._id}' class='btn btn-outline-secondary mr-2 deleteBandpostButton dataIdButton' data-toggle='tooltip' title='Delete'><i data-id = '${post._id}' data-userId= '${post.createdBy._id}' class='far fa-trash-alt'></i>
                            <button aria-label= 'edit bandpost button' type='button' data-id = '${post._id}' data-userId= '${post.createdBy._id}' class='btn btn-outline-primary mr-2 editButton dataIdButton' data-toggle='modal' data-toggle='tooltip' title='Edit' data-target='#${modalTarget}'><i data-id = '${post._id}' data-userId= '${post.createdBy._id}' class='far fa-edit'></i></button>
                            <button aria-label= 'reply collapse button' type='button' data-id = '${post._id}' data-userId= '${post.createdBy._id}' class='btn btn-outline-success mr-2 showRepliesButton'  data-toggle='collapse'  data-target='#${post._id}replyCollapse' data-toggle='tooltip' title='Replies' aria-expanded='false' aria-controls='${post._id}replyCollapse'><i data-id = '${post._id}' data-userId= '${post.createdBy._id}' class='far fa-comments'></i></button>
                        </div>`
    }
    else{
// Conditional Disabling Edit if Post has replies
    modifyButtons = `<div class='btn-group d-flex flex-row-reverse' role='group' aria-label='Button Group'>
                        <button aria-label= 'delete bandpost button' type='button' data-id = '${post._id}' data-userId= '${post.createdBy._id}' class='btn btn-outline-secondary mr-2 deleteBandpostButton dataIdButton'data-toggle='tooltip' title='Delete'><i data-id = '${post._id}' data-userId= '${post.createdBy._id}' class='far fa-trash-alt'></i>
                        <button aria-label= 'edit bandpost button'  hidden type='button' data-id = '${post._id}' data-userId= '${post.createdBy._id}' class=' btn btn-outline-primary mr-2 editButton dataIdButton' data-toggle='modal' data-toggle='tooltip' title='Edit' data-target='#${modalTarget}'><i data-id = '${post._id}' data-userId= '${post.createdBy._id}' class='far fa-edit disabled'></i></button>
                        <button aria-label= 'reply collapse button' type='button' data-id = '${post._id}' data-userId= '${post.createdBy._id}' class='btn btn-outline-success mr-2 showRepliesButton' data-toggle='collapse' data-target='#${post._id}replyCollapse' data-toggle='tooltip' title='Replies' aria-expanded='false' aria-controls='${post._id}replyCollapse'><i data-id = '${post._id}' data-userId= '${post.createdBy._id}' class='far fa-comments'></i></button>
                    </div>`
    }
    return modifyButtons
};

 // --- Post Generation ---

function generateAnnouncementPost(announcement){
    let newDate = defineDate(announcement); 
    let newAnnouncement =  `<div data-id = '${announcement._id}' class = 'js-announcement data'>
                                <div class='media  pt-1'>
                                <div class ='media-body pb-3 mb-0  border-bottom border-top border-gray'>
                                    <p><strong class='d-block text-gray-dark'>#${announcement.createdBy.username} ${newDate}</strong> 
                                    ${announcement.text}
                                    </p>
                                    <div class='btn-group d-flex flex-row-reverse' role='group' aria-label='Button Group'>
                                        <button aria-label= 'delete announcement button' type='button' data-id = '${announcement._id}' data-userId= '${announcement.createdBy._id}' class='btn btn-outline-secondary mr-2 deleteAnnouncementButton dataIdButton' data-toggle='tooltip' title='Delete'><i data-id = '${announcement._id}' data-userId= '${announcement.createdBy._id}' class='far fa-trash-alt'></i></button>
                                        <button aria-label= 'edit announcement button' type='button' data-id = '${announcement._id}' data-userId= '${announcement.createdBy._id}' class='btn btn-outline-primary mr-2 editButton dataIdButton' data-toggle='modal' data-target='#editAnnModal' data-toggle='tooltip' title='Edit'><i data-id = '${announcement._id}' data-userId= '${announcement.createdBy._id}' class='far fa-edit'></i></button>
                                    </div>
                                </div>
                            </div>`
    return newAnnouncement
};

function generateBandpost(post){
    let newDate = defineDate(post)
    let video =  generateVideo(post)
    let modifyButtons = generateModifyButtons(post);
    let collapse = generateCollapsedReplies(post)
    
    let newBandpost =  `<div data-id = '${post._id}' class = 'js-bandpost-update data'>
                            <div class='media pt-1'>
                                <div class ='media-body pb-3 mb-0  border border-gray'>
                                    <div class = 'container'>
                                        <div><strong class='d-block text-gray-dark'>#${post.createdBy.username} ${newDate}</strong></div>
                                        <h3> ${post.topic}</h3>
                                        <div class = 'd-flex align-items-center justify-content-center'>${video} </div>
                                        <p>${post.description}</p>
                                    </div>
                                    ${modifyButtons}
                                    </div>
                                </div>
                                ${collapse}
                            </div> 
                        </div>` 
    return newBandpost;
};

// --- Display Recent and Collapsed Posts ---
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
};   

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
            };         
        }; 
};    