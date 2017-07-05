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
                    <?php $images = get_field('gallery');
                        if ($images):
                    ?>
                            <div id="slider" class="flexslider">
                                <ul class="slides">
                                    <?php foreach ($images as $image): ?>
                                        <li>
                                            <img src="<?=$image['url'];?>"
                                        </li>
                            <?php endforeach; ?>
                                </ul>
                            </div>
                            <div id="about">
                                <div class="title">
                                    <?php the_title(); ?>
                                </div>
                                <div class="text">
                                    <?php the_field('portfolio_text'); ?>
                                </div>
                            </div>
                            <div id="carousel" class="flexslider">
                                <ul class="slides">
                                    <?php foreach ($images as $image): ?>
                                        <li>
                                            <img src="<?=$image['sizes']['portfolio-thumb'];?>"
                                        </li>
                                    <?php endforeach; ?>
                                </ul>
                            </div>
                            <?php endif; ?>

				</div>
			</div>
		</article>
	<?php endwhile; else : endif; ?>
<?php get_footer(); ?>
