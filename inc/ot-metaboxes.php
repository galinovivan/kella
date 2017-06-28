<?php
/**
 * Initialize the meta boxes. 
 */
add_action( 'admin_init', '_custom_meta_boxes' );

/**
 * Meta Boxes demo code.
 *
 * You can find all the available option types
 * in demo-theme-options.php.
 *
 * @return    void
 *
 * @access    private
 * @since     2.0
 */


function _custom_meta_boxes() {

  /**
   * Create a custom meta boxes array that we pass to 
   * the OptionTree Meta Box API Class.
   */
  
  $teammember_meta_box = array(
    'id'        => 'meta_box_teammember',
    'title'     => 'Team Member Information',
    'pages'     => array('teammember'),
    'context'   => 'normal',
    'priority'  => 'high',
    'fields'    => array(
      array(
        'label'       => 'Position',
        'id'          => 'position',
        'type'        => 'text',
        'desc'        => 'Team Member position'
      ),
      array(
        'label'       => 'Facebook Link',
        'id'          => 'fb_link',
        'type'        => 'text',
        'desc'        => 'Facebook profile/page link',
        'section'     => 'footer'
      ),
      array(
        'label'       => 'Pinterest Link',
        'id'          => 'pinterest_link',
        'type'        => 'text',
        'desc'        => 'Pinterest profile/page link',
        'section'     => 'footer'
      ),
      array(
        'label'       => 'Twitter Link',
        'id'          => 'twitter_link',
        'type'        => 'text',
        'desc'        => 'Twitter profile/page link',
        'section'     => 'footer'
      ),
      array(
        'label'       => 'Google Plus Link',
        'id'          => 'googleplus_link',
        'type'        => 'text',
        'desc'        => 'Google Plus profile/page link',
        'section'     => 'footer'
      ),
      array(
        'label'       => 'Linkedin Link',
        'id'          => 'linkedin_link',
        'type'        => 'text',
        'desc'        => 'Linkedin profile/page link',
        'section'     => 'footer'
      ),
      array(
        'label'       => 'Instagram Link',
        'id'          => 'instragram_link',
        'type'        => 'text',
        'desc'        => 'Instagram profile/page link',
        'section'     => 'footer'
      ),
      array(
        'label'       => 'Xing Link',
        'id'          => 'xing_link',
        'type'        => 'text',
        'desc'        => 'Xing profile/page link',
        'section'     => 'footer'
      ),
      array(
        'label'       => 'Tumblr Link',
        'id'          => 'tumblr_link',
        'type'        => 'text',
        'desc'        => 'Tumblr profile/page link',
        'section'     => 'footer'
      ),
      array(
        'label'       => 'Vkontakte Link',
        'id'          => 'vk_link',
        'type'        => 'text',
        'desc'        => 'Vkontakte profile/page link',
        'section'     => 'footer'
      ),
      array(
        'label'       => 'SoundCloud Link',
        'id'          => 'soundcloud_link',
        'type'        => 'text',
        'desc'        => 'SoundCloud profile/page link',
        'section'     => 'footer'
      ),
      array(
        'label'       => 'Dribbble Link',
        'id'          => 'dribbble_link',
        'type'        => 'text',
        'desc'        => 'Dribbbble profile/page link',
        'section'     => 'footer'
      ),
      array(
        'label'       => 'YouTube Link',
        'id'          => 'youtube_link',
        'type'        => 'text',
        'desc'        => 'Youtube profile/page link',
        'section'     => 'footer'
      ),
      array(
        'label'       => 'Spotify Link',
        'id'          => 'spotify_link',
        'type'        => 'text',
        'desc'        => 'Spotify profile/page link',
        'section'     => 'footer'
      ),
     )
   );
  $portfolio_metabox = array(
    'id'          => 'portfolio_metaboxes',
    'title'       => 'Portfolio Settings',
    'pages'       => array( 'portfolio' ),
    'position'    => 'acf_after_title',
    'context'     => 'normal',
    'priority'    => 'high',
    'fields'      => array(
		  array(
    	  'label'       => 'Portfolio Description',
    	  'id'          => 'portfolio_desc',
    	  'type'        => 'text',
    	  'desc'        => 'Real portfolio category description'
    	),
      array(
      'label' => 'Portfolio Text',
      'id' => 'portfolio_text',
      'type' => 'textarea'
      ),
    	array(
    	  'label'       => 'Portfolio Hover Color',
    	  'id'          => 'portfolio_hover',
    	  'type'        => 'colorpicker_opacity',
    	  'desc'        => 'This changes the hover color of the portfolio'
    	),
    	array(
    	  'label'       => 'Portfolio Page Background Color',
    	  'id'          => 'portfolio_bg',
    	  'type'        => 'background',
    	  'desc'        => 'This changes the background color of the portfolio'
    	)
    )
  );
  $page_metabox = array(
    'id'          => 'post_metaboxes_combined',
    'title'       => 'Page Settings',
    'pages'       => array( 'page' ),
    'context'     => 'normal',
    'priority'    => 'high',
    'fields'      => array(
    	
    	array(
    	  'id'          => 'tab0',
    	  'label'       => 'Header Settings',
    	  'type'        => 'tab'
    	),
    	array(
    	  'label'       => 'Revolution Slider at the top',
    	  'id'          => 'rev_slider_alias',
    	  'type'        => 'revslider-select',
    	  'desc'        => 'If you would like to display Revolution Slider on top of this page, please choose the slider alias',
    	  'std'         => '',
    	  'rows'        => '1'
    	),
    	array(
    	  'label'       => 'Display Scroll Icon?',
    	  'id'          => 'rev_slider_scroll',
    	  'type'        => 'on_off',
    	  'desc'        => 'Would you like to display the mouse scroll icon at the bottom?',
    	  'std'         => 'off',
    	  'condition'   => 'rev_slider_alias:not()'
    	),
		array(
		  'label'       => 'Select Page Primary Menu',
		  'id'          => 'page_menu',
		  'type'        => 'menu_select',
		  'desc'        => 'If you select a menu here, it will override the main navigation menu.'
		),
		array(
		  'label'       => 'Header Style',
		  'id'          => 'header_style',
		  'type'        => 'radio',
		  'desc'        => 'Which Style would you like to use for this page?',
		  'choices'     => array(
		  	array(
		  	  'label'       => 'Style 1 (Full Menu - Standard)',
		  	  'value'       => 'style1'
		  	),
		  	array(
		  	  'label'       => 'Style 2 (Overlay menu with mobile toggle on the right)',
		  	  'value'       => 'style2'
		  	),
		    array(
		      'label'       => 'Style 3 (Mobile style menu with mobile toggle on the left)',
		      'value'       => 'style3'
		    )
		  ),
		  'std'         => 'style1'
		),
		array(
		  'label'       => 'Mobile Menu Style',
		  'id'          => 'mobile_menu_style',
		  'type'        => 'radio',
		  'desc'        => 'Which mobile menu would you like to use with your full menu?',
		  'choices'     => array(
		  	array(
		  	  'label'       => 'Style 1 (Overlay Menu)',
		  	  'value'       => 'style2'
		  	),
		    array(
		      'label'       => 'Style 2 (Mobile Menu)',
		      'value'       => 'style3'
		    )
		  ),
		  'std'         => 'style2',
		  'condition'   => 'header_style:is(style1)'
		),
    	array(
    	  'id'          => 'tab1',
    	  'label'       => 'Background',
    	  'type'        => 'tab'
    	),
    	array(
    	  'label'       => 'Page Background',
    	  'id'          => 'page_bg',
    	  'type'        => 'background',
    	  'desc'        => 'Background settings for this page'
    	),

    )
  );
  
  /**
   * Register our meta boxes using the 
   * ot_register_meta_box() function.
   */
	ot_register_meta_box( $page_metabox );
  	ot_register_meta_box( $portfolio_metabox );
  	ot_register_meta_box( $teammember_meta_box );
}