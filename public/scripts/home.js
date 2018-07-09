'use strict'
let newAnnouncement;
let newErr;
let dispLimit;

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
           let dispAnnouncement = data.map(generateAnnouncement);
            // --- Most Recent Announcements on Top -- Limit = 3 
           dispAnnouncement.reverse();
           dispLimit = dispAnnouncement.slice(0,3);
           dispLimit.join('');
           $('#js-announcement').html(dispLimit);
        }
    }
        return $.ajax(settings)
        .fail(function (err){
            generateErrorMessage(err);
            clearForm();
    });
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
                console.log(err);
                clearForm();
            });
        });
}

function generateAnnouncement(data){
    let date = convertDate(data.created);
    newAnnouncement = `
    <div id = '${data._id}' class='media text-muted pt-3'>
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
    $('#js-announcement').prepend(newAnnouncement);
}

function deleteAnnouncement(){
    $('.deleteButton').click(event => {
        event.preventDefault();
        $(event.currentTarget).parent("id")
    })

        
        
/*         const settings = {
            url: '/api/announcements/',
            dataType: 'json',
            type: 'DELETE',
            success: function(data){

        

    }) */
}

function editAnnouncement(){

}

function onLoad(){
    displayAnnouncements();
    listenAnnouncement();
    deleteAnnouncement();
}




$(onLoad);