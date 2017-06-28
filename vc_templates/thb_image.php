<?php function thb_image( $atts, $content = null ) {
    extract(shortcode_atts(array(
       	'image'      => '',
       	'target_blank' => false,
       	'img_size'	 => 'full',
       	'img_link'       => '',
       	'alignment'	 => '',
       	'lightbox'	 => '',
       	'full_width' => false,
       	'size'			 => 'full',
       	'animation'	 => false
    ), $atts));
	
	$img_id = preg_replace('/[^\d]/', '', $image);
	$href = vc_build_link( $img_link );
	
	$full = $full_width == 'true' ? 'full' : '';
	$img = wpb_getImageBySize( array( 'attach_id' => $img_id, 'thumb_size' => $img_size, 'class' => $animation . ' ' . $alignment . ' '. $full ) );
	if ( $img == NULL ) $img['thumbnail'] = '<img src="http://placekitten.com/g/400/300" />';
  
  $link_to = $c_lightbox = '';
  if ($lightbox==true) {
      $link_to = wp_get_attachment_image_src( $img_id, 'large');
      $link_to = $link_to[0];
      $c_lightbox = ' rel="magnific"';
  } else if (!empty($img_link)) {
      $link_to = $href['url'] ? $href['url'] : $href['http'];
  }
  
  if (!empty($link_to)) {
  	$out = '<a class="image_link"'.$c_lightbox.' href="'.esc_url($link_to).'"'. ($href['target'] ? ' target="'.$href['target'].'"' : '') .'>'.$img['thumbnail'].'</a>';
  } else {
  	$out = $img['thumbnail'];
  }
  

  return $out;
}
add_shortcode('thb_image', 'thb_image');
