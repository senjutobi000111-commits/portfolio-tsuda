import { useCallback, useEffect, useState, useRef } from "react";
import { debounce } from "lodash";

const SCROLL_THRESHOLD = 0;
const INTERSECTION_THRESHOLD = 0.75;
const DEBOUNCE_DELAY = 150;

export default function useNavbarState() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverlapping, setIsOverlapping] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const [underlineMotionProps, setUnderlineMotionProps] = useState({
    x: 0,
    scaleX: 0,
    opacity: 0,
  });

  const navbarRef = useRef<HTMLElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const navbarLinksRef = useRef<HTMLUListElement>(null);
  const aboutSectionRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLElement | null>>({});
  const isSmoothScrollingRef = useRef(false);

  useEffect(() => {
    aboutSectionRef.current = document.querySelector("#about-section");
  }, []);

  const handleScroll = useCallback(() => {
    const scrollYPosition = window.scrollY;
    const newIsScrolled = scrollYPosition > SCROLL_THRESHOLD;
    setIsScrolled(newIsScrolled);

    const section = aboutSectionRef.current;
    const navbarEl = navbarRef.current;

    if (section && navbarEl) {
      const sectionRect = section.getBoundingClientRect();
      const navbarRect = navbarEl.getBoundingClientRect();
      const navbarCenterY = navbarRect.top + navbarRect.height / 2;

      const checkOverlap =
        navbarCenterY >= sectionRect.top && navbarCenterY <= sectionRect.bottom;
      setIsOverlapping(checkOverlap);
    }
  }, []);

  const updateUnderlinePosition = useCallback(() => {
    requestAnimationFrame(() => {
      const container = navbarLinksRef.current;
      const underlineEl = underlineRef.current;
      if (!container || !underlineEl) return;

      let targetElement: HTMLElement | null = null;

      if (activeSection && activeSection !== "hero-section") {
        targetElement = linkRefs.current[activeSection];
      }

      if (targetElement) {
        const containerRect = container.getBoundingClientRect();
        const targetElRect = targetElement.getBoundingClientRect();

        const UNDERLINE_BASE_WIDTH = underlineEl.offsetWidth;
        const safeUnderlineBaseWidth =
          UNDERLINE_BASE_WIDTH > 0 ? UNDERLINE_BASE_WIDTH : 1;

        const x = targetElRect.left - containerRect.left + 2;
        const scaleX = (targetElRect.width - 4) / safeUnderlineBaseWidth;

        setUnderlineMotionProps({ x, scaleX, opacity: 1 });
      } else {
        setUnderlineMotionProps({ x: 0, scaleX: 0, opacity: 0 });
      }
    });
  }, [activeSection]);

  const handleResize = useCallback(() => {
    handleScroll();
    updateUnderlinePosition();
  }, [handleScroll, updateUnderlinePosition]);

  useEffect(() => {
    const throttledScroll = () => {
      requestAnimationFrame(() => handleScroll());
    };
    const throttledResize = () => {
      requestAnimationFrame(() => handleResize());
    };

    handleScroll();
    handleResize();

    window.addEventListener("scroll", throttledScroll, { passive: true });
    window.addEventListener("resize", throttledResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      window.removeEventListener("resize", throttledResize);
    };
  }, [handleScroll, handleResize]);

  const handleIntersection = useCallback(
    debounce((entry: IntersectionObserverEntry) => {
      if (!isSmoothScrollingRef.current) {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      }
    }, DEBOUNCE_DELAY),
    [],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => handleIntersection(entry), {
      threshold: INTERSECTION_THRESHOLD,
    });

    const sections = document.querySelectorAll("section[id$='-section']");
    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      handleIntersection.cancel();
    };
  }, [handleIntersection]);

  const startSmoothScroll = () => {
    isSmoothScrollingRef.current = true;
  };

  const endSmoothScroll = () => {
    setTimeout(() => {
      isSmoothScrollingRef.current = false;
    }, 150);
  };

  return {
    isScrolled,
    isOverlapping,
    activeSection,
    hoveredLink,
    navbarRef,
    underlineRef,
    navbarLinksRef,
    linkRefs,
    underlineMotionProps,
    setHoveredLink,
    setActiveSection,
    updateUnderlinePosition,
    startSmoothScroll,
    endSmoothScroll,
  };
}
