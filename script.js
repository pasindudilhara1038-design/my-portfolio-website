// Intersection Observer for Scroll Animations
document.addEventListener("DOMContentLoaded", () => {
    // Configure observer options
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    // Create the Intersection Observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once animated to keep it visible
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select all elements that should animate on scroll
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
    animatedElements.forEach(el => observer.observe(el));

    // Dynamic Navigation Background based on scroll position
    const nav = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(0, 0, 0, 0.8)';
            nav.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
            nav.style.backdropFilter = 'saturate(180%) blur(20px)';
        } else {
            nav.style.background = 'rgba(0, 0, 0, 0.4)';
            nav.style.borderBottom = '1px solid transparent';
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
            
            // If the link is inside a dropdown, hide the dropdown so it doesn't block the view
            const dropdown = this.closest('.dropdown-menu');
            if (dropdown) {
                dropdown.style.visibility = 'hidden';
                dropdown.style.opacity = '0';
                
                // Restore the CSS hover capability after a short delay
                setTimeout(() => {
                    dropdown.style.visibility = '';
                    dropdown.style.opacity = '';
                }, 500);
            }
        });
    });

    // Project Slider functionality
    const projectsGrid = document.getElementById('projectsGrid');
    const prevBtn = document.getElementById('prevProject');
    const nextBtn = document.getElementById('nextProject');

    if (projectsGrid && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            const cardWidth = projectsGrid.querySelector('.project-card').offsetWidth;
            const gap = 32; // 2rem gap
            projectsGrid.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            const cardWidth = projectsGrid.querySelector('.project-card').offsetWidth;
            const gap = 32; // 2rem gap
            projectsGrid.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
        });
    }

    // Project Detail Full-Screen Panel
    const panel = document.getElementById('projectPanel');
    const panelBackdrop = document.getElementById('panelBackdrop');
    const panelCloseBtn = document.getElementById('panelCloseBtn');
    const panelImage = document.getElementById('panelImage');
    const panelStatus = document.getElementById('panelStatus');
    const panelYear = document.getElementById('panelYear');
    const panelMeta = document.getElementById('panelMeta');
    const panelTitle = document.getElementById('panelTitle');
    const panelDesc = document.getElementById('panelDesc');
    const panelTech = document.getElementById('panelTech');
    const panelHighlights = document.getElementById('panelHighlights');

    // Per-project highlight bullet points
    const projectHighlights = {
        'Note-to-Coin Exchanger': [
            'Optical banknote recognition using sensor arrays',
            'Precision denomination-based sorting mechanism',
            'Secure coin dispensing unit with exact payout calibration',
            'Full assembly and motion simulation in SolidWorks',
            'Designed for high reliability under continuous operation'
        ],
        'Smart Rainwater Harvesting System': [
            'Multi-stage filtration for domestic-grade water quality',
            'Automated flow control valves with water level sensing',
            'Python-based controller for intelligent water management',
            'Detailed fluid dynamics analysis for rainfall variability',
            'Designed using AutoCAD with full system schematics'
        ],
        'Autonomous Rover Prototype': [
            'Custom rocker-bogie suspension for rough terrain stability',
            'Modular mounts for LIDAR and ultrasonic obstacle sensing',
            'Lightweight 3D-printed chassis optimized for mass reduction',
            'Arduino-based embedded controller with real-time algorithms',
            'Designed for scalable sensor and payload integration'
        ]
    };

    function openPanel(card) {
        const title  = card.dataset.title  || '';
        const img    = card.dataset.img    || '';
        const alt    = card.dataset.alt    || title;
        const desc   = card.dataset.desc   || '';
        const tech   = card.dataset.tech   || '';
        const status = card.dataset.status || '';
        const year   = card.dataset.year   || '';

        panelImage.src = img;
        panelImage.alt = alt;
        panelTitle.textContent = title;
        panelDesc.textContent  = desc;
        panelMeta.textContent  = year ? `Project · ${year}` : 'Project';
        panelYear.textContent  = year;

        // Status badge
        panelStatus.textContent = status;
        panelStatus.className = 'panel-status-badge';
        if (status.toLowerCase() === 'completed') {
            panelStatus.classList.add('completed');
        } else if (status.toLowerCase().includes('progress')) {
            panelStatus.classList.add('in-progress');
        }

        // Tech tags
        panelTech.innerHTML = '';
        tech.split(',').forEach(t => {
            if (t.trim()) {
                const span = document.createElement('span');
                span.textContent = t.trim();
                panelTech.appendChild(span);
            }
        });

        // Highlights
        panelHighlights.innerHTML = '';
        const highlights = projectHighlights[title] || [];
        highlights.forEach(h => {
            const li = document.createElement('li');
            li.textContent = h;
            panelHighlights.appendChild(li);
        });

        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closePanel() {
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Open panel on card click
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => openPanel(card));
    });

    // Close on close button
    if (panelCloseBtn) panelCloseBtn.addEventListener('click', closePanel);

    // Close on backdrop click
    if (panelBackdrop) panelBackdrop.addEventListener('click', closePanel);

    // Close on Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closePanel();
    });

    // Global mouse position
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Cursor Glow Animation
    const cursorGlow = document.querySelector('.cursor-glow');
    if (cursorGlow) {
        let glowX = mouseX;
        let glowY = mouseY;

        function animateGlow() {
            glowX += (mouseX - glowX) * 0.1; // Smooth easing
            glowY += (mouseY - glowY) * 0.1;
            
            cursorGlow.style.transform = `translate(calc(${glowX}px - 50%), calc(${glowY}px - 50%))`;
            requestAnimationFrame(animateGlow);
        }
        
        animateGlow();
    }

    // Antigravity Google Background Particles
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-particles';
    document.body.insertBefore(canvas, document.body.firstChild);
    
    const ctx = canvas.getContext('2d');
    let width, height;
    
    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const particles = [];
    // Space colors: bright white, light blue, soft purple, faint yellow
    const colors = ['#ffffff', '#a1c4fd', '#c2e9fb', '#d4fc79', '#e0c3fc']; 
    const particleCount = 150; // Reduced star count

    for (let i = 0; i < particleCount; i++) {
        // Concentrate particles towards the center using Math.pow
        const distance = Math.pow(Math.random(), 3) * (Math.max(width, height) * 0.8);
        
        // Determine which of the 3 arms this particle belongs to
        const arms = 3;
        const armIndex = i % arms;
        
        // Base angle for the arm
        const baseAngle = (Math.PI * 2 / arms) * armIndex;
        
        // Spiral effect: the further out, the more it twists
        const spiralTwist = distance * 0.005;
        
        // Scatter particles away from the exact arm curve
        // Scatter increases with distance
        const scatterAngle = (Math.random() - 0.5) * 1.5;
        const scatterDist = (Math.random() - 0.5) * (distance * 0.3 + 20);
        
        const finalAngle = baseAngle + spiralTwist + scatterAngle;
        const finalRadius = distance + scatterDist;

        particles.push({
            baseAngle: finalAngle,
            radius: finalRadius,
            size: Math.random() * 1.5 + 0.2, // Slightly smaller
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: Math.random() * 0.4 + 0.1, // Reduced opacity
            parallaxFactor: Math.random() * 0.15 + 0.02,
            twinkleSpeed: Math.random() * 0.03 + 0.01,
            twinklePhase: Math.random() * Math.PI * 2
        });
    }

    let currentMouseOffsetX = 0;
    let currentMouseOffsetY = 0;
    let galaxyRotation = 0;

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        
        // Calculate target parallax offset (inverse to mouse movement)
        const targetOffsetX = (mouseX - width / 2) * -1;
        const targetOffsetY = (mouseY - height / 2) * -1;

        // Smoothly interpolate the current offset towards the target
        currentMouseOffsetX += (targetOffsetX - currentMouseOffsetX) * 0.05;
        currentMouseOffsetY += (targetOffsetY - currentMouseOffsetY) * 0.05;

        const baseCenterX = width / 2;
        const baseCenterY = height / 2;
        
        // Slowly rotate the entire galaxy
        galaxyRotation += 0.001;

        particles.forEach(p => {
            const currentAngle = p.baseAngle + galaxyRotation;
            
            // Apply parallax based on individual factor
            const x = baseCenterX + Math.cos(currentAngle) * p.radius + (currentMouseOffsetX * p.parallaxFactor);
            const y = baseCenterY + Math.sin(currentAngle) * p.radius + (currentMouseOffsetY * p.parallaxFactor);

            // Twinkle effect
            p.twinklePhase += p.twinkleSpeed;
            const currentOpacity = p.opacity * (0.6 + Math.sin(p.twinklePhase) * 0.4);

            ctx.beginPath();
            ctx.arc(x, y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = currentOpacity;
            ctx.fill();
        });

        // Add a subtle galactic core glow
        const coreX = baseCenterX + (currentMouseOffsetX * 0.05);
        const coreY = baseCenterY + (currentMouseOffsetY * 0.05);
        const gradient = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, 400);
        gradient.addColorStop(0, 'rgba(161, 196, 253, 0.04)'); // Extremely soft glow
        gradient.addColorStop(0.5, 'rgba(224, 195, 252, 0.01)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 400, 0, Math.PI * 2);
        ctx.fill();

        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        const openIcon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
        const closeIcon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            if (navLinks.classList.contains('active')) {
                mobileBtn.innerHTML = closeIcon;
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            } else {
                mobileBtn.innerHTML = openIcon;
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileBtn.innerHTML = openIcon;
                document.body.style.overflow = '';
            });
        });
    }
});
