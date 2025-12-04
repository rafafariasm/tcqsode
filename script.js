document.addEventListener('DOMContentLoaded', () => {
    const levels = document.querySelectorAll('.level');
    const levelTracker = document.getElementById('current-level');
    const totalLevels = levels.length - 1; // Exclui a mensagem final

    // Usaremos Intersection Observer para saber em qual seção o usuário está.
    const observerOptions = {
        root: null, // viewport
        threshold: 0.5 // 50% da seção visível
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const trackElement = entry.target;
                const trackId = trackElement.dataset.trackId;
                
                if (trackId) {
                    // Atualiza o rastreador de nível no cabeçalho
                    // Invertemos a ordem (8 é o topo, 1 é o fundo)
                    const currentLevel = totalLevels - (parseInt(trackId) - 1);
                    levelTracker.textContent = currentLevel;
                    
                    // TODO: Aqui você faria o "player de áudio" iniciar ou mudar a faixa
                    console.log(`Iniciando a faixa ${trackId}: ${trackElement.querySelector('.track-title').textContent}`);
                }
            }
        });
    }, observerOptions);

    levels.forEach(level => {
        if (level.id !== 'tracker' && !level.classList.contains('final-message')) {
            observer.observe(level);
        }
    });

    // --- Implementação Específica da Interação ---

    // 1. Faixa 6: PRA NOS VENDER PRA QUEM? (Fumaça/Haze)
    const track6 = document.getElementById('track-6');
    if (track6) {
        track6.addEventListener('mousemove', (e) => {
            // Simulação: o movimento do mouse 'limpa' a fumaça ao redor do cursor
            const smoke = track6.querySelector('::before'); // Não pode selecionar pseudo-elemento
            
            // Alternativa: Mudar a opacidade da fumaça globalmente ao rolar, ou só na seção
            const percentage = (track6.getBoundingClientRect().top / window.innerHeight) * 100;
            const newOpacity = Math.max(0.4, percentage / 100);
            track6.style.setProperty('--haze-opacity', newOpacity);
        });
    }

    // 2. Faixa 2: S.U.S (Simulação de Glitch ECG)
    const ecg = document.querySelector('.visual-ecg');
    if (ecg) {
        // Exemplo de Animação CSS/JS para simular o batimento cardíaco ou o glitch.
        // O efeito final seria feito com Canvas ou SVG animado.
        // Adiciona um evento de click para simular um "Choque"
        ecg.addEventListener('click', () => {
             ecg.style.animation = 'glitchPulse 0.5s forwards';
             setTimeout(() => ecg.style.animation = 'none', 500);
        });
    }
});
