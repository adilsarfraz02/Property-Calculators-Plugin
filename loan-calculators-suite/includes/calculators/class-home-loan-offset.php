<?php
/**
 * Home Loan Offset Calculator Class
 *
 * @package Loan_Calculators_Suite
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Home Loan Offset Calculator Class
 */
class LCS_Home_Loan_Offset {

	/**
	 * Constructor
	 */
	public function __construct() {
		// Register assets
		add_action( 'wp_enqueue_scripts', array( $this, 'register_assets' ) );
	}

	/**
	 * Register calculator specific assets
	 */
	public function register_assets() {
		// Register CSS
		wp_register_style(
			'lcs-home-loan-offset-styles',
			LCS_PLUGIN_URL . 'assets/css/home-loan-offset.css',
			array( 'lcs-common-styles' ),
			LCS_VERSION
		);

		// Register JS
		wp_register_script(
			'lcs-home-loan-offset-script',
			LCS_PLUGIN_URL . 'assets/js/home-loan-offset.js',
			array( 'jquery', 'lcs-common-script', 'chart-js' ),
			LCS_VERSION,
			true
		);
	}

	/**
	 * Home Loan Offset Calculator shortcode callback
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string Shortcode output.
	 */
	public function home_loan_offset_calculator( $atts ) {
		// Enqueue required assets
		wp_enqueue_style( 'lcs-home-loan-offset-styles' );
		wp_enqueue_script( 'lcs-home-loan-offset-script' );

		// Start output buffer
		ob_start();

		// Include template
		include LCS_PLUGIN_DIR . 'templates/home-loan-offset-template.php';

		// Return the buffered content
		return ob_get_clean();
	}
}