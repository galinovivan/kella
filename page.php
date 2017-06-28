<?php get_header(); ?>
<?php 
 	if (is_page()) {
 		$id = $wp_query->get_queried_object_id();
 		$sidebar = get_post_meta($id, 'sidebar_set', true);
 		$sidebar_pos = get_post_meta($id, 'sidebar_position', true);
 	}
 	
 	$VC = class_exists('WPBakeryVisualComposerAbstract');
?>
<?php if($post->post_content != "") { ?>
	<div class="page-container" data-equal=".sidebar, .sidebar-page">
		<?php if($sidebar) { get_sidebar('page'); } ?>
		<section class="<?php if($sidebar) { echo 'sidebar-page';} ?> <?php if ($sidebar && ($sidebar_pos == 'left'))  { echo 'push'; } else if ($sidebar && ($sidebar_pos == 'right')) { echo 'pull'; } ?><?php if (!$VC) { ?> non-VC-page<?php } ?>">
			<?php if($sidebar) { ?> <?php } ?>
		  <?php if (have_posts()) :  while (have_posts()) : the_post(); ?>
			  <article <?php post_class('post'); ?> id="post-<?php the_ID(); ?>">
				<div class="post-content">
					<?php if ($VC) { ?>
						<?php the_content('Read More'); ?>
					<?php } else { ?>
						<div class="row">
							<div class="small-12 columns">
								<header class="post-title">
									<h1 itemprop="headline"><a href="<?php the_permalink(); ?>" title="<?php the_title_attribute(); ?>"><?php the_title(); ?></a></h1>
								</header>
								<?php the_content('Read More'); ?>
							</div>
						</div>
					<?php } ?>
				</div>
			  </article>
		  <?php endwhile; else : endif; ?>
		</section>
	</div>
<?php } ?>
<?php get_footer(); ?>