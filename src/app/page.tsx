"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  MapPin,
  Calendar,
  SlidersHorizontal,
  Flame,
  Sparkles,
  Timer,
  ChevronLeft,
  ChevronRight,
  Map as MapIcon,
  LayoutGrid,
  ShieldCheck,
  BadgeCheck,
  Star,
  Mail,
  Ticket,
} from "lucide-react";

/* ------------------------------------------------------------------
   TicketCentral — Event Discovery Home
   Design signature: every event card is drawn as a literal ticket
   stub — perforated divider, punched notches, mono-set stub numbers.
------------------------------------------------------------------- */

type EventBadge = "selling-fast" | "trending" | "almost-sold-out" | null;

interface EventItem {
  id: number;
  title: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  price: number;
  currency: string;
  ticketsLeft: number;
  capacity: number;
  badge: EventBadge;
  img: string;
  rating: number;
}

interface ToggleState {
  trending: boolean;
  recommended: boolean;
  almostSoldOut: boolean;
}

type ViewMode = "grid" | "map";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');`;

const CATEGORIES: string[] = [
  "All",
  "Concerts",
  "Sports",
  "Conferences",
  "Comedy",
  "Nightlife",
  "Festivals",
  "Church",
  "Theatre",
];

const EVENTS: EventItem[] = [
  {
    id: 1,
    title: "Afrobeats Fest Live",
    category: "Concerts",
    date: "Jul 18",
    time: "7:00 PM",
    venue: "Lugogo Cricket Oval",
    city: "Kampala",
    price: 45000,
    currency: "UGX",
    ticketsLeft: 32,
    capacity: 4000,
    badge: "selling-fast",
    img: "afrobeats-fest",
    rating: 4.8,
  },
  {
    id: 2,
    title: "Kampala Comedy Night",
    category: "Comedy",
    date: "Jul 12",
    time: "8:30 PM",
    venue: "Lubowa Amphitheatre",
    city: "Kampala",
    price: 25000,
    currency: "UGX",
    ticketsLeft: 140,
    capacity: 600,
    badge: "trending",
    img: "comedy-night",
    rating: 4.6,
  },
  {
    id: 3,
    title: "Founders & Funders Summit",
    category: "Conferences",
    date: "Aug 02",
    time: "9:00 AM",
    venue: "Kampala Serena Hotel",
    city: "Kampala",
    price: 150000,
    currency: "UGX",
    ticketsLeft: 9,
    capacity: 300,
    badge: "almost-sold-out",
    img: "founders-summit",
    rating: 4.9,
  },
  {
    id: 4,
    title: "Cranes vs Harambee Stars",
    category: "Sports",
    date: "Jul 27",
    time: "4:00 PM",
    venue: "Namboole Stadium",
    city: "Kampala",
    price: 20000,
    currency: "UGX",
    ticketsLeft: 812,
    capacity: 45000,
    badge: null,
    img: "football-match",
    rating: 4.7,
  },
  {
    id: 5,
    title: "Sunset Rooftop Sessions",
    category: "Nightlife",
    date: "Every Fri",
    time: "9:00 PM",
    venue: "The Rooftop, Kololo",
    city: "Kampala",
    price: 0,
    currency: "UGX",
    ticketsLeft: 58,
    capacity: 200,
    badge: "trending",
    img: "rooftop-sessions",
    rating: 4.5,
  },
  {
    id: 6,
    title: "Praise & Worship Encounter",
    category: "Church",
    date: "Jul 20",
    time: "10:00 AM",
    venue: "Watoto Church Central",
    city: "Kampala",
    price: 0,
    currency: "UGX",
    ticketsLeft: 900,
    capacity: 3000,
    badge: null,
    img: "worship-encounter",
    rating: 4.9,
  },
  {
    id: 7,
    title: "Nyege Nyege Festival",
    category: "Festivals",
    date: "Sep 04",
    time: "12:00 PM",
    venue: "Itanda Falls",
    city: "Jinja",
    price: 180000,
    currency: "UGX",
    ticketsLeft: 21,
    capacity: 8000,
    badge: "almost-sold-out",
    img: "nyege-festival",
    rating: 4.8,
  },
  {
    id: 8,
    title: "A Doll's House — Stage Play",
    category: "Theatre",
    date: "Jul 15",
    time: "6:30 PM",
    venue: "National Theatre",
    city: "Kampala",
    price: 30000,
    currency: "UGX",
    ticketsLeft: 64,
    capacity: 400,
    badge: null,
    img: "stage-play",
    rating: 4.7,
  },
];

