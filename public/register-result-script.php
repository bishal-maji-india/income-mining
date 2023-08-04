<?php
/*
Plugin Name: Register Result 
Description: Adds custom JavaScript code to your website.
*/

function register_result_script_enqueue() {
    wp_enqueue_script( 'register-result-script', plugin_dir_url( __FILE__ ) . 'script_register_result.js', array( 'jquery' ), '1.0', true );
}

add_action( 'wp_enqueue_scripts', 'register_result_script_enqueue' );
