<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=1">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-touch-fullscreen" content="yes">
	<meta http-equiv="cleartype" content="on">
	<meta name="HandheldFriendly" content="True">
	<?php if( $favicon = ot_get_option('favicon')){ ?>
		<?php if (is_ssl()) {
		    $favicon_image_img = str_replace("http://", "https://", $favicon);		
		} else {
		    $favicon_image_img = $favicon;
		}
	?>
	<link rel="shortcut icon" href="<?php echo esc_url($favicon_image_img); ?>">
	<?php } else {?>
	<link rel="shortcut icon" href="<?php echo THB_THEME_ROOT; ?>/assets/img/favicon.ico">
	<?php } ?>
	<?php do_action( 'thb_handhelded_devices' ); ?>
	<?php 
		$id = get_queried_object_id();
		$header_style = (get_post_meta($id, 'header_style', true) ? get_post_meta($id, 'header_style', true) : 'style1');
		$smooth_scroll = (ot_get_option('smooth_scroll') != 'off' ? 'smooth_scroll' : '');
		
		if (is_home() || is_single()) {
			$header_style = 'style1';
		}

		$class = array();
		array_push($class, $smooth_scroll);

		/* Always have wp_head() just before the closing </head>
		 * tag of your theme, or you will break many plugins, which
		 * generally use this hook to add elements to <head> such
		 * as styles, scripts, and meta tags.
		 */
		wp_head();
	?>
    <!-- case-web styles -->
    <link rel="stylesheet" href="<?=get_template_directory_uri();?>/assets/css/common.css";>
</head>
<body <?php body_class($class); ?> data-url="<?php echo esc_url(home_url()); ?>" data-sharrreurl="<?php echo THB_THEME_ROOT; ?>/inc/sharrre.php" data-spy="scroll" data-target="#full-menu">

<div id="wrapper">
	<!-- Start Loader -->
	<div class="preloader"></div>
	<!-- End Loader -->
	<?php if(!is_404()) {get_template_part( 'inc/header/'.$header_style ); } ?>
	<div role="main" class="cf">