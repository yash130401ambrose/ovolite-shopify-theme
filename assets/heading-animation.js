/**
 * Heading Animation with GSAP
 * Animates elements with class .hero-heading span
 * Only runs when enable_heading_animation setting is enabled
 */

(function() {
  'use strict';

  // Wait for MinimogSettings to be available and DOM to be ready
  function waitForSettings(callback) {
    if (window.MinimogSettings) {
      callback();
    } else {
      // Wait a bit and try again
      setTimeout(function() {
        waitForSettings(callback);
      }, 50);
    }
  }

  function init() {
    // Check if heading animation is enabled
    const headingAnimationEnabled = window.MinimogSettings?.enable_heading_animation;
    
    if (!headingAnimationEnabled) {
      return; // Exit early if animation is disabled
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initHeadingAnimation);
    } else {
      initHeadingAnimation();
    }
  }

  // Start initialization
  waitForSettings(init);

  function initHeadingAnimation() {
    // Check if GSAP is already loaded
    if (typeof gsap === 'undefined') {
      // Load GSAP from CDN
      loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js', function() {
        // Load ScrollTrigger after GSAP
        loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js', function() {
          // Register ScrollTrigger plugin
          if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
          }
          animateHeadings();
        });
      });
    } else {
      // GSAP is already loaded, check for ScrollTrigger
      if (typeof ScrollTrigger === 'undefined') {
        loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js', function() {
          if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
          }
          animateHeadings();
        });
      } else {
        // Both GSAP and ScrollTrigger are loaded
        if (typeof gsap.registerPlugin === 'function') {
          gsap.registerPlugin(ScrollTrigger);
        }
        animateHeadings();
      }
    }
  }

  function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = callback;
    script.onerror = function() {
      console.error('Failed to load script:', src);
    };
    document.head.appendChild(script);
  }

  function animateHeadings() {
    // Get all elements with class .hero-heading span
    const headingSpans = document.querySelectorAll('.hero-heading span');
    
    if (headingSpans.length === 0) {
      return; // No elements to animate
    }

    // Get settings from MinimogSettings or use defaults
    const settings = window.MinimogSettings || {};
    const duration = settings.heading_animation_duration || 1;
    const stagger = settings.heading_animation_stagger || 0.2;
    const ease = settings.heading_animation_ease || 'power3.out';
    const triggerStart = settings.heading_animation_trigger || 'top 80%';

    // GSAP accepts easing strings directly, so we can use the string as-is
    // Common easing functions: "power1.out", "power2.inOut", "power3.out", "power4.out", "back.out", "elastic.out", etc.
    const easeFunction = ease || 'power3.out';

    // Set initial state: hidden and translated up
    gsap.set(headingSpans, {
      opacity: 0,
      y: 30
    });

    // Group spans by their parent .hero-heading element
    const headingGroups = {};
    headingSpans.forEach(function(span) {
      const parent = span.closest('.hero-heading') || span.parentElement;
      const parentId = parent.id || parent.className || Math.random().toString(36);
      if (!headingGroups[parentId]) {
        headingGroups[parentId] = {
          parent: parent,
          spans: []
        };
      }
      headingGroups[parentId].spans.push(span);
    });

    // Animate each group separately
    Object.keys(headingGroups).forEach(function(groupId) {
      const group = headingGroups[groupId];
      
      gsap.to(group.spans, {
        opacity: 1,
        y: 0,
        duration: duration,
        stagger: stagger,
        ease: easeFunction,
        scrollTrigger: {
          trigger: group.parent,
          start: triggerStart,
          once: true, // Play animation only once
          toggleActions: 'play none none none'
        }
      });
    });
  }
})();

