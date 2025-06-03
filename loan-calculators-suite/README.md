# Loan Calculators Suite

A comprehensive suite of financial calculators for WordPress. This plugin combines multiple loan calculators into a single, easy-to-manage package with a modern UI, interactive graphs, and production-ready functionality.

## Features

### Included Calculators

1. **Borrowing Power Calculator**
   - Calculate maximum borrowing capacity
   - Joint income support
   - Multiple income frequencies
   - Expense tracking
   - Interactive loan balance chart

2. **Loan Repayment Calculator**
   - Calculate loan repayments
   - Payment schedule table
   - Total interest calculations
   - Multiple repayment frequencies
   - Loan balance visualization

3. **How Long to Repay Calculator**
   - Calculate loan payoff time
   - Fixed payment amount input
   - Time-based projections
   - Interest savings analysis
   - Payment schedule visualization

4. **Extra Repayment Calculator**
   - Compare scenarios with/without extra payments
   - Flexible extra payment schedules
   - Interest and time savings calculations
   - Side-by-side comparison charts

5. **Home Loan Offset Calculator**
   - Calculate offset account benefits
   - Interest savings from offset balances
   - Comparison with traditional savings
   - Tax implications consideration

6. **Interest Only Mortgage Calculator**
   - Interest-only payment calculations
   - Principal and interest comparison
   - Transition period planning
   - Total cost analysis
   - Payment structure visualization

### Common Features

- Modern, responsive design
- Interactive Chart.js graphs
- Real-time calculations
- Print functionality
- Detailed assumptions modals
- Input validation
- Error handling

## Installation

1. Upload the `loan-calculators-suite` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Go to 'Loan Calculators' in the admin menu to configure which calculators to enable
4. Use the shortcodes on any page or post to display the calculators

## Usage

### Shortcodes

Use the following shortcodes to display the calculators on your site:

```
[borrowing_power_calculator] - Borrowing Power Calculator
[loan_repayment_calculator] - Loan Repayment Calculator
[how_long_to_repay_calculator] - How Long to Repay Calculator
[extra_repayment_calculator] - Extra Repayment Calculator
[home_loan_offset_calculator] - Home Loan Offset Calculator
[interest_only_mortgage_calculator] - Interest Only Mortgage Calculator
```

### Example

```php
// Single calculator on a page
[borrowing_power_calculator]

// Multiple calculators on different pages
[loan_repayment_calculator]
[extra_repayment_calculator]

// In a theme template file
<?php echo do_shortcode('[borrowing_power_calculator]'); ?>

// With custom wrapper
<div class="financial-tools">
    <h2>Calculate Your Borrowing Power</h2>
    [borrowing_power_calculator]
</div>
```

## Customization

### CSS Customization

Each calculator uses its own CSS namespace to prevent conflicts:

- `.borrowing-power-calculator`
- `.loan-repayment-calculator`
- `.extra-repayment-calculator`
- `.home-loan-offset-calculator`
- `.interest-only-mortgage-calculator`
- `.how-long-to-repay-calculator`

You can add custom CSS to your theme to modify the appearance of the calculators.

### JavaScript Hooks

All calculators provide JavaScript events for custom integration:

```javascript
// Listen for calculation updates
jQuery(document).on('calculatorUpdated', function(event, data) {
    console.log('Calculator updated:', data);
});
```

## Requirements

- WordPress 5.0+
- PHP 7.4+
- Modern browser with JavaScript enabled

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Internet Explorer 11+ (limited support)

## License

GPL v2 or later - Compatible with WordPress licensing

## Changelog

### 1.0.0
- Initial release with 6 calculators
- Unified admin interface
- Enable/disable individual calculators
- Common CSS and JavaScript libraries
- Responsive design
- Chart.js integration