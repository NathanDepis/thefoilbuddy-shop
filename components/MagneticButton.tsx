'use client';

import { useRef, useEffect, type ReactNode } from 'react';

/**
 * Subtle magnetic effect for premium CTAs.
 * Within `radius` px the element translates toward the cursor at `strength`
 * fraction of the offset. Disabled on touch devices and when the user has
 * prefers-reduced-motion set.
 */
export default function MagneticButton({
  as = 'a',
  href,
  className,
  children,
  radius = 90,
  strength = 0.25,
  ...rest
}: {
  as?: 'a' | 'button';
  href?: string;
  className?: string;
  children: ReactNode;
  radius?: number;
  strength?: number;
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced-motion and skip on touch-primary devices.
    if (typeof window !== 'undefined') {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const touch = window.matchMedia('(hover: none)').matches;
      if (reduce || touch) return;
    }

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > radius) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = 'translate3d(0,0,0)';
        });
        return;
      }
      const k = strength * (1 - dist / radius);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${dx * k}px, ${dy * k}px, 0)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (el) el.style.transform = 'translate3d(0,0,0)';
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [radius, strength]);

  const style = { transition: 'transform 180ms cubic-bezier(0.22, 1, 0.36, 1)' };

  if (as === 'button') {
    return (
      <button
        ref={ref as React.RefObject<HTMLButtonElement>}
        className={className}
        style={style}
        {...rest}
      >
        {children}
      </button>
    );
  }
  return (
    <a
      ref={ref as React.RefObject<HTMLAnchorElement>}
      href={href}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </a>
  );
}
