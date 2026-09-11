/* eslint-disable @next/next/no-img-element */
"use client";

import type { Config, Data } from "@puckeditor/core";
import { motion } from "framer-motion";
import {
  MapPin,
  ExternalLink,
  Copy,
  QrCode,
  Clock,
  Heart,
  Send,
  User,
  MessageSquare,
  CalendarDays,
  CalendarPlus,
  Navigation,
  Check,
  Gift,
  Package,
  Sparkles,
  X,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { submitGuestbookEntry, getGuestbookEntries } from "@/app/actions/invitation";
import ImageUploadField from "@/components/editor/ImageUploadField";
import {
  getThemeStyles,
  type WeddingThemeConfig,
  defaultThemeConfig,
} from "@/config/theme.config";

/* ─── Animation Helpers ─── */
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" as const },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

/* ─── Type Definitions ─── */

export type RootProps = {
  themeConfig?: WeddingThemeConfig;
  title?: string;
};

export type InvitationData = Data<Components, RootProps>;

type CoverHeroProps = {
  groomName: string;
  brideName: string;
  weddingDate: string;
  coverImageUrl: string;
  customGreeting: string;
  headingSize?: "default" | "compact" | "large" | "dramatic";
  customHeadingColor?: string;
  showBadge?: boolean;
  badgeText?: string;
  showGreeting?: boolean;
  showCoupleNames?: boolean;
  showDate?: boolean;
};

type PersonData = {
  photoUrl: string;
  fullName: string;
  parentNames: string;
  instagramHandle: string;
};

type CoupleProfileProps = {
  groomData: PersonData;
  brideData: PersonData;
  sectionTitle: string;
  showPhotos?: boolean;
  showParentNames?: boolean;
  showInstagram?: boolean;
  showHeartDivider?: boolean;
  showRoleLabels?: boolean;
};

type EventItem = {
  eventName: string;
  date: string;
  timeRange: string;
  venueName: string;
  venueAddress: string;
  mapsUrl?: string;
  showMapEmbed?: boolean;
  calendarDate?: string;
  calendarStartTime?: string;
  calendarEndTime?: string;
};

type EventScheduleProps = {
  sectionTitle: string;
  events: EventItem[];
  showDateTime?: boolean;
  showVenueAddress?: boolean;
  showMapsButton?: boolean;
  showCalendarButton?: boolean;
  showCopyAddressButton?: boolean;
};

type CountdownTimerProps = {
  targetDate: string;
  label: string;
  showLabel?: boolean;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
};

type StoryItem = {
  year: string;
  title: string;
  description: string;
  photoUrl: string;
};

type LoveStoryTimelineProps = {
  sectionTitle: string;
  stories: StoryItem[];
  showStoryPhotos?: boolean;
  showStoryYear?: boolean;
  showStoryDescription?: boolean;
};

type GalleryImage = {
  imageUrl: string;
  caption: string;
};

type PhotoGalleryProps = {
  sectionTitle: string;
  images: GalleryImage[];
  showCaptions?: boolean;
  columns?: "2" | "3";
  imageAspectRatio?: "square" | "portrait";
};

type BankAccount = {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
};

type DigitalGiftProps = {
  sectionTitle: string;
  accounts: BankAccount[];
  qrisImageUrl: string;
  showBankAccounts?: boolean;
  showCopyAccount?: boolean;
  showQRIS?: boolean;
  showPhysicalGift?: boolean;
  physicalGiftAddress?: string;
  physicalGiftRecipient?: string;
};

type RSVPGuestbookProps = {
  invitationId: string;
  sectionTitle: string;
  showAttendanceCheck?: boolean;
  showGuestCountSelect?: boolean;
  showMessageField?: boolean;
  showWishesFeed?: boolean;
};

type WeddingQuoteProps = {
  title?: string;
  arabicText?: string;
  translationText?: string;
  sourceText?: string;
  quoteStyle?: "classic" | "card" | "minimal";
  showArabic?: boolean;
};

type Components = {
  CoverHero: CoverHeroProps;
  CoupleProfile: CoupleProfileProps;
  WeddingQuote: WeddingQuoteProps;
  EventSchedule: EventScheduleProps;
  CountdownTimer: CountdownTimerProps;
  LoveStoryTimeline: LoveStoryTimelineProps;
  PhotoGallery: PhotoGalleryProps;
  DigitalGift: DigitalGiftProps;
  RSVPGuestbook: RSVPGuestbookProps;
};

/* ─────────────────────────────────────────────
   1. COVER HERO
   ───────────────────────────────────────────── */

function CoverHeroRender({
  groomName,
  brideName,
  weddingDate,
  coverImageUrl,
  customGreeting,
  headingSize = "default",
  customHeadingColor,
  showBadge = true,
  badgeText = "The Wedding of",
  showGreeting = true,
  showCoupleNames = true,
  showDate = true,
}: CoverHeroProps) {
  const sizeClasses =
    headingSize === "compact"
      ? "text-4xl sm:text-5xl"
      : headingSize === "large"
      ? "text-6xl sm:text-7xl"
      : headingSize === "dramatic"
      ? "text-7xl sm:text-8xl"
      : "text-5xl sm:text-6xl";

  const headingStyle = customHeadingColor ? { color: customHeadingColor } : undefined;

  return (
    <motion.section
      {...fadeInUp}
      className="relative min-h-[85vh] flex flex-col items-center justify-center text-center overflow-hidden"
    >
      {/* Background Image */}
      {coverImageUrl && (
        <div className="absolute inset-0 z-0">
          <img
            src={coverImageUrl}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-stone-50/75 backdrop-blur-[2px]" />
        </div>
      )}

      <div className="relative z-10 px-6 py-20 max-w-xl mx-auto">
        {showBadge && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-stone-200/80 shadow-2xs mb-5 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-stone-600 font-semibold">
              {badgeText || "The Wedding of"}
            </span>
          </div>
        )}

        {showGreeting && customGreeting && (
          <p className="text-xs uppercase tracking-[0.3em] text-stone-400 font-medium mb-6">
            {customGreeting}
          </p>
        )}

        {showCoupleNames && (
          <>
            <h1
              style={headingStyle}
              className={`font-serif ${sizeClasses} font-semibold text-stone-900 leading-tight mb-3 transition-all`}
            >
              {groomName}
            </h1>

            <div className="flex items-center justify-center gap-4 my-4">
              <div className="w-12 h-px bg-stone-300" />
              <span className="font-serif text-2xl text-stone-400 italic">&amp;</span>
              <div className="w-12 h-px bg-stone-300" />
            </div>

            <h1
              style={headingStyle}
              className={`font-serif ${sizeClasses} font-semibold text-stone-900 leading-tight mb-8 transition-all`}
            >
              {brideName}
            </h1>
          </>
        )}

        {showDate && weddingDate && (
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-stone-200 bg-white/80 backdrop-blur-sm shadow-2xs">
            <CalendarDays className="w-4 h-4 text-stone-400" />
            <span className="text-sm text-stone-600 tracking-wide">
              {weddingDate}
            </span>
          </div>
        )}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-stone-50 to-transparent" />
    </motion.section>
  );
}

/* ─────────────────────────────────────────────
   2. COUPLE PROFILE
   ───────────────────────────────────────────── */

function PersonCard({
  data,
  label,
  showPhotos = true,
  showParentNames = true,
  showInstagram = true,
  showRoleLabels = true,
}: {
  data: PersonData;
  label: string;
  showPhotos?: boolean;
  showParentNames?: boolean;
  showInstagram?: boolean;
  showRoleLabels?: boolean;
}) {
  return (
    <motion.div {...fadeInUp} className="flex flex-col items-center text-center">
      {showPhotos &&
        (data.photoUrl ? (
          <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-stone-200 mb-5 shadow-sm">
            <img
              src={data.photoUrl}
              alt={data.fullName}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-36 h-36 rounded-full bg-stone-100 border-2 border-stone-200 flex items-center justify-center mb-5">
            <User className="w-12 h-12 text-stone-300" />
          </div>
        ))}

      {showRoleLabels && (
        <p className="text-xs uppercase tracking-[0.2em] text-stone-400 mb-2">
          {label}
        </p>
      )}

      <h3 className="font-serif text-2xl font-semibold text-stone-900 mb-2">
        {data.fullName}
      </h3>

      {showParentNames && data.parentNames && (
        <p className="text-sm text-stone-500 leading-relaxed mb-3">
          {data.parentNames}
        </p>
      )}

      {showInstagram && data.instagramHandle && (
        <a
          href={`https://instagram.com/${data.instagramHandle.replace("@", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-600 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>{data.instagramHandle}</span>
        </a>
      )}
    </motion.div>
  );
}

function CoupleProfileRender({
  groomData,
  brideData,
  sectionTitle,
  showPhotos = true,
  showParentNames = true,
  showInstagram = true,
  showHeartDivider = true,
  showRoleLabels = true,
}: CoupleProfileProps) {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-md mx-auto">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-stone-400 mb-3">
            {sectionTitle}
          </p>
          <div className="section-divider" />
        </motion.div>

        <div className="space-y-14">
          <PersonCard
            data={groomData}
            label="Mempelai Pria"
            showPhotos={showPhotos}
            showParentNames={showParentNames}
            showInstagram={showInstagram}
            showRoleLabels={showRoleLabels}
          />
          {showHeartDivider && (
            <div className="flex items-center justify-center">
              <Heart className="w-5 h-5 text-stone-300" />
            </div>
          )}
          <PersonCard
            data={brideData}
            label="Mempelai Wanita"
            showPhotos={showPhotos}
            showParentNames={showParentNames}
            showInstagram={showInstagram}
            showRoleLabels={showRoleLabels}
          />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   3. EVENT SCHEDULE
   ───────────────────────────────────────────── */

function EventCardItem({
  event,
  index,
  showDateTime = true,
  showVenueAddress = true,
  showMapsButton = true,
  showCalendarButton = true,
  showCopyAddressButton = true,
}: {
  event: EventItem;
  index: number;
  showDateTime?: boolean;
  showVenueAddress?: boolean;
  showMapsButton?: boolean;
  showCalendarButton?: boolean;
  showCopyAddressButton?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  // Smart maps URL (custom or fallback to search query)
  const resolvedMapsUrl =
    event.mapsUrl && event.mapsUrl.trim().length > 0
      ? event.mapsUrl
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${event.venueName} ${event.venueAddress}`
        )}`;

  // Google Calendar URL generator
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(event.eventName || "Acara Pernikahan");
    const details = encodeURIComponent(
      `${event.eventName}\nTempat: ${event.venueName}\nAlamat: ${event.venueAddress}`
    );
    const location = encodeURIComponent(
      `${event.venueName}, ${event.venueAddress}`
    );

    let datesParam = "";
    if (event.calendarDate && event.calendarDate.trim().length > 0) {
      const cleanDate = event.calendarDate.replace(/-/g, "").trim();
      const start =
        (event.calendarStartTime || "09:00").replace(/:/g, "").trim() + "00";
      const end =
        (event.calendarEndTime || "12:00").replace(/:/g, "").trim() + "00";
      datesParam = `&dates=${cleanDate}T${start}/${cleanDate}T${end}`;
    }

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}${datesParam}`;
  };

  const handleCopyAddress = () => {
    if (!event.venueAddress) return;
    navigator.clipboard.writeText(`${event.venueName} - ${event.venueAddress}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Google Maps Iframe Embed URL without API key requirement
  const embedMapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    `${event.venueName} ${event.venueAddress}`
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <motion.div
      {...fadeInUp}
      transition={{ ...fadeInUp.transition, delay: index * 0.1 }}
      className="bg-white rounded-2xl p-6 border border-stone-200/70 shadow-xs hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
          <Clock className="w-4 h-4 text-stone-500" />
        </div>
        <h3 className="font-serif text-xl font-semibold text-stone-900">
          {event.eventName}
        </h3>
      </div>

      <div className="space-y-2 text-sm text-stone-600 mb-5">
        {showDateTime && (
          <p className="flex items-start gap-2">
            <CalendarDays className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
            <span>
              {event.date} · {event.timeRange}
            </span>
          </p>
        )}
        {showVenueAddress && (
          <p className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
            <span>
              <strong className="text-stone-800">{event.venueName}</strong>
              <br />
              {event.venueAddress}
            </span>
          </p>
        )}
      </div>

      {/* Embedded Google Maps Interactive Iframe */}
      {event.showMapEmbed && (
        <div className="mb-5 rounded-xl overflow-hidden border border-stone-200/80 shadow-2xs aspect-video w-full bg-stone-100">
          <iframe
            title={`Peta Lokasi ${event.eventName}`}
            src={embedMapsUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}

      {/* Action Buttons */}
      {(showMapsButton ||
        showCalendarButton ||
        (showCopyAddressButton && event.venueAddress)) && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
          {showMapsButton && (
            <a
              href={resolvedMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-stone-200 bg-white
                text-xs font-medium text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-all shadow-2xs"
              title="Buka Petunjuk Arah Google Maps"
            >
              <Navigation className="w-3.5 h-3.5 text-stone-500" />
              <span>Google Maps</span>
            </a>
          )}

          {showCalendarButton && (
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-stone-200 bg-white
                text-xs font-medium text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-all shadow-2xs"
              title="Simpan Acara ke Google Calendar"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-amber-600" />
              <span>Google Calendar</span>
            </a>
          )}

          {showCopyAddressButton && event.venueAddress && (
            <button
              type="button"
              onClick={handleCopyAddress}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-transparent
                text-xs font-medium text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-all ml-auto"
              title="Salin Alamat Lokasi"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Alamat</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

function EventScheduleRender({
  sectionTitle,
  events,
  showDateTime = true,
  showVenueAddress = true,
  showMapsButton = true,
  showCalendarButton = true,
  showCopyAddressButton = true,
}: EventScheduleProps) {
  return (
    <section className="py-20 px-6 bg-stone-50">
      <div className="max-w-md mx-auto">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-stone-400 mb-3">
            {sectionTitle}
          </p>
          <div className="section-divider" />
        </motion.div>

        <div className="space-y-6">
          {(events ?? []).map((event, i) => (
            <EventCardItem
              key={i}
              event={event}
              index={i}
              showDateTime={showDateTime}
              showVenueAddress={showVenueAddress}
              showMapsButton={showMapsButton}
              showCalendarButton={showCalendarButton}
              showCopyAddressButton={showCopyAddressButton}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   4. COUNTDOWN TIMER
   ───────────────────────────────────────────── */

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

function CountdownTimerRender({
  targetDate,
  label,
  showLabel = true,
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
}: CountdownTimerProps) {
  const { days, hours, minutes, seconds } = useCountdown(
    targetDate || new Date().toISOString()
  );

  const allBoxes = [
    { value: days, unit: "Hari", show: showDays },
    { value: hours, unit: "Jam", show: showHours },
    { value: minutes, unit: "Menit", show: showMinutes },
    { value: seconds, unit: "Detik", show: showSeconds },
  ];

  const boxes = allBoxes.filter((b) => b.show !== false);
  const gridClass =
    boxes.length === 1
      ? "grid-cols-1 max-w-[120px]"
      : boxes.length === 2
      ? "grid-cols-2 max-w-[240px]"
      : boxes.length === 3
      ? "grid-cols-3 max-w-sm"
      : "grid-cols-4";

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-md mx-auto text-center">
        <motion.div {...fadeInUp}>
          {showLabel && label && (
            <p className="text-xs uppercase tracking-[0.25em] text-stone-400 mb-8">
              {label}
            </p>
          )}

          {boxes.length > 0 && (
            <div className={`grid ${gridClass} gap-3 mx-auto`}>
              {boxes.map((box, i) => (
                <motion.div
                  key={box.unit}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex flex-col items-center py-5 px-2 rounded-2xl bg-stone-50 border border-stone-200/60 shadow-xs"
                >
                  <span className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 tabular-nums">
                    {String(box.value).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.15em] text-stone-400 mt-1.5">
                    {box.unit}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   5. LOVE STORY TIMELINE
   ───────────────────────────────────────────── */

function LoveStoryTimelineRender({
  sectionTitle,
  stories,
  showStoryPhotos = true,
  showStoryYear = true,
  showStoryDescription = true,
}: LoveStoryTimelineProps) {
  return (
    <section className="py-20 px-6 bg-stone-50">
      <div className="max-w-md mx-auto">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-stone-400 mb-3">
            {sectionTitle}
          </p>
          <div className="section-divider" />
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-stone-200" />

          <div className="space-y-10">
            {(stories ?? []).map((story, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative pl-12"
              >
                {/* Dot */}
                <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-stone-300 border-2 border-stone-50" />

                {showStoryYear && story.year && (
                  <span className="text-xs font-medium text-stone-400 tracking-wider">
                    {story.year}
                  </span>
                )}
                <h4 className="font-serif text-lg font-semibold text-stone-900 mt-1 mb-2">
                  {story.title}
                </h4>
                {showStoryDescription && story.description && (
                  <p className="text-sm text-stone-500 leading-relaxed">
                    {story.description}
                  </p>
                )}

                {showStoryPhotos && story.photoUrl && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-stone-200/60 shadow-xs">
                    <img
                      src={story.photoUrl}
                      alt={story.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   6. PHOTO GALLERY
   ───────────────────────────────────────────── */

function PhotoGalleryRender({
  sectionTitle,
  images,
  showCaptions = true,
  columns = "2",
  imageAspectRatio = "square",
}: PhotoGalleryProps) {
  const isThreeCols = columns === "3";
  const gridClass = isThreeCols
    ? "grid-cols-2 sm:grid-cols-3 gap-2.5"
    : "grid-cols-2 gap-3";

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-md mx-auto">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-stone-400 mb-3">
            {sectionTitle}
          </p>
          <div className="section-divider" />
        </motion.div>

        <div className={`grid ${gridClass}`}>
          {(images ?? []).map((img, i) => {
            const isLarge = !isThreeCols && i % 3 === 0;
            const heightClass =
              imageAspectRatio === "portrait"
                ? "aspect-[3/4]"
                : isLarge
                ? "col-span-2 h-64"
                : "h-44";

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`relative rounded-xl overflow-hidden border border-stone-200/60 group ${heightClass}`}
              >
                <img
                  src={img.imageUrl}
                  alt={img.caption || `Photo ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {showCaptions && img.caption && (
                  <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-stone-950/70 to-transparent text-white text-[11px] font-medium truncate">
                    {img.caption}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   7. DIGITAL GIFT
   ───────────────────────────────────────────── */

function DigitalGiftRender({
  sectionTitle,
  accounts,
  qrisImageUrl,
  showBankAccounts = true,
  showCopyAccount = true,
  showQRIS = true,
  showPhysicalGift = false,
  physicalGiftAddress = "",
  physicalGiftRecipient = "",
}: DigitalGiftProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedPhysical, setCopiedPhysical] = useState(false);
  const [showQris, setShowQris] = useState(false);

  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    }
  };

  return (
    <section className="py-20 px-6 bg-stone-50">
      <div className="max-w-md mx-auto">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-stone-400 mb-3">
            {sectionTitle}
          </p>
          <div className="section-divider" />
        </motion.div>

        {showBankAccounts && (
          <div className="space-y-4">
            {(accounts ?? []).map((acc, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ ...fadeInUp.transition, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-5 border border-stone-200/60 shadow-sm"
              >
                <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-1">
                  {acc.bankName}
                </p>
                <p className="font-serif text-xl font-semibold text-stone-900 mb-1 tabular-nums">
                  {acc.accountNumber}
                </p>
                <p className="text-sm text-stone-500 mb-4">a.n. {acc.accountHolder}</p>

                {showCopyAccount && (
                  <button
                    type="button"
                    onClick={() => handleCopy(acc.accountNumber, i)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stone-200
                      text-xs font-medium text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedIdx === i ? "Tersalin!" : "Salin Nomor Rekening"}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* QRIS Button */}
        {showQRIS && qrisImageUrl && (
          <motion.div {...fadeInUp} className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setShowQris(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 text-white
                text-sm font-medium hover:bg-stone-800 transition-colors shadow-md"
            >
              <QrCode className="w-4 h-4" />
              Lihat QRIS
            </button>
          </motion.div>
        )}

        {/* Physical Gift Section */}
        {showPhysicalGift && physicalGiftAddress && (
          <motion.div
            {...fadeInUp}
            className="bg-white rounded-2xl p-6 border border-stone-200/70 shadow-sm mt-5 text-left"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif text-base font-semibold text-stone-900">
                  Kirim Kado Fisik
                </h4>
                <p className="text-[11px] text-stone-400">Alamat Pengiriman</p>
              </div>
            </div>

            {physicalGiftRecipient && (
              <p className="text-xs font-semibold text-stone-800 mb-1">
                Penerima: {physicalGiftRecipient}
              </p>
            )}

            <p className="text-sm text-stone-600 leading-relaxed mb-4 whitespace-pre-line">
              {physicalGiftAddress}
            </p>

            <button
              type="button"
              onClick={() => {
                const text = `${
                  physicalGiftRecipient ? `Penerima: ${physicalGiftRecipient}\n` : ""
                }${physicalGiftAddress}`;
                navigator.clipboard.writeText(text);
                setCopiedPhysical(true);
                setTimeout(() => setCopiedPhysical(false), 2000);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stone-200
                text-xs font-medium text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedPhysical ? "Alamat Tersalin!" : "Salin Alamat Kado"}
            </button>
          </motion.div>
        )}

        {/* QRIS Modal */}
        {showQris && (
          <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-sm p-6"
            onClick={() => setShowQris(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-semibold text-stone-900">
                  QRIS Payment
                </h3>
                <button
                  type="button"
                  onClick={() => setShowQris(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors"
                >
                  <X className="w-4 h-4 text-stone-500" />
                </button>
              </div>
              <div className="rounded-xl overflow-hidden border border-stone-200">
                <img
                  src={qrisImageUrl}
                  alt="QRIS Code"
                  className="w-full"
                />
              </div>
              <p className="text-xs text-stone-400 text-center mt-3">
                Scan kode QR untuk mengirimkan hadiah digital
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   8. RSVP & GUESTBOOK
   ───────────────────────────────────────────── */

type GuestEntry = {
  id: string;
  guestName: string;
  attendanceStatus: string;
  message: string | null;
  createdAt: Date;
};

function RSVPGuestbookRender({
  invitationId,
  sectionTitle,
  showAttendanceCheck = true,
  showGuestCountSelect = true,
  showMessageField = true,
  showWishesFeed = true,
}: RSVPGuestbookProps) {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<"ATTENDING" | "NOT_ATTENDING" | "TENTATIVE">("ATTENDING");
  const [guestCount, setGuestCount] = useState<number>(1);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [entries, setEntries] = useState<GuestEntry[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (invitationId) {
      getGuestbookEntries(invitationId).then((data) =>
        setEntries(data as GuestEntry[])
      );
    }
  }, [invitationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !invitationId) return;

    setIsSubmitting(true);
    const result = await submitGuestbookEntry({
      invitationId,
      guestName: name.trim(),
      attendanceStatus: showAttendanceCheck ? attendance : "ATTENDING",
      message: message.trim() || undefined,
    });

    if (result.success && result.entry) {
      setEntries((prev) => [result.entry as GuestEntry, ...prev]);
      setName("");
      setMessage("");
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    }
    setIsSubmitting(false);
  };

  const attendanceOptions = [
    { value: "ATTENDING" as const, label: "Hadir", emoji: "✓" },
    { value: "NOT_ATTENDING" as const, label: "Tidak Hadir", emoji: "✗" },
    { value: "TENTATIVE" as const, label: "Masih Ragu", emoji: "?" },
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-md mx-auto">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-stone-400 mb-3">
            {sectionTitle}
          </p>
          <div className="section-divider" />
        </motion.div>

        {/* RSVP Form */}
        <motion.form
          {...fadeInUp}
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-stone-50 rounded-2xl p-6 border border-stone-200/60 mb-10"
        >
          {/* Name */}
          <div className="mb-5">
            <label className="text-xs uppercase tracking-wider text-stone-400 mb-2 block">
              Nama Anda
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-stone-200 text-sm text-stone-900
                  placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-300 transition-all"
              />
            </div>
          </div>

          {/* Attendance Check (Optional Sub-item) */}
          {showAttendanceCheck && (
            <div className="mb-5">
              <label className="text-xs uppercase tracking-wider text-stone-400 mb-2 block">
                Konfirmasi Kehadiran
              </label>
              <div className="grid grid-cols-3 gap-2">
                {attendanceOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAttendance(opt.value)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all
                      ${
                        attendance === opt.value
                          ? "bg-stone-900 text-white border-stone-900"
                          : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
                      }`}
                  >
                    <span className="block text-base mb-0.5">{opt.emoji}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Guest Count Select (Optional Sub-item) */}
          {showGuestCountSelect && showAttendanceCheck && attendance === "ATTENDING" && (
            <div className="mb-5">
              <label className="text-xs uppercase tracking-wider text-stone-400 mb-2 block">
                Jumlah Kehadiran (Pax)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setGuestCount(cnt)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                      guestCount === cnt
                        ? "bg-stone-900 text-white border-stone-900"
                        : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    {cnt} Orang {cnt === 2 ? "(+ Pasangan)" : ""}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Field (Optional Sub-item) */}
          {showMessageField && (
            <div className="mb-5">
              <label className="text-xs uppercase tracking-wider text-stone-400 mb-2 block">
                Ucapan & Doa Restu
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tulis doa restu untuk kedua mempelai..."
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-stone-200 text-sm text-stone-900
                    placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-300 transition-all resize-none"
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-stone-900 text-white
              text-sm font-medium hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Kirim Konfirmasi
              </>
            )}
          </button>

          {isSubmitted && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm text-emerald-600 mt-3"
            >
              Terima kasih atas konfirmasi & doa Anda! 🙏
            </motion.p>
          )}
        </motion.form>

        {/* Guestbook Entries Feed (Optional Sub-item) */}
        {showWishesFeed && entries.length > 0 && (
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-wider text-stone-400 mb-4">
              Ucapan ({entries.length})
            </p>
            {entries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-stone-50 rounded-xl p-4 border border-stone-200/60"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-stone-800">
                    {entry.guestName}
                  </h4>
                  {showAttendanceCheck && (
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        entry.attendanceStatus === "ATTENDING"
                          ? "bg-emerald-50 text-emerald-600"
                          : entry.attendanceStatus === "NOT_ATTENDING"
                            ? "bg-red-50 text-red-500"
                            : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {entry.attendanceStatus === "ATTENDING"
                        ? "Hadir"
                        : entry.attendanceStatus === "NOT_ATTENDING"
                          ? "Tidak Hadir"
                          : "Ragu"}
                    </span>
                  )}
                </div>
                {entry.message && (
                  <p className="text-sm text-stone-500 leading-relaxed">
                    {entry.message}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   9. WEDDING QUOTE (DOA & AYAT SUCI)
   ───────────────────────────────────────────── */

function WeddingQuoteRender({
  title = "Doa & Ayat Suci",
  arabicText = "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
  translationText = "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.",
  sourceText = "QS. Ar-Rum: 21",
  quoteStyle = "classic",
  showArabic = true,
}: WeddingQuoteProps) {
  return (
    <motion.section
      {...fadeInUp}
      className="py-16 sm:py-24 px-6 bg-stone-50/50 flex flex-col items-center justify-center text-center relative overflow-hidden"
    >
      <div
        className={`max-w-2xl mx-auto w-full transition-all ${
          quoteStyle === "card"
            ? "bg-white p-8 sm:p-12 rounded-3xl border border-stone-200/80 shadow-xs"
            : quoteStyle === "minimal"
            ? "py-4"
            : "py-6"
        }`}
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-px bg-stone-300" />
          <Heart className="w-4 h-4 text-amber-600" />
          <div className="w-10 h-px bg-stone-300" />
        </div>

        {title && (
          <p className="text-xs uppercase tracking-[0.25em] text-stone-400 font-semibold mb-6">
            {title}
          </p>
        )}

        {showArabic && arabicText && (
          <p
            dir="rtl"
            className="font-serif text-xl sm:text-2xl lg:text-3xl text-stone-800 leading-[2.2] sm:leading-[2.4] mb-6 font-medium px-4"
          >
            {arabicText}
          </p>
        )}

        {translationText && (
          <p className="font-serif text-base sm:text-lg text-stone-600 leading-relaxed italic mb-5 px-2">
            &ldquo;{translationText}&rdquo;
          </p>
        )}

        {sourceText && (
          <p className="text-xs font-semibold text-stone-800 uppercase tracking-widest">
            — {sourceText} —
          </p>
        )}
      </div>
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════
   PUCK CONFIG
   ═══════════════════════════════════════════════ */

export const puckConfig: Config<Components, RootProps> = {
  root: {
    render: ({ children, themeConfig }: { children: React.ReactNode; themeConfig?: WeddingThemeConfig }) => {
      const themeStyles = getThemeStyles(themeConfig);
      return (
        <div data-invitation-root style={themeStyles} className="w-full">
          {children}
        </div>
      );
    },
  },
  categories: {
    hero: { title: "Hero & Cover", components: ["CoverHero"] },
    about: { title: "Tentang Mempelai", components: ["CoupleProfile", "WeddingQuote", "LoveStoryTimeline"] },
    event: { title: "Acara", components: ["EventSchedule", "CountdownTimer"] },
    media: { title: "Media", components: ["PhotoGallery"] },
    engagement: { title: "Interaksi", components: ["DigitalGift", "RSVPGuestbook"] },
  },

  components: {
    /* ─── 1. Cover Hero ─── */
    CoverHero: {
      label: "Cover / Opening Hero",
      defaultProps: {
        groomName: "Ahmad",
        brideName: "Aisyah",
        weddingDate: "Sabtu, 15 November 2025",
        coverImageUrl: "",
        customGreeting: "The Wedding of",
        headingSize: "default",
        customHeadingColor: "",
        showBadge: true,
        badgeText: "The Wedding of",
        showGreeting: true,
        showCoupleNames: true,
        showDate: true,
      },
      fields: {
        showBadge: {
          type: "radio",
          label: "Badge Pembuka Atas",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        badgeText: { type: "text", label: "Teks Badge Pembuka" },
        showGreeting: {
          type: "radio",
          label: "Kalimat Pembuka (Greeting)",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        customGreeting: { type: "text", label: "Teks Kalimat Pembuka" },
        showCoupleNames: {
          type: "radio",
          label: "Nama Pasangan Pengantin",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        groomName: { type: "text", label: "Nama Mempelai Pria" },
        brideName: { type: "text", label: "Nama Mempelai Wanita" },
        headingSize: {
          type: "select",
          label: "Skala Ukuran Nama",
          options: [
            { label: "Ikuti Tema Global (Standar)", value: "default" },
            { label: "Ringkas (Compact)", value: "compact" },
            { label: "Megah (Large)", value: "large" },
            { label: "Dramatis (XL)", value: "dramatic" },
          ],
        },
        customHeadingColor: {
          type: "text",
          label: "Warna Kustom Nama (Hex, misal #b4975a)",
        },
        showDate: {
          type: "radio",
          label: "Tanggal Pernikahan di Cover",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        weddingDate: { type: "text", label: "Teks Tanggal Pernikahan" },
        coverImageUrl: {
          type: "custom",
          render: ({ value, onChange }) => (
            <ImageUploadField
              value={value}
              onChange={onChange}
              label="Foto Cover Utama"
            />
          ),
        },
      },
      render: CoverHeroRender,
    },

    /* ─── 2. Couple Profile ─── */
    CoupleProfile: {
      label: "Profil Mempelai",
      defaultProps: {
        sectionTitle: "Bride & Groom",
        showPhotos: true,
        showParentNames: true,
        showInstagram: true,
        showHeartDivider: true,
        showRoleLabels: true,
        groomData: {
          photoUrl: "",
          fullName: "Ahmad Fauzan, S.Kom.",
          parentNames: "Putra dari Bpk. Hadi Santoso & Ibu Sri Wahyuni",
          instagramHandle: "@ahmadfauzan",
        },
        brideData: {
          photoUrl: "",
          fullName: "Aisyah Putri Rahayu, S.Pd.",
          parentNames: "Putri dari Bpk. Rudi Rahayu & Ibu Nurul Aini",
          instagramHandle: "@aisyahputri",
        },
      },
      fields: {
        sectionTitle: { type: "text", label: "Judul Bagian" },
        showPhotos: {
          type: "radio",
          label: "Foto Mempelai",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        showRoleLabels: {
          type: "radio",
          label: "Label Peran (Mempelai Pria / Wanita)",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        showParentNames: {
          type: "radio",
          label: "Nama Orang Tua",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        showInstagram: {
          type: "radio",
          label: "Tombol / Akun Instagram",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        showHeartDivider: {
          type: "radio",
          label: "Ikon Hati Pembatas di Tengah",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        groomData: {
          type: "object",
          label: "Data Mempelai Pria",
          objectFields: {
            photoUrl: {
              type: "custom",
              render: ({ value, onChange }) => (
                <ImageUploadField
                  value={value}
                  onChange={onChange}
                  label="Foto Mempelai Pria"
                />
              ),
            },
            fullName: { type: "text", label: "Nama Lengkap" },
            parentNames: { type: "text", label: "Nama Orang Tua" },
            instagramHandle: { type: "text", label: "Instagram Handle" },
          },
        },
        brideData: {
          type: "object",
          label: "Data Mempelai Wanita",
          objectFields: {
            photoUrl: {
              type: "custom",
              render: ({ value, onChange }) => (
                <ImageUploadField
                  value={value}
                  onChange={onChange}
                  label="Foto Mempelai Wanita"
                />
              ),
            },
            fullName: { type: "text", label: "Nama Lengkap" },
            parentNames: { type: "text", label: "Nama Orang Tua" },
            instagramHandle: { type: "text", label: "Instagram Handle" },
          },
        },
      },
      render: CoupleProfileRender,
    },

    /* ─── 2.5 Wedding Quote ─── */
    WeddingQuote: {
      label: "Kutipan & Doa Suci",
      defaultProps: {
        title: "Doa & Ayat Suci",
        arabicText:
          "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
        translationText:
          "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
        sourceText: "QS. Ar-Rum: 21",
        quoteStyle: "classic",
        showArabic: true,
      },
      fields: {
        title: { type: "text", label: "Judul Bagian" },
        showArabic: {
          type: "radio",
          label: "Teks Arab / Bahasa Asli",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        arabicText: { type: "textarea", label: "Teks Arab / Bahasa Asli" },
        translationText: { type: "textarea", label: "Terjemahan / Isi Kutipan" },
        sourceText: { type: "text", label: "Sumber (mis. QS. Ar-Rum: 21 / 1 Korintus 13:4)" },
        quoteStyle: {
          type: "select",
          label: "Gaya Tampilan",
          options: [
            { label: "Klasik Elegan", value: "classic" },
            { label: "Kartu Bersih (Card Box)", value: "card" },
            { label: "Minimalis Sederhana", value: "minimal" },
          ],
        },
      },
      render: WeddingQuoteRender,
    },

    /* ─── 3. Event Schedule ─── */
    EventSchedule: {
      label: "Jadwal Acara",
      defaultProps: {
        sectionTitle: "Wedding Day",
        showDateTime: true,
        showVenueAddress: true,
        showMapsButton: true,
        showCalendarButton: true,
        showCopyAddressButton: true,
        events: [
          {
            eventName: "Akad Nikah",
            date: "Sabtu, 15 November 2025",
            timeRange: "08:00 — 10:00 WIB",
            venueName: "Masjid Al-Ikhlas",
            venueAddress: "Jl. Merdeka No. 45, Jakarta Selatan",
            mapsUrl: "https://maps.google.com",
            showMapEmbed: false,
            calendarDate: "2025-11-15",
            calendarStartTime: "08:00",
            calendarEndTime: "10:00",
          },
          {
            eventName: "Resepsi",
            date: "Sabtu, 15 November 2025",
            timeRange: "11:00 — 14:00 WIB",
            venueName: "Ballroom Grand Sahid Jaya",
            venueAddress: "Jl. Jenderal Sudirman No. 86, Jakarta Pusat",
            mapsUrl: "https://maps.google.com",
            showMapEmbed: true,
            calendarDate: "2025-11-15",
            calendarStartTime: "11:00",
            calendarEndTime: "14:00",
          },
        ],
      },
      fields: {
        sectionTitle: { type: "text", label: "Judul Bagian" },
        showDateTime: {
          type: "radio",
          label: "Tanggal & Jam Pelaksanaan",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        showVenueAddress: {
          type: "radio",
          label: "Nama Tempat & Alamat Lengkap",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        showMapsButton: {
          type: "radio",
          label: "Tombol Google Maps",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        showCalendarButton: {
          type: "radio",
          label: "Tombol Simpan Google Calendar",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        showCopyAddressButton: {
          type: "radio",
          label: "Tombol Salin Alamat",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        events: {
          type: "array",
          label: "Daftar Acara",
          arrayFields: {
            eventName: { type: "text", label: "Nama Acara" },
            date: { type: "text", label: "Tanggal (Teks Tampilan)" },
            timeRange: { type: "text", label: "Rentang Jam (Teks Tampilan)" },
            venueName: { type: "text", label: "Nama Tempat/Gedung" },
            venueAddress: { type: "textarea", label: "Alamat Lengkap" },
            mapsUrl: { type: "text", label: "URL Google Maps (opsional)" },
            showMapEmbed: {
              type: "radio",
              label: "Peta Interaktif (Google Maps Embed)",
              options: [
                { label: "Tampilkan Iframe", value: true },
                { label: "Hanya Tombol", value: false },
              ],
            },
            calendarDate: { type: "text", label: "Tanggal Kalender (YYYY-MM-DD)" },
            calendarStartTime: { type: "text", label: "Jam Mulai (HH:MM)" },
            calendarEndTime: { type: "text", label: "Jam Selesai (HH:MM)" },
          },
          defaultItemProps: {
            eventName: "Acara Baru",
            date: "",
            timeRange: "",
            venueName: "",
            venueAddress: "",
            mapsUrl: "",
            showMapEmbed: false,
            calendarDate: "",
            calendarStartTime: "09:00",
            calendarEndTime: "13:00",
          },
        },
      },
      render: EventScheduleRender,
    },

    /* ─── 4. Countdown Timer ─── */
    CountdownTimer: {
      label: "Hitung Mundur",
      defaultProps: {
        targetDate: "2025-11-15T08:00:00+07:00",
        label: "Menuju Hari Bahagia",
        showLabel: true,
        showDays: true,
        showHours: true,
        showMinutes: true,
        showSeconds: true,
      },
      fields: {
        targetDate: { type: "text", label: "Tanggal Target (ISO 8601)" },
        label: { type: "text", label: "Teks Label" },
        showLabel: {
          type: "radio",
          label: "Tampilkan Label Judul",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        showDays: {
          type: "radio",
          label: "Kotak Hari",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        showHours: {
          type: "radio",
          label: "Kotak Jam",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        showMinutes: {
          type: "radio",
          label: "Kotak Menit",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        showSeconds: {
          type: "radio",
          label: "Kotak Detik",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
      },
      render: CountdownTimerRender,
    },

    /* ─── 5. Love Story Timeline ─── */
    LoveStoryTimeline: {
      label: "Love Story",
      defaultProps: {
        sectionTitle: "Our Love Story",
        showStoryPhotos: true,
        showStoryYear: true,
        showStoryDescription: true,
        stories: [
          {
            year: "2019",
            title: "Pertama Bertemu",
            description: "Dipertemukan di acara kampus, saling sapa dan saling kenal.",
            photoUrl: "",
          },
          {
            year: "2021",
            title: "Mulai Serius",
            description: "Menjalin hubungan yang lebih serius dan bertemu keluarga.",
            photoUrl: "",
          },
          {
            year: "2024",
            title: "Lamaran",
            description: "Dengan restu kedua keluarga, kami memutuskan untuk melangkah bersama.",
            photoUrl: "",
          },
        ],
      },
      fields: {
        sectionTitle: { type: "text", label: "Judul Bagian" },
        showStoryPhotos: {
          type: "radio",
          label: "Foto Kenangan pada Timeline",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        showStoryYear: {
          type: "radio",
          label: "Tahun / Tanggal Momen",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        showStoryDescription: {
          type: "radio",
          label: "Deskripsi Cerita",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        stories: {
          type: "array",
          label: "Cerita",
          arrayFields: {
            year: { type: "text", label: "Tahun / Tanggal" },
            title: { type: "text", label: "Judul" },
            description: { type: "textarea", label: "Deskripsi" },
            photoUrl: {
              type: "custom",
              render: ({ value, onChange }) => (
                <ImageUploadField
                  value={value}
                  onChange={onChange}
                  label="Foto Kenangan (opsional)"
                />
              ),
            },
          },
          defaultItemProps: {
            year: "",
            title: "Momen Baru",
            description: "",
            photoUrl: "",
          },
        },
      },
      render: LoveStoryTimelineRender,
    },

    /* ─── 6. Photo Gallery ─── */
    PhotoGallery: {
      label: "Galeri Foto",
      defaultProps: {
        sectionTitle: "Our Gallery",
        showCaptions: true,
        columns: "2",
        imageAspectRatio: "square",
        images: [
          { imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800", caption: "Prewedding" },
          { imageUrl: "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?w=800", caption: "Engagement" },
          { imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800", caption: "Together" },
        ],
      },
      fields: {
        sectionTitle: { type: "text", label: "Judul Bagian" },
        columns: {
          type: "select",
          label: "Jumlah Kolom Grid",
          options: [
            { label: "2 Kolom (Besar & Artistik)", value: "2" },
            { label: "3 Kolom (Kompak & Simetris)", value: "3" },
          ],
        },
        imageAspectRatio: {
          type: "select",
          label: "Rasio Dimensi Foto",
          options: [
            { label: "Persegi (1:1 Square)", value: "square" },
            { label: "Potret (3:4 Portrait)", value: "portrait" },
          ],
        },
        showCaptions: {
          type: "radio",
          label: "Keterangan / Caption Foto",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        images: {
          type: "array",
          label: "Gambar",
          arrayFields: {
            imageUrl: {
              type: "custom",
              render: ({ value, onChange }) => (
                <ImageUploadField
                  value={value}
                  onChange={onChange}
                  label="Foto Galeri"
                />
              ),
            },
            caption: { type: "text", label: "Keterangan" },
          },
          defaultItemProps: {
            imageUrl: "",
            caption: "",
          },
        },
      },
      render: PhotoGalleryRender,
    },

    /* ─── 7. Digital Gift ─── */
    DigitalGift: {
      label: "Amplop Digital & Kado",
      defaultProps: {
        sectionTitle: "Wedding Gift",
        showBankAccounts: true,
        showCopyAccount: true,
        showQRIS: true,
        showPhysicalGift: false,
        physicalGiftAddress: "Jl. Melati No. 12, Kebayoran Baru, Jakarta Selatan 12150",
        physicalGiftRecipient: "Ahmad & Aisyah (0812-3456-7890)",
        accounts: [
          {
            bankName: "Bank Central Asia (BCA)",
            accountNumber: "8712345678",
            accountHolder: "Ahmad Fauzan",
          },
          {
            bankName: "Bank Mandiri",
            accountNumber: "1310012345678",
            accountHolder: "Aisyah Putri Rahayu",
          },
        ],
        qrisImageUrl: "",
      },
      fields: {
        sectionTitle: { type: "text", label: "Judul Bagian" },
        showBankAccounts: {
          type: "radio",
          label: "Daftar Rekening Bank",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        showCopyAccount: {
          type: "radio",
          label: "Tombol Salin Rekening",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        showQRIS: {
          type: "radio",
          label: "Opsi Pembayaran QRIS",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        showPhysicalGift: {
          type: "radio",
          label: "Kirim Kado Fisik (Alamat Penerima)",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        physicalGiftAddress: {
          type: "textarea",
          label: "Alamat Pengiriman Kado Fisik",
        },
        physicalGiftRecipient: {
          type: "text",
          label: "Nama Penerima & No. Telepon Kado Fisik",
        },
        accounts: {
          type: "array",
          label: "Rekening Bank",
          arrayFields: {
            bankName: { type: "text", label: "Nama Bank" },
            accountNumber: { type: "text", label: "Nomor Rekening" },
            accountHolder: { type: "text", label: "Atas Nama" },
          },
          defaultItemProps: {
            bankName: "",
            accountNumber: "",
            accountHolder: "",
          },
        },
        qrisImageUrl: {
          type: "custom",
          render: ({ value, onChange }) => (
            <ImageUploadField
              value={value}
              onChange={onChange}
              label="Gambar QRIS (opsional)"
            />
          ),
        },
      },
      render: DigitalGiftRender,
    },

    /* ─── 8. RSVP & Guestbook ─── */
    RSVPGuestbook: {
      label: "RSVP & Buku Tamu",
      defaultProps: {
        invitationId: "",
        sectionTitle: "RSVP & Wishes",
        showAttendanceCheck: true,
        showGuestCountSelect: true,
        showMessageField: true,
        showWishesFeed: true,
      },
      fields: {
        invitationId: { type: "text", label: "ID Undangan (otomatis)" },
        sectionTitle: { type: "text", label: "Judul Bagian" },
        showAttendanceCheck: {
          type: "radio",
          label: "Konfirmasi Kehadiran (Hadir / Tidak Hadir)",
          options: [
            { label: "Aktifkan RSVP Kehadiran", value: true },
            { label: "Hanya Buku Tamu (Ucapan Saja)", value: false },
          ],
        },
        showGuestCountSelect: {
          type: "radio",
          label: "Pilihan Jumlah Tamu (Pax)",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        showMessageField: {
          type: "radio",
          label: "Formulir Ucapan & Doa",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
        showWishesFeed: {
          type: "radio",
          label: "Feed Riwayat Ucapan Tamu",
          options: [
            { label: "Tampilkan", value: true },
            { label: "Sembunyikan", value: false },
          ],
        },
      },
      render: RSVPGuestbookRender,
    },
  },
};

/* ─── Default Data Template ─── */
export const defaultInvitationData: InvitationData = {
  content: [
    { type: "CoverHero", props: { ...puckConfig.components.CoverHero.defaultProps!, id: "cover-hero-1" } },
    { type: "CoupleProfile", props: { ...puckConfig.components.CoupleProfile.defaultProps!, id: "couple-1" } },
    { type: "CountdownTimer", props: { ...puckConfig.components.CountdownTimer.defaultProps!, id: "countdown-1" } },
    { type: "EventSchedule", props: { ...puckConfig.components.EventSchedule.defaultProps!, id: "events-1" } },
    { type: "LoveStoryTimeline", props: { ...puckConfig.components.LoveStoryTimeline.defaultProps!, id: "story-1" } },
    { type: "PhotoGallery", props: { ...puckConfig.components.PhotoGallery.defaultProps!, id: "gallery-1" } },
    { type: "DigitalGift", props: { ...puckConfig.components.DigitalGift.defaultProps!, id: "gift-1" } },
    { type: "RSVPGuestbook", props: { ...puckConfig.components.RSVPGuestbook.defaultProps!, id: "rsvp-1" } },
  ],
  root: { props: { themeConfig: defaultThemeConfig } },
};
