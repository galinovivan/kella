<?php function thb_clients( $atts, $content = null ) {
    extract(shortcode_atts(array(
       	'images'     	=> '',
       	'columns'			=> '4'
    ), $atts));
	$all_images = explode(',', $images);
	$output = '';
	
	$img_array = array_chunk($all_images, intval($columns));
	switch($columns) {
		case 2:
			$col = 'medium-6';
			break;
		case 3:
			$col = 'medium-4';
			break;
		case 4:
			$col = 'medium-3';
			break;
		case 5:
			$col = 'thb-five';
			break;
		case 6:
			$col = 'medium-2';
			break;
	}
	

	$output .= '<div class="clients">'."\n";	
	$counter = range(0, 100, intval($columns));
	$i = 0;
	
	foreach($img_array as $img){
		$output .= '<div class="row no-padding">'."\n";
		
		foreach ($img as $key => $img_id) {
			$img = wp_get_attachment_image($img_id, 'full');
		    $output .= '<div class="client small-6 '.$col.' columns">';
		    $output .= $img;
		    $output .= '</div>'."\n";
		}
		
	    $output .= '</div>'."\n";
		$i++;
	}
	

	$output .= '</div>'."\n";	
	return $output;

}
add_shortcode('thb_clients', 'thb_clients');
