<?php function thb_teammember( $atts, $content = null ) {
    extract(shortcode_atts(array(
       	'type' 			=> ''
    ), $atts));
    ob_start();
	
	$out = '';
	$id = $type;
	$member = get_post($type);
	$position = get_post_meta($id, 'position', true);
	$rand = rand(0,1000);
	
	$image_id = get_post_thumbnail_id($id);
	$image_link = wp_get_attachment_image_src($image_id,'full');
	$image_title = esc_attr( get_the_title($post->ID) );
	$image = aq_resize( $image_link[0], 300, 300, true, false, true);
	?>
	<a class="team_member" href="<?php echo get_the_permalink($id); ?>">
		<figure><img src="<?php echo esc_url($image[0]); ?>" width="<?php echo esc_attr($image[1]); ?>" height="<?php echo esc_attr($image[2]); ?>" alt="<?php echo esc_attr($image_title); ?>" /></figure>
		<h3><?php echo get_the_title($id); ?></h3>
		<?php if($position) { echo '<span>'.$position.'</span>'; } ?>
	</a>
	
	<?php
	$out = ob_get_contents();
	ob_end_clean();
	
	return $out;
}
add_shortcode('thb_teammember', 'thb_teammember');
