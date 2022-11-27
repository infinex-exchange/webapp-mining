<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include('../../templates/head.php'); ?>
        <?php include('../../imports/bignumber.html'); ?>
        <?php include('../../imports/apexcharts.html'); ?>
        <script src="/js/ajax_scroll.js?<?php echo filemtime(__DIR__.'/../../js/ajax_scroll.js'); ?>"></script>
        <link rel="stylesheet" href="/mining/css/styles.css?<?php echo filemtime(__DIR__.'/css/styles.css'); ?>">
        <title>My contracts | Infinex Mining</title>
    </head>
    <body>
    
        <!-- Preloader -->
        <?php include('../../templates/preloader.html'); ?>
        
        <!-- Navbar -->
        <?php include('../../templates/navbar.php'); ?>
        <?php include(__DIR__.'/templates/navbar.php'); ?>
        
        <!-- Root container -->
        <div id="root" class="container-fluid container-1500 container-rest p-0 user-only">
        <div class="row m-0 h-rest">
        
        <!-- Main column -->
        <div class="col-12 p-0 ui-card ui-column">
            
            <div class="row p-2">
                <h3>My contracts</h3>
            </div>
            
            <div id="contracts-data">
            </div>
        
        <!-- / Main column -->
        </div>
            
        <!-- / Root container -->    
        </div>
        </div>
        
        <script src="/mining/js/contracts.js?<?php echo filemtime(__DIR__.'/js/contracts.js'); ?>"></script>
        
        <?php include('../../templates/modals.php'); ?>
        <?php include(__DIR__.'/templates/mobile_nav.php'); ?>
    
    </body>
</html>
