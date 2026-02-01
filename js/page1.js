/**
 * Page 1: Valentine Question
 * Handles the evasive NO button behavior
 */

(function() {
    'use strict';

    // DOM Elements
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const buttonsContainer = document.querySelector('.buttons-container');

    // Configuration
    const CONFIG = {
        EDGE_PADDING: 20,           // Minimum distance from screen edges
        COOLDOWN_MS: 300,           // Minimum time between movements
        TRANSITION_DURATION: 300,   // Movement animation duration in ms
        MAX_DODGES: 5               // Number of dodges before button gives up
    };

    // Messages the NO button shows as it gets more desperate
    const DODGE_MESSAGES = [
        { text: "No 😐", dodges: 0 },      // Initial
        { text: "Nope 😅", dodges: 1 },    // First dodge
        { text: "Stop! 😰", dodges: 2 },   // Getting nervous
        { text: "Please? 🥺", dodges: 3 }, // Begging
        { text: "Fine... 😔", dodges: 4 }, // Giving up
        { text: "💨", dodges: 5 }          // Disappearing
    ];

    // State
    let lastMoveTime = 0;
    let isInitialized = false;
    let dodgeCount = 0;

    /**
     * Initialize the NO button's fixed position
     * Called once on first interaction to enable evasive movement
     */
    function initializeNoButtonPosition() {
        if (isInitialized) return;
        
        // Get the current position relative to viewport
        const rect = noBtn.getBoundingClientRect();
        
        // Add evasive class to switch to fixed positioning
        noBtn.classList.add('evasive');
        
        // Set fixed positioning based on current location
        noBtn.style.left = rect.left + 'px';
        noBtn.style.top = rect.top + 'px';
        
        // Now it's fixed positioned relative to viewport
        isInitialized = true;
    }

    /**
     * Calculate safe bounds for button movement
     * @returns {Object} - { minX, maxX, minY, maxY }
     */
    function getSafeBounds() {
        const buttonRect = noBtn.getBoundingClientRect();
        const buttonWidth = buttonRect.width;
        const buttonHeight = buttonRect.height;
        
        return {
            minX: CONFIG.EDGE_PADDING,
            maxX: window.innerWidth - buttonWidth - CONFIG.EDGE_PADDING,
            minY: CONFIG.EDGE_PADDING,
            maxY: window.innerHeight - buttonHeight - CONFIG.EDGE_PADDING
        };
    }

    /**
     * Generate a random position within safe bounds
     * Ensures the new position is different enough from current
     * @returns {Object} - { x, y }
     */
    function getRandomPosition() {
        const bounds = getSafeBounds();
        const currentRect = noBtn.getBoundingClientRect();
        
        let newX, newY;
        let attempts = 0;
        const maxAttempts = 10;
        const minDistance = 100; // Minimum distance to move
        
        do {
            newX = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
            newY = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);
            attempts++;
            
            // Calculate distance from current position
            const distance = Math.sqrt(
                Math.pow(newX - currentRect.left, 2) + 
                Math.pow(newY - currentRect.top, 2)
            );
            
            // Accept if distance is sufficient or we've tried too many times
            if (distance >= minDistance || attempts >= maxAttempts) {
                break;
            }
        } while (true);
        
        return { x: newX, y: newY };
    }

    /**
     * Update the NO button text based on dodge count
     */
    function updateButtonText() {
        // Find the appropriate message for current dodge count
        let message = DODGE_MESSAGES[0];
        for (let i = DODGE_MESSAGES.length - 1; i >= 0; i--) {
            if (dodgeCount >= DODGE_MESSAGES[i].dodges) {
                message = DODGE_MESSAGES[i];
                break;
            }
        }
        
        // Update button content
        noBtn.innerHTML = message.text;
    }

    /**
     * Make the button disappear with animation
     */
    function disappearButton() {
        noBtn.style.transform = 'scale(0) rotate(180deg)';
        noBtn.style.opacity = '0';
        
        // Remove button after animation
        setTimeout(() => {
            noBtn.style.display = 'none';
        }, 400);
    }

    /**
     * Move the NO button to a new random position
     * Includes cooldown to prevent spamming
     */
    function moveNoButton() {
        const now = Date.now();
        
        // Check cooldown
        if (now - lastMoveTime < CONFIG.COOLDOWN_MS) {
            return;
        }
        
        lastMoveTime = now;
        dodgeCount++;
        
        // Update button text based on dodge count
        updateButtonText();
        
        // Check if button should disappear
        if (dodgeCount >= CONFIG.MAX_DODGES) {
            disappearButton();
            return;
        }
        
        // Initialize position if first time
        initializeNoButtonPosition();
        
        // Get new position and apply
        const newPos = getRandomPosition();
        noBtn.style.left = newPos.x + 'px';
        noBtn.style.top = newPos.y + 'px';
        
        // Add visual feedback class
        noBtn.classList.add('moving');
        setTimeout(() => {
            noBtn.classList.remove('moving');
        }, CONFIG.TRANSITION_DURATION);
    }

    /**
     * Handle YES button click - redirect to Luna page
     */
    function handleYesClick() {
        // Add a small delay for the click animation
        yesBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            window.location.href = 'luna.html';
        }, 150);
    }

    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        // YES button - navigate to page 2
        yesBtn.addEventListener('click', handleYesClick);
        yesBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            handleYesClick();
        });

        // NO button - evasive behavior
        // Mouse events for desktop testing
        noBtn.addEventListener('mouseenter', moveNoButton);
        
        // Touch events for mobile
        noBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            moveNoButton();
        }, { passive: false });

        // Handle window resize - recalculate bounds if button is out of view
        window.addEventListener('resize', function() {
            if (!isInitialized) return;
            
            const bounds = getSafeBounds();
            const rect = noBtn.getBoundingClientRect();
            
            // If button is outside bounds, move it back
            let needsMove = false;
            let newX = rect.left;
            let newY = rect.top;
            
            if (rect.left < bounds.minX) {
                newX = bounds.minX;
                needsMove = true;
            } else if (rect.left > bounds.maxX) {
                newX = bounds.maxX;
                needsMove = true;
            }
            
            if (rect.top < bounds.minY) {
                newY = bounds.minY;
                needsMove = true;
            } else if (rect.top > bounds.maxY) {
                newY = bounds.maxY;
                needsMove = true;
            }
            
            if (needsMove) {
                noBtn.style.left = newX + 'px';
                noBtn.style.top = newY + 'px';
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupEventListeners);
    } else {
        setupEventListeners();
    }
})();
