function renderPlan(planid, data) {
    var name = '';
    var icons = '';
    
    $.each(data.assets, function(k, v) {
        if(name != '') name += ' + ';
        name += k;
        icons += `
            <img width="24" height="24" src="${v.icon_url}">
        `;
    });
    
    return `
	    <div class="col-12 plan-item">
	        <div class="p-2 p-lg-4 ui-card-light rounded">
	            <div class="row">
	                <div class="col-12 py-2">
                        <div class="row">
                            <div class="col-auto my-auto ms-auto">
		                        ${icons}
                            </div>
                            <div class="col-auto my-auto me-auto">
                                <h3 class="m-0">${name}</h3>
                            </div>
                        </div>
		            </div>
		            <div class="col-12 col-lg-6">
                        <div class="row">
                            <div class="col-12">
                                <input type="range" class="form-range" min="0" max="0" step="1" value="0">
                            </div>
                        </div>
		            </div>
		            <div class="col-12 col-lg-6">
                        <div class="row">
                            <div class="col-12 text-center">
                                <h5 class="secondary">
                                    Investment forecast
                                </h5>
                            </div>
                        </div>
		            </div>
	            </div>
	        </div>
	    </div>
	`;
}

$(document).ready(function() {
    window.renderingStagesTarget = 1;
    
    $.ajax({
        url: config.apiUrl + '/mining/plans',
        type: 'POST',
        contentType: "application/json",
        dataType: "json",
    })
    .retry(config.retry)
    .done(function (data) {
        if(data.success) {
            $.each(data.plans, function(k, v) {
                $('#plans-data').append(renderPlan(k, v));
            });
            
            $(document).trigger('renderingStage');
        }
        
        else {
            msgBoxRedirect(data.error);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(true);
    });
});