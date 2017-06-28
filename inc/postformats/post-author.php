<aside id="post-author">
	<?php echo get_avatar( get_the_author_meta( 'ID' ), '95'); ?>
	<strong><?php the_author_posts_link(); ?></strong>
	<p><?php the_author_meta('description'); ?></p>
	<?php if(get_the_author_meta('url') != '') { ?>
		<a href="<?php echo get_the_author_meta('url'); ?>" class="inline-icon icon-1x twitter"><i class="fa fa-link"></i></a>
	<?php } ?>
	<?php if(get_the_author_meta('twitter') != '') { ?>
		<a href="<?php echo get_the_author_meta('twitter'); ?>" class="inline-icon icon-1x twitter"><i class="fa fa-twitter"></i></a>
	<?php } ?>
	<?php if(get_the_author_meta('facebook') != '') { ?>
		<a href="<?php echo get_the_author_meta('facebook'); ?>" class="inline-icon icon-1x facebook"><i class="fa fa-facebook"></i></a>
	<?php } ?>
	<?php if(get_the_author_meta('googleplus') != '') { ?>
		<a href="<?php echo get_the_author_meta('googleplus'); ?>" class="inline-icon icon-1x google-plus"><i class="fa fa-google-plus"></i></a>
	<?php } ?>
</aside>