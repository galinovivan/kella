<?php
/* Title Tag */
function thb_theme_slug_setup() {
   add_theme_support( 'title-tag' );
}
add_action( 'after_setup_theme', 'thb_theme_slug_setup' );

/* Required Settings */
if(!isset($content_width)) $content_width = 1170;
add_theme_support( 'automatic-feed-links' );
add_theme_support( 'title-tag' );

/* Remove Unwanted Tags */
function thb_remove_invalid_tags($str, $tags) 
{
    foreach($tags as $tag)
    {
    	$str = preg_replace('#^<\/'.$tag.'>|<'.$tag.'>$#', '', $str);
    }

    return $str;
}

/* Category Rel Fix */
function thb_remove_category_list_rel( $output ) {
    return str_replace( ' rel="category tag"', '', $output );
}
 
add_filter( 'wp_list_categories', 'thb_remove_category_list_rel' );
add_filter( 'the_category', 'thb_remove_category_list_rel' );

/* Editor Styling */
add_editor_style();

/* Handheld Device Images */
function thb_handhelded_devices() {

	$icon_link = '<link rel="apple-touch-icon"%2$s href="%1$s">';

	$old_iphone_icon = ot_get_option('handheld_old_iphone');
	if ( $old_iphone_icon ) {
		printf( $icon_link, esc_url( $old_iphone_icon ), '' );
	}

	$old_ipad_icon = ot_get_option('handheld_old_ipad');
	if ( $old_ipad_icon ) {
		printf( $icon_link, esc_url( $old_ipad_icon ), ' sizes="76x76"' );
	}

	$retina_iphone_icon = ot_get_option('handheld_retina_iphone');
	if ( $retina_iphone_icon ) {
		printf( $icon_link, esc_url( $retina_iphone_icon ), ' sizes="120x120"' );
	}

	$retina_ipad_icon = ot_get_option('handheld_retina_ipad');
	if ( $retina_ipad_icon ) {
		printf( $icon_link, esc_url( $retina_ipad_icon ), ' sizes="152x152"' );
	}

}

add_action( 'thb_handhelded_devices', 'thb_handhelded_devices',3 );

/* Remove Version From CSS & JS Files */
function thb_remove_script_version( $src ){
    return remove_query_arg( 'ver', $src );
}

add_filter( 'script_loader_src', 'thb_remove_script_version' );
add_filter( 'style_loader_src', 'thb_remove_script_version' );

/* Author FB, TW & G+ Links */
function thb_my_new_contactmethods( $contactmethods ) {
// Add Twitter
$contactmethods['twitter'] = 'Twitter URL';
// Add Facebook
$contactmethods['facebook'] = 'Facebook URL';
// Add Google+
$contactmethods['googleplus'] = 'Google Plus URL';

return $contactmethods;
}
add_filter('user_contactmethods','thb_my_new_contactmethods',10,1);

