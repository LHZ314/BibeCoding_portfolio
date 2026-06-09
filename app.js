// EVE Online Styled Portfolio - Interactive Core

// Faction details data mapping
const factionData = {
  frontend: {
    name: 'Frontend Development',
    slogan: 'Sleek User Interface, State-of-the-Art Interactivity',
    desc: '최첨단 우주선 콕핏(Cockpit) 인터페이스처럼, 사용자에게 압도적이고 매끄러운 시각적 경험을 제공하는 화면을 구현합니다. 성능 최적화, 반응형 레이아웃, 그리고 고급 애니메이션 처리에 탁월합니다.',
    stack: 'React, Next.js, TypeScript, CSS Grid',
    speciality: 'Responsive Layout, WebGL, CSS Animations',
    priority: 'Interactive UX & Fluid Motion',
    data: 'REST API, WebSocket, GraphQL',
    ticker: 'SECTOR_ID: CALDARI_01 // LATENCY: 24MS',
    color: '#00e5ff',
    colorGlow: 'rgba(0, 229, 255, 0.4)'
  },
  backend: {
    name: 'Backend Engineering',
    slogan: 'Secure Infrastructure, Scalable Computation Core',
    desc: '마치 대형 우주선 기지(Citadel)의 내부 동력 시스템처럼, 수많은 데이터 통신과 비즈니스 로직을 보이지 않는 곳에서 견고하고 안전하게 고속 제어 및 보관합니다.',
    stack: 'Node.js, Express, Go (Golang), PostgreSQL',
    speciality: 'DB Optimization, RESTful APIs, Security',
    priority: 'High Performance & Absolute Stability',
    data: 'Redis Caching, SQL & NoSQL Database',
    ticker: 'SECTOR_ID: AMARR_CORE // LATENCY: 12MS',
    color: '#ffb300',
    colorGlow: 'rgba(255, 179, 0, 0.4)'
  },
  devops: {
    name: 'DevOps & Infrastructure',
    slogan: 'Autonomous Deployment Systems, Warp-speed Delivery',
    desc: '전투 함선을 은하계 어느 곳이든 빠르게 출격시키는 항해 추진 기어처럼, 클라우드 리소스를 구성하고 파이프라인을 구축하여 고속 자동 배포 및 무중단 스케일링 환경을 보장합니다.',
    stack: 'AWS, Kubernetes, Docker, Terraform',
    speciality: 'CI/CD Pipelines, Infrastructure as Code',
    priority: 'Scalable Automation & High Availability',
    data: 'Github Actions, ArgoCD, Prometheus',
    ticker: 'SECTOR_ID: GALLENTE_SYSTEMS // LATENCY: 8MS',
    color: '#00e676',
    colorGlow: 'rgba(0, 230, 118, 0.4)'
  },
  uiux: {
    name: 'UI/UX Design',
    slogan: 'Ergonomic Visual Mapping, Dynamic User Journey',
    desc: '조종사가 수많은 데이터 속에서 즉시 직관적으로 판단할 수 있는 HUD를 설계하듯, 유려하고 정밀한 정보 설계를 통해 단순하면서도 깊이 있는 사용자 중심의 디자인 시스템을 구축합니다.',
    stack: 'Figma, Design System, Prototyping',
    speciality: 'Information Hierarchy, Wireframing, Micro-interactions',
    priority: 'Optimal UX Flow & Premium Aesthetics',
    data: 'User Research, Usability Testing',
    ticker: 'SECTOR_ID: MINMATAR_HUD // LATENCY: 40MS',
    color: '#ff3d00',
    colorGlow: 'rgba(255, 61, 0, 0.4)'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // --- Audio Synthesizer (Immersion Click System) ---
  let audioCtx = null;
  let audioEnabled = true;

  const initAudio = () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  };

  const playSound = (freq, type, duration, volume = 0.05) => {
    if (!audioEnabled) return;
    try {
      initAudio();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.log('Audio Context error: ', e);
    }
  };

  // Sound triggers
  const playHoverSound = () => playSound(800, 'sine', 0.08, 0.02);
  const playClickSound = () => playSound(600, 'triangle', 0.12, 0.04);
  const playTabSound = () => {
    playSound(400, 'sine', 0.05, 0.03);
    setTimeout(() => playSound(1200, 'sine', 0.06, 0.02), 40);
  };

  // Attach audio listener to interactive items
  const addSoundsToElements = (elements, hoverFn, clickFn) => {
    elements.forEach(el => {
      if (hoverFn) el.addEventListener('mouseenter', hoverFn);
      if (clickFn) el.addEventListener('click', clickFn);
    });
  };

  // --- Mobile Navigation Menu ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  mobileToggle.addEventListener('click', () => {
    playClickSound();
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');

    // Animate hamburger lines
    const spans = mobileToggle.querySelectorAll('span');
    if (mobileToggle.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // --- Scroll & Navigation System Setup ---
  const sections = Array.from(document.querySelectorAll('section'));
  const footer = document.querySelector('footer.main-footer');
  if (footer) sections.push(footer);

  const navLinks = document.querySelectorAll('.nav-link');
  const skillSection = document.getElementById('profile');
  const skillBars = document.querySelectorAll('.skill-stat-bar-fill');
  let animationTriggered = false;
  let isAnimating = false;

  const getCurrentSectionIndex = () => {
    let maxVisibleHeight = 0;
    let index = 0;
    const viewportTop = window.scrollY;
    const viewportBottom = viewportTop + window.innerHeight;

    sections.forEach((sec, idx) => {
      const rect = sec.getBoundingClientRect();
      const secTop = rect.top + viewportTop;
      const secBottom = rect.bottom + viewportTop;

      const visibleTop = Math.max(secTop, viewportTop);
      const visibleBottom = Math.min(secBottom, viewportBottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);

      if (visibleHeight > maxVisibleHeight) {
        maxVisibleHeight = visibleHeight;
        index = idx;
      }
    });
    return index;
  };

  const smoothScrollTo = (targetY) => {
    isAnimating = true;
    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });

    setTimeout(() => {
      isAnimating = false;
    }, 850);
  };

  // Close menu on link click and handle smooth scroll for local links
  const localLinks = document.querySelectorAll('a[href^="#"]');
  localLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const targetSec = document.querySelector(targetId);
      if (targetSec) {
        e.preventDefault();

        if (link.classList.contains('nav-link')) {
          playClickSound();
          mobileToggle.classList.remove('active');
          navMenu.classList.remove('active');
          const spans = mobileToggle.querySelectorAll('span');
          spans.forEach(s => s.style.transform = 'none');
          spans[1].style.opacity = '1';
        }

        const targetTop = targetSec.getBoundingClientRect().top + window.scrollY;
        smoothScrollTo(targetTop);
      }
    });
  });

  // --- Combined Throttled Scroll Listener (requestAnimationFrame) ---
  let scrollTick = false;

  const handleScroll = () => {
    // 1. Active Navigation Highlighting
    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      if (section.tagName.toLowerCase() === 'footer') return;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });

    // 2. Skill Progress Bar Scroll Animation
    if (!animationTriggered && skillSection) {
      const sectionTop = skillSection.getBoundingClientRect().top;
      const triggerPoint = window.innerHeight - 100;

      if (sectionTop < triggerPoint) {
        skillBars.forEach(bar => {
          const level = bar.getAttribute('data-level');
          bar.style.width = level;
        });

        // Play a quick charging sound for skills
        playSound(300, 'sawtooth', 0.5, 0.02);
        setTimeout(() => playSound(900, 'sine', 0.2, 0.03), 400);

        animationTriggered = true;
      }
    }

    scrollTick = false;
  };

  window.addEventListener('scroll', () => {
    if (!scrollTick) {
      window.requestAnimationFrame(handleScroll);
      scrollTick = true;
    }
  });

  // Trigger once on load
  setTimeout(handleScroll, 500);

  // --- Wheel Event Snapping ---
  window.addEventListener('wheel', (e) => {
    const currentIndex = getCurrentSectionIndex();
    const currentSec = sections[currentIndex];
    const viewportTop = window.scrollY;
    const viewportBottom = viewportTop + window.innerHeight;
    const secRect = currentSec.getBoundingClientRect();
    const secTop = secRect.top + viewportTop;
    const secBottom = secRect.bottom + viewportTop;

    const threshold = 15;
    const isAtBottom = (secBottom - viewportBottom <= threshold);
    const isAtTop = (viewportTop - secTop <= threshold);

    const direction = e.deltaY > 0 ? 'down' : 'up';

    if (direction === 'down') {
      if (isAtBottom && currentIndex < sections.length - 1) {
        e.preventDefault();
        if (!isAnimating) {
          const nextSec = sections[currentIndex + 1];
          const nextSecTop = nextSec.getBoundingClientRect().top + viewportTop;
          smoothScrollTo(nextSecTop);
        }
      }
    } else if (direction === 'up') {
      if (isAtTop && currentIndex > 0) {
        e.preventDefault();
        if (!isAnimating) {
          const prevSec = sections[currentIndex - 1];
          const prevSecTop = prevSec.getBoundingClientRect().top + viewportTop;
          smoothScrollTo(prevSecTop);
        }
      }
    }
  }, { passive: false });

  // --- Touch Swipe Snapping ---
  let touchStartY = 0;
  let touchStartX = 0;

  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (isAnimating) {
      e.preventDefault();
      return;
    }

    const touchEndY = e.touches[0].clientY;
    const touchEndX = e.touches[0].clientX;

    const diffY = touchStartY - touchEndY;
    const diffX = touchStartX - touchEndX;

    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 40) {
      const direction = diffY > 0 ? 'down' : 'up';
      const currentIndex = getCurrentSectionIndex();
      const currentSec = sections[currentIndex];
      const viewportTop = window.scrollY;
      const viewportBottom = viewportTop + window.innerHeight;
      const secRect = currentSec.getBoundingClientRect();
      const secTop = secRect.top + viewportTop;
      const secBottom = secRect.bottom + viewportTop;

      const threshold = 15;
      const isAtBottom = (secBottom - viewportBottom <= threshold);
      const isAtTop = (viewportTop - secTop <= threshold);

      if (direction === 'down' && isAtBottom && currentIndex < sections.length - 1) {
        if (e.cancelable) e.preventDefault();
        const nextSec = sections[currentIndex + 1];
        const nextSecTop = nextSec.getBoundingClientRect().top + viewportTop;
        smoothScrollTo(nextSecTop);
      } else if (direction === 'up' && isAtTop && currentIndex > 0) {
        if (e.cancelable) e.preventDefault();
        const prevSec = sections[currentIndex - 1];
        const prevSecTop = prevSec.getBoundingClientRect().top + viewportTop;
        smoothScrollTo(prevSecTop);
      }
    }
  }, { passive: false });

  // --- Faction/Specialization Interactive System ---
  const factionItems = document.querySelectorAll('.faction-item');
  const detailWindow = document.getElementById('detailWindow');
  const detailName = document.getElementById('detailName');
  const detailSlogan = document.getElementById('detailSlogan');
  const detailDesc = document.getElementById('detailDesc');
  const detailStack = document.getElementById('detailStack');
  const detailSpeciality = document.getElementById('detailSpeciality');
  const detailPriority = document.getElementById('detailPriority');
  const detailData = document.getElementById('detailData');
  const detailTicker = document.getElementById('detailTicker');

  factionItems.forEach(item => {
    item.addEventListener('click', () => {
      playTabSound();

      // Update active state in UI
      factionItems.forEach(fi => fi.classList.remove('active'));
      item.classList.add('active');

      const factionType = item.getAttribute('data-faction');
      const data = factionData[factionType];

      // Update color variables on root for dynamic accent shift
      document.documentElement.style.setProperty('--accent-active', data.color);
      document.documentElement.style.setProperty('--accent-active-glow', data.colorGlow);

      // Shift nebula background color slightly based on sector (Desktop only for performance)
      const nebulaBg = document.getElementById('nebulaBg');
      if (nebulaBg && window.innerWidth > 768) {
        if (factionType === 'frontend') nebulaBg.style.filter = 'hue-rotate(0deg)';
        if (factionType === 'backend') nebulaBg.style.filter = 'hue-rotate(60deg)';
        if (factionType === 'devops') nebulaBg.style.filter = 'hue-rotate(120deg)';
        if (factionType === 'uiux') nebulaBg.style.filter = 'hue-rotate(-60deg)';
      } else if (nebulaBg) {
        nebulaBg.style.filter = 'none';
      }

      // Update content elements with subtle fade animation
      if (detailWindow) {
        detailWindow.style.opacity = '0.5';
        detailWindow.style.transform = 'translateY(5px)';
      }

      setTimeout(() => {
        if (detailName) detailName.textContent = data.name;
        if (detailSlogan) detailSlogan.textContent = data.slogan;
        if (detailDesc) detailDesc.textContent = data.desc;
        if (detailStack) detailStack.textContent = data.stack;
        if (detailSpeciality) detailSpeciality.textContent = data.speciality;
        if (detailPriority) detailPriority.textContent = data.priority;
        if (detailData) detailData.textContent = data.data;
        if (detailTicker) detailTicker.textContent = data.ticker;

        if (detailWindow) {
          detailWindow.style.opacity = '1';
          detailWindow.style.transform = 'none';
        }
      }, 150);
    });
  });

  // --- Projects DB Filtering ---
  const filterBtns = document.querySelectorAll('.db-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playTabSound();

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const type = card.getAttribute('data-type');
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        if (filterVal === 'all' || type === filterVal) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // --- Setup Sound Effects on Buttons ---
  const normalButtons = document.querySelectorAll('.btn-eve, .btn-eve-alt, .project-link, .logo-link');
  addSoundsToElements(normalButtons, playHoverSound, playClickSound);

  const factionBtns = document.querySelectorAll('.faction-item');
  addSoundsToElements(factionBtns, playHoverSound, null); // click is handled separately

  const dbFilters = document.querySelectorAll('.db-filter-btn');
  addSoundsToElements(dbFilters, playHoverSound, null); // click is handled separately

  // --- Live Dynamic Telemetry ---
  const updateTelemetryCoords = () => {
    const coords = [
      Math.floor(Math.random() * 1000) + '.' + Math.floor(Math.random() * 99),
      Math.floor(Math.random() * 1000) + '.' + Math.floor(Math.random() * 99),
      Math.floor(Math.random() * 1000) + '.' + Math.floor(Math.random() * 99)
    ];

    const ticker = document.getElementById('detailTicker');
    if (ticker) {
      const baseText = ticker.textContent.split(' // ')[0];
      ticker.textContent = `${baseText} // SCAN_COORD: ${coords.join(':')} // OK`;
    }
  };

  setInterval(updateTelemetryCoords, 4000);
});
