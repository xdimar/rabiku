import { InvitationData, puckConfig } from "@/config/puck.config";
import { THEME_PRESETS } from "@/config/theme.config";

export interface WeddingTemplate {
  id: string;
  name: string;
  category: "modern" | "romantic" | "cultural" | "religious";
  description: string;
  thumbnail: string;
  themePresetId: string;
  accentColor: string;
  tags: string[];
  generateLayout: (groom: string, bride: string) => InvitationData;
}

export const WEDDING_TEMPLATES: WeddingTemplate[] = [
  {
    id: "minimalist",
    name: "Monochrome Minimalist",
    category: "modern",
    description: "Desain monokrom hitam-putih ultra bersih dengan tipografi elegan dan fokus pada esensi cinta.",
    thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
    themePresetId: "classic-monochrome",
    accentColor: "#1c1917",
    tags: ["Minimalis", "Monokrom", "Modern", "Elegan"],
    generateLayout: (groom: string, bride: string): InvitationData => ({
      content: [
        {
          type: "CoverHero",
          props: {
            ...puckConfig.components.CoverHero.defaultProps!,
            id: "cover-minimalist",
            groomName: groom,
            brideName: bride,
            weddingDate: "Sabtu, 25 Oktober 2025",
            customGreeting: "The Wedding Celebration of",
            coverImageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
          },
        },
        {
          type: "CoupleProfile",
          props: {
            ...puckConfig.components.CoupleProfile.defaultProps!,
            id: "couple-minimalist",
            sectionTitle: "Bride & Groom",
            groomData: {
              photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
              fullName: `${groom} Pratama, S.T.`,
              parentNames: "Putra pertama dari Bpk. Bambang & Ibu Sri Wahyuni",
              instagramHandle: `@${groom.toLowerCase().replace(/\s+/g, "")}`,
            },
            brideData: {
              photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
              fullName: `${bride} Anindya, S.Ked.`,
              parentNames: "Putri kedua dari Bpk. Hartono & Ibu Ratna Sari",
              instagramHandle: `@${bride.toLowerCase().replace(/\s+/g, "")}`,
            },
          },
        },
        {
          type: "CountdownTimer",
          props: {
            ...puckConfig.components.CountdownTimer.defaultProps!,
            id: "countdown-minimalist",
            targetDate: "2025-10-25T08:00:00+07:00",
            label: "Menghitung Hari",
          },
        },
        {
          type: "EventSchedule",
          props: {
            ...puckConfig.components.EventSchedule.defaultProps!,
            id: "events-minimalist",
            sectionTitle: "Agenda Acara",
            events: [
              {
                eventName: "Akad Nikah",
                date: "Sabtu, 25 Oktober 2025",
                timeRange: "08:00 — 10:00 WIB",
                venueName: "Masjid Agung Al-Azhar",
                venueAddress: "Jl. Sisingamangaraja, Kebayoran Baru, Jakarta Selatan",
                mapsUrl: "https://maps.google.com",
                showMapEmbed: false,
                calendarDate: "2025-10-25",
                calendarStartTime: "08:00",
                calendarEndTime: "10:00",
              },
              {
                eventName: "Resepsi Pernikahan",
                date: "Sabtu, 25 Oktober 2025",
                timeRange: "11:00 — 14:00 WIB",
                venueName: "Grand Ballroom Hotel Indonesia Kempinski",
                venueAddress: "Jl. M.H. Thamrin No. 1, Menteng, Jakarta Pusat",
                mapsUrl: "https://maps.google.com",
                showMapEmbed: true,
                calendarDate: "2025-10-25",
                calendarStartTime: "11:00",
                calendarEndTime: "14:00",
              },
            ],
          },
        },
        {
          type: "PhotoGallery",
          props: {
            ...puckConfig.components.PhotoGallery.defaultProps!,
            id: "gallery-minimalist",
            sectionTitle: "Galeri Foto",
            images: [
              {
                imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
                caption: "Our first gaze",
              },
              {
                imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
                caption: "Promise of forever",
              },
              {
                imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=600&auto=format&fit=crop",
                caption: "Walking towards the future",
              },
            ],
          },
        },
        {
          type: "DigitalGift",
          props: {
            ...puckConfig.components.DigitalGift.defaultProps!,
            id: "gift-minimalist",
            sectionTitle: "Tanda Kasih Digital",
            accounts: [
              {
                bankName: "BCA",
                accountNumber: "8820192831",
                accountHolder: groom,
              },
              {
                bankName: "Mandiri",
                accountNumber: "13200928192",
                accountHolder: bride,
              },
            ],
          },
        },
        {
          type: "RSVPGuestbook",
          props: {
            ...puckConfig.components.RSVPGuestbook.defaultProps!,
            id: "rsvp-minimalist",
            sectionTitle: "Konfirmasi Kehadiran & Doa Restu",
          },
        },
      ],
      root: {
        props: {
          themeConfig: THEME_PRESETS.find((p) => p.id === "classic-monochrome")?.config,
        },
      },
    }),
  },
  {
    id: "rustic-garden",
    name: "Rustic Garden",
    category: "romantic",
    description: "Sentuhan hangat alam dengan nuansa botanical, warna terracotta dan kehangatan outdoor.",
    thumbnail: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
    themePresetId: "rustic-warmth",
    accentColor: "#b45309",
    tags: ["Rustic", "Botanical", "Warm", "Outdoor"],
    generateLayout: (groom: string, bride: string): InvitationData => ({
      content: [
        {
          type: "CoverHero",
          props: {
            ...puckConfig.components.CoverHero.defaultProps!,
            id: "cover-rustic",
            groomName: groom,
            brideName: bride,
            weddingDate: "Minggu, 15 November 2025",
            customGreeting: "Together With Their Families",
            coverImageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop",
          },
        },
        {
          type: "CoupleProfile",
          props: {
            ...puckConfig.components.CoupleProfile.defaultProps!,
            id: "couple-rustic",
            sectionTitle: "The Happy Couple",
            groomData: {
              photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
              fullName: `${groom} Wicaksono`,
              parentNames: "Putra dari Bpk. Suryo & Ibu Endang",
              instagramHandle: `@${groom.toLowerCase().replace(/\s+/g, "")}`,
            },
            brideData: {
              photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop",
              fullName: `${bride} Larasati`,
              parentNames: "Putri dari Bpk. Gunawan & Ibu Lestari",
              instagramHandle: `@${bride.toLowerCase().replace(/\s+/g, "")}`,
            },
          },
        },
        {
          type: "CountdownTimer",
          props: {
            ...puckConfig.components.CountdownTimer.defaultProps!,
            id: "countdown-rustic",
            targetDate: "2025-11-15T09:00:00+07:00",
            label: "Menuju Hari Bahagia",
          },
        },
        {
          type: "EventSchedule",
          props: {
            ...puckConfig.components.EventSchedule.defaultProps!,
            id: "events-rustic",
            sectionTitle: "Rangkaian Acara",
            events: [
              {
                eventName: "Pemberkatan / Akad",
                date: "Minggu, 15 November 2025",
                timeRange: "09:00 — 11:00 WIB",
                venueName: "Pine Hill Forest Sanctuary",
                venueAddress: "Jl. Maribaya Timur, Lembang, Bandung Barat",
                mapsUrl: "https://maps.google.com",
                showMapEmbed: false,
                calendarDate: "2025-11-15",
                calendarStartTime: "09:00",
                calendarEndTime: "11:00",
              },
              {
                eventName: "Garden Reception",
                date: "Minggu, 15 November 2025",
                timeRange: "12:00 — 16:00 WIB",
                venueName: "Pine Hill Outdoor Lawn",
                venueAddress: "Jl. Maribaya Timur, Lembang, Bandung Barat",
                mapsUrl: "https://maps.google.com",
                showMapEmbed: true,
                calendarDate: "2025-11-15",
                calendarStartTime: "12:00",
                calendarEndTime: "16:00",
              },
            ],
          },
        },
        {
          type: "PhotoGallery",
          props: {
            ...puckConfig.components.PhotoGallery.defaultProps!,
            id: "gallery-rustic",
            sectionTitle: "Momen Bahagia",
            images: [
              {
                imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
                caption: "Under the canopy",
              },
              {
                imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
                caption: "Laughter and vows",
              },
            ],
          },
        },
        {
          type: "RSVPGuestbook",
          props: {
            ...puckConfig.components.RSVPGuestbook.defaultProps!,
            id: "rsvp-rustic",
            sectionTitle: "Konfirmasi Kehadiran",
          },
        },
      ],
      root: {
        props: {
          themeConfig: THEME_PRESETS.find((p) => p.id === "rustic-warmth")?.config,
        },
      },
    }),
  },
  {
    id: "islamic-elegant",
    name: "Islamic Elegant",
    category: "religious",
    description: "Kombinasi hijau emerald, ayat suci Al-Qur'an (Ar-Rum: 21), dan ornamen islami modern.",
    thumbnail: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=600&auto=format&fit=crop",
    themePresetId: "emerald-luxury",
    accentColor: "#047857",
    tags: ["Islami", "Emerald", "Syari", "Elegan"],
    generateLayout: (groom: string, bride: string): InvitationData => ({
      content: [
        {
          type: "CoverHero",
          props: {
            ...puckConfig.components.CoverHero.defaultProps!,
            id: "cover-islamic",
            groomName: groom,
            brideName: bride,
            weddingDate: "Jumat, 12 Desember 2025",
            customGreeting: "Walimatul 'Ursy",
            badgeText: "Walimatul 'Ursy",
            coverImageUrl: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=1200&auto=format&fit=crop",
          },
        },
        {
          type: "WeddingQuote",
          props: {
            ...puckConfig.components.WeddingQuote.defaultProps!,
            id: "quote-islamic",
            title: "Kutipan Ayat Suci",
            arabicText: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
            translationText: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
            sourceText: "QS. Ar-Rum: 21",
            quoteStyle: "card",
          },
        },
        {
          type: "CoupleProfile",
          props: {
            ...puckConfig.components.CoupleProfile.defaultProps!,
            id: "couple-islamic",
            sectionTitle: "Mempelai Berbahagia",
            groomData: {
              photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop",
              fullName: `${groom} Al-Fatih, Lc.`,
              parentNames: "Putra pertama dari Bpk. H. Ahmad & Ibu Hj. Aminah",
              instagramHandle: `@${groom.toLowerCase().replace(/\s+/g, "")}`,
            },
            brideData: {
              photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
              fullName: `${bride} Khairunnisa, S.Farm.`,
              parentNames: "Putri bungsu dari Bpk. H. Zulkifli & Ibu Hj. Maryam",
              instagramHandle: `@${bride.toLowerCase().replace(/\s+/g, "")}`,
            },
          },
        },
        {
          type: "CountdownTimer",
          props: {
            ...puckConfig.components.CountdownTimer.defaultProps!,
            id: "countdown-islamic",
            targetDate: "2025-12-12T08:00:00+07:00",
            label: "Menghitung Hari Bahagia",
          },
        },
        {
          type: "EventSchedule",
          props: {
            ...puckConfig.components.EventSchedule.defaultProps!,
            id: "events-islamic",
            sectionTitle: "Jadwal Acara",
            events: [
              {
                eventName: "Akad Nikah",
                date: "Jumat, 12 Desember 2025",
                timeRange: "08:00 — 10:00 WIB",
                venueName: "Masjid Nasional Al-Akbar",
                venueAddress: "Jl. Pagesangan No. 1, Surabaya, Jawa Timur",
                mapsUrl: "https://maps.google.com",
                showMapEmbed: false,
                calendarDate: "2025-12-12",
                calendarStartTime: "08:00",
                calendarEndTime: "10:00",
              },
              {
                eventName: "Walimatul 'Ursy (Resepsi)",
                date: "Jumat, 12 Desember 2025",
                timeRange: "18:30 — 21:00 WIB",
                venueName: "Grand City Convention Ballroom",
                venueAddress: "Jl. Walikota Mustajab No. 1, Surabaya",
                mapsUrl: "https://maps.google.com",
                showMapEmbed: true,
                calendarDate: "2025-12-12",
                calendarStartTime: "18:30",
                calendarEndTime: "21:00",
              },
            ],
          },
        },
        {
          type: "RSVPGuestbook",
          props: {
            ...puckConfig.components.RSVPGuestbook.defaultProps!,
            id: "rsvp-islamic",
            sectionTitle: "Konfirmasi Kehadiran & Doa Restu",
          },
        },
      ],
      root: {
        props: {
          themeConfig: THEME_PRESETS.find((p) => p.id === "emerald-luxury")?.config,
        },
      },
    }),
  },
  {
    id: "javanese-royal",
    name: "Javanese Royal",
    category: "cultural",
    description: "Nuansa ningrat Jawa klasik dengan warna tembaga, motif batik berkelas, dan kesakralan adat.",
    thumbnail: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=600&auto=format&fit=crop",
    themePresetId: "rustic-warmth",
    accentColor: "#78350f",
    tags: ["Jawa", "Adat", "Royal", "Klasik"],
    generateLayout: (groom: string, bride: string): InvitationData => ({
      content: [
        {
          type: "CoverHero",
          props: {
            ...puckConfig.components.CoverHero.defaultProps!,
            id: "cover-jawa",
            groomName: groom,
            brideName: bride,
            weddingDate: "Sabtu Kliwon, 8 November 2025",
            customGreeting: "Serat Ulem Pawiwahan",
            badgeText: "Pawiwahan Ageng",
            coverImageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop",
          },
        },
        {
          type: "CoupleProfile",
          props: {
            ...puckConfig.components.CoupleProfile.defaultProps!,
            id: "couple-jawa",
            sectionTitle: "Temanten Kakung & Temanten Putri",
            groomData: {
              photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
              fullName: `Raden Mas ${groom} Sasongko`,
              parentNames: "Putra kakung Bpk. RM Soebroto & Ibu RA Siti Maimunah",
              instagramHandle: `@${groom.toLowerCase().replace(/\s+/g, "")}`,
            },
            brideData: {
              photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
              fullName: `Raden Ajeng ${bride} Sekar Langit`,
              parentNames: "Putri pambayun Bpk. RM Djojonegoro & Ibu RA Retno Palupi",
              instagramHandle: `@${bride.toLowerCase().replace(/\s+/g, "")}`,
            },
          },
        },
        {
          type: "CountdownTimer",
          props: {
            ...puckConfig.components.CountdownTimer.defaultProps!,
            id: "countdown-jawa",
            targetDate: "2025-11-08T09:00:00+07:00",
            label: "Ngetang Dinten",
          },
        },
        {
          type: "EventSchedule",
          props: {
            ...puckConfig.components.EventSchedule.defaultProps!,
            id: "events-jawa",
            sectionTitle: "Tata Cara Pawiwahan",
            events: [
              {
                eventName: "Ijab Qobul & Upacara Panggih",
                date: "Sabtu Kliwon, 8 November 2025",
                timeRange: "09:00 — 11:30 WIB",
                venueName: "Ndalem Sasana Hinggil Dwi Abad",
                venueAddress: "Kraton, Kota Yogyakarta, D.I. Yogyakarta",
                mapsUrl: "https://maps.google.com",
                showMapEmbed: false,
                calendarDate: "2025-11-08",
                calendarStartTime: "09:00",
                calendarEndTime: "11:30",
              },
              {
                eventName: "Pahargyan Temanten (Resepsi)",
                date: "Sabtu Kliwon, 8 November 2025",
                timeRange: "12:00 — 15:00 WIB",
                venueName: "Pendopo Royal Ambarrukmo",
                venueAddress: "Jl. Laksda Adisucipto No. 81, Yogyakarta",
                mapsUrl: "https://maps.google.com",
                showMapEmbed: true,
                calendarDate: "2025-11-08",
                calendarStartTime: "12:00",
                calendarEndTime: "15:00",
              },
            ],
          },
        },
        {
          type: "RSVPGuestbook",
          props: {
            ...puckConfig.components.RSVPGuestbook.defaultProps!,
            id: "rsvp-jawa",
            sectionTitle: "Buku Rawuh & Donga Pangestu",
          },
        },
      ],
      root: {
        props: {
          themeConfig: THEME_PRESETS.find((p) => p.id === "rustic-warmth")?.config,
        },
      },
    }),
  },
  {
    id: "modern-chic",
    name: "Modern Chic",
    category: "modern",
    description: "Tipografi kontemporer tebal, tata letak bergaya editorial magazine, dan kontras tajam.",
    thumbnail: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=600&auto=format&fit=crop",
    themePresetId: "midnight-gold",
    accentColor: "#d97706",
    tags: ["Editorial", "Chic", "Bold", "Kontemporer"],
    generateLayout: (groom: string, bride: string): InvitationData => ({
      content: [
        {
          type: "CoverHero",
          props: {
            ...puckConfig.components.CoverHero.defaultProps!,
            id: "cover-chic",
            groomName: groom,
            brideName: bride,
            weddingDate: "Saturday, 20 December 2025",
            customGreeting: "Join Us In Celebrating",
            coverImageUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop",
          },
        },
        {
          type: "CoupleProfile",
          props: {
            ...puckConfig.components.CoupleProfile.defaultProps!,
            id: "couple-chic",
            sectionTitle: "The Couple",
            groomData: {
              photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop",
              fullName: `${groom} Alexander`,
              parentNames: "Son of Mr. Robert & Mrs. Catherine",
              instagramHandle: `@${groom.toLowerCase().replace(/\s+/g, "")}`,
            },
            brideData: {
              photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
              fullName: `${bride} Valerie`,
              parentNames: "Daughter of Mr. Michael & Mrs. Victoria",
              instagramHandle: `@${bride.toLowerCase().replace(/\s+/g, "")}`,
            },
          },
        },
        {
          type: "CountdownTimer",
          props: {
            ...puckConfig.components.CountdownTimer.defaultProps!,
            id: "countdown-chic",
            targetDate: "2025-12-20T16:00:00+08:00",
            label: "Counting Down",
          },
        },
        {
          type: "EventSchedule",
          props: {
            ...puckConfig.components.EventSchedule.defaultProps!,
            id: "events-chic",
            sectionTitle: "Celebration Itinerary",
            events: [
              {
                eventName: "Sunset Vows",
                date: "Saturday, 20 December 2025",
                timeRange: "16:30 — 17:30 WITA",
                venueName: "The Edge Cliff Villa",
                venueAddress: "Jl. Pura Goa Lempeh, Uluwatu, Bali",
                mapsUrl: "https://maps.google.com",
                showMapEmbed: false,
                calendarDate: "2025-12-20",
                calendarStartTime: "16:30",
                calendarEndTime: "17:30",
              },
              {
                eventName: "Dinner & After Party",
                date: "Saturday, 20 December 2025",
                timeRange: "18:30 — Late WITA",
                venueName: "The Edge Cliffside Lawn",
                venueAddress: "Jl. Pura Goa Lempeh, Uluwatu, Bali",
                mapsUrl: "https://maps.google.com",
                showMapEmbed: true,
                calendarDate: "2025-12-20",
                calendarStartTime: "18:30",
                calendarEndTime: "23:00",
              },
            ],
          },
        },
        {
          type: "PhotoGallery",
          props: {
            ...puckConfig.components.PhotoGallery.defaultProps!,
            id: "gallery-chic",
            sectionTitle: "Editorial Moments",
            images: [
              {
                imageUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=600&auto=format&fit=crop",
                caption: "Golden hour romance",
              },
              {
                imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
                caption: "Pure elegance",
              },
            ],
          },
        },
        {
          type: "RSVPGuestbook",
          props: {
            ...puckConfig.components.RSVPGuestbook.defaultProps!,
            id: "rsvp-chic",
            sectionTitle: "RSVP & Wishes",
          },
        },
      ],
      root: {
        props: {
          themeConfig: THEME_PRESETS.find((p) => p.id === "midnight-gold")?.config,
        },
      },
    }),
  },
  {
    id: "romantic-blush",
    name: "Romantic Blush",
    category: "romantic",
    description: "Palet dusty rose pastel, aksen emas halus, dan nuansa romantis yang hangat memesona.",
    thumbnail: "https://images.unsplash.com/photo-1519225438150-7d1b324d838e?q=80&w=600&auto=format&fit=crop",
    themePresetId: "rose-romance",
    accentColor: "#e11d48",
    tags: ["Blush", "Dusty Rose", "Romantis", "Floral"],
    generateLayout: (groom: string, bride: string): InvitationData => ({
      content: [
        {
          type: "CoverHero",
          props: {
            ...puckConfig.components.CoverHero.defaultProps!,
            id: "cover-blush",
            groomName: groom,
            brideName: bride,
            weddingDate: "Sabtu, 14 Februari 2026",
            customGreeting: "Forever Begins Today",
            coverImageUrl: "https://images.unsplash.com/photo-1519225438150-7d1b324d838e?q=80&w=1200&auto=format&fit=crop",
          },
        },
        {
          type: "WeddingQuote",
          props: {
            ...puckConfig.components.WeddingQuote.defaultProps!,
            id: "quote-blush",
            title: "Cinta Sejati",
            arabicText: "",
            translationText: "Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong. Kasih menutupi segala sesuatu, percaya segala sesuatu, mengharapkan segala sesuatu, sabar menanggung segala sesuatu.",
            sourceText: "1 Korintus 13:4-7",
            quoteStyle: "classic",
          },
        },
        {
          type: "CoupleProfile",
          props: {
            ...puckConfig.components.CoupleProfile.defaultProps!,
            id: "couple-blush",
            sectionTitle: "The Bride & Groom",
            groomData: {
              photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
              fullName: `${groom} Mahendra`,
              parentNames: "Putra tercinta dari Bpk. Irwan & Ibu Diana",
              instagramHandle: `@${groom.toLowerCase().replace(/\s+/g, "")}`,
            },
            brideData: {
              photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop",
              fullName: `${bride} Clarissa`,
              parentNames: "Putri tercinta dari Bpk. Raymond & Ibu Shirley",
              instagramHandle: `@${bride.toLowerCase().replace(/\s+/g, "")}`,
            },
          },
        },
        {
          type: "CountdownTimer",
          props: {
            ...puckConfig.components.CountdownTimer.defaultProps!,
            id: "countdown-blush",
            targetDate: "2026-02-14T10:00:00+07:00",
            label: "Menuju Hari Kasih",
          },
        },
        {
          type: "EventSchedule",
          props: {
            ...puckConfig.components.EventSchedule.defaultProps!,
            id: "events-blush",
            sectionTitle: "Jadwal Acara",
            events: [
              {
                eventName: "Holy Matrimony",
                date: "Sabtu, 14 Februari 2026",
                timeRange: "10:00 — 12:00 WIB",
                venueName: "Gereja Katedral Santo Petrus",
                venueAddress: "Jl. Merdeka No. 29, Bandung, Jawa Barat",
                mapsUrl: "https://maps.google.com",
                showMapEmbed: false,
                calendarDate: "2026-02-14",
                calendarStartTime: "10:00",
                calendarEndTime: "12:00",
              },
              {
                eventName: "Wedding Reception",
                date: "Sabtu, 14 Februari 2026",
                timeRange: "18:00 — 21:00 WIB",
                venueName: "Glass House at Bumi Sangkuriang",
                venueAddress: "Jl. Kiputih No. 12, Ciumbuleuit, Bandung",
                mapsUrl: "https://maps.google.com",
                showMapEmbed: true,
                calendarDate: "2026-02-14",
                calendarStartTime: "18:00",
                calendarEndTime: "21:00",
              },
            ],
          },
        },
        {
          type: "RSVPGuestbook",
          props: {
            ...puckConfig.components.RSVPGuestbook.defaultProps!,
            id: "rsvp-blush",
            sectionTitle: "Konfirmasi Kehadiran & Doa Restu",
          },
        },
      ],
      root: {
        props: {
          themeConfig: THEME_PRESETS.find((p) => p.id === "rose-romance")?.config,
        },
      },
    }),
  },
];
