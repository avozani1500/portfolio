import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { IntroLoaderComponent, INTRO_STORAGE_KEY, INTRO_TIMELINE } from './intro-loader.component';

describe('IntroLoaderComponent', () => {
  let fixture: ComponentFixture<IntroLoaderComponent>;

  beforeEach(async () => {
    sessionStorage.removeItem(INTRO_STORAGE_KEY);
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: false }),
    });
    await TestBed.configureTestingModule({
      imports: [IntroLoaderComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    }).compileComponents();
  });

  afterEach(() => {
    sessionStorage.removeItem(INTRO_STORAGE_KEY);
    vi.useRealTimers();
  });

  it('runs the provisional sequence on each local review', () => {
    vi.useFakeTimers();
    fixture = TestBed.createComponent(IntroLoaderComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.intro-loader')).toBeTruthy();

    vi.advanceTimersByTime(Object.values(INTRO_TIMELINE).reduce((total, duration) => total + duration, 0));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.intro-loader')).toBeTruthy();
    expect(sessionStorage.getItem(INTRO_STORAGE_KEY)).toBeNull();
  });

  it('keeps each diagnostic phase active for the configured duration', () => {
    vi.useFakeTimers();
    fixture = TestBed.createComponent(IntroLoaderComponent);
    fixture.detectChanges();
    const state = (): string => (fixture.componentInstance as unknown as { state: () => string }).state();
    const advance = (milliseconds: number): void => {
      vi.advanceTimersByTime(milliseconds);
    };

    expect(state()).toBe('starting');
    advance(INTRO_TIMELINE.boot);
    expect(state()).toBe('system');
    advance(INTRO_TIMELINE.build);
    expect(state()).toBe('silhouette');
    expect(fixture.nativeElement.querySelector('.intro-loader')).toBeTruthy();
    advance(INTRO_TIMELINE.silhouette);
    expect(state()).toBe('transforming');
    advance(INTRO_TIMELINE.transform);
    expect(state()).toBe('revealing-hero');
    expect(fixture.nativeElement.querySelector('.intro-loader')).toBeTruthy();
    advance(INTRO_TIMELINE.reveal);
    fixture.detectChanges();
    expect(state()).toBe('ambient');
    expect(fixture.nativeElement.querySelector('.intro-loader')).toBeTruthy();
  });

  it('allows the user to skip while keeping local review persistence disabled', () => {
    fixture = TestBed.createComponent(IntroLoaderComponent);
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('.intro-skip') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.intro-loader')).toBeTruthy();
    expect(sessionStorage.getItem(INTRO_STORAGE_KEY)).toBeNull();

    const nextVisit = TestBed.createComponent(IntroLoaderComponent);
    nextVisit.detectChanges();
    expect(nextVisit.nativeElement.querySelector('.intro-loader')).toBeTruthy();
  });
});
