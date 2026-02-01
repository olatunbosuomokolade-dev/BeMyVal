/**
 * Page 2: Luna Cat Pet Experience
 * Handles cat state management, interactions, and final reveal
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const soundToggle = document.getElementById('soundToggle');
    const catImage = document.getElementById('catImage');
    const catContainer = document.getElementById('catContainer');
    const speechText = document.getElementById('speechText');
    const speechBubble = document.getElementById('speechBubble');
    const actionButtons = document.getElementById('actionButtons');
    const feedBtn = document.getElementById('feedBtn');
    const petBtn = document.getElementById('petBtn');
    const playBtn = document.getElementById('playBtn');
    const finalCard = document.getElementById('finalCard');
    const feedbackHearts = document.getElementById('feedbackHearts');

    // ============================================
    // Configuration
    // ============================================
    const CONFIG = {
        MAX_HAPPINESS: 6,
        INTERACTION_COOLDOWN: 500, // Prevent spam clicking
        REVEAL_DELAY: 1500,        // Delay before final card appears
        HEART_LIFETIME: 1500       // How long feedback hearts last
    };

    // Cat state definitions
    const CAT_STATES = {
        shy: {
            minHappiness: 0,
            maxHappiness: 1,
            image: 'assets/images/Luna-shy.png.png',
            speeches: [
                "H-hi... I'm a little nervous...",
                "You seem nice...",
                "I'm Luna..."
            ]
        },
        comfortable: {
            minHappiness: 2,
            maxHappiness: 3,
            image: 'assets/images/Luna-comfortable-png.png',
            speeches: [
                "You're nice... I like you.",
                "This is cozy...",
                "I feel safe with you."
            ]
        },
        happy: {
            minHappiness: 4,
            maxHappiness: 5,
            image: 'assets/images/Luna-happy.png.png',
            speeches: [
                "I'm so happy you're here!",
                "You make me smile!",
                "I love spending time with you!"
            ]
        },
        final: {
            minHappiness: 6,
            maxHappiness: Infinity,
            image: 'assets/images/Luna-final.png.png',
            speeches: [
                "He has something to tell you..."
            ]
        }
    };

    // ============================================
    // State Management
    // ============================================
    const state = {
        happiness: 0,
        soundEnabled: false,
        currentState: 'shy',
        lastInteraction: 0,
        isRevealed: false
    };

    // ============================================
    // Sound System
    // ============================================
    const sounds = {
        purr: null,
        chime: null,
        reveal: null
    };

    /**
     * Initialize audio elements
     * Note: Audio files need to be provided by the user
     */
    function initSounds() {
        // Create audio elements - will fail gracefully if files don't exist
        sounds.purr = new Audio('assets/sounds/purr.mp3.mp3');
        sounds.chime = new Audio('assets/sounds/chime.mp3.mp3');
        sounds.reveal = new Audio('assets/sounds/reveal.mp3.mp3');

        // Configure each sound to not auto-play and set volume
        Object.values(sounds).forEach(sound => {
            if (sound) {
                sound.volume = 0.5;
                sound.preload = 'none';  // Don't preload
                sound.autoplay = false;  // Never auto-play
                sound.pause();           // Ensure paused
            }
        });
    }

    /**
     * Play a sound if sound is enabled
     * @param {string} soundName - Name of sound to play
     */
    function playSound(soundName) {
        if (!state.soundEnabled || !sounds[soundName]) return;
        
        try {
            sounds[soundName].currentTime = 0;
            sounds[soundName].play().catch(() => {
                // Silently fail if audio can't play
            });
        } catch (e) {
            // Silently fail
        }
    }

    /**
     * Toggle sound on/off
     */
    function toggleSound() {
        state.soundEnabled = !state.soundEnabled;
        soundToggle.classList.toggle('enabled', state.soundEnabled);
    }

    // ============================================
    // State Helpers
    // ============================================

    /**
     * Get the current cat state based on happiness level
     * @returns {string} - State name (shy, comfortable, happy, final)
     */
    function getCurrentStateName() {
        for (const [stateName, stateData] of Object.entries(CAT_STATES)) {
            if (state.happiness >= stateData.minHappiness && 
                state.happiness <= stateData.maxHappiness) {
                return stateName;
            }
        }
        return 'shy';
    }

    /**
     * Get a random speech for the current state
     * @param {string} stateName - Current state name
     * @returns {string} - Random speech text
     */
    function getRandomSpeech(stateName) {
        const speeches = CAT_STATES[stateName].speeches;
        return speeches[Math.floor(Math.random() * speeches.length)];
    }

    // ============================================
    // UI Updates
    // ============================================

    /**
     * Update the cat image with a fade transition
     * @param {string} newImage - Path to new image
     */
    function updateCatImage(newImage) {
        catImage.style.opacity = '0';
        
        setTimeout(() => {
            catImage.src = newImage;
            catImage.style.opacity = '1';
        }, 200);
    }

    /**
     * Update the speech bubble text
     * @param {string} text - New speech text
     */
    function updateSpeechText(text) {
        speechText.style.opacity = '0';
        
        setTimeout(() => {
            speechText.textContent = text;
            speechText.style.opacity = '1';
        }, 150);
    }

    /**
     * Check and update state after happiness change
     */
    function updateState() {
        const newStateName = getCurrentStateName();
        
        // If state has changed, update visuals
        if (newStateName !== state.currentState) {
            state.currentState = newStateName;
            
            const newStateData = CAT_STATES[newStateName];
            updateCatImage(newStateData.image);
            updateSpeechText(getRandomSpeech(newStateName));
            
            // Check for final state
            if (newStateName === 'final') {
                triggerFinalReveal();
            }
        }
    }

    // ============================================
    // Visual Feedback
    // ============================================

    /**
     * Spawn a floating heart at a position
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    function spawnFloatingHeart(x, y) {
        const heart = document.createElement('span');
        heart.className = 'feedback-heart';
        heart.innerHTML = '&#10084;';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.color = '#F06292';
        
        feedbackHearts.appendChild(heart);
        
        // Remove after animation completes
        setTimeout(() => {
            heart.remove();
        }, CONFIG.HEART_LIFETIME);
    }

    /**
     * Spawn multiple hearts around the cat
     */
    function spawnHeartsAroundCat() {
        const catRect = catContainer.getBoundingClientRect();
        const centerX = catRect.left + catRect.width / 2;
        const centerY = catRect.top + catRect.height / 2;
        
        // Spawn 2-3 hearts at random positions around the cat
        const numHearts = 2 + Math.floor(Math.random() * 2);
        
        for (let i = 0; i < numHearts; i++) {
            const offsetX = (Math.random() - 0.5) * 100;
            const offsetY = (Math.random() - 0.5) * 60;
            
            setTimeout(() => {
                spawnFloatingHeart(centerX + offsetX, centerY + offsetY);
            }, i * 100);
        }
    }

    /**
     * Make the cat wiggle (for petting)
     */
    function wiggleCat() {
        catImage.classList.add('wiggle');
        
        setTimeout(() => {
            catImage.classList.remove('wiggle');
        }, 500);
    }

    // ============================================
    // Interactions
    // ============================================

    /**
     * Check if interaction is allowed (cooldown)
     * @returns {boolean}
     */
    function canInteract() {
        const now = Date.now();
        if (now - state.lastInteraction < CONFIG.INTERACTION_COOLDOWN) {
            return false;
        }
        if (state.isRevealed) {
            return false;
        }
        state.lastInteraction = now;
        return true;
    }

    /**
     * Handle feeding interaction
     */
    function handleFeed() {
        if (!canInteract()) return;
        
        state.happiness = Math.min(state.happiness + 1, CONFIG.MAX_HAPPINESS);
        playSound('chime');
        spawnHeartsAroundCat();
        updateState();
        
        // Update speech with food-related message if not changing state
        if (state.currentState !== 'final') {
            const foodSpeeches = ["Yummy!", "That was delicious!", "Thank you!"];
            updateSpeechText(foodSpeeches[Math.floor(Math.random() * foodSpeeches.length)]);
        }
    }

    /**
     * Handle petting interaction
     */
    function handlePet() {
        if (!canInteract()) return;
        
        state.happiness = Math.min(state.happiness + 1, CONFIG.MAX_HAPPINESS);
        playSound('purr');
        wiggleCat();
        spawnHeartsAroundCat();
        updateState();
        
        // Update speech with pet-related message if not changing state
        if (state.currentState !== 'final') {
            const petSpeeches = ["Purrr...", "That feels nice...", "*happy purring*"];
            updateSpeechText(petSpeeches[Math.floor(Math.random() * petSpeeches.length)]);
        }
    }

    /**
     * Handle play interaction
     */
    function handlePlay() {
        if (!canInteract()) return;
        
        state.happiness = Math.min(state.happiness + 1, CONFIG.MAX_HAPPINESS);
        playSound('purr');
        spawnHeartsAroundCat();
        updateState();
        
        // Update speech with play-related message if not changing state
        if (state.currentState !== 'final') {
            const playSpeeches = ["This is fun!", "Let's play more!", "Wheee!"];
            updateSpeechText(playSpeeches[Math.floor(Math.random() * playSpeeches.length)]);
        }
    }

    // ============================================
    // Final Reveal
    // ============================================

    /**
     * Spawn celebration hearts across the screen
     */
    function spawnCelebrationHearts() {
        const numHearts = 15;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        for (let i = 0; i < numHearts; i++) {
            setTimeout(() => {
                const heart = document.createElement('span');
                heart.className = 'feedback-heart celebration-heart';
                heart.innerHTML = ['💕', '💗', '💖', '❤️', '🩷'][Math.floor(Math.random() * 5)];
                heart.style.left = (Math.random() * screenWidth) + 'px';
                heart.style.top = (screenHeight * 0.5 + Math.random() * screenHeight * 0.4) + 'px';
                heart.style.fontSize = (20 + Math.random() * 16) + 'px';
                heart.style.animationDuration = (1.5 + Math.random() * 1) + 's';
                
                feedbackHearts.appendChild(heart);
                
                // Remove after animation
                setTimeout(() => {
                    heart.remove();
                }, 2500);
            }, i * 150); // Stagger the hearts
        }
    }

    /**
     * Trigger the final reveal sequence
     */
    function triggerFinalReveal() {
        state.isRevealed = true;
        
        // Step 1: Fade out action buttons
        actionButtons.classList.add('hidden');
        
        // Step 2: After delay, show final card with celebration
        setTimeout(() => {
            playSound('reveal');
            finalCard.classList.add('visible');
            
            // Step 3: Spawn celebration hearts
            spawnCelebrationHearts();
            
            // Keep spawning hearts periodically
            const heartInterval = setInterval(() => {
                spawnCelebrationHearts();
            }, 3000);
            
            // Stop after a while
            setTimeout(() => {
                clearInterval(heartInterval);
            }, 12000);
        }, CONFIG.REVEAL_DELAY);
    }

    // ============================================
    // Event Listeners
    // ============================================

    function setupEventListeners() {
        // Sound toggle
        soundToggle.addEventListener('click', toggleSound);
        
        // Use a helper to prevent double-firing on mobile
        function addButtonListener(btn, handler) {
            let lastTap = 0;
            
            btn.addEventListener('click', function(e) {
                const now = Date.now();
                // Ignore if recently triggered by touch
                if (now - lastTap < 300) return;
                handler();
            });
            
            btn.addEventListener('touchend', function(e) {
                e.preventDefault();
                lastTap = Date.now();
                handler();
            });
        }
        
        // Action buttons with double-fire protection
        addButtonListener(feedBtn, handleFeed);
        addButtonListener(petBtn, handlePet);
        addButtonListener(playBtn, handlePlay);
    }

    // ============================================
    // Initialization
    // ============================================

    function init() {
        initSounds();
        setupEventListeners();
        
        // Set initial speech
        updateSpeechText(getRandomSpeech('shy'));
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
