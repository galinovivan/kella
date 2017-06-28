<?php function thb_portfolio( $atts, $content = null ) {
    $a = shortcode_atts(array(
    	'style' => 'grid',
    	'columns' => '4',
    	'information' => 'below',
       	'item_count' => '8',
       	'portfolio_sort' => 'by-category',
       	'portfolio_ids' => false,
       	'retrieve' => '3',
       	'categories' => false,
       	'margin' => false,
       	'loadmore' => false,
       	'add_filters' => false
    ), $atts);
    
    if ($a['portfolio_sort'] == 'by-category') {
		$args = array(
			'showposts' => $a['item_count'], 
			'nopaging' => 0, 
			'post_type'=>'portfolio', 
			'post_status' => 'publish', 
			'ignore_sticky_posts' => 1,
			'no_found_rows' => true,
			'tax_query' => array(
					array(
			    'taxonomy' => 'project-category',
			    'field' => 'id',
			    'terms' => explode(',',$a['categories']),
			    'operator' => 'IN'
			   )
			 ) 
		);
    } else  if ($a['portfolio_sort'] == 'by-id') {
    	$portfolio_id_array = explode(',', $a['portfolio_ids']);
    	$args = array(
			'post_type' => 'portfolio',
			'post_status' => 'publish',
			'ignore_sticky_posts'   => 1,
			'post__in'		=> $portfolio_id_array,
			'no_found_rows' => true,
		);
    }
	$posts = new WP_Query( $args );
 	$rand = rand(0,1000);
 	ob_start();
 	?>
 	<?php if ($a['add_filters'] == 'true') { ?>
 		<nav id="filters-<?php echo $rand; ?>" class="filter-main">
 			<div class="row no-padding max_width">
	 			<div class="small-12 columns hide-for-small">
		 			<a href="#" class="thb_toggle"><span></span><?php _e( 'FILTER', THB_THEME_NAME ); ?></a>
		 			<hr />
			 		<ul class="filters">
			 			<li><a href="#" data-filter="*" class="all active"><?php _e( 'All', THB_THEME_NAME ); ?></a></li>
			 			<?php 
			 			$cats = get_categories(array('taxonomy'=>'project-category', 'include' => $a['categories']));
			 			foreach($cats as $portfolio_category) {
			 				$args = array(
			 				    'post_type' => 'portfolio',
			 				    'post_status' => 'published',
			 				    'project-category' => $portfolio_category->slug,
			 				    'numberposts' => -1
			 				);
			 				
			 				echo '<li><a href="#" data-filter=".' . $portfolio_category->slug . '">' . $portfolio_category->name . '</a></li>';
			 				
			 			}
			 			?>
			 		</ul>
			 		
	 			</div>
	 			<div class="small-12 columns show-for-small">
		 			<div class="portfolioselect">
	 					<select class="filter-select">
	 					   <option value="*"><?php _e( 'All', THB_THEME_NAME ); ?></option>
	 					   	<?php 
	 					   	$cats = get_categories(array('taxonomy'=>'project-category', 'include' => $a['categories']));
	 					   	foreach($cats as $portfolio_category) {
	 					   		$args = array(
	 					   		    'post_type' => 'portfolio',
	 					   		    'post_status' => 'published',
	 					   		    'project-category' => $portfolio_category->slug,
	 					   		    'numberposts' => -1
	 					   		);
	 					   		
	 					   		echo '<option value=".' . $portfolio_category->slug . '">' . $portfolio_category->name . '</option>';
	 					   		
	 					   	}
	 					   	?>
	 					</select>
	 				</div>
 				</div>
 			</div>
 		</nav>
 	<?php } ?>
 	<?php if (in_array($a['style'], array('style1','style2','style3'))) { ?>
 		<section class="thb-portfolio masonry row" data-loadmore="#loadmore-<?php echo $rand; ?>" data-filters="#filters-<?php echo $rand; ?>">
 			<?php $i = 1; ?>
 			<?php while ( $posts->have_posts() ) : $posts->the_post(); ?>
 				<?php if ($a['style'] == 'style1') {
	 				switch($i) {
	 					case 1:
	 					case 4:
	 					case 2:
	 					case 3:
	 					case 5:
	 					case 6:
	 					default:
	 						$imagesize=array("320","350");
	 						$articlesize = 'grid-sizer small-6 medium-3 large-3';
	 						$font = 'medium';
	 						break;
	 					
	 				}
 				} else if ($a['style'] == 'style2') {
 					switch($i) {
						case 1:
							$imagesize=array("830","630");
							$font = 'large';
							$articlesize = 'small-12 medium-8';
							break;
						case 3:
							$imagesize=array("400","630");
							$font = 'large';
							$articlesize = 'small-12 medium-4';
							break;
						case 2:
						case 4:
						case 5:
						default:
							$imagesize=array("400","300");
							$articlesize = 'small-12 medium-4 grid-sizer';
							$font = 'medium';
							break;
						
					}	
 				} else if ($a['style'] == 'style3') {
 					switch($i) {
 						case 2:
 						case 6:
 							$imagesize=array("830","300");
 							$font = 'large';
 							$articlesize = 'small-12 medium-8';
 							break;
 						case 5:
							$imagesize=array("400","630");
							$font = 'large';
							$articlesize = 'small-12 medium-4';
							break;
 						case 1:
 						case 3:
 						case 4:
 						default:
 							$imagesize=array("400","300");
 							$articlesize = 'small-12 medium-4 grid-sizer';
 							$font = 'medium';
 							break;
 						
 					}	
 				}
 				?>
 				<?php
 				$id = get_the_ID();
 				$portfolio_hover = (get_post_meta($id, 'portfolio_hover', true) ? get_post_meta($id, 'portfolio_hover', true) : ot_get_option('portfolio_hover'));
 				$portfolio_desc = get_post_meta($id, 'portfolio_desc', true);
 				$image_id = get_post_thumbnail_id();
 				$image_link = wp_get_attachment_image_src($image_id,'full');
 				$image = aq_resize( $image_link[0], $imagesize[0], $imagesize[1], true, false, true);
 				$image_title = esc_attr( get_the_title($id) );
 				$meta = get_the_term_list( $id, 'project-category', '', ', ', '' ); 
 				$meta = preg_replace('/<a href=\"(.*?)\">(.*?)<\/a>/', "\\2", $meta);
 				$terms = get_the_terms( $id, 'project-category' );
 				$cats = '';

 				
 				foreach ($terms as $term) { $cats .= ' '.strtolower($term->slug); }
 				?>
 				
 				<article <?php post_class('post '.$articlesize.' columns item '.$cats); ?> id="post-<?php the_ID(); ?>">
 					
 					<a href="<?php the_permalink() ?>" rel="bookmark" class="post-gallery overlay-effect" data-id="<?php the_ID(); ?>">
 						<img src="<?php echo esc_url($image[0]); ?>" width="<?php echo esc_attr($image[1]); ?>" height="<?php echo esc_attr($image[2]); ?>" alt="<?php echo esc_attr($image_title); ?>" />
 						<div class="overlay" style="background: <?php /// echo esc_attr($portfolio_hover); ?>">
 							<div class="flex">
 								<div>
 									<div class="child post-title">
 										<h3><?php the_title(); ?></h3>
 									</div>
 									<div class="child post-arw"></div>
 									<div class="child post-meta">
 										<?php echo esc_attr($portfolio_desc); ?>
 									</div>

 								</div>
 							</div>
 						</div>
 					</a>
 				</article>
 			<?php $i++; endwhile; // end of the loop. ?>
 		</section>
 	<?php } else if ($a['style'] == 'grid') { ?>
 	
		<?php if ( $posts->have_posts() ) { ?>
			  <?php switch($a['columns']) {
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
			  } ?>
		  <section class="row thb-portfolio masonry<?php if($a['margin'] == 'true') { echo ' margin'; } ?> <?php echo $thb; ?>" data-loadmore="#loadmore-<?php echo $rand; ?>" data-filters="#filters-<?php echo $rand; ?>">
				<?php while ( $posts->have_posts() ) : $posts->the_post(); ?>
					<?php 
					$id = get_the_ID();
					$portfolio_hover = (get_post_meta($id, 'portfolio_hover', true) ? get_post_meta($id, 'portfolio_hover', true) : ot_get_option('portfolio_hover'));
					$image_id = get_post_thumbnail_id();
					$image_link = wp_get_attachment_image_src($image_id,'full');
					$image = aq_resize( $image_link[0], $w, $h, true, false);
					$image_title = esc_attr( get_the_title($id) );
					$type = get_post_meta($id, 'portfolio_type', true);
					$meta = get_the_term_list( $id, 'project-category', '', ', ', '' ); 
					$meta = preg_replace('/<a href=\"(.*?)\">(.*?)<\/a>/', "\\2", $meta);
					$terms = get_the_terms( $id, 'project-category' );
					$cats = '';
						
					foreach ($terms as $term) { $cats .= ' '.strtolower($term->slug); }
					?>
					<article <?php post_class('post'.(($a['information'] == 'below') ? ' portfolio-overlay' : '').' item grid-sizer small-12 '.$col.' columns '. $cats); ?> id="post-<?php the_ID(); ?>">
						<?php if ($a['information'] == 'below') { ?>
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
						<?php } 
						 if ($a['information'] == 'over') { ?>
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
					</article>
				<?php endwhile; // end of the loop. ?>
			 
			 </section>		   
		<?php } ?>
	 <?php } ?>
	
	 <?php if ($a['loadmore']) { ?>
	 	<div class="text-center cf">
	 		<a class="masonry_btn btn" href="#" id="loadmore-<?php echo $rand; ?>" data-type="portfolio" data-loading="<?php _e( 'Loading Posts', THB_THEME_NAME ); ?>" data-nomore="<?php _e( 'No More Posts to Show', THB_THEME_NAME ); ?>" data-initial="<?php echo $a['item_count']; ?>" data-count="<?php echo $a['retrieve']; ?>" data-categories="<?php echo $a['categories']; ?>" data-style="<?php echo $a['style']; ?>" data-columns="<?php echo $a['columns']; ?>" data-information="<?php echo $a['information']; ?>"><?php _e( 'Load More', THB_THEME_NAME ); ?></a>
	 	</div>
	 	<?php } ?>
	<?php 
   $out = ob_get_contents();
   if (ob_get_contents()) ob_end_clean();
   
   wp_reset_query();
   wp_reset_postdata();
     
  return $out;
}
add_shortcode('thb_portfolio', 'thb_portfolio');