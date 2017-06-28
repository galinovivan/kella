<?php 
	$id = get_queried_object_id();
	$rev_slider_alias = get_post_meta($id, 'rev_slider_alias', true);
	// if (ot_get_option('logo_dark')) { 
		$logo_dark = ot_get_option('logo_dark');
		// $logo_light = ot_get_option('logo_light');
		// $logo_light = THB_THEME_ROOT. '../../../uploads/logo_white.png'; 
	// } else { 
	// 	// $logo_dark = THB_THEME_ROOT. '../../../uploads/logo_black.png'; 
	// } 
	$page_menu = (get_post_meta($id, 'page_menu', true) !== '' ? get_post_meta($id, 'page_menu', true) : false);
	$mouse_scroll = get_post_meta($id, 'rev_slider_scroll', true);
?>

<!-- Page Slider -->
<?php if (is_page() && $rev_slider_alias) {?>
<div id="welcome" class="row full-width-row no-padding">
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
<nav id="mobile-menu" class="style3">
	<div class="menu-container">
		<a href="#" id="panel-close" class="panel-close"></a>
		
		<div class="menu-holder">
			<a href="<?php echo home_url(); ?>" class="menu-logo">
				<img src="<?php echo esc_url($logo_dark); ?>" alt="<?php bloginfo('name'); ?>"/>
			</a>
			<?php if ($page_menu) { ?>
				<?php wp_nav_menu( array( 'menu' => $page_menu, 'depth' => 1, 'container' => false, 'menu_class' => 'mobile-menu sf-menu', 'walker' => new thb_OnePageMenu  ) ); ?>
			<?php } else  if(has_nav_menu('nav-menu')) { ?>
			  <?php wp_nav_menu( array( 'theme_location' => 'nav-menu', 'depth' => 1, 'container' => false, 'menu_class' => 'mobile-menu sf-menu', 'walker' => new thb_OnePageMenu ) ); ?>
			<?php } else { ?>
				<ul class="mobile-menu">
					<li><a href="<?php echo get_admin_url().'nav-menus.php'; ?>">Please assign a menu from Appearance -> Menus</a></li>
				</ul>
			<?php } ?>
			<ul class="menu-langs">
				<?php pll_the_languages(); ?>
				<?php // pll_the_languages( array( 'show_flags' => 1,'show_names' => 0 ) ); ?>
			</ul>
		</div>
		
	</div>
</nav>
<!-- End Mobile Menu -->

<!-- Start Header -->
<header id="header" class="header style3" role="banner">
	<a href="<?php echo home_url(); ?>" class="logolink">
		<img src="<?php echo esc_url($logo_dark); ?>" class="logoimg" alt="<?php bloginfo('name'); ?>"/>
	</a>
</header>
<a href="#" id="panel-toggle" class="mobile-toggle">
	<div>
		<span></span><span></span><span></span>
	</div>
</a>
<!-- End Header -->