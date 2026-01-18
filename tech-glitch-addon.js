    // Quick Japanese glitch for tech icons
    startTechGlitchCycle() {
        const scheduleNextTechGlitch = () => {
            const delay = Math.random() * 3000 + 2000; // 2-5 seconds
            setTimeout(() => {
                this.performTechGlitch();
                scheduleNextTechGlitch();
            }, delay);
        };
        
        scheduleNextTechGlitch();
    }
    
    performTechGlitch() {
        const techIcons = document.querySelectorAll('[data-tech-glitch]');
        
        if (techIcons.length === 0) return;
        
        // Pick 2-4 random tech icons to glitch
        const numToGlitch = Math.floor(Math.random() * 3) + 2;
        const iconsArray = Array.from(techIcons);
        const shuffled = iconsArray.sort(() => 0.5 - Math.random());
        const selectedIcons = shuffled.slice(0, numToGlitch);
        
        selectedIcons.forEach(icon => {
            this.quickTechGlitch(icon);
        });
    }
    
    async quickTechGlitch(icon) {
        const key = icon.getAttribute('data-tech-glitch');
        const originalText = icon.getAttribute('data-original-text');
        const translations = this.translations[key];
        
        if (!translations) return;
        
        // Add quick glitch class
        icon.classList.add('glitching');
        
        // Rapid cycle to Japanese and back (3 cycles, 40ms each = 120ms total)
        for (let i = 0; i < 3; i++) {
            icon.textContent = translations.ja;
            await new Promise(resolve => setTimeout(resolve, 40));
            icon.textContent = originalText;
            await new Promise(resolve => setTimeout(resolve, 40));
        }
        
        // Return to original
        icon.textContent = originalText;
        icon.classList.remove('glitching');
        
        console.log(`⚡ Tech glitched: ${key} → ${translations.ja}`);
    }
