<?php
/**
 * Borrowing Power Calculator Class
 *
 * @package Loan_Calculators_Suite
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Borrowing Power Calculator Class
 */
class LCS_Borrowing_Power {
    /**
     * Constructor
     */
    public function __construct() {
        // Register assets
        add_action('wp_enqueue_scripts', array($this, 'register_assets'));
        
        // Register shortcode
        add_shortcode('borrowing_power_calculator', array($this, 'shortcode_callback'));
    }

    /**
     * Register assets
     */
    public function register_assets() {
        // Register CSS
        wp_register_style(
            'lcs-borrowing-power-styles',
            LCS_PLUGIN_URL . 'assets/css/borrowing-power.css',
            array('lcs-common-styles'),
            LCS_VERSION
        );
        
        // Register JavaScript
        wp_register_script(
            'lcs-borrowing-power-script',
            LCS_PLUGIN_URL . 'assets/js/borrowing-power.js',
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
                'title' => 'Borrowing Power Calculator',
            ),
            $atts,
            'borrowing_power_calculator'
        );
        
        // Enqueue assets
        wp_enqueue_style('lcs-borrowing-power-styles');
        wp_enqueue_script('lcs-borrowing-power-script');
        
        // Include template
        $template_file = LCS_PLUGIN_PATH . 'templates/borrowing-power-template.php';
        if (!file_exists($template_file)) {
            return '<p>Error: Borrowing Power Calculator template not found.</p>';
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
new LCS_Borrowing_Power();