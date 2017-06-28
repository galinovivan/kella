<?php 
	$parse_uri = explode( 'wp-content', $_SERVER['SCRIPT_FILENAME'] );
	require_once( $parse_uri[0] . 'wp-load.php' );
	require_once('../../inc/ot-functions.php');
	$id = (isset($_GET['id']) ? htmlspecialchars($_GET['id']) : '');
	
	Header("Content-type: text/css");
?>
<?php 
echo thb_google_webfont();
?>
/* Options set in the admin page */
body { 
	<?php thb_typeecho(ot_get_option('body_type'), false, 'Lora'); ?>
	color: <?php echo ot_get_option('text_color'); ?>;
}

/* Header Height */
.header {
	height: <?php thb_measurementecho(ot_get_option('header_height_mobile')); ?>;
	line-height: <?php thb_measurementecho(ot_get_option('header_height_mobile')); ?>;
}
@media only screen and (min-width: 40.063em) {
	.header {
		height: <?php thb_measurementecho(ot_get_option('header_height')); ?>;
		line-height: <?php thb_measurementecho(ot_get_option('header_height')); ?>;
	}
}
/* Logo Height */
.header .logo .logoimg, .menu-container .logoimg {
	max-height: <?php thb_measurementecho(ot_get_option('logo_height_mobile')); ?>;
}
@media only screen and (min-width: 40.063em) {
	.header .logo .logoimg, .menu-container .logoimg {
		max-height: <?php thb_measurementecho(ot_get_option('logo_height')); ?>;
	}
}
/* Title Type */
<?php if(ot_get_option('title_type')) { ?>
.mont, #full-menu .full-menu > li > a, .post .post-meta, .post .share-post-link.shortcode h6, .post .post-author, .post .comment-count, #post-author strong, .blog_nav, .post_nav a, .widget h6, .wpcf7-response-output, label, .select-wrapper select, .marker-info-win h1, [class^="tag-link"], .menu-footer, .style3 .mobile-menu > li > a, #comments ol.commentlist .commentmeta strong, #comments ol.commentlist .authorname, #comments ol.commentlist .comment-reply-link, .filter-main .thb_toggle, .filter-main .filters li a, .filter-main .portfolioselect select, .smalltitle, .btn, .btn:focus, .button, input[type=submit], ul.accordion > li > div.title, .thb_tabs .tabs dd a, .thb_tabs .tabs li a, .thb_tour .tabs dd a, .thb_tour .tabs li a, .toggle .title, .post .post-content .iconbox h6, blockquote cite, .post .post-content .pricing_column header h3, .post .post-content .pricing_column .price, .notification-box, .post .post-content .team_member h3 + span, .team-member-post .post .post-content .position, .team-member-post .post .post-content p.in-touch, .twitter_container > a {
	<?php thb_typeecho(ot_get_option('title_type')); ?>	
}
<?php } ?>

/* Colors */
<?php if (ot_get_option('accent_color')) { ?>
a:hover, #full-menu .full-menu > li.active > a, #full-menu .full-menu > li.sfHover > a, #full-menu .full-menu > li > a:hover, .post .post-meta a, .post .post-title a:hover, .blog_nav a:hover, .widget.widget_recent_entries ul li .url, .widget.widget_recent_comments ul li .url, .mobile-menu > li > a:hover, #comments ol.commentlist .comment-reply-link:hover, .filter-main .thb_toggle:hover, .filter-main .thb_toggle.active, .filter-main .filters li a:hover, .filter-main .filters li a.active, .btn.accent, .btn:focus.accent, .button.accent, input[type=submit].accent, input[type=submit].accent:hover, input[type=submit].btn.accent:hover, ul.accordion > li.active div.title, .thb_tabs .tabs dd.active a, .thb_tabs .tabs li.active a, .thb_tour .tabs dd.active a, .thb_tour .tabs li.active a, .toggle .title.wpb_toggle_title_active, .toggle .title.wpb_toggle_title_active:hover, .post .post-content .iconbox.type3 > span, blockquote cite, .post .post-content .pricing_column header h3, .notification-box a, .team-member-post .post .post-content .position,  {
  color: <?php echo ot_get_option('accent_color'); ?>;
}

.btn.accent, .btn:focus.accent, .button.accent, input[type=submit].accent, .btn.accent:after, .btn:focus.accent:after, .button.accent:after, input[type=submit].accent:after  {
	border-color: <?php echo ot_get_option('accent_color'); ?>;
}

#full-menu .full-menu > li > a:after, .highlight.accent,  .post .post-content .iconbox.type2 > span, .thb_tabs .tabs dd a:after, .thb_tabs .tabs li a:after, .thb_tour .tabs dd a:after, .thb_tour .tabs li a:after, .btn.accent:after, .btn:focus.accent:after, .button.accent:after, input[type=submit].accent:after  {
	background: <?php echo ot_get_option('accent_color'); ?>;	
}
<?php } ?>
<?php if ($menu_link_color = ot_get_option('menu_link_color')) { ?>
	<?php thb_linkcolorecho($menu_link_color, '#full-menu .full-menu > li >'); ?>
<?php } ?>
<?php if ($menu2_link_color = ot_get_option('menu2_link_color')) { ?>
	<?php thb_linkcolorecho($menu2_link_color, '.style2 .mobile-menu > li >'); ?>
<?php } ?>
<?php if ($menu3_link_color = ot_get_option('menu3_link_color')) { ?>
	<?php thb_linkcolorecho($menu3_link_color, '.style3 .mobile-menu > li >'); ?>
<?php } ?>

/* Menu */
<?php if ($menu_type= ot_get_option('menu_type')) { ?>
#full-menu .full-menu > li > a, .style2 .mobile-menu > li > a, .style3 .mobile-menu > li > a {
	<?php thb_typeecho($menu_type); ?>	
}
<?php } ?>

<?php if ($menu2_type= ot_get_option('menu2_type')) { ?>
.style2 .mobile-menu > li > a {
	<?php thb_typeecho($menu2_type); ?>	
}
<?php } ?>

<?php if ($menu3_type= ot_get_option('menu3_type')) { ?>
.style3 .mobile-menu > li > a {
	<?php thb_typeecho($menu3_type); ?>	
}
<?php } ?>

/* Backgrounds */
.page-id-<?php echo esc_attr($id); ?> #wrapper,
.postid-<?php echo esc_attr($id); ?> #wrapper {
	<?php thb_bgecho( get_post_meta($id, 'page_bg', true)); ?>
}

<?php if ($header_bg = ot_get_option('header_bg')) { ?>
.header.style1 {
	<?php thb_bgecho($header_bg); ?>
}
<?php } ?>

<?php if ($menu2_bg = ot_get_option('menu2_bg')) { ?>
#mobile-menu.style2 {
	<?php thb_bgecho($menu2_bg); ?>
}
<?php } ?>

<?php if ($menu3_bg = ot_get_option('menu3_bg')) { ?>
#mobile-menu.style3 {
	<?php thb_bgecho($menu3_bg); ?>
}
<?php } ?>

<?php if ($preloader_bg = ot_get_option('preloader_bg')) { ?>
#wrapper .preloader {
	<?php thb_bgecho($preloader_bg); ?>
}
<?php } ?>
/* Extra CSS */
<?php 
echo ot_get_option('extra_css');
?>