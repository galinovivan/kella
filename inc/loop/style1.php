<?php $blog_header = ot_get_option('blog_header'); ?>
<?php if ($blog_header) { ?>
	<div class="header_content"><?php echo do_shortcode(wp_kses_post($blog_header)); ?></div>
<?php } ?>
<div class="row">
	<section class="blog-section small-12 medium-8 columns">
	  	<?php if (have_posts()) :  while (have_posts()) : the_post(); ?>
		<article itemscope itemtype="http://schema.org/BlogPosting" <?php post_class('post style1'); ?> id="post-<?php the_ID(); ?>" role="article">
			<?php if ( has_post_thumbnail() ) { ?>
			<figure class="post-gallery">

				<?php
				    $image_id = get_post_thumbnail_id();
				    $image_link = wp_get_attachment_image_src($image_id,'full');
				    $image_title = esc_attr( get_the_title($post->ID) );

					$image = aq_resize( $image_link[0], 810, 435, true, false, true);  // Blog

				?>
				<a href="<?php the_permalink(); ?>"><img src="<?php echo esc_url($image[0]); ?>" width="<?php echo esc_attr($image[1]); ?>" height="<?php echo esc_attr($image[2]); ?>" alt="<?php echo esc_attr($image_title); ?>" /></a>
			</figure>
			<?php } ?>
			<?php if(has_category()) { ?>
			<aside class="post-meta cf"><?php the_category(', '); ?></aside>
			<?php } ?>
			<header class="post-title">
				<h2 itemprop="headline"><a href="<?php the_permalink(); ?>" title="<?php the_title_attribute(); ?>"><?php the_title(); ?></a></h2>
			</header>
			<div class="post-content">
				<?php echo thb_excerpt(500); ?>
			</div>
			<aside class="post-author cf">
				<?php the_author_posts_link(); ?> -
				<time class="time" datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo thb_human_time_diff_enhanced(); ?></time>
			</aside>
			<div class="cf">
				<a href="<?php the_permalink(); ?>" class="more-link btn"><?php _e( 'Read More', THB_THEME_NAME ); ?></a>
				<?php get_template_part( 'inc/postformats/post-social' ); ?>
			</div>
		</article>
	  <?php endwhile; else : ?>
	    <?php get_template_part( 'inc/loop/notfound' ); ?>
	  <?php endif; ?>

	  <?php if ( get_next_posts_link() || get_previous_posts_link()) { ?>
	  <div class="blog_nav row no-padding">
	  	<?php if ( get_next_posts_link() ) : ?>
	  		<a href="<?php echo next_posts(); ?>" class="next"><?php _e( '&larr; Older', THB_THEME_NAME ); ?></a>
	  	<?php endif; ?>

	  	<?php if ( get_previous_posts_link() ) : ?>
	  		<a href="<?php echo previous_posts(); ?>" class="prev"><?php _e( 'Newer &rarr;', THB_THEME_NAME ); ?></a>
	  	<?php endif; ?>
	  </div>
	  <?php } ?>
	</section>
    dsds
	<?php get_sidebar(); ?>

</div>