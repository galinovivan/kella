<?php
function load_more_posts() {
	$initial = $_POST['initial'];
	$count = $_POST['count'];
	$page = $_POST['page']; 
	$type = $_POST['type'];
	$information = isset($_POST['information']) ? $_POST['information'] : '';
	$style = isset($_POST['style']) ? $_POST['style'] : '';
	$categories =  isset($_POST['categories']) ? $_POST['categories'] : '';
	$columns =  isset($_POST['columns']) ? $_POST['columns'] : '4';
	$offset = (($page - 1) * $count) + $initial;
	
	if ($type == 'post') {
		$args = array(
			'offset' 				 => $offset,
			'posts_per_page'	 => $count,
			'orderby'        => 'post_date',
			'order'          => 'DESC',
			'ignore_sticky_posts' => '1',
			'suppress_filters' => true
		);
	
		$query = new WP_Query( $args );
		
		if ( $query->have_posts() ) {
		    while ( $query->have_posts() ) { $query->the_post(); ?><article itemscope itemtype="http://schema.org/BlogPosting" <?php post_class('small-12 medium-6 large-3 item post columns style2'); ?> id="post-<?php the_ID(); ?>" role="article">
		    		<figure class="post-gallery">
		    			<?php
		    			    $image_id = get_post_thumbnail_id();
		    			    $image_link = wp_get_attachment_image_src($image_id,'full');
		    				$image = aq_resize( $image_link[0], 400, false, true, false, true);  // Blog
		    		
		    			?>
		    			<a href="<?php the_permalink(); ?>"><div class="simple-overlay"></div><img src="<?php echo esc_url($image[0]); ?>" width="<?php echo esc_attr($image[1]); ?>" height="<?php echo esc_attr($image[2]); ?>" alt="<?php the_title(); ?>" /></a>
		    		</figure>
		    		<header class="post-title">
		    			<h2 itemprop="headline"><a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php the_title(); ?></a></h2>
		    		</header>
		    		<aside class="post-meta cf">
		    			<ul>
		    				<li><?php _e("By", THB_THEME_NAME); ?> <?php the_author_posts_link(); ?></li>
		    				<li><time class="author" datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo thb_human_time_diff_enhanced(); ?></time></li>
		    			</ul>
		    		</aside>
		    		
		    		<div class="post-content">
		    			<?php echo thb_excerpt(200, '...'); ?>
		    		</div>
		    		<a href="<?php the_permalink(); ?>" class="more-link"><?php _e( 'Read More', THB_THEME_NAME ); ?></a>
		    	</article><?php
		    }
		}
	}  else if ($type == 'portfolio') {
		$args = array(
			'offset' 			 => $offset,
			'posts_per_page'	 => $count,
			'post_type'=>'portfolio', 
			'post_status' => 'publish', 
			'ignore_sticky_posts' => 1,
			'tax_query' => array(
					array(
			    'taxonomy' => 'project-category',
			    'field' => 'id',
			    'terms' => explode(',',$categories),
			    'operator' => 'IN'
			   )
			 ) 
		);
		
		$posts = new WP_Query( $args );
		
		while ( $posts->have_posts() ) : $posts->the_post();
		    $id = get_the_ID();
		    $i = 1;
		     
		    if ($style == 'grid') {
		    	switch($columns) {
		    		case 2:
	    				$col = 'medium-6';
	    				$w = '630';
	    				$h = '400';
	    				$thb = 'thb-two';
	    				break;
	    			case 3:
	    				$col = 'medium-6 large-4';
	    				$w = '420';
	    				$h = '370';
	    				$thb = 'thb-three';
	    				break;
	    			case 4:
	    				$col = 'medium-6 large-3';
	    				$w = '315';
	    				$h = '300';
	    				$thb = 'thb-four';
	    				break;
	    			case 5:
	    				$col = 'thb-five';
	    				$w = '252';
	    				$h = '240';
	    				$thb = 'thb-five';
	    				break;
	    			case 6:
	    				$col = 'medium-4 large-2';
	    				$w = '210';
	    				$h = '195';
	    				$thb = 'thb-six';
	    				break;
		    	}
			    $portfolio_hover = (get_post_meta($id, 'portfolio_hover', true) ? get_post_meta($id, 'portfolio_hover', true) : ot_get_option('portfolio_hover'));
			    $image_id = get_post_thumbnail_id($id);
			    $image_link = wp_get_attachment_image_src($image_id,'full');
			    $image = aq_resize( $image_link[0], $w, $h, true, false);
			    $image_title = esc_attr( get_the_title($id) );
			    $type = get_post_meta($id, 'portfolio_type', true);
			    $meta = get_the_term_list( $id, 'project-category', '', ', ', '' ); 
			    $meta = preg_replace('/<a href=\"(.*?)\">(.*?)<\/a>/', "\\2", $meta);
			    $terms = get_the_terms( $id, 'project-category' );
			    $cats = '';
			    	
			    foreach ($terms as $term) { $cats .= ' '.strtolower($term->slug); }
				    
			    ?><article <?php post_class('post portfolio'.(($information == 'below') ? ' portfolio-overlay' : '').' item grid-sizer small-12 '.$col.' columns '. $cats); ?> id="post-<?php the_ID(); ?>">
			    	<?php if ($information == 'below') { ?>
			    	<a href="<?php the_permalink() ?>" rel="bookmark" class="post-gallery" data-id="<?php the_ID(); ?>">
			    		<img src="<?php echo esc_url($image[0]); ?>" width="<?php echo esc_attr($image[1]); ?>" height="<?php echo esc_attr($image[2]); ?>" alt="<?php echo esc_attr($image_title); ?>" />
			    	</a>
			    	<div class="portfolio-bottom">
			    		<div class="over" style="background: <?php echo esc_attr($portfolio_hover); ?>"></div>
			    		<header class="post-title">
			    			<h3><a href="<?php the_permalink() ?>" rel="bookmark"><?php the_title(); ?></a></h3>
			    		</header>
			    		<div class="post-content">
			    			<?php echo thb_ShortenText(get_the_excerpt(), 150); ?>
			    		</div>
			    		<aside class="post-meta"><?php echo esc_attr($meta); ?></aside>
			    	</div>
			    	<?php } else if ($information == 'over') { ?>
			    	<a href="<?php the_permalink() ?>" rel="bookmark" class="post-gallery overlay-effect" data-id="<?php the_ID(); ?>">
			    		<img src="<?php echo esc_url($image[0]); ?>" width="<?php echo esc_attr($image[1]); ?>" height="<?php echo esc_attr($image[2]); ?>" alt="<?php echo esc_attr($image_title); ?>" />
			    		<div class="overlay" style="background: <?php echo esc_attr($portfolio_hover); ?>">
			    			<div class="table">
			    				<div>
			    					<div class="child post-title">
			    						<h3><?php the_title(); ?></h3>
			    					</div>
			    					<div class="child post-content">
			    					<?php echo thb_ShortenText(get_the_excerpt(), 100); ?>
			    				</div>
			    					<aside class="child post-meta">
			    						<?php echo esc_attr($meta); ?>
			    					</aside>
			    				</div>
			    			</div>
			    		</div>
			    	</a>
			    	<?php } ?>
			    </article><?php
			} else if (in_array($style, array('style1','style2','style3'))) {
					$imagesize=array("400","300");
					$articlesize = 'small-12 medium-4 grid-sizer';
					$font = 'medium';
					
					$id = get_the_ID();
					$portfolio_hover = (get_post_meta($id, 'portfolio_hover', true) ? get_post_meta($id, 'portfolio_hover', true) : ot_get_option('portfolio_hover'));
					$image_id = get_post_thumbnail_id();
					$image_link = wp_get_attachment_image_src($image_id,'full');
					$image = aq_resize( $image_link[0], $imagesize[0], $imagesize[1], true, false, true);
					$image_title = esc_attr( get_the_title($id) );
					$meta = get_the_term_list( $id, 'project-category', '', ', ', '' ); 
					$meta = preg_replace('/<a href=\"(.*?)\">(.*?)<\/a>/', "\\2", $meta);
					$terms = get_the_terms( $id, 'project-category' );
					$cats = '';
					
					foreach ($terms as $term) { $cats .= ' '.strtolower($term->slug); }
				?><article <?php post_class('post '.$articlesize.' columns item '.$cats); ?> id="post-<?php the_ID(); ?>">
					<a href="<?php the_permalink() ?>" rel="bookmark" class="post-gallery overlay-effect" data-id="<?php the_ID(); ?>">
						<img src="<?php echo esc_url($image[0]); ?>" width="<?php echo esc_attr($image[1]); ?>" height="<?php echo esc_attr($image[2]); ?>" alt="<?php echo esc_attr($image_title); ?>" />
						<div class="overlay" style="background: <?php echo esc_attr($portfolio_hover); ?>">
							<div class="table">
								<div>
									<div class="child post-title">
										<h3><?php the_title(); ?></h3>
									</div>
									<div class="child post-content">
									<?php echo thb_ShortenText(get_the_excerpt(), 100); ?>
								</div>
									<aside class="child post-meta">
										<?php echo esc_attr($meta); ?>
									</aside>
								</div>
							</div>
						</div>
					</a>
				</article><?php
			}
 		endwhile; 
	}
	die();
}
add_action("wp_ajax_nopriv_thb_ajax", "load_more_posts");
add_action("wp_ajax_thb_ajax", "load_more_posts");
