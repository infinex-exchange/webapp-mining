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
    
    $('#plans-data').append(`
	    <div class="col-12 plan-item" data-planid="${planid}">
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
                            <div class="forecast-chart"></div>
                        </div>
		            </div>
	            </div>
	        </div>
	    </div>
	`);
    
    
    var options = {
        series: [
            {
                name: 'Peter',
                data: [5, 5, 10, 8, 7, 5, 4, null, null, null, 10, 10, 7, 8, 6, 9]
            },
            {
                name: 'Johnny',
                data: [10, 15, null, 12, null, 10, 12, 15, null, null, 12, null, 14, null, null, null]
            },
            {
                name: 'David',
                data: [null, null, null, null, 3, 4, 1, 3, 4,  6,  7,  9, 5, null, null, null]
            }
        ],
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false
            }
        },
        stroke: {
            width: [5,5,4],
            curve: 'straight'
        },
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    };

    var chart = new ApexCharts($('.plan-item[data-planid="' + planid + '"] .forecast-chart')[0], options);
    chart.render();
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
                renderPlan(k, v);
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