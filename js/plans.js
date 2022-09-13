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

function confirmBuyModal(planid) {
    var item = $('.plan-item[data-planid="' + planid + '"]');
    var price = item.find('.price-final').html();
    
    $('#mcb-price').html(price);
    $('#modal-confirm-buy').data('planid', planid)
                           .modal('show');
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
    
    for(var month = 0; month <= window.plans[planid].months; month++) {
        var dateNow = new Date();
        var dateFuture = new Date();
        dateFuture.setMonth(dateFuture.getMonth() + month);
        days = Math.round((dateFuture.getTime() - dateNow.getTime()) / (1000 * 3600 * 24));
        
        lastReven = dailyMasterTotal.times(days);
        lastProfit = dailyMasterTotal.times(days)
                                     .minus(priceFinal);
        
        if(returnAfter == 0 && lastProfit.gt(0))
            returnAfter = days;
        
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
    item.find('.total-revenue-detailed').html(revenDetailed);
    item.find('.total-revenue-equiv').html('(' + lastReven.toFixed(window.billingPrec) + ' ' + window.billingAsset + ')');
    item.find('.total-profit').html(lastProfit.toFixed(window.billingPrec) + ' ' + window.billingAsset);
    
    var roi = lastProfit.div(priceFinal).times(100).toFixed(2);
    item.find('.roi').html(roi + '%');
    
    item.find('.return-after').html(returnAfter + ' days');
}

function renderPlan(planid, data) {
    var name = '';
    var icons = '';
    
    $.each(data.assets, function(k, v) {
        if(name != '') name += ' + ';
        name += v.name;
        icons += `
            <img width="24" height="24" src="${v.icon_url}">
        `;
    });
    
    var submitHtml = null;
    
    if(window.loggedIn) {
        submitHtml = `
            <button class="btn btn-primary w-100" onClick="confirmBuyModal(${planid})">
                Start mining
            </button>
        `;
    }
    else {
        submitHtml = `
            <div class="guest-only small border border-primary rounded p-2 text-center">
                <a class="link-ultra" href="#_" onClick="gotoLogin()">Log In</a> or <a class="link-ultra" href="/account/register">Register</a> to buy
            </div>
        `;
    }
    
    $('#plans-data').append(`
	    <div class="col-12 plan-item" data-planid="${planid}">
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
                                        <span class="time-period"></span>
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
                            <div class="col-12 pt-4 pb-2">
                                <input type="range" class="form-range" min="${data.min_ord_units}" max="${data.avbl_units}" step="1" value="${data.min_ord_units}" oninput="recalcPlan(${planid})">
                            </div>
                            <div class="col-5 my-auto text-center">
                                <h3 class="d-inline units"></h3>
                            </div>
                            <div class="col-2 my-auto text-center">
                                <div class="discount-perc-wrapper d-inline rounded py-2 px-2 px-lg-4 bg-red">
                                    <strong class="discount-perc"></strong>
                                </div>
                            </div>
                            <div class="col-5 my-auto text-center">
                                <h4 class="price-regular secondary crossed-out m-0"></h4>
                                <h3 class="price-final m-0"></h3>
                            </div>
                            <div class="col-7">
                            </div>
                            <div class="col-12 col-lg-5 py-4">
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
	`);
    
    var labels = new Array();
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
    
    item.find('.form-range').trigger('input');
}

$(document).ready(function() {
    window.charts = new Object();
    window.renderingStagesTarget = 1;
    
    $('#mcb-buy').click(function() {
        var planid = $(this).closest('.modal').data('planid');
        buyMining(planid);
    });
});

$(document).on('authChecked', function() {
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
            
            $('.billing-asset').html(data.billing_asset);
            
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