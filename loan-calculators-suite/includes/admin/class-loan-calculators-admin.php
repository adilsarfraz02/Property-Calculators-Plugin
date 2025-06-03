<?php
/**
 * Admin class for Loan Calculators Suite
 *
 * @package Loan_Calculators_Suite
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Loan Calculators Admin class
 */
class Loan_Calculators_Admin {
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
     * Active calculators
     *
     * @var array
     */
    private $active_calculators;

    /**
     * Constructor
     */
    public function __construct() {
        $this->active_calculators = get_option('lcs_active_calculators', array());
    }

    /**
     * Initialize the admin
     */
    public function init() {
        // Add admin menu
        add_action('admin_menu', array($this, 'add_admin_menu'));
        
        // Register settings
        add_action('admin_init', array($this, 'register_settings'));
        
        // Add settings link to plugins page
        add_filter('plugin_action_links_loan-calculators-suite/loan-calculators-suite.php', array($this, 'add_settings_link'));
        
        // Add admin scripts and styles
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
    }

    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_menu_page(
            'Loan Calculators Suite',
            'Loan Calculators',
            'manage_options',
            'loan-calculators-suite',
            array($this, 'render_admin_page'),
            'dashicons-calculator',
            30
        );
        
        add_submenu_page(
            'loan-calculators-suite',
            'Manage Calculators',
            'Manage Calculators',
            'manage_options',
            'loan-calculators-suite',
            array($this, 'render_admin_page')
        );
        
        add_submenu_page(
            'loan-calculators-suite',
            'Settings',
            'Settings',
            'manage_options',
            'loan-calculators-settings',
            array($this, 'render_settings_page')
        );
        
