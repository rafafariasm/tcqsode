// --- DATA ---
const tracks = [
    {
        title: "NAÇÃO DO DESCASO",
        focus: { x: 50, y: 35, scale: 2.5 }, 
        lyrics: "Estamos falidos / Sem proteção / Abandonados na guerra / Corrupção... <br> O sistema vibra / Enquanto a mãe grita",
        notes: ["C3", "Eb3", "G3"] // Dark, diminished chord
    },
    {
        title: "GRITO REAL",
        focus: { x: 65, y: 55, scale: 3 },
        lyrics: "Não parecem ouvir / O Grito real / Da mãe que chora / Por não vê seu filho crescer...",
        notes: ["D3", "F3", "A3"] // Minor chord for sadness
    },
    {
        title: "PRA NOS VENDER PRA QUEM?",
        focus: { x: 10, y: 50, scale: 2.5 },
        lyrics: "A mata levou / E o ar nos tirou / Vidas / Respiram / O preço / Que habita...",
        notes: ["A2", "C3", "E3"]
    },
    {
        title: "VIDA IMEDIATA",
        focus: { x: 80, y: 85, scale: 3 },
        lyrics: "Por notas de 100 / Tu finge pros outros / Olhos cansados / Sorriso no rosto...",
        notes: ["E3", "G#3", "B3", "D4"] // Dominant 7th, unstable
    },
    {
        title: "CENAS DE HORROR",
        focus: { x: 25, y: 70, scale: 3 },
        lyrics: "Grito, caos, cenas de horror / Como um tapete jogado no chão / Corpos jogados...",
        notes: ["F#3", "A3", "C4"] // Highly dissonant
    },
    {
        title: "S.U.S",
        focus: { x: 80, y: 15, scale: 2 },
        lyrics: "Te falta ar / Ninguém pra ajudar / Não vai te internar... SUS não socorre!",
        notes: ["C4", "Db4", "G4"] // Tense, close interval
    }
];

// --- ELEMENTS ---
const rainSfx = document.getElementById('sfx-rain');
const thunderSfx = document.getElementById('sfx-thunder');

const scene = document.getElementById('scene-container');
const art = document.getElementById('album-art');
const playerOverlay = document.getElementById('player-overlay');
const titleDisplay = document.getElementById('now-playing-title');
const lyricsDisplay = document.getElementById('lyrics-display');
const playIcon = document.getElementById('play-icon');
const startScreen = document.getElementById('curtain');
const loadingIndicator = document.getElementById('loading-indicator');

let isZoomed = false;
let isPlaying = false;

// --- TONE.JS ELEMENTS ---
let polySynth, reverb, filter;
let currentLoop;
let currentTrackTitle = "SELECIONE UM PONTO"; // Mantém o estado da faixa atual

// --- INIT ---
document.getElementById('enter-btn').addEventListener('click', async () => {
    // Esconde a tela inicial
    startScreen.style.opacity = 0;
    setTimeout(() => startScreen.remove(), 1500);

    // Inicializa o Tone.js (necessário após interação do usuário)
    await Tone.start();
    initToneAudio();
    
    // Inicia o Som Ambiente
    rainSfx.volume = 0.3;
    rainSfx.play().catch(e => console.log("Audio autoplay block"));
    
    // Inicia os Visuais de Clima
    initWeather();
});

function initToneAudio() {
    // Reverb Master para atmosfera
    reverb = new Tone.Reverb({
        decay: 5,
        wet: 0.5
    }).toDestination();

    // Filtro Low-pass para um som escuro e abafado
    filter = new Tone.Filter(300, 'lowpass').connect(reverb);

    // Sintetizador: Onda triangular simples para um drone ambiente profundo
    polySynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: {
            attack: 4,
            decay: 1,
            sustain: 0.8,
            release: 4
        }
    }).connect(filter);

    // Inicia o transporte do Tone
    Tone.Transport.start();
    isPlaying = false; // Começa no estado Pausado/Esperando
}

// --- INTERACTION ---

// Efeito Parallax do Mouse (Apenas quando não há zoom)
document.addEventListener('mousemove', (e) => {
    if(isZoomed) return;
    
    const x = (window.innerWidth - e.pageX * 2) / 150;
    const y = (window.innerHeight - e.pageY * 2) / 150;
    
    // Aplica o movimento à imagem de fundo
    art.style.transform = `translateX(${x}px) translateY(${y}px) scale(1.1)`;
});

