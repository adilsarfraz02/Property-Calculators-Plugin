/**
 * Admin JavaScript for Loan Calculators Suite
 */

jQuery(document).ready(function($) {
    /**
     * Initialize admin functionality
     */
    function initAdmin() {
        // Handle tabs on admin pages
        setupTabs();
        
        // Handle shortcode copy functionality
        setupShortcodeCopy();
        
        // Handle calculator activation toggles
        setupCalculatorToggles();
    }
    
    /**
     * Setup tabs on admin pages
     */
    function setupTabs() {
        // Hide all tab content initially except the first one
        $('.lcs-tab-content').not(':first').hide();
        
        // Handle tab clicks
        $('.lcs-tab').click(function(e) {
            e.preventDefault();
            
            // Remove active class from all tabs
            $('.lcs-tab').removeClass('nav-tab-active');
            
            // Add active class to clicked tab
            $(this).addClass('nav-tab-active');
            
            // Hide all tab content
            $('.lcs-tab-content').hide();
            
            // Show the tab content for the clicked tab
            const tabId = $(this).attr('href');
            $(tabId).show();
            
            // Update URL hash
            window.location.hash = tabId;
        });
        
        // Check for hash in URL and activate corresponding tab
        if (window.location.hash) {
            const tabId = window.location.hash;
            $('.lcs-tab[href="' + tabId + '"]').click();
        }
    }
    
    /**
     * Setup shortcode copy functionality
     */
    function setupShortcodeCopy() {
        // Copy shortcode to clipboard when clicked
        $('.lcs-copy-shortcode').click(function(e) {
            e.preventDefault();
            
            const shortcode = $(this).data('shortcode');
            
            // Create temporary textarea to copy from
            const $temp = $('<textarea>');
            $('body').append($temp);
            $temp.val(shortcode).select();
            
            // Copy to clipboard
            document.execCommand('copy');
            
            // Remove temporary textarea
            $temp.remove();
            
            // Show success message
            const $this = $(this);
            const originalText = $this.text();
            
            $this.text('Copied!');
            
            setTimeout(function() {
                $this.text(originalText);
            }, 2000);
        });
    }
    
    /**
     * Setup calculator activation toggles
     */
    function setupCalculatorToggles() {
        // Update status indicator when checkbox is changed
        $('input[name^="lcs_active_calculators"]').change(function() {
            const $checkbox = $(this);
            const calculatorId = $checkbox.attr('name').match(/\[(.*?)\]/)[1];
            const $statusIndicator = $('.lcs-status[data-calculator="' + calculatorId + '"]');
            
            if ($checkbox.is(':checked')) {
                $statusIndicator.removeClass('lcs-status-inactive').addClass('lcs-status-active').text('Active');
            } else {
                $statusIndicator.removeClass('lcs-status-active').addClass('lcs-status-inactive').text('Inactive');
            }
        });
    }
    
    // Initialize admin functionality
    initAdmin();
});