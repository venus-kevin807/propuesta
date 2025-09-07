// pregunta.component.ts
import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

@Component({
  selector: 'app-pregunta',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pregunta-container" [class.loaded]="isLoaded()">
      <!-- Partículas de fondo -->
      <div class="particles">
        @for (particle of particles; track particle.id) {
          <div
            class="particle"
            [style.left.%]="particle.left"
            [style.top.%]="particle.top"
            [style.width.px]="particle.size"
            [style.height.px]="particle.size"
            [style.opacity]="particle.opacity"
            [style.animation-delay.s]="particle.delay"
          ></div>
        }
      </div>

      <!-- Efecto aurora -->
      <div class="aurora"></div>

      <div class="content-wrapper">
        <!-- Header elegante -->
        <div class="elegant-header">
          <div class="crown">👑</div>
          <div class="divider"></div>
        </div>

        <!-- La gran pregunta -->
        <div class="question-container">
          <div class="quote-mark">"</div>
          <h1 class="main-question">
            <span class="question-word">¿Quieres&nbsp;</span>
            <span class="question-word delay-1">ser&nbsp;</span>
            <span class="question-word delay-2">mi&nbsp;</span>
            <span class="highlight-word">novia?</span>
          </h1>
          <div class="quote-mark closing">"</div>
        </div>

        <!-- Mensaje romántico -->
        <div class="romantic-message">
          <p class="message-text">{{ currentMessage() }}</p>
        </div>

        <!-- Botones de respuesta -->
        <div class="buttons-container">
          <!-- Botón SÍ -->
          <button
            class="btn-yes"
            (click)="handleYesClick()"
            [disabled]="isNavigating()"
            [class.loading]="isNavigating()"
          >
            <div class="btn-bg"></div>
            <span class="btn-text">
              @if (isNavigating()) {
                <span class="loading-spinner"></span>
                ¡Celebrando!
              } @else {
                <span class="btn-icon">💕</span>
                ¡SÍ!
                <span class="btn-icon">💕</span>
              }
            </span>
            <div class="btn-shine"></div>
          </button>

          <!-- Botón NO (juguetón) -->

          <button
            #noButton
            class="btn-no"
            [class.escaped]="noButtonEscaped()"
            [class.hidden]="noButtonHidden()"
            [class.tiny]="noButtonTiny()"
            [style.left.px]="noButtonPosition().x"
            [style.top.px]="noButtonPosition().y"
            (click)="onNoButtonAttempt()"
            (touchstart)="onNoButtonAttempt()"
          >
            <span class="btn-text">
              {{ currentNoText() }}
            </span>
          </button>
        </div>

        <!-- Mensaje travieso -->
        @if (noButtonAttempts() > 0) {
          <div class="mischief-message" [class.show]="showMischiefMessage()">
            <p>{{ currentMischiefMessage() }}</p>
          </div>
        }

        <!-- Footer elegante -->
        <div class="elegant-footer">
          <div class="divider"></div>
          <div class="footer-text">Con todo mi amor y esperanza 💖</div>
        </div>
      </div>

      <!-- Corazones premium -->
      <div class="hearts">
        @for (heart of hearts; track heart.id) {
          <span
            class="heart"
            [style.left.%]="heart.left"
            [style.animation-delay.s]="heart.delay"
            [style.--random-x.px]="heart.randomX"
            [style.font-size.rem]="heart.size"
          >
            {{ heart.emoji }}
          </span>
        }
      </div>

      <!-- Destellos premium -->
      <div class="sparkles">
        @for (sparkle of sparkles; track sparkle.id) {
          <span
            class="sparkle"
            [style.left.%]="sparkle.left"
            [style.top.%]="sparkle.top"
            [style.animation-delay.s]="sparkle.delay"
          >
            {{ sparkle.emoji }}
          </span>
        }
      </div>

      <div class="love-quote">
        <span class="quote-icon">💕</span>
        "{{ currentQuote() }}"
        <span class="quote-icon">💕</span>
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

    .pregunta-container {
      text-align: center;
      padding: 0;
      background:
        radial-gradient(ellipse at top, rgba(220, 20, 60, 0.8) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(138, 43, 226, 0.8) 0%, transparent 50%),
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

    .pregunta-container.loaded {
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
      background: radial-gradient(circle, rgba(255,192,203,0.8), rgba(255,105,180,0.3));
      border-radius: 50%;
      animation: particleFloat 20s infinite linear;
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
        transform: translateY(-10vh) translateX(50px) rotate(360deg);
        opacity: 0;
      }
    }

    .aurora {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background:
        linear-gradient(90deg,
          transparent,
          rgba(220, 20, 60, 0.15),
          rgba(255, 20, 147, 0.15),
          rgba(138, 43, 226, 0.15),
          transparent
        );
      animation: aurora 8s ease-in-out infinite;
      z-index: 1;
    }

    @keyframes aurora {
      0%, 100% { opacity: 0.3; transform: translateX(-100%); }
      50% { opacity: 0.8; transform: translateX(100%); }
    }

    .content-wrapper {
      position: relative;
      z-index: 3;
      backdrop-filter: blur(20px) saturate(180%);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 40px;
      padding: 4rem 3rem;
      max-width: 500px;
      width: 90%;
      box-shadow:
        0 25px 50px rgba(0, 0, 0, 0.2),
        0 0 0 1px rgba(255, 255, 255, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      animation: contentAppear 2s ease-out;
    }

    @keyframes contentAppear {
      0% {
        opacity: 0;
        transform: translateY(100px) scale(0.8);
        filter: blur(10px);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
      }
    }

    .elegant-header {
      margin-bottom: 2rem;
      animation: headerSlide 1.5s ease-out 0.5s both;
    }

    @keyframes headerSlide {
      from { opacity: 0; transform: translateY(-30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .crown {
      font-size: 2rem;
      margin-bottom: 1rem;
      filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
      animation: crownFloat 3s ease-in-out infinite;
    }

    @keyframes crownFloat {
      0%, 100% { transform: translateY(0) rotate(-5deg); }
      50% { transform: translateY(-10px) rotate(5deg); }
    }

    .divider {
      width: 60px;
      height: 1px;
      background: linear-gradient(90deg, transparent, #ff69b4, transparent);
      margin: 0 auto;
      position: relative;
    }

    .question-container {
      position: relative;
      margin: 3rem 0;
      animation: questionReveal 2s ease-out 1s both;
    }

    @keyframes questionReveal {
      from { opacity: 0; transform: scale(0.8) rotateY(20deg); }
      to { opacity: 1; transform: scale(1) rotateY(0deg); }
    }

    .quote-mark {
      font-family: 'Cormorant Garamond', serif;
      font-size: 4rem;
      color: rgba(255, 105, 180, 0.4);
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

    .main-question {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2rem, 6vw, 3.5rem);
      font-weight: 600;
      color: #fff;
      margin: 2rem 0;
      line-height: 1.3;
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
    }

    .question-word {
      display: inline-block;
      animation: wordAppear 0.8s ease-out both;
    }

    .question-word.delay-1 {
      animation-delay: 0.2s;
    }

    .question-word.delay-2 {
      animation-delay: 0.4s;
    }

    .highlight-word {
      display: inline-block;
      background: linear-gradient(45deg, #ff69b4, #ff1493, #dc143c, #ff69b4);
      background-size: 300% 300%;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: wordAppear 0.8s ease-out 0.6s both, gradientMove 3s ease-in-out infinite 1.4s;
      font-size: 1.1em;
      font-weight: 700;
    }

    @keyframes wordAppear {
      from {
        opacity: 0;
        transform: translateY(30px) scale(0.8);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes gradientMove {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    .romantic-message {
      margin: 2rem 0;
      animation: messageSlide 1.5s ease-out 1.5s both;
    }

    @keyframes messageSlide {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .message-text {
      color: rgba(255, 255, 255, 0.9);
      font-size: clamp(1rem, 3vw, 1.2rem);
      font-style: italic;
      line-height: 1.6;
      margin: 0;
    }

    .buttons-container {
      display: flex;
      gap: 2rem;
      justify-content: center;
      align-items: center;
      margin: 3rem 0;
      position: relative;
      min-height: 80px;
      animation: buttonsAppear 1.5s ease-out 2s both;
    }

    @keyframes buttonsAppear {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .btn-yes {
      background: transparent;
      color: white;
      padding: 1.2rem 3rem;
      border-radius: 60px;
      font-size: clamp(1rem, 3vw, 1.2rem);
      cursor: pointer;
      border: 2px solid rgba(255, 105, 180, 0.3);
      font-weight: 600;
      font-family: 'Poppins', sans-serif;
      letter-spacing: 1px;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      z-index: 10;
    }

    .btn-yes .btn-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, #ff69b4, #ff1493, #dc143c, #ff69b4);
      background-size: 400% 400%;
      animation: gradientShift 4s ease infinite;
      opacity: 0;
      transition: opacity 0.5s ease;
      z-index: 1;
    }

    @keyframes gradientShift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    .btn-yes .btn-text {
      position: relative;
      z-index: 3;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      justify-content: center;
    }

    .btn-yes .btn-icon {
      font-size: 1.2em;
      animation: iconPulse 1.5s ease-in-out infinite;
    }

    @keyframes iconPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }

    .btn-yes .btn-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent);
      transition: left 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 2;
    }

    .btn-yes:hover .btn-bg {
      opacity: 1;
    }

    .btn-yes:hover .btn-shine {
      left: 100%;
    }

    .btn-yes:hover {
      transform: translateY(-5px) scale(1.05);
      box-shadow:
        0 20px 40px rgba(255, 105, 180, 0.3),
        0 0 30px rgba(255, 105, 180, 0.5);
      border-color: rgba(255, 105, 180, 0.6);
    }

    .btn-no {
      background: rgba(128, 128, 128, 0.1);
      color: rgba(255, 255, 255, 0.7);
      padding: 0.8rem 2rem;
      border-radius: 40px;
      font-size: 0.9rem;
      cursor: pointer;
      border: 1px solid rgba(128, 128, 128, 0.3);
      font-weight: 400;
      font-family: 'Poppins', sans-serif;
      transition: all 0.3s ease;
      position: absolute;
      right: 0;
      z-index: 5;
    }

   .btn-no.escaped {
  transform: translate(20px, -20px) rotate(5deg);
}

.btn-no.hidden {
  opacity: 0;
  pointer-events: none;
}

.btn-no.tiny {
  transform: scale(0.7);
}

.mischief-message {
  margin-top: 1.5rem;
  font-size: 1.1rem;
  color: #555;
  font-style: italic;
  animation: fadeInOut 2s ease forwards;
}

    @keyframes escapeAnimation {
      0% { transform: translateX(0) translateY(0) rotate(0deg) scale(1); }
      25% { transform: translateX(-20px) translateY(-20px) rotate(-10deg) scale(0.9); }
      50% { transform: translateX(30px) translateY(-40px) rotate(15deg) scale(0.8); }
      75% { transform: translateX(-40px) translateY(-10px) rotate(-20deg) scale(0.7); }
      100% { transform: translateX(var(--escape-x, 60px)) translateY(var(--escape-y, -60px)) rotate(25deg) scale(0.6); }
    }

    @keyframes fadeOut {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(0.5); }
    }

    @keyframes shrinkAway {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(0.1) rotate(180deg); opacity: 0.5; }
      100% { transform: scale(0.01) rotate(360deg); opacity: 0; }
    }

    .mischief-message {
      position: absolute;
      top: -50px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 105, 180, 0.1);
      backdrop-filter: blur(10px);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      border: 1px solid rgba(255, 105, 180, 0.3);
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }

    .mischief-message.show {
      opacity: 1;
      animation: messagePopUp 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    @keyframes messagePopUp {
      0% { transform: translateX(-50%) translateY(20px) scale(0.5); opacity: 0; }
      100% { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }
    }

    .mischief-message p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.8rem;
      margin: 0;
      white-space: nowrap;
    }

    .loading-spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 0.5rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .elegant-footer {
      margin-top: 3rem;
      animation: footerFade 2s ease-out 2.5s both;
    }

    @keyframes footerFade {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .footer-text {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.9rem;
      font-style: italic;
      margin-top: 1rem;
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

    .heart {
      position: absolute;
      animation: floatHearts 12s infinite linear;
      opacity: 0;
      user-select: none;
      filter: drop-shadow(0 0 5px rgba(255, 105, 180, 0.5));
    }

    @keyframes floatHearts {
      0% {
        transform: translateY(100vh) translateX(0) rotate(0deg) scale(0.5);
        opacity: 0;
      }
      5% {
        opacity: 0.8;
      }
      95% {
        opacity: 0.8;
      }
      100% {
        transform: translateY(-20vh) translateX(var(--random-x)) rotate(360deg) scale(1.5);
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

    .sparkle {
      position: absolute;
      color: #ff69b4;
      animation: sparkleElegant 3s infinite;
      user-select: none;
      filter: drop-shadow(0 0 10px rgba(255, 105, 180, 0.5));
    }

    @keyframes sparkleElegant {
      0%, 100% {
        opacity: 0;
        transform: scale(0) rotate(0deg);
      }
      25% {
        opacity: 0.8;
        transform: scale(0.8) rotate(90deg);
      }
      50% {
        opacity: 1;
        transform: scale(1.2) rotate(180deg);
      }
      75% {
        opacity: 0.8;
        transform: scale(0.8) rotate(270deg);
      }
    }

    .love-quote {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(255, 255, 255, 0.7);
      font-style: italic;
      font-size: 1rem;
      text-align: center;
      z-index: 3;
      animation: quotePulse 4s ease-in-out infinite;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    @keyframes quotePulse {
      0%, 100% { opacity: 0.7; }
      50% { opacity: 1; }
    }

    .quote-icon {
      animation: iconFloat 3s ease-in-out infinite;
    }

    .quote-icon:last-child {
      animation-delay: 1.5s;
    }

    @keyframes iconFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }

    @media (max-width: 768px) {
      .buttons-container {
        flex-direction: column;
        gap: 1.5rem;
        min-height: 140px;
      }

      .btn-no {
        position: relative;
        right: auto;
      }
    }

    @media (max-width: 480px) {
      .content-wrapper {
        padding: 3rem 2rem;
        margin: 1rem;
      }

      .quote-mark {
        font-size: 3rem;
        left: -20px;
      }

      .quote-mark.closing {
        right: -20px;
      }

      .buttons-container {
        gap: 1rem;
        min-height: 120px;
      }

      .btn-yes {
        padding: 1rem 2rem;
      }

      .btn-no {
        padding: 0.7rem 1.5rem;
      }
    }
  `]
})
export class PreguntaComponent implements OnInit, OnDestroy {
  private router = inject(Router);

  hearts: Heart[] = [];
  sparkles: Sparkle[] = [];
  particles: FloatingParticle[] = [];

  isLoaded = signal(false);
  isNavigating = signal(false);

  // Estados del botón NO
  noButtonEscaped = signal(false);
  noButtonHidden = signal(false);
  noButtonTiny = signal(false);
  noButtonAttempts = signal(0);
  showMischiefMessage = signal(false);

  noButtonPosition = signal({ x: 0, y: 0 });

  private romanticMessages = [
    "Después de todo lo que hemos vivido juntos, mi corazón ya sabe la respuesta... 💕",
    "Cada día a tu lado me confirma que eres la persona con quien quiero compartir mi vida 🌹",
    "Tu sonrisa es la razón de mis mejores días, y quiero verla para siempre 💖"
  ];

  currentMessage = signal(this.romanticMessages[0]);

  private noButtonTexts = [
    "No",
    "No...",
    "¿No?",
    "Por qué no?",
    "Que no ome",
    "Nopi",
    "Noporolo",
    "Ño",
    "Decí que si ome",
  ];

  currentNoText = signal(this.noButtonTexts[0]);

  private mischiefMessages = [
    "Ese botón está un poco roto",
    "parece que no funciona",
    "No me amas?",
    "Esse botón no funciona mija",
    "Solo funciona el otro botón",
  ];

  currentMischiefMessage = signal(this.mischiefMessages[0]);

  private loveQuotes = [
    "Eres mi respuesta a todas las preguntas del corazón",
    "Contigo, cada momento se vuelve eterno",
    "Mi amor por ti crece con cada latido",
    "Eres la melodía que mi alma siempre quiso escuchar",
    "En tus ojos encontré mi hogar"
  ];

  currentQuote = signal(this.loveQuotes[0]);

  private heartEmojis = ['💖', '💕', '💗', '💓', '💘', '💝', '🤍', '💜'];
  private sparkleEmojis = ['✨', '⭐', '💫', '🌟', '💎'];

  private intervals: number[] = [];
  private heartIdCounter = 0;
  private sparkleIdCounter = 0;
  private particleIdCounter = 0;

  ngOnInit() {
    // Cargar con delay para la animación
    setTimeout(() => {
      this.isLoaded.set(true);
    }, 100);

    this.createParticles();
    this.startAnimations();
    this.startTextRotations();
  }

  ngOnDestroy() {
    this.intervals.forEach(interval => clearInterval(interval));
  }

  handleYesClick() {
    if (this.isNavigating()) return;

    this.isNavigating.set(true);

    // Crear explosión de corazones
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        this.addHeart();
      }, i * 100);
    }

    // Navegar al componente de celebración
    setTimeout(() => {
      this.router.navigate(['/celebracion']);
    }, 2000);
  }

  onNoButtonAttempt() {
    const attempts = this.noButtonAttempts();
    this.noButtonAttempts.set(attempts + 1);

    // Mostrar mensaje travieso
    this.currentMischiefMessage.set(
      this.mischiefMessages[Math.min(attempts, this.mischiefMessages.length - 1)]
    );
    this.showMischiefMessage.set(true);
    setTimeout(() => this.showMischiefMessage.set(false), 2000);

    // Cambiar texto del botón
    this.currentNoText.set(
      this.noButtonTexts[Math.min(attempts + 1, this.noButtonTexts.length - 1)]
    );

    // Diferentes comportamientos según intentos
    if (attempts === 0) {
      this.escapeButton();
    } else if (attempts === 1) {
      this.escapeButton(true);
    } else if (attempts === 2) {
      this.noButtonTiny.set(true);
      this.escapeButton(true);
    } else if (attempts >= 3) {
      this.noButtonHidden.set(true);
      setTimeout(() => {
        this.noButtonHidden.set(false);
        this.noButtonTiny.set(false);
        this.escapeButton(true);
      }, 1500);
    }
  }

  // Movimiento del botón
  private escapeButton(far: boolean = false) {
    this.noButtonEscaped.set(true);

    const container = document.querySelector('.buttons-container');
    if (container) {
      const rect = container.getBoundingClientRect();
      const maxX = far ? rect.width - 100 : rect.width - 50;
      const maxY = far ? rect.height - 60 : rect.height - 40;

      const newX = (Math.random() * maxX) - maxX / 2;
      const newY = (Math.random() * maxY) - maxY / 2;

      this.noButtonPosition.set({ x: newX, y: newY });
    }

    setTimeout(() => {
      this.noButtonEscaped.set(false);
    }, 500);
  }

  onNoButtonClick() {
    // Si logran hacer click (cosa que no debería pasar), mover el botón
    this.escapeButton(true);
    this.noButtonAttempts.set(this.noButtonAttempts() + 1);
  }


  private createParticles() {
    for (let i = 0; i < 15; i++) {
      const particle: FloatingParticle = {
        id: this.particleIdCounter++,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        delay: Math.random() * 20
      };
      this.particles.push(particle);
    }
  }

  private startAnimations() {
    const heartInterval = setInterval(() => {
      this.addHeart();
    }, 1500);

    const sparkleInterval = setInterval(() => {
      this.addSparkle();
    }, 2000);

    const cleanupInterval = setInterval(() => {
      this.hearts = this.hearts.filter(heart =>
        Date.now() - heart.id < 12000
      );
      this.sparkles = this.sparkles.filter(sparkle =>
        Date.now() - sparkle.id < 3000
      );
    }, 1000);

    this.intervals.push(
      heartInterval as unknown as number,
      sparkleInterval as unknown as number,
      cleanupInterval as unknown as number
    );
  }

  private addHeart() {
    const heart: Heart = {
      id: Date.now() + this.heartIdCounter++,
      emoji: this.heartEmojis[Math.floor(Math.random() * this.heartEmojis.length)],
      left: Math.random() * 100,
      delay: Math.random() * 3,
      randomX: (Math.random() - 0.5) * 300,
      size: Math.random() * 1.5 + 0.8
    };

    this.hearts.push(heart);
  }

  private addSparkle() {
    const sparkle: Sparkle = {
      id: Date.now() + this.sparkleIdCounter++,
      emoji: this.sparkleEmojis[Math.floor(Math.random() * this.sparkleEmojis.length)],
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3
    };

    this.sparkles.push(sparkle);
  }

  private startTextRotations() {
    let messageIndex = 0;
    let quoteIndex = 0;

    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % this.romanticMessages.length;
      this.currentMessage.set(this.romanticMessages[messageIndex]);
    }, 8000);

    const quoteInterval = setInterval(() => {
      quoteIndex = (quoteIndex + 1) % this.loveQuotes.length;
      this.currentQuote.set(this.loveQuotes[quoteIndex]);
    }, 6000);

    this.intervals.push(
      messageInterval as unknown as number,
      quoteInterval as unknown as number
    );
  }
}
