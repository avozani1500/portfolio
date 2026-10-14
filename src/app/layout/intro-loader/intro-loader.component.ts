import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, OnDestroy, Output, PLATFORM_ID, ViewChild, isDevMode, signal } from '@angular/core';
import { gsap } from 'gsap';

type IntroState = 'idle' | 'starting' | 'system' | 'silhouette' | 'transforming' | 'revealing-hero' | 'ambient' | 'done' | 'skipped';
export type IntroCompletion = 'completed' | 'skipped' | 'reduced-motion' | 'error';
export const INTRO_STORAGE_KEY = 'natan-portfolio:intro:v2';
export const INTRO_TIMELINE = { boot: 150, build: 1000, silhouette: 300, transform: 1200, reveal: 1450 } as const;
type IntroTimeline = ReturnType<typeof gsap.timeline>;

@Component({
  selector: 'app-intro-loader',
  standalone: true,
  template: `
    @if (visible()) {
      <section #introVisual class="intro-scene intro-loader" [attr.data-state]="state()" aria-label="Introdução visual do portfólio">
        <div class="intro-atmosphere" aria-hidden="true"></div>
        <div class="intro-stage">
          <div class="intro-asset" aria-hidden="true">
            @for (slice of slices; track slice.index) {
              <div class="asset-slice" [style.--slice-top]="slice.top + '%'" [style.--slice-bottom]="slice.bottom + '%'">
                <picture>
                  <source srcset="/assets/brand/intro/digital-human.avif" type="image/avif" />
                  <source srcset="/assets/brand/intro/digital-human.webp" type="image/webp" />
                  <img src="/assets/brand/intro/digital-human.png" alt="" loading="eager" fetchpriority="high" />
                </picture>
              </div>
            }
          </div>
          <svg class="intro-structure" viewBox="0 0 1000 600" aria-hidden="true">
            <g class="tech-pieces">
              <path d="M130 160h170m-120 30h260m-310 30h190m200-70h220m-160 35h290m-360 35h200M120 390h220m-160 32h350m-270 34h170m230-58h210m-120 34h260" />
              <path d="M240 120v120m36-150v210m430-150v180m42-140v220M180 300h130m390 0h150" />
              <path class="tech-grid" d="M305 175h360v250H305zM335 205h300M335 235h300M335 265h300M335 295h300M335 325h300M335 355h300M335 385h300M365 175v250M405 175v250M445 175v250M485 175v250M525 175v250M565 175v250M605 175v250" />
              <circle cx="305" cy="175" r="5" /><circle cx="665" cy="425" r="5" /><circle cx="240" cy="390" r="4" /><circle cx="735" cy="235" r="4" />
            </g>
          </svg>
          <svg #introNameSvg class="intro-name-svg" viewBox="0 0 1000 180" aria-hidden="true">
            <g #transformStrokes class="transform-strokes" aria-hidden="true">
              <path d="M118 58h74m-88 26h98m-112 26h82m65-52h76m-82 26h102m-118 26h84m72-52h92m-104 26h116m-126 26h96" />
              <path d="M142 132h168m24-74h110m-126 26h142m-154 26h122m44-52h144m-158 26h170m-184 26h142" />
              <path d="M600 58h116m-132 26h148m-164 26h132m-104 22h170" />
              <path d="M238 44v92m92-92v92m182-92v92m116-92v92" />
              <rect x="112" y="52" width="14" height="7" /><rect x="420" y="96" width="18" height="8" />
              <rect x="744" y="68" width="22" height="7" /><circle cx="560" cy="118" r="4" />
            </g>
            <g #introName id="intro-name">
              <text x="500" y="115" text-anchor="middle">Natan Avozani</text>
            </g>
          </svg>
          <div class="intro-identity" aria-hidden="true">
            <p #introRole>Full Stack Software Developer</p>
          </div>
        </div>
        <button #skipButton class="intro-skip" type="button" aria-label="Pular introdução" (click)="skip()">Pular</button>
      </section>
    }
  `,
  styles: `
    :host { position: absolute; z-index: 2; inset: 0; display: block; pointer-events: none; }
    .intro-scene { position: absolute; inset: 0; display: grid; place-items: center; overflow: hidden; isolation: isolate; color: var(--color-text); background: transparent; pointer-events: none; }
    .intro-atmosphere, .intro-atmosphere::after { position: absolute; inset: 0; content: ''; pointer-events: none; }
    .intro-atmosphere { z-index: -2; background: transparent; opacity: 1; }
    .intro-atmosphere::after { background: radial-gradient(ellipse at center, color-mix(in srgb, var(--color-page) 18%, transparent), color-mix(in srgb, var(--color-page) 84%, transparent) 78%); }
    .intro-stage { position: relative; width: min(100vw, 100rem); height: min(100vh, 62rem); }
    .intro-asset { position: absolute; inset: 0; display: grid; place-items: center; overflow: hidden; }
    .asset-slice { position: absolute; inset: 0; display: grid; place-items: center; clip-path: inset(var(--slice-top) 0 var(--slice-bottom) 0); opacity: 0; transform-origin: center; will-change: transform, opacity; }
    .asset-slice picture { display: contents; }
    .asset-slice img { display: block; width: min(47rem, 67vw); height: 91%; object-fit: contain; object-position: center; filter: saturate(.72) contrast(1.08) brightness(.92); }
    .intro-structure, .intro-name-svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
    .intro-structure { z-index: 1; opacity: 0; }
    .tech-pieces { fill: none; stroke: color-mix(in srgb, var(--color-accent) 76%, transparent); stroke-width: 1.5; stroke-linecap: square; stroke-dasharray: 8 10; }
    .tech-pieces .tech-grid { stroke: color-mix(in srgb, var(--color-text-muted) 24%, transparent); stroke-width: 1; stroke-dasharray: none; }
    .tech-pieces circle { fill: var(--color-accent); stroke: none; }
    .intro-name-svg { z-index: 3; opacity: 0; clip-path: inset(0 100% 0 0); }
    .transform-strokes { fill: none; stroke: color-mix(in srgb, var(--color-text) 78%, var(--color-accent)); stroke-width: 3; stroke-linecap: square; stroke-linejoin: bevel; opacity: 0; transform-origin: 500px 90px; }
    .transform-strokes rect, .transform-strokes circle { fill: var(--color-accent); stroke: none; }
    #intro-name { transform-origin: 500px 90px; }
    #intro-name text { fill: var(--color-text); font-family: var(--font-sans, Arial, sans-serif); font-size: 86px; font-weight: 750; letter-spacing: -4px; }
    .intro-identity { position: absolute; z-index: 4; top: 62%; left: 50%; width: min(48rem, 82vw); transform: translate(-50%, -50%); text-align: center; }
    .intro-identity p { margin: 1rem 0 0; color: var(--color-accent-strong); font-size: clamp(.9rem, 1.7vw, 1.2rem); letter-spacing: .16em; text-transform: uppercase; clip-path: inset(0 100% 0 0); opacity: 0; }
    .intro-scene[data-state='transforming'] .asset-slice { mix-blend-mode: screen; }
    .intro-scene[data-state='ambient'] .intro-asset { filter: saturate(.72) contrast(.96); }
    .intro-scene[data-state='ambient'] .intro-structure { filter: saturate(.72); }
    .intro-scene[data-state='ambient'] .intro-asset,
    .intro-scene[data-state='ambient'] .intro-structure { -webkit-mask-image: radial-gradient(ellipse at 50% 50%, transparent 0%, transparent 34%, #000 62%, #000 100%); mask-image: radial-gradient(ellipse at 50% 50%, transparent 0%, transparent 34%, #000 62%, #000 100%); }
    .intro-scene[data-state='ambient'] .intro-skip { display: none; }
    .intro-skip { position: fixed; right: 1.25rem; bottom: 1.25rem; z-index: 4; pointer-events: auto; padding: .45rem .7rem; border: 1px solid color-mix(in srgb, var(--color-text-muted) 28%, transparent); border-radius: 999px; background: color-mix(in srgb, var(--color-page) 74%, transparent); color: var(--color-text-muted); cursor: pointer; font: inherit; font-size: .74rem; opacity: .78; }
    .intro-skip:hover { border-color: var(--color-accent); color: var(--color-accent); opacity: 1; }
    .intro-skip:focus-visible { outline: 3px solid var(--color-focus); outline-offset: 3px; }
    @media (max-width: 48rem) {
      .intro-stage { height: 100%; }
      .asset-slice img { width: min(27rem, 94vw); height: 76%; }
      .intro-identity { top: 64%; }
      .intro-identity p { font-size: .68rem; letter-spacing: .11em; }
      .intro-skip { right: .75rem; bottom: .75rem; }
    }
    @media (prefers-reduced-motion: reduce) { .intro-scene, .asset-slice, .intro-identity p { transition: none; } }
  `,
})
export class IntroLoaderComponent implements AfterViewInit, OnDestroy {
  @Output() readonly finished = new EventEmitter<IntroCompletion>();
  @ViewChild('skipButton') private skipButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('introVisual') private introVisual?: ElementRef<HTMLElement>;
  @ViewChild('introName') private introName?: ElementRef<SVGGElement>;
  @ViewChild('introNameSvg') private introNameSvg?: ElementRef<SVGSVGElement>;
  @ViewChild('transformStrokes') private transformStrokes?: ElementRef<SVGGElement>;
  @ViewChild('introRole') private introRole?: ElementRef<HTMLElement>;

  protected readonly state = signal<IntroState>('starting');
  protected readonly visible = signal(true);
  protected readonly slices = Array.from({ length: 14 }, (_, index) => ({ index, top: (index * 100) / 14, bottom: ((13 - index) * 100) / 14 }));
  private timeline?: IntroTimeline;
  private stateTimer?: number;
  private startedAt?: number;
  private previousFocus: HTMLElement | null = null;
  private previousOverflow = '';
  private documentSceneActive = false;
  private bootTimer?: number;
  private preparedElements: HTMLElement[] = [];
  private preparedStyles = new Map<HTMLElement, { opacity: string; clipPath: string; transform: string; willChange: string }>();

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      if (!this.shouldRunIntro()) {
        this.releaseSite();
        this.visible.set(false);
        return;
      }
      if (this.prefersReducedMotion()) { this.complete('reduced-motion'); return; }
      this.activateDocumentScene();
      this.startSequence();
    } catch (error) { console.error('[Intro] setup error', error); this.failSafely(); }
  }

  ngOnDestroy(): void { this.killTimeline(); this.restorePreparedElements(); this.restoreDocumentScene(); this.restoreFocus(); }

  protected skip(): void {
    this.killTimeline(); this.state.set('skipped'); this.applyAmbientState(); this.restorePreparedElements(); this.markAsPresented(); this.restoreDocumentScene(); this.finished.emit('skipped'); this.restoreFocus(); this.visible.set(false);
  }

  private startSequence(): void {
    this.previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.startedAt = performance.now(); this.state.set('starting'); this.prepareHero();
    queueMicrotask(() => this.skipButton?.nativeElement.focus({ preventScroll: true }));
    this.timeline = this.createTimeline();
    document.documentElement.classList.remove('intro-preboot');
    document.documentElement.classList.add('intro-running');
    this.timeline.play(0);
    this.bootTimer = window.setTimeout(() => document.documentElement.removeAttribute('data-intro-boot'), 220);
    this.scheduleStateSync();
  }

  private createTimeline(): IntroTimeline {
    const root = this.introVisual?.nativeElement; if (!root) throw new Error('Intro scene root was not found');
    const slices = Array.from(root.querySelectorAll<HTMLElement>('.asset-slice'));
    const name = this.introName?.nativeElement;
    const nameSvg = this.introNameSvg?.nativeElement;
    const transformStrokes = this.transformStrokes?.nativeElement;
    const actualTitle = document.getElementById('introduction-title');
    const role = this.introRole?.nativeElement;
    const actualRole = document.querySelector<HTMLElement>('.hero-role');
    const skipButton = this.skipButton?.nativeElement;
    const leadElements = Array.from(document.querySelectorAll<HTMLElement>('.stage-introduction .lead, .stage-introduction .introduction-meta'));
    const siteElements = Array.from(document.querySelectorAll<HTMLElement>('app-site-header, .home-progress, app-site-footer, .stage:not(.stage-introduction)'));
    const sharedScene = document.querySelector<HTMLElement>('.hero-tech-scene');
    const sharedLines = Array.from(document.querySelectorAll<SVGPathElement>('.hero-tech-lines path:not(.hero-tech-grid)'));
    const sharedGrid = document.querySelector<SVGPathElement>('.hero-tech-grid');
    const sharedFragments = Array.from(document.querySelectorAll<SVGRectElement>('.hero-tech-fragments rect'));
    const sharedNodes = Array.from(document.querySelectorAll<SVGCircleElement>('.hero-tech-nodes circle'));
    const timeline = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });
    const technicalLines = Array.from(root.querySelectorAll('.tech-pieces path:not(.tech-grid)'));
    const grid = root.querySelector<SVGPathElement>('.tech-grid');
    const nodes = Array.from(root.querySelectorAll('.tech-pieces circle'));
    const structureSvg = root.querySelector<SVGSVGElement>('.intro-structure');
    timeline.set(slices, { opacity: 0, x: (index) => index % 2 === 0 ? -42 : 42, y: (index) => (index % 3 - 1) * 4, scaleX: .86, scaleY: .72 }, 0);
    gsap.set(root, { opacity: 1, visibility: 'visible' });
    timeline.set(technicalLines, { opacity: 0, scaleX: .08, x: -18, transformOrigin: 'center' }, 0);
    if (structureSvg) timeline.set(structureSvg, { opacity: .9 }, 0);
    if (grid) timeline.set(grid, { opacity: 0, scale: .18, transformOrigin: 'center' }, 0);
    timeline.set(nodes, { opacity: 0, scale: .1, transformOrigin: 'center' }, 0);
    if (sharedScene) timeline.set(sharedScene, { opacity: .01 }, 0);
    timeline.set(sharedLines, { opacity: 0, scaleX: .08, transformOrigin: 'center' }, 0);
    if (sharedGrid) timeline.set(sharedGrid, { opacity: 0, scale: .2, transformOrigin: 'center' }, 0);
    timeline.set(sharedFragments, { opacity: 0, scale: .2, transformOrigin: 'center' }, 0);
    timeline.set(sharedNodes, { opacity: 0, scale: .1, transformOrigin: 'center' }, 0);
    timeline.to(nodes.slice(0, 3), { opacity: 1, scale: 1, duration: .22, stagger: .06, ease: 'back.out(2)' }, .15);
    timeline.to(technicalLines.slice(0, 2), { opacity: .72, scaleX: 1, x: 0, duration: .36, stagger: .08, ease: 'power2.out' }, .24);
    timeline.to(technicalLines.slice(2), { opacity: .62, scaleX: 1, x: 0, duration: .5, stagger: .045, ease: 'power2.out' }, .4);
    if (grid) timeline.to(grid, { opacity: .3, scale: 1, duration: .58, ease: 'power2.out' }, .46);
    timeline.to(nodes.slice(3), { opacity: .8, scale: 1, duration: .3, stagger: .07, ease: 'back.out(1.6)' }, .52);
    timeline.to(slices, { opacity: .9, x: 0, y: 0, scaleX: 1, scaleY: 1, duration: .7, stagger: .045, ease: 'power3.out' }, .42);
    if (sharedScene) timeline.to(sharedScene, { opacity: this.heroTechIntroOpacity(), duration: .45, ease: 'power2.out' }, .34);
    timeline.to(sharedNodes.slice(0, 3), { opacity: .75, scale: 1, duration: .22, stagger: .06, ease: 'back.out(2)' }, .2);
    timeline.to(sharedLines, { opacity: .5, scaleX: 1, duration: .48, stagger: .045, ease: 'power2.out' }, .3);
    if (sharedGrid) timeline.to(sharedGrid, { opacity: .22, scale: 1, duration: .55, ease: 'power2.out' }, .48);
    timeline.to(sharedFragments, { opacity: .52, scale: 1, duration: .35, stagger: .06, ease: 'back.out(1.5)' }, .45);
    timeline.to(sharedNodes.slice(3), { opacity: .7, scale: 1, duration: .3, stagger: .07, ease: 'back.out(1.5)' }, .55);
    if (skipButton) timeline.to(skipButton, { opacity: .78, pointerEvents: 'auto', duration: .16 }, .36);
    timeline.call(() => this.setState('system'), [], .15);
    timeline.call(() => this.setState('silhouette'), [], 1.15);
    timeline.to(slices, { x: (index) => index % 3 === 0 ? 76 : index % 3 === 1 ? -112 : 44, scaleX: (index) => index % 2 ? 1.08 : .96, opacity: .1, duration: 1.2, stagger: .035, ease: 'power3.inOut' }, 1.45);
    timeline.to(Array.from(root.querySelectorAll('.tech-pieces path, .tech-pieces circle')), { x: (index) => index % 3 === 0 ? 96 : index % 3 === 1 ? -68 : 42, scaleX: (index) => index % 2 ? 1.14 : .9, opacity: .3, duration: 1.2, stagger: .035, ease: 'power2.inOut' }, 1.45);
    if (transformStrokes) {
      timeline.set(transformStrokes, { opacity: 0, x: -120, scaleX: .58 }, 0);
      timeline.to(transformStrokes, { opacity: .92, x: 0, scaleX: 1, duration: 1.18, stagger: .06, ease: 'power3.inOut' }, 1.53);
    }
    timeline.call(() => this.setState('transforming'), [], 1.45);
    if (nameSvg) timeline.to(nameSvg, { opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 1.18, ease: 'power2.out' }, 1.58);
    if (name) timeline.to(name, { opacity: .9, duration: .5 }, 2.55);
    timeline.call(() => { void this.alignNameToHero(); }, [], 2.95);
    if (nameSvg) timeline.to(nameSvg, { opacity: 0, duration: .1, ease: 'none' }, 3.3);
    if (actualTitle) timeline.to(actualTitle, { opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: .1, ease: 'none' }, 3.3);
    timeline.call(() => this.releaseSite(), [], 3.45);
    if (role) timeline.to(role, { opacity: 1, clipPath: 'inset(0 0% 0 0)', y: 0, duration: .3 }, 3.45);
    timeline.call(() => { void this.alignRoleToHero(); }, [], 3.7);
    if (role) timeline.to(role, { opacity: 0, duration: .1, ease: 'none' }, 3.9);
    if (actualRole) timeline.to(actualRole, { opacity: 1, clipPath: 'inset(0 0% 0 0)', transform: 'translateY(0)', duration: .1, ease: 'none' }, 3.9);
    if (leadElements.length) timeline.to(leadElements, { opacity: 1, y: 0, duration: .3, stagger: .06 }, 3.6);
    if (siteElements.length) timeline.to(siteElements, { opacity: 1, filter: 'blur(0px)', duration: .3, stagger: .05 }, 3.7);
    timeline.call(() => this.setState('revealing-hero'), [], 3.45);
    timeline.to(slices, { opacity: this.ambientImageOpacity(), x: 8, scaleX: 1.03, duration: .6, stagger: .02, ease: 'power1.inOut' }, 3.5);
    timeline.to(Array.from(root.querySelectorAll('.tech-pieces')), { opacity: this.ambientStructureOpacity(), duration: .6, ease: 'power1.inOut' }, 3.5);
    if (sharedScene) timeline.to(sharedScene, { opacity: this.heroTechAmbientOpacity(), duration: .6, ease: 'power1.inOut' }, 3.5);
    timeline.call(() => this.setState('ambient'), [], 3.9);
    timeline.call(() => this.complete('completed'), [], this.timelineDurationMs() / 1000);
    return timeline;
  }

  private timelineDurationMs(): number { return Object.values(INTRO_TIMELINE).reduce((total, duration) => total + duration, 0); }

  private ambientImageOpacity(): number { return Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--intro-ambient-image-opacity')) || .1; }
  private ambientStructureOpacity(): number { return Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--intro-ambient-structure-opacity')) || .14; }
  private heroTechIntroOpacity(): number { return Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hero-tech-intro-opacity')) || .22; }
  private heroTechAmbientOpacity(): number { return Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hero-tech-ambient-opacity')) || .12; }
  private applyAmbientState(): void {
    const root = this.introVisual?.nativeElement;
    if (!root) return;
    const slices = Array.from(root.querySelectorAll<HTMLElement>('.asset-slice'));
    const structure = Array.from(root.querySelectorAll<HTMLElement>('.tech-pieces'));
    const structureSvg = root.querySelector<SVGSVGElement>('.intro-structure');
    const nameSvg = this.introNameSvg?.nativeElement;
    gsap.set(root, { opacity: 1 });
    gsap.set(slices, { opacity: this.ambientImageOpacity(), x: 8, scaleX: 1.03 });
    if (structureSvg) gsap.set(structureSvg, { opacity: .9 });
    gsap.set(structure, { opacity: this.ambientStructureOpacity(), x: 0, scaleX: 1 });
    if (nameSvg) gsap.set(nameSvg, { opacity: 0 });
    if (this.introRole) gsap.set(this.introRole.nativeElement, { opacity: 0 });
    this.state.set('ambient');
  }

  private prepareHero(): void {
    const selectors = ['#introduction-title', '.stage-introduction .role', '.stage-introduction .lead', '.stage-introduction .introduction-meta'];
    this.preparedElements = selectors.map((selector) => document.querySelector<HTMLElement>(selector)).filter((element): element is HTMLElement => !!element);
    this.preparedElements.forEach((element) => {
      this.preparedStyles.set(element, { opacity: element.style.opacity, clipPath: element.style.clipPath, transform: element.style.transform, willChange: element.style.willChange });
      element.style.opacity = '0'; element.style.willChange = 'opacity, clip-path, transform';
      if (element.id === 'introduction-title' || element.classList.contains('role')) element.style.clipPath = 'inset(0 100% 0 0)';
      if (element.classList.contains('lead') || element.classList.contains('introduction-meta')) element.style.transform = 'translateY(10px)';
    });
  }

  private async alignNameToHero(): Promise<void> {
    if (document.fonts?.ready) await document.fonts.ready;
    const group = this.introName?.nativeElement;
    const svg = this.introNameSvg?.nativeElement;
    const title = document.getElementById('introduction-title');
    if (!group || !svg || !title) return;
    const groupBounds = group.getBoundingClientRect();
    const titleBounds = title.getBoundingClientRect();
    const svgBounds = svg.getBoundingClientRect();
    const scale = titleBounds.width / groupBounds.width;
    const unitX = svg.viewBox.baseVal.width / svgBounds.width;
    const unitY = svg.viewBox.baseVal.height / svgBounds.height;
    gsap.to(group, { x: (titleBounds.left - groupBounds.left) * unitX, y: (titleBounds.top - groupBounds.top) * unitY, scale, duration: .35, ease: 'power2.inOut' });
  }

  private async alignRoleToHero(): Promise<void> {
    if (document.fonts?.ready) await document.fonts.ready;
    const source = this.introRole?.nativeElement;
    const target = document.querySelector<HTMLElement>('.hero-role');
    if (!source || !target) return;
    const sourceBounds = source.getBoundingClientRect();
    const targetBounds = target.getBoundingClientRect();
    const scale = targetBounds.width / sourceBounds.width;
    gsap.to(source, {
      x: targetBounds.left - sourceBounds.left + (targetBounds.width - sourceBounds.width) / 2,
      y: targetBounds.top - sourceBounds.top + (targetBounds.height - sourceBounds.height) / 2,
      scale,
      duration: .2,
      ease: 'power2.inOut',
    });
  }

  private releaseSite(): void { document.body.classList.remove('intro-active'); document.documentElement.classList.remove('intro-running', 'intro-preboot'); document.documentElement.classList.add('intro-done'); document.documentElement.removeAttribute('data-intro-pending'); document.body.style.overflow = this.previousOverflow; this.documentSceneActive = false; }
  private activateDocumentScene(): void { this.previousOverflow = document.body.style.overflow; document.body.classList.add('intro-active'); document.body.style.overflow = 'hidden'; this.documentSceneActive = true; }
  private restoreDocumentScene(): void { if (!isPlatformBrowser(this.platformId)) return; document.documentElement.classList.remove('intro-running', 'intro-preboot'); document.documentElement.classList.add('intro-done'); document.documentElement.removeAttribute('data-intro-pending'); if (!this.documentSceneActive) return; document.body.classList.remove('intro-active'); document.body.style.overflow = this.previousOverflow; this.documentSceneActive = false; }
  private setState(state: IntroState): void { this.state.set(state); }
  private scheduleStateSync(): void {
    if (this.startedAt === undefined) return;
    const elapsed = performance.now() - this.startedAt; const total = this.timelineDurationMs();
    if (elapsed >= total) { this.complete('completed'); return; }
    const boundaries = [150, 1150, 1450, 2650, total];
    const next = boundaries.find((boundary) => boundary > elapsed) ?? total;
    this.stateTimer = window.setTimeout(() => this.advanceState(), Math.max(16, next - elapsed));
  }
  private advanceState(): void {
    if (this.startedAt === undefined) return;
    const elapsed = performance.now() - this.startedAt;
    const nextState: IntroState = elapsed < 150 ? 'starting' : elapsed < 1150 ? 'system' : elapsed < 1450 ? 'silhouette' : elapsed < 2650 ? 'transforming' : 'revealing-hero';
    if (elapsed >= this.timelineDurationMs()) { this.complete('completed'); return; }
    if (this.state() !== nextState) this.setState(nextState); this.scheduleStateSync();
  }
  private complete(reason: IntroCompletion): void { this.killTimeline(); this.applyAmbientState(); this.restorePreparedElements(); this.markAsPresented(); this.restoreDocumentScene(); this.finished.emit(reason); this.restoreFocus(); this.visible.set(false); }
  private failSafely(): void { this.killTimeline(); this.restorePreparedElements(); this.restoreDocumentScene(); this.finished.emit('error'); this.restoreFocus(); this.visible.set(false); }
  private killTimeline(): void { this.timeline?.kill(); this.timeline = undefined; if (!isPlatformBrowser(this.platformId)) return; if (this.stateTimer !== undefined) { window.clearTimeout(this.stateTimer); this.stateTimer = undefined; } if (this.bootTimer !== undefined) { window.clearTimeout(this.bootTimer); this.bootTimer = undefined; } document.documentElement.removeAttribute('data-intro-boot'); if (this.introVisual) { const root = this.introVisual.nativeElement; gsap.killTweensOf([root, ...Array.from(root.querySelectorAll('*'))]); } }
  private restorePreparedElements(): void { this.preparedElements.forEach((element) => { const styles = this.preparedStyles.get(element); if (!styles) return; element.style.opacity = styles.opacity; element.style.clipPath = styles.clipPath; element.style.transform = styles.transform; element.style.willChange = styles.willChange; }); this.preparedElements = []; this.preparedStyles.clear(); }
  private prefersReducedMotion(): boolean { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  private shouldRunIntro(): boolean { try { const force = isDevMode() && new URLSearchParams(window.location.search).get('intro') === '1'; return force || window.localStorage.getItem(INTRO_STORAGE_KEY) !== 'presented'; } catch { return false; } }
  private markAsPresented(): void { try { window.localStorage.setItem(INTRO_STORAGE_KEY, 'presented'); } catch { /* Storage can be unavailable. */ } }
  private restoreFocus(): void { const focusTarget = this.previousFocus; this.previousFocus = null; queueMicrotask(() => focusTarget?.focus({ preventScroll: true })); }
}

