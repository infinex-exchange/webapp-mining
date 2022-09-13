<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include('../../templates/head.php'); ?>
        <link rel="stylesheet" href="/mining/css/styles.css?<?php echo filemtime(__DIR__.'/css/styles.css'); ?>">
        <title>Dashboard | Vayamos Mining</title>
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
                <h3>Dashboard</h3>
            </div>
            
            <div class="row p-2 d-none d-lg-flex secondary">
                <div class="col-4">
                <h5>Name</h5>
                </div>
                <div class="col-5">
                <h5>API key</h5>
                </div>
                <div class="col-3">
                <h5>Options</h5>
                </div>
            </div>
            
            <div id="api-keys-data">
            </div>
        
        <!-- / Main column -->
        </div>
            
        <!-- / Root container -->    
        </div>
        </div>
        
        <script src="/mining/js/dashboard.js?<?php echo filemtime(__DIR__.'/js/dashboard.js'); ?>"></script>
        
        <?php include('../../templates/modals.php'); ?>
        <?php include(__DIR__.'/templates/mobile_nav.php'); ?>
    
    </body>
</html>
