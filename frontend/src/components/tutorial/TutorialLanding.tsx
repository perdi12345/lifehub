"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Check,
  FileText,
  FolderOpen,
  LayoutDashboard,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import TutorialScreenPreview, { type TutorialScreen } from "@/components/tutorial/TutorialScreenPreview";

const slides: {
  screen: TutorialScreen;
  eyebrow: string;
  title: string;
  description: string;
  icon: typeof LayoutDashboard;
  color: string;
}[] = [
  {
    screen: "dashboard",
    eyebrow: "OVERVIEW",
    title: "暮らしの全体像を、ひと目で。",
    description: "資産の変化も、最近の記録も。毎日の状況をひとつの画面にまとめます。",
    icon: LayoutDashboard,
    color: "bg-brand-100 text-brand-700",
  },
  {
    screen: "assets",
    eyebrow: "YOUR ASSETS",
    title: "資産の記録を、気軽に続ける。",
    description: "預金や投資などを項目ごとに記録。時間とともに変わる推移を見返せます。",
    icon: Wallet,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    screen: "memos",
    eyebrow: "YOUR NOTES",
    title: "思いつきを、なくさない場所へ。",
    description: "予定もアイデアもさっとメモ。検索やピン留めで、必要なときに見つかります。",
    icon: FileText,
    color: "bg-amber-100 text-amber-700",
  },
  {
    screen: "files",
    eyebrow: "YOUR FILES",
    title: "大切なファイルも、ひとまとめ。",
    description: "書類や画像をアップロード。暮らしに必要なデータをひとつの場所で管理します。",
    icon: FolderOpen,
    color: "bg-rose-100 text-rose-700",
  },
];

