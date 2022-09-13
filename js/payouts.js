function renderPayoutItem(data) {     
    var cTime = new Date(data.create_time * 1000).toLocaleString();
    
    return `
        Payout
    `;
}

$(document).ready(function() {
    window.renderingStagesTarget = 1;
});

$(document).on('authChecked', function() {
    if(window.loggedIn) {
        window.payoutsAS = new AjaxScroll(
            $('#payouts-data'),
            $('#payouts-data-preloader'),
            {
                api_key: window.apiKey
            },
            function() {
                this.data.offset = this.offset;
                var thisAS = this;
                    
                $.ajax({
                    url: config.apiUrl + '/mining/payouts',
                    type: 'POST',
                    data: JSON.stringify(thisAS.data),
                    contentType: "application/json",
                    dataType: "json",
                })
                .retry(config.retry)
                .done(function (data) {
                    if(data.success) {
                        $.each(data.payouts, function() {
                            thisAS.append(renderTxHistoryItem(this));
                        });
                        
                        thisAS.done();
                    
                        if(thisAS.offset == 0)
                            $(document).trigger('renderingStage');
                            
                        if(data.transactions.length != 50)
                            thisAS.noMoreData();
                    }
                    else {
                        msgBoxRedirect(data.error);
                        thisAS.done();
                        thisAS.noMoreData();
                    }
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    msgBoxNoConn(true);
                    thisAS.done();
                    thisAS.noMoreData();
                });
            },
            true,
            true
        );
    }
});