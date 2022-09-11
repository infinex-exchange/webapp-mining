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
    if(window.plans[planid].discount_perc != null && window.plans[planid].discount_every_units != null) {
        var discountTotalPerc = new BigNumber(units);
        discountTotalPerc = discountTotalPerc.idiv(window.plans[planid].discount_every_units)
                                             .times(window.plans[planid].discount_perc)
                                             .dp(0);
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
}

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
                            <div class="col-12">
                                <input type="range" class="form-range" min="${data.min_ord_units}" max="${data.avbl_units}" step="1" value="${data.min_ord_units}" oninput="recalcPlan(${planid})">
                            </div>
                            <div class="col-4 my-auto text-center">
                                <h3 class="d-inline units"></h3>
                            </div>
                            <div class="col-2 my-auto text-center">
                                <div class="discount-perc-wrapper d-inline rounded py-2 px-4 bg-red">
                                    <strong class="discount-perc"></strong>
                                </div>
                            </div>
                            <div class="col-6 my-auto text-center">
                                <h4 class="d-inline price-regular text-decoration-line-through pe-3"></h4>
                                <h3 class="d-inline price-final"></h3>
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
    
    var labels = new Array();
    for(var i = 0; i <= data.months; i++)
        labels.push(i);
    
    var options = {
        series: [],
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
            curve: 'straight'
        },
        xaxis: {
            type: 'datetime'
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return value * 2 + ' USDT';
                }
            }
        },
        noData: {
            text: 'Loading...'
        }
    };
    
    var item = $('.plan-item[data-planid="' + planid + '"]');
    
    item.find('.form-range').trigger('input');

    window.charts[planid] = new ApexCharts(item.find('.forecast-chart')[0], options);
    window.charts[planid].render();
}

$(document).ready(function() {
    window.charts = new Object();
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
            window.plans = data.plans;
            window.billingAsset = data.billing_asset;
            window.billingPrec = data.billing_prec;
            
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