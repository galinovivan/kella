<?php function thb_share( $atts, $content = null ) {
    $a = shortcode_atts(array(
       	'text' => '',
       	'facebook'	=> false,
       	'twitter'	=> false,
       	'pinterest'	=> false
    ), $atts);
  $out = '<aside class="share-post-link shortcode" data-fb="'.($a["facebook"] == "true" ? "true" : "false").'" data-tw="'.($a["twitter"] == "true" ? "true" : "false").'" data-pi="'.($a["pinterest"] == "true" ? "true" : "false").'" data-boxed="false">
  			'. ( $a["text"] ? '<h6>'. $a["text"].'</h6>' : '').'
  			<div class="placeholder" data-url="'.get_the_permalink().'" data-text="'. get_the_title().'"></div>
  		</aside>';
  return $out;
}
add_shortcode('thb_share', 'thb_share');
