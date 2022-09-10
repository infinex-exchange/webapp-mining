<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include('../../templates/head.php'); ?>
        <?php include('../../imports/bignumber.html'); ?>
        <title>Vayamos Mining</title>
    </head>
    <body class="body-background">
    
        <!-- Preloader -->
        <?php include('../../templates/preloader.html'); ?>
        
        <!-- Navbar -->
        <?php include('../../templates/navbar.php'); ?>
        
        <!-- Root container -->
        <div id="root" class="container-fluid container-1500 h-rest pt-2 p-0">
        
            <div class="row m-0 px-4 py-5">
                <div class="jumbotron col-12">
                    <h1>Vayamos Mining</h1>
                    <p>Access cryptocurrency mining profits without building your own infrastructure.</p>
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
                        <i class="fa-solid fa-check-circle"></i>
                        No heat and no noise
                    </h3>
                    <span class="secondary">
                        If you don't have the location to host mining hardware yourself, cloud mining is a perfect choice!
                    </span>
                </div>
            </div>
        
            <div class="row gx-0 gx-lg-3 gy-3 m-0">
                <div class="col-12">
                    <div class="p-2 p-lg-4 ui-card-light rounded">
                        <div class="row py-2 text-center">
                            <h3>Market trend</h3>
                        </div>
                        <div class="row py-2 secondary">
                            <div class="col-3 my-auto"><h5>Name</h5></div>
                            <div class="col-4 my-auto text-end"><h5>Last price</h5></div>
                            <div class="col-2 my-auto text-end"><h5>24h change</h5></div>
                            <div class="col-3 my-auto text-end"><h5>24h volume</h5></div>
                        </div>            
                        <div id="market-trend-spot-data"></div>
                    </div>
                </div>

                <div class="col-12 col-lg-6">
                    <div class="p-2 p-lg-4 ui-card-light rounded">
                        <div class="row py-2 text-center">
                            <h3>Top gainers</h3>
                        </div>
                        <div class="row py-2 secondary">
                            <div class="col-3 my-auto"><h5>Name</h5></div>
                            <div class="col-4 my-auto text-end"><h5>Last price</h5></div>
                            <div class="col-2 my-auto text-end"><h5>24h change</h5></div>
                            <div class="col-3 my-auto text-end"><h5>24h volume</h5></div>
                        </div>
                        <div id="top-gainers-spot-data"></div>
                    </div>
                </div>
                
                <div class="col-12 col-lg-6">
                    <div class="p-2 p-lg-4 ui-card-light rounded">
                        <div class="row py-2 text-center">
                            <h3>Top losers</h3>
                        </div>                    
                        <div class="row py-2 secondary">
                            <div class="col-3 my-auto"><h5>Name</h5></div>
                            <div class="col-4 my-auto text-end"><h5>Last price</h5></div>
                            <div class="col-2 my-auto text-end"><h5>24h change</h5></div>
                            <div class="col-3 my-auto text-end"><h5>24h volume</h5></div>
                        </div>                    
                        <div id="top-losers-spot-data"></div>
                    </div>
                </div>
            </div>
        
        <!-- / Root container -->
        </div>
        
        <?php include('../../templates/modals.php'); ?>
        <script src="/mining/index.js?<?php echo filemtime(__DIR__.'/index.js'); ?>"></script>
        
        <!-- Footer -->
        <?php include('../../templates/footer.html'); ?>
        <?php include('../../templates/vanilla_mobile_nav.php'); ?>
    
    </body>
</html>
