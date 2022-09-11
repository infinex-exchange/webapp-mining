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
	                <div class="col-12 py-2 text-center">
		                ${icons}
                        <h3 class="d-inline">${name}</h3>
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