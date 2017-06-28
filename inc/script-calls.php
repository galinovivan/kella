<?php

// Main Styles
function thb_main_styles() {	
		 $id = get_queried_object_id();
		 // Register 
		 wp_register_style('foundation', THB_THEME_ROOT . '/assets/css/foundation.min.css', null, null);
		 wp_register_style("fa", THB_THEME_ROOT . '/assets/css/font-awesome.min.css', null, null);
		 wp_register_style("app", THB_THEME_ROOT .  "/assets/css/app.css", null, null);
		 wp_register_style('selection', THB_THEME_ROOT . '/assets/css/selection.php?id='.$id, null, null);
		 wp_register_style("mp", THB_THEME_ROOT . "/assets/css/magnific-popup.css", null, null);
		 wp_register_style("theme", THB_THEME_ROOT . "/assets/css/theme.css", null, null);
		 wp_register_style("flexslider", THB_THEME_ROOT . "/assets/css/flexslider.css", null, null);
		 
		 // Enqueue
		 wp_enqueue_style('foundation');
		 wp_enqueue_style('fa');
		 wp_enqueue_style('app');
		 wp_enqueue_style('selection');
		 wp_enqueue_style('mp');
		 wp_enqueue_style('flexslider');
		 wp_enqueue_style('theme');
		 wp_enqueue_style('style', get_stylesheet_uri(), null, null);	
}

add_action('wp_enqueue_scripts', 'thb_main_styles');

// Main Scripts
function thb_register_js() {
	
	if (!is_admin()) {
		$url_prefix = is_ssl() ? 'https:' : 'http:';
		// Register 
		wp_register_script('modernizr', THB_THEME_ROOT . '/assets/js/plugins/modernizr.custom.min.js', 'jquery', null);
		wp_register_script('gmapdep', $url_prefix.'//maps.google.com/maps/api/js?sensor=false', false, null, TRUE);
		wp_register_script('tweenmax', $url_prefix.'//cdnjs.cloudflare.com/ajax/libs/gsap/1.15.0/TweenMax.min.js', 'false', null, TRUE);
		wp_register_script('tweenmax-scrollto', $url_prefix.'//cdnjs.cloudflare.com/ajax/libs/gsap/1.15.0/plugins/ScrollToPlugin.min.js', 'false', null, TRUE);
		wp_register_script('vendor', THB_THEME_ROOT . '/assets/js/vendor.min.js', 'jquery', null, TRUE);
		wp_register_script('flexslider', THB_THEME_ROOT . '/assets/js/jquery.flexslider.min.js', 'jquery', null, TRUE);
		wp_register_script('theme', THB_THEME_ROOT . '/assets/js/theme.js', 'jquery', null, TRUE);
		wp_register_script('app', THB_THEME_ROOT . '/assets/js/app.min.js', 'jquery', null, TRUE);
		
		// Enqueue
		if(!is_singular('portfolio')) {
		wp_enqueue_script('jquery');
		wp_enqueue_script('modernizr');
		wp_enqueue_script('gmapdep');
		wp_enqueue_script('tweenmax');
		wp_enqueue_script('tweenmax-scrollto');
		wp_enqueue_script('vendor');
		wp_enqueue_script('flexslider');
		wp_enqueue_script('theme');
		wp_enqueue_script('app');
		wp_localize_script( 'app', 'themeajax', array( 'url' => admin_url( 'admin-ajax.php' ) ) );
		}
	}
}
add_action('wp_enqueue_scripts', 'thb_register_js');

// Admin Scripts
function thb_admin_scripts() {
	wp_register_script('thb-admin-meta', THB_THEME_ROOT .'/assets/js/admin-meta.min.js', array('jquery'));
	wp_enqueue_script('thb-admin-meta');
	
	wp_register_style("thb-admin-css", THB_THEME_ROOT . "/assets/css/admin.css");
	wp_enqueue_style('thb-admin-css'); 
	if (class_exists('WPBakeryVisualComposerAbstract')) {
		wp_enqueue_style( 'vc_extra_css', THB_THEME_ROOT . '/assets/css/vc_extra.css' );
	}
}
add_action('admin_enqueue_scripts', 'thb_admin_scripts');

/* De-register Contact Form 7 styles */
remove_action( 'wp_enqueue_scripts', 'wpcf7_enqueue_styles' );
?>