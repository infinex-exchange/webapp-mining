<nav class="navbar fixed-bottom navbar-expand navbar-mobile d-flex d-lg-none py-0 small">
    <ul class="navbar-nav mx-auto text-center">
        <li class="nav-item">
            <a class="nav-link auto-active" href="/">
                <i class="fas fa-home"></i><br>
                Home
            </a>
        </li>
    </ul>
    
    <ul class="navbar-nav mx-auto text-center">
        <?php include(__DIR__.'/menu_inner.html'); ?>
    </ul>
</nav>

<div style="height: 53px; margin-bottom: min(10px, env(safe-area-inset-bottom, 0));" class="d-block d-lg-none"></div>