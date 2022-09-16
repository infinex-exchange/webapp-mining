function renderPayoutItem(data) {     
    var cTime = new Date(data.time * 1000).toLocaleString();
    
    return `
        <div class="row p-2 hoverable">
            <div class="col-3 d-none d-lg-block">
                ${cTime}
            </div>
            <div class="col-3 d-none d-lg-block">
                ${data.assetid}
            </div>
            <div class="col-3 d-none d-lg-block text-end">
                ${data.amount}
            </div>
            <div class="col-3 d-none d-lg-block text-end">
                ${data.units_owned} ${data.unit_name}
            </div>
            <div class="col-6 d-lg-none">
                <small class="secondary">
                    ${data.cTime}
                </small>
                <br>
                ${data.units_owned} ${data.unit_name}
            </div>
            <div class="col-6 d-lg-none text-end">
                <strong>+${data.amount} ${data.assetid}</strong>
            </div>
        </div>
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
                            thisAS.append(renderPayoutItem(this));
                        });
                        
                        thisAS.done();
                    
                        if(thisAS.offset == 0)
                            $(document).trigger('renderingStage');
                            
                        if(data.payouts.length != 50)
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