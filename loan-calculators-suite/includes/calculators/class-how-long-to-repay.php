<?php
/**
 * How Long To Repay Calculator Class
 *
 * @package Loan_Calculators_Suite
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * How Long To Repay Calculator Class
 */
class LCS_How_Long_To_Repay {
    /**
     * Constructor
     */
    public function __construct() {
        // Register assets
        add_action('wp_enqueue_scripts', array($this, 'register_assets'));
        
        // Register shortcode
        add_shortcode('how_long_to_repay_calculator', array($this, 'shortcode_callback'));
    }

    /**
     * Register assets
     */
    public function register_assets() {
        // Register CSS
        wp_register_style(
            'lcs-how-long-to-repay-styles',
            LCS_PLUGIN_URL . 'assets/css/how-long-to-repay.css',
            array('lcs-common-styles'),
            LCS_VERSION
        );
        
        // Register JavaScript
        wp_register_script(
            'lcs-how-long-to-repay-script',
            LCS_PLUGIN_URL . 'assets/js/how-long-to-repay.js',
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
                'title' => 'How Long To Repay Calculator',
            ),
            $atts,
            'how_long_to_repay_calculator'
        );
        
        // Enqueue assets
        wp_enqueue_style('lcs-how-long-to-repay-styles');
        wp_enqueue_script('lcs-how-long-to-repay-script');
        
        // Include template
        $template_file = LCS_PLUGIN_PATH . 'templates/how-long-to-repay-template.php';
        if (!file_exists($template_file)) {
            return '<p>Error: How Long To Repay Calculator template not found.</p>';
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
new LCS_How_Long_To_Repay();