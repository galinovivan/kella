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

$navText = array();
$lang - pll_current_language();
echo $lang;
switch($lang) {
    case 'en':
        $navText =  $navText = array(
        'portfolio' => 'Portfolio',
        'tehcnicak' => 'Technologies',
        'services' => 'Service',
        'contact' => 'Contacts'    
        );
        break;
    case 'ru':
        $navText = array(
        'portfolio' => 'Портфолио',
        'tehcnicak' => 'Технологии',
        'services' => 'Сервис',
        'contact' => 'Контакты'    
        );
        break;
    case 'fi':
        $navText =  $navText = array(
        'portfolio' => 'Portfolio',
        'tehcnicak' => 'Teknologia',
        'services' => 'Palvelut',
        'contact' => 'Yhteystiedot'    
        );
        break;
    default:
        $navText = array(
        'portfolio' => 'Портфолио',
        'tehcnicak' => 'Технологии',
        'services' => 'Сервис',
        'contact' => 'Контакты'    
        );
        break;
}
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
		<a href="#" id="panel-close" class="panel-close">
            <span class="black_line"></span><span class="black_line"></span><span class="black_line"></span>
        </a>
		
		<div class="menu-holder">
			<a href="<?php echo home_url(); ?>" class="menu-logo">
				<img src="<?php echo esc_url($logo_dark); ?>" alt="<?php bloginfo('name'); ?>"/>
			</a>
            <?=$lang;?>
			<ul id="menu-menyu" class="mobile-menu sf-menu">
                <li><a href="#portfolio"><?=$navText['portfolio'];?></a></li>
                <li><a href="#technology"><?=$navText['tehcnicak'];?></a></li>
                <li><a href="#service"><?=$navText['services'];?></a></li>
                <li><a href="#contact"><?=$navText['contact'];?></a></li>
            </ul>
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