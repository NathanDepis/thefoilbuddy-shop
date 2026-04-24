/**
 * Live community stats fetched from the TheFoilBuddy app's Supabase backend.
 * The `spots` and `live_reports` tables are publicly readable with the anon key
 * (same key shipped in the mobile app).
 *
 * We display CUMULATIVE counts, not "today" — the app volume is still seasonal
 * and showing "0 reports today" mid-week is worse than showing a growing total.
 */

const SUPABASE_URL = 'https://nkfougvdwomwguthnsut.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZm91Z3Zkd29td2d1dGhuc3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NjI1MjIsImV4cCI6MjA4NTQzODUyMn0.QFmjDS5xsvmcqLPvnQvK94JkC87L-H79goSt6Yjp3Jc';

export type CommunityStats = {
  spots: number | null;
  reports: number | null;
};

async function fetchCount(table: string): Promise<number | null> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?select=id&limit=1`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: 'count=exact',
        },
        // Revalidate every 5 min — stable counts don't need to be real-time.
        next: { revalidate: 300 },
      },
    );
    if (!res.ok) return null;
    const range = res.headers.get('content-range'); // e.g. "0-0/47"
    if (!range) return null;
    const match = range.match(/\/(\d+)$/);
    if (!match) return null;
    const n = parseInt(match[1], 10);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export async function getCommunityStats(): Promise<CommunityStats> {
  const [spots, reports] = await Promise.all([
    fetchCount('spots'),
    fetchCount('live_reports'),
  ]);
  return { spots, reports };
}
