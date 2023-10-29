window.billingAsset = '';
window.billingPrec = 0;
window.charts = {};
window.renderingStagesTarget = 1;

function renderPlan(data) {
    let icons = '';
    
    for(const asset of data.assets)
        icons += `
            <img width="24" height="24" src="${asset.iconUrl}">
        `;
    
    let submitHtml = window.loggedIn ? `
        <button class="btn btn-primary w-100" onClick="confirmBuy(${data.planid})">
            Start mining
        </button>
    ` : `
        <div class="small border border-primary rounded p-2 text-center">
                <a class="link-ultra" href="#_" onClick="gotoLogin()">Log In</a> to buy
            </div>
    `;
    
    let buyClass = data.avblUnits > 0 ? '' : 'd-none';
    let soldOutClass = data.avblUnits > 0 ? 'd-none' : '';
    
    return `
	    <div data-id="${data.planid}" class="col-12 plan-item">
	        <div class="p-2 p-lg-4 ui-card-light rounded">
	            <div class="row">
	                <div class="col-12 pt-2 pb-4">
                        <div class="row">
                            <div class="col-auto my-auto ms-auto">
		                        ${icons}
                            </div>
                            <div class="col-auto my-auto me-auto">
                                <h3 class="m-0">${data.name}</h3>
                            </div>
                        </div>
		            </div>
		            <div class="col-12 col-lg-6">
                        <div class="row">
                            <div class="col-12 py-4">
                                <div class="row">
                                    <div class="col-4">
                                        <h4 class="secondary">
                                            Time period
                                        </h4>
                                    </div>
                                    <div class="col-4">
                                        <h4 class="secondary">
                                            Return after
                                        </h4>
                                    </div>
                                    <div class="col-4">
                                        <h4 class="secondary">
                                            ROI
                                        </h4>
                                    </div>
                                    
                                    <div class="col-4 pb-4">
                                        ${data.months} months
                                    </div>
                                    <div class="col-4 pb-4">
                                        <span class="return-after"></span>
                                    </div>
                                    <div class="col-4 pb-4">
                                        <span class="roi"></span>
                                    </div>
                                    
                                    <div class="col-4">
                                        <h4 class="secondary">
                                            Daily revenue
                                        </h4>
                                    </div>
                                    <div class="col-4">
                                        <h4 class="secondary">
                                            Total revenue
                                        </h4>
                                    </div>
                                    <div class="col-4">
                                        <h4 class="secondary">
                                            Total profit
                                        </h4>
                                    </div>
                                    
                                    <div class="col-4">
                                        <span class="daily-revenue-detailed"></span>
                                        <i class="small daily-revenue-equiv"></i>
                                    </div>
                                    <div class="col-4">
                                        <span class="total-revenue-detailed"></span>
                                        <i class="small total-revenue-equiv"></i>
                                    </div>
                                    <div class="col-4">
                                        <span class="total-profit"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-8 col-lg-6 mx-auto ${soldOutClass}">
                                <img src="/mining/img/sold_out.png" class="img-fluid">
                            </div>
                            <div class="col-12 pt-4 pb-2 ${buyClass}">
                                <input type="range" class="form-range" min="${data.orderMinUnits}" max="${data.avblUnits}"
                                 step="1" value="${data.orderMinUnits}" oninput="recalcPlan(${data.planid})">
                            </div>
                            <div class="col-5 my-auto text-center ${buyClass}">
                                <h3 class="d-inline units"></h3>
                            </div>
                            <div class="col-2 my-auto text-center ${buyClass}">
                                <div class="discount-perc-wrapper d-inline rounded py-2 px-2 px-lg-4 bg-red">
                                    <strong class="discount-perc"></strong>
                                </div>
                            </div>
                            <div class="col-5 my-auto text-center ${buyClass}">
                                <h4 class="price-regular secondary crossed-out m-0"></h4>
                                <h3 class="price-final m-0"></h3>
                            </div>
                            <div class="col-7 ${buyClass}">
                            </div>
                            <div class="col-12 col-lg-5 py-4 ${buyClass}">
                                ${submitHtml}
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
	`;
}

