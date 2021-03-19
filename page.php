<?php
	get_header();
	while ( have_posts() ) : the_post();
?>
<div class="container">
	<div class="row">
		<div class="col">

		</div>
	</div>
</div>
<?php
	endwhile;
	get_footer();
?>