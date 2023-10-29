<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include(__DIR__.'/../../inc/head.php'); ?>
        <link rel="stylesheet" href="/mining/css/styles.css?<?php echo filemtime(__DIR__.'/css/styles.css'); ?>">
        <title>Dashboard | Infinex Mining</title>
    </head>
    <body>
        <?php include('../../inc/body.php'); ?>
        
        <!-- Navbar -->
        <?php include(__DIR__.'/inc/navbar.php'); ?>
        
        <!-- Root container -->
        <div id="root" class="container-fluid container-1500 container-rest p-0 user-only">
        <div class="row m-0 h-rest">
        
        <!-- Main column -->
        <div class="col-12 p-0 ui-card ui-column">
            
            <div class="row p-2">
                <h3>Dashboard</h3>
            </div>
            
            <div id="dashboard-data">
            </div>
        
        <!-- / Main column -->
        </div>
            
        <!-- / Root container -->    
        </div>
        </div>
        
        <script src="/mining/dashboard.js?<?php echo filemtime(__DIR__.'/dashboard.js'); ?>"></script>
        
        <?php include(__DIR__.'/inc/mobile_nav.php'); ?>
    </body>
</html>
