<?php function thb_contactmap( $atts, $content = null ) {
    $a = shortcode_atts(array(
    	'full_height' => false,
       	'height'      => ''
    ), $atts);
    
    $locations = ot_get_option('map_locations');
    ob_start(); ?>
	<div class="contact_map <?php if ($a['full_height']) {?>full-height-content<?php }?>" <?php if (!$a['full_height']) {?>style="height:<?php echo esc_attr($a['height']); ?>px"<?php }?>>
		<div id="map"></div>
	</div>
  	
  	<?php 
  	$out = ob_get_contents();
  	if (ob_get_contents()) ob_end_clean();
  return $out;
}
add_shortcode('thb_contactmap', 'thb_contactmap');
