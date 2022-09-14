function renderDashboardPlan(planid, item) {
    var plan = window.plans[planid];
    
    var name = '';
    var icons = '';
    
    $.each(plan.assets, function(k, v) {
        if(name != '') name += ' + ';
        name += v.name;
        icons += `
            <img width="24" height="24" src="${v.icon_url}">
        `;
    });
    
    var units = item.units;
    var unitName = plan.unit_name;
    var pricePaid = new BigNumber(item.sum_payments);
    
    var dailyRevDetailed = '';
    var dailyRevEquiv = new BigNumber(0);
    $.each(plan.assets, function(k, v) {
        var dailyNativeThis = new BigNumber(v.unit_avg_revenue);
        dailyNativeThis = dailyNativeThis.times(units);
        
        var dailyEquivThis = dailyNativeThis.times(v.asset_price_avg);
        dailyRevEquiv = dailyRevEquiv.plus(dailyEquivThis);
        
        dailyRevDetailed += dailyNativeThis.toFixed(v.prec)
                         + ' ' + k + '<br>';
    });
    
    var currentRevDetailed = '';
    var currentRevEquiv = new BigNumber(0);
    $.each(item.revenue, function(k, v) {
        var currentNativeThis = new BigNumber(v);
        
        currentRevDetailed += currentNativeThis.toFixed(plan.assets[k].prec)
                           + ' ' + k + '<br>';
        
        var currentEquivThis = currentNativeThis.times(plan.assets[k].asset_price_avg);;
        currentRevEquiv = currentRevEquiv.plus(currentEquivThis);
    });
    
    var currentProfit = currentRevEquiv.minus(pricePaid);
    var currentProfitPerc = currentProfit.div(pricePaid).times(100);
    
    
    // dailyRevDetailed
    dailyRevEquiv = dailyRevEquiv.toFixed(window.billingPrec);
    // currentRevDetailed
    currentRevEquiv = currentRevEquiv.toFixed(window.billingPrec);
    pricePaid = pricePaid.toFixed(window.billingPrec);
    currentProfit = currentProfit.toFixed(window.billingPrec);
    
    if(currentProfitPerc.gt(0))
        currentProfitPerc = '+' + currentProfitPerc.toFixed(2);
    else
        currentProfitPerc = currentProfitPerc.toFixed(2);
    
    $('#dashboard-data').append(`
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
		            <div class="col-12 py-4">
                        <div class="row">
                                    <div class="col-4 col-lg-2">
                                        <h4 class="secondary">
                                            Status
                                        </h4>
                                    </div>
                                    <div class="col-4 col-lg-2">
                                        <h4 class="secondary">
                                            Power
                                        </h4>
                                    </div>
                                    <div class="col-4 col-lg-2">
                                        <h4 class="secondary">
                                            Purchases sum
                                        </h4>
                                    </div>
                                    <div class="col-4 col-lg-2">
                                        <h4 class="secondary">
                                            Daily revenue
                                        </h4>
                                    </div>
                                    <div class="col-4 col-lg-2">
                                        <h4 class="secondary">
                                            Current revenue
                                        </h4>
                                    </div>
                                    <div class="col-4 col-lg-2">
                                        <h4 class="secondary">
                                            Current profit
                                        </h4>
                                    </div>
                                    
                                    <div class="col-4 pb-4">
                                        Active
                                    </div>
                                    <div class="col-4 pb-4">
                                        ${units} ${unitName}
                                    </div>
                                    <div class="col-4 pb-4">
                                        ${units} ${unitName}
                                    </div>
                                     <div class="col-4 pb-4">
                                        ${pricePaid} ${window.billingAsset}
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
                                        ${currentProfit} ${window.billingAsset}
                                        <br>
                                        <i class="small">(${currentProfitPerc}%)</i>
                                    </div>
                        </div>
		            </div>
		            <div class="col-12 col-lg-6 pt-4">
                        <div class="row">
                            <div class="col-12 text-center">
                                <h5 class="secondary">
                                    Power history
                                </h5>
                            </div>
                            <div class="power-chart"></div>
                        </div>
		            </div>
                    <div class="col-12 col-lg-6 pt-4">
                        <div class="row">
                            <div class="col-12 text-center">
                                <h5 class="secondary">
                                    Daily revenue
                                </h5>
                            </div>
                            <div class="revenue-chart"></div>
                        </div>
		            </div>
	            </div>
	        </div>
	    </div>
	`);
    
    /*var series = [
        {
	        name: 'Revenue',
            data: revenSeries
	    },
        {
            name: 'Profit',
            data: profitSeries
        }
    ];
    
    var options = {
        series: series,
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
	    },
        annotations: {
            xaxis: [
                {
                    x: new Date().getTime(),
                    label: {
                        show: true,
                        text: 'Now',
                        style: {
                            color: '#fff',
                            background: '#775DD0'
                        },
                        textAnchor: 'start'
                    }
                },
                {
                    x: returnDate,
                    label: {
                        show: true,
                        text: 'Return',
                        style: {
                            color: '#fff',
                            background: '#775DD0'
                        },
                        textAnchor: 'start'
                    }
                }
            ]
        }
    };
    
    var item = $('.contract-item[data-contractid="' + contract.contractid + '"]');
    var chart = new ApexCharts(item.find('.forecast-chart')[0], options);
    chart.render();*/
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
    $.ajax({
        url: config.apiUrl + '/mining/dashboard',
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
            $.each(data.dashboard, function(k, v) {
                renderDashboardPlan(k, v); 
            });
                    
            $(document).trigger('renderingStage');
        } else {
            msgBoxRedirect(data.error);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(true);
    });
});