        add_submenu_page(
            'loan-calculators-suite',
            'Help',
            'Help',
            'manage_options',
            'loan-calculators-help',
            array($this, 'render_help_page')
        );
    }

    /**
     * Register settings
     */
    public function register_settings() {
        register_setting('lcs_settings', 'lcs_active_calculators');
        
        add_settings_section(
            'lcs_calculators_section',
            'Available Calculators',
            array($this, 'calculators_section_callback'),
            'loan-calculators-settings'
        );
        
        foreach ($this->available_calculators as $calculator_id => $calculator) {
            add_settings_field(
                'lcs_' . $calculator_id,
                $calculator['name'],
                array($this, 'calculator_field_callback'),
                'loan-calculators-settings',
                'lcs_calculators_section',
                array('calculator_id' => $calculator_id)
            );
        }
    }

    /**
     * Calculators section callback
     */
    public function calculators_section_callback() {
        echo '<p>Enable or disable individual calculators in the suite.</p>';
    }

    /**
     * Calculator field callback
     */
    public function calculator_field_callback($args) {
        $calculator_id = $args['calculator_id'];
        $checked = isset($this->active_calculators[$calculator_id]) && $this->active_calculators[$calculator_id] ? 'checked' : '';
        
        echo '<label>';
        echo '<input type="checkbox" name="lcs_active_calculators[' . esc_attr($calculator_id) . ']" value="1" ' . $checked . '>';
        echo ' Enable this calculator';
        echo '</label>';
        echo '<p class="description">' . esc_html($this->available_calculators[$calculator_id]['description']) . '</p>';
        echo '<p class="description">Shortcode: <code>[' . esc_html($this->available_calculators[$calculator_id]['shortcode']) . ']</code></p>';
    }

    /**
     * Add settings link to plugins page
     */
    public function add_settings_link($links) {
        $settings_link = '<a href="admin.php?page=loan-calculators-settings">Settings</a>';
        array_unshift($links, $settings_link);
        return $links;
    }

    /**
     * Enqueue admin assets
     */
    public function enqueue_admin_assets($hook) {
        // Only load on plugin admin pages
        if (strpos($hook, 'loan-calculators') === false) {
            return;
        }
        
        wp_enqueue_style('lcs-admin-styles', LCS_PLUGIN_URL . 'assets/css/admin.css', array(), LCS_VERSION);
        wp_enqueue_script('lcs-admin-script', LCS_PLUGIN_URL . 'assets/js/admin.js', array('jquery'), LCS_VERSION, true);
    }

    /**
     * Render admin page
     */
    public function render_admin_page() {
        ?>
        <div class="wrap">
            <h1>Loan Calculators Suite</h1>
            
            <div class="lcs-admin-overview">
                <div class="lcs-admin-card">
                    <h2>Available Calculators</h2>
                    <p>The following calculators are available in this suite:</p>
                    
                    <table class="wp-list-table widefat fixed striped">
                        <thead>
                            <tr>
                                <th>Calculator</th>
                                <th>Shortcode</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($this->available_calculators as $calculator_id => $calculator) : ?>
                                <tr>
                                    <td>
                                        <strong><?php echo esc_html($calculator['name']); ?></strong>
                                        <p class="description"><?php echo esc_html($calculator['description']); ?></p>
                                    </td>
                                    <td><code>[<?php echo esc_html($calculator['shortcode']); ?>]</code></td>
                                    <td>
                                        <?php if (isset($this->active_calculators[$calculator_id]) && $this->active_calculators[$calculator_id]) : ?>
                                            <span class="lcs-status lcs-status-active">Active</span>
                                        <?php else : ?>
                                            <span class="lcs-status lcs-status-inactive">Inactive</span>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                    
                    <p><a href="<?php echo admin_url('admin.php?page=loan-calculators-settings'); ?>" class="button button-primary">Manage Calculators</a></p>
                </div>
                
                <div class="lcs-admin-card">
                    <h2>Quick Start Guide</h2>
                    <ol>
                        <li>Enable the calculators you want to use in the <a href="<?php echo admin_url('admin.php?page=loan-calculators-settings'); ?>">Settings</a> page.</li>
                        <li>Add the shortcode for the calculator you want to display to any page or post.</li>
                        <li>Customize the appearance using CSS if needed.</li>
                    </ol>
                    
                    <p><a href="<?php echo admin_url('admin.php?page=loan-calculators-help'); ?>" class="button">View Help Documentation</a></p>
                </div>
            </div>
        </div>
        <?php
    }

    /**
     * Render settings page
     */
    public function render_settings_page() {
        ?>
        <div class="wrap">
            <h1>Loan Calculators Settings</h1>
            
            <form method="post" action="options.php">
                <?php
                settings_fields('lcs_settings');
                do_settings_sections('loan-calculators-settings');
                submit_button();
                ?>
            </form>
        </div>
        <?php
    }

    /**
     * Render help page
     */
    public function render_help_page() {
        ?>
        <div class="wrap">
            <h1>Loan Calculators Help</h1>
            
            <div class="lcs-admin-card">
                <h2>Using Shortcodes</h2>
                <p>To display a calculator on your site, add the corresponding shortcode to any page or post:</p>
                
                <table class="wp-list-table widefat fixed">
                    <thead>
                        <tr>
                            <th>Calculator</th>
                            <th>Shortcode</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($this->available_calculators as $calculator) : ?>
                            <tr>
                                <td><?php echo esc_html($calculator['name']); ?></td>
                                <td><code>[<?php echo esc_html($calculator['shortcode']); ?>]</code></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            
            <div class="lcs-admin-card">
                <h2>Customization</h2>
                <p>Each calculator uses its own CSS namespace to prevent conflicts:</p>
                <ul>
                    <li><code>.borrowing-power-calculator</code></li>
                    <li><code>.loan-repayment-calculator</code></li>
                    <li><code>.extra-repayment-calculator</code></li>
                    <li><code>.home-loan-offset-calculator</code></li>
                    <li><code>.interest-only-mortgage-calculator</code></li>
                    <li><code>.how-long-to-repay-calculator</code></li>
                </ul>
                <p>You can add custom CSS to your theme to modify the appearance of the calculators.</p>
            </div>
            
            <div class="lcs-admin-card">
                <h2>JavaScript Hooks</h2>
                <p>All calculators provide JavaScript events for custom integration:</p>
                <pre>
// Listen for calculation updates
jQuery(document).on('calculatorUpdated', function(event, data) {
    console.log('Calculator updated:', data);
});
                </pre>
            </div>
            
            <div class="lcs-admin-card">
                <h2>Support</h2>
                <p>For support or feature requests, please contact the plugin author.</p>
            </div>
        </div>
        <?php
    }
}