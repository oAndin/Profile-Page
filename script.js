// ==============================
// RETRO HUD - Dynamic Stats with PRANKS!
// ==============================

/**
 * Calculates and displays real-time FPS with random drops
 */
class FPSCounter {
    constructor(elementSelector) {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 60;
        this.fpsElement = document.querySelector(elementSelector);
        this.isFrozen = false;
        this.freezeRecoveryTime = 0;
        
        // Random FPS drop prank (10% chance every 30-60 seconds)
        this.scheduleFPSDrop();
        this.update();
    }

    scheduleFPSDrop() {
        const nextDrop = Math.random() * 30000 + 30000; // 30-60 seconds
        setTimeout(() => {
            if (Math.random() < 0.1) { // 10% chance
                this.triggerFPSDrop();
            }
            this.scheduleFPSDrop(); // Schedule next check
        }, nextDrop);
    }

    triggerFPSDrop() {
        console.log('💥 FPS DROP PRANK TRIGGERED!');
        this.isFrozen = true;
        
        // Show dramatic FPS drop
        const originalFPS = this.fps;
        this.fps = Math.floor(Math.random() * 5) + 1; // Drop to 1-5 FPS
        
        if (this.fpsElement) {
            this.fpsElement.textContent = `FPS: ${this.fps}`;
            this.fpsElement.style.color = '#ff0000';
        }

        // Freeze screen effect
        document.body.style.animation = 'freeze-glitch 0.1s infinite';
        
        // Recover after 2-4 seconds
        const freezeDuration = Math.random() * 2000 + 2000;
        this.freezeRecoveryTime = performance.now() + freezeDuration;
        
        setTimeout(() => {
            this.isFrozen = false;
            this.fps = originalFPS;
            document.body.style.animation = '';
            if (this.fpsElement) {
                this.fpsElement.style.color = '';
            }
            console.log('✅ FPS Recovered!');
        }, freezeDuration);
    }

    update = () => {
        const currentTime = performance.now();
        
        // Don't update during freeze
        if (!this.isFrozen) {
            this.frameCount++;

            // Update FPS every second
            if (currentTime >= this.lastTime + 1000) {
                // Make FPS fluctuate around 120 (119-121) for visual interest
                const baseFPS = 120;
                const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                this.fps = baseFPS + variation;
                
                this.frameCount = 0;
                this.lastTime = currentTime;

                // Update DOM
                if (this.fpsElement) {
                    this.fpsElement.textContent = `FPS: ${this.fps}`;
                }
            }
        }

        requestAnimationFrame(this.update);
    };
}

/**
 * Measures and displays connection latency with random spikes
 */
class ConnectionMonitor {
    constructor(elementSelector) {
        this.latency = 0;
        this.connectionElement = document.querySelector(elementSelector);
        this.status = 'STABLE';
        this.isSpiking = false;
        
        this.measureLatency();
        // Update latency every 3 seconds
        setInterval(() => this.measureLatency(), 3000);
        
        // Random latency spike prank (15% chance every 20-40 seconds)
        this.scheduleLatencySpike();
    }

    scheduleLatencySpike() {
        const nextSpike = Math.random() * 20000 + 20000; // 20-40 seconds
        setTimeout(() => {
            if (Math.random() < 0.15 && !this.isSpiking) { // 15% chance
                this.triggerLatencySpike();
            }
            this.scheduleLatencySpike(); // Schedule next check
        }, nextSpike);
    }

    async triggerLatencySpike() {
        console.log('📡 LATENCY SPIKE PRANK TRIGGERED!');
        this.isSpiking = true;
        
        const originalLatency = this.latency;
        const originalStatus = this.status;
        
        // Show dramatic latency spike
        this.latency = Math.floor(Math.random() * 500) + 500; // 500-1000ms
        this.status = 'UNSTABLE';
        this.updateDisplay();
        
        // Teleport effect: freeze then jump
        const mainContent = document.querySelector('.main-grid');
        if (mainContent) {
            // Freeze
            mainContent.style.transition = 'none';
            mainContent.style.opacity = '0.5';
            mainContent.style.filter = 'blur(2px)';
            
            // Wait 1 second
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Teleport (jump effect)
            mainContent.style.transition = 'all 0.1s ease';
            mainContent.style.transform = 'translateY(-20px)';
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Snap back
            mainContent.style.transform = 'translateY(0)';
            mainContent.style.opacity = '1';
            mainContent.style.filter = 'blur(0)';
            
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Clean up
            mainContent.style.transition = '';
            mainContent.style.transform = '';
        }
        
        // Recover latency
        setTimeout(() => {
            this.latency = originalLatency;
            this.status = originalStatus;
            this.isSpiking = false;
            this.updateDisplay();
            console.log('✅ Latency Recovered!');
        }, 2000);
    }

    async measureLatency() {
        if (this.isSpiking) return; // Don't measure during spike
        
        try {
            // For local files, simulate realistic latency
            if (window.location.protocol === 'file:') {
                this.latency = Math.floor(Math.random() * 30) + 15; // 15-45ms
            } else {
                // For actual network, measure a lightweight request
                const startTime = performance.now();
                await fetch(window.location.href, {
                    method: 'HEAD',
                    cache: 'no-cache'
                });
                this.latency = Math.round(performance.now() - startTime);
            }

            // Determine connection status based on latency
            if (this.latency < 50) {
                this.status = 'STABLE';
            } else if (this.latency < 150) {
                this.status = 'SLOW';
            } else {
                this.status = 'UNSTABLE';
            }

            this.updateDisplay();
        } catch (error) {
            console.error('Failed to measure latency:', error);
            this.latency = 999;
            this.status = 'UNSTABLE';
            this.updateDisplay();
        }
    }

    updateDisplay() {
        if (this.connectionElement) {
            const emoji = this.status === 'STABLE' ? '🔴' : this.status === 'SLOW' ? '🟡' : '⚠️';
            this.connectionElement.innerHTML = `${emoji} CONNECTION: ${this.status} (${this.latency}ms)`;
            
            // Color warning during spike
            if (this.isSpiking) {
                this.connectionElement.style.color = '#ff0000';
            } else {
                this.connectionElement.style.color = '';
            }
        }
    }
}

/**
 * Initialize HUD stats when DOM is ready
 */
function initializeHUD() {
    // Guard: Prevent double initialization
    if (window.__HUD_INITIALIZED__) {
        console.log('⚠️ HUD already initialized, skipping...');
        return;
    }
    window.__HUD_INITIALIZED__ = true;
    
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }

    function init() {
        // Add freeze glitch animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes freeze-glitch {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.8; filter: blur(1px); }
            }
        `;
        document.head.appendChild(style);
        
        // Initialize FPS counter with pranks
        new FPSCounter('.fps-counter');

        // Initialize connection monitor with pranks
        new ConnectionMonitor('.connection-info');

        console.log('🎮 Retro HUD Stats Initialized with PRANKS!');
    }
}

// Start the HUD
initializeHUD();
