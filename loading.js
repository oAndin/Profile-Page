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
        
        // Trigger CRT Power On animation
        const crtContainer = this.loadingScreen.querySelector('.crt-container');
        crtContainer.classList.add('crt-power-on');
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
        // Calculate how many segments should be filled based on percentage
        const segmentsToFill = Math.floor((percent / 100) * this.segments);
        
        // Get all segment elements
        const segmentElements = this.progressFill.querySelectorAll('.progress-segment');
        
        // Fill segments one by one
        segmentElements.forEach((segment, index) => {
            if (index < segmentsToFill) {
                segment.style.opacity = '1';
                segment.style.visibility = 'visible';
            } else {
                segment.style.opacity = '0';
                segment.style.visibility = 'hidden';
            }
        });
        
        // Update percentage text
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
// GLOBAL STATE - Track if loading has been shown
// ==============================
const LOADING_KEY = '__LOADING_SCREEN_SHOWN__';

// Check if loading screen has already been shown in this session
const hasShownLoading = sessionStorage.getItem(LOADING_KEY);

// Initialize loading screen ONLY on first page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoadingScreen, { once: true });
} else {
    initLoadingScreen();
}

function initLoadingScreen() {
    // Only show loading if it hasn't been shown yet in this session
    if (!hasShownLoading) {
        console.log('🎮 First page load - showing loading screen');
        
        const initialLoader = new LoadingScreen({
            onComplete: () => {
                // Mark loading as shown for this session
                sessionStorage.setItem(LOADING_KEY, 'true');
                console.log('✅ Loading complete - will not show again until page reload');
            }
        });
        
        initialLoader.start();
    } else {
        console.log('⏭️ Loading screen already shown this session - skipping');
    }
}

console.log('🎮 CRT Loading Screen System Initialized!');
