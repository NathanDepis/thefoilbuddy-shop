/**
 * Video testimonials shown at the bottom of shop/product pages.
 * Extracted from the live Wix site's "They Talk About Us" gallery.
 *
 * Supported sources:
 *  - YouTube: `{ source: 'youtube', id: 'VIDEO_ID' }`
 *  - Vimeo:   `{ source: 'vimeo',   id: 'VIDEO_ID' }`
 *  - MP4:     `{ source: 'mp4',     url: 'https://...mp4', poster?: 'https://...jpg' }`
 *
 * Leave the array empty to hide the whole section.
 */

export type VideoTestimonial =
  | {
      source: 'youtube';
      id: string;
      caption?: string;
    }
  | {
      source: 'vimeo';
      id: string;
      caption?: string;
    }
  | {
      source: 'mp4';
      url: string;
      poster?: string;
      caption?: string;
    };

const VIDEO_BASE = 'https://video.wixstatic.com/video';
const POSTER_BASE = 'https://static.wixstatic.com/media';

export const VIDEO_TESTIMONIALS: VideoTestimonial[] = [
  {
    source: 'mp4',
    url: `${VIDEO_BASE}/67a543_74bedbb8b25f4623a6591672c705b9ab/480p/mp4/file.mp4`,
    poster: `${POSTER_BASE}/67a543_74bedbb8b25f4623a6591672c705b9abf001.jpg`,
  },
  {
    source: 'mp4',
    url: `${VIDEO_BASE}/67a543_56490d4270494f8e99cbad3d8082245b/720p/mp4/file.mp4`,
    poster: `${POSTER_BASE}/67a543_56490d4270494f8e99cbad3d8082245bf001.jpg`,
  },
  {
    source: 'mp4',
    url: `${VIDEO_BASE}/67a543_16e5a4154e69474b843438b1e9121a62/720p/mp4/file.mp4`,
    poster: `${POSTER_BASE}/67a543_16e5a4154e69474b843438b1e9121a62f001.jpg`,
  },
  {
    source: 'mp4',
    url: `${VIDEO_BASE}/67a543_178be7c17eec4dce91fb99ca8b6a7bf5/720p/mp4/file.mp4`,
    poster: `${POSTER_BASE}/67a543_178be7c17eec4dce91fb99ca8b6a7bf5f001.jpg`,
  },
];