const features = [
  {
    number: "01",
    title: "資産の変化を記録する",
    body: "預金、投資、年金などを自分の項目で管理。定期的に記録すれば、数字の変化をグラフで振り返れます。",
    icon: Wallet,
    color: "text-emerald-700 bg-emerald-100",
    note: "資産管理",
  },
  {
    number: "02",
    title: "メモを探しやすく残す",
    body: "アイデアや予定をすぐに書き留めて、検索やピン留めで整理。締切のあるメモは期日も一緒に管理できます。",
    icon: FileText,
    color: "text-amber-700 bg-amber-100",
    note: "メモ",
  },
  {
    number: "03",
    title: "ファイルを安全にまとめる",
    body: "書類や写真をアップロードして、必要なときにすぐ確認。メモや資産記録と同じ場所からアクセスできます。",
    icon: FolderOpen,
    color: "text-rose-700 bg-rose-100",
    note: "ファイル管理",
  },
];

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const element = elementRef.current;

    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    setVisible(element.getBoundingClientRect().top < window.innerHeight);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.16 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={`${className} transition-[opacity,transform] duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function ScreenCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pointerPaused, setPointerPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (reducedMotion || pointerPaused || focusPaused || hasInteracted) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, 6200);

    return () => window.clearInterval(intervalId);
  }, [focusPaused, hasInteracted, pointerPaused, reducedMotion]);

  const selectSlide = (index: number) => {
    setHasInteracted(true);
    setActiveIndex((index + slides.length) % slides.length);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectSlide(activeIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectSlide(activeIndex + 1);
    }
  };

  const activeSlide = slides[activeIndex];
  const ActiveIcon = activeSlide.icon;

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="LifeHubの画面紹介"
      onMouseEnter={() => setPointerPaused(true)}
      onMouseLeave={() => setPointerPaused(false)}
      onFocus={() => setFocusPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusPaused(false);
      }}
      onKeyDown={handleKeyDown}
      onTouchStart={(event) => { touchStartX.current = event.changedTouches[0]?.clientX ?? null; }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const distance = event.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(distance) > 48) selectSlide(activeIndex + (distance < 0 ? 1 : -1));
        touchStartX.current = null;
      }}
    >
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-brand-100/80 via-white to-emerald-100/70 blur-2xl sm:-inset-10" />
      <div className="overflow-hidden rounded-xl border border-white/80 bg-white/85 shadow-[0_30px_100px_-42px_rgba(15,23,42,0.45)] backdrop-blur sm:rounded-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${activeSlide.color}`}>
              <ActiveIcon size={16} />
            </span>
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-slate-400 sm:text-[10px]">{activeSlide.eyebrow}</p>
              <p className="truncate text-[11px] font-semibold text-slate-800 sm:text-xs">{activeSlide.title}</p>
            </div>
          </div>
          <span className="shrink-0 font-mono text-[10px] tabular-nums text-slate-400 sm:text-xs">
            0{activeIndex + 1}<span className="px-1 text-slate-300">/</span>0{slides.length}
          </span>
        </div>

        <div className="px-3 pb-3 pt-2 sm:px-5 sm:pb-5 sm:pt-3">
          <div className="overflow-hidden rounded-lg bg-slate-100 sm:rounded-xl">
            <div className="flex transition-transform duration-700 ease-out motion-reduce:transition-none" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
              {slides.map((slide) => (
                <div key={slide.screen} className="w-full shrink-0 p-2.5 sm:p-4" aria-hidden={slide.screen !== activeSlide.screen}>
                  <TutorialScreenPreview screen={slide.screen} />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 sm:mt-4">
            <div className="flex items-center gap-1.5" role="group" aria-label="表示する画面を選択">
              {slides.map((slide, index) => (
                <button
                  key={slide.screen}
                  type="button"
                  aria-label={`${slide.title}を表示`}
                  aria-pressed={index === activeIndex}
                  onClick={() => selectSlide(index)}
                  className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-7 bg-brand-600" : "w-1.5 bg-slate-300 hover:bg-slate-400"}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => selectSlide(activeIndex - 1)} className="grid size-8 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600" aria-label="前の画面">
                <ArrowLeft size={15} />
              </button>
              <button type="button" onClick={() => selectSlide(activeIndex + 1)} className="grid size-8 place-items-center rounded-full bg-slate-900 text-white transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600" aria-label="次の画面">
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
          <p className="mt-1 min-h-8 text-[10px] leading-relaxed text-slate-500 sm:mt-2 sm:text-[11px]">{activeSlide.description}</p>
        </div>
      </div>
      <span className="absolute -bottom-3 right-4 rounded-full border border-slate-100 bg-white px-3 py-1.5 text-[9px] font-medium text-slate-500 shadow-sm sm:-bottom-4 sm:right-8 sm:px-4 sm:text-[10px]">
        実際の画面イメージ
      </span>
    </div>
  );
}

export default function TutorialLanding() {
  return (
    <main id="top" className="overflow-hidden bg-[#f7f9f8] text-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[740px] bg-[radial-gradient(ellipse_at_72%_12%,rgba(186,224,253,0.48),transparent_42%),linear-gradient(180deg,#f7f9f8_0%,#ffffff_100%)]" />
      <header className="relative z-10 mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/tutorial" className="flex items-center gap-2.5" aria-label="LifeHub ホーム">
          <span className="grid size-8 place-items-center rounded-lg bg-slate-900 text-white"><Boxes size={17} /></span>
          <span className="font-display text-lg font-bold text-slate-900">LifeHub</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-5" aria-label="メインナビゲーション">
          <a href="#features" className="hidden text-sm font-medium text-slate-600 transition hover:text-slate-950 sm:inline">できること</a>
          <Link href="/auth/login" className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-white sm:px-4 sm:text-sm">ログイン</Link>
          <Link href="/auth/register" className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700 sm:px-5 sm:text-sm">
            無料で始める <ArrowUpRight size={14} />
          </Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-5 px-5 pb-8 pt-4 sm:gap-8 sm:px-8 sm:pb-20 sm:pt-12 lg:min-h-[calc(100svh-68px)] lg:grid-cols-[0.78fr_1.22fr] lg:gap-10 lg:px-12 lg:py-12">
        <div className="max-w-xl lg:pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-[10px] font-semibold text-emerald-800 shadow-sm sm:text-xs">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            あなたの暮らしを整える、ひとつの場所
          </div>
          <h1 className="mt-3 text-[1.875rem] font-semibold leading-[1.12] text-slate-950 sm:mt-6 sm:text-5xl sm:leading-[1.16] lg:text-[3.5rem]">
            お金も、メモも、ファイルも。<br className="hidden sm:block" />
            <span className="text-brand-700">暮らしの記録を、ひとつに。</span>
          </h1>
          <p className="mt-3 max-w-md text-[13px] leading-6 text-slate-600 sm:mt-5 sm:text-base sm:leading-8">
            LifeHubは、資産・メモ・ファイルをまとめて管理できる生活ダッシュボード。散らばる記録をひとつに集めて、毎日をすっきり整えます。
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-7">
            <Link href="/auth/register" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-600 px-5 text-sm font-semibold text-white shadow-[0_10px_26px_-12px_rgba(1,118,200,0.8)] transition hover:-translate-y-0.5 hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 sm:min-h-12 sm:px-6">
              無料で使い始める <ArrowUpRight size={16} />
            </Link>
            <Link href="/auth/login" className="inline-flex min-h-12 items-center rounded-full px-5 text-sm font-semibold text-slate-700 transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700">
              ログイン
            </Link>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-medium text-slate-500 sm:mt-5 sm:text-xs">
            <span className="inline-flex items-center gap-1.5"><Check size={13} className="text-emerald-600" />いつでも記録を整理</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck size={13} className="text-emerald-600" />自分専用のアカウント</span>
          </div>
        </div>

        <ScreenCarousel />
      </section>

      <div className="relative z-10 border-y border-slate-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-slate-100 px-5 sm:grid-cols-4 sm:divide-y-0 sm:px-8 lg:px-12">
          {[
            { icon: LayoutDashboard, label: "全体を見渡す", color: "text-brand-700" },
            { icon: Wallet, label: "資産を記録", color: "text-emerald-700" },
            { icon: FileText, label: "メモを整理", color: "text-amber-700" },
            { icon: FolderOpen, label: "ファイルを保管", color: "text-rose-700" },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center justify-center gap-2.5 py-4 text-xs font-semibold text-slate-600 sm:py-5 sm:text-sm">
              <Icon size={16} className={color} />{label}
            </div>
          ))}
        </div>
      </div>

      <section id="features" className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-bold text-brand-700">ONE PLACE FOR YOUR LIFE</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
            ばらばらだった記録に、<br className="hidden sm:block" />帰る場所を。
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            気になったことを書き留める。資産の変化を残す。大切な書類をしまう。LifeHubなら、必要なものがひとつのダッシュボードにつながります。
          </p>
        </Reveal>

        <div className="mt-12 divide-y divide-slate-200 border-y border-slate-200 sm:mt-16">
          {features.map(({ number, title, body, icon: Icon, color, note }, index) => (
            <Reveal key={number} delay={index * 80} className="grid gap-5 py-8 sm:grid-cols-[110px_1fr_auto] sm:items-center sm:gap-8 sm:py-10">
              <span className="font-mono text-sm font-medium text-slate-400">{number} / 03</span>
              <div className="flex items-start gap-4">
                <span className={`grid size-10 shrink-0 place-items-center rounded-lg ${color}`}><Icon size={19} /></span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">{title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">{body}</p>
                </div>
              </div>
              <span className="hidden rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 sm:inline-flex">{note}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative z-10 overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:34px_34px]" />
        <Reveal className="relative mx-auto flex max-w-7xl flex-col gap-7 px-5 py-16 sm:px-8 sm:py-20 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div>
            <p className="text-xs font-bold text-brand-300">MAKE ROOM FOR WHAT MATTERS</p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl">今日の記録から、始めよう。</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">あなたの暮らしに必要なものを、ひとつの場所へ。</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/auth/register" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-slate-950 transition hover:bg-brand-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              会員登録 <ArrowUpRight size={16} />
            </Link>
            <Link href="/auth/login" className="inline-flex min-h-12 items-center rounded-full border border-white/25 px-5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
              ログイン
            </Link>
          </div>
        </Reveal>
      </section>

      <footer className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 text-[10px] text-slate-500 sm:px-8 sm:text-xs lg:px-12">
        <span className="font-display font-bold text-slate-700">LifeHub</span>
        <a href="#top" className="inline-flex items-center gap-1.5 transition hover:text-slate-900">ページ上部へ <ArrowDown size={12} className="rotate-180" /></a>
      </footer>
    </main>
  );
}