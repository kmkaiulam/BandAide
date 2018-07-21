'use strict'


//--- Announcements ---
  function displayAnnouncements(){
    const settings = {
        url: url.announcements,
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

//--- Bandposts ---
function displayEventBandposts(){
    const settings = {
        url: url.events,
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

function displayTrainingBandposts(){
    const settings = {
        url: url.training,
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

function displayInDom(){
    displayAnnouncements();
    displayEventBandposts();
    displayTrainingBandposts();
}

$(displayInDom)