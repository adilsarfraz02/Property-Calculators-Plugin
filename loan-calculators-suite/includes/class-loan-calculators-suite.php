<?php
/**
 * Main class for Loan Calculators Suite
 *
 * @package Loan_Calculators_Suite
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Main Loan Calculators Suite class
 */
class Loan_Calculators_Suite {
    /**
     * Active calculators
     *
     * @var array
     */
    private $active_calculators;

    /**
     * Available calculators
     *
     * @var array
     */
    private $available_calculators = array(
        'borrowing_power' => array(
            'name' => 'Borrowing Power Calculator',
            'shortcode' => 'borrowing_power_calculator',
            'description' => 'Calculate maximum borrowing capacity based on income and expenses.',
            'prefix' => 'bpc'
        ),
        'loan_repayment' => array(
            'name' => 'Loan Repayment Calculator',
            'shortcode' => 'loan_repayment_calculator',
            'description' => 'Calculate loan repayments and view loan schedule with graph visualization.',
            'prefix' => 'lrc'
        ),
        'extra_repayment' => array(
            'name' => 'Extra Repayment Calculator',
            'shortcode' => 'extra_repayment_calculator',
            'description' => 'Calculate how much time and interest you could save by making extra repayments.',
            'prefix' => 'erc'
        ),
        'home_loan_offset' => array(
            'name' => 'Home Loan Offset Calculator',
            'shortcode' => 'home_loan_offset_calculator',
            'description' => 'Calculate how much interest you could save by using your savings to offset your home loan.',
            'prefix' => 'hloc'
        ),
        'interest_only_mortgage' => array(
            'name' => 'Interest Only Mortgage Calculator',
            'shortcode' => 'interest_only_mortgage_calculator',
            'description' => 'Calculate payments for interest-only mortgages and compare with principal and interest loans.',
            'prefix' => 'iomc'
        ),
        'how_long_to_repay' => array(
            'name' => 'How Long to Repay Calculator',
            'shortcode' => 'how_long_to_repay_calculator',
            'description' => 'Calculate how long it will take to repay a loan with fixed payments.',
            'prefix' => 'hlrc'
        )
    );

    /**
     * Constructor
     */
    public function __construct() {
        $this->active_calculators = get_option('lcs_active_calculators', array());
    }

    /**
     * Initialize the plugin
     */
    public function init() {
        // Load active calculators
        $this->load_calculators();
        
        // Register shortcodes
        $this->register_shortcodes();
        
        // Add shortcode info to admin bar
        add_action('admin_bar_menu', array($this, 'add_shortcode_info_to_admin_bar'), 999);
    }

    /**
     * Load active calculators
     */
    private function load_calculators() {
        foreach ($this->available_calculators as $calculator_id => $calculator) {
            // Check if calculator is active
            if (isset($this->active_calculators[$calculator_id]) && $this->active_calculators[$calculator_id]) {
                // Include calculator class
                require_once LCS_PLUGIN_PATH . 'includes/calculators/class-' . str_replace('_', '-', $calculator_id) . '.php';
            }
        }
    }

    /**
     * Register shortcodes for active calculators
     */
    private function register_shortcodes() {
        foreach ($this->available_calculators as $calculator_id => $calculator) {
            // Check if calculator is active
            if (isset($this->active_calculators[$calculator_id]) && $this->active_calculators[$calculator_id]) {
                // Register shortcode
                add_shortcode($calculator['shortcode'], array($this, $calculator_id . '_shortcode'));
            }
        }
    }

    /**
     * Borrowing Power Calculator shortcode callback
     */
    public function borrowing_power_shortcode($atts = array()) {
        // Enqueue calculator specific assets
        wp_enqueue_style('lcs-borrowing-power-styles', LCS_PLUGIN_URL . 'assets/css/borrowing-power.css', array('lcs-common-styles'), LCS_VERSION);
        wp_enqueue_script('lcs-borrowing-power-script', LCS_PLUGIN_URL . 'assets/js/borrowing-power.js', array('jquery', 'chart-js', 'lcs-common-script'), LCS_VERSION, true);
        
        // Include template
        $template_file = LCS_PLUGIN_PATH . 'templates/borrowing-power-template.php';
        if (!file_exists($template_file)) {
            return '<p>Error: Borrowing Power Calculator template not found.</p>';
        }
        
        ob_start();
        include $template_file;
        return ob_get_clean();
    }

    /**
     * Loan Repayment Calculator shortcode callback
     */
    public function loan_repayment_shortcode($atts = array()) {
        // Enqueue calculator specific assets
        wp_enqueue_style('lcs-loan-repayment-styles', LCS_PLUGIN_URL . 'assets/css/loan-repayment.css', array('lcs-common-styles'), LCS_VERSION);
        wp_enqueue_script('lcs-loan-repayment-script', LCS_PLUGIN_URL . 'assets/js/loan-repayment.js', array('jquery', 'chart-js', 'lcs-common-script'), LCS_VERSION, true);
        
        // Include template
        $template_file = LCS_PLUGIN_PATH . 'templates/loan-repayment-template.php';
        if (!file_exists($template_file)) {
            return '<p>Error: Loan Repayment Calculator template not found.</p>';
        }
        
        ob_start();
        include $template_file;
        return ob_get_clean();
    }

