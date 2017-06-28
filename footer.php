		</div><!-- End role["main"] -->

	<?php if (ot_get_option('scroll_totop') != 'off') { ?>
		<a href="#" id="scroll_totop"></a>
	<?php } ?>
</div> <!-- End #wrapper -->

<div id="ajax-placeholder" class="hide"></div>
<?php 
	/* Always have wp_footer() just before the closing </body>
	 * tag of your theme, or you will break many plugins, which
	 * generally use this hook to reference JavaScript files.
	 */
	 wp_footer(); 
?>
</body>
</html>