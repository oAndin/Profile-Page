// ==============================
// RETRO GAME MENU CONTROLLER
// ==============================

class GameMenu {
    constructor() {
        this.options = document.querySelectorAll('.menu-option');
        this.currentIndex = 0;
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        // Set first option as active
        this.setActiveOption(0);
        
        // Event listeners
        this.addKeyboardNavigation();
        this.addMouseNavigation();
        this.addTouchNavigation();
        
        // Add glitch effect to title
        this.addTitleGlitch();
        
        console.log('🎮 Game Menu Initialized!');
    }
    
    addKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Prevent navigation during loading
            if (this.isLoading) return;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    e.preventDefault();
                    this.navigateUp();
                    this.playSound('nav');
                    break;
                    
                case 'ArrowDown':
                case 's':
                case 'S':
                    e.preventDefault();
                    this.navigateDown();
                    this.playSound('nav');
                    break;
                    
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    this.selectOption();
                    this.playSound('select');
                    break;
            }
        });
    }
    
    addMouseNavigation() {
        this.options.forEach((option, index) => {
            // Hover effect
            option.addEventListener('mouseenter', () => {
                this.setActiveOption(index);
                this.playSound('nav');
            });
            
            // Click handler
            option.addEventListener('click', (e) => {
                e.preventDefault();
                this.setActiveOption(index);
                this.selectOption();
                this.playSound('select');
            });
        });
    }
    
    addTouchNavigation() {
        this.options.forEach((option, index) => {
            option.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.setActiveOption(index);
                this.playSound('nav');
            });
            
            option.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.selectOption();
                this.playSound('select');
            });
        });
    }
    
    navigateUp() {
        this.currentIndex = (this.currentIndex - 1 + this.options.length) % this.options.length;
        this.setActiveOption(this.currentIndex);
    }
    
    navigateDown() {
        this.currentIndex = (this.currentIndex + 1) % this.options.length;
        this.setActiveOption(this.currentIndex);
    }
    
    setActiveOption(index) {
        // Remove active class from all options
        this.options.forEach(option => option.classList.remove('active'));
        
        // Add active class to current option
        this.options[index].classList.add('active');
        this.currentIndex = index;
    }
    
    selectOption() {
        if (this.isLoading) return;
        
        const selectedOption = this.options[this.currentIndex];
        const targetUrl = selectedOption.getAttribute('href');
        
        // Prevent default navigation
        this.isLoading = true;
        
        // Add selection feedback
        selectedOption.style.transform = 'scale(1.1)';
        
        // Visual feedback - flash the option
        let flashCount = 0;
        const flashInterval = setInterval(() => {
            selectedOption.style.opacity = flashCount % 2 === 0 ? '0.5' : '1';
            flashCount++;
            
            if (flashCount >= 6) {
                clearInterval(flashInterval);
                selectedOption.style.opacity = '1';
                
                // Navigate after flash effect
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 200);
            }
        }, 100);
    }
    
    addTitleGlitch() {
        const titleElements = document.querySelectorAll('.title-glitch');
        
        setInterval(() => {
            // Random glitch effect
            if (Math.random() < 0.05) {
                titleElements.forEach(title => {
                    title.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
                    
                    setTimeout(() => {
                        title.style.transform = 'translate(0, 0)';
                    }, 50);
                });
            }
        }, 100);
    }
    
    playSound(type) {
        // Placeholder for sound effects
        // You can add actual audio files here later
        // Example: new Audio('sounds/nav.mp3').play();
        console.log(`🔊 Sound: ${type}`);
    }
}

// ==============================
// EASTER EGGS & SECRET CODES
// ==============================

class SecretCodes {
    constructor() {
        this.sequence = [];
        this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        
        this.init();
    }
    
    init() {
        document.addEventListener('keydown', (e) => {
            this.sequence.push(e.key);
            
            // Keep only last 10 keys
            if (this.sequence.length > 10) {
                this.sequence.shift();
            }
            
            // Check for Konami code
            if (this.checkKonamiCode()) {
                this.activateKonamiCode();
            }
        });
    }
    
    checkKonamiCode() {
        return this.konamiCode.every((key, index) => key === this.sequence[index]);
    }
    
    activateKonamiCode() {
        console.log('🎉 KONAMI CODE ACTIVATED!');
        
        // Add special visual effect
        const body = document.body;
        body.style.animation = 'rainbow-flash 2s ease';
        
        // Show secret message
        const message = document.createElement('div');
        message.textContent = '🎮 DEVELOPER MODE ACTIVATED';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: 'Courier New', monospace;
            font-size: 2rem;
            color: #ff00ff;
            text-shadow: 0 0 20px rgba(255, 0, 255, 1);
            z-index: 9999;
            animation: fade-out 3s forwards;
        `;
        body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
        
        // Reset sequence
        this.sequence = [];
    }
}

// Add rainbow flash animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow-flash {
        0% { filter: hue-rotate(0deg); }
        25% { filter: hue-rotate(90deg); }
        50% { filter: hue-rotate(180deg); }
        75% { filter: hue-rotate(270deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    @keyframes fade-out {
        0% { opacity: 1; }
        70% { opacity: 1; }
        100% { opacity: 0; }
    }
`;
document.head.appendChild(style);

// ==============================
// INITIALIZE MENU
// ==============================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenu);
} else {
    initMenu();
}

function initMenu() {
    // Initialize game menu
    new GameMenu();
    
    // Initialize secret codes
    new SecretCodes();
}

console.log('🎮 Menu System Loaded!');