    /**
     * Extra Repayment Calculator shortcode callback
     */
    public function extra_repayment_shortcode($atts = array()) {
        // Enqueue calculator specific assets
        wp_enqueue_style('lcs-extra-repayment-styles', LCS_PLUGIN_URL . 'assets/css/extra-repayment.css', array('lcs-common-styles'), LCS_VERSION);
        wp_enqueue_script('lcs-extra-repayment-script', LCS_PLUGIN_URL . 'assets/js/extra-repayment.js', array('jquery', 'chart-js', 'lcs-common-script'), LCS_VERSION, true);
        
        // Include template
        $template_file = LCS_PLUGIN_PATH . 'templates/extra-repayment-template.php';
        if (!file_exists($template_file)) {
            return '<p>Error: Extra Repayment Calculator template not found.</p>';
        }
        
        ob_start();
        include $template_file;
        return ob_get_clean();
    }

    /**
     * Home Loan Offset Calculator shortcode callback
     */
    public function home_loan_offset_shortcode($atts = array()) {
        // Enqueue calculator specific assets
        wp_enqueue_style('lcs-home-loan-offset-styles', LCS_PLUGIN_URL . 'assets/css/home-loan-offset.css', array('lcs-common-styles'), LCS_VERSION);
        wp_enqueue_script('lcs-home-loan-offset-script', LCS_PLUGIN_URL . 'assets/js/home-loan-offset.js', array('jquery', 'chart-js', 'lcs-common-script'), LCS_VERSION, true);
        
        // Include template
        $template_file = LCS_PLUGIN_PATH . 'templates/home-loan-offset-template.php';
        if (!file_exists($template_file)) {
            return '<p>Error: Home Loan Offset Calculator template not found.</p>';
        }
        
        ob_start();
        include $template_file;
        return ob_get_clean();
    }

    /**
     * Interest Only Mortgage Calculator shortcode callback
     */
    public function interest_only_mortgage_shortcode($atts = array()) {
        // Enqueue calculator specific assets
        wp_enqueue_style('lcs-interest-only-mortgage-styles', LCS_PLUGIN_URL . 'assets/css/interest-only-mortgage.css', array('lcs-common-styles'), LCS_VERSION);
        wp_enqueue_script('lcs-interest-only-mortgage-script', LCS_PLUGIN_URL . 'assets/js/interest-only-mortgage.js', array('jquery', 'chart-js', 'lcs-common-script'), LCS_VERSION, true);
        
        // Include template
        $template_file = LCS_PLUGIN_PATH . 'templates/interest-only-mortgage-template.php';
        if (!file_exists($template_file)) {
            return '<p>Error: Interest Only Mortgage Calculator template not found.</p>';
        }
        
        ob_start();
        include $template_file;
        return ob_get_clean();
    }

    /**
     * How Long to Repay Calculator shortcode callback
     */
    public function how_long_to_repay_shortcode($atts = array()) {
        // Enqueue calculator specific assets
        wp_enqueue_style('lcs-how-long-to-repay-styles', LCS_PLUGIN_URL . 'assets/css/how-long-to-repay.css', array('lcs-common-styles'), LCS_VERSION);
        wp_enqueue_script('lcs-how-long-to-repay-script', LCS_PLUGIN_URL . 'assets/js/how-long-to-repay.js', array('jquery', 'chart-js', 'lcs-common-script'), LCS_VERSION, true);
        
        // Include template
        $template_file = LCS_PLUGIN_PATH . 'templates/how-long-to-repay-template.php';
        if (!file_exists($template_file)) {
            return '<p>Error: How Long to Repay Calculator template not found.</p>';
        }
        
        ob_start();
        include $template_file;
        return ob_get_clean();
    }

    /**
     * Add shortcode info to admin bar
     */
    public function add_shortcode_info_to_admin_bar($admin_bar) {
        if (!is_admin() && is_user_logged_in() && current_user_can('edit_posts')) {
            $admin_bar->add_menu(array(
                'id'    => 'lcs-shortcodes',
                'title' => 'Loan Calculators',
                'href'  => admin_url('admin.php?page=loan-calculators-suite'),
                'meta'  => array(
                    'title' => 'Loan Calculators Shortcodes',
                ),
            ));
            
            foreach ($this->available_calculators as $calculator_id => $calculator) {
                // Check if calculator is active
                if (isset($this->active_calculators[$calculator_id]) && $this->active_calculators[$calculator_id]) {
                    $admin_bar->add_menu(array(
                        'id'     => 'lcs-' . $calculator_id,
                        'parent' => 'lcs-shortcodes',
                        'title'  => $calculator['name'],
                        'href'   => '#',
                        'meta'   => array(
                            'title' => 'Shortcode: [' . $calculator['shortcode'] . ']',
                            'class' => 'lcs-shortcode-info',
                            'html'  => '<div class="lcs-shortcode-popup">[' . $calculator['shortcode'] . ']</div>',
                        ),
                    ));
                }
            }
        }
    }
}