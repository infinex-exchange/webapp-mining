function renderContract(contract, ajaxScr) {
    var plan = window.plans[contract.planid];
    
    var name = '';
    var icons = '';
    
    $.each(contract.assets, function(k, v) {
        if(name != '') name += ' + ';
        name += v.name;
        icons += `
            <img width="24" height="24" src="${v.icon_url}">
        `;
    });
    
    var purchaseDate = new Date(contract.create_time * 1000).toLocaleDateString();
    var endDate = new Date(contract.end_time * 1000).toLocaleDateString();
    var units = contract.units;
    var unitName = plan.unit_name;
    var pricePaid = contract.price_paid;
    
    var dailyRevDetailed = 'ab';
    var dailyRevEquiv = '10';
    var currentRevDetailed = 'as';
    var currentRevEquiv = '34';
    var expectedRevDetailed = 'ag';
    var expectedRevEquiv = '50';
    var currentProfit = '10';
    var currentProfitPerc = '-3';
    var expectedProfit = '90';
    var expectedProfitPerc = '12';
    
    ajaxScr.append(`
	    <div class="col-12 contract-item" data-contractid="${contract.contractid}">
	        <div class="p-2 p-lg-4 ui-card-light rounded">
	            <div class="row">
	                <div class="col-12 pt-2 pb-4">
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
                            <div class="col-12 py-4">
                                <div class="row">
                                    <div class="col-4">
                                        <h4 class="secondary">
                                            Purchase date
                                        </h4>
                                    </div>
                                    <div class="col-4">
                                        <h4 class="secondary">
                                            End date
                                        </h4>
                                    </div>
                                    <div class="col-4">
                                        <h4 class="secondary">
                                            Power
                                        </h4>
                                    </div>
                                    
                                    <div class="col-4 pb-4">
                                        ${purchaseDate}
                                    </div>
                                    <div class="col-4 pb-4">
                                        ${endDate}
                                    </div>
                                    <div class="col-4 pb-4">
                                        ${units} ${unitName}
                                    </div>
                                    
                                    <div class="col-4">
                                        <h4 class="secondary">
                                            Daily revenue
                                        </h4>
                                    </div>
                                    <div class="col-4">
                                        <h4 class="secondary">
                                            Current revenue
                                        </h4>
                                    </div>
                                    <div class="col-4">
                                        <h4 class="secondary">
                                            Expected revenue
                                        </h4>
                                    </div>
                                    
                                    <div class="col-4 pb-4">
                                        ${dailyRevDetailed}
                                        <i class="small">(${dailyRevEquiv} ${window.billingAsset})</i>
                                    </div>
                                    <div class="col-4 pb-4">
                                        ${currentRevDetailed}
                                        <i class="small">(${currentRevEquiv} ${window.billingAsset})</i>
                                    </div>
                                    <div class="col-4 pb-4">
                                        ${expectedRevDetailed}
                                        <i class="small">(${expectedRevEquiv} ${window.billingAsset})</i>
                                    </div>
                                    
                                    <div class="col-4">
                                        <h4 class="secondary">
                                            Price paid
                                        </h4>
                                    </div>
                                    <div class="col-4">
                                        <h4 class="secondary">
                                            Current profit
                                        </h4>
                                    </div>
                                    <div class="col-4">
                                        <h4 class="secondary">
                                            Expected profit
                                        </h4>
                                    </div>
                                    
                                    <div class="col-4 pb-4">
                                        ${pricePaid} ${window.billingAsset}
                                    </div>
                                    <div class="col-4 pb-4">
                                        ${currentProfit} ${window.billingAsset}
                                        <i class="small">(${currentProfitPerc}%)</i>
                                    </div>
                                    <div class="col-4 pb-4">
                                        ${expectedProfit} ${window.billingAsset}
                                        <i class="small">(${expectedProfitPerc}%)</i>
                                    </div>
                                </div>
                            </div>
                        </div>
		            </div>
		            <div class="col-12 col-lg-6 pt-4">
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
    
    /*var labels = new Array();
    for(var i = 0; i <= data.months; i++)
        labels.push(i);
    
    var options = {
        series: [],
        chart: {
            height: 300,
            type: 'area',
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false
            },
            background: $(':root').css('--color-bg-light')
        },
        stroke: {
            curve: 'straight'
        },
        xaxis: {
            type: 'datetime'
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return value + ' ' + window.billingAsset;
                }
            }
        },
        noData: {
            text: 'Loading...'
        },
        dataLabels: {
            enabled: false
        },
        theme: {
	        mode: 'dark'
	    }
    };
    
    var item = $('.plan-item[data-planid="' + planid + '"]');

    window.charts[planid] = new ApexCharts(item.find('.forecast-chart')[0], options);
    window.charts[planid].render();
    
    item.find('.form-range').trigger('input');*/
}

$(document).ready(function() {
    window.renderingStagesTarget = 2;
});

$(document).on('authChecked', function() {
    if(window.loggedIn) {
        $.ajax({
            url: config.apiUrl + '/mining/plans',
            type: 'POST',
            contentType: "application/json",
            dataType: "json",
        })
        .retry(config.retry)
        .done(function (data) {
            if(data.success) {
                window.plans = data.plans;
                window.billingAsset = data.billing_asset;
                window.billingPrec = data.billing_prec;
                
                $(document).trigger('renderingStage').trigger('plansFetched');
            }
            
            else {
                msgBoxRedirect(data.error);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            msgBoxNoConn(true);
        });
    }
});

$(document).on('plansFetched', function() {
        window.contractsAS = new AjaxScroll(
            $('#contracts-data'),
            $('#contracts-data-preloader'),
            {
                api_key: window.apiKey
            },
                function() {
                    
                    //---
                    this.data.offset = this.offset;
                    var thisAS = this;
        
                    $.ajax({
                        url: config.apiUrl + '/mining/contracts',
                        type: 'POST',
                        data: JSON.stringify(thisAS.data),
                        contentType: "application/json",
                        dataType: "json",
                    })
                    .retry(config.retry)
                    .done(function (data) {
                        if(data.success) {
                            $.each(data.contracts, function(k, v) {
                               renderContract(v, thisAS);
                            });
                            
                            thisAS.done();
                            
                            if(thisAS.offset == 0)
                                $(document).trigger('renderingStage');
                            
                            if(data.contracts.length != 50)
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
                
                    //---
                    
                },
            true,
            true
        );
});