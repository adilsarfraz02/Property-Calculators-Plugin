<?php
/**
 * Loan Repayment Calculator Class
 *
 * @package Loan_Calculators_Suite
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Loan Repayment Calculator Class
 */
class LCS_Loan_Repayment {
    /**
     * Constructor
     */
    public function __construct() {
        // Register assets
        add_action('wp_enqueue_scripts', array($this, 'register_assets'));
        
        // Register shortcode
        add_shortcode('loan_repayment_calculator', array($this, 'shortcode_callback'));
    }

    /**
     * Register assets
     */
    public function register_assets() {
        // Register CSS
        wp_register_style(
            'lcs-loan-repayment-styles',
            LCS_PLUGIN_URL . 'assets/css/loan-repayment.css',
            array('lcs-common-styles'),
            LCS_VERSION
        );
        
        // Register JavaScript
        wp_register_script(
            'lcs-loan-repayment-script',
            LCS_PLUGIN_URL . 'assets/js/loan-repayment.js',
            array('jquery', 'chart-js', 'lcs-common-script'),
            LCS_VERSION,
            true
        );
    }

    /**
     * Shortcode callback
     */
    public function shortcode_callback($atts = array()) {
        // Parse attributes
        $atts = shortcode_atts(
            array(
                'title' => 'Loan Repayment Calculator',
            ),
            $atts,
            'loan_repayment_calculator'
        );
        
        // Enqueue assets
        wp_enqueue_style('lcs-loan-repayment-styles');
        wp_enqueue_script('lcs-loan-repayment-script');
        
        // Include template
        $template_file = LCS_PLUGIN_PATH . 'templates/loan-repayment-template.php';
        if (!file_exists($template_file)) {
            return '<p>Error: Loan Repayment Calculator template not found.</p>';
        }
        
        // Start output buffering
        ob_start();
        
        // Include template
        include $template_file;
        
        // Return buffered output
        return ob_get_clean();
    }
}

// Initialize the calculator
new LCS_Loan_Repayment();