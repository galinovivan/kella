<?php

// Enable WP Post Thumbnails
if ( function_exists( 'add_theme_support' ) ) {
	add_theme_support( 'post-thumbnails' );
	set_post_thumbnail_size( 125, 100, true );

}

add_image_size( 'portfolio-thumb', 90, 90, true );

?>