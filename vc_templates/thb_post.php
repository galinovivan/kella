<?php function thb_post( $atts, $content = null ) {
    extract(shortcode_atts(array(
    	'type'	=> 'grid',
       	'carousel' => 'no',
       	'item_count' => '3',
       	'columns' => '3'
    ), $atts));
    
	$args = array(
		'showposts' => $item_count, 
		'nopaging' => 0, 
		'post_type'=>'post', 
		'post_status' => 'publish', 
		'ignore_sticky_posts' => 1,
		'no_found_rows' => true,
		'suppress_filters' => 0
	);
	
	$posts = new WP_Query( $args );
 	
 	ob_start();
 	
	if ( $posts->have_posts() ) { ?>
	  <?php switch($columns) {
	  	case 2:
	  		$col = 'large-6';
	  		$w = '570';
	  		break;
	  	case 3:
	  		$col = 'large-4';
	  		$w = '370';
	  		break;
	  	case 4:
	  		$col = 'large-3';
	  		$w = '270';
	  		break;
	  } ?>
	  <?php if ($type == "list") { ?>
	  	<div class="posts list-posts row" data-equal="article">
	  		<div class="small-12 medium-10 medium-centered columns">
	  		<?php while ( $posts->have_posts() ) : $posts->the_post(); ?>
	  			<article <?php post_class('post'); ?> id="post-<?php the_ID(); ?>">
	  				<div class="row">
		  			    <div class="medium-10 columns">
		  			    	<figure class="comment-count">
	  			    			<?php comments_popup_link('0', '1', '%', 'postcommentcount', '-'); ?>
	  			    		</figure>
	  			    		<div class="post-container">
			  			    	<header class="post-title">
			  			    	  	<h3 itemprop="headline"><a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php the_title(); ?></a></h3>
			  			    	</header>
				  			    <div class="post-content">
				  			    	<?php echo thb_ShortenText(get_the_content(), 150); ?>
				  			    </div>
				  			    <aside class="post-author cf">
				  			    	<?php the_author_posts_link(); ?> - 
				  			    	<time class="time" datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo thb_human_time_diff_enhanced(); ?></time>
				  			    </aside>
			  			    </div>
		  			    </div>
		  			    <div class="medium-2 columns hide-for-small">
		  			    	<figure class="post-gallery">
		  			    		<?php
		  			    		    $image_id = get_post_thumbnail_id();
		  			    		    $image_link = wp_get_attachment_image_src($image_id,'full');
		  			    	
		  			    			$image = aq_resize( $image_link[0], 185, 145, true, false);  // Blog
		  			    	
		  			    		?>
		  			    		<a href="<?php the_permalink(); ?>"><img src="<?php echo esc_url($image[0]); ?>" width="<?php echo esc_attr($image[1]); ?>" height="<?php echo esc_attr($image[2]); ?>" /></a>
		  			    	</figure>
	  			    	</div>
	  			    </div>
	  			</article>
	  		<?php endwhile; // end of the loop. ?>
	  	 	</div>
	  	</div>
	  <?php } else {  ?> 
		<?php if ($carousel == "yes") { ?>
			<div class="carousel posts owl row" data-columns="<?php echo $columns; ?>" data-navigation="true" data-bgcheck="false">				
					
					<?php while ( $posts->have_posts() ) : $posts->the_post(); ?>
						<article <?php post_class('post small-12 '.$col.' columns'); ?> id="post-<?php the_ID(); ?>">
							<figure class="post-gallery">
								<?php
								    $image_id = get_post_thumbnail_id();
								    $image_link = wp_get_attachment_image_src($image_id,'full');
							
									$image = aq_resize( $image_link[0], 400, 290, true, false);  // Blog
							
								?>
								<a href="<?php the_permalink(); ?>"><img src="<?php echo esc_url($image[0]); ?>" width="<?php echo esc_attr($image[1]); ?>" height="<?php echo esc_attr($image[2]); ?>" /></a>
							</figure>
							<header class="post-title">
								<h3 itemprop="headline"><a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php the_title(); ?></a></h3>
							</header>
							<div class="post-content">
								<?php echo thb_ShortenText(get_the_content(), 200); ?>
							</div>
							<aside class="post-author cf">
								<?php the_author_posts_link(); ?> - 
								<time class="time" datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo thb_human_time_diff_enhanced(); ?></time>
							</aside>
						</article>
					<?php endwhile; // end of the loop. ?>	 
										
				</div>
		<?php } else {  ?> 
			<div class="posts row" data-equal="article">
		
			<?php while ( $posts->have_posts() ) : $posts->the_post(); ?>
				<article <?php post_class('small-12 medium-6 '.$col.' columns post'); ?> id="post-<?php the_ID(); ?>">
					<figure class="post-gallery">
						<?php
						    $image_id = get_post_thumbnail_id();
						    $image_link = wp_get_attachment_image_src($image_id,'full');
					
							$image = aq_resize( $image_link[0], 400, 290, true, false);  // Blog
					
						?>
						<a href="<?php the_permalink(); ?>"><img src="<?php echo $image[0]; ?>" width="<?php echo $image[1]; ?>" height="<?php echo $image[2]; ?>" /></a>
					</figure>
				    <header class="post-title">
				    	<h3 itemprop="headline"><a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php the_title(); ?></a></h3>
				    </header>
				    <div class="post-content">
				    	<?php echo thb_ShortenText(get_the_content(), 150); ?>
				    </div>
				    <aside class="post-author cf">
				    	<?php the_author_posts_link(); ?> - 
				    	<time class="time" datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo thb_human_time_diff_enhanced(); ?></time>
				    </aside>
				</article>
			<?php endwhile; // end of the loop. ?>
		 
		</div>
		<?php } ?>
	   <?php } ?>
	<?php }

   $out = ob_get_contents();
   if (ob_get_contents()) ob_end_clean();
   
   wp_reset_query();
   wp_reset_postdata();
     
  return $out;
}
add_shortcode('thb_post', 'thb_post');
