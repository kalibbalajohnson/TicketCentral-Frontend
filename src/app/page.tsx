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
   Theme: a predominantly white page. Vibrant orange is used only as
   an accent — buttons, active states, badges, icons — never as a
   large fill. The only intentionally dull/dark surface on the page
   is the footer, which grounds the page the way a printed program's
   back cover would.
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
      return { label: "Selling Fast", cls: "bg-amber-500 text-white" };
    case "trending":
      return { label: "Trending", cls: "bg-teal-600 text-white" };
    case "almost-sold-out":
      return { label: "Almost Sold Out", cls: "bg-rose-600 text-white" };
    default:
      return null;
  }
}

/* ------------------------- Hero Ambient Background -------------------------
   A light, restrained decorative layer for the hero only: a faint mesh
   grid, a couple of soft orange/gold blobs, a whisper skyline, and a few
   twinkling accents. Everything sits at low opacity on a white field, so
   it reads as texture rather than color.
----------------------------------------------------------------------- */

const SKYLINE_HEIGHTS = [38, 64, 48, 82, 56, 96, 44, 72, 60, 88, 40, 68, 52, 90, 46, 74, 58, 84, 42, 66];

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
        fill="#F59E0B"
      />
    </svg>
  );
}

function HeroAmbientBackground() {
  return (
    <div aria-hidden="true" className="tc-ambient pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* faint mesh grid */}
      <div className="tc-grid absolute inset-0" />

      {/* soft orange/gold blobs — texture, not fills */}
      <div className="tc-orb absolute -top-16 left-[8%] h-[360px] w-[360px] rounded-full bg-orange-200" style={{ opacity: 0.45, animationDelay: "0s" }} />
      <div className="tc-orb absolute top-[6%] right-[6%] h-[300px] w-[300px] rounded-full bg-amber-200" style={{ opacity: 0.4, animationDelay: "-6s" }} />
      <div className="tc-orb absolute bottom-[-10%] left-[40%] h-[320px] w-[320px] rounded-full bg-orange-100" style={{ opacity: 0.55, animationDelay: "-10s" }} />

      {/* twinkling accents */}
      {SPARKLES.map((s, i) => (
        <div
          key={i}
          className="tc-sparkle absolute"
          style={{ top: `${s.top}%`, left: `${s.left}%`, animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }}
        >
          <Sparkle size={s.size} />
        </div>
      ))}

      {/* flowing wave ribbon */}
      <svg className="tc-wave absolute bottom-0 left-0 h-40 w-[200%] opacity-[0.35] sm:h-52" viewBox="0 0 2400 300" preserveAspectRatio="none">
        <defs>
          <linearGradient id="tcWaveGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFEDD5" />
            <stop offset="50%" stopColor="#FDBA74" />
            <stop offset="100%" stopColor="#FFEDD5" />
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

      {/* light streak */}
      <div className="tc-streak absolute left-[-20%] top-[26%] h-px w-[140%]" style={{ animationDelay: "0s" }} />

      {/* whisper-quiet skyline silhouette */}
      <svg className="absolute bottom-0 left-0 w-full opacity-[0.06]" viewBox="0 0 1000 100" preserveAspectRatio="none">
        {SKYLINE_HEIGHTS.map((h, i) => (
          <rect key={i} x={i * 50} y={100 - h} width={44} height={h} fill="#EA580C" />
        ))}
      </svg>
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
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md shadow-orange-900/5 ring-1 ring-orange-900/[0.06] transition-all duration-300 ${hovered ? "-translate-y-1.5 shadow-2xl shadow-orange-900/15" : ""
        } ${featured ? "w-[280px] shrink-0 sm:w-[320px]" : "w-full"}`}
    >
      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden sm:h-48">
        <img
          src={img(ev.img)}
          alt={ev.title}
          className={`h-full w-full object-cover transition-transform duration-700 ${hovered ? "scale-110" : "scale-100"
            }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
        {badge && (
          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${badge.cls}`}>
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
        <span className="absolute -left-3 h-6 w-6 rounded-full bg-orange-50" />
        <span className="absolute -right-3 h-6 w-6 rounded-full bg-orange-50" />
        <div className="mx-4 my-0 w-full border-t-2 border-dashed border-orange-200" />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <h3 className="font-serif text-[17px] font-semibold leading-snug text-slate-900">
          {ev.title}
        </h3>

        <div className="flex items-center gap-1.5 text-[13px] text-slate-500">
          <Calendar className="h-3.5 w-3.5" />
          <span className="font-mono text-[12px] tracking-tight">{ev.date} · {ev.time}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[13px] text-slate-500">
          <MapPin className="h-3.5 w-3.5" />
          <span>{ev.venue}, {ev.city}</span>
        </div>

        {/* urgency meter */}
        <div className="mt-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-orange-50">
            <div
              className={`h-full rounded-full ${soldPct > 85 ? "bg-rose-600" : soldPct > 60 ? "bg-orange-400" : "bg-emerald-500"
                }`}
              style={{ width: `${soldPct}%` }}
            />
          </div>
          <p className="mt-1 font-mono text-[11px] text-slate-500">
            {ev.ticketsLeft} tickets left
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-mono text-[15px] font-semibold text-slate-900">
            {formatPrice(ev.price, ev.currency)}
          </span>
          <button className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-orange-600">
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
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-orange-900/[0.06]">
      <div className="h-44 w-full animate-pulse bg-orange-100 sm:h-48" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-orange-100" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-orange-100" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-orange-100" />
        <div className="h-1.5 w-full animate-pulse rounded-full bg-orange-100" />
      </div>
    </div>
  );
}

/* --------------------------------- Hero ----------------------------------- */

interface HeroProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

function Hero({ query, setQuery }: HeroProps) {
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
    <section className="relative overflow-hidden bg-white">
      <HeroAmbientBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-700">
            <Ticket className="h-3.5 w-3.5" />
            Uganda's #1 Ticketing Platform
          </span>
          <h1 className="font-serif-italic mt-4 text-5xl font-normal leading-[1.05] text-slate-900 sm:text-7xl">
            Discover Events <span className="text-orange-600">Near You</span>
          </h1>
          <p className="mt-4 max-w-lg text-base text-slate-600 sm:text-lg">
            From sold-out arenas to backroom gigs — find your next night out,
            and get your ticket in under a minute.
          </p>
        </div>

        {/* Search bar */}
        <div className="mt-8 flex flex-col gap-2 rounded-2xl border border-orange-100 bg-white p-2 shadow-lg shadow-orange-900/[0.06] sm:flex-row sm:items-center sm:gap-0 sm:rounded-full">
          <div className="flex flex-1 items-center gap-2.5 px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, artists, venues…"
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <div className="hidden h-6 w-px bg-orange-100 sm:block" />
          <div className="flex items-center gap-2.5 px-4 py-3 sm:w-44">
            <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="text-sm text-slate-600">Any date</span>
          </div>
          <div className="hidden h-6 w-px bg-orange-100 sm:block" />
          <div className="flex items-center gap-2.5 px-4 py-3 sm:w-48">
            <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="text-sm text-slate-600">Kampala, UG</span>
          </div>
          <button className="m-1 rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 sm:m-0">
            Search
          </button>
        </div>

        {/* Featured carousel */}
        <div className="relative mt-12 overflow-hidden rounded-3xl border border-orange-100 shadow-xl shadow-orange-900/[0.06]">
          <img
            src={img(active.img, 1400, 640)}
            alt={active.title}
            className="h-64 w-full object-cover transition-all duration-700 sm:h-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-end sm:p-8">
            <div>
              <span className="rounded-full bg-orange-600 px-2.5 py-1 text-[11px] font-semibold text-white">
                Featured
              </span>
              <h3 className="font-serif-italic mt-3 text-3xl font-normal text-white sm:text-4xl">
                {active.title}
              </h3>
              <p className="mt-1 font-mono text-sm text-white/80">
                {active.date} · {active.venue}, {active.city}
              </p>
            </div>
            <button className="flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-orange-600 hover:text-white">
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
                className={`h-1.5 rounded-full transition-all ${i === slide ? "w-6 bg-orange-500" : "w-1.5 bg-white/50"
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
    <section className="sticky top-0 z-30 border-b border-orange-100 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        {/* category pills */}
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${category === c
                  ? "bg-orange-600 text-white"
                  : "bg-orange-50 text-slate-600 hover:bg-orange-100 hover:text-orange-700"
                }`}
            >
              {c}
            </button>
          ))}
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
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-orange-100 bg-orange-50/40">
      <div className="absolute inset-0 [background-image:radial-gradient(circle,rgba(234,88,12,0.16)_1px,transparent_1px)] [background-size:22px_22px]" />
      {positions.map((p) => (
        <div
          key={p.id}
          className="group absolute -translate-x-1/2 -translate-y-1/2"
          style={{ top: `${p.top}%`, left: `${p.left}%` }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white shadow-lg ring-4 ring-orange-500/25 transition-transform group-hover:scale-110">
            {p.ticketsLeft < 100 ? "!" : ""}
            <MapPin className="h-4 w-4" />
          </div>
          <div className="pointer-events-none absolute left-1/2 top-11 w-48 -translate-x-1/2 rounded-xl bg-slate-900 p-3 text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
            <p className="font-serif text-sm font-semibold">{p.title}</p>
            <p className="mt-0.5 font-mono text-[11px] opacity-70">{p.venue}</p>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow">
        <span className="h-2 w-2 rounded-full bg-orange-500" /> {events.length} events in view
      </div>
    </div>
  );
}

/* ----------------------------- Main Component -------------------------------- */

export default function TicketCentralHome() {
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
    <div>
      <style>{FONT_IMPORT}{`
        .font-serif { font-family: 'Poppins', sans-serif; }
        .font-serif-italic { font-family: 'Poppins', sans-serif; font-style: normal; }
        body, .ticketcentral-root { font-family: 'Poppins', sans-serif; }
        .font-mono { font-family: 'Poppins', sans-serif; }

        .tc-grid {
          background-image:
            linear-gradient(rgba(234,88,12,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(234,88,12,0.07) 1px, transparent 1px);
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
          background: linear-gradient(90deg, transparent, rgba(234,88,12,0.18), transparent);
          transform: rotate(-8deg);
          opacity: 0;
          animation: tc-streak-move 10s ease-in-out infinite;
        }
        @keyframes tc-streak-move {
          0% { opacity: 0; transform: translateX(-15%) rotate(-8deg); }
          45% { opacity: 0.6; }
          100% { opacity: 0; transform: translateX(25%) rotate(-8deg); }
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
          .tc-grid, .tc-orb, .tc-wave, .tc-streak, .tc-sparkle { animation: none !important; }
        }
      `}</style>

      <div className="ticketcentral-root relative z-10 min-h-screen bg-white text-slate-900 transition-colors">
        {/* Navbar */}
        <header className="sticky top-0 z-40 border-b border-orange-100 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
                <Ticket className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="font-serif text-lg font-semibold">TicketCentral</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium hover:border-orange-300 hover:bg-orange-50">
                Organizer Portal
              </button>
            </div>
          </div>
        </header>

        <Hero query={query} setQuery={setQuery} />

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
            <div className="flex rounded-full border border-orange-100 p-1">
              <button
                onClick={() => setView("grid")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${view === "grid" ? "bg-orange-600 text-white" : "text-slate-500"
                  }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" /> Grid
              </button>
              <button
                onClick={() => setView("map")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${view === "map" ? "bg-orange-600 text-white" : "text-slate-500"
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
            <Sparkles className="h-5 w-5 text-orange-500" />
            <h2 className="font-serif text-2xl font-semibold">Because you liked Afrobeats Fest Live</h2>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {RECOMMENDED.map((ev) => (
              <EventCard key={`rec-${ev.id}`} ev={ev} featured />
            ))}
          </div>
        </section>

        {/* Social proof */}
        <section className="border-y border-orange-100 bg-orange-50/30 py-14">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
              {[
                ["1,240+", "events live"],
                ["50,000+", "tickets sold today"],
                ["98%", "buyers rate 5 stars"],
                ["30 sec", "average checkout time"],
              ].map(([stat, label]) => (
                <div key={label}>
                  <p className="font-serif text-3xl font-semibold text-orange-600 sm:text-4xl">{stat}</p>
                  <p className="mt-1 text-sm text-slate-500">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { name: "Grace N.", quote: "Bought tickets in under a minute — the stub design even shows exactly how many seats are left." },
                { name: "David O.", quote: "Best discovery page I've used. Found a comedy show near me I'd never have known about." },
                { name: "Amina K.", quote: "The map view made planning our festival weekend so much easier." },
              ].map((t) => (
                <div key={t.name} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-orange-900/[0.05]">
                  <div className="flex gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-slate-600">"{t.quote}"</p>
                  <p className="mt-3 font-mono text-xs text-slate-400">{t.name}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Secure payments</span>
              <span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-emerald-500" /> Verified organizers</span>
              <span className="flex items-center gap-2"><Ticket className="h-4 w-4 text-emerald-500" /> Instant e-tickets</span>
            </div>
          </div>
        </section>

        {/* Footer — the page's one intentionally dull, dark surface */}
        <footer className="bg-[#1C1410] py-14 text-orange-100/80">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 sm:grid-cols-4 sm:px-8">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500">
                  <Ticket className="h-4 w-4 text-white" />
                </div>
                <span className="font-serif text-base font-semibold text-white">TicketCentral</span>
              </div>
              <p className="mt-3 text-sm text-orange-100/50">Uganda's #1 ticketing platform. Every ticket, one stub away.</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-100/40">Categories</p>
              <ul className="mt-3 space-y-2 text-sm">
                {CATEGORIES.slice(1, 6).map((c) => (
                  <li key={c}><a href="#" className="hover:text-orange-400">{c}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-100/40">Company</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a href="#" className="hover:text-orange-400">Organizer Portal</a></li>
                <li><a href="#" className="hover:text-orange-400">Help Center</a></li>
                <li><a href="#" className="hover:text-orange-400">Careers</a></li>
                <li><a href="#" className="hover:text-orange-400">Twitter / X</a></li>
                <li><a href="#" className="hover:text-orange-400">Instagram</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-100/40">Stay in the loop</p>
              <div className="mt-3 flex items-center gap-2 rounded-full border border-white/15 px-3 py-2">
                <Mail className="h-3.5 w-3.5 text-orange-100/40" />
                <input
                  placeholder="you@email.com"
                  className="w-full bg-transparent text-sm text-white placeholder:text-orange-100/40 focus:outline-none"
                />
              </div>
              <button className="mt-2 w-full rounded-full bg-orange-500 py-2 text-xs font-semibold text-white hover:bg-orange-400">
                Subscribe
              </button>
            </div>
          </div>
          <p className="mt-10 text-center text-xs text-orange-100/30">
            © {new Date().getFullYear()} TicketCentral. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}