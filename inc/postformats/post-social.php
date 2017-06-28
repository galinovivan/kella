<?php $sharing_type =  ot_get_option('sharing_buttons') ? ot_get_option('sharing_buttons') : array(''); ?>

<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'full' ); ?>
<!-- Start Sharing -->
<aside class="share-post-link" data-fb="<?php echo (in_array('facebook',$sharing_type) ? 'true' : 'false' ); ?>" data-tw="<?php echo (in_array('twitter',$sharing_type) ? 'true' : 'false' ); ?>" data-pi="<?php echo (in_array('pinterest',$sharing_type) ? 'true' : 'false' ); ?>" data-li="<?php echo (in_array('linkedin',$sharing_type) ? 'true' : 'false' ); ?>" data-boxed="true">
	<div class="placeholder" data-url="<?php the_permalink(); ?>" data-text="<?php the_title();?>" data-media="<?php echo esc_url($image[0]); ?>"></div>
</aside>
<!-- End Sharing -->