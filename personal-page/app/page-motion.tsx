'use client';
import { useEffect } from 'react';

export default function PageMotion() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.work-row, .project-card, .small-project, .section-heading, .experience-entry, .education-entry',
      ),
    );
    let reveal: IntersectionObserver | undefined;
    const setup = () => {
      reveal?.disconnect();
      targets.forEach((el) => el.classList.remove('reveal-pending'));
      if (reduced.matches) return;
      reveal = new IntersectionObserver(
        (entries) => {
          for (const entry of entries)
            if (entry.isIntersecting) {
              entry.target.classList.remove('reveal-pending');
              entry.target.classList.add('revealed');
              reveal?.unobserve(entry.target);
            }
        },
        { threshold: 0.06, rootMargin: '0px 0px -20px 0px' },
      );
      targets.forEach((el) => {
        if (el.getBoundingClientRect().top > window.innerHeight) {
          el.classList.add('reveal-pending');
          reveal?.observe(el);
        }
      });
    };
    setup();
    reduced.addEventListener('change', setup);
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('.navigation a'),
    );
    const sections = links
      .map((link) => document.querySelector<HTMLElement>(link.hash))
      .filter((el): el is HTMLElement => !!el);
    let frame = 0;
    const update = () => {
      frame = 0;
      let active: string | undefined = sections[0]?.id;
      for (const section of sections)
        if (section.getBoundingClientRect().top <= 150) active = section.id;
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      )
        active = sections.at(-1)?.id;
      links.forEach((link) => {
        if (link.hash === `#${active}`)
          link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', scroll, { passive: true });
    update();
    return () => {
      reveal?.disconnect();
      targets.forEach((el) => el.classList.remove('reveal-pending'));
      reduced.removeEventListener('change', setup);
      window.removeEventListener('scroll', scroll);
      cancelAnimationFrame(frame);
      links.forEach((link) => link.removeAttribute('aria-current'));
    };
  }, []);
  return null;
}
