<?php
/*
Plugin Name: User Node
Description: Adds custom JavaScript code to your website.
*/

function register_script_enqueue() {
    wp_enqueue_script( 'register-script', plugin_dir_url( __FILE__ ) . 'script_node.js', array( 'jquery' ), '1.1', true );
}

add_action( 'wp_enqueue_scripts', 'register_script_enqueue' );
