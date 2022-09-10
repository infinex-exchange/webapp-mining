function renderPlan(data) {
    return `
	    <div class="col-12 plan-item">
	        <div class="p-2 p-lg-4 ui-card-light rounded">
	            <div class="row py-2 text-center">
	                <h3>${data.name}</h3>
	            </div>
	            <div class="row py-2 secondary">
	                <div class="col-3 my-auto"><h5>Name</h5></div>
	                <div class="col-4 my-auto text-end"><h5>Last price</h5></div>
	                <div class="col-2 my-auto text-end"><h5>24h change</h5></div>
	                <div class="col-3 my-auto text-end"><h5>24h volume</h5></div>
	            </div>
	        </div>
	    </div>
	`;
}

$(document).ready(function() {
    window.renderingStagesTarget = 1;
    $(document).trigger('renderingStage');
});