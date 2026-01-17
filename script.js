// ==============================
// RETRO HUD - Dynamic Stats
// ==============================

/**
 * Calculates and displays real-time FPS (Frames Per Second)
 */
class FPSCounter {
    constructor(elementSelector) {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 60;
        this.fpsElement = document.querySelector(elementSelector);
        this.update();
    }

    update = () => {
        const currentTime = performance.now();
        this.frameCount++;

        // Update FPS every second
        if (currentTime >= this.lastTime + 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;

            // Update DOM
            if (this.fpsElement) {
                this.fpsElement.textContent = `FPS: ${this.fps}`;
            }
        }

        requestAnimationFrame(this.update);
    };
}

/**
 * Measures and displays connection latency
 */
class ConnectionMonitor {
    constructor(elementSelector) {
        this.latency = 0;
        this.connectionElement = document.querySelector(elementSelector);
        this.status = 'STABLE';
        this.measureLatency();
        // Update latency every 3 seconds
        setInterval(() => this.measureLatency(), 3000);
    }

    async measureLatency() {
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
        }
    }
}

/**
 * Initialize HUD stats when DOM is ready
 */
function initializeHUD() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // Initialize FPS counter
        new FPSCounter('.fps-counter');

        // Initialize connection monitor
        new ConnectionMonitor('.connection-info');

        console.log('🎮 Retro HUD Stats Initialized!');
    }
}

// Start the HUD
initializeHUD();
