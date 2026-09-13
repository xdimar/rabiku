import { z } from "zod";

/* ─── Hex Color Validation ─── */

export const hexColorSchema = z
  .string()
  .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Format warna hex tidak valid (contoh: #FF5733)")
  .transform((val) => val.toUpperCase());

export function isValidHexColor(value: string): boolean {
  return hexColorSchema.safeParse(value).success;
}

/* ─── Slug Validation ─── */

export const slugSchema = z
  .string()
  .min(3, "Slug minimal 3 karakter")
  .max(80, "Slug maksimal 80 karakter")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug hanya boleh berisi huruf kecil, angka, dan strip (-)"
  );

export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/* ─── Invitation Creation ─── */

export const createInvitationSchema = z.object({
  title: z
    .string()
    .min(1, "Judul undangan wajib diisi")
    .max(200, "Judul maksimal 200 karakter"),
  slug: slugSchema,
  groomName: z
    .string()
    .min(1, "Nama mempelai pria wajib diisi")
    .max(100, "Nama maksimal 100 karakter")
    .optional(),
  brideName: z
    .string()
    .min(1, "Nama mempelai wanita wajib diisi")
    .max(100, "Nama maksimal 100 karakter")
    .optional(),
  templateType: z.enum(["blank", "preset"]).optional(),
  presetId: z.string().optional(),
});

/* ─── Guestbook Entry ─── */

export const guestbookEntrySchema = z.object({
  invitationId: z.string().min(1, "ID undangan wajib"),
  guestName: z
    .string()
    .min(1, "Nama tamu wajib diisi")
    .max(100, "Nama tamu maksimal 100 karakter")
    .transform((val) => val.trim()),
  attendanceStatus: z.enum(["ATTENDING", "NOT_ATTENDING", "TENTATIVE"]),
  message: z
    .string()
    .max(1000, "Pesan maksimal 1000 karakter")
    .optional()
    .transform((val) => val?.trim() || undefined),
});

/* ─── Guest Bulk Add ─── */

export const guestItemSchema = z.object({
  name: z
    .string()
    .min(1, "Nama tamu wajib diisi")
    .max(100, "Nama tamu maksimal 100 karakter")
    .transform((val) => val.trim()),
  phone: z
    .string()
    .max(20, "Nomor telepon terlalu panjang")
    .optional()
    .transform((val) => val?.trim() || undefined),
});

export const bulkGuestsSchema = z.object({
  invitationId: z.string().min(1),
  guestList: z.array(guestItemSchema).min(1, "Minimal 1 tamu"),
});

/* ─── Input Sanitizer (XSS Prevention) ─── */

const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /on\w+\s*=\s*["'][^"']*["']/gi,
  /javascript\s*:/gi,
  /data\s*:\s*text\/html/gi,
  /vbscript\s*:/gi,
];

export function sanitizeString(input: string): string {
  let sanitized = input;
  for (const pattern of DANGEROUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, "");
  }
  return sanitized;
}

export function sanitizeLayoutData(layoutStr: string): string {
  // Parse, sanitize string values recursively, then re-serialize
  try {
    const data = JSON.parse(layoutStr);
    const sanitized = deepSanitize(data);
    return JSON.stringify(sanitized);
  } catch {
    // If not valid JSON, sanitize as string
    return sanitizeString(layoutStr);
  }
}

function deepSanitize(obj: unknown): unknown {
  if (typeof obj === "string") {
    return sanitizeString(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(deepSanitize);
  }
  if (obj && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = deepSanitize(value);
    }
    return result;
  }
  return obj;
}
