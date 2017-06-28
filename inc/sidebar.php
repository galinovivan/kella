<?php
if ( function_exists('register_sidebar') ){
	register_sidebar(array('name' => 'Blog Sidebar', 'id' => 'blog', 'description' => 'The sidebar that shows up in your blog', 'before_widget' => '<div id="%1$s" class="widget cf %2$s">', 'after_widget' => '</div>', 'before_title' => '<h6>', 'after_title' => '</h6>'));
	
		register_sidebar(array('name' => 'Article Sidebar', 'id' => 'single', 'description' => 'The sidebar next to articles', 'before_widget' => '<div id="%1$s" class="widget cf %2$s">', 'after_widget' => '</div>', 'before_title' => '<h6>', 'after_title' => '</h6>'));
}

function thb_sidebar_setup() {
	$sidebars = ot_get_option('sidebars');
	if(!empty($sidebars)) {
		foreach($sidebars as $sidebar) {
			register_sidebar( array(
				'name' => $sidebar['title'],
				'id' => $sidebar['id'],
				'description' => '',
				'before_widget' => '<div id="%1$s" class="widget cf %2$s">',
				'after_widget' => '</div>',
				'before_title' => '<h6>',
				'after_title' => '</h6>',
			));
		}
	}
	if ( class_exists('WCML_WC_MultiCurrency')) {
		global $WCML_WC_MultiCurrency;
		remove_action('woocommerce_product_meta_start', array($WCML_WC_MultiCurrency, 'currency_switcher'));
	}
}
add_action( 'after_setup_theme', 'thb_sidebar_setup' );
?>