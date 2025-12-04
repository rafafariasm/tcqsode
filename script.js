document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const triggerBtn = document.getElementById('realityBtn');
    const dualTexts = document.querySelectorAll('.dual-text');

    // Função para ativar o "Modo Dinheiro"
    const activateMoneyMode = () => {
        body.classList.add('money-mode');
        triggerBtn.querySelector('.label').textContent = "VISÃO FINANCEIRA ATIVADA";
        
        // Troca os textos para a versão "ilusão"
        dualTexts.forEach(el => {
            el.dataset.original = el.innerText; // Salva o original
            el.innerText = el.dataset.illusion; // Aplica a ilusão
        });
    };

    // Função para desativar (Voltar à Realidade)
    const deactivateMoneyMode = () => {
        body.classList.remove('money-mode');
        triggerBtn.querySelector('.label').textContent = "SEGURE PARA VER COMO O DINHEIRO VÊ";

        // Restaura os textos originais
        dualTexts.forEach(el => {
            if(el.dataset.original) {
                el.innerText = el.dataset.original;
            }
        });
    };

    // Event Listeners para Mouse e Touch (Celular)
    triggerBtn.addEventListener('mousedown', activateMoneyMode);
    triggerBtn.addEventListener('mouseup', deactivateMoneyMode);
    triggerBtn.addEventListener('mouseleave', deactivateMoneyMode);

    triggerBtn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Evita comportamento de scroll
        activateMoneyMode();
    });
    triggerBtn.addEventListener('touchend', deactivateMoneyMode);

    // Efeito extra: Scroll Reveal simples
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    document.querySelectorAll('.track-section').forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 1s ease';
        observer.observe(section);
    });
});
