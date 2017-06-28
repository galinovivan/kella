<?php
	$logo_404 = ot_get_option('404_logo', 'light');
	
	if ($logo_404 == 'dark') {
		if (ot_get_option('logo')) { $logo = ot_get_option('logo'); } else { $logo = THB_THEME_ROOT. '/assets/img/logo-light.png'; } 
	} else if ($logo_404 == 'light') {
		if (ot_get_option('logo_dark')) { $logo = ot_get_option('logo_dark'); } else { $logo = THB_THEME_ROOT. '/assets/img/logo-dark.png'; }
	}
	
?>
<?php get_header(); ?>
<section class="content404">
	<div class="table full-height-content">
		<div>
			<div class="row">
				<div class="small-12 medium-8 medium-centered large-6 columns text">
					<figure><img src="<?php echo esc_url($logo); ?>" class="logoimg" alt="<?php bloginfo('name'); ?>"/></figure>
					<h1><?php _e( "404", THB_THEME_NAME ); ?></h1>
					<p><?php _e( "We are sorry. But the page you're looking for cannot be found. <br>
					You might try searching our site.", THB_THEME_NAME ); ?></p>
					<div class="row">
						<div class="small-12 medium-6 columns">
							<?php get_search_form(); ?> 
						</div>
					</div>
					<a href="<?php echo get_home_url(); ?>" class="btn white"><?php _e('Back To Home', THB_THEME_NAME); ?></a>
				</div>
			</div>
		</div>
	</div>
</section>
<?php get_footer(); ?>