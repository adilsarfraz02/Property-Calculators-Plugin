<?php
/**
 * Interest Only Mortgage Calculator Class
 *
 * @package Loan_Calculators_Suite
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Interest Only Mortgage Calculator Class
 */
class LCS_Interest_Only_Mortgage {

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
			'lcs-interest-only-mortgage-styles',
			LCS_PLUGIN_URL . 'assets/css/interest-only-mortgage.css',
			array( 'lcs-common-styles' ),
			LCS_VERSION
		);

		// Register JS
		wp_register_script(
			'lcs-interest-only-mortgage-script',
			LCS_PLUGIN_URL . 'assets/js/interest-only-mortgage.js',
			array( 'jquery', 'lcs-common-script', 'chart-js' ),
			LCS_VERSION,
			true
		);
	}

	/**
	 * Interest Only Mortgage Calculator shortcode callback
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string Shortcode output.
	 */
	public function interest_only_mortgage_calculator( $atts ) {
		// Enqueue required assets
		wp_enqueue_style( 'lcs-interest-only-mortgage-styles' );
		wp_enqueue_script( 'lcs-interest-only-mortgage-script' );

		// Start output buffer
		ob_start();

		// Include template
		include LCS_PLUGIN_DIR . 'templates/interest-only-mortgage-template.php';

		// Return the buffered content
		return ob_get_clean();
	}
}