<?php
/*
Plugin Name: RDB Step Form
Plugin URI: https://www.facebook.com/rdbwebdev
Description: A step form plugin for Wordpress. 
Version: 1.0.0
Author: Reece
Author URI: https://www.facebook.com/rdbwebdev
License: GPLv2 or later
Text Domain: rdb-form-plugin
*/

defined( 'ABSPATH' ) or die ('Stop!');

if( !class_exists( 'RdbForm' ) ) {
    
    class RdbForm {
        private $shortcodeName = 'rdbform';

        public function __construct() {
            // add_shortcode('rdbform', [$this, 'initForm']);
            // add_action('wp_enqueue_scripts', [$this, 'enqueue']);
            
        }

        public function register() {
            add_shortcode('rdbform', [$this, 'initForm']);
            add_action('wp_enqueue_scripts', [$this, 'enqueue']);
        }

        public function enqueue() {
            global $post;
            
            if( has_shortcode( $post->post_content, $this->shortcodeName ) ) {
                wp_enqueue_script('vue', 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.min.js', [], '2.6.11');
                wp_enqueue_script( 'app_js', plugin_dir_url( __FILE__ ) . 'assets/app/app.js', ['vue'], '0.1', true );
                wp_enqueue_style( 'app_css', plugin_dir_url( __FILE__ ) . 'assets/css/app.css', [], '0.1' );
            }
        }

        public function initForm($atts) {
            $class = shortcode_atts( array(
                'form_button' => '',
                'form_id' => 1,
                'fields' => array(),
            ), $atts );

            return "<div id='app' 
                        data-button='". esc_attr($class['form_button']) ."' 
                        data-fields='". esc_attr($class['fields']) ."' 
                        data-id='". esc_attr($class['form_id'])."' class='" . esc_attr($class['class']) . "'>
                    </div>";
        }

    }

    (new RdbForm())->register();

}