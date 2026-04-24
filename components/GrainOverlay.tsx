/**
 * Site-wide grain noise overlay — pure CSS, no JS, no extra asset requests.
 * Uses an inline SVG fractalNoise turned into a data-uri background.
 * Opacity kept low (0.04) so it adds texture without hurting legibility.
 */
export default function GrainOverlay() {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>';
  const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] mix-blend-soft-light opacity-[0.04]"
      style={{ backgroundImage: `url("${dataUri}")` }}
    />
  );
}