function afterAdd(elem) {
    let data = elem.data();
    
    let options = {
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

    window.charts[data.planid] = new ApexCharts(elem.find('.forecast-chart')[0], options);
    window.charts[data.planid].render();
    
    recalcPlan(data.planid);
}

function recalcPlan(planid) {
    let elem = window.scrPlans.get(planid);
    let data = elem.data();
    
    // Units
    let units = elem.find('.form-range').val();
    elem.find('.units').html(units + ' ' + data.unitName + 's');
    
    // Regular price
    let priceRegular = new BigNumber(data.unitPrice);
    priceRegular = priceRegular.times(units);
    elem.find('.price-regular').html(priceRegular.toString() + ' ' + window.billingAsset);

    // Final price
    let priceFinal = priceRegular;
    if(data.discountPercEvery != null) {
        let discountTotalPerc = new BigNumber(units);
        discountTotalPerc = discountTotalPerc.div(data.discountPercEvery)
                                             .dp(0, BigNumber.ROUND_DOWN);
        
        if(data.discountMax && discountTotalPerc.gt(data.discountMax))
            discountTotalPerc = new BigNumber(data.discountMax);
        
        elem.find('.discount-perc').html('-' + discountTotalPerc.toFixed(0) + '%');
        
        let discountFactor = new BigNumber(100);
        discountFactor = discountFactor.minus(discountTotalPerc).div(100);
        priceFinal = priceRegular.times(discountFactor).dp(window.billingPrec);
    }
    elem.find('.price-final').html(priceFinal.toString() + ' ' + window.billingAsset);
    
    if(priceFinal.eq(priceRegular))
        elem.find('.discount-perc-wrapper, .price-regular').addClass('d-none');
    else
        elem.find('.discount-perc-wrapper, .price-regular').removeClass('d-none');

    // Forecast
    let dailyRefSum = new BigNumber(0); // Sum of all assets daily revenue in ref coin
    let dailyNative = {}; // Array of all assets daily revenue in this asset
    
    for(const i in data.assets) {
        // Calculate in asset daily revenue for given units
        let dailyNativeThis = new BigNumber(data.assets[i].avgUnitRevenue);
        dailyNativeThis = dailyNativeThis.times(units);
        
        // Store in array
        dailyNative[i] = dailyNativeThis;
        
        // Calculate refcoin equivalent and add to sum
        dailyRefSum = dailyRefSum.plus(
            dailyNativeThis.times(data.assets[i].avgPrice)
        );
    }
    
    let revenSeries = new Array(); // Revenue chart series
    let profitSeries = new Array(); // Profit chart series
    let days = 0; // Days from purchase, only last value is needed
    let lastReven = null; // Total refcoin revenue, only value for last day is further needed
    let lastProfit = null; // Total refcoin profit, only value for last day is further needed
    let returnAfter = 0; // Value of days when profit > 0
    let returnDate = null; // returnAfter converted to date when profit > 0
    
    for(let month = 0; month <= data.months; month++) {
        let dateNow = new Date();
        let dateFuture = new Date();
        dateFuture.setMonth(dateFuture.getMonth() + month);
        days = Math.round((dateFuture.getTime() - dateNow.getTime()) / (1000 * 3600 * 24));
        
        lastReven = dailyRefSum.times(days);
        lastProfit = lastReven.minus(priceFinal);
        
        if(returnAfter == 0 && lastProfit.gt(0)) {
            returnAfter = days;
            returnDate = dateFuture.getTime();
        }
        
        revenSeries.push({
            x: dateFuture.getTime(),
            y: prettyBalance(lastReven, window.billingPrec)
        });
        
        profitSeries.push({
            x: dateFuture.getTime(),
            y: prettyBalance(lastProfit, window.billingPrec)
        });
    }
    
    window.charts[data.planid].updateSeries([
	    {
	        name: 'Revenue',
            data: revenSeries
	    },
        {
            name: 'Profit',
            data: profitSeries
        }
    ], true);
    
    window.charts[data.planid].clearAnnotations();
    if(returnDate != null)
	    window.charts[data.planid].addXaxisAnnotation({
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
	    });
    
    // Summary
    let dailyDetailed = ''; // All assets daily revenue string <br> separated
    let revenDetailed = ''; // All assets total revenue string <br> separated
    
    for(const i in dailyNative) {
        console.log(data.assets[i].defaultPrec);
        dailyDetailed += prettyBalance(dailyNative[i], data.assets[i].defaultPrec)
                      +  ' ' + data.assets[i].symbol + '<br>';
        revenDetailed += prettyBalance(dailyNative[i].times(days), data.assets[i].defaultPrec)
                      +  ' ' + data.assets[i].symbol + '<br>';
    }
    
    elem.find('.daily-revenue-detailed').html(dailyDetailed);
    elem.find('.daily-revenue-equiv').html(
        '(' + prettyBalance(dailyRefSum, window.billingPrec) + ' ' + window.billingAsset + ')'
    );
    elem.find('.total-revenue-detailed').html(revenDetailed);
    elem.find('.total-revenue-equiv').html(
        '(' + prettyBalance(lastReven, window.billingPrec) + ' ' + window.billingAsset + ')'
    );
    
    elem.find('.total-profit').html(prettyBalance(lastProfit, window.billingPrec) + ' ' + window.billingAsset);
    
    let roi = lastProfit.div(priceFinal).times(100).toFixed(2);
    elem.find('.roi').html(roi + '%');
    
    elem.find('.return-after').html(returnAfter + ' days');
}

/*function buyMining(planid) {
    var item = $('.plan-item[data-planid="' + planid + '"]');
    var units = parseInt(item.find('.form-range').val());
    
    $.ajax({
        url: config.apiUrl + '/mining/plans/buy',
        type: 'POST',
        data: JSON.stringify({
            api_key: window.apiKey,
            planid: planid,
            units: units
        }),
        contentType: "application/json",
        dataType: "json"
    })
    .retry(config.retry)
    .done(function (data) {
        if(data.success) {
            window.location.replace('/mining/dashboard');
        }
        
        else {
            msgBox(data.error);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(false);
    });
}*/

$(document).on('authChecked', function() {
    window.scrPlans = new InfiniteScrollOffsetPg(
        '/mining/v2/plans',
        'plans',
        renderPlan,
        $('#plans-data'),
        false,
        afterAdd,
        null,
        null,
        function(root, resp) {
            window.billingAsset = resp.billingAsset;
            window.billingPrec = resp.billingPrec;
            $('.billing-asset').html(resp.billingAsset);
            $(document).trigger('renderingStage');
        }
    );
});