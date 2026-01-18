// ==============================
// CRT LOADING SCREEN CONTROLLER
// ==============================

class LoadingScreen {
    constructor(options = {}) {
        this.minLoadTime = options.minLoadTime || 2000; // Minimum 2 seconds
        this.maxLoadTime = options.maxLoadTime || 3000; // Maximum 3 seconds
        this.segments = 10; // Number of progress bar segments
        this.currentProgress = 0;
        this.targetProgress = 0;
        this.onComplete = options.onComplete || null;
        
        this.createLoadingScreen();
    }
    
    createLoadingScreen() {
        // Remove existing loading screen if present
        const existing = document.getElementById('loading-screen');
        if (existing) existing.remove();
        
        const loadingHTML = `
            <div id="loading-screen">
                <div class="crt-container">
                    <div class="scanlines"></div>
                    <div class="loading-content">
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-fill" id="progress-fill">
                                    ${this.createSegments()}
                                </div>
                            </div>
                        </div>
                        <div class="loading-text" data-text="DOWNLOADING...">DOWNLOADING...</div>
                        <div class="loading-subtext">PLEASE WAIT</div>
                        <div class="progress-percentage" id="progress-percentage">0%</div>
                    </div>
                </div>
            </div>
        `;
        
        // Insert at the beginning of body
        document.body.insertAdjacentHTML('afterbegin', loadingHTML);
        
        this.loadingScreen = document.getElementById('loading-screen');
        this.progressFill = document.getElementById('progress-fill');
        this.progressPercentage = document.getElementById('progress-percentage');
    }
    
    createSegments() {
        let segmentsHTML = '';
        for (let i = 0; i < this.segments; i++) {
            segmentsHTML += '<div class="progress-segment"></div>';
        }
        return segmentsHTML;
    }
    
    start() {
        // Set global flag to indicate loading is active
        window.__LOADING_SCREEN_ACTIVE__ = true;
        
        const loadDuration = Math.random() * (this.maxLoadTime - this.minLoadTime) + this.minLoadTime;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / loadDuration) * 100, 100);
            
            // Update progress with slight randomness for realistic feel
            this.targetProgress = progress;
            this.currentProgress += (this.targetProgress - this.currentProgress) * 0.1;
            
            // Update UI
            this.updateProgress(Math.floor(this.currentProgress));
            
            if (this.currentProgress < 99.9) {
                requestAnimationFrame(animate);
            } else {
                // Loading complete
                setTimeout(() => this.complete(), 500);
            }
        };
        
        animate();
    }
    
    updateProgress(percent) {
        this.progressFill.style.width = `${percent}%`;
        this.progressPercentage.textContent = `${percent}%`;
        
        // Add glitch effect occasionally
        if (Math.random() < 0.02) {
            this.glitch();
        }
    }
    
    glitch() {
        const texts = [
            'DOWNLOADING...',
            'D0WNL0ADING...',
            'D0ẄNL̸0ADING...',
            'ĐØŴŇŁØΔĐƗŇǤ...',
            'DOWNLOADING...'
        ];
        
        const textElement = document.querySelector('.loading-text');
        if (!textElement) return;
        
        const randomText = texts[Math.floor(Math.random() * texts.length)];
        
        textElement.textContent = randomText;
        textElement.setAttribute('data-text', randomText);
        
        // Reset after 100ms
        setTimeout(() => {
            textElement.textContent = 'DOWNLOADING...';
            textElement.setAttribute('data-text', 'DOWNLOADING...');
        }, 100);
    }
    
    complete() {
        console.log('✅ Loading Complete!');
        
        // Fade out loading screen
        this.loadingScreen.classList.add('hidden');
        
        // Execute callback if provided
        if (this.onComplete) {
            this.onComplete();
        }
        
        // Remove from DOM after transition
        setTimeout(() => {
            this.loadingScreen.remove();
            // Clear global flag to allow next loading screen
            window.__LOADING_SCREEN_ACTIVE__ = false;
        }, 500);
    }
}

// ==============================
// GLOBAL STATE - Prevent multiple instances
// ==============================
window.__LOADING_SCREEN_ACTIVE__ = window.__LOADING_SCREEN_ACTIVE__ || false;
window.__LOADING_INITIALIZED__ = window.__LOADING_INITIALIZED__ || false;

// Initialize loading screen on first page load
let isFirstLoad = true;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoadingScreen, { once: true });
} else {
    initLoadingScreen();
}

function initLoadingScreen() {
    // Guard: Prevent double initialization
    if (window.__LOADING_INITIALIZED__) {
        console.log('⚠️ Loading screen already initialized, skipping...');
        return;
    }
    window.__LOADING_INITIALIZED__ = true;
    
    // Show loading screen on first visit
    if (isFirstLoad) {
        const initialLoader = new LoadingScreen();
        initialLoader.start();
        isFirstLoad = false;
    }
    
    // Add loading screen to navigation links
    setupNavigationLoading();
}

function setupNavigationLoading() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav a[href^="#"], .view-more-btn');
    
    navLinks.forEach(link => {
        // Remove any existing click handler to prevent duplicates
        const existingHandler = link.__loadingClickHandler__;
        if (existingHandler) {
            link.removeEventListener('click', existingHandler);
        }
        
        // Create new handler
        const clickHandler = (e) => {
            e.preventDefault();
            
            // Guard: Prevent multiple loading screens
            if (window.__LOADING_SCREEN_ACTIVE__) {
                console.log('⚠️ Loading screen already active, skipping...');
                return;
            }
            
            const targetId = link.getAttribute('href');
            
            // Show loading screen
            const navLoader = new LoadingScreen({
                minLoadTime: 1000,
                maxLoadTime: 1500,
                onComplete: () => {
                    // Scroll to target section after loading
                    if (targetId && targetId.startsWith('#')) {
                        const targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            targetElement.scrollIntoView({ 
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    } else if (targetId) {
                        // For links to other pages
                        window.location.href = targetId;
                    }
                }
            });
            
            navLoader.start();
            console.log(`🔄 Loading navigation to: ${targetId}`);
        };
        
        // Store handler reference and attach
        link.__loadingClickHandler__ = clickHandler;
        link.addEventListener('click', clickHandler);
    });
}

console.log('🎮 CRT Loading Screen System Initialized!');
