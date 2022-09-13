$(document).ready(function() {
    window.renderingStagesTarget = 1;
});

$(document).on('authChecked', function() {
    if(window.loggedIn) {
        /*$.ajax({
            url: config.apiUrl + '/account/api_keys/list',
            type: 'POST',
            data: JSON.stringify({
                api_key: window.apiKey
            }),
            contentType: "application/json",
            dataType: "json",
        })
        .retry(config.retry)
        .done(function (data) {
            if(data.success) {
                $.each(data.sessions, function(sid, v) {
                    addChangeApiKey(sid, v.api_key, v.description); 
                });
                        
                $(document).trigger('renderingStage');
            } else {
                msgBoxRedirect(data.error);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            msgBoxNoConn(true);
        });*/
        $(document).trigger('renderingStage');
    }
});