// me-gusta.component.ts
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

interface LikeItem {
  id: number;
  text: string;
  icon: string;
  isVisible: boolean;
  animationDelay: number;
}

@Component({
  selector: 'app-me-gusta',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="me-gusta-container" [class.loaded]="isLoaded()">
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
          <div class="heart-crown">💖</div>
          <div class="divider"></div>
        </div>

        <h1 class="title">
          <span class="title-word">Todo lo que</span>
          <span class="highlight-word">me enamora</span>
          <span class="title-word">de ti</span>
        </h1>

        <div class="subtitle-container">
          <div class="quote-mark">"</div>
          <p class="subtitle">{{ currentSubtitle() }}</p>
          <div class="quote-mark closing">"</div>
        </div>

        <!-- Lista animada de cosas que me gustan -->

        <div class="likes-container"
             [style.max-height.px]="dynamicHeight()">
          @for (item of likeItems; track item.id) {
            <div
              class="like-item"
              [class.visible]="item.isVisible"
              [style.animation-delay.s]="item.animationDelay"
            >
              <div class="like-icon">{{ item.icon }}</div>
              <div class="like-text">{{ item.text }}</div>
              <div class="like-shine"></div>
            </div>
          }
        </div>
        <div class="progress-container">
          <div class="progress-bar" [style.width.%]="currentProgress()"></div>
          <div class="progress-text">
            {{ visibleItemsCount() }} de {{ totalItems() }} razones mostradas
          </div>
        </div>

        <div class="controls">
          <button
            class="btn-control"
            (click)="showNextItem()"
            [disabled]="allItemsVisible()"
            [class.disabled]="allItemsVisible()"
          >
            <span class="btn-icon">✨</span>
            <span>Siguiente</span>
          </button>

          <button
            class="btn-control btn-continue"
            (click)="navigateNext()"
            [disabled]="!allItemsVisible() || isNavigating()"
            [class.loading]="isNavigating()"
            [class.ready]="allItemsVisible()"
          >
            @if (isNavigating()) {
              <span class="loading-spinner"></span>
              Preparando...
            } @else if (allItemsVisible()) {
              <span class="btn-icon">💕</span>
              Continuar
            } @else {
              <span class="btn-icon">⏳</span>
              Espera...
            }
          </button>
        </div>

        <!-- Footer elegante -->
        <div class="elegant-footer">
          <div class="divider"></div>
          <div class="footer-text">Cada detalle de ti me enamora</div>
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
        <span class="quote-icon">💝</span>
        "{{ currentQuote() }}"
        <span class="quote-icon">💝</span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
      font-family: 'Playfair Display', serif;
    }

    .me-gusta-container {
      text-align: center;
      padding: 2rem 0;
      background:
        radial-gradient(ellipse at top, rgba(255, 20, 147, 0.6) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(138, 43, 226, 0.6) 0%, transparent 50%),
        linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
      position: relative;
      min-height: 100vh;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      opacity: 0;
      transition: opacity 1s ease-in-out;
      padding-top: 2rem;
    }

    .me-gusta-container.loaded {
      opacity: 1;
    }

    .particles {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }

    .particle {
      position: absolute;
      background: radial-gradient(circle, rgba(255,255,255,0.8), rgba(255,255,255,0.2));
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
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background:
        linear-gradient(90deg,
          transparent,
          rgba(255, 20, 147, 0.1),
          rgba(138, 43, 226, 0.1),
          rgba(255, 105, 180, 0.1),
          transparent
        );
      animation: aurora 10s ease-in-out infinite;
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
      padding: 3rem 2.5rem;
      max-width: 600px;
      width: 90%;
      box-shadow:
        0 25px 50px rgba(0, 0, 0, 0.2),
        0 0 0 1px rgba(255, 255, 255, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      animation: contentAppear 2s ease-out;
      margin-bottom: 2rem;
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

    .heart-crown {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      filter: drop-shadow(0 0 15px rgba(255, 20, 147, 0.6));
      animation: crownPulse 2s ease-in-out infinite;
    }

    @keyframes crownPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .divider {
      width: 80px;
      height: 2px;
      background: linear-gradient(90deg, transparent, #ff69b4, #ff1493, #ff69b4, transparent);
      margin: 0 auto;
      position: relative;
      border-radius: 2px;
    }

    .title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2rem, 6vw, 3.5rem);
      font-weight: 400;
      color: #fff;
      margin: 2rem 0;
      line-height: 1.3;
      animation: titleGlow 3s ease-in-out infinite;
    }

    @keyframes titleGlow {
      0%, 100% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
      50% { text-shadow: 0 0 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 20, 147, 0.4); }
    }

    .title-word {
      display: block;
      font-size: 0.7em;
      color: rgba(255, 255, 255, 0.9);
      animation: wordFade 1.5s ease-out 1s both;
    }

    .highlight-word {
      background: linear-gradient(45deg, #ff69b4, #ff1493, #da70d6, #ff69b4);
      background-size: 300% 300%;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientMove 3s ease-in-out infinite;
      font-size: 1.1em;
      display: block;
      margin: 0.2rem 0;
    }

    @keyframes wordFade {
      from { opacity: 0; transform: translateX(-50px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes gradientMove {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    .subtitle-container {
      position: relative;
      margin: 2rem 0;
      animation: subtitleReveal 2s ease-out 2s both;
    }

    @keyframes subtitleReveal {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }

    .quote-mark {
      font-family: 'Cormorant Garamond', serif;
      font-size: 3rem;
      color: rgba(255, 105, 180, 0.4);
      line-height: 0;
      position: absolute;
      top: -5px;
      left: -15px;
    }

    .quote-mark.closing {
      left: auto;
      right: -15px;
      top: 15px;
      transform: rotate(180deg);
    }

    .subtitle {
      color: rgba(255, 255, 255, 0.9);
      font-size: clamp(1rem, 3vw, 1.2rem);
      font-weight: 300;
      line-height: 1.6;
      margin: 0;
      padding: 0 1.5rem;
      font-style: italic;
    }

.likes-container {
  margin: 2rem 0;
  overflow-y: auto;
  padding: 1rem 0;
  transition: max-height 0.6s ease; /* animación suave */
}


    .likes-container::-webkit-scrollbar {
      width: 6px;
    }

    .likes-container::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
    }

    .likes-container::-webkit-scrollbar-thumb {
      background: rgba(255, 105, 180, 0.5);
      border-radius: 10px;
    }

    .like-item {
      display: flex;
      align-items: center;
      margin: 1rem 0;
      padding: 1rem 1.5rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      opacity: 0;
      transform: translateX(-100px) scale(0.8);
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .like-item.visible {
      opacity: 1;
      transform: translateX(0) scale(1);
    }

    .like-item:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 10px 30px rgba(255, 105, 180, 0.2);
      border-color: rgba(255, 105, 180, 0.3);
    }

    .like-icon {
      font-size: 1.5rem;
      margin-right: 1rem;
      min-width: 40px;
      text-align: center;
      filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
      animation: iconGlow 2s ease-in-out infinite;
    }

    @keyframes iconGlow {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .like-text {
      flex: 1;
      text-align: left;
      color: rgba(255, 255, 255, 0.95);
      font-size: clamp(0.95rem, 2.5vw, 1.1rem);
      font-weight: 400;
      line-height: 1.4;
    }

    .like-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .like-item:hover .like-shine {
      left: 100%;
    }

    .progress-container {
      margin: 2rem 0;
      animation: progressAppear 1s ease-out 3s both;
    }

    @keyframes progressAppear {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .progress-bar {
      height: 4px;
      background: linear-gradient(90deg, #ff69b4, #ff1493);
      border-radius: 2px;
      transition: width 0.8s ease-out;
      margin-bottom: 0.5rem;
      box-shadow: 0 0 10px rgba(255, 20, 147, 0.5);
    }

    .progress-text {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
      font-style: italic;
    }

    .controls {
      display: flex;
      gap: 1rem;
      margin: 2rem 0;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-control {
      background: transparent;
      color: white;
      padding: 0.8rem 2rem;
      border-radius: 50px;
      font-size: 1rem;
      cursor: pointer;
      border: 2px solid rgba(255, 255, 255, 0.2);
      text-decoration: none;
      font-weight: 500;
      font-family: 'Poppins', sans-serif;
      letter-spacing: 0.5px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-control:hover:not(.disabled) {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 15px 35px rgba(255, 105, 180, 0.3);
      border-color: rgba(255, 105, 180, 0.5);
      background: rgba(255, 105, 180, 0.1);
    }

    .btn-continue {
      border-color: rgba(255, 215, 0, 0.3);
    }

    .btn-continue.ready {
      background: linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(255, 105, 180, 0.2));
      border-color: rgba(255, 215, 0, 0.5);
      animation: readyPulse 2s ease-in-out infinite;
    }

    @keyframes readyPulse {
      0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
      50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.6); }
    }

    .btn-control.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-control.loading {
      opacity: 0.8;
      cursor: not-allowed;
    }

    .btn-icon {
      font-size: 1.1em;
    }

    .loading-spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .elegant-footer {
      margin-top: 2rem;
      animation: footerFade 2s ease-out 4s both;
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
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 2;
      pointer-events: none;
    }

    .heart {
      position: absolute;
      animation: floatHearts 15s infinite linear;
      opacity: 0;
      user-select: none;
      filter: drop-shadow(0 0 5px rgba(255, 105, 180, 0.4));
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
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      pointer-events: none;
    }

    .sparkle {
      position: absolute;
      color: #ffd700;
      animation: sparkleElegant 4s infinite;
      user-select: none;
      filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
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
      position: fixed;
      bottom: 1.5rem;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(255, 255, 255, 0.7);
      font-style: italic;
      font-size: 0.95rem;
      text-align: center;
      z-index: 3;
      animation: quotePulse 5s ease-in-out infinite;
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
      .content-wrapper {
        padding: 2.5rem 1.5rem;
        margin: 1rem;
      }

      .likes-container {
        max-height: 350px;
      }

      .like-item {
        padding: 0.8rem 1rem;
        margin: 0.8rem 0;
      }

      .controls {
        flex-direction: column;
        align-items: center;
      }

      .btn-control {
        width: 100%;
        max-width: 250px;
      }
    }

    @media (max-width: 480px) {
      .quote-mark {
        font-size: 2.5rem;
        left: -10px;
      }

      .quote-mark.closing {
        right: -10px;
      }

      .subtitle {
        padding: 0 1rem;
      }

      .love-quote {
        font-size: 0.85rem;
        padding: 0 2rem;
      }
    }
  `]
})
export class MeGustaComponent implements OnInit, OnDestroy {
  private router = inject(Router);

  hearts: Heart[] = [];
  sparkles: Sparkle[] = [];
  particles: FloatingParticle[] = [];
  likeItems: LikeItem[] = [];

  isLoaded = signal(false);
  isNavigating = signal(false);
  currentItemIndex = signal(0);

  private subtitles = [
    "Cada una de estas razones vive en mi corazón...",
    "Son tantas las cosas que me enamoran de ti...",
    "Mi alma encuentra hogar en cada detalle tuyo..."
  ];

  dynamicHeight() {
  const baseHeight = 90; // altura aprox. de un item (px)
  const visible = this.visibleItemsCount();
  return Math.min(visible * baseHeight, 400);
  // crece hasta 400px máximo
}

  currentSubtitle = signal(this.subtitles[0]);

  // Aquí puedes personalizar todas las cosas que te gustan de ella
  private likesData = [
    { text: "Tu sonrisa que ilumina todos mis dias", icon: "😊" },
    { text: "La manera en que tus ojos brillan cuando hablas de algo que amas", icon: "✨" },
    { text: "Tu risa contagiosa que hace que todo valga la pena", icon: "😂" },
    { text: "Cómo eres tan genuina y auténtica en todo lo que haces", icon: "💎" },
    { text: "Tu bondad infinita hacia todos los que te rodean", icon: "🤗" },
    { text: "La paz que siento cuando estoy contigo", icon: "🕊️" },
    { text: "Tu inteligencia y la forma tan bella en que ves el mundo", icon: "🧠" },
    { text: "Cómo me haces sentir especial con los pequeños detalles", icon: "🌟" },
    { text: "Tu fortaleza y valentía para enfrentar cualquier desafío", icon: "💪" },
    { text: "La forma en que cuidas a las personas que amas", icon: "🤲" },
    { text: "Tu creatividad y esa chispa única que te hace ser tú", icon: "🎨" },
    { text: "Cómo tu presencia hace que muera de amor por ti", icon: "🏠" },
    { text: "Tu paciencia conmigo", icon: "⏳" },
    { text: "La energia que radías como si un sol fueras", icon: "🔥" },
    { text: "Tu amor por la vida y cómo me contagias esa energía", icon: "🌻" }
  ];

  private loveQuotes = [
  ];

  currentQuote = signal(this.loveQuotes[0]);

  private heartEmojis = ['💖', '💕', '💗', '💓', '💘', '💝', '🤍', '💜'];
  private sparkleEmojis = ['✨', '⭐', '💫', '🌟', '⚡'];

  private intervals: number[] = [];
  private heartIdCounter = 0;
  private sparkleIdCounter = 0;
  private particleIdCounter = 0;

  ngOnInit() {
    this.initializeLikeItems();

    setTimeout(() => {
      this.isLoaded.set(true);
    }, 100);

    this.createParticles();
    this.startAnimations();
    this.startTextRotations();
    this.autoShowItems();
  }

  ngOnDestroy() {
    this.intervals.forEach(interval => clearInterval(interval));
  }

  private initializeLikeItems() {
    this.likeItems = this.likesData.map((like, index) => ({
      id: index,
      text: like.text,
      icon: like.icon,
      isVisible: false,
      animationDelay: index * 0.2
    }));
  }

  showNextItem() {
    const nextIndex = this.currentItemIndex();
    if (nextIndex < this.likeItems.length) {
      this.likeItems[nextIndex].isVisible = true;
      this.currentItemIndex.set(nextIndex + 1);
    }
  }

  private autoShowItems() {
    // Mostrar automáticamente los primeros 3 elementos
    setTimeout(() => this.showNextItem(), 1000);
    setTimeout(() => this.showNextItem(), 1500);
    setTimeout(() => this.showNextItem(), 2000);
  }

  navigateNext() {
    if (this.isNavigating() || !this.allItemsVisible()) return;

    this.isNavigating.set(true);

    setTimeout(() => {
      this.router.navigate(['/pregunta']); // Cambia por tu ruta
    }, 1500);
  }

  // Getters computados
  visibleItemsCount() {
    return this.likeItems.filter(item => item.isVisible).length;
  }

  totalItems() {
    return this.likeItems.length;
  }

  allItemsVisible() {
    return this.visibleItemsCount() === this.totalItems();
  }

  currentProgress() {
    return (this.visibleItemsCount() / this.totalItems()) * 100;
  }

  private createParticles() {
    for (let i = 0; i < 20; i++) {
      const particle: FloatingParticle = {
        id: this.particleIdCounter++,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.6 + 0.1,
        delay: Math.random() * 20
      };
      this.particles.push(particle);
    }
  }

  private startAnimations() {
    const heartInterval = setInterval(() => {
      this.addHeart();
    }, 1000);

    const sparkleInterval = setInterval(() => {
      this.addSparkle();
    }, 1300);

    const cleanupInterval = setInterval(() => {
      this.hearts = this.hearts.filter(heart =>
        Date.now() - heart.id < 15000
      );
      this.sparkles = this.sparkles.filter(sparkle =>
        Date.now() - sparkle.id < 4000
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
      delay: Math.random() * 4,
      randomX: (Math.random() - 0.5) * 400,
      size: Math.random() * 1.8 + 0.7
    };

    this.hearts.push(heart);
  }

  private addSparkle() {
    const sparkle: Sparkle = {
      id: Date.now() + this.sparkleIdCounter++,
      emoji: this.sparkleEmojis[Math.floor(Math.random() * this.sparkleEmojis.length)],
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 4
    };

    this.sparkles.push(sparkle);
  }

  private startTextRotations() {
    let subtitleIndex = 0;
    let quoteIndex = 0;

    const subtitleInterval = setInterval(() => {
      subtitleIndex = (subtitleIndex + 1) % this.subtitles.length;
      this.currentSubtitle.set(this.subtitles[subtitleIndex]);
    }, 6000);

    const quoteInterval = setInterval(() => {
      quoteIndex = (quoteIndex + 1) % this.loveQuotes.length;
      this.currentQuote.set(this.loveQuotes[quoteIndex]);
    }, 8000);

    this.intervals.push(
      subtitleInterval as unknown as number,
      quoteInterval as unknown as number
    );
  }
}
