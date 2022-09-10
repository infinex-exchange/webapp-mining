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
                        <i class="fa-solid fa-check-circle"></i>
                        No additional costs
                    </h3>
                    <span class="secondary">
	                    The price of the mining plan includes all maintenance fees and electricity costs. No additional fees are charged from the mined amount. You get exactly as much crypto as you could mine on your own hardware with the same parameters.
                    </span>
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <h3>
                        <i class="fa-solid fa-check-circle"></i>
                        Flexible security options
                    </h3>
                    <span class="secondary">
                    Are you annoyed by SMS or 2FA codes every time you open exchange app?
                    In Vayamos, you can use it or you can turn it off.
                    We don't force anything.
                    </span>
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <h3>
                        <i class="fa-solid fa-check-circle"></i>
                        Quick & easy listing
                    </h3>
                    <span class="secondary">
                    Vayamos helps make the addition of new crypto projects as simple as possible.
                    If there are no technical barriers, it can be listed for free.
                    </span>
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <h3>
                        <i class="fa-solid fa-check-circle"></i>
                        < 0.10%
                    </h3>
                    <span class="secondary">
                    Competitive transaction fees with the possibility of obtaining discounts.
                    </span>
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <h3>
                        <i class="fa-solid fa-check-circle"></i>
                        Instant deposits and withdrawals
                    </h3>
                    <span class="secondary">
                    When you request a withdrawal it will be executed on the blockchain
                    within no more than 1 minute.
                    </span>
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <h3>
                        <i class="fa-solid fa-check-circle"></i>
                        Community support
                    </h3>
                    <span class="secondary">
                    Get help and discuss anytime on our Discord server
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
