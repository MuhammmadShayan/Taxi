(function ($) {
    "use strict"
    $(document).ready(function () {

        /*==== Copy text =====*/
        const copyInput = document.querySelector('.copy-input');
        const copyText = document.querySelector('.copy-text');
        const successMessage = document.querySelector('.text-success-message');

        // Add null checks to prevent errors when elements don't exist
        if (copyText && copyInput && successMessage) {
            copyText.onclick = function () {
                try {
                    // Select the text
                    copyInput.select();
                    // Copy it
                    document.execCommand('copy');
                    // Remove focus from the input
                    copyInput.blur();
                    // Show message
                    successMessage.classList.add('active');
                    // Hide message after 2 seconds
                    setTimeout(function () {
                        successMessage.classList.remove('active');
                    }, 2000);
                } catch (error) {
                    console.warn('Copy text functionality error:', error);
                }
            };
        } else {
            console.log('Copy text elements not found - skipping initialization');
        }

    });

})(jQuery);