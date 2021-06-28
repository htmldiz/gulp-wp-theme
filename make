#!/usr/bin/env php
<?php
if(empty($argv)){
	die('Nothing here');
}
if(!class_exists('FileMakerThemeFiles')){
	class FileMakerThemeFiles{
		public $string = "";
		public $file_name = "";
		public $path = __DIR__;
		function __construct($string = NULL, $file_name = NULL, $path = NULL){
			if(!empty($string)){
				$this->string = $string;
			}
			if(!empty($file_name)){
				$this->file_name = $file_name;
			}
			if(!empty($path)){
				$this->path = $path;
			}
		}
		function make_file(){
			$f = fopen($this->path.'/'.$this->file_name,'a+');
			fwrite($f,$this->string);
			fclose($f);
			echo "file $this->file_name are created \n";
		}
	}
}
if(!class_exists('MakerThemeFiles')){
    class MakerThemeFiles{
    	protected $content;
    	protected $command;
    	protected $args;
    	protected $maketemplate = false;
        function __construct($args){
	        $command = $args[1];
	        switch ($command){
		        case 'front':
		        case 'f':
		        $command = 'create_front_page';
		        $this->maketemplate = true;
		        break;
		        case 's':
		        case 'single':
		        $command = 'create_single';
		        $this->maketemplate = true;
		        break;
		        case 'templ':
		        case 't':
		        case 'template':
		        $command = 'create_template';
		        $this->maketemplate = true;
		        break;
		        case 'part':
		        $command = 'create_part';
		        $this->maketemplate = true;
		        break;
	        }
	        call_user_func( array( $this, $command ), $args );
        }
        function create_front_page(){
	        $this->content = "<?php"."\n";
	        $this->after_create_content();
			$fileMaker = new FileMakerThemeFiles($this->content,'front-page.php');
	        $fileMaker->make_file();
        }
        function create_single($args){
	        $single_name = $args[2];
	        $this->content = "<?php"."\n";
	        $this->after_create_content();
	        $fileMaker = new FileMakerThemeFiles($this->content,"single-$single_name.php");
	        $fileMaker->make_file();
        }
        function create_template($args){
        	$templname = $args[2];
	        $template_name = ucfirst($templname);
	        $this->content = "<?php \n /* Template Name: $template_name */"."\n";
	        $this->after_create_content();
	        $fileMaker = new FileMakerThemeFiles($this->content,"template-$templname.php");
	        $fileMaker->make_file();
        }
        function create_part($args){
        	$templname = $args[2];
	        $template_name = ucfirst($templname);
	        $template_name = str_replace('-',' ',$template_name);
	        $templname_first = explode("-",$templname);
	        $templname_first = reset($templname_first);
	        $template_removed_first = str_replace($templname_first.'-','',$templname);
	        $this->content = "<?php /* Part: $template_name */ ?>"."\n";
	        $fileMaker = new FileMakerThemeFiles($this->content,"parts".DIRECTORY_SEPARATOR."$templname.php");
	        $fileMaker->make_file();
	        echo "<?php get_template_part('parts/$templname_first','$template_removed_first'); ?> \n";
        }
	    function after_create_content(){
		    $this->content .= "get_header();"."\n";
		    $this->content .= "while ( have_posts() ) : the_post(); ?>"."\n\n";
		    $this->content .= "<?php endwhile;"."\n";
		    $this->content .= "get_footer(); ?>"."\n";
	    }
    }
    new MakerThemeFiles($argv);
}
