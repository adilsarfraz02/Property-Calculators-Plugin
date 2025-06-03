<?php
/**
 * Interest Only Mortgage Calculator Template
 *
 * @package Loan_Calculators_Suite
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<div class="lcs-calculator interest-only-mortgage-calculator">
	<h2 class="lcs-calculator-title">Interest Only Mortgage Calculator</h2>
	
	<div class="lcs-calculator-container">
		<!-- Input Section -->
		<div class="lcs-input-section">
			<h3>Enter your details</h3>
			
			<div class="lcs-input-group">
				<label for="loan-amount">Loan Amount</label>
				<div class="lcs-input-wrapper">
					<span class="lcs-currency-symbol">$</span>
					<input type="text" id="loan-amount" value="400000" />
				</div>
			</div>
			
			<div class="lcs-input-group">
				<label for="interest-rate">Interest Rate</label>
				<div class="lcs-input-wrapper">
					<input type="text" id="interest-rate" value="5.50" />
					<span class="lcs-percentage-symbol">%</span>
				</div>
			</div>
			
			<div class="lcs-input-group">
				<label for="loan-term">Loan Term</label>
				<div class="lcs-input-wrapper">
					<input type="text" id="loan-term" value="30" />
					<span class="lcs-unit-label">years</span>
				</div>
			</div>
			
			<div class="lcs-input-group">
				<label for="repayment-frequency">Repayment Frequency</label>
				<div class="lcs-input-wrapper">
					<select id="repayment-frequency" class="full-width">
						<option value="weekly">Weekly</option>
						<option value="fortnightly">Fortnightly</option>
						<option value="monthly" selected>Monthly</option>
					</select>
				</div>
			</div>
			
			<div class="lcs-input-group interest-only-period-field">
				<label for="interest-only-period">Interest Only Period</label>
				<div class="lcs-input-wrapper">
					<input type="text" id="interest-only-period" value="5" />
					<span class="lcs-unit-label">years</span>
				</div>
			</div>
		</div>
		
		<!-- Chart Section -->
		<div class="lcs-chart-section">
			<h3>Loan Balance Chart</h3>
			<div class="lcs-chart-wrapper">
				<canvas id="loan-balance-chart"></canvas>
			</div>
			<div class="lcs-chart-legend">
				<div class="lcs-legend-item">
					<span class="lcs-legend-color" style="background-color: rgba(0, 115, 170, 1);"></span>
					<span class="lcs-legend-label">Interest Only</span>
				</div>
				<div class="lcs-legend-item">
					<span class="lcs-legend-color" style="background-color: rgba(51, 51, 51, 0.8);"></span>
					<span class="lcs-legend-label">Principal & Interest</span>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Results Section -->
	<div class="lcs-results-section">
		<h3>View your results</h3>
		
		<div class="lcs-result-details">
			<div class="lcs-result-item">
				<span class="lcs-result-label">Interest Only Payment</span>
				<span id="interest-only-payment-result" class="lcs-result-value">$1,833.33</span>
			</div>
			
			<div class="lcs-result-item">
				<span class="lcs-result-label">Principal & Interest Payment</span>
				<span id="principal-interest-payment-result" class="lcs-result-value">$2,271.16</span>
			</div>
			
			<div class="lcs-result-item">
				<span class="lcs-result-label">Total Interest Payable</span>
				<span id="total-interest-result" class="lcs-result-value">$437,616.00</span>
			</div>
			
			<div class="lcs-result-item">
				<span class="lcs-result-label">Total Payments</span>
				<span id="total-payments-result" class="lcs-result-value">$837,616.00</span>
			</div>
		</div>
		
		<!-- Action Buttons -->
		<div class="lcs-btn-group">
			<button id="reset-calculator" class="lcs-btn lcs-btn-secondary">
				<span class="dashicons dashicons-image-rotate"></span> Reset
			</button>
			<button id="print-results" class="lcs-btn lcs-btn-secondary">
				<span class="dashicons dashicons-printer"></span> Print
			</button>
			<button id="show-assumptions" class="lcs-btn lcs-btn-secondary">
				<span class="dashicons dashicons-info"></span> Assumptions
			</button>
		</div>
		
		<!-- Disclaimer -->
		<div class="lcs-disclaimer">
			<p class="lcs-note">Note: The information provided by this calculator is intended to provide illustrative examples based on stated assumptions and your inputs. Calculations are meant as estimates only and it is advised that you consult with a financial professional before making financial decisions. Calculations are based on information provided by you and do not account for all relevant factors. Results are estimates only.</p>
		</div>
	</div>
	
	<!-- Assumptions Modal -->
	<div id="assumptions-modal" class="lcs-modal">
		<div class="lcs-modal-content">
			<div class="lcs-modal-header">
				<h3>Assumptions</h3>
				<span class="lcs-modal-close">&times;</span>
			</div>
			<div class="lcs-modal-body">
				<div class="lcs-modal-section">
					<h4>Description</h4>
					<p>This calculator helps you compare interest-only mortgage payments with principal and interest payments, and shows the impact on your loan balance over time.</p>
				</div>
				
				<div class="lcs-modal-section">
					<h4>Assumptions</h4>
					<ul>
						<li>It does not take into account any possible fees i.e. up-front fees or ongoing fees.</li>
						<li>Interest rates do not change over the loan term.</li>
						<li>Repayment frequency selected (i.e. weekly, fortnightly, monthly) is applied consistently throughout the loan term.</li>
						<li>It is assumed that a year consists 26 fortnights or 52 weeks which is equivalent to 12 months in a year.</li>
						<li>No rounding of the actual payment amount is done to keep the "term" strict in practice.</li>
						<li>After the interest-only period ends, the loan reverts to principal and interest payments for the remainder of the loan term.</li>
						<li>Principal and interest payments are calculated based on the remaining loan term after the interest-only period.</li>
					</ul>
				</div>
			</div>
			<div class="lcs-modal-footer">
				<button class="lcs-btn lcs-btn-primary lcs-modal-close">Close</button>
			</div>
		</div>
	</div>
</div>

<script>
// Initialize modal functionality
jQuery(document).ready(function($) {
    // Get the modal
    var modal = document.getElementById("assumptions-modal");
    
    // Get the button that opens the modal
    var btn = document.getElementById("show-assumptions");
    
    // Get all elements that can close the modal
    var closeElements = document.getElementsByClassName("lcs-modal-close");
    
    // When the user clicks the button, open the modal
    btn.onclick = function() {
        modal.style.display = "block";
    }
    
    // When the user clicks on any close element, close the modal
    for (var i = 0; i < closeElements.length; i++) {
        closeElements[i].onclick = function() {
            modal.style.display = "none";
        }
    }
    
    // When the user clicks anywhere outside of the modal content, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});
</script>