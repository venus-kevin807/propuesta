// celebracion.component.ts
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Heart {
  id: number;
  emoji: string;
  left: number;
  delay: number;
  randomX: number;
  size: number;
}

interface Sparkle {
  id: number;
  emoji: string;
  left: number;
  top: number;
  delay: number;
}

interface FloatingParticle {
  id: number;
  left: number;
  top: number;
  size: number;
  opacity: number;
  delay: number;
}

interface Firework {
  id: number;
  x: number;
  y: number;
  color: string;
}

@Component({
  selector: 'app-celebracion',
  standalone: true,
  imports: [CommonModule],
 template: `
    <div class="celebracion-container" [class.loaded]="isLoaded()">
      <div class="content-wrapper">

        <!-- Frase romántica principal -->
        <div class="romantic-phrase">
          <div class="quote-mark">"</div>
          <p class="phrase-text">
            No sabes lo feliz que me haces al decirme que sí.
            Prometo cuidarte, respetarte y darte lo mejor de mí cada día.
            Este es el comienzo de una historia muy especial,
            y quiero que juntos construyamos recuerdos hermosos que nos acompañen siempre.
          </p>
          <div class="quote-mark closing">"</div>
        </div>

      <div class="spotify-iframe-container">
          <!-- Reproductor oficial de Spotify -->
          <iframe
            style="border-radius:12px"
            src="https://open.spotify.com/embed/track/2Ye46ZY2LKOQTPXaauQisB"
            width="100%"
            height="152"
            frameborder="0"
            allowfullscreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy">
          </iframe>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100vh;
      font-family: 'Playfair Display', serif;
    }

    .celebracion-container {
      text-align: center;
      padding: 0;
      background:
        radial-gradient(ellipse at top, rgba(255, 215, 0, 0.6) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(255, 20, 147, 0.8) 0%, transparent 50%),
        radial-gradient(ellipse at center, rgba(138, 43, 226, 0.6) 0%, transparent 70%),
        linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
      position: relative;
      min-height: 110vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 1s ease-in-out;
    }

    .celebracion-container.loaded {
      opacity: 1;
    }

    .particles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }

    .particle {
      position: absolute;
      background: radial-gradient(circle, rgba(255,215,0,0.8), rgba(255,105,180,0.3));
      border-radius: 50%;
      animation: particleFloat 15s infinite linear;
    }

    @keyframes particleFloat {
      0% {
        transform: translateY(100vh) translateX(0) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(-10vh) translateX(80px) rotate(360deg);
        opacity: 0;
      }
    }

    .aurora.celebration {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background:
        linear-gradient(90deg,
          transparent,
          rgba(255, 215, 0, 0.3),
          rgba(255, 20, 147, 0.25),
          rgba(138, 43, 226, 0.25),
          rgba(255, 215, 0, 0.3),
          transparent
        );
      animation: auroraCelebration 6s ease-in-out infinite;
      z-index: 1;
    }

    @keyframes auroraCelebration {
      0%, 100% { opacity: 0.4; transform: translateX(-100%) scale(1.2); }
      50% { opacity: 0.9; transform: translateX(100%) scale(1.5); }
    }

    .fireworks {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    .firework {
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--firework-color);
      animation: explode 2s ease-out infinite;
    }

    @keyframes explode {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      50% {
        transform: scale(20);
        opacity: 0.8;
        box-shadow:
          0 0 20px var(--firework-color),
          0 0 40px var(--firework-color),
          0 0 60px var(--firework-color);
      }
      100% {
        transform: scale(40);
        opacity: 0;
      }
    }

    .content-wrapper {
      position: relative;
      z-index: 3;
      backdrop-filter: blur(20px) saturate(200%);
      background: rgba(255, 255, 255, 0.08);
      border: 2px solid rgba(255, 215, 0, 0.2);
      border-radius: 40px;
      padding: 4rem 3rem;
      max-width: 600px;
      width: 90%;
      box-shadow:
        0 30px 60px rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(255, 215, 0, 0.1),
        inset 0 2px 0 rgba(255, 255, 255, 0.15),
        0 0 50px rgba(255, 215, 0, 0.3);
      animation: contentCelebrationAppear 2.5s ease-out;
    }

    @keyframes contentCelebrationAppear {
      0% {
        opacity: 0;
        transform: translateY(100px) scale(0.6) rotateX(-30deg);
        filter: blur(20px);
      }
      60% {
        transform: translateY(-20px) scale(1.1) rotateX(5deg);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1) rotateX(0deg);
        filter: blur(0);
      }
    }

    .celebration-header {
      margin-bottom: 2.5rem;
      animation: headerCelebration 2s ease-out 0.5s both;
    }

    @keyframes headerCelebration {
      from { opacity: 0; transform: translateY(-50px) scale(0.5); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .crown-celebration {
      font-size: 2.5rem;
      margin-bottom: 1.5rem;
      filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8));
      animation: crownCelebrationFloat 2s ease-in-out infinite;
    }

    @keyframes crownCelebrationFloat {
      0%, 100% { transform: translateY(0) rotate(-3deg) scale(1); }
      50% { transform: translateY(-15px) rotate(3deg) scale(1.1); }
    }

    .divider.celebration {
      width: 80px;
      height: 2px;
      background: linear-gradient(90deg, transparent, #ffd700, #ff69b4, #ffd700, transparent);
      margin: 0 auto;
      position: relative;
      animation: dividerGlow 3s ease-in-out infinite;
    }

    @keyframes dividerGlow {
      0%, 100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
      50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.8); }
    }

    .celebration-message {
      margin: 3rem 0;
      animation: celebrationReveal 2.5s ease-out 1s both;
    }

    @keyframes celebrationReveal {
      from { opacity: 0; transform: scale(0.5) rotateY(-30deg); }
      to { opacity: 1; transform: scale(1) rotateY(0deg); }
    }

    .celebration-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2.2rem, 7vw, 4rem);
      font-weight: 700;
      color: #fff;
      margin: 2rem 0;
      line-height: 1.2;
      text-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
    }

    .celebration-word {
      display: inline-block;
      animation: wordCelebration 1s ease-out both;
    }

    .celebration-word.delay-1 {
      animation-delay: 0.2s;
    }

    .celebration-word.delay-2 {
      animation-delay: 0.4s;
    }

    .highlight-word {
      display: inline-block;
      background: linear-gradient(45deg, #ffd700, #ff69b4, #ff1493, #ffd700);
      background-size: 300% 300%;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: wordCelebration 1s ease-out 0.6s both, gradientCelebration 2s ease-in-out infinite 1.6s;
      font-size: 1.2em;
      font-weight: 800;
    }

    @keyframes wordCelebration {
      from {
        opacity: 0;
        transform: translateY(50px) scale(0.5) rotateX(90deg);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1) rotateX(0deg);
      }
    }

    @keyframes gradientCelebration {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    .romantic-phrase {
      position: relative;
      margin: 3rem 0;
      animation: phraseReveal 2s ease-out 1.8s both;
    }

    @keyframes phraseReveal {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .quote-mark {
      font-family: 'Cormorant Garamond', serif;
      font-size: 4rem;
      color: rgba(255, 215, 0, 0.5);
      line-height: 0;
      position: absolute;
      top: -20px;
      left: -30px;
    }

    .quote-mark.closing {
      left: auto;
      right: -30px;
      top: 20px;
      transform: rotate(180deg);
    }

    .phrase-text {
      color: rgba(255, 255, 255, 0.95);
      font-size: clamp(1.1rem, 3.5vw, 1.4rem);
      font-style: italic;
      line-height: 1.6;
      margin: 2rem 0;
      font-weight: 500;
    }

    .spotify-section {
      margin: 3rem 0;
      animation: spotifyReveal 2s ease-out 2.3s both;
    }

    @keyframes spotifyReveal {
      from { opacity: 0; transform: translateY(40px) scale(0.9); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .spotify-label {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.1rem;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-weight: 500;
    }

    .spotify-icon {
      font-size: 1.2em;
      animation: iconBounce 2s ease-in-out infinite;
    }

    .spotify-icon:last-child {
      animation-delay: 1s;
    }

    @keyframes iconBounce {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-8px) rotate(10deg); }
    }

    .spotify-code-container {
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(15px);
      border: 2px solid rgba(30, 215, 96, 0.3);
      border-radius: 20px;
      padding: 2rem;
      margin: 1.5rem 0;
    }

    .spotify-code {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: rgba(30, 215, 96, 0.1);
      border-radius: 15px;
      border: 1px solid rgba(30, 215, 96, 0.2);
    }

    .spotify-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .spotify-circle {
      width: 24px;
      height: 24px;
      background: #1ed760;
      border-radius: 50%;
      position: relative;
    }

    .spotify-lines {
      display: flex;
      gap: 2px;
    }

    .line {
      width: 3px;
      background: #1ed760;
      border-radius: 2px;
      animation: audioBar 1.5s ease-in-out infinite;
    }

    .line:nth-child(1) { height: 12px; animation-delay: 0s; }
    .line:nth-child(2) { height: 20px; animation-delay: 0.2s; }
    .line:nth-child(3) { height: 16px; animation-delay: 0.4s; }
    .line:nth-child(4) { height: 24px; animation-delay: 0.6s; }

    @keyframes audioBar {
      0%, 100% { transform: scaleY(1); opacity: 0.7; }
      50% { transform: scaleY(0.3); opacity: 1; }
    }

    .code-bars {
      display: flex;
      gap: 1px;
      align-items: end;
      justify-content: center;
    }

    .bar {
      width: 2px;
      background: linear-gradient(to top, #1ed760, #1db954);
      border-radius: 1px;
      animation: codeBar 2s ease-in-out infinite;
    }

    @keyframes codeBar {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 1; }
    }

    .code-text {
      font-family: 'Courier New', monospace;
      color: #1ed760;
      font-size: 0.9rem;
      letter-spacing: 1px;
      font-weight: bold;
    }

    .song-info {
      text-align: center;
    }

    .song-title {
      color: #fff;
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .song-artist {
      color: rgba(255, 255, 255, 0.7);
      font-size: 1rem;
      font-style: italic;
    }

    .additional-message {
      margin: 2.5rem 0;
      animation: additionalSlide 2s ease-out 2.8s both;
    }

    @keyframes additionalSlide {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .additional-message p {
      color: rgba(255, 255, 255, 0.9);
      font-size: clamp(1rem, 3vw, 1.1rem);
      line-height: 1.6;
      margin: 0;
      font-weight: 400;
    }

    .action-button {
      margin: 3rem 0;
      animation: buttonCelebrationAppear 2s ease-out 3.3s both;
    }

    @keyframes buttonCelebrationAppear {
      from { opacity: 0; transform: translateY(40px) scale(0.8); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .btn-celebrate {
      background: transparent;
      color: white;
      padding: 1.3rem 3.5rem;
      border-radius: 60px;
      font-size: clamp(1rem, 3vw, 1.2rem);
      cursor: pointer;
      border: 2px solid rgba(255, 215, 0, 0.4);
      font-weight: 600;
      font-family: 'Poppins', sans-serif;
      letter-spacing: 1px;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      z-index: 10;
    }

    .btn-celebrate .btn-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, #ffd700, #ff69b4, #ff1493, #ffd700);
      background-size: 400% 400%;
      animation: gradientCelebrationShift 3s ease infinite;
      opacity: 0;
      transition: opacity 0.5s ease;
      z-index: 1;
    }

    @keyframes gradientCelebrationShift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    .btn-celebrate .btn-text {
      position: relative;
      z-index: 3;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      justify-content: center;
    }

    .btn-celebrate .btn-icon {
      font-size: 1.2em;
      animation: iconCelebrationPulse 1.5s ease-in-out infinite;
    }

    @keyframes iconCelebrationPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.3); }
    }

    .btn-celebrate .btn-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, transparent, rgba(255,255,255,0.5), transparent);
      transition: left 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 2;
    }

    .btn-celebrate:hover .btn-bg {
      opacity: 1;
    }

    .btn-celebrate:hover .btn-shine {
      left: 100%;
    }

    .btn-celebrate:hover {
      transform: translateY(-5px) scale(1.05);
      box-shadow:
        0 25px 50px rgba(255, 215, 0, 0.4),
        0 0 40px rgba(255, 215, 0, 0.6);
      border-color: rgba(255, 215, 0, 0.8);
    }

    .elegant-footer {
      margin-top: 3rem;
      animation: footerCelebrationFade 2s ease-out 3.8s both;
    }

    @keyframes footerCelebrationFade {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .footer-text {
      color: rgba(255, 255, 255, 0.8);
      font-size: 1rem;
      font-style: italic;
      margin-top: 1rem;
      font-weight: 500;
    }

    .hearts {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 2;
    }

    .heart.celebration {
      position: absolute;
      animation: floatHeartsCelebration 8s infinite linear;
      opacity: 0;
      user-select: none;
      filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
    }

    @keyframes floatHeartsCelebration {
      0% {
        transform: translateY(100vh) translateX(0) rotate(0deg) scale(0.3);
        opacity: 0;
      }
      5% {
        opacity: 1;
      }
      95% {
        opacity: 1;
      }
      100% {
        transform: translateY(-20vh) translateX(var(--random-x)) rotate(720deg) scale(2);
        opacity: 0;
      }
    }

    .sparkles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
    }

    .sparkle.celebration {
      position: absolute;
      color: #ffd700;
      animation: sparkleCelebrationElegant 2.5s infinite;
      user-select: none;
      filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8));
      font-size: 1.5rem;
    }

    @keyframes sparkleCelebrationElegant {
      0%, 100% {
        opacity: 0;
        transform: scale(0) rotate(0deg);
      }
      25% {
        opacity: 0.9;
        transform: scale(1) rotate(90deg);
      }
      50% {
        opacity: 1;
        transform: scale(1.5) rotate(180deg);
      }
      75% {
        opacity: 0.9;
        transform: scale(1) rotate(270deg);
      }
    }

    .confetti {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
    }

    .confetti-piece {
      position: absolute;
      width: 6px;
      height: 6px;
      animation: confettiFall 4s linear infinite;
    }

    @keyframes confettiFall {
      0% {
        transform: translateY(-100vh) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }

    @media (max-width: 768px) {
      .content-wrapper {
        padding: 3rem 2rem;
        margin: 1rem;
      }

      .quote-mark {
        font-size: 3rem;
        left: -15px;
      }

      .quote-mark.closing {
        right: -15px;
      }

      .spotify-code-container {
        padding: 1.5rem;
      }
    }

    @media (max-width: 480px) {
      .content-wrapper {
        padding: 2.5rem 1.5rem;
      }

      .btn-celebrate {
        padding: 1rem 2.5rem;
      }

      .spotify-code {
        flex-direction: column;
        gap: 1rem;
      }

      .code-bars {
        min-height: 40px;
      }
    }
  `]
})
export class CelebracionComponent implements OnInit, OnDestroy {
  hearts: Heart[] = [];
  sparkles: Sparkle[] = [];
  particles: FloatingParticle[] = [];
  fireworks: Firework[] = [];
  confettiPieces: any[] = [];
  spotifyBars: any[] = [];

  isLoaded = signal(false);

  // Datos de Spotify (personalízalos según la canción que quieras)
  spotifyCode = 'spotify:track:4uLU6hMCqk75sF11VS5eri';
  songTitle = 'Te Regalo';
  songArtist = 'Carla Morrison';

  private romanticPhrases = [
    "Desde el primer día supe que eras especial, ahora lo confirmaste siendo mía para siempre",
    "Tu 'sí' ilumina mi mundo más que todas las estrellas juntas",
    "Cada latido de mi corazón ahora tiene tu nombre escrito",
    "Contigo he encontrado mi hogar, mi paz y mi aventura eterna"
  ];

  currentPhrase = signal(this.romanticPhrases[0]);

  private additionalMessages = [
    "Ahora podemos escribir nuestra historia de amor juntos 💕",
    "Eres mi persona favorita en todo el universo 🌟",
    "Gracias por elegirme para compartir la vida contigo 💖",
    "Este es solo el comienzo de nuestra hermosa aventura 🌹"
  ];

  currentAdditionalMessage = signal(this.additionalMessages[0]);

  private heartEmojis = ['💖', '💕', '💗', '💓', '💘', '💝', '🤍', '💜', '❤️', '💛'];
  private sparkleEmojis = ['✨', '⭐', '💫', '🌟', '💎', '🌠'];
  private confettiColors = ['#FFD700', '#FF69B4', '#FF1493', '#1ED760', '#9370DB', '#FF4500', '#32CD32'];

  private intervals: number[] = [];
  private heartIdCounter = 0;
  private sparkleIdCounter = 0;
  private particleIdCounter = 0;
  private fireworkIdCounter = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    // Cargar con delay para la animación
    setTimeout(() => {
      this.isLoaded.set(true);
    }, 100);

    this.createParticles();
    this.createSpotifyBars();
    this.startCelebrationAnimations();
    this.startTextRotations();
  }

  ngOnDestroy() {
    this.intervals.forEach(interval => clearInterval(interval));
  }

  goBack() {
    // Podrías navegar a una página de inicio o cerrar
    // this.router.navigate(['/']);

    // O simplemente mostrar un mensaje adicional
    this.currentAdditionalMessage.set("¡Te amo infinitamente! 💕💕💕");
  }

  private createParticles() {
    for (let i = 0; i < 20; i++) {
      const particle: FloatingParticle = {
        id: this.particleIdCounter++,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.8 + 0.2,
        delay: Math.random() * 15
      };
      this.particles.push(particle);
    }
  }

  private createSpotifyBars() {
    for (let i = 0; i < 30; i++) {
      this.spotifyBars.push({
        height: Math.random() * 80 + 20,
        delay: Math.random() * 2000
      });
    }
  }

  private startCelebrationAnimations() {
    // Corazones más frecuentes
    const heartInterval = setInterval(() => {
      this.addCelebrationHeart();
    }, 800);

    // Destellos más frecuentes
    const sparkleInterval = setInterval(() => {
      this.addCelebrationSparkle();
    }, 1200);

    // Fuegos artificiales
    const fireworkInterval = setInterval(() => {
      this.addFirework();
    }, 2000);

    // Confeti
    const confettiInterval = setInterval(() => {
      this.addConfetti();
    }, 300);

    // Limpiar elementos antiguos
    const cleanupInterval = setInterval(() => {
      this.hearts = this.hearts.filter(heart =>
        Date.now() - heart.id < 8000
      );
      this.sparkles = this.sparkles.filter(sparkle =>
        Date.now() - sparkle.id < 2500
      );
      this.fireworks = this.fireworks.filter(firework =>
        Date.now() - firework.id < 2000
      );
      this.confettiPieces = this.confettiPieces.filter(confetti =>
        Date.now() - confetti.id < 4000
      );
    }, 1000);

    this.intervals.push(
      heartInterval as unknown as number,
      sparkleInterval as unknown as number,
      fireworkInterval as unknown as number,
      confettiInterval as unknown as number,
      cleanupInterval as unknown as number
    );
  }

  private addCelebrationHeart() {
    const heart: Heart = {
      id: Date.now() + this.heartIdCounter++,
      emoji: this.heartEmojis[Math.floor(Math.random() * this.heartEmojis.length)],
      left: Math.random() * 100,
      delay: Math.random() * 3,
      randomX: (Math.random() - 0.5) * 400,
      size: Math.random() * 2 + 1
    };

    this.hearts.push(heart);
  }

  private addCelebrationSparkle() {
    const sparkle: Sparkle = {
      id: Date.now() + this.sparkleIdCounter++,
      emoji: this.sparkleEmojis[Math.floor(Math.random() * this.sparkleEmojis.length)],
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2.5
    };

    this.sparkles.push(sparkle);
  }

  private addFirework() {
    const firework: Firework = {
      id: Date.now() + this.fireworkIdCounter++,
      x: Math.random() * 100,
      y: Math.random() * 60 + 20,
      color: this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)]
    };

    this.fireworks.push(firework);
  }

  private addConfetti() {
    for (let i = 0; i < 3; i++) {
      const confetti = {
        id: Date.now() + Math.random(),
        left: Math.random() * 100,
        color: this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)],
        delay: Math.random() * 2
      };
      this.confettiPieces.push(confetti);
    }
  }

  private startTextRotations() {
    let phraseIndex = 0;
    let messageIndex = 0;

    const phraseInterval = setInterval(() => {
      phraseIndex = (phraseIndex + 1) % this.romanticPhrases.length;
      this.currentPhrase.set(this.romanticPhrases[phraseIndex]);
    }, 10000);

    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % this.additionalMessages.length;
      this.currentAdditionalMessage.set(this.additionalMessages[messageIndex]);
    }, 8000);

    this.intervals.push(
      phraseInterval as unknown as number,
      messageInterval as unknown as number
    );
  }
}
