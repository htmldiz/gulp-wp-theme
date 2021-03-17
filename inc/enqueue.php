<?php 

/**
 * 
 */
class Onetheme_enqueue
{
	
	function __construct()
	{
		add_action( 'wp_enqueue_scripts', array( $this , 'enqueue_scripts' ) );
	}
	function enqueue_scripts(){
		wp_enqueue_style( 'style-onetheme', get_stylesheet_uri() );
        wp_register_script('theme-script', get_template_directory_uri().'/js/all.js', null, false, false);
        wp_enqueue_script('theme-script');
        if (in_array($_SERVER['REMOTE_ADDR'], array('127.0.0.1', '::1'))) {
            $configfilepath = dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'config.json';
	        $handle = fopen($configfilepath, "r");
	        $config = fread($handle, filesize($configfilepath));
	        fclose($handle);
	        $config = json_decode($config);
	        $port = str_replace('http://','',$config->port);
            wp_register_script('livereload', 'http://localhost:'.$port.'/livereload.js?snipver=1', null, false, true);
            wp_enqueue_script('livereload');
        }
	}
}
$Onetheme_enqueue = new Onetheme_enqueue();
?>