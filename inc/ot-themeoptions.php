<?php
/**
 * Initialize the options before anything else. 
 */
add_action( 'admin_init', 'thb_custom_theme_options', 1 );

/**
 * Theme Mode demo code of all the available option types.
 *
 * @return    void
 *
 * @access    private
 * @since     2.0
 */
function thb_custom_theme_options() {
  
  /**
   * Get a copy of the saved settings array. 
   */
  $saved_settings = get_option( 'option_tree_settings', array() );
  
  /**
   * Create a custom settings array that we pass to 
   * the OptionTree Settings API Class.
   */
  $custom_settings = array(
    'sections'        => array(
      array(
        'title'       => 'General',
        'id'          => 'general'
      ),
      array(
        'title'       => 'Blog Settings',
        'id'          => 'blog'
      ),
      array(
        'title'       => 'Header Settings',
        'id'          => 'header'
      ),
      array(
        'title'       => 'Customization',
        'id'          => 'customization'
      ),
      array(
        'title'       => 'Google Map Settings',
        'id'          => 'contact'
      ),
      array(
        'title'       => 'Misc',
        'id'          => 'misc'
      ),
      array(
        'title'       => 'Demo Content',
        'id'          => 'import'
      )
    ),
    'settings'        => array(
    	array(
    	  'id'          => 'general_tab1',
    	  'label'       => 'General',
    	  'type'        => 'tab',
    	  'section'     => 'general'
    	),
		array(
    	  'label'       => 'Smooth Scroll',
    	  'id'          => 'smooth_scroll',
    	  'type'        => 'on_off',
    	  'desc'        => 'You can disable smooth scrolling from here',
    	  'std'         => 'on',
    	  'section'     => 'general'
    	),
    	array(
    	  'label'       => 'Scroll to Top Arrow',
    	  'id'          => 'scroll_totop',
    	  'type'        => 'on_off',
    	  'desc'        => 'You can disable scroll to top arrow from here',
    	  'std'         => 'on',
    	  'section'     => 'general'
    	),
      array(
        'id'          => 'header_tab3',
        'label'       => 'Menu Settings',
        'type'        => 'tab',
        'section'     => 'general'
      ),
      array(
        'label'       => 'Menu Footer',
        'id'          => 'menu_footer',
        'type'        => 'textarea',
        'desc'        => 'This content appears at the bottom of the menu. You can use your shortcodes here.',
        'rows'        => '4',
        'section'     => 'general'
      ),
      array(
        'id'          => 'header_tab4',
        'label'       => 'Preloader Settings',
        'type'        => 'tab',
        'section'     => 'general'
      ),
      array(
        'label'       => 'Preloader Background',
        'id'          => 'preloader_bg',
        'type'        => 'background',
        'desc'        => 'Background settings for the preloader',
        'section'     => 'general'
      ),
      array(
        'id'          => 'header_tab1',
        'label'       => 'Header Settings',
        'type'        => 'tab',
        'section'     => 'header'
      ),
      array(
        'label'       => 'Mobile Header Height',
        'id'          => 'header_height_mobile',
        'type'        => 'measurement',
        'desc'        => 'You can modify the mobile header height from here',
        'section'     => 'header'
      ),
      array(
        'label'       => 'Header Height',
        'id'          => 'header_height',
        'type'        => 'measurement',
        'desc'        => 'You can modify the header height from here',
        'section'     => 'header'
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
        'section'	  => 'header'
      ),
      array(
        'id'          => 'header_tab2',
        'label'       => 'Logo Settings',
        'type'        => 'tab',
        'section'     => 'header'
      ),
      array(
        'label'       => 'Mobile Logo Height',
        'id'          => 'logo_height_mobile ',
        'type'        => 'measurement',
        'desc'        => 'You can modify the logo height for mobile screens from here. This is maximum height, so your logo may get smaller depending on spacing inside header',
        'section'     => 'header'
      ),
      array(
        'label'       => 'Logo Height',
        'id'          => 'logo_height',
        'type'        => 'measurement',
        'desc'        => 'You can modify the logo height from here. This is maximum height, so your logo may get smaller depending on spacing inside header',
        'section'     => 'header'
      ),
      array(
        'label'       => 'Logo Upload for Light Backgrounds',
        'id'          => 'logo',
        'type'        => 'upload',
        'desc'        => 'You can upload your own logo here. Since this theme is retina-ready, <strong>please upload a double size image.</strong> The image should be maximum 100 pixels in height.',
        'section'     => 'header'
      ),
      array(
        'label'       => 'Logo Upload for Dark Backgrounds',
        'id'          => 'logo_dark',
        'type'        => 'upload',
        'desc'        => 'You can upload your own logo here. Since this theme is retina-ready, <strong>please upload a double size image.</strong> The image should be maximum 100 pixels in height.',
        'section'     => 'header'
      ),
      array(
        'id'          => 'blog_tab1',
        'label'       => 'General Blog Settings',
        'type'        => 'tab',
        'section'     => 'blog'
      ),

      array(
        'label'       => 'Blog Header',
        'id'          => 'blog_header',
        'type'        => 'textarea',
        'desc'        => 'This content appears on top of the blog page. You can use your shortcodes here. <small>You can create your content using visual composer and then copy its text here</small>',
        'rows'        => '4',
        'section'     => 'blog'
      ),
      array(
        'id'          => 'blog_tab2',
        'label'       => 'Social Sharing',
        'type'        => 'tab',
        'section'     => 'blog'
      ),
      array(
        'label'       => 'Sharing buttons',
        'id'          => 'sharing_buttons',
        'type'        => 'checkbox',
        'desc'        => 'You can choose which social networks to display',
        'choices'     => array(
          array(
            'label'       => 'Facebook',
            'value'       => 'facebook'
          ),
          array(
            'label'       => 'Twitter',
            'value'       => 'twitter'
          ),
          array(
            'label'       => 'Pinterest',
            'value'       => 'pinterest'
          )
        ),
        'section'     => 'blog'
      ),
      array(
        'id'          => 'misc_tab0',
        'label'       => 'General',
        'type'        => 'tab',
        'section'     => 'misc'
      ),
      array(
        'label'       => 'Login Logo Upload',
        'id'          => 'loginlogo',
        'type'        => 'upload',
        'desc'        => 'You can upload a custom logo for your wp-admin login page here',
        'section'     => 'misc'
      ),
      array(
        'label'       => 'Favicon Upload',
        'id'          => 'favicon',
        'type'        => 'upload',
        'desc'        => 'You can upload your own favicon here.',
        'section'     => 'misc'
      ),
      array(
        'label'       => 'Extra CSS',
        'id'          => 'extra_css',
        'type'        => 'css',
        'desc'        => 'Any CSS that you would like to add to the them.e',
        'section'     => 'misc'
      ),
      array(
        'id'          => 'misc_tab1',
        'label'       => '404 Page',
        'type'        => 'tab',
        'section'     => 'misc'
      ),
      array(
        'label'       => '404 Page Background',
        'id'          => '404_bg',
        'type'        => 'background',
        'desc'        => 'Background settings for 404 page',
        'section'     => 'misc'
      ),
      array(
        'label'       => 'Which logo to use for 404 page?',
        'id'          => '404_logo',
        'type'        => 'radio',
        'desc'        => 'Which logo would you like to use for 404 page?',
        'choices'     => array(
          array(
            'label'       => 'Light Logo',
            'value'       => 'light'
          ),
          array(
            'label'       => 'Dark Logo',
            'value'       => 'dark'
          )
        ),
        'std'         => 'light',
        'section'     => 'misc'
      ),
      array(
        'id'          => 'misc_tab2',
        'label'       => 'Twitter OAuth',
        'type'        => 'tab',
        'section'     => 'misc'
      ),
      array(
        'id'          => 'twitter_text',
        'label'       => 'About the Twitter Settings',
        'desc'        => 'You should fill out these settings if you want to use the Twitter related widgets or Visual Composer Elements',
        'std'         => '',
        'type'        => 'textblock',
        'section'     => 'misc'
      ),
      array(
        'label'       => 'Twitter Username',
        'id'          => 'twitter_bar_username',
        'type'        => 'text',
        'desc'        => 'Username to pull tweets for',
        'section'     => 'misc'
      ),
      array(
        'label'       => 'Consumer Key',
        'id'          => 'twitter_bar_consumerkey',
        'type'        => 'text',
        'desc'        => 'Visit <a href="https://dev.twitter.com/apps">this link</a> in a new tab, sign in with your account, click on Create a new application and create your own keys in case you dont have already',
        'section'     => 'misc'
      ),
      array(
        'label'       => 'Consumer Secret',
        'id'          => 'twitter_bar_consumersecret',
        'type'        => 'text',
        'desc'        => 'Visit <a href="https://dev.twitter.com/apps">this link</a> in a new tab, sign in with your account, click on Create a new application and create your own keys in case you dont have already',
        'section'     => 'misc'
      ),
      array(
        'label'       => 'Access Token',
        'id'          => 'twitter_bar_accesstoken',
        'type'        => 'text',
        'desc'        => 'Visit <a href="https://dev.twitter.com/apps">this link</a> in a new tab, sign in with your account, click on Create a new application and create your own keys in case you dont have already',
        'section'     => 'misc'
      ),
      array(
        'label'       => 'Access Token Secret',
        'id'          => 'twitter_bar_accesstokensecret',
        'type'        => 'text',
        'desc'        => 'Visit <a href="https://dev.twitter.com/apps">this link</a> in a new tab, sign in with your account, click on Create a new application and create your own keys in case you dont have already',
        'section'     => 'misc'
      ),
//      array(
//        'id'          => 'misc_tab5',
//        'label'       => 'Instagram OAuth',
//        'type'        => 'tab',
//        'section'     => 'misc'
//      ),
//      array(
//        'id'          => 'twitter_text',
//        'label'       => 'About the Twitter Settings',
//        'desc'        => 'You should fill out these settings if you want to use the Instagram related VC elements or widgets',
//        'std'         => '',
//        'type'        => 'textblock',
//        'section'     => 'misc'
//      ),
//      array(
//        'label'       => 'Instagram Username',
//        'id'          => 'instagram_username',
//        'type'        => 'text',
//        'desc'        => 'Username to pull instagram images for',
//        'section'     => 'misc'
//      ),
//      array(
//        'label'       => 'API Key',
//        'id'          => 'instagram_apikey',
//        'type'        => 'text',
//        'desc'        => 'Visit <a href="http://instagr.am/developer/register/">this link</a> in a new tab, sign in with your Instagram account, click on Create a new application and create your own keys in case you dont have already',
//        'section'     => 'misc'
//      ),
      array(
        'id'          => 'misc_tab3',
        'label'       => 'Create Additional Sidebars',
        'type'        => 'tab',
        'section'     => 'misc'
      ),
      array(
        'id'          => 'sidebars_text',
        'label'       => 'About the sidebars',
        'desc'        => 'All sidebars that you create here will appear both in the Widgets Page(Appearance > Widgets), from where you will have to configure them, and in the pages, where you will be able to choose a sidebar for each page',
        'std'         => '',
        'type'        => 'textblock',
        'section'     => 'misc'
      ),
      array(
        'label'       => 'Create Sidebars',
        'id'          => 'sidebars',
        'type'        => 'list-item',
        'desc'        => 'Please choose a unique title for each sidebar!',
        'section'     => 'misc',
        'settings'    => array(
          array(
            'label'       => 'ID',
            'id'          => 'id',
            'type'        => 'text',
            'desc'        => 'Please write a lowercase id, with <strong>no spaces</strong>'
          )
        )
      ),
      array(
        'id'          => 'misc_tab4',
        'label'       => 'Handheld Device Icons',
        'type'        => 'tab',
        'section'     => 'misc'
      ),
      array(
        'label'       => '60x60 px (old iPhone)',
        'id'          => 'handheld_old_iphone',
        'type'        => 'upload',
        'desc'        => '',
        'section'     => 'misc'
      ),
      array(
        'label'       => '76x76 px (old iPad)',
        'id'          => 'handheld_old_ipad',
        'type'        => 'upload',
        'desc'        => '',
        'section'     => 'misc'
      ),
      array(
        'label'       => '120x120 px (retina iPhone)',
        'id'          => 'handheld_retina_iphone',
        'type'        => 'upload',
        'desc'        => '',
        'section'     => 'misc'
      ),
      array(
        'label'       => '152x152 px (retina iPhad)',
        'id'          => 'handheld_retina_ipad',
        'type'        => 'upload',
        'desc'        => '',
        'section'     => 'misc'
      ),
      array(
        'id'          => 'demo_import',
        'label'       => 'About Importing Demo Content',
        'desc'        => '<div class="format-setting-label"><h3 class="label">About Importing Demo Content</h3></div><p>Depending on your server connection, it might take a while to import all the data and images. Please make sure that:</p>
        <ul>
         <li>- All necessary plugins installed & activated from Appearance -> Install Plugins</li>
         <li>- You have setup the theme using the instructions in documentation</li>
        </ul>
        <br /><br />
        <p><input type="checkbox" name="thb_fetch_images" id="thb_fetch_images" checked="checked" value="1" class="option-tree-ui-checkbox"><label for="thb_fetch_images">Import Images?</label></p>
        <p><input type="checkbox" name="thb_revslider_import" id="thb_revslider_import" checked="checked" value="1" class="option-tree-ui-checkbox"><label for="thb_revslider_import">Import Revolution Sliders? <small>Revolution Slider plugin must be active</small></label></p>
        <br />
        <br />
        <p><strong style="text-transform: uppercase;">Page will refresh after importing is done, so please wait</strong></p><br><br><a class="button button-primary" id="import-demo-content" href="#">Import Demo Content</a>',
        'std'         => '',
        'type'        => 'textblock',
        'section'     => 'import'
      ),
      array(
        'id'          => 'customization_tab1',
        'label'       => 'Colors',
        'type'        => 'tab',
        'section'     => 'customization'
      ),
      array(
        'label'       => 'Accent Color',
        'id'          => 'accent_color',
        'type'        => 'colorpicker',
        'desc'        => 'Change the accent color used throughout the theme',
        'section'     => 'customization',
        'std'		  => ''
      ),
      array(
        'label'       => 'Full Menu Link Colors',
        'id'          => 'menu_link_color',
        'type'        => 'link_color',
        'desc'        => 'This changes link colors on the full menu',
        'section'     => 'customization'
      ),
      array(
        'label'       => 'Full Menu Link Colors',
        'id'          => 'menu_link_color',
        'type'        => 'link_color',
        'desc'        => 'This changes link colors on the full menu',
        'section'     => 'customization'
      ),
      array(
        'label'       => 'Menu Style 2 Link Colors',
        'id'          => 'menu2_link_color',
        'type'        => 'link_color',
        'desc'        => 'This changes link colors on the style2 menu',
        'section'     => 'customization'
      ),
      array(
        'label'       => 'Menu Style 3 Link Colors',
        'id'          => 'menu3_link_color',
        'type'        => 'link_color',
        'desc'        => 'This changes link colors on the style3 menu',
        'section'     => 'customization'
      ),
      array(
        'id'          => 'customization_tab2',
        'label'       => 'Typography',
        'type'        => 'tab',
        'section'     => 'customization'
      ),
      array(
        'label'       => 'Font Subsets',
        'id'          => 'font_subsets',
        'type'        => 'radio',
        'desc'        => 'You can add additional character subset specific to your language.',
        'choices'     => array(
        	array(
        	  'label'       => 'No Subset',
        	  'value'       => 'no-subset'
        	),
          array(
            'label'       => 'Greek',
            'value'       => 'greek'
          ),
          array(
            'label'       => 'Cyrillic',
            'value'       => 'cyrillic'
          ),
          array(
            'label'       => 'Vietnamese',
            'value'       => 'vietnamese'
          )
        ),
        'std'         => 'no-subset',
        'section'     => 'customization'
      ),
      array(
        'label'       => 'Title Typography',
        'id'          => 'title_type',
        'type'        => 'typography',
        'desc'        => 'Font Settings for the titles',
        'section'     => 'customization'
      ),
      array(
        'label'       => 'Body Text Typography',
        'id'          => 'body_type',
        'type'        => 'typography',
        'desc'        => 'Font Settings for general body font',
        'section'     => 'customization'
      ),
	  array(
        'label'       => 'Full Menu Typography',
        'id'          => 'menu_type',
        'type'        => 'typography',
        'desc'        => 'Font Settings for the main menu',
        'section'     => 'customization'
      ),
      array(
        'label'       => 'Menu Style 2 Typography',
        'id'          => 'menu2_type',
        'type'        => 'typography',
        'desc'        => 'Font Settings for the mobile style2 menu',
        'section'     => 'customization'
      ),
      array(
        'label'       => 'Menu Style 3 Typography',
        'id'          => 'menu3_type',
        'type'        => 'typography',
        'desc'        => 'Font Settings for the mobile style3 menu',
        'section'     => 'customization'
      ),
      array(
        'id'          => 'customization_tab3',
        'label'       => 'Backgrounds',
        'type'        => 'tab',
        'section'     => 'customization'
      ),
      array(
        'label'       => 'Header Background',
        'id'          => 'header_bg',
        'type'        => 'background',
        'desc'        => 'Background settings for the menu.',
        'section'     => 'customization'
      ),
      array(
        'label'       => 'Menu Style 2 Background',
        'id'          => 'menu2_bg',
        'type'        => 'background',
        'desc'        => 'Background settings for the menu.',
        'section'     => 'customization'
      ),
      array(
        'label'       => 'Menu Style 3 Background',
        'id'          => 'menu3_bg',
        'type'        => 'background',
        'desc'        => 'Background settings for the menu.',
        'section'     => 'customization'
      ),
      array(
        'id'          => 'contact_text',
        'label'       => 'About Google Map Settings',
        'desc'        => 'These settings will be used for the map added by the Google Map Visual Composer element.',
        'std'         => '',
        'type'        => 'textblock',
        'section'     => 'contact'
      ),
  		array(
  		  'label'       => 'Map Style',
  		  'id'          => 'contact_map_style',
  		  'type'        => 'radio',
  		  'desc'        => 'You can select different color settings for the map here',
  		  'choices'     => array(
  		    array(
  		      'label'       => 'No Style',
  		      'value'       => '0'
  		    ),
  		    array(
  		      'label'       => 'Paper',
  		      'value'       => '1'
  		    ),
  		    array(
  		      'label'       => 'Light Monochrome',
  		      'value'       => '2'
  		    ),
  		    array(
  		      'label'       => 'Subtle',
  		      'value'       => '3'
  		    ),
  		    array(
  		      'label'       => 'Cool Grey',
  		      'value'       => '4'
  		    ),
  		    array(
  		      'label'       => 'Bentley',
  		      'value'       => '5'
  		    ),
  		    array(
  		      'label'       => 'Icy Blue',
  		      'value'       => '6'
  		    ),
  		    array(
  		      'label'       => 'Turquoise Water',
  		      'value'       => '7'
  		    ),
  		    array(
		        'label'       => 'Blue',
		        'value'       => '8'
		      ),
		    array(
		        'label'       => 'Shades of Grey (Default)',
		        'value'       => '9'
		      ),
  		    
  		  ),
  		  'std'         => '9',
  		  'section'     => 'contact'
  		),
		  array(
		  	'label'       => 'Map Zoom Amount',
		    'id'          => 'contact_zoom',
		    'desc'        => 'Value should be between 1-18, 1 being the entire earth and 18 being right at street level.',
		    'std'         => '17',
		    'type'        => 'numeric-slider',
		    'section'     => 'contact',
		    'min_max_step'=> '1,18,1'
		  ),
		  array(
		    'label'       => 'Map Pin Image',
		    'id'          => 'map_pin_image',
		    'type'        => 'upload',
		    'desc'        => 'If you would like to use your own pin, you can upload it here',
		    'section'     => 'contact'
		  ),
		  array(
		    'label'       => 'Map Center Latitude',
		    'id'          => 'map_center_lat',
		    'type'        => 'text',
		    'desc'        => 'Please enter the latitude for the maps center point. <small>You can get lat-long coordinates using <a href="http://www.latlong.net/convert-address-to-lat-long.html" target="_blank">Latlong.net</a></small>',
		    'section'     => 'contact'
		  ),
		  array(
		    'label'       => 'Map Center Longtitude',
		    'id'          => 'map_center_long',
		    'type'        => 'text',
		    'desc'        => 'Please enter the longitude for the maps center point.',
		    'section'     => 'contact'
		  ),
		  array(
		    'label'       => 'Google Map Pin Locations',
		    'id'          => 'map_locations',
		    'type'        => 'list-item',
		    'desc'        => 'Coordinates to shop on the map',
		    'settings'    => array(
		      array(
		        'label'       => 'Coordinates',
		        'id'          => 'lat_long',
		        'type'        => 'text',
		        'desc'        => 'Coordinates of this location separated by comma. <small>You can get lat-long coordinates using <a href="http://www.latlong.net/convert-address-to-lat-long.html" target="_blank">Latlong.net</a></small>',
		        'rows'        => '1'
		      ),
		      array(
		        'label'       => 'Location Image',
		        'id'          => 'image',
		        'type'        => 'upload',
		        'desc'        => 'You can upload your own location image here. Suggested image size is 110x115'
		      ),
		      array(
		        'label'       => 'Information',
		        'id'          => 'information',
		        'type'        => 'textarea',
		        'desc'        => 'This content appears below the title of the tooltip',
		        'rows'        => '2',
		      ),
		    ),
		    'section'     => 'contact'
		  )
    )
  );
  
  /* settings are not the same update the DB */
  if ( $saved_settings !== $custom_settings ) {
    update_option( 'option_tree_settings', $custom_settings ); 
  }
 
  
  // Add Revolution Slider select option
  function add_revslider_select_type( $array ) {

    $array['revslider-select'] = 'Revolution Slider Select';
    return $array;

  }
  add_filter( 'ot_option_types_array', 'add_revslider_select_type' ); 

  // Show RevolutionSlider select option
  function ot_type_revslider_select( $args = array() ) {
    extract( $args );
    $has_desc = $field_desc ? true : false;
    echo '<div class="format-setting type-revslider-select ' . ( $has_desc ? 'has-desc' : 'no-desc' ) . '">';
    echo $has_desc ? '<div class="description">' . htmlspecialchars_decode( $field_desc ) . '</div>' : '';
      echo '<div class="format-setting-inner">';
      // Add This only if RevSlider is Activated
      if ( class_exists( 'RevSliderAdmin' ) ) {
        echo '<select name="' . esc_attr( $field_name ) . '" id="' . esc_attr( $field_id ) . '" class="option-tree-ui-select ' . $field_class . '">';

        /* get revolution array */
        $slider = new RevSlider();
        $arrSliders = $slider->getArrSlidersShort();

        /* has slides */
        if ( ! empty( $arrSliders ) ) {
          echo '<option value="">-- ' . __( 'Choose One', 'option-tree' ) . ' --</option>';
          foreach ( $arrSliders as $rev_id => $rev_slider ) {
            echo '<option value="' . esc_attr( $rev_id ) . '"' . selected( $field_value, $rev_id, false ) . '>' . esc_attr( $rev_slider ) . '</option>';
          }
        } else {
          echo '<option value="">' . __( 'No Sliders Found', 'option-tree' ) . '</option>';
        }
        echo '</select>';
      } else {
          echo '<span style="color: red;">' . __( 'Sorry! Revolution Slider is not Installed or Activated', 'ventus' ). '</span>';
      }
      echo '</div>';
    echo '</div>';
  }
}