function playTrack(index) {
    const track = tracks[index];
    isZoomed = true;
    currentTrackTitle = track.title; // Atualiza o título da faixa atual
    loadingIndicator.classList.add('hidden'); 

    // 1. Zoom Visual para a área específica
    scene.style.transformOrigin = `${track.focus.x}% ${track.focus.y}%`;
    scene.style.transform = `scale(${track.focus.scale})`;
    
    // Diminui a chuva levemente
    document.getElementById('weather-canvas').style.opacity = 0.3;
    
    // 2. Lógica de Áudio (Tone.js)
    stopToneLoop(); // Para o loop anterior
    
    // Gera um loop de acorde sustentado para a atmosfera
    currentLoop = new Tone.Loop(time => {
        polySynth.triggerAttackRelease(track.notes, '4n', time);
    }, '2n').start(0); 

    isPlaying = true;

    // Dispara SFX de Trovão para drama no clique
    thunderSfx.currentTime = 0;
    thunderSfx.volume = 0.4;
    thunderSfx.play();

    // 3. Atualização da UI
    titleDisplay.textContent = track.title;
    lyricsDisplay.innerHTML = track.lyrics;
    playerOverlay.classList.add('active');
    playIcon.classList.remove('fa-play');
    playIcon.classList.add('fa-pause');
    
    // Esconde outros hotspots enquanto está com zoom
    document.querySelectorAll('.hotspot').forEach(el => el.style.opacity = '0');
}

function stopToneLoop() {
    if (currentLoop) {
        currentLoop.stop();
        polySynth.releaseAll(); // Garante que o som pare imediatamente
    }
}

function resetView() {
    isZoomed = false;
    currentTrackTitle = "SELECIONE UM PONTO";
    
    // Reseta o Zoom
    scene.style.transform = `scale(1)`;
    document.getElementById('weather-canvas').style.opacity = 1;

    // Para o áudio da faixa, mas mantém o SFX
    stopToneLoop();
    isPlaying = false;
    
    // Reseta a UI
    titleDisplay.textContent = "SELECIONE UM PONTO";
    lyricsDisplay.innerHTML = "Explore a imagem para revelar a verdade.";
    playerOverlay.classList.remove('active');
    playIcon.classList.remove('fa-pause');
    playIcon.classList.add('fa-play');
    
    // Mostra os hotspots
    setTimeout(() => {
        document.querySelectorAll('.hotspot').forEach(el => el.style.opacity = '1');
    }, 500);
}

function togglePlay() {
    if (!polySynth || !isZoomed) return; // Só permite toggle se houver zoom e synth

    if (isPlaying) {
        // Pausar
        stopToneLoop();
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
        isPlaying = false;
    } else {
        // Tocar (Retomar o último loop conhecido)
        const currentTrackIndex = tracks.findIndex(t => t.title === currentTrackTitle);
        if (currentTrackIndex !== -1) {
             const track = tracks[currentTrackIndex];
             // Inicia o loop novamente
             currentLoop = new Tone.Loop(time => {
                polySynth.triggerAttackRelease(track.notes, '4n', time);
             }, '2n').start(0);
             isPlaying = true;
        }
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    }
}

// --- WEATHER SYSTEM (Canvas) ---
function initWeather() {
    const canvas = document.getElementById('weather-canvas');
    const ctx = canvas.getContext('2d');
    
    let w, h;
    const drops = [];
    const maxDrops = 1000;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function Drop() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.l = Math.random() * 20 + 10;
        this.vy = Math.random() * 15 + 10;
        
        this.update = function() {
            this.y += this.vy;
            if(this.y > h) {
                this.y = -20;
                this.x = Math.random() * w;
            }
        }
        
        this.draw = function() {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(174, 194, 224, 0.3)';
            ctx.lineWidth = 1;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y + this.l);
            ctx.stroke();
        }
    }

    for(let i=0; i<maxDrops; i++) {
        drops.push(new Drop());
    }

    // Relâmpagos
    let lightningTimer = 0;

    function anim() {
        ctx.clearRect(0, 0, w, h);
        
        // Chuva
        drops.forEach(d => {
            d.update();
            d.draw();
        });

        // Relâmpago aleatório
        if(lightningTimer <= 0) {
            if(Math.random() > 0.995) {
                lightningTimer = 10;
                thunderSfx.currentTime = 0;
                thunderSfx.volume = 0.2 + Math.random() * 0.3;
                thunderSfx.play();
            }
        } else {
            lightningTimer--;
            // Desenha o flash
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
            ctx.fillRect(0, 0, w, h);
        }

        requestAnimationFrame(anim);
    }
    anim();
}