const RECOMMENDED = [EVENTS[0], EVENTS[6], EVENTS[4], EVENTS[2], EVENTS[3]];

const FEATURED_SLIDES = [EVENTS[0], EVENTS[6], EVENTS[2], EVENTS[3]];

function img(seed: string, w = 800, h = 500): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

function formatPrice(price: number, currency: string): string {
  if (price === 0) return "Free";
  return `${currency} ${price.toLocaleString()}`;
}

interface BadgeMeta {
  label: string;
  cls: string;
}

function badgeMeta(badge: EventBadge): BadgeMeta | null {
  switch (badge) {
    case "selling-fast":
      return { label: "Selling Fast", cls: "bg-amber-400 text-slate-900" };
    case "trending":
      return { label: "Trending", cls: "bg-violet-500 text-white" };
    case "almost-sold-out":
      return { label: "Almost Sold Out", cls: "bg-rose-500 text-white" };
    default:
      return null;
  }
}

/* ------------------------- Ambient Background System ----------------------
   A reusable, layered, premium background: dark gradient wash, faint mesh
   grid, drifting bokeh orbs, flowing wave ribbons, light streaks, and a
   whisper-quiet skyline silhouette. "hero" = full intensity for the above-
   fold banner. "page" = a much quieter version used behind the whole site
   so scrolling still feels immersive without competing with content.
----------------------------------------------------------------------- */

interface AmbientBackgroundProps {
  variant: "hero" | "page";
}

const SKYLINE_HEIGHTS = [38, 64, 48, 82, 56, 96, 44, 72, 60, 88, 40, 68, 52, 90, 46, 74, 58, 84, 42, 66];

// Deterministic confetti layout (colors + positions fixed so server/client match).
const CONFETTI_HERO = [
  { top: 14, left: 8, color: "bg-amber-300", size: 8, rot: 18, dur: 9, delay: 0 },
  { top: 22, left: 82, color: "bg-pink-400", size: 7, rot: -24, dur: 11, delay: -3 },
  { top: 34, left: 46, color: "bg-cyan-300", size: 6, rot: 40, dur: 8, delay: -1.5 },
  { top: 10, left: 62, color: "bg-violet-400", size: 9, rot: -12, dur: 10, delay: -5 },
  { top: 48, left: 20, color: "bg-emerald-300", size: 7, rot: 30, dur: 12, delay: -2 },
  { top: 40, left: 90, color: "bg-amber-300", size: 6, rot: -30, dur: 9.5, delay: -7 },
  { top: 60, left: 68, color: "bg-pink-400", size: 8, rot: 15, dur: 10.5, delay: -4 },
  { top: 26, left: 30, color: "bg-cyan-300", size: 7, rot: -18, dur: 11.5, delay: -6 },
  { top: 55, left: 12, color: "bg-violet-400", size: 6, rot: 22, dur: 9, delay: -8 },
  { top: 18, left: 55, color: "bg-emerald-300", size: 8, rot: -40, dur: 8.5, delay: -2.5 },
];
const CONFETTI_PAGE = [
  { top: 12, left: 15, color: "bg-amber-300", size: 6, rot: 20, dur: 13, delay: 0 },
  { top: 30, left: 78, color: "bg-pink-400", size: 5, rot: -20, dur: 15, delay: -5 },
  { top: 55, left: 40, color: "bg-cyan-300", size: 5, rot: 30, dur: 14, delay: -8 },
  { top: 70, left: 88, color: "bg-violet-400", size: 6, rot: -15, dur: 16, delay: -3 },
];

