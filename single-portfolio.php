<?php get_header(); ?>
  	<?php if (have_posts()) :  while (have_posts()) : the_post(); ?>
		<article itemscope itemtype="http://schema.org/BlogPosting" <?php post_class('post portfolio-post'); ?> id="post-<?php the_ID(); ?>" role="article">
		
			<style type="text/css" media="screen">
				.post-<?php the_ID(); ?> {
					<?php thb_bgecho( get_post_meta(get_the_ID(), 'portfolio_bg', true)); ?>
				}
			</style>
			<div class="post-content single-text row">
				<div class="small-12 columns">
					<?php the_content(); ?>
				</div>
			</div>
		</article>
	<?php endwhile; else : endif; ?>
<?php get_footer(); ?>
