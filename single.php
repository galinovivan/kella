<?php get_header(); ?>
<div class="row">
	<div class="small-12 columns post">
		<?php if ( has_post_thumbnail() ) { ?>
			<?php
			    $image_id = get_post_thumbnail_id();
			    $image_link = wp_get_attachment_image_src($image_id,'full');
			    $image_title = esc_attr( get_the_title($post->ID) );
				$image = aq_resize( $image_link[0], 1260, 540, true, false, true);  // Blog
		
			?>
		<figure class="post-gallery">
			<img src="<?php echo esc_url($image[0]); ?>" width="<?php echo esc_attr($image[1]); ?>" height="<?php echo esc_attr($image[2]); ?>" alt="<?php echo esc_attr($image_title); ?>" />
		</figure>
		<?php } ?>
	</div>
	<div class="small-12 medium-8 columns">
		<?php if (have_posts()) :  while (have_posts()) : the_post(); ?>
		 <article itemscope itemtype="http://schema.org/BlogPosting" <?php post_class('post blog-post'); ?> id="post-<?php the_ID(); ?>" role="article">
			<?php if(has_category()) { ?>
			<aside class="post-meta cf"><?php the_category(', '); ?></aside>
			<?php } ?>
			<header class="post-title">
				<h2 itemprop="headline"><a href="<?php the_permalink(); ?>" title="<?php the_title_attribute(); ?>"><?php the_title(); ?></a></h2>
			</header>
			<div class="post-content">
				<?php the_content(); ?>
				<?php if ( is_single()) { wp_link_pages(); } ?>
			</div>
			<aside class="post-author cf">
				<?php the_author_posts_link(); ?> - 
				<time class="time" datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo thb_human_time_diff_enhanced(); ?></time>
			</aside>
			<?php get_template_part( 'inc/postformats/post-author' ); ?>
			<?php do_action( 'thb_post_navigation', array('post', get_permalink( get_option( 'page_for_posts' ) ), __('BACK TO BLOG', THB_THEME_NAME) ) ); ?>
		  </article>
		<?php endwhile; else : endif; ?>
		<!-- Start #comments -->
		<section id="comments" class="cf full">
			<?php comments_template('', true ); ?>
		</section>
		<!-- End #comments -->
	</div>
	<?php get_sidebar('single'); ?>
</div>
<?php get_footer(); ?>