/**
 * Menu Select option type.
 *
 * See @ot_display_by_type to see the full list of available arguments.
 *
 * @param     array     An array of arguments.
 * @return    string
 *
 * @access    public
 * @since     2.0
 */
if ( ! function_exists( 'ot_type_menu_select' ) ) {
  
  function ot_type_menu_select( $args = array() ) {
    
    /* turns arguments array into variables */
    extract( $args );
    
    /* verify a description */
    $has_desc = $field_desc ? true : false;
    
    /* format setting outer wrapper */
    echo '<div class="format-setting type-category-select ' . ( $has_desc ? 'has-desc' : 'no-desc' ) . '">';
      
      /* description */
      echo $has_desc ? '<div class="description">' . htmlspecialchars_decode( $field_desc ) . '</div>' : '';
      
      /* format setting inner wrapper */
      echo '<div class="format-setting-inner">';
      
        /* build category */
        echo '<select name="' . esc_attr( $field_name ) . '" id="' . esc_attr( $field_id ) . '" class="option-tree-ui-select ' . $field_class . '">';
        
        /* get category array */
        $menus = get_terms( 'nav_menu');
        
        /* has cats */
        if ( ! empty( $menus ) ) {
          echo '<option value="">-- ' . __( 'Choose One', 'option-tree' ) . ' --</option>';
          foreach ( $menus as $menu ) {
            echo '<option value="' . esc_attr( $menu->slug ) . '"' . selected( $field_value, $menu->slug, false ) . '>' . esc_attr( $menu->name ) . '</option>';
          }
        } else {
          echo '<option value="">' . __( 'No Menus Found', 'option-tree' ) . '</option>';
        }
        
        echo '</select>';
      
      echo '</div>';
    
    echo '</div>';
    
  }
  
}