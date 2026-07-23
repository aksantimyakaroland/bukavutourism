import type { MetadataRoute } from 'next';
import { createServiceClient } from '@/lib/supabase/service';

const BASE = 'https://visitbukavu.netlify.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServiceClient();

  const [{ data: destinations }, { data: tours }, { data: articles }, { data: guides }, { data: events }] =
    await Promise.all([
      supabase.from('destinations').select('slug, created_at').eq('is_active', true),
      supabase.from('tours').select('slug, created_at').eq('is_active', true),
      supabase.from('articles').select('slug, published_at, created_at').eq('is_published', true),
      supabase.from('guides').select('slug, created_at').eq('is_available', true),
      supabase.from('events').select('slug, event_date').eq('is_active', true),
    ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/destinations`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/tours`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/articles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/guides`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/events`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/gallery`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ];

  const destinationPages: MetadataRoute.Sitemap = (destinations || []).map(d => ({
    url: `${BASE}/destinations/${d.slug}`,
    lastModified: new Date(d.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const tourPages: MetadataRoute.Sitemap = (tours || []).map(t => ({
    url: `${BASE}/tours/${t.slug}`,
    lastModified: new Date(t.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const articlePages: MetadataRoute.Sitemap = (articles || []).map(a => ({
    url: `${BASE}/articles/${a.slug}`,
    lastModified: new Date(a.published_at || a.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const guidePages: MetadataRoute.Sitemap = (guides || []).map(g => ({
    url: `${BASE}/guides/${g.slug}`,
    lastModified: new Date(g.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  const eventPages: MetadataRoute.Sitemap = (events || []).map(e => ({
    url: `${BASE}/events/${e.slug}`,
    lastModified: new Date(e.event_date),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...destinationPages, ...tourPages, ...articlePages, ...guidePages, ...eventPages];
}
