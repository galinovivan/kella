<?php
	$id = get_queried_object_id();
	$rev_slider_alias = get_post_meta($id, 'rev_slider_alias', true);
	if (ot_get_option('logo')) { $logo = ot_get_option('logo'); } else { $logo = THB_THEME_ROOT. '/assets/img/logo-light.png'; } 
	if (ot_get_option('logo_dark')) { $logo_dark = ot_get_option('logo_dark'); } else { $logo_dark = THB_THEME_ROOT. '/assets/img/logo-dark.png'; }
	$page_menu = (get_post_meta($id, 'page_menu', true) !== '' ? get_post_meta($id, 'page_menu', true) : false);
	$mouse_scroll = get_post_meta($id, 'rev_slider_scroll', true);
?>
<!-- Page Slider -->
<?php if (is_page() && $rev_slider_alias) {?>
<div id="home-slider" class="row full-width-row no-padding">
	<div class="small-12 columns">
	<?php putRevSlider($rev_slider_alias); ?>
	
	</div>
	<?php if($mouse_scroll == 'on') { ?>
		<a class="mouse_scroll" href="#"></a>
	<?php } ?>
</div>
<?php  } ?>
<!-- End Page Slider -->
<!-- Start Mobile Menu -->
<nav id="mobile-menu" class="style2">
	<div class="table">
		<div>
			<div class="menu-container">
				<a href="#" class="panel-close"></a>
				<div class="menu-holder">
					<?php if ($page_menu) { ?>
						<?php wp_nav_menu( array( 'menu' => $page_menu, 'depth' => 1, 'container' => false, 'menu_class' => 'mobile-menu sf-menu', 'walker' => new thb_OnePageMenu  ) ); ?>
					<?php } else  if(has_nav_menu('nav-menu')) { ?>
					  <?php wp_nav_menu( array( 'theme_location' => 'nav-menu', 'depth' => 1, 'container' => false, 'menu_class' => 'mobile-menu sf-menu', 'walker' => new thb_OnePageMenu ) ); ?>
					<?php } else { ?>
						<ul class="mobile-menu">
							<li><a href="<?php echo get_admin_url().'nav-menus.php'; ?>">Please assign a menu from Appearance -> Menus</a></li>
						</ul>
					<?php } ?>
				</div>
			</div>
		</div>
	</div>
</nav>
<!-- End Mobile Menu -->

<!-- Start Header -->
<header class="header style2" role="banner">
	<div class="row" data-equal=">.columns">
		<div class="small-4 medium-4 columns logo">
			<a href="<?php echo home_url(); ?>" class="logolink">
				<img src="<?php echo esc_url($logo); ?>" class="logoimg bg--light" alt="<?php bloginfo('name'); ?>"/>
				<img src="<?php echo esc_url($logo_dark); ?>" class="logoimg bg--dark" alt="<?php bloginfo('name'); ?>"/>
			</a>
		</div>
		<div class="small-8 columns menu-holder">
			<a href="#" class="mobile-toggle">
				<div>
					<span></span><span></span><span></span>
				</div>
			</a>
		</div>
	</div>
</header>
<!-- End Header -->