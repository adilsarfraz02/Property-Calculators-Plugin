<?php
/**
 * Extra Repayment Calculator Class
 *
 * @package Loan_Calculators_Suite
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Extra Repayment Calculator Class
 */
class LCS_Extra_Repayment {

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
			'lcs-extra-repayment-styles',
			LCS_PLUGIN_URL . 'assets/css/extra-repayment.css',
			array( 'lcs-common-styles' ),
			LCS_VERSION
		);

		// Register JS
		wp_register_script(
			'lcs-extra-repayment-script',
			LCS_PLUGIN_URL . 'assets/js/extra-repayment.js',
			array( 'jquery', 'lcs-common-script', 'chart-js' ),
			LCS_VERSION,
			true
		);
	}

	/**
	 * Extra Repayment Calculator shortcode callback
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string Shortcode output.
	 */
	public function extra_repayment_calculator( $atts ) {
		// Enqueue required assets
		wp_enqueue_style( 'lcs-extra-repayment-styles' );
		wp_enqueue_script( 'lcs-extra-repayment-script' );

		// Start output buffer
		ob_start();

		// Include template
		include LCS_PLUGIN_DIR . 'templates/extra-repayment-template.php';

		// Return the buffered content
		return ob_get_clean();
	}
}