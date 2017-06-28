<?php
/*-----------------------------------------------------------------------------------*/
/*	Custom Login Logo Support
/*-----------------------------------------------------------------------------------*/

if( !function_exists( 'thb_custom_login_logo' ) ) {
    function thb_custom_login_logo() {
    	if (ot_get_option('loginlogo', '')) {
    	$loginlogo = ot_get_option('loginlogo', '');
        echo '<style type="text/css">
            h1 a { background-image:url('. esc_url($loginlogo) .') !important; background-size:auto !important;}
        </style>';
        }
    }
    
    add_action('login_head', 'thb_custom_login_logo');
}
?>