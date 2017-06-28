<?php function thb_pricingcolumn( $atts, $content = null ) {
    extract(shortcode_atts(array(
    	'featured'			 => '',
       	'title'      => '',
       	'currency'	=> '$',
       	'price'      => '',
       	'per'			 => '',
       	'use_btn'				 => false,
       	'btn_target_blank' => false,
       	'btn_link'       => '#',
       	'btn_size'			 => 'small',
       	'btn_caption'		 => ''
    ), $atts));
	$btn = '';
	$style = ($featured ? 'featured' : '');
	$features = explode(",", $content);
	// Image & Icon
	$out = '<aside class="pricing_column '.$style.'">';
	$out .= '<header><h3>'.$title.'</h3><div class="price"><strong><i>'.$currency.'</i>'.$price.'</strong><span>'.$per.'</span></div></header>';
  $out .= '<div class="features"><ul>';
  foreach ($features as $feature) {
  	$out .= '<li>'.$feature.'</li>';
  }
  $out .= '</ul></div>';
  // Button
  if ($use_btn) {  
	  $btn = '<a class="btn '.($featured ? 'black' : '').'" href="'.$btn_link.'" ' . ($btn_target_blank ? ' target="_blank"' : '') .'>' .$btn_caption. '</a>';
	  $out .= $btn;
	}
	$out .= '</aside>';
  return $out;
}
add_shortcode('thb_pricingcolumn', 'thb_pricingcolumn');