const SPARKLES = [
  { top: 16, left: 24, size: 14, dur: 4.5, delay: 0 },
  { top: 30, left: 72, size: 10, dur: 5.5, delay: -2 },
  { top: 50, left: 50, size: 12, dur: 4, delay: -1 },
  { top: 62, left: 14, size: 9, dur: 6, delay: -3.5 },
];

function Sparkle({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 0 C12 6.5 13 9 12 12 C13 15 12 17.5 12 24 C12 17.5 11 15 12 12 C11 9 12 6.5 12 0 Z M0 12 C6.5 12 9 11 12 12 C15 11 17.5 12 24 12 C17.5 12 15 13 12 12 C9 13 6.5 12 0 12 Z"
        fill="#fef3c7"
      />
    </svg>
  );
}

function AmbientBackground({ variant }: AmbientBackgroundProps) {
  const isHero = variant === "hero";
  const confetti = isHero ? CONFETTI_HERO : CONFETTI_PAGE;

  return (
    <div
      aria-hidden="true"
      className={`tc-ambient pointer-events-none overflow-hidden ${
        isHero ? "absolute inset-0 z-0" : "fixed inset-0 -z-10"
      }`}
    >
      {/* base gradient wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,rgba(124,58,237,0.22),transparent_60%),radial-gradient(ellipse_60%_45%_at_92%_8%,rgba(251,191,36,0.14),transparent_60%),radial-gradient(ellipse_55%_45%_at_5%_85%,rgba(34,211,238,0.10),transparent_60%),linear-gradient(180deg,#020617_0%,#0b1120_45%,#020617_100%)]" />

      {/* faint mesh grid */}
      <div className={`tc-grid absolute inset-0 ${isHero ? "opacity-[0.07]" : "opacity-[0.035]"}`} />

      {/* stage-light spotlight beams — the "something big is happening" cue */}
      {isHero && (
        <>
          <div
            className="tc-spotlight absolute -top-10 left-[18%] h-[70%] w-[220px] opacity-[0.14]"
            style={{
              background: "linear-gradient(180deg, rgba(251,191,36,0.9), transparent 75%)",
              clipPath: "polygon(48% 0%, 52% 0%, 100% 100%, 0% 100%)",
              transformOrigin: "top center",
              animationDelay: "0s",
            }}
          />
          <div
            className="tc-spotlight absolute -top-10 right-[16%] h-[70%] w-[220px] opacity-[0.12]"
            style={{
              background: "linear-gradient(180deg, rgba(236,72,153,0.9), transparent 75%)",
              clipPath: "polygon(48% 0%, 52% 0%, 100% 100%, 0% 100%)",
              transformOrigin: "top center",
              animationDelay: "-4s",
            }}
          />
        </>
      )}

      {/* bokeh light orbs */}
      <div
        className="tc-orb absolute -top-16 left-[10%] h-[380px] w-[380px] rounded-full bg-violet-500"
        style={{ opacity: isHero ? 0.28 : 0.12, animationDelay: "0s" }}
      />
      <div
        className="tc-orb absolute top-[8%] right-[6%] h-[300px] w-[300px] rounded-full bg-amber-400"
        style={{ opacity: isHero ? 0.22 : 0.1, animationDelay: "-6s" }}
      />
      {isHero && (
        <div
          className="tc-orb absolute bottom-[-8%] left-[38%] h-[340px] w-[340px] rounded-full bg-pink-500"
          style={{ opacity: 0.18, animationDelay: "-10s" }}
        />
      )}

      {/* confetti — the clearest "this is a party" signal, kept small and sparse */}
      {/* {confetti.map((c, i) => (
        <span
          key={i}
          className={`tc-confetti absolute rounded-[2px] ${c.color}`}
          style={{
            top: `${c.top}%`,
            left: `${c.left}%`,
            width: c.size,
            height: c.size * 2.2,
            opacity: isHero ? 0.5 : 0.28,
            transform: `rotate(${c.rot}deg)`,
            animationDuration: `${c.dur}s`,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))} */}

      {/* twinkling sparkles — hero only */}
      {isHero &&
        SPARKLES.map((s, i) => (
          <div
            key={i}
            className="tc-sparkle absolute"
            style={{ top: `${s.top}%`, left: `${s.left}%`, animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }}
          >
            <Sparkle size={s.size} />
          </div>
        ))}

      {/* flowing wave ribbons — hero only, kept off the quieter page layer */}
      {isHero && (
        <svg
          className="tc-wave absolute bottom-0 left-0 h-48 w-[200%] opacity-[0.14] sm:h-64"
          viewBox="0 0 2400 300"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="tcWaveGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7c5cff" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <path
            d="M0,180 C 200,100 400,220 600,160 C 800,100 1000,220 1200,160 C 1400,100 1600,220 1800,160 C 2000,100 2200,220 2400,160 L2400,300 L0,300 Z"
            fill="url(#tcWaveGrad)"
          />
          <path
            d="M0,180 C 200,100 400,220 600,160 C 800,100 1000,220 1200,160 C 1400,100 1600,220 1800,160 C 2000,100 2200,220 2400,160 L2400,300 L0,300 Z"
            fill="url(#tcWaveGrad)"
            transform="translate(1200,0)"
          />
        </svg>
      )}

      {/* light streaks — hero only */}
      {isHero && (
        <>
          <div className="tc-streak absolute left-[-20%] top-[22%] h-px w-[140%]" style={{ animationDelay: "0s" }} />
          <div className="tc-streak absolute left-[-30%] top-[58%] h-px w-[160%]" style={{ animationDelay: "-4s" }} />
        </>
      )}

      {/* whisper-quiet skyline silhouette */}
      <svg
        className={`absolute bottom-0 left-0 w-full ${isHero ? "opacity-[0.09]" : "opacity-[0.04]"}`}
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
      >
        {SKYLINE_HEIGHTS.map((h, i) => (
          <rect key={i} x={i * 50} y={100 - h} width={44} height={h} fill="#e2e8f0" />
        ))}
      </svg>

      {/* vignette — keeps the center clean and text-ready */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,transparent_35%,rgba(2,6,23,0.55)_100%)]" />
    </div>
  );
}

