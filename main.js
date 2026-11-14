        (function () {
            /* ── THEME TOGGLE ── */
            var themeBtn = document.getElementById('theme-toggle');
            var isLight = false;
            try {
                var savedTheme = localStorage.getItem('theme');
                if (savedTheme === 'light') {
                    isLight = true;
                    document.body.classList.add('light-mode');
                    if (themeBtn) themeBtn.textContent = '🌙';
                }
            } catch (e) {}

            /* ── CURSOR (desktop only) ── */
            if (window.innerWidth > 768 && !('ontouchstart' in window)) {
            var dot = document.getElementById('cursor-dot');
            var ring = document.getElementById('cursor-ring');
            var mx = 0, my = 0, rx = 0, ry = 0;
            document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
            function animCursor() {
                if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
                rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
                if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
                requestAnimationFrame(animCursor);
            }
            animCursor();
            document.querySelectorAll('a, button, .skill-tag, .project-card, .stat-card').forEach(function (el) {
                el.addEventListener('mouseenter', function () { if (ring) { ring.style.transform = 'translate(-50%,-50%) scale(1.8)'; ring.style.borderColor = 'var(--cyan-accent)'; } });
                el.addEventListener('mouseleave', function () { if (ring) { ring.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.borderColor = 'var(--blue-neon)'; } });
            });
            }

            /* ── MATRIX RAIN (Mode Gelap: Cyberpunk Asli, Mode Terang: Versi Baru) ── */
            var canvas = document.getElementById('matrix-canvas');
            var ctx = canvas ? canvas.getContext('2d') : null;
            if (canvas && ctx) {
                var step = 18;
                var cols, drops;
                function initMatrix() {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                    cols = Math.floor(canvas.width / step);
                    drops = [];
                    for (var x = 0; x < cols; x++) drops[x] = 1;
                }
                initMatrix();
                window.addEventListener('resize', initMatrix);

                var chars = '01ABCDEF0110';
                function drawMatrix() {
                    var inLight = document.body.classList.contains('light-mode');
                    ctx.fillStyle = inLight ? 'rgba(232, 232, 232, 0.06)' : 'rgba(2, 13, 26, 0.05)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    ctx.fillStyle = inLight ? 'rgba(0, 102, 204, 0.35)' : '#00aaff';
                    ctx.font = '13px "Share Tech Mono", monospace';

                    for (var i = 0; i < drops.length; i++) {
                        var ch = chars[Math.floor(Math.random() * chars.length)];
                        ctx.fillText(ch, i * step, drops[i] * step);
                        if (drops[i] * step > canvas.height && Math.random() > 0.975) drops[i] = 0;
                        drops[i]++;
                    }
                }
                setInterval(drawMatrix, 50);
            }

            if (themeBtn) {
                themeBtn.addEventListener('click', function () {
                    isLight = !isLight;
                    document.body.classList.toggle('light-mode', isLight);
                    themeBtn.textContent = isLight ? '🌙' : '☀️';
                    try { localStorage.setItem('theme', isLight ? 'light' : 'dark'); } catch (e) {}
                    if (ctx && canvas) {
                        ctx.fillStyle = isLight ? '#E8E8E8' : '#020d1a';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }
                });
            }

            /* ── BOOT SCREEN ── */
            var bootScreen = document.getElementById('boot-screen');
            var mainSite = document.getElementById('main-site');
            var countdownEl = document.getElementById('countdown');
            var accessBtn = document.getElementById('access-btn');
            var count = 3;
            var unlocked = false;

            function unlock() {
                if (unlocked) return;
                unlocked = true;
                if (bootScreen) {
                    bootScreen.style.transition = 'opacity 0.8s ease';
                    bootScreen.style.opacity = '0';
                    bootScreen.style.pointerEvents = 'none';
                    setTimeout(function () { bootScreen.style.display = 'none'; }, 900);
                }
                if (mainSite) { mainSite.style.opacity = '1'; }
                startTyping();
                triggerReveal();
            }

            var timer = setInterval(function () {
                count--;
                if (countdownEl) countdownEl.textContent = count;
                if (count <= 0) { clearInterval(timer); unlock(); }
            }, 1000);

            // Hard fallback
            setTimeout(unlock, 4500);

            if (accessBtn) accessBtn.addEventListener('click', function () { clearInterval(timer); unlock(); });
            document.addEventListener('keydown', function (e) { if (e.key === 'Enter') { clearInterval(timer); unlock(); } });

            /* ── TYPED TEXT ── */
            var roles = ['Penetration Tester', 'Network Engineer', 'Security Analyst', 'Bug Hunter'];
            var ri = 0, ci = 0, deleting = false;
            var typedEl = document.getElementById('typed-text');
            function startTyping() {
                if (!typedEl) return;
                function type() {
                    var current = roles[ri];
                    if (!deleting) {
                        typedEl.textContent = current.slice(0, ci + 1);
                        ci++;
                        if (ci === current.length) { deleting = true; setTimeout(type, 1800); return; }
                    } else {
                        typedEl.textContent = current.slice(0, ci - 1);
                        ci--;
                        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
                    }
                    setTimeout(type, deleting ? 60 : 90);
                }
                type();
            }

            /* ── SCROLL REVEAL ── */
            function triggerReveal() {
                var revealEls = document.querySelectorAll('.reveal');
                var obs = new IntersectionObserver(function (entries) {
                    entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('visible'); });
                }, { threshold: 0.1 });
                revealEls.forEach(function (el) { obs.observe(el); });
            }

            /* ── CERT LIGHTBOX ── */
            var lightbox = document.getElementById('cert-lightbox');
            var lbImg = document.getElementById('cert-lightbox-img');
            var lbName = document.getElementById('cert-lightbox-name');
            var lbClose = document.getElementById('cert-lightbox-close');

            document.querySelectorAll('.cert-card').forEach(function (card) {
                card.addEventListener('click', function (e) {
                    if (e.target.classList.contains('cert-verify') || e.target.closest('.cert-verify')) return;
                    var img = card.dataset.img;
                    var name = card.dataset.name;
                    if (!img) return;
                    lbImg.src = img;
                    lbImg.alt = name || '';
                    lbName.textContent = name || '';
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            });

            function closeLightbox() {
                lightbox.classList.remove('active');
                lbImg.src = '';
                document.body.style.overflow = '';
            }

            if (lbClose) lbClose.addEventListener('click', closeLightbox);
            if (lightbox) lightbox.addEventListener('click', function (e) {
                if (e.target === lightbox) closeLightbox();
            });
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') closeLightbox();
            });

            /* ── HAMBURGER NAV ── */
            var navToggle = document.getElementById('nav-toggle');
            var navLinks = document.querySelector('.nav-links');
            if (navToggle && navLinks) {
                navToggle.addEventListener('click', function () {
                    navLinks.classList.toggle('active');
                    navToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
                });
                // Tutup menu saat link diklik (kecuali dropdown toggle)
                navLinks.querySelectorAll('a').forEach(function (link) {
                    link.addEventListener('click', function (e) {
                        if (link.classList.contains('nav-dropdown-toggle')) return;
                        navLinks.classList.remove('active');
                        navToggle.textContent = '☰';
                    });
                });
            }

            // Tutup dropdown saat klik di luar
            document.addEventListener('click', function (e) {
                var dropdown = document.querySelector('.nav-dropdown');
                if (dropdown && !dropdown.contains(e.target)) {
                    dropdown.classList.remove('open');
                }
            });

            // Prevent dropdown toggle dari scroll ke #
            var dropdownToggle = document.querySelector('.nav-dropdown-toggle');
            if (dropdownToggle) {
                dropdownToggle.addEventListener('click', function (e) {
                    e.preventDefault();
                });
            }

        })();
        /* ── LANGUAGE TOGGLE (EN / ID) ── */
        (function () {
            var translations = {
                /* ── BOOT SCREEN ── */
                'boot-title': { en: 'NETWORK ENGINEER & CYBERSECURITY', id: 'NETWORK ENGINEER & KEAMANAN SIBER' },
                'boot-auto-text': { en: 'auto-unlocking in ', id: 'membuka otomatis dalam ' },
                'boot-auto-suffix': { en: 's... or press [enter] / click button', id: 'd... atau tekan [enter] / klik tombol' },

                /* ── PORTFOLIO.EXE ── */
                'exe-welcome-title': { en: 'Hi! Welcome to my portfolio', id: 'Hai! Selamat datang di portfolioku' },
                'exe-welcome-text': {
                    en: '<span class="hl-green">Cybersecurity and Network Engineer</span> with hands-on experience in enterprise security operations, threat detection, and large-scale network infrastructure deployments. Experienced in managing perimeter security using <span class="hl-blue">Palo Alto Firewalls and Cloudflare</span>, endpoint detection and response (EDR/XDR) through <span class="hl-blue">CrowdStrike and Tanium</span>, device compliance with <span class="hl-blue">Microsoft Intune</span>, and Privileged Access Management (PAM) using <span class="hl-blue">Senhasegura</span>. Also possesses a foundational understanding of <span class="hl-green">Vulnerability Assessment and Penetration Testing (VAPT)</span>, including identifying potential security vulnerabilities. Supported by solid networking expertise in device staging, implementation, and multi-vendor routing and switching across government and enterprise institutions.',
                    id: 'Profesional Cybersecurity dan Network Engineer dengan pengalaman langsung dalam operasional keamanan perusahaan, deteksi ancaman, serta implementasi infrastruktur jaringan berskala besar. Berpengalaman dalam mengelola keamanan perimeter menggunakan <span class="hl-blue">Palo Alto Firewalls dan Cloudflare</span>, sistem Endpoint Detection and Response (EDR/XDR) melalui <span class="hl-blue">CrowdStrike dan Tanium</span>, kepatuhan perangkat menggunakan <span class="hl-blue">Microsoft Intune</span>, serta Privileged Access Management (PAM) menggunakan <span class="hl-blue">Senhasegura</span>. Juga memiliki pemahaman dasar mengenai <span class="hl-green">Vulnerability Assessment and Penetration Testing (VAPT)</span>, termasuk proses mengidentifikasi potensi kerentanan keamanan. Didukung oleh pemahaman jaringan yang kuat dalam proses staging perangkat, implementasi jaringan, serta konfigurasi routing dan switching dari berbagai vendor di lingkungan institusi pemerintahan maupun perusahaan.'
                },
                'exe-role-line': { en: 'Network Engineer & Cybersecurity Junior', id: 'Network Engineer & Junior Keamanan Siber' },
                'exe-cv-btn': { en: 'View CV', id: 'Lihat CV' },

                /* ── HERO ── */
                'hero-tag': { en: 'NETWORK ENGINEER & CYBERSECURITY', id: 'NETWORK ENGINEER & KEAMANAN SIBER' },
                'hero-greeting': { en: "Hello, I'm", id: 'Halo, Saya' },
                'hero-desc': {
                    en: 'Network Engineer transitioning his core focus toward Cybersecurity. Expert in managing network infrastructure and currently dedicated to advancing cyber defense strategies, ranging from system hardening to penetration testing.',
                    id: 'Network Engineer yang kini mendedikasikan fokus pada Cybersecurity. Ahli dalam mengelola infrastruktur jaringan dan saat ini aktif memperdalam strategi keamanan siber, mulai dari hardening sistem hingga penetration testing.'
                },
                'btn-primary': { en: 'VIEW PROJECTS', id: 'LIHAT PROYEK' },
                'btn-secondary': { en: 'CONTACT ME', id: 'HUBUNGI SAYA' },

                /* ── SIKILL ── */
                'about-label': { en: '02 // Skills', id: '02 // Keahlian' },
                'about-title': { en: 'Technical Arsenal', id: 'Keahlian Teknis' },
                'about-p1': {
                    en: "Hello! I'm <strong>Adelwin Nugroho Liandy</strong>, a technology enthusiast currently focusing on the world of networks — especially <strong>TCP/IP, switching, and routing</strong>.",
                    id: "Halo! Saya <strong>Adelwin Nugroho Liandy</strong>, seorang penggemar teknologi yang saat ini fokus pada dunia jaringan — terutama <strong>TCP/IP, switching, dan routing</strong>."
                },
                'about-p2': {
                    en: 'I have a great interest in <strong>cybersecurity</strong> and have explored areas like basic penetration testing. But for now, I want to focus on deepening my network knowledge until I truly master it.',
                    id: 'Saya memiliki ketertarikan besar pada <strong>keamanan siber</strong> dan telah menjelajahi bidang seperti penetration testing dasar. Namun untuk saat ini, saya ingin fokus memperdalam pengetahuan jaringan hingga benar-benar menguasainya.'
                },
                'about-p3': {
                    en: "I'm always eager to explore advanced material and continuously sharpen my skills through <strong>training, certifications, and real-world projects</strong>.",
                    id: "Saya selalu bersemangat menjelajahi materi tingkat lanjut dan terus mengasah kemampuan melalui <strong>pelatihan, sertifikasi, dan proyek nyata</strong>."
                },
                'stat-ctf': { en: 'CERTIFICATIONS', id: 'SERTIFIKASI' },
                'stat-exp': { en: 'YEARS EXPERIENCE', id: 'TAHUN PENGALAMAN' },
                'stat-projects': { en: 'PROJECTS BUILT', id: 'PROYEK DIBANGUN' },
                'stat-award': { en: 'SHOPEE JATENG WINNER', id: 'JUARA SHOPEE JATENG' },

                /* ── SKILLS ── */
                'skills-label': { en: '03 // PROJECTS', id: '03 // PROYEK' },
                'skills-title': { en: 'Featured Work', id: 'Karya Unggulan' },

                /* ── PROJECTS ── */
                'projects-label': { en: '04 // EXPERIENCE', id: '04 // PENGALAMAN' },
                'projects-title': { en: 'Career Timeline', id: 'Perjalanan Karir' },
                'proj1-desc': {
                    en: 'Automated WhatsApp commerce bot engineered with Node.js and Baileys. Features catalog browsing, dynamic QRIS payments, order management, stock management, and automatic digital credential delivery with owner confirmation.',
                    id: 'Bot jual-beli WhatsApp otomatis yang dikembangkan dengan Node.js dan Baileys. Dilengkapi fitur katalog produk, pembayaran QRIS, manajemen pesanan & stok, serta pengiriman akun digital otomatis dengan konfirmasi owner.'
                },
                'proj2-desc': {
                    en: 'Built a responsive Pomodoro Timer web application with focus sessions, short and long breaks, audio alerts, and intuitive controls to boost study and work productivity.',
                    id: 'Aplikasi web Pomodoro Timer responsif dengan sesi fokus, jeda istirahat pendek & panjang, notifikasi alarm suara, dan kontrol intuitif untuk meningkatkan produktivitas belajar serta bekerja.'
                },
                'proj3-desc': {
                    en: 'Developed a responsive personal Link in Bio landing page (similar to Linktree) with clean aesthetics, smooth UI, video background support, and centralized links to social profiles and projects.',
                    id: 'Mengembangkan halaman landing page personal Link in Bio (mirip Linktree) responsif dengan desain bersih, antarmuka halus, dukungan video latar, serta tautan terpusat ke media sosial dan portofolio.'
                },

                /* ── SERTIFIKASI ── */
                'exp-label': { en: '05 // CERTIFICATIONS', id: '05 // SERTIFIKASI' },
                'exp-title': { en: 'Credentials & Certs', id: 'Kredensial & Sertifikat' },

                /* ── BLOG ── */
                'cert-label': { en: '06 // BLOG', id: '06 // BLOG' },
                'cert-title': { en: 'Latest Writings', id: 'Tulisan Terbaru' },

                /* ── WEBINAR ── */
                'blog-label': { en: '06.5 // TALKS & WEBINARS', id: '06.5 // TALKS & WEBINARS' },
                'blog-title': { en: 'Webinar Sessions', id: 'Sesi Webinar' },
                'blog-view-all': { en: 'view all on blog →', id: 'lihat semua di blog →' },
                'blog-excerpt-1': {
                    en: 'Basic discussion of computer networks — covering fundamental concepts needed to understand CCNA 200-301 material from the ground up.',
                    id: 'Pembahasan dasar jaringan komputer — mencakup konsep fundamental yang dibutuhkan untuk memahami materi CCNA 200-301 dari awal.'
                },
                'blog-excerpt-2': {
                    en: 'Explains essential Linux commands such as pwd, cd, ls, rm, and others — a practical guide for beginners getting started with Linux.',
                    id: 'Menjelaskan perintah dasar Linux seperti pwd, cd, ls, rm, dan lainnya — panduan praktis bagi pemula yang baru memulai Linux.'
                },
                'blog-excerpt-3': {
                    en: 'A guide to understanding read, write, and execute permissions and ownership control in Linux — covering chmod and chown in depth.',
                    id: 'Panduan memahami izin baca, tulis, dan eksekusi serta kontrol kepemilikan di Linux — membahas chmod dan chown secara mendalam.'
                },

                /* ── Contact ── */
                'webinars-label': { en: '07 // CONTACT', id: '07 // KONTAK' },
                'webinars-title': { en: 'Establish Connection', id: 'Hubungi Saya' },
                'webinar-cs': { en: 'Stay tuned', id: 'Segera hadir' },
                'webinar-soon': { en: 'Coming Soon', id: 'Segera Hadir' },

                /* ── CONTACT ── */
                'contact-label': { en: '07 // CONTACT', id: '07 // KONTAK' },
                'contact-title': { en: 'Establish Connection', id: 'Hubungi Saya' },
                'contact-h3': { en: "Let's Work Together", id: 'Mari Bekerja Sama' },
                'contact-p': {
                    en: 'Available for network engineering projects, cybersecurity consulting, and collaboration opportunities. Response time: < 24h.',
                    id: 'Tersedia untuk proyek rekayasa jaringan, konsultasi keamanan siber, dan peluang kolaborasi. Waktu respons: < 24 jam.'
                },
                'form-name': { en: '// YOUR_NAME', id: '// NAMA_ANDA' },
                'form-email': { en: '// YOUR_EMAIL', id: '// EMAIL_ANDA' },
                'form-msg': { en: '// MESSAGE', id: '// PESAN' },
                'form-ph-name': { en: 'enter your name...', id: 'masukkan nama anda...' },
                'form-ph-email': { en: 'enter your email...', id: 'masukkan email anda...' },
                'form-ph-msg': { en: 'enter your message...', id: 'masukkan pesan anda...' },
                'form-submit': { en: 'SEND_MESSAGE →', id: 'KIRIM_PESAN →' },

                /* ── FOOTER ── */
                'footer-status': { en: 'SYSTEM ONLINE // OPEN TO OPPORTUNITIES', id: 'SISTEM AKTIF // TERBUKA UNTUK PELUANG' },
                'footer-rights': { en: '// ALL RIGHTS RESERVED', id: '// SEMUA HAK DILINDUNGI' },
            };

            var currentLang = 'en';

            function applyLang(lang) {
                currentLang = lang;

                // Toggle active class on buttons
                document.getElementById('lang-en').classList.toggle('active', lang === 'en');
                document.getElementById('lang-id').classList.toggle('active', lang === 'id');

                var t = {};
                for (var k in translations) { t[k] = translations[k][lang]; }

                // Boot screen
                var bootTitle = document.querySelector('.boot-title');
                if (bootTitle) bootTitle.textContent = t['boot-title'];
                var bootAuto = document.getElementById('boot-auto-label');
                if (bootAuto) bootAuto.textContent = t['boot-auto-text'];
                var bootSuffix = document.getElementById('boot-auto-suffix');
                if (bootSuffix) bootSuffix.textContent = t['boot-auto-suffix'];

                // Portfolio.exe
                var exeTitle = document.querySelector('.exe-welcome-title');
                if (exeTitle) { exeTitle.innerHTML = t['exe-welcome-title'] + '<span class="exe-cursor"></span>'; }
                var exeText = document.querySelector('.exe-welcome-text');
                if (exeText) exeText.innerHTML = t['exe-welcome-text'];
                var exeRole = document.querySelector('.exe-role-line');
                if (exeRole) exeRole.textContent = t['exe-role-line'];
                var exeCV = document.querySelector('.exe-cv-btn');
                if (exeCV) exeCV.textContent = t['exe-cv-btn'];

                // Hero
                var heroTag = document.querySelector('.hero-tag');
                if (heroTag) heroTag.textContent = t['hero-tag'];
                var heroGreeting = document.getElementById('hero-greeting');
                if (heroGreeting) heroGreeting.textContent = t['hero-greeting'];
                var heroDesc = document.querySelector('.hero-desc');
                if (heroDesc) heroDesc.textContent = t['hero-desc'];
                var btnPrimary = document.querySelector('.btn-primary');
                if (btnPrimary) btnPrimary.textContent = t['btn-primary'];
                var btnSecondary = document.querySelector('.btn-secondary');
                if (btnSecondary) btnSecondary.textContent = t['btn-secondary'];

                // About
                var labels = document.querySelectorAll('.section-label');
                var titles = document.querySelectorAll('h2.section-title');
                var sectionMap = [
                    { label: t['about-label'], title: t['about-title'] },
                    { label: t['skills-label'], title: t['skills-title'] },
                    { label: t['projects-label'], title: t['projects-title'] },
                    { label: t['exp-label'], title: t['exp-title'] },
                    { label: t['cert-label'], title: t['cert-title'] },
                    { label: t['blog-label'], title: t['blog-title'] },
                    { label: t['webinars-label'], title: t['webinars-title'] },
                    { label: t['contact-label'], title: t['contact-title'] },
                ];
                sectionMap.forEach(function (s, i) {
                    if (labels[i]) labels[i].textContent = s.label;
                    if (titles[i]) titles[i].textContent = s.title;
                });

                // About paragraphs
                var aboutPs = document.querySelectorAll('.about-text p');
                if (aboutPs[0]) aboutPs[0].innerHTML = t['about-p1'];
                if (aboutPs[1]) aboutPs[1].innerHTML = t['about-p2'];
                if (aboutPs[2]) aboutPs[2].innerHTML = t['about-p3'];

                // Stat labels
                var statLabels = document.querySelectorAll('.stat-label');
                var statKeys = ['stat-ctf', 'stat-exp', 'stat-projects', 'stat-award'];
                statLabels.forEach(function (el, i) { if (statKeys[i]) el.textContent = t[statKeys[i]]; });

                // Project descriptions
                var projDescs = document.querySelectorAll('.project-desc');
                if (projDescs[0]) projDescs[0].textContent = t['proj1-desc'];
                if (projDescs[1]) projDescs[1].textContent = t['proj2-desc'];
                if (projDescs[2]) projDescs[2].textContent = t['proj3-desc'];

                // Blog excerpts
                var blogExcerpts = document.querySelectorAll('.blog-excerpt');
                if (blogExcerpts[0]) blogExcerpts[0].textContent = t['blog-excerpt-1'];
                if (blogExcerpts[1]) blogExcerpts[1].textContent = t['blog-excerpt-2'];
                if (blogExcerpts[2]) blogExcerpts[2].textContent = t['blog-excerpt-3'];

                // Blog view all
                var blogViewAll = document.getElementById('blog-view-all');
                if (blogViewAll) blogViewAll.textContent = t['blog-view-all'];

                // Webinar coming soon
                var csLabel = document.querySelector('.webinar-cs-label');
                if (csLabel) csLabel.textContent = '// ' + t['webinar-soon'].toUpperCase();
                var csStay = document.getElementById('webinar-stay-tuned');
                if (csStay) csStay.textContent = t['webinar-cs'];

                // Contact
                var contactH3 = document.querySelector('.contact-info h3');
                if (contactH3) contactH3.textContent = t['contact-h3'];
                var contactP = document.querySelector('.contact-info p');
                if (contactP) contactP.innerHTML = t['contact-p'];
                var formLabels = document.querySelectorAll('.form-label');
                var formKeys = ['form-name', 'form-email', 'form-msg'];
                formLabels.forEach(function (el, i) { if (formKeys[i]) el.textContent = t[formKeys[i]]; });
                var nameInput = document.querySelector('.form-input[type="text"]');
                if (nameInput) nameInput.placeholder = t['form-ph-name'];
                var emailInput = document.querySelector('.form-input[type="email"]');
                if (emailInput) emailInput.placeholder = t['form-ph-email'];
                var msgInput = document.querySelector('.form-textarea');
                if (msgInput) msgInput.placeholder = t['form-ph-msg'];
                var formSubmit = document.querySelector('.form-submit');
                if (formSubmit) formSubmit.textContent = t['form-submit'];

                // Footer
                var footerStatus = document.querySelector('.footer-status');
                if (footerStatus) {
                    footerStatus.innerHTML = '<div class="status-dot"></div>' + t['footer-status'];
                }
                var footerCopy = document.querySelector('.footer-copy');
                if (footerCopy) {
                    footerCopy.innerHTML = '© 2025 <span>AdelwinNL</span> ' + t['footer-rights'];
                }

                // Skills — ww-card & cat-title spans (data-en / data-id)
                document.querySelectorAll('[data-en][data-id]').forEach(function (el) {
                    el.textContent = lang === 'en' ? el.dataset.en : el.dataset.id;
                });
            }

            // Button listeners

            document.getElementById('lang-en').addEventListener('click', function () { applyLang('en'); });
            document.getElementById('lang-id').addEventListener('click', function () { applyLang('id'); });

            /* ── PROJECT CAROUSEL + MODAL ── */
            var modal = document.getElementById('projectModal');
            var modalImg = document.getElementById('modalImg');
            var modalCounter = document.getElementById('modalCounter');
            var currentProject = 0;
            var currentImageIndex = 0;
            var projectValidImages = [];

            function pad2(n) {
                return (n < 10 ? '0' : '') + n;
            }

            function imageLoaded(img) {
                if (img.complete) return Promise.resolve(img.naturalWidth > 0);
                return new Promise(function (resolve) {
                    img.addEventListener('load', function () { resolve(img.naturalWidth > 0); }, { once: true });
                    img.addEventListener('error', function () { resolve(false); }, { once: true });
                });
            }

            function initCarousel(el, projectIndex) {
                var viewport = el.querySelector('.carousel-viewport');
                var track = el.querySelector('.carousel-track');
                var allImgs = Array.prototype.slice.call(el.querySelectorAll('.carousel-img'));
                var counter = el.querySelector('.carousel-counter');
                var dotsWrap = el.querySelector('.carousel-dots');
                var prevBtn = el.querySelector('.carousel-prev');
                var nextBtn = el.querySelector('.carousel-next');

                if (!track || allImgs.length === 0) {
                    el.classList.add('is-empty');
                    return;
                }

                // Keep the slides hidden until we know which images are real
                track.style.visibility = 'hidden';

                Promise.all(allImgs.map(imageLoaded)).then(function (results) {
                    var valid = [];
                    allImgs.forEach(function (img, i) {
                        if (results[i]) valid.push(img);
                        else img.remove();
                    });

                    if (valid.length === 0) {
                        track.style.visibility = 'visible';
                        el.classList.add('is-empty');
                        var ph = document.createElement('div');
                        ph.className = 'carousel-empty';
                        ph.innerHTML = '<span>&gt;_</span><p>No documentation photos yet</p>';
                        viewport.appendChild(ph);
                        return;
                    }

                    el.classList.add(valid.length === 1 ? 'is-single' : 'is-multi');
                    projectValidImages[projectIndex] = valid;

                    // Dots
                    valid.forEach(function (img, i) {
                        var d = document.createElement('button');
                        d.type = 'button';
                        d.className = 'carousel-dot';
                        d.setAttribute('aria-label', 'Go to photo ' + (i + 1));
                        d.addEventListener('click', function (e) {
                            e.stopPropagation();
                            goTo(i);
                        });
                        dotsWrap.appendChild(d);
                    });
                    var dots = Array.prototype.slice.call(dotsWrap.children);

                    var index = 0;
                    var justSwiped = false;

                    function render() {
                        index = (index + valid.length) % valid.length;
                        track.style.transform = 'translateX(-' + index * 100 + '%)';
                        counter.textContent = pad2(index + 1) + ' / ' + pad2(valid.length);
                        dots.forEach(function (d, i) { d.classList.toggle('active', i === index); });
                    }

                    function goTo(i) {
                        index = i;
                        render();
                    }

                    if (valid.length > 1) {
                        prevBtn.addEventListener('click', function (e) { e.stopPropagation(); goTo(index - 1); });
                        nextBtn.addEventListener('click', function (e) { e.stopPropagation(); goTo(index + 1); });

                        // Touch / mouse swipe
                        var startX = null;
                        track.addEventListener('pointerdown', function (e) { startX = e.clientX; });
                        track.addEventListener('pointerup', function (e) {
                            if (startX === null) return;
                            var dx = e.clientX - startX;
                            startX = null;
                            if (Math.abs(dx) > 40) {
                                justSwiped = true;
                                goTo(index + (dx < 0 ? 1 : -1));
                                setTimeout(function () { justSwiped = false; }, 300);
                            }
                        });
                        track.addEventListener('pointercancel', function () { startX = null; });
                    }

                    // Click a photo -> fullscreen modal
                    valid.forEach(function (img, i) {
                        img.addEventListener('click', function () {
                            if (justSwiped) return;
                            currentProject = projectIndex;
                            currentImageIndex = i;
                            modalImg.src = img.src;
                            modalCounter.textContent = (i + 1) + ' / ' + valid.length;
                            modal.classList.add('active');
                            document.body.style.overflow = 'hidden';
                        });
                    });

                    render();
                    track.style.visibility = 'visible';
                });
            }

            var carousels = document.querySelectorAll('.project-carousel');
            for (var ci = 0; ci < carousels.length; ci++) {
                initCarousel(carousels[ci], ci);
            }

            window.closeModal = function () {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            };

            function modalStep(dir) {
                var valid = projectValidImages[currentProject];
                if (!valid) return;
                currentImageIndex = (currentImageIndex + dir + valid.length) % valid.length;
                modalImg.src = valid[currentImageIndex].src;
                modalCounter.textContent = (currentImageIndex + 1) + ' / ' + valid.length;
            }

            window.prevImage = function () { modalStep(-1); };
            window.nextImage = function () { modalStep(1); };

            // Keyboard navigation
            document.addEventListener('keydown', function (e) {
                if (!modal.classList.contains('active')) return;
                if (e.key === 'Escape') closeModal();
                if (e.key === 'ArrowLeft') prevImage();
                if (e.key === 'ArrowRight') nextImage();
            });

        })();
