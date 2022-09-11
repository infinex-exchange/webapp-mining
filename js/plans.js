function renderPlan(planid, data) {
    var header = '';
    
    $.each(data.assets, function(k, v) {
        if(header != '')
            header += `
                <h3 class="d-inline m-0"> + </h3>
            `;
        
        header += `
            <img width="24" height="24" src="${v.icon_url}">
            <h3 class="d-inline m-0">${k}</h3>
        `;
    });
    
    return `
	    <div class="col-12 plan-item">
	        <div class="p-2 p-lg-4 ui-card-light rounded">
	            <div class="row">
	                <div class="col-12 py-2 text-center">
                        <div class="row">
                            <div class="col-auto my-auto ms-auto">
		                        ${header}
                            </div>
                            <div class="col-auto my-auto me-auto">
                                
                            </div>
                        </div>
		            </div>
		            <div class="col-12">
                        <input type="range" class="form-range" min="0" max="0" step="1" value="0">
		            </div>
		            <div class="col-4">
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