function renderContract(contract, ajaxScr) {
    var plan = window.plans[contract.planid];
    
    var name = '';
    var icons = '';
    
    $.each(plan.assets, function(k, v) {
        if(name != '') name += ' + ';
        name += v.name;
        icons += `
            <img width="24" height="24" src="${v.icon_url}">
        `;
    });
    
    var purchaseDate = new Date(contract.create_time * 1000);
    var endDate = new Date(contract.end_time * 1000);
    var units = contract.units;
    var unitName = plan.unit_name;
    var pricePaid = new BigNumber(contract.price_paid);
    
    //var daysNow = Math.round((new Date().getTime() - purchaseDate.getTime()) / (1000 * 3600 * 24));
    var daysTotal = Math.round((endDate.getTime() - purchaseDate.getTime()) / (1000 * 3600 * 24));
    
    var dailyRevDetailed = '';
    var dailyNative = new Object();
    var dailyRevEquiv = new BigNumber(0);
    var expectedRevDetailed = '';
    $.each(plan.assets, function(k, v) {
        var dailyNativeThis = new BigNumber(v.unit_avg_revenue);
        dailyNativeThis = dailyNativeThis.times(units);
        dailyNative[k] = dailyNativeThis;
        
        var dailyEquivThis = dailyNativeThis.times(v.asset_price_avg);
        dailyRevEquiv = dailyRevEquiv.plus(dailyEquivThis);
        
        dailyRevDetailed += dailyNativeThis.toFixed(v.prec)
                         + ' ' + k + '<br>';
        
        expectedRevDetailed += dailyNativeThis.times(daysTotal).toFixed(v.prec)
                            + ' ' + k + '<br>';
    });
    var expectedRevEquiv = dailyRevEquiv.times(daysTotal);
    
    var currentRevDetailed = '';
    var currentRevEquiv = new BigNumber(0);
    $.each(contract.revenue, function(k, v) {
        var currentNativeThis = new BigNumber(v);
        
        currentRevDetailed += currentNativeThis.toFixed(plan.assets[k].prec)
                           + ' ' + k + '<br>';
        
        var currentEquivThis = currentNativeThis.times(plan.assets[k].asset_price_avg);;
        currentRevEquiv = currentRevEquiv.plus(currentEquivThis);
    });
    
    var currentProfit = currentRevEquiv.minus(pricePaid);
    var currentProfitPerc = currentProfit.div(pricePaid).times(100);
    
    var expectedProfit = expectedRevEquiv.minus(pricePaid);
    var expectedProfitPerc = expectedProfit.div(pricePaid).times(100);
    
    var revenSeries = new Array();
    var profitSeries = new Array();
    
    var returnDate = null;
    
    for(var month = 0; month <= plan.months; month++) {
        var dateNow = new Date();
        var dateAt = new Date(purchaseDate);
        dateAt.setMonth(dateAt.getMonth() + month);
        
        dateNow = dateNow.getTime();
        dateAt = dateAt.getTime();
        
        var revenAt = null;
        
        if(dateAt < dateNow) {
            // (dateNow - purchaseDate)    ->    currentRevEquiv
            // (dateAt - purchaseDate)     ->    x
            // x = (dateAt - purchaseDate) * currentRevEquiv / (dateNow - purchaseDate)
            
            var multiplier = dateAt - purchaseDate.getTime();
            var divider = dateNow - purchaseDate.getTime();
             
            revenAt = currentRevEquiv.times(multiplier)
                                         .div(divider);     
        }
        
        else {
            // (endDate - purchaseDate)    ->    (expectedRevEquiv - currentRevEquiv)
            // (dateAt - purchaseDate)     ->    (x - currentRevEquiv)
            // x - currentRevEquiv = (dateAt - purchaseDate) * (expectedRevEquiv - currentRevEquiv) / (endDate - purchaseDate)
            // x = ((dateAt - purchaseDate) * (expectedRevEquiv - currentRevEquiv) / (endDate - purchaseDate)) + currentRevEquiv
            
            var mulA = new BigNumber(dateAt - purchaseDate.getTime());
            var mulB = expectedRevEquiv.minus(currentRevEquiv);
            var divider = endDate.getTime() - purchaseDate.getTime();
            
            revenAt = mulA.times(mulB)
                          .div(divider)
                          .plus(currentRevEquiv); 
        }
        
        var profitAt = revenAt.minus(pricePaid);       
        
        if(returnDate == null && profitAt.gt(0))
            returnDate = dateAt;
        
        revenSeries.push({
            x: dateAt,
            y: revenAt.toFixed(window.billingPrec)
        });
        
        profitSeries.push({
            x: dateAt,
            y: profitAt.toFixed(window.billingPrec)
        });
    }
    
    
    // dailyRevDetailed
    dailyRevEquiv = dailyRevEquiv.toFixed(window.billingPrec);
    // expectedRevDetailed
    expectedRevEquiv = expectedRevEquiv.toFixed(window.billingPrec);
    // currentRevDetailed
    currentRevEquiv = currentRevEquiv.toFixed(window.billingPrec);
    purchaseDate = purchaseDate.toLocaleDateString();
    endDate = endDate.toLocaleDateString();
    pricePaid = pricePaid.toFixed(window.billingPrec);
    currentProfit = currentProfit.toFixed(window.billingPrec);
    
    if(currentProfitPerc.gt(0))
        currentProfitPerc = '+' + currentProfitPerc.toFixed(2);
    else
        currentProfitPerc = currentProfitPerc.toFixed(2);
    expectedProfit = expectedProfit.toFixed(window.billingPrec);
    if(expectedProfitPerc.gt(0))
        expectedProfitPerc = '+' + expectedProfitPerc.toFixed(2);
    else
        expectedProfitPerc = expectedProfitPerc.toFixed(2);
    
    ajaxScr.append(`
	    <div class="col-12 contract-item mb-4" data-contractid="${contract.contractid}">
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
                                        <br>
                                        <i class="small">(${currentProfitPerc}%)</i>
                                    </div>
                                    <div class="col-4 pb-4">
                                        ${expectedProfit} ${window.billingAsset}
                                        <br>
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
    
    var series = [
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
    chart.render();
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