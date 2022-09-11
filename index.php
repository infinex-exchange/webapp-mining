<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include('../../templates/head.php'); ?>
        <?php include('../../imports/bignumber.html'); ?>
        <?php include('../../imports/apexcharts.html'); ?>
        <link rel="stylesheet" href="/mining/css/styles.css?<?php echo filemtime(__DIR__.'/css/styles.css'); ?>">
        <title>Vayamos Mining</title>
    </head>
    <body class="body-background">
    
        <!-- Preloader -->
        <?php include('../../templates/preloader.html'); ?>
        
        <!-- Navbar -->
        <?php include('../../templates/navbar.php'); ?>
        
        <!-- Root container -->
        <div id="root" class="container-fluid container-1500 h-rest pt-2 p-0">
        
            <div class="jumbotron row m-0 px-4 py-5">
                <div class="col-12">
                    <h1>Vayamos Mining</h1>
                    <p>Access cryptocurrency mining profits without building your own infrastructure.</p>
                </div>
            </div>
            
            <div id="plans-data" class="row gx-0 gx-lg-3 gy-3 m-0">
            </div>
            
            <div class="row m-0 px-4 py-5>
	            <div class="col-12">
                    <div class="alert alert-danger d-flex align-items-center my-2" role="alert">
                        <div class="px-2">
                            <i class="fa-solid fa-chart-line fa-2x"></i>
                        </div>
                        <div class="px-2">
                            All forecasts are based on the current mining profitability of the offered coins and the average exchange rate for the last 7 days.
                            Mining profitability varies all the time.
                            Do your own research before purchasing the service.
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row m-0 px-4 py-5 index-section gy-4">
                <div class="col-12 col-md-6 col-lg-4">
                    <h3>
                        <i class="fa-regular fa-money-bill-1"></i>
                        No additional costs
                    </h3>
                    <span class="secondary">
	                    The price of the mining plan includes all maintenance fees and electricity costs. No additional fees are charged from the mined amount. You get exactly as much crypto as you could mine on your own hardware with the same power.
                    </span>
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <h3>
                        <i class="fa-solid fa-microchip"></i>
                        Maintenance free
                    </h3>
                    <span class="secondary">
                        You don't need to have any technical knowledge to start. Just buy a mining plan and watch your profits. Our specialists take care of the proper configuration and maintenance of the mining equipment 24 hours a day.
                    </span>
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <h3>
                        <i class="fa-solid fa-temperature-three-quarters"></i>
                        No heat and no noise
                    </h3>
                    <span class="secondary">
                        If you don't have the location to host mining hardware yourself, cloud mining is a perfect choice!
                    </span>
                </div>
            </div>
        
        <!-- / Root container -->
        </div>
        
        <?php include('../../templates/modals.php'); ?>
        <script src="/mining/js/plans.js?<?php echo filemtime(__DIR__.'/js/plans.js'); ?>"></script>
        
        <!-- Footer -->
        <?php include('../../templates/footer.html'); ?>
        <?php include('../../templates/vanilla_mobile_nav.php'); ?>
    
    </body>
</html>
