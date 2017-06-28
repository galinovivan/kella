<?php
$id = get_the_ID();
$position = get_post_meta($id, 'position', true);

$image_id = get_post_thumbnail_id($id);
$image_link = wp_get_attachment_image_src($image_id,'full');
$image_title = esc_attr( get_the_title($post->ID) );
$image = aq_resize( $image_link[0], 360, 410, true, false, true);
?>
<?php get_header(); ?>
  	<?php if (have_posts()) :  while (have_posts()) : the_post(); ?>
  		<div class="row team-member-post">
  			<div class="small-12 columns">
				<article itemscope itemtype="http://schema.org/BlogPosting" <?php post_class('post '); ?> id="post-<?php the_ID(); ?>" role="article">
					<div class="post-content single-text row">
						<div class="small-12 medium-8 columns">
							<h2><?php echo get_the_title($id); ?></h2>
							<?php if($position) { echo '<span class="position">'.$position.'</span>'; } ?>
							<?php the_content(); ?>
							<p class="in-touch"><?php _e('GET IN TOUCH', THB_THEME_NAME); ?></p>
							<?php do_action( 'thb_social', $id ); ?>
						</div>
						<div class="small-12 medium-4 columns">
							<img src="<?php echo esc_url($image[0]); ?>" width="<?php echo esc_attr($image[1]); ?>" height="<?php echo esc_attr($image[2]); ?>" alt="<?php echo esc_attr($image_title); ?>" class="teammember_photo"/>
						</div>
					</div>
				</article>
			</div>
		</div>
	<?php endwhile; else : endif; ?>
<?php get_footer(); ?>