/* Font Awesome Array */
function thb_getIconArray(){
	$icons = array(
		'' => '',
		'fa-glass' => 'fa-glass',
		'fa-music' => 'fa-music',
		'fa-search' => 'fa-search',
		'fa-envelope-o' => 'fa-envelope-o',
		'fa-heart' => 'fa-heart',
		'fa-star' => 'fa-star',
		'fa-star-o' => 'fa-star-o',
		'fa-user' => 'fa-user',
		'fa-film' => 'fa-film',
		'fa-th-large' => 'fa-th-large',
		'fa-th' => 'fa-th',
		'fa-th-list' => 'fa-th-list',
		'fa-check' => 'fa-check',
		'fa-times' => 'fa-times',
		'fa-search-plus' => 'fa-search-plus',
		'fa-search-minus' => 'fa-search-minus',
		'fa-power-off' => 'fa-power-off',
		'fa-signal' => 'fa-signal',
		'fa-cog' => 'fa-cog',
		'fa-trash-o' => 'fa-trash-o',
		'fa-home' => 'fa-home',
		'fa-file-o' => 'fa-file-o',
		'fa-clock-o' => 'fa-clock-o',
		'fa-road' => 'fa-road',
		'fa-download' => 'fa-download',
		'fa-arrow-circle-o-down' => 'fa-arrow-circle-o-down',
		'fa-arrow-circle-o-up' => 'fa-arrow-circle-o-up',
		'fa-inbox' => 'fa-inbox',
		'fa-play-circle-o' => 'fa-play-circle-o',
		'fa-repeat' => 'fa-repeat',
		'fa-refresh' => 'fa-refresh',
		'fa-list-alt' => 'fa-list-alt',
		'fa-lock' => 'fa-lock',
		'fa-flag' => 'fa-flag',
		'fa-headphones' => 'fa-headphones',
		'fa-volume-off' => 'fa-volume-off',
		'fa-volume-down' => 'fa-volume-down',
		'fa-volume-up' => 'fa-volume-up',
		'fa-qrcode' => 'fa-qrcode',
		'fa-barcode' => 'fa-barcode',
		'fa-tag' => 'fa-tag',
		'fa-tags' => 'fa-tags',
		'fa-book' => 'fa-book',
		'fa-bookmark' => 'fa-bookmark',
		'fa-print' => 'fa-print',
		'fa-camera' => 'fa-camera',
		'fa-font' => 'fa-font',
		'fa-bold' => 'fa-bold',
		'fa-italic' => 'fa-italic',
		'fa-text-height' => 'fa-text-height',
		'fa-text-width' => 'fa-text-width',
		'fa-align-left' => 'fa-align-left',
		'fa-align-center' => 'fa-align-center',
		'fa-align-right' => 'fa-align-right',
		'fa-align-justify' => 'fa-align-justify',
		'fa-list' => 'fa-list',
		'fa-outdent' => 'fa-outdent',
		'fa-indent' => 'fa-indent',
		'fa-video-camera' => 'fa-video-camera',
		'fa-picture-o' => 'fa-picture-o',
		'fa-pencil' => 'fa-pencil',
		'fa-map-marker' => 'fa-map-marker',
		'fa-adjust' => 'fa-adjust',
		'fa-tint' => 'fa-tint',
		'fa-pencil-square-o' => 'fa-pencil-square-o',
		'fa-share-square-o' => 'fa-share-square-o',
		'fa-check-square-o' => 'fa-check-square-o',
		'fa-arrows' => 'fa-arrows',
		'fa-step-backward' => 'fa-step-backward',
		'fa-fast-backward' => 'fa-fast-backward',
		'fa-backward' => 'fa-backward',
		'fa-play' => 'fa-play',
		'fa-pause' => 'fa-pause',
		'fa-stop' => 'fa-stop',
		'fa-forward' => 'fa-forward',
		'fa-fast-forward' => 'fa-fast-forward',
		'fa-step-forward' => 'fa-step-forward',
		'fa-eject' => 'fa-eject',
		'fa-chevron-left' => 'fa-chevron-left',
		'fa-chevron-right' => 'fa-chevron-right',
		'fa-plus-circle' => 'fa-plus-circle',
		'fa-minus-circle' => 'fa-minus-circle',
		'fa-times-circle' => 'fa-times-circle',
		'fa-check-circle' => 'fa-check-circle',
		'fa-question-circle' => 'fa-question-circle',
		'fa-info-circle' => 'fa-info-circle',
		'fa-crosshairs' => 'fa-crosshairs',
		'fa-times-circle-o' => 'fa-times-circle-o',
		'fa-check-circle-o' => 'fa-check-circle-o',
		'fa-ban' => 'fa-ban',
		'fa-arrow-left' => 'fa-arrow-left',
		'fa-arrow-right' => 'fa-arrow-right',
		'fa-arrow-up' => 'fa-arrow-up',
		'fa-arrow-down' => 'fa-arrow-down',
		'fa-share' => 'fa-share',
		'fa-expand' => 'fa-expand',
		'fa-compress' => 'fa-compress',
		'fa-plus' => 'fa-plus',
		'fa-minus' => 'fa-minus',
		'fa-asterisk' => 'fa-asterisk',
		'fa-exclamation-circle' => 'fa-exclamation-circle',
		'fa-gift' => 'fa-gift',
		'fa-leaf' => 'fa-leaf',
		'fa-fire' => 'fa-fire',
		'fa-eye' => 'fa-eye',
		'fa-eye-slash' => 'fa-eye-slash',
		'fa-exclamation-triangle' => 'fa-exclamation-triangle',
		'fa-plane' => 'fa-plane',
		'fa-calendar' => 'fa-calendar',
		'fa-random' => 'fa-random',
		'fa-comment' => 'fa-comment',
		'fa-magnet' => 'fa-magnet',
		'fa-chevron-up' => 'fa-chevron-up',
		'fa-chevron-down' => 'fa-chevron-down',
		'fa-retweet' => 'fa-retweet',
		'fa-shopping-cart' => 'fa-shopping-cart',
		'fa-folder' => 'fa-folder',
		'fa-folder-open' => 'fa-folder-open',
		'fa-arrows-v' => 'fa-arrows-v',
		'fa-arrows-h' => 'fa-arrows-h',
		'fa-bar-chart' => 'fa-bar-chart',
		'fa-twitter-square' => 'fa-twitter-square',
		'fa-facebook-square' => 'fa-facebook-square',
		'fa-camera-retro' => 'fa-camera-retro',
		'fa-key' => 'fa-key',
		'fa-cogs' => 'fa-cogs',
		'fa-comments' => 'fa-comments',
		'fa-thumbs-o-up' => 'fa-thumbs-o-up',
		'fa-thumbs-o-down' => 'fa-thumbs-o-down',
		'fa-star-half' => 'fa-star-half',
		'fa-heart-o' => 'fa-heart-o',
		'fa-sign-out' => 'fa-sign-out',
		'fa-linkedin-square' => 'fa-linkedin-square',
		'fa-thumb-tack' => 'fa-thumb-tack',
		'fa-external-link' => 'fa-external-link',
		'fa-sign-in' => 'fa-sign-in',
		'fa-trophy' => 'fa-trophy',
		'fa-github-square' => 'fa-github-square',
		'fa-upload' => 'fa-upload',
		'fa-lemon-o' => 'fa-lemon-o',
		'fa-phone' => 'fa-phone',
		'fa-square-o' => 'fa-square-o',
		'fa-bookmark-o' => 'fa-bookmark-o',
		'fa-phone-square' => 'fa-phone-square',
		'fa-twitter' => 'fa-twitter',
		'fa-facebook' => 'fa-facebook',
		'fa-github' => 'fa-github',
		'fa-unlock' => 'fa-unlock',
		'fa-credit-card' => 'fa-credit-card',
		'fa-rss' => 'fa-rss',
		'fa-hdd-o' => 'fa-hdd-o',
		'fa-bullhorn' => 'fa-bullhorn',
		'fa-bell' => 'fa-bell',
		'fa-certificate' => 'fa-certificate',
		'fa-hand-o-right' => 'fa-hand-o-right',
		'fa-hand-o-left' => 'fa-hand-o-left',
		'fa-hand-o-up' => 'fa-hand-o-up',
		'fa-hand-o-down' => 'fa-hand-o-down',
		'fa-arrow-circle-left' => 'fa-arrow-circle-left',
		'fa-arrow-circle-right' => 'fa-arrow-circle-right',
		'fa-arrow-circle-up' => 'fa-arrow-circle-up',
		'fa-arrow-circle-down' => 'fa-arrow-circle-down',
		'fa-globe' => 'fa-globe',
		'fa-wrench' => 'fa-wrench',
		'fa-tasks' => 'fa-tasks',
		'fa-filter' => 'fa-filter',
		'fa-briefcase' => 'fa-briefcase',
		'fa-arrows-alt' => 'fa-arrows-alt',
		'fa-users' => 'fa-users',
		'fa-link' => 'fa-link',
		'fa-cloud' => 'fa-cloud',
		'fa-flask' => 'fa-flask',
		'fa-scissors' => 'fa-scissors',
		'fa-files-o' => 'fa-files-o',
		'fa-paperclip' => 'fa-paperclip',
		'fa-floppy-o' => 'fa-floppy-o',
		'fa-square' => 'fa-square',
		'fa-bars' => 'fa-bars',
		'fa-list-ul' => 'fa-list-ul',
		'fa-list-ol' => 'fa-list-ol',
		'fa-strikethrough' => 'fa-strikethrough',
		'fa-underline' => 'fa-underline',
		'fa-table' => 'fa-table',
		'fa-magic' => 'fa-magic',
		'fa-truck' => 'fa-truck',
		'fa-pinterest' => 'fa-pinterest',
		'fa-pinterest-square' => 'fa-pinterest-square',
		'fa-google-plus-square' => 'fa-google-plus-square',
		'fa-google-plus' => 'fa-google-plus',
		'fa-money' => 'fa-money',
		'fa-caret-down' => 'fa-caret-down',
		'fa-caret-up' => 'fa-caret-up',
		'fa-caret-left' => 'fa-caret-left',
		'fa-caret-right' => 'fa-caret-right',
		'fa-columns' => 'fa-columns',
		'fa-sort' => 'fa-sort',
		'fa-sort-desc' => 'fa-sort-desc',
		'fa-sort-asc' => 'fa-sort-asc',
		'fa-envelope' => 'fa-envelope',
		'fa-linkedin' => 'fa-linkedin',
		'fa-undo' => 'fa-undo',
		'fa-gavel' => 'fa-gavel',
		'fa-tachometer' => 'fa-tachometer',
		'fa-comment-o' => 'fa-comment-o',
		'fa-comments-o' => 'fa-comments-o',
		'fa-bolt' => 'fa-bolt',
		'fa-sitemap' => 'fa-sitemap',
		'fa-umbrella' => 'fa-umbrella',
		'fa-clipboard' => 'fa-clipboard',
		'fa-lightbulb-o' => 'fa-lightbulb-o',
		'fa-exchange' => 'fa-exchange',
		'fa-cloud-download' => 'fa-cloud-download',
		'fa-cloud-upload' => 'fa-cloud-upload',
		'fa-user-md' => 'fa-user-md',
		'fa-stethoscope' => 'fa-stethoscope',
		'fa-suitcase' => 'fa-suitcase',
		'fa-bell-o' => 'fa-bell-o',
		'fa-coffee' => 'fa-coffee',
		'fa-cutlery' => 'fa-cutlery',
		'fa-file-text-o' => 'fa-file-text-o',
		'fa-building-o' => 'fa-building-o',
		'fa-hospital-o' => 'fa-hospital-o',
		'fa-ambulance' => 'fa-ambulance',
		'fa-medkit' => 'fa-medkit',
		'fa-fighter-jet' => 'fa-fighter-jet',
		'fa-beer' => 'fa-beer',
		'fa-h-square' => 'fa-h-square',
		'fa-plus-square' => 'fa-plus-square',
		'fa-angle-double-left' => 'fa-angle-double-left',
		'fa-angle-double-right' => 'fa-angle-double-right',
		'fa-angle-double-up' => 'fa-angle-double-up',
		'fa-angle-double-down' => 'fa-angle-double-down',
		'fa-angle-left' => 'fa-angle-left',
		'fa-angle-right' => 'fa-angle-right',
		'fa-angle-up' => 'fa-angle-up',
		'fa-angle-down' => 'fa-angle-down',
		'fa-desktop' => 'fa-desktop',
		'fa-laptop' => 'fa-laptop',
		'fa-tablet' => 'fa-tablet',
		'fa-mobile' => 'fa-mobile',
		'fa-circle-o' => 'fa-circle-o',
		'fa-quote-left' => 'fa-quote-left',
		'fa-quote-right' => 'fa-quote-right',
		'fa-spinner' => 'fa-spinner',
		'fa-circle' => 'fa-circle',
		'fa-reply' => 'fa-reply',
		'fa-github-alt' => 'fa-github-alt',
		'fa-folder-o' => 'fa-folder-o',
		'fa-folder-open-o' => 'fa-folder-open-o',
		'fa-smile-o' => 'fa-smile-o',
		'fa-frown-o' => 'fa-frown-o',
		'fa-meh-o' => 'fa-meh-o',
		'fa-gamepad' => 'fa-gamepad',
		'fa-keyboard-o' => 'fa-keyboard-o',
		'fa-flag-o' => 'fa-flag-o',
		'fa-flag-checkered' => 'fa-flag-checkered',
		'fa-terminal' => 'fa-terminal',
		'fa-code' => 'fa-code',
		'fa-reply-all' => 'fa-reply-all',
		'fa-star-half-o' => 'fa-star-half-o',
		'fa-location-arrow' => 'fa-location-arrow',
		'fa-crop' => 'fa-crop',
		'fa-code-fork' => 'fa-code-fork',
		'fa-chain-broken' => 'fa-chain-broken',
		'fa-question' => 'fa-question',
		'fa-info' => 'fa-info',
		'fa-exclamation' => 'fa-exclamation',
		'fa-superscript' => 'fa-superscript',
		'fa-subscript' => 'fa-subscript',
		'fa-eraser' => 'fa-eraser',
		'fa-puzzle-piece' => 'fa-puzzle-piece',
		'fa-microphone' => 'fa-microphone',
		'fa-microphone-slash' => 'fa-microphone-slash',
		'fa-shield' => 'fa-shield',
		'fa-calendar-o' => 'fa-calendar-o',
		'fa-fire-extinguisher' => 'fa-fire-extinguisher',
		'fa-rocket' => 'fa-rocket',
		'fa-maxcdn' => 'fa-maxcdn',
		'fa-chevron-circle-left' => 'fa-chevron-circle-left',
		'fa-chevron-circle-right' => 'fa-chevron-circle-right',
		'fa-chevron-circle-up' => 'fa-chevron-circle-up',
		'fa-chevron-circle-down' => 'fa-chevron-circle-down',
		'fa-html5' => 'fa-html5',
		'fa-css3' => 'fa-css3',
		'fa-anchor' => 'fa-anchor',
		'fa-unlock-alt' => 'fa-unlock-alt',
		'fa-bullseye' => 'fa-bullseye',
		'fa-ellipsis-h' => 'fa-ellipsis-h',
		'fa-ellipsis-v' => 'fa-ellipsis-v',
		'fa-rss-square' => 'fa-rss-square',
		'fa-play-circle' => 'fa-play-circle',
		'fa-ticket' => 'fa-ticket',
		'fa-minus-square' => 'fa-minus-square',
		'fa-minus-square-o' => 'fa-minus-square-o',
		'fa-level-up' => 'fa-level-up',
		'fa-level-down' => 'fa-level-down',
		'fa-check-square' => 'fa-check-square',
		'fa-pencil-square' => 'fa-pencil-square',
		'fa-external-link-square' => 'fa-external-link-square',
		'fa-share-square' => 'fa-share-square',
		'fa-compass' => 'fa-compass',
		'fa-caret-square-o-down' => 'fa-caret-square-o-down',
		'fa-caret-square-o-up' => 'fa-caret-square-o-up',
		'fa-caret-square-o-right' => 'fa-caret-square-o-right',
		'fa-eur' => 'fa-eur',
		'fa-gbp' => 'fa-gbp',
		'fa-usd' => 'fa-usd',
		'fa-inr' => 'fa-inr',
		'fa-jpy' => 'fa-jpy',
		'fa-rub' => 'fa-rub',
		'fa-krw' => 'fa-krw',
		'fa-btc' => 'fa-btc',
		'fa-file' => 'fa-file',
		'fa-file-text' => 'fa-file-text',
		'fa-sort-alpha-asc' => 'fa-sort-alpha-asc',
		'fa-sort-alpha-desc' => 'fa-sort-alpha-desc',
		'fa-sort-amount-asc' => 'fa-sort-amount-asc',
		'fa-sort-amount-desc' => 'fa-sort-amount-desc',
		'fa-sort-numeric-asc' => 'fa-sort-numeric-asc',
		'fa-sort-numeric-desc' => 'fa-sort-numeric-desc',
		'fa-thumbs-up' => 'fa-thumbs-up',
		'fa-thumbs-down' => 'fa-thumbs-down',
		'fa-youtube-square' => 'fa-youtube-square',
		'fa-youtube' => 'fa-youtube',
		'fa-xing' => 'fa-xing',
		'fa-xing-square' => 'fa-xing-square',
		'fa-youtube-play' => 'fa-youtube-play',
		'fa-dropbox' => 'fa-dropbox',
		'fa-stack-overflow' => 'fa-stack-overflow',
		'fa-instagram' => 'fa-instagram',
		'fa-flickr' => 'fa-flickr',
		'fa-adn' => 'fa-adn',
		'fa-bitbucket' => 'fa-bitbucket',
		'fa-bitbucket-square' => 'fa-bitbucket-square',
		'fa-tumblr' => 'fa-tumblr',
		'fa-tumblr-square' => 'fa-tumblr-square',
		'fa-long-arrow-down' => 'fa-long-arrow-down',
		'fa-long-arrow-up' => 'fa-long-arrow-up',
		'fa-long-arrow-left' => 'fa-long-arrow-left',
		'fa-long-arrow-right' => 'fa-long-arrow-right',
		'fa-apple' => 'fa-apple',
		'fa-windows' => 'fa-windows',
		'fa-android' => 'fa-android',
		'fa-linux' => 'fa-linux',
		'fa-dribbble' => 'fa-dribbble',
		'fa-skype' => 'fa-skype',
		'fa-foursquare' => 'fa-foursquare',
		'fa-trello' => 'fa-trello',
		'fa-female' => 'fa-female',
		'fa-male' => 'fa-male',
		'fa-gratipay' => 'fa-gratipay',
		'fa-sun-o' => 'fa-sun-o',
		'fa-moon-o' => 'fa-moon-o',
		'fa-archive' => 'fa-archive',
		'fa-bug' => 'fa-bug',
		'fa-vk' => 'fa-vk',
		'fa-weibo' => 'fa-weibo',
		'fa-renren' => 'fa-renren',
		'fa-pagelines' => 'fa-pagelines',
		'fa-stack-exchange' => 'fa-stack-exchange',
		'fa-arrow-circle-o-right' => 'fa-arrow-circle-o-right',
		'fa-arrow-circle-o-left' => 'fa-arrow-circle-o-left',
		'fa-caret-square-o-left' => 'fa-caret-square-o-left',
		'fa-dot-circle-o' => 'fa-dot-circle-o',
		'fa-wheelchair' => 'fa-wheelchair',
		'fa-vimeo-square' => 'fa-vimeo-square',
		'fa-try' => 'fa-try',
		'fa-plus-square-o' => 'fa-plus-square-o',
		'fa-space-shuttle' => 'fa-space-shuttle',
		'fa-slack' => 'fa-slack',
		'fa-envelope-square' => 'fa-envelope-square',
		'fa-wordpress' => 'fa-wordpress',
		'fa-openid' => 'fa-openid',
		'fa-university' => 'fa-university',
		'fa-graduation-cap' => 'fa-graduation-cap',
		'fa-yahoo' => 'fa-yahoo',
		'fa-google' => 'fa-google',
		'fa-reddit' => 'fa-reddit',
		'fa-reddit-square' => 'fa-reddit-square',
		'fa-stumbleupon-circle' => 'fa-stumbleupon-circle',
		'fa-stumbleupon' => 'fa-stumbleupon',
		'fa-delicious' => 'fa-delicious',
		'fa-digg' => 'fa-digg',
		'fa-pied-piper' => 'fa-pied-piper',
		'fa-pied-piper-alt' => 'fa-pied-piper-alt',
		'fa-drupal' => 'fa-drupal',
		'fa-joomla' => 'fa-joomla',
		'fa-language' => 'fa-language',
		'fa-fax' => 'fa-fax',
		'fa-building' => 'fa-building',
		'fa-child' => 'fa-child',
		'fa-paw' => 'fa-paw',
		'fa-spoon' => 'fa-spoon',
		'fa-cube' => 'fa-cube',
		'fa-cubes' => 'fa-cubes',
		'fa-behance' => 'fa-behance',
		'fa-behance-square' => 'fa-behance-square',
		'fa-steam' => 'fa-steam',
		'fa-steam-square' => 'fa-steam-square',
		'fa-recycle' => 'fa-recycle',
		'fa-car' => 'fa-car',
		'fa-taxi' => 'fa-taxi',
		'fa-tree' => 'fa-tree',
		'fa-spotify' => 'fa-spotify',
		'fa-deviantart' => 'fa-deviantart',
		'fa-soundcloud' => 'fa-soundcloud',
		'fa-database' => 'fa-database',
		'fa-file-pdf-o' => 'fa-file-pdf-o',
		'fa-file-word-o' => 'fa-file-word-o',
		'fa-file-excel-o' => 'fa-file-excel-o',
		'fa-file-powerpoint-o' => 'fa-file-powerpoint-o',
		'fa-file-image-o' => 'fa-file-image-o',
		'fa-file-archive-o' => 'fa-file-archive-o',
		'fa-file-audio-o' => 'fa-file-audio-o',
		'fa-file-video-o' => 'fa-file-video-o',
		'fa-file-code-o' => 'fa-file-code-o',
		'fa-vine' => 'fa-vine',
		'fa-codepen' => 'fa-codepen',
		'fa-jsfiddle' => 'fa-jsfiddle',
		'fa-life-ring' => 'fa-life-ring',
		'fa-circle-o-notch' => 'fa-circle-o-notch',
		'fa-rebel' => 'fa-rebel',
		'fa-empire' => 'fa-empire',
		'fa-git-square' => 'fa-git-square',
		'fa-git' => 'fa-git',
		'fa-hacker-news' => 'fa-hacker-news',
		'fa-tencent-weibo' => 'fa-tencent-weibo',
		'fa-qq' => 'fa-qq',
		'fa-weixin' => 'fa-weixin',
		'fa-paper-plane' => 'fa-paper-plane',
		'fa-paper-plane-o' => 'fa-paper-plane-o',
		'fa-history' => 'fa-history',
		'fa-circle-thin' => 'fa-circle-thin',
		'fa-header' => 'fa-header',
		'fa-paragraph' => 'fa-paragraph',
		'fa-sliders' => 'fa-sliders',
		'fa-share-alt' => 'fa-share-alt',
		'fa-share-alt-square' => 'fa-share-alt-square',
		'fa-bomb' => 'fa-bomb',
		'fa-futbol-o' => 'fa-futbol-o',
		'fa-tty' => 'fa-tty',
		'fa-binoculars' => 'fa-binoculars',
		'fa-plug' => 'fa-plug',
		'fa-slideshare' => 'fa-slideshare',
		'fa-twitch' => 'fa-twitch',
		'fa-yelp' => 'fa-yelp',
		'fa-newspaper-o' => 'fa-newspaper-o',
		'fa-wifi' => 'fa-wifi',
		'fa-calculator' => 'fa-calculator',
		'fa-paypal' => 'fa-paypal',
		'fa-google-wallet' => 'fa-google-wallet',
		'fa-cc-visa' => 'fa-cc-visa',
		'fa-cc-mastercard' => 'fa-cc-mastercard',
		'fa-cc-discover' => 'fa-cc-discover',
		'fa-cc-amex' => 'fa-cc-amex',
		'fa-cc-paypal' => 'fa-cc-paypal',
		'fa-cc-stripe' => 'fa-cc-stripe',
		'fa-bell-slash' => 'fa-bell-slash',
		'fa-bell-slash-o' => 'fa-bell-slash-o',
		'fa-trash' => 'fa-trash',
		'fa-copyright' => 'fa-copyright',
		'fa-at' => 'fa-at',
		'fa-eyedropper' => 'fa-eyedropper',
		'fa-paint-brush' => 'fa-paint-brush',
		'fa-birthday-cake' => 'fa-birthday-cake',
		'fa-area-chart' => 'fa-area-chart',
		'fa-pie-chart' => 'fa-pie-chart',
		'fa-line-chart' => 'fa-line-chart',
		'fa-lastfm' => 'fa-lastfm',
		'fa-lastfm-square' => 'fa-lastfm-square',
		'fa-toggle-off' => 'fa-toggle-off',
		'fa-toggle-on' => 'fa-toggle-on',
		'fa-bicycle' => 'fa-bicycle',
		'fa-bus' => 'fa-bus',
		'fa-ioxhost' => 'fa-ioxhost',
		'fa-angellist' => 'fa-angellist',
		'fa-cc' => 'fa-cc',
		'fa-ils' => 'fa-ils',
		'fa-meanpath' => 'fa-meanpath',
		'fa-buysellads' => 'fa-buysellads',
		'fa-connectdevelop' => 'fa-connectdevelop',
		'fa-dashcube' => 'fa-dashcube',
		'fa-forumbee' => 'fa-forumbee',
		'fa-leanpub' => 'fa-leanpub',
		'fa-sellsy' => 'fa-sellsy',
		'fa-shirtsinbulk' => 'fa-shirtsinbulk',
		'fa-simplybuilt' => 'fa-simplybuilt',
		'fa-skyatlas' => 'fa-skyatlas',
		'fa-cart-plus' => 'fa-cart-plus',
		'fa-cart-arrow-down' => 'fa-cart-arrow-down',
		'fa-diamond' => 'fa-diamond',
		'fa-ship' => 'fa-ship',
		'fa-user-secret' => 'fa-user-secret',
		'fa-motorcycle' => 'fa-motorcycle',
		'fa-street-view' => 'fa-street-view',
		'fa-heartbeat' => 'fa-heartbeat',
		'fa-venus' => 'fa-venus',
		'fa-mars' => 'fa-mars',
		'fa-mercury' => 'fa-mercury',
		'fa-transgender' => 'fa-transgender',
		'fa-transgender-alt' => 'fa-transgender-alt',
		'fa-venus-double' => 'fa-venus-double',
		'fa-mars-double' => 'fa-mars-double',
		'fa-venus-mars' => 'fa-venus-mars',
		'fa-mars-stroke' => 'fa-mars-stroke',
		'fa-mars-stroke-v' => 'fa-mars-stroke-v',
		'fa-mars-stroke-h' => 'fa-mars-stroke-h',
		'fa-neuter' => 'fa-neuter',
		'fa-facebook-official' => 'fa-facebook-official',
		'fa-pinterest-p' => 'fa-pinterest-p',
		'fa-whatsapp' => 'fa-whatsapp',
		'fa-server' => 'fa-server',
		'fa-user-plus' => 'fa-user-plus',
		'fa-user-times' => 'fa-user-times',
		'fa-bed' => 'fa-bed',
		'fa-viacoin' => 'fa-viacoin',
		'fa-train' => 'fa-train',
		'fa-subway' => 'fa-subway',
		'fa-medium' => 'fa-medium',
	);
  return $icons;
}

/* Get Top-Level Domain */
function thb_get_domain($url = false) {
  $pieces = parse_url($url);
  $domain = isset($pieces['host']) ? $pieces['host'] : '';
  if (preg_match('/(?P<domain>[a-z0-9][a-z0-9\-]{1,63}\.[a-z\.]{2,6})$/i', $domain, $regs)) {
    return $regs['domain'];
  }
  return false;
}


/* THB Social Icons */
function thb_social() {
 ?>
	<?php if (ot_get_option('fb_link')) { ?>
	<a href="<?php echo esc_url(ot_get_option('fb_link')); ?>" class="boxed-icon facebook icon-1x" target="_blank"><i class="fa fa-facebook"></i></a>
	<?php } ?>
	<?php if (ot_get_option('pinterest_link')) { ?>
	<a href="<?php echo esc_url(ot_get_option('pinterest_link')); ?>" class="boxed-icon pinterest icon-1x" target="_blank"><i class="fa fa-pinterest"></i></a>
	<?php } ?>
	<?php if (ot_get_option('twitter_link')) { ?>
	<a href="<?php echo esc_url(ot_get_option('twitter_link')); ?>" class="boxed-icon twitter icon-1x" target="_blank"><i class="fa fa-twitter"></i></a>
	<?php } ?>
	<?php if (ot_get_option('linkedin_link')) { ?>
	<a href="<?php echo esc_url(ot_get_option('linkedin_link')); ?>" class="boxed-icon linkedin icon-1x" target="_blank"><i class="fa fa-linkedin"></i></a>
	<?php } ?>
	<?php if (ot_get_option('instragram_link')) { ?>
	<a href="<?php echo esc_url(ot_get_option('instragram_link')); ?>" class="boxed-icon instagram icon-1x" target="_blank"><i class="fa fa-instagram"></i></a>
	<?php } ?>
	<?php if (ot_get_option('xing_link')) { ?>
	<a href="<?php echo esc_url(ot_get_option('xing_link')); ?>" class="boxed-icon xing icon-1x" target="_blank"><i class="fa fa-xing"></i></a>
	<?php } ?>
	<?php if (ot_get_option('tumblr_link')) { ?>
	<a href="<?php echo esc_url(ot_get_option('tumblr_link')); ?>" class="boxed-icon tumblr icon-1x" target="_blank"><i class="fa fa-tumblr"></i></a>
	<?php } ?>
	<?php if (ot_get_option('vk_link')) { ?>
	<a href="<?php echo esc_url(ot_get_option('vk_link')); ?>" class="boxed-icon vk icon-1x" target="_blank"><i class="fa fa-vk"></i></a>
	<?php } ?>
	<?php if (ot_get_option('googleplus_link')) { ?>
	<a href="<?php echo esc_url(ot_get_option('googleplus_link')); ?>" class="boxed-icon google-plus icon-1x" target="_blank"><i class="fa fa-google-plus"></i></a>
	<?php } ?>
	<?php if (ot_get_option('soundcloud_link')) { ?>
	<a href="<?php echo esc_url(ot_get_option('soundcloud_link')); ?>" class="boxed-icon soundcloud icon-1x" target="_blank"><i class="fa fa-soundcloud"></i></a>
	<?php } ?>
	<?php if (ot_get_option('dribbble_link')) { ?>
	<a href="<?php echo esc_url(ot_get_option('dribbble_link')); ?>" class="boxed-icon dribbble icon-1x" target="_blank"><i class="fa fa-dribbble"></i></a>
	<?php } ?>
	<?php if (ot_get_option('youtube_link')) { ?>
	<a href="<?php echo esc_url(ot_get_option('youtube_link')); ?>" class="boxed-icon youtube icon-1x" target="_blank"><i class="fa fa-youtube"></i></a>
	<?php } ?>
	<?php if (ot_get_option('spotify_link')) { ?>
	<a href="<?php echo esc_url(ot_get_option('spotify_link')); ?>" class="boxed-icon spotify icon-1x" target="_blank"><i class="fa fa-spotify"></i></a>
	<?php } ?>
<?php
}
add_action( 'thb_social', 'thb_social',3 );

function thb_social_page($id) {     
 ?>
	<?php if ($fb_link = get_post_meta($id, 'fb_link', true)) { ?>
	<a href="<?php echo esc_url($fb_link); ?>" class="boxed-icon facebook icon-1x" target="_blank"><i class="fa fa-facebook"></i></a>
	<?php } ?>
	<?php if ($pinterest_link = get_post_meta($id, 'pinterest_link', true)) { ?>
	<a href="<?php echo esc_url($pinterest_link); ?>" class="boxed-icon pinterest icon-1x" target="_blank"><i class="fa fa-pinterest"></i></a>
	<?php } ?>
	<?php if ($twitter_link = get_post_meta($id, 'twitter_link', true)) { ?>
	<a href="<?php echo esc_url($twitter_link); ?>" class="boxed-icon twitter icon-1x" target="_blank"><i class="fa fa-twitter"></i></a>
	<?php } ?>
	<?php if ($linkedin_link = get_post_meta($id, 'linkedin_link', true)) { ?>
	<a href="<?php echo esc_url($linkedin_link); ?>" class="boxed-icon linkedin icon-1x" target="_blank"><i class="fa fa-linkedin"></i></a>
	<?php } ?>
	<?php if ($instragram_link = get_post_meta($id, 'instragram_link', true)) { ?>
	<a href="<?php echo esc_url($instragram_link); ?>" class="boxed-icon instagram icon-1x" target="_blank"><i class="fa fa-instagram"></i></a>
	<?php } ?>
	<?php if ($xing_link = get_post_meta($id, 'xing_link', true)) { ?>
	<a href="<?php echo esc_url($xing_link); ?>" class="boxed-icon xing icon-1x" target="_blank"><i class="fa fa-xing"></i></a>
	<?php } ?>
	<?php if ($tumblr_link = get_post_meta($id, 'tumblr_link', true)) { ?>
	<a href="<?php echo esc_url($tumblr_link); ?>" class="boxed-icon tumblr icon-1x"> target="_blank"<i class="fa fa-tumblr"></i></a>
	<?php } ?>
	<?php if ($vk_link = get_post_meta($id, 'vk_link', true)) { ?>
	<a href="<?php echo esc_url($vk_link); ?>" class="boxed-icon vk icon-1x" target="_blank"><i class="fa fa-vk"></i></a>
	<?php } ?>
	<?php if ($googleplus_link = get_post_meta($id, 'googleplus_link', true)) { ?>
	<a href="<?php echo esc_url($googleplus_link); ?>" class="boxed-icon google-plus icon-1x" target="_blank"><i class="fa fa-google-plus"></i></a>
	<?php } ?>
	<?php if ($soundcloud_link = get_post_meta($id, 'soundcloud_link', true)) { ?>
	<a href="<?php echo esc_url($soundcloud_link); ?>" class="boxed-icon soundcloud icon-1x" target="_blank"><i class="fa fa-soundcloud"></i></a>
	<?php } ?>
	<?php if ($dribbble_link = get_post_meta($id, 'dribbble_link', true)) { ?>
	<a href="<?php echo esc_url($dribbble_link); ?>" class="boxed-icon dribbble icon-1x" target="_blank"><i class="fa fa-dribbble"></i></a>
	<?php } ?>
	<?php if ($youtube_link = get_post_meta($id, 'youtube_link', true)) { ?>
	<a href="<?php echo esc_url($youtube_link); ?>" class="boxed-icon youtube icon-1x" target="_blank"><i class="fa fa-youtube"></i></a>
	<?php } ?>
	<?php if ($spotify_link = get_post_meta($id, 'spotify_link', true)) { ?>
	<a href="<?php echo esc_url($spotify_link); ?>" class="boxed-icon spotify icon-1x" target="_blank"><i class="fa fa-spotify"></i></a>
	<?php } ?>
<?php
}
add_action( 'thb_social', 'thb_social_page',10 );

/* Payment Icons */
function thb_payment() {
?>
	<?php if (ot_get_option('payment_visa') != 'off') { ?>
		<figure class="paymenttypes visa"></figure>
	<?php } ?>
	<?php if (ot_get_option('payment_mc') != 'off') { ?>
		<figure class="paymenttypes mc"></figure>
	<?php } ?>
	<?php if (ot_get_option('payment_pp') != 'off') { ?>
		<figure class="paymenttypes paypal"></figure>
	<?php } ?>
	<?php if (ot_get_option('payment_discover') != 'off') { ?>
		<figure class="paymenttypes discover"></figure>
	<?php } ?>
	<?php if (ot_get_option('payment_amazon') != 'off') { ?>
		<figure class="paymenttypes amazon"></figure>
	<?php } ?>
	<?php if (ot_get_option('payment_stripe') != 'off') { ?>
		<figure class="paymenttypes stripe"></figure>
	<?php } ?>
	<?php if (ot_get_option('payment_amex') != 'off') { ?>
		<figure class="paymenttypes amex"></figure>
	<?php } ?>
<?php
}
add_action( 'thb_payment', 'thb_payment',3 );

/* Post Categories Array */
function thb_blogCategories(){
	$blog_categories = get_categories();
	$out = array();
	foreach($blog_categories as $category) {
		$out[$category->name] = $category->cat_ID;
	}
	return $out;
}
/* Portfolio Categories Array */
function thb_portfolioCategories(){
	$portfolio_categories = get_categories(array('taxonomy'=>'project-category'));
	$out = array();
	foreach($portfolio_categories as $portfolio_category) {
		$out[$portfolio_category->cat_name] = $portfolio_category->term_id;
	}
	return $out;
}
/* Team Members Array */
function thb_teammembers(){	
	$args = array(
		'post_type'    => 'teammember'
	);
	$out = array();
	$query = new WP_Query($args);
	
	if ($query->have_posts()) : while ($query->have_posts()) : $query->the_post();
		$out[get_the_title()] = get_the_id();
	endwhile; else: endif;
	return $out;
}


/* Prev/Next Post Links - http://wordpress.org/plugins/previous-and-next-post-in-same-taxonomy/ */
function thb_previous_post_link($in_same_cat = false, $excluded_categories = '', $taxonomy = 'category') {
	thb_adjacent_post_link($in_same_cat, $excluded_categories, true, $taxonomy);
}
function thb_next_post_link($in_same_cat = false, $excluded_categories = '', $taxonomy = 'category') {
	thb_adjacent_post_link($in_same_cat, $excluded_categories, false, $taxonomy);
}
function thb_adjacent_post_link($in_same_cat = false, $excluded_categories = '', $previous = true, $taxonomy = 'category') {
	
	$post = thb_get_adjacent_post($in_same_cat, $excluded_categories, $previous, $taxonomy);
	if ( !$post )
		return;
	if ($taxonomy == 'post') {
		$title = $previous ? __('<span>&larr;</span> Previous Post', THB_THEME_NAME) : __('Next Post <span>&rarr;</span>', THB_THEME_NAME);
	}
	if ($taxonomy == 'portfolio') {
		$title = $previous ? __('Previous Project', THB_THEME_NAME) : __('Next Project', THB_THEME_NAME);
	}
	
	$dir = $previous ? __('PREVIOUS', THB_THEME_NAME) : __('NEXT', THB_THEME_NAME);
	$date = mysql2date(get_option('date_format'), $post->post_date);
	$rel = $previous ? 'prev' : 'next';
	
	if ($taxonomy == 'post') {
		$string = '<a href="'.get_permalink($post).'" rel="'.$rel.'" data-id="'.$post->ID.'" class="'.$rel.'">'. $title . '</a>';
	}
	if ($taxonomy == 'portfolio') {
		$string = '<a href="'.get_permalink($post).'" rel="'.$rel.'" data-id="'.$post->ID.'" class="'.$rel.'">'. $title . '</a>';
	}
	echo $string;
}
function thb_get_adjacent_post( $in_same_cat = false, $excluded_categories = '', $previous = true, $taxonomy = 'category' ) {
	global $post, $wpdb;
	if ( empty( $post ) )
		return null;
	$current_post_date = $post->post_date;
	$join = '';
	$posts_in_ex_cats_sql = '';
	if ( $in_same_cat || ! empty( $excluded_categories ) ) {
		$join = " INNER JOIN $wpdb->term_relationships AS tr ON p.ID = tr.object_id INNER JOIN $wpdb->term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id";
		if ( $in_same_cat ) {
			$cat_array = wp_get_object_terms($post->ID, $taxonomy, array('fields' => 'ids'));
			$join .= " AND tt.taxonomy = '$taxonomy' AND tt.term_id IN (" . implode(',', $cat_array) . ")";
		}
		$posts_in_ex_cats_sql = "AND tt.taxonomy = '$taxonomy'";
		if ( ! empty( $excluded_categories ) ) {
			if ( ! is_array( $excluded_categories ) ) {
				// back-compat, $excluded_categories used to be IDs separated by " and "
				if ( strpos( $excluded_categories, ' and ' ) !== false ) {
					_deprecated_argument( __FUNCTION__, '3.3', sprintf( __( 'Use commas instead of %s to separate excluded categories.', THB_THEME_NAME ), "'and'" ) );
					$excluded_categories = explode( ' and ', $excluded_categories );
				} else {
					$excluded_categories = explode( ',', $excluded_categories );
				}
			}
			$excluded_categories = array_map( 'intval', $excluded_categories );
				
			if ( ! empty( $cat_array ) ) {
				$excluded_categories = array_diff($excluded_categories, $cat_array);
				$posts_in_ex_cats_sql = '';
			}
			if ( !empty($excluded_categories) ) {
				$posts_in_ex_cats_sql = " AND tt.taxonomy = '$taxonomy' AND tt.term_id NOT IN (" . implode($excluded_categories, ',') . ')';
			}
		}
	}
	$adjacent = $previous ? 'previous' : 'next';
	$op = $previous ? '<' : '>';
	$order = $previous ? 'DESC' : 'ASC';
	$join  = apply_filters( "get_{$adjacent}_post_join", $join, $in_same_cat, $excluded_categories );
	$where = apply_filters( "get_{$adjacent}_post_where", $wpdb->prepare("WHERE p.post_date $op %s AND p.post_type = %s AND p.post_status = 'publish' $posts_in_ex_cats_sql", $current_post_date, $post->post_type), $in_same_cat, $excluded_categories );
	$sort  = apply_filters( "get_{$adjacent}_post_sort", "ORDER BY p.post_date $order LIMIT 1" );
	$query = "SELECT p.* FROM $wpdb->posts AS p $join $where $sort";
	$query_key = 'adjacent_post_' . md5($query);
	$result = wp_cache_get($query_key, 'counts');
	if ( false !== $result )
		return $result;
	$result = $wpdb->get_row("SELECT p.* FROM $wpdb->posts AS p $join $where $sort");
	if ( null === $result )
		$result = '';
	wp_cache_set($query_key, $result, 'counts');
	return $result;
}

/* Human time */
function thb_human_time_diff_enhanced( $duration = 60 ) {

	$post_time = get_the_time('U');
	$human_time = '';

	$time_now = date('U');

	// use human time if less that $duration days ago (60 days by default)
	// 60 seconds * 60 minutes * 24 hours * $duration days
	if ( $post_time > $time_now - ( 60 * 60 * 24 * $duration ) ) {
		$human_time = sprintf( __( '%s ago', THB_THEME_NAME), human_time_diff( $post_time, current_time( 'timestamp' ) ) );
	} else {
		$human_time = get_the_date();
	}

	return $human_time;

}

/* Portfolio Navigation */
function thb_post_navigation($arg) {
 ?>
	<nav class="post_nav cf">
		<?php thb_previous_post_link(false, '', $arg[0]); ?>
		<?php thb_next_post_link(false, '', $arg[0]); ?>
	</nav>
<?php
}
add_action( 'thb_post_navigation', 'thb_post_navigation', 3 );

/*--------------------------------------------------------------------*/                							
/*  ADD DASHBOARD LINK			                							
/*--------------------------------------------------------------------*/
function thb_admin_menu_new_items() {
    global $submenu;
    $submenu['index.php'][500] = array( 'Fuelthemes.net', 'manage_options' , 'http://fuelthemes.net/?ref=wp_sidebar' ); 
}
add_action( 'admin_menu' , 'thb_admin_menu_new_items' );


/*--------------------------------------------------------------------*/         							
/*  FOOTER TYPE EDIT									 					
/*--------------------------------------------------------------------*/
function thb_footer_admin () {  
  echo 'Thank you for choosing <a href="http://fuelthemes.net/?ref=wp_footer" target="blank">Fuel Themes</a>.';  
}
add_filter('admin_footer_text', 'thb_footer_admin'); 
?>