<?php
/**
 * Plugin Name: Loan Calculators Suite
 * Plugin URI: 
 * Description: A comprehensive suite of financial calculators including borrowing power, loan repayment, extra repayment, home loan offset, interest-only mortgage, and how long to repay calculators.
 * Version: 1.0.0
 * Author: Adil sarfraz
 * Author URI: https://adilsarfraz.me
 * Text Domain: loan-calculators-suite
 * Requires at least: 5.0
 * Tested up to: 6.3
 * Requires PHP: 7.4
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('LCS_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('LCS_PLUGIN_URL', plugin_dir_url(__FILE__));
define('LCS_VERSION', '1.0.0');

// Include calculator modules
require_once LCS_PLUGIN_PATH . 'includes/class-loan-calculators-suite.php';
require_once LCS_PLUGIN_PATH . 'includes/admin/class-loan-calculators-admin.php';

// Initialize the plugin
function lcs_init() {
    // Initialize the main plugin class
    $loan_calculators_suite = new Loan_Calculators_Suite();
    $loan_calculators_suite->init();
    
    // Initialize admin if in admin area
    if (is_admin()) {
        $loan_calculators_admin = new Loan_Calculators_Admin();
        $loan_calculators_admin->init();
    }
}
add_action('plugins_loaded', 'lcs_init');

// Plugin activation hook
register_activation_hook(__FILE__, 'lcs_activate_plugin');
function lcs_activate_plugin() {
    // Create necessary database tables or options
    add_option('lcs_active_calculators', array(
        'borrowing_power' => true,
        'loan_repayment' => true,
        'extra_repayment' => true,
        'home_loan_offset' => true,
        'interest_only_mortgage' => true,
        'how_long_to_repay' => true
    ));
    
    // Flush rewrite rules
    flush_rewrite_rules();
}

// Plugin deactivation hook
register_deactivation_hook(__FILE__, 'lcs_deactivate_plugin');
function lcs_deactivate_plugin() {
    // Clean up if needed
    flush_rewrite_rules();
}

// Enqueue common assets
function lcs_enqueue_common_assets() {
    // Only load on frontend
    if (is_admin()) {
        return;
    }
    
    // Common CSS
    wp_enqueue_style('lcs-common-styles', LCS_PLUGIN_URL . 'assets/css/common.css', array(), LCS_VERSION);
    
    // Chart.js (used by all calculators)
    wp_enqueue_script('chart-js', 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js', array(), '3.9.1', true);
    
    // Common JavaScript
    wp_enqueue_script('lcs-common-script', LCS_PLUGIN_URL . 'assets/js/common.js', array('jquery', 'chart-js'), LCS_VERSION, true);
    
    // Localize script
    wp_localize_script('lcs-common-script', 'lcsAjax', array(
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('lcs_nonce')
    ));
}
add_action('wp_enqueue_scripts', 'lcs_enqueue_common_assets');