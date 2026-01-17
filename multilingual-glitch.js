// ==============================
// MULTILINGUAL GLITCH EFFECT
// ==============================

/**
 * Creates a glitching text effect that cycles through multiple languages
 */
class MultilingualGlitch {
    constructor() {
        this.languages = ['en', 'pt', 'no', 'ja', 'it', 'es'];
        this.currentLangIndex = 0;
        
        // Define translations for various elements
        this.translations = {
            // Header section titles
            'profile': {
                en: 'PROFILE',
                pt: 'PERFIL',
                no: 'PROFIL',
                ja: 'プロフィール',
                it: 'PROFILO',
                es: 'PERFIL'
            },
            'bio': {
                en: 'BIO',
                pt: 'BIO',
                no: 'BIO',
                ja: 'バイオ',
                it: 'BIO',
                es: 'BIO'
            },
            'portfolio': {
                en: 'PORTFOLIO',
                pt: 'PORTFÓLIO',
                no: 'PORTEFØLJE',
                ja: 'ポートフォリオ',
                it: 'PORTFOLIO',
                es: 'PORTAFOLIO'
            },
            'contact': {
                en: 'CONTACT',
                pt: 'CONTATO',
                no: 'KONTAKT',
                ja: '連絡先',
                it: 'CONTATTO',
                es: 'CONTACTO'
            },
            // Role descriptions
            'data-analyst': {
                en: 'Data Analyst',
                pt: 'Analista de Dados',
                no: 'Dataanalytiker',
                ja: 'データアナリスト',
                it: 'Analista di Dati',
                es: 'Analista de Datos'
            },
            'software-developer': {
                en: 'Software Developer',
                pt: 'Desenvolvedor de Software',
                no: 'Programvareutvikler',
                ja: 'ソフトウェア開発者',
                it: 'Sviluppatore Software',
                es: 'Desarrollador de Software'
            },
            // Stats labels
            'location': {
                en: 'LOCATION:',
                pt: 'LOCALIZAÇÃO:',
                no: 'PLASSERING:',
                ja: '場所:',
                it: 'POSIZIONE:',
                es: 'UBICACIÓN:'
            },
            'languages': {
                en: 'LANGUAGES:',
                pt: 'IDIOMAS:',
                no: 'SPRÅK:',
                ja: '言語:',
                it: 'LINGUE:',
                es: 'IDIOMAS:'
            },
            // Availability status
            'available': {
                en: 'Available for Opportunities',
                pt: 'Disponível para Oportunidades',
                no: 'Tilgjengelig for Muligheter',
                ja: '機会を求めています',
                it: 'Disponibile per Opportunità',
                es: 'Disponible para Oportunidades'
            }
        };
        
        this.initGlitchEffect();
    }
    
    initGlitchEffect() {
        // Mark elements that should glitch with data-glitch attribute
        this.addGlitchAttributes();
        
        // Start the glitch cycle
        this.startGlitchCycle();
    }
    
    addGlitchAttributes() {
        // Add data-glitch-key to elements that should cycle languages
        const elements = [
            { selector: '#profile h2', key: 'profile', keepEmoji: true },
            { selector: '#bio h2', key: 'bio', keepEmoji: true },
            { selector: '#portfolio h2', key: 'portfolio', keepEmoji: true },
            { selector: '#contact h2', key: 'contact', keepEmoji: true },
            { selector: '.role', key: 'data-analyst' },
            { selector: '.sub-role', key: 'software-developer' },
            { selector: '.stat-label:first-child', key: 'location' },
            { selector: '.stat-label:last-child', key: 'languages' },
            { selector: '.status-text', key: 'available' }
        ];
        
        elements.forEach(({ selector, key, keepEmoji }) => {
            const element = document.querySelector(selector);
            if (element) {
                element.setAttribute('data-glitch-key', key);
                if (keepEmoji) {
                    element.setAttribute('data-keep-emoji', 'true');
                }
            }
        });
    }
    
    startGlitchCycle() {
        // Random glitch every 3-8 seconds
        const scheduleNextGlitch = () => {
            const delay = Math.random() * 5000 + 3000; // 3-8 seconds
            setTimeout(() => {
                this.performGlitch();
                scheduleNextGlitch();
            }, delay);
        };
        
        scheduleNextGlitch();
    }
    
    performGlitch() {
        const glitchElements = document.querySelectorAll('[data-glitch-key]');
        
        if (glitchElements.length === 0) return;
        
        // Pick 1-3 random elements to glitch
        const numToGlitch = Math.floor(Math.random() * 3) + 1;
        const elementsArray = Array.from(glitchElements);
        const shuffled = elementsArray.sort(() => 0.5 - Math.random());
        const selectedElements = shuffled.slice(0, numToGlitch);
        
        selectedElements.forEach(element => {
            this.glitchElement(element);
        });
    }
    
    async glitchElement(element) {
        const key = element.getAttribute('data-glitch-key');
        const keepEmoji = element.getAttribute('data-keep-emoji') === 'true';
        const originalText = element.textContent;
        const translations = this.translations[key];
        
        if (!translations) return;
        
        // Extract emoji if present
        let emoji = '';
        let cleanText = originalText;
        if (keepEmoji && originalText.includes(' ')) {
            const parts = originalText.split(' ');
            emoji = parts[0] + ' '; // First part is emoji
            cleanText = parts.slice(1).join(' ');
        }
        
        // Add glitch class for visual effect
        element.classList.add('glitching');
        
        // Rapid cycle through 3-5 random languages
        const cycles = Math.floor(Math.random() * 3) + 3;
        const shuffledLangs = [...this.languages].sort(() => 0.5 - Math.random());
        
        for (let i = 0; i < cycles; i++) {
            const lang = shuffledLangs[i % shuffledLangs.length];
            element.textContent = emoji + translations[lang];
            await new Promise(resolve => setTimeout(resolve, 80)); // 80ms per change
        }
        
        // Return to original (English)
        element.textContent = originalText;
        element.classList.remove('glitching');
        
        console.log(`✨ Glitched: ${key}`);
    }
}

// Initialize the multilingual glitch effect
let multilingualGlitch;

function initMultilingualGlitch() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            multilingualGlitch = new MultilingualGlitch();
            console.log('🌐 Multilingual Glitch Effect Initialized!');
        });
    } else {
        multilingualGlitch = new MultilingualGlitch();
        console.log('🌐 Multilingual Glitch Effect Initialized!');
    }
}

// Add CSS for glitch effect
const glitchStyle = document.createElement('style');
glitchStyle.textContent = `
    .glitching {
        animation: text-glitch 0.08s infinite;
        color: #00ffff !important;
        text-shadow: 2px 2px #ff00ff, -2px -2px #00ff00 !important;
    }
    
    @keyframes text-glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
    }
`;
document.head.appendChild(glitchStyle);

// Start the glitch effect
initMultilingualGlitch();
