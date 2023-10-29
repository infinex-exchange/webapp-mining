window.paymentAsset = '';
window.referenceAsset = '';
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

/*function afterAdd() {
    
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
    
    item.find('.form-range').trigger('input');
}

function buyMining(planid) {
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
}

function recalcPlan(planid) {
    var item = $('.plan-item[data-planid="' + planid + '"]');
    
    // Units
    var units = item.find('.form-range').val();
    item.find('.units').html(units + ' ' + window.plans[planid].unit_name + 's');
    
    // Regular price
    var priceRegular = new BigNumber(window.plans[planid].unit_price);
    priceRegular = priceRegular.times(units).dp(window.billingPrec);
    item.find('.price-regular').html(priceRegular.toFixed(window.billingPrec) + ' ' + window.billingAsset);
    
    // Final price
    var priceFinal = priceRegular;
    if(window.plans[planid].discount_perc_every != null) {
        var discountTotalPerc = new BigNumber(units);
        discountTotalPerc = discountTotalPerc.idiv(window.plans[planid].discount_perc_every)
                                             .dp(0);
        
        if(typeof(window.plans[planid].discount_max) !== 'undefined' && discountTotalPerc.gt(window.plans[planid].discount_max))
            discountTotalPerc = new BigNumber(window.plans[planid].discount_max);
        
        item.find('.discount-perc').html('-' + discountTotalPerc.toFixed(0) + '%');
        
        var discountFactor = new BigNumber(100);
        discountFactor = discountFactor.minus(discountTotalPerc).div(100);
        priceFinal = priceRegular.times(discountFactor).dp(window.billingPrec);
    }
    item.find('.price-final').html(priceFinal.toFixed(window.billingPrec) + ' ' + window.billingAsset);
    
    if(priceFinal.eq(priceRegular))
        item.find('.discount-perc-wrapper, .price-regular').addClass('d-none');
    else
        item.find('.discount-perc-wrapper, .price-regular').removeClass('d-none');
    
    // Forecast
    var dailyMasterTotal = new BigNumber(0);
    var dailyNative = new Object();
    
    $.each(window.plans[planid].assets, function(k, v) {
        var dailyNativeThis = new BigNumber(v.unit_avg_revenue);
        dailyNativeThis = dailyNativeThis.times(units);
        dailyNative[k] = dailyNativeThis;
        
        var dailyMasterThis = dailyNativeThis.times(v.asset_price_avg);
        dailyMasterTotal = dailyMasterTotal.plus(dailyMasterThis);
    });
    
    var revenSeries = new Array();
    var profitSeries = new Array();
    var days = 0;
    var lastReven = null;
    var lastProfit = null;
    var returnAfter = 0;
    var returnDate = null;
    
    for(var month = 0; month <= window.plans[planid].months; month++) {
        var dateNow = new Date();
        var dateFuture = new Date();
        dateFuture.setMonth(dateFuture.getMonth() + month);
        days = Math.round((dateFuture.getTime() - dateNow.getTime()) / (1000 * 3600 * 24));
        
        lastReven = dailyMasterTotal.times(days);
        lastProfit = dailyMasterTotal.times(days)
                                     .minus(priceFinal);
        
        if(returnAfter == 0 && lastProfit.gt(0)) {
            returnAfter = days;
            returnDate = dateFuture.getTime();
        }
        
        revenSeries.push({
            x: dateFuture.getTime(),
            y: lastReven.toFixed(window.billingPrec)
        });
        
        profitSeries.push({
            x: dateFuture.getTime(),
            y: lastProfit.toFixed(window.billingPrec)
        });
    }
    
    window.charts[planid].updateSeries([
	    {
	        name: 'Revenue',
            data: revenSeries
	    },
        {
            name: 'Profit',
            data: profitSeries
        }
    ], true);
    
    if(returnDate != null) {
	    window.charts[planid].clearAnnotations();
	    window.charts[planid].addXaxisAnnotation({
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
    }
    
    // Summary
    
    var revenDetailed = '';
    var dailyDetailed = '';
    
    $.each(dailyNative, function(k, v) {
        dailyDetailed += v.toFixed(window.plans[planid].assets[k].prec)
                      + ' ' + k + '<br>';
        
        var totalRevenThis = v.times(days);
        revenDetailed += totalRevenThis.toFixed(window.plans[planid].assets[k].prec)
                      + ' ' + k + '<br>';
    });
    
    item.find('.time-period').html(window.plans[planid].months + ' months');
    item.find('.daily-revenue-detailed').html(dailyDetailed);
    item.find('.daily-revenue-equiv').html('(' + dailyMasterTotal.toFixed(window.billingPrec) + ' ' + window.billingAsset + ')');
    item.find('.total-revenue-detailed').html(revenDetailed);
    item.find('.total-revenue-equiv').html('(' + lastReven.toFixed(window.billingPrec) + ' ' + window.billingAsset + ')');
    item.find('.total-profit').html(lastProfit.toFixed(window.billingPrec) + ' ' + window.billingAsset);
    
    var roi = lastProfit.div(priceFinal).times(100).toFixed(2);
    item.find('.roi').html(roi + '%');
    
    item.find('.return-after').html(returnAfter + ' days');
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
            window.paymentAsset = resp.paymentAsset;
            window.referenceAsset = resp.referenceAsset;
            $('.reference-asset').html(resp.referenceAsset);
            $(document).trigger('renderingStage');
        }
    );
});