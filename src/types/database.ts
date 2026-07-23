// Types générés depuis SUPABASE_SCHEMA.sql — représentant les 11 tables.
export type Locale = 'en' | 'fr' | 'sw' | 'pt' | 'es';
export type Category = 'nature' | 'cultural' | 'adventure' | 'urban' | 'gastronomy';
export type Difficulty = 'easy' | 'moderate' | 'hard' | 'extreme';
export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded';
export type UserType = 'client' | 'admin' | 'super_admin';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  user_type: UserType;
  is_active: boolean;
  created_at: string;
}

export interface Destination {
  id: string;
  slug: string;
  name_fr: string; name_en: string; name_sw: string; name_pt: string; name_es: string;
  description_fr: string; description_en: string; description_sw: string; description_pt: string; description_es: string;
  category: Category;
  difficulty: Difficulty;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  image_gallery: string[];
  is_featured: boolean;
  is_active: boolean;
  visit_count: number;
  avg_rating: number;
  created_at: string;
}

export interface Tour {
  id: string;
  destination_id: string;
  slug: string;
  name_fr: string; name_en: string; name_sw: string; name_pt: string; name_es: string;
  description_fr: string; description_en: string; description_sw: string; description_pt: string; description_es: string;
  price: number;
  currency: string;
  duration_hours: number;
  difficulty: Difficulty;
  max_participants: number;
  min_participants: number;
  includes: string[];
  excludes: string[];
  itinerary: ItineraryItem[];
  available_dates: string[];
  avg_rating: number;
  booking_count: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

export interface Guide {
  id: string;
  slug: string;
  full_name: string;
  email: string;
  phone: string;
  bio_fr: string; bio_en: string; bio_sw: string; bio_pt: string; bio_es: string;
  specialties: string[];
  languages: string[];
  hourly_rate: number;
  rating: number;
  review_count: number;
  is_available: boolean;
  certifications: string[];
  experience_years: number;
  created_at: string;
}

export interface Event {
  id: string;
  slug: string;
  title_fr: string; title_en: string; title_sw: string; title_pt: string; title_es: string;
  description_fr: string; description_en: string; description_sw: string; description_pt: string; description_es: string;
  event_date: string;
  end_date: string | null;
  location: string;
  category: string;
  capacity: number;
  ticket_price: number;
  is_free: boolean;
  is_recurring: boolean;
  recurring_pattern: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Article {
  id: string;
  slug: string;
  title_fr: string; title_en: string; title_sw: string; title_pt: string; title_es: string;
  content_fr: string; content_en: string; content_sw: string; content_pt: string; content_es: string;
  excerpt_fr: string; excerpt_en: string; excerpt_sw: string; excerpt_pt: string; excerpt_es: string;
  author_id: string | null;
  image_url: string | null;
  tags: string[];
  is_published: boolean;
  published_at: string | null;
  view_count: number;
  created_at: string;
}

export interface Reservation {
  id: string;
  user_id: string | null;
  tour_id: string;
  guide_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  participants: number;
  reservation_date: string;
  special_requests: string | null;
  total_price: number;
  status: ReservationStatus;
  payment_status: PaymentStatus;
  confirmation_code: string;
  notes: string | null;
  created_at: string;
}

export interface Rating {
  id: string;
  user_id: string | null;
  tour_id: string | null;
  guide_id: string | null;
  rating: number;
  title_fr: string; title_en: string; title_sw: string; title_pt: string; title_es: string;
  content_fr: string; content_en: string; content_sw: string; content_pt: string; content_es: string;
  guide_knowledge: number;
  value_for_money: number;
  safety: number;
  overall_experience: number;
  is_verified: boolean;
  is_moderated: boolean;
  moderator_notes: string | null;
  helpful_count: number;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  destination_id: string | null;
  image_url: string;
  caption_fr: string; caption_en: string; caption_sw: string; caption_pt: string; caption_es: string;
  credit: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  email: string;
  full_name: string;
  subject: string;
  message: string;
  is_read: boolean;
  read_at: string | null;
  is_archived: boolean;
  created_at: string;
}

export interface Setting {
  id: string;
  category: string;
  key: string;
  value: Record<string, unknown>;
  updated_by: string | null;
  updated_at: string;
}

export interface Tables {
  users: User;
  destinations: Destination;
  tours: Tour;
  guides: Guide;
  events: Event;
  articles: Article;
  reservations: Reservation;
  ratings: Rating;
  gallery: GalleryItem;
  contact_messages: ContactMessage;
  settings: Setting;
}

export type TableName = keyof Tables;
