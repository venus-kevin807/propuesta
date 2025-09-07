// welcome.component.ts
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
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="welcome-container" [class.loaded]="isLoaded()">
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
          <div class="divider"></div>
        </div>

        <h1 class="title">
          <span class="title-word">Hola</span>
          <span class="name-container">
            <span class="name">Mari</span>
          </span>
        </h1>

        <div class="subtitle-container">
          <div class="quote-mark">"</div>
          <p class="subtitle">{{ currentSubtitle() }}</p>
          <div class="quote-mark closing">"</div>
        </div>

        <button
          class="btn-next"
          (click)="navigateToStory()"
          [disabled]="isNavigating()"
          [class.loading]="isNavigating()"
        >
          <div class="btn-bg"></div>
          <span class="btn-text">
            @if (isNavigating()) {
              <span class="loading-spinner"></span>
              Preparando...
            } @else {
              <span class="btn-icon">✨</span>
              Comenzar
              <span class="btn-icon">✨</span>
            }
          </span>
          <div class="btn-shine"></div>
        </button>

        <!-- Footer elegante -->
        <div class="elegant-footer">
          <div class="divider"></div>
          <div class="footer-text">Con todo mi amor</div>
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

    .welcome-container {
      text-align: center;
      padding: 0;
      background:
        radial-gradient(ellipse at top, rgba(138, 43, 226, 0.8) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(25, 25, 112, 0.8) 0%, transparent 50%),
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

    .welcome-container.loaded {
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
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background:
        linear-gradient(90deg,
          transparent,
          rgba(138, 43, 226, 0.1),
          rgba(255, 20, 147, 0.1),
          rgba(0, 191, 255, 0.1),
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
      max-width: 450px;
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
    }

    .divider {
      width: 60px;
      height: 1px;
      background: linear-gradient(90deg, transparent, #ffd700, transparent);
      margin: 0 auto;
      position: relative;
    }

    .divider::before {
      position: absolute;
      top: -8px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(15, 15, 35, 0.8);
      padding: 0 5px;
      font-size: 0.8rem;
    }

    .title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2.5rem, 7vw, 4rem);
      font-weight: 400;
      color: #fff;
      margin: 2rem 0;
      line-height: 1.2;
      animation: titleGlow 3s ease-in-out infinite;
    }

    @keyframes titleGlow {
      0%, 100% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
      50% { text-shadow: 0 0 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 215, 0, 0.3); }
    }

    .title-word {
      display: block;
      font-size: 0.7em;
      color: rgba(255, 255, 255, 0.9);
      animation: wordFade 1.5s ease-out 1s both;
    }

    @keyframes wordFade {
      from { opacity: 0; transform: translateX(-50px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .name-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .name {
      background: linear-gradient(45deg, #ffd700, #ff6b6b, #4ecdc4, #ffd700);
      background-size: 300% 300%;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientMove 3s ease-in-out infinite;
    }

    @keyframes gradientMove {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    @keyframes namePulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .heart-accent {
      font-size: 0.8em;
      animation: heartBeat 1.5s ease-in-out infinite;
    }

    @keyframes heartBeat {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }

    @keyframes glowRotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
    }

    .subtitle-container {
      position: relative;
      margin: 3rem 0;
      animation: subtitleReveal 2s ease-out 2s both;
    }

    @keyframes subtitleReveal {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }

    .quote-mark {
      font-family: 'Cormorant Garamond', serif;
      font-size: 4rem;
      color: rgba(255, 215, 0, 0.3);
      line-height: 0;
      position: absolute;
      top: -10px;
      left: -20px;
    }

    .quote-mark.closing {
      left: auto;
      right: -20px;
      top: 20px;
      transform: rotate(180deg);
    }

    .subtitle {
      color: rgba(255, 255, 255, 0.9);
      font-size: clamp(1.1rem, 3.5vw, 1.4rem);
      font-weight: 300;
      line-height: 1.6;
      margin: 0;
      padding: 0 2rem;
      font-style: italic;
    }

    .btn-next {
      background: transparent;
      color: white;
      padding: 1.2rem 3rem;
      border-radius: 60px;
      font-size: clamp(1rem, 3vw, 1.1rem);
      cursor: pointer;
      border: 2px solid rgba(255, 255, 255, 0.2);
      text-decoration: none;
      font-weight: 500;
      font-family: 'Poppins', sans-serif;
      letter-spacing: 1px;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      margin: 2rem 0;
      animation: buttonMaterialize 2s ease-out 2.5s both;
    }

    @keyframes buttonMaterialize {
      from {
        opacity: 0;
        transform: translateY(50px) scale(0.8);
        filter: blur(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
      }
    }

    .btn-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c);
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

    .btn-text {
      position: relative;
      z-index: 3;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      justify-content: center;
    }

    .btn-icon {
      font-size: 1.2em;
      animation: iconTwinkle 2s ease-in-out infinite;
    }

    @keyframes iconTwinkle {
      0%, 100% { opacity: 0.7; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.2); }
    }

    .btn-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent);
      transition: left 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 2;
    }

    .btn-next:hover .btn-bg {
      opacity: 1;
    }

    .btn-next:hover .btn-shine {
      left: 100%;
    }

    .btn-next:hover {
      transform: translateY(-5px) scale(1.05);
      box-shadow:
        0 20px 40px rgba(0, 0, 0, 0.3),
        0 0 30px rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.4);
    }

    .btn-next:active {
      transform: translateY(-2px) scale(1.02);
    }

    .btn-next:disabled,
    .btn-next.loading {
      opacity: 0.8;
      cursor: not-allowed;
      transform: none;
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
      animation: footerFade 2s ease-out 3s both;
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
      filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
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
      color: #ffd700;
      animation: sparkleElegant 3s infinite;
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

    @media (max-width: 480px) {
      .content-wrapper {
        padding: 3rem 2rem;
        margin: 1rem;
      }

      .quote-mark {
        font-size: 3rem;
        left: -10px;
      }

      .quote-mark.closing {
        right: -10px;
      }

      .subtitle {
        padding: 0 1rem;
      }
    }
  `]
})
export class WelcomeComponent implements OnInit, OnDestroy {
  private router = inject(Router);

  hearts: Heart[] = [];
  sparkles: Sparkle[] = [];
  particles: FloatingParticle[] = [];

  isLoaded = signal(false);
  isNavigating = signal(false);

  private subtitles = [
    "Mi corazón tiene algo que decirte..."
  ];

  currentSubtitle = signal(this.subtitles[0]);

  private loveQuotes = [
    "Cada momento contigo es un tesoro",
    "Eres la razón de mis sonrisas más sinceras",
    "Contigo el mundo se vuelve extraordinario",
    "Mi corazón late al ritmo de tu nombre",
    "Eres mi persona favorita en todo el universo"
  ];

  currentQuote = signal(this.loveQuotes[0]);

  private heartEmojis = ['💖', '💕', '💗', '💓', '💘', '💝', '🤍', '💜'];
  private sparkleEmojis = ['✨', '⭐', '💫', '🌟'];

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

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/200x200/667eea/FFFFFF?text=🐕';
  }

  navigateToStory() {
    if (this.isNavigating()) return;

    this.isNavigating.set(true);

    setTimeout(() => {
      this.router.navigate(['/me-gusta']);
    }, 1500);
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
    }, 1200);

    const sparkleInterval = setInterval(() => {
      this.addSparkle();
    }, 1500);

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
    let subtitleIndex = 0;
    let quoteIndex = 0;

    const subtitleInterval = setInterval(() => {
      subtitleIndex = (subtitleIndex + 1) % this.subtitles.length;
      this.currentSubtitle.set(this.subtitles[subtitleIndex]);
    }, 5000);

    const quoteInterval = setInterval(() => {
    this.intervals.push(
      subtitleInterval as unknown as number,
      quoteInterval as unknown as number
    );
      this.currentQuote.set(this.loveQuotes[quoteIndex]);
    }, 6000);

    this.intervals.push(
      subtitleInterval as unknown as number,
      quoteInterval as unknown as number
    );
  }
}
