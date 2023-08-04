<?php
/*
Plugin Name: User Node
Description: Adds custom JavaScript code to your website.
*/

function user_script_enqueue() {
    wp_enqueue_script( 'user-script', plugin_dir_url( __FILE__ ) . 'script.js', array( 'jquery' ), '1.1', true );

}

add_action( 'wp_enqueue_scripts', 'user_script_enqueue' );