/* ---------------------------- Ticket Stub Card --------------------------- */

interface EventCardProps {
  ev: EventItem;
  featured?: boolean;
}

function EventCard({ ev, featured = false }: EventCardProps) {
  const [hovered, setHovered] = useState(false);
  const badge = badgeMeta(ev.badge);
  const soldPct = Math.max(2, 100 - Math.round((ev.ticketsLeft / ev.capacity) * 100));

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md shadow-slate-900/5 ring-1 ring-slate-900/5 transition-all duration-300 dark:bg-slate-900 dark:ring-white/5 ${
        hovered ? "-translate-y-1.5 shadow-2xl shadow-slate-900/20 dark:shadow-black/40" : ""
      } ${featured ? "w-[280px] shrink-0 sm:w-[320px]" : "w-full"}`}
    >
      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden sm:h-48">
        <img
          src={img(ev.img)}
          alt={ev.title}
          className={`h-full w-full object-cover transition-transform duration-700 ${
            hovered ? "scale-110" : "scale-100"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
        {badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${badge.cls}`}
          >
            {badge.label}
          </span>
        )}
        <button
          aria-label="Save event"
          className="absolute right-3 top-3 rounded-full bg-white/25 p-2 text-white backdrop-blur-md transition hover:bg-white/40"
        >
          <Star className="h-3.5 w-3.5" />
        </button>
        <div className="absolute bottom-3 left-3 rounded-lg bg-black/40 px-2 py-1 text-xs font-medium text-white backdrop-blur-md">
          {ev.category}
        </div>
      </div>

      {/* Perforated divider — the signature ticket-stub tear line */}
      <div className="relative flex items-center">
        <span className="absolute -left-3 h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-950" />
        <span className="absolute -right-3 h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-950" />
        <div className="mx-4 my-0 w-full border-t-2 border-dashed border-slate-200 dark:border-slate-700" />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <h3 className="font-serif text-[17px] font-semibold leading-snug text-slate-900 dark:text-slate-50">
          {ev.title}
        </h3>

        <div className="flex items-center gap-1.5 text-[13px] text-slate-500 dark:text-slate-400">
          <Calendar className="h-3.5 w-3.5" />
          <span className="font-mono text-[12px] tracking-tight">{ev.date} · {ev.time}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[13px] text-slate-500 dark:text-slate-400">
          <MapPin className="h-3.5 w-3.5" />
          <span>{ev.venue}, {ev.city}</span>
        </div>

        {/* urgency meter */}
        <div className="mt-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className={`h-full rounded-full ${
                soldPct > 85 ? "bg-rose-500" : soldPct > 60 ? "bg-amber-400" : "bg-emerald-400"
              }`}
              style={{ width: `${soldPct}%` }}
            />
          </div>
          <p className="mt-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
            {ev.ticketsLeft} tickets left
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-mono text-[15px] font-semibold text-slate-900 dark:text-slate-50">
            {formatPrice(ev.price, ev.currency)}
          </span>
          <button className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-amber-400 hover:text-slate-900 dark:bg-amber-400 dark:text-slate-900 dark:hover:bg-white">
            <Ticket className="h-3.5 w-3.5" />
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Skeleton Card ----------------------------- */

function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/5">
      <div className="h-44 w-full animate-pulse bg-slate-200 dark:bg-slate-800 sm:h-48" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-1.5 w-full animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}

/* --------------------------------- Hero ----------------------------------- */

interface HeroProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  dark: boolean;
}

function Hero({ query, setQuery, dark }: HeroProps) {
  const [slide, setSlide] = useState<number>(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setSlide((s) => (s + 1) % FEATURED_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer.current ?? undefined);
  }, []);

  const go = (dir: number) => {
    clearInterval(timer.current ?? undefined);
    setSlide((s) => (s + dir + FEATURED_SLIDES.length) % FEATURED_SLIDES.length);
  };

  const active = FEATURED_SLIDES[slide];

  return (
    <section className="relative overflow-hidden bg-slate-950">
      <AmbientBackground variant="hero" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
        <div className="max-w-2xl">
          <h1 className="font-serif-italic mt-5 text-5xl font-normal leading-[1.05] text-white sm:text-7xl">
            Discover Events Near You
          </h1>
          <p className="mt-4 max-w-lg text-base text-slate-300 sm:text-lg">
            From sold-out arenas to backroom gigs — find your next night out,
            and get your ticket in under a minute.
          </p>
        </div>

        {/* Search bar */}
        <div className="mt-8 flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.06] p-2 backdrop-blur-xl sm:flex-row sm:items-center sm:gap-0 sm:rounded-full">
          <div className="flex flex-1 items-center gap-2.5 px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, artists, venues…"
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <div className="hidden h-6 w-px bg-white/10 sm:block" />
          <div className="flex items-center gap-2.5 px-4 py-3 sm:w-44">
            <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="text-sm text-slate-300">Any date</span>
          </div>
          <div className="hidden h-6 w-px bg-white/10 sm:block" />
          <div className="flex items-center gap-2.5 px-4 py-3 sm:w-48">
            <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="text-sm text-slate-300">Kampala, UG</span>
          </div>
          <button className="m-1 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white sm:m-0">
            Search
          </button>
        </div>

        {/* Featured carousel */}
        <div className="relative mt-12 overflow-hidden rounded-3xl border border-white/10">
          <img
            src={img(active.img, 1400, 640)}
            alt={active.title}
            className="h-64 w-full object-cover transition-all duration-700 sm:h-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-end sm:p-8">
            <div>
              <span className="rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-semibold text-slate-900">
                Featured
              </span>
              <h3 className="font-serif-italic mt-3 text-3xl font-normal text-white sm:text-4xl">
                {active.title}
              </h3>
              <p className="mt-1 font-mono text-sm text-slate-300">
                {active.date} · {active.venue}, {active.city}
              </p>
            </div>
            <button className="flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-400">
              <Ticket className="h-4 w-4" /> Get tickets
            </button>
          </div>

          <button
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur hover:bg-black/50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur hover:bg-black/50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="absolute bottom-3 right-5 flex gap-1.5 sm:top-8 sm:bottom-auto">
            {FEATURED_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === slide ? "w-6 bg-amber-400" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Filter Panel --------------------------------- */

interface FilterPanelProps {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  toggles: ToggleState;
  setToggles: React.Dispatch<React.SetStateAction<ToggleState>>;
  price: number;
  setPrice: React.Dispatch<React.SetStateAction<number>>;
}

function FilterPanel({ category, setCategory, toggles, setToggles, price, setPrice }: FilterPanelProps) {
  const toggle = (key: keyof ToggleState) =>
    setToggles((t) => ({ ...t, [key]: !t[key] }));

  return (
    <section className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
        {/* category pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                category === c
                  ? "bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-900"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* advanced row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
            <Calendar className="h-4 w-4" /> This weekend
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
            <MapPin className="h-4 w-4" /> Within 25 km
          </div>

          <div className="flex min-w-[180px] flex-1 items-center gap-3 rounded-full border border-slate-200 px-4 py-2 dark:border-slate-800">
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="range"
              min={0}
              max={200000}
              step={5000}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-amber-400 dark:bg-slate-700"
            />
            <span className="whitespace-nowrap font-mono text-xs text-slate-500 dark:text-slate-400">
              ≤ {price.toLocaleString()}
            </span>
          </div>

          <div className="ml-auto flex gap-2">
            {(
              [
                { key: "trending", label: "Trending", icon: Flame },
                { key: "recommended", label: "Recommended", icon: Sparkles },
                { key: "almostSoldOut", label: "Almost Sold Out", icon: Timer },
              ] as { key: keyof ToggleState; label: string; icon: typeof Flame }[]
            ).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => toggle(key)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                  toggles[key]
                    ? "border-transparent bg-violet-500 text-white"
                    : "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:text-slate-300"
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Map View --------------------------------- */

interface MapViewProps {
  events: EventItem[];
}

function MapView({ events }: MapViewProps) {
  // Deterministic pseudo-positions for a decorative map mock.
  const positions = useMemo(
    () =>
      events.map((e, i) => ({
        ...e,
        top: 15 + ((i * 37) % 70),
        left: 10 + ((i * 53) % 80),
      })),
    [events]
  );

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
      <div className="absolute inset-0 [background-image:radial-gradient(circle,rgba(100,116,139,0.25)_1px,transparent_1px)] [background-size:22px_22px]" />
      {positions.map((p) => (
        <div
          key={p.id}
          className="group absolute -translate-x-1/2 -translate-y-1/2"
          style={{ top: `${p.top}%`, left: `${p.left}%` }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-slate-900 shadow-lg ring-4 ring-amber-400/30 transition-transform group-hover:scale-110">
            {p.ticketsLeft < 100 ? "!" : ""}
            <MapPin className="h-4 w-4" />
          </div>
          <div className="pointer-events-none absolute left-1/2 top-11 w-48 -translate-x-1/2 rounded-xl bg-slate-900 p-3 text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100 dark:bg-slate-100 dark:text-slate-900">
            <p className="font-serif text-sm font-semibold">{p.title}</p>
            <p className="mt-0.5 font-mono text-[11px] opacity-70">{p.venue}</p>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow dark:bg-slate-800 dark:text-slate-300">
        <span className="h-2 w-2 rounded-full bg-amber-400" /> {events.length} events in view
      </div>
    </div>
  );
}

/* ----------------------------- Main Component -------------------------------- */

export default function TicketCentralHome() {
  const [dark, setDark] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [category, setCategory] = useState<string>("All");
  const [price, setPrice] = useState<number>(200000);
  const [toggles, setToggles] = useState<ToggleState>({
    trending: false,
    recommended: false,
    almostSoldOut: false,
  });
  const [view, setView] = useState<ViewMode>("grid");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const filtered = EVENTS.filter((e) => {
    if (category !== "All" && e.category !== category) return false;
    if (e.price > price) return false;
    if (query && !`${e.title} ${e.venue}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (toggles.trending && e.badge !== "trending") return false;
    if (toggles.almostSoldOut && e.badge !== "almost-sold-out") return false;
    return true;
  });

  return (
    <div className={dark ? "dark" : ""}>
      <style>{FONT_IMPORT}{`
        .font-serif { font-family: 'Poppins', sans-serif; }
        .font-serif-italic { font-family: 'Poppins', sans-serif; font-style: normal; }
        body, .ticketcentral-root { font-family: 'Poppins', sans-serif; }
        .font-mono { font-family: 'Poppins', sans-serif; }

        .tc-grid {
          background-image:
            linear-gradient(rgba(226,232,240,0.7) 1px, transparent 1px),
            linear-gradient(90deg, rgba(226,232,240,0.7) 1px, transparent 1px);
          background-size: 56px 56px;
          -webkit-mask-image: radial-gradient(ellipse 75% 65% at 50% 30%, black 0%, transparent 78%);
          mask-image: radial-gradient(ellipse 75% 65% at 50% 30%, black 0%, transparent 78%);
          animation: tc-grid-pan 50s linear infinite;
        }
        @keyframes tc-grid-pan {
          from { background-position: 0 0; }
          to { background-position: 112px 112px; }
        }

        .tc-orb {
          filter: blur(70px);
          mix-blend-mode: screen;
          animation: tc-orb-float 16s ease-in-out infinite;
        }
        @keyframes tc-orb-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(4%, -5%) scale(1.08); }
        }

        .tc-wave { animation: tc-wave-drift 34s linear infinite; }
        @keyframes tc-wave-drift {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .tc-streak {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
          transform: rotate(-8deg);
          opacity: 0;
          animation: tc-streak-move 10s ease-in-out infinite;
        }
        @keyframes tc-streak-move {
          0% { opacity: 0; transform: translateX(-15%) rotate(-8deg); }
          45% { opacity: 0.55; }
          100% { opacity: 0; transform: translateX(25%) rotate(-8deg); }
        }

        .tc-spotlight {
          filter: blur(18px);
          animation: tc-spotlight-sweep 12s ease-in-out infinite;
        }
        @keyframes tc-spotlight-sweep {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(6deg); }
        }

        .tc-confetti {
          animation-name: tc-confetti-drift;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        @keyframes tc-confetti-drift {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(180deg); }
          100% { transform: translateY(0) rotate(360deg); }
        }

        .tc-sparkle {
          animation-name: tc-twinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        @keyframes tc-twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.8); }
          50% { opacity: 0.85; transform: scale(1.15); }
        }

        @media (prefers-reduced-motion: reduce) {
          .tc-grid, .tc-orb, .tc-wave, .tc-streak, .tc-spotlight, .tc-confetti, .tc-sparkle { animation: none !important; }
        }
      `}</style>

      <div className="ticketcentral-root relative z-10 min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-transparent dark:text-slate-50">
        {dark && <AmbientBackground variant="page" />}
        {/* Navbar */}
        <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-slate-50/80 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/80">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400">
                <Ticket className="h-4.5 w-4.5 text-slate-900" />
              </div>
              <span className="font-serif text-lg font-semibold">TicketCentral</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="hidden rounded-full border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-900 sm:block">
                Organizer Portal
              </button>
              <button
                onClick={() => setDark((d) => !d)}
                className="rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold dark:border-slate-700"
              >
                {dark ? "Light" : "Dark"}
              </button>
            </div>
          </div>
        </header>

        <Hero query={query} setQuery={setQuery} dark={dark} />

        <FilterPanel
          category={category}
          setCategory={setCategory}
          toggles={toggles}
          setToggles={setToggles}
          price={price}
          setPrice={setPrice}
        />

        {/* Grid / Map section */}
        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold">
              {filtered.length} events {category !== "All" ? `in ${category}` : "near you"}
            </h2>
            <div className="flex rounded-full border border-slate-200 p-1 dark:border-slate-800">
              <button
                onClick={() => setView("grid")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  view === "grid" ? "bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-900" : "text-slate-500"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" /> Grid
              </button>
              <button
                onClick={() => setView("map")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  view === "map" ? "bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-900" : "text-slate-500"
                }`}
              >
                <MapIcon className="h-3.5 w-3.5" /> Map
              </button>
            </div>
          </div>

          {view === "grid" ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                : filtered.map((ev) => <EventCard key={ev.id} ev={ev} />)}
              {!loading && filtered.length === 0 && (
                <p className="col-span-full py-16 text-center text-slate-500">
                  No events match your filters yet — try widening your price range or radius.
                </p>
              )}
            </div>
          ) : (
            <MapView events={filtered.length ? filtered : EVENTS} />
          )}
        </section>

        {/* Recommended carousel */}
        <section className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
          <div className="mb-5 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-500" />
            <h2 className="font-serif text-2xl font-semibold">Because you liked Afrobeats Fest Live</h2>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {RECOMMENDED.map((ev) => (
              <EventCard key={`rec-${ev.id}`} ev={ev} featured />
            ))}
          </div>
        </section>

        {/* Social proof */}
        <section className="border-y border-slate-200 bg-white py-14 dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
              {[
                ["1,240+", "events live"],
                ["50,000+", "tickets sold today"],
                ["98%", "buyers rate 5 stars"],
                ["30 sec", "average checkout time"],
              ].map(([stat, label]) => (
                <div key={label}>
                  <p className="font-serif text-3xl font-semibold text-amber-500 sm:text-4xl">{stat}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { name: "Grace N.", quote: "Bought tickets in under a minute — the stub design even shows exactly how many seats are left." },
                { name: "David O.", quote: "Best discovery page I've used. Found a comedy show near me I'd never have known about." },
                { name: "Amina K.", quote: "The map view made planning our festival weekend so much easier." },
              ].map((t) => (
                <div key={t.name} className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-950">
                  <div className="flex gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">"{t.quote}"</p>
                  <p className="mt-3 font-mono text-xs text-slate-400">{t.name}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Secure payments</span>
              <span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-emerald-500" /> Verified organizers</span>
              <span className="flex items-center gap-2"><Ticket className="h-4 w-4 text-emerald-500" /> Instant e-tickets</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-950 py-14 text-slate-300">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 sm:grid-cols-4 sm:px-8">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400">
                  <Ticket className="h-4 w-4 text-slate-900" />
                </div>
                <span className="font-serif text-base font-semibold text-white">TicketCentral</span>
              </div>
              <p className="mt-3 text-sm text-slate-400">Every ticket, one stub away.</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Categories</p>
              <ul className="mt-3 space-y-2 text-sm">
                {CATEGORIES.slice(1, 6).map((c) => (
                  <li key={c}><a href="#" className="hover:text-white">{c}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Company</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Organizer Portal</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Twitter / X</a></li>
                <li><a href="#" className="hover:text-white">Instagram</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Stay in the loop</p>
              <div className="mt-3 flex items-center gap-2 rounded-full border border-slate-700 px-3 py-2">
                <Mail className="h-3.5 w-3.5 text-slate-500" />
                <input
                  placeholder="you@email.com"
                  className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                />
              </div>
              <button className="mt-2 w-full rounded-full bg-amber-400 py-2 text-xs font-semibold text-slate-900">
                Subscribe
              </button>
            </div>
          </div>
          <p className="mt-10 text-center text-xs text-slate-600">
            © {new Date().getFullYear()} TicketCentral. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}