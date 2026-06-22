document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ==========================================================================
    // 1. KINEMATOGRAFICZNY SYSTEM SCROLL-REVEAL (Natychmiastowe odsłanianie tekstu)
    // ==========================================================================
    const revealOptions = {
        root: null,
        rootMargin: '-8% 0px -8% 0px',
        threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Jeśli sekcja zawiera liczniki, uruchom animację cyfr
                if (entry.target.classList.contains('hero-section')) {
                    animateCounters();
                }
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    const targetElements = document.querySelectorAll('.animate-trigger');
    targetElements.forEach(element => revealObserver.observe(element));

    // Zabezpieczenie awaryjne (Fallback): Odsłoń tekst po 1.5s, jeśli skrypt napotka blokadę
    setTimeout(() => {
        targetElements.forEach(el => {
            if (!el.classList.contains('visible')) el.classList.add('visible');
        });
    }, 1500);


    // ==========================================================================
    // 2. DYNAMICZNA ANIMACJA LICZNIKÓW LICZBOWYCH 3D
    // ==========================================================================
    let countersAnimated = false;
    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;

        const metrics = [
            { element: document.querySelector('.hero-trust-metrics .metric-item:nth-child(2) .metric-value'), target: 15420, suffix: '+' }
        ];

        metrics.forEach(metric => {
            if (!metric.element) return;
            let start = 0;
            const end = metric.target;
            const duration = 2000;
            const startTime = performance.now();

            function updateNumber(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Zaawansowany efekt spowolnienia (Cubic Easing Out)
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const currentNumber = Math.floor(easeProgress * end);
                
                metric.element.innerHTML = currentNumber.toLocaleString('pl-PL') + metric.suffix;

                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                }
            }
            requestAnimationFrame(updateNumber);
        });
    }


    // ==========================================================================
    // 3. INTELIGENTNY STICKY HEADER (Mikro-interakcje nagłówka)
    // ==========================================================================
    const header = document.querySelector('.main-header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 60) {
            header.classList.add('header-scrolled');
            header.style.background = 'rgba(255, 255, 255, 0.92)';
            header.style.boxShadow = '0 20px 50px rgba(6, 24, 48, 0.05)';
            header.style.height = '80px';
        } else {
            header.classList.remove('header-scrolled');
            header.style.background = 'rgba(255, 255, 255, 0.85)';
            header.style.boxShadow = 'none';
            header.style.height = '100px';
        }

        // Efekt autoukrywania na mobile (Płynne chowanie przy skrolowaniu w dół)
        if (window.innerWidth < 768) {
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
        lastScrollY = currentScrollY;
    }, { passive: true });


    // ==========================================================================
    // 4. INTERAKTYWNE MENU MOBILNE UX Z BLOKADĄ TŁA
    // ==========================================================================
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    if (menuToggle && mobileMenu) {
        const toggleMenu = () => {
            const isOpen = mobileMenu.classList.toggle('open');
            menuToggle.classList.toggle('active');
            document.body.style.overflow = isOpen ? 'hidden' : '';
            
            // Efekt elastycznego wejścia linków
            if (isOpen) {
                mobileLinks.forEach((link, index) => {
                    link.style.transform = 'translateY(20px)';
                    link.style.opacity = '0';
                    setTimeout(() => {
                        link.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                        link.style.transform = 'translateY(0)';
                        link.style.opacity = '1';
                    }, 100 + index * 50);
                });
            }
        };

        menuToggle.addEventListener('click', toggleMenu);
        mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));
    }


    // ==========================================================================
    // 5. ASYNCHRONICZNE FORMULARZE (Efekt ładowania procesorów dyspozytorskich)
    // ==========================================================================
    const handleFormSubmit = (formId, successButtonCallback) => {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalContent = submitBtn.innerHTML;

            // Blokada pól i przycisku
            submitBtn.disabled = true;
            submitBtn.style.cursor = 'not-allowed';
            submitBtn.innerHTML = '<span><i class="fa-solid fa-circle-notch fa-spin"></i> Szyfrowanie połączenia...</span>';

            // Haptyczny sygnał sukcesu dla smartfonów (Delikatna wibracja)
            if (navigator.vibrate) navigator.vibrate([40, 40, 40]);

            // Ekskluzywna symulacja przetwarzania zgłoszenia w chmurze technicznej
            setTimeout(() => {
                submitBtn.innerHTML = '<span><i class="fa-solid fa-satellite-dish fa-bounce"></i> Lokalizowanie najbliższego wozu...</span>';
                
                setTimeout(() => {
                    successButtonCallback(form, submitBtn, originalContent);
                }, 1000);
            }, 1200);
        });
    };

    // Obsługa głównego formularza zgłoszeniowego
    handleFormSubmit('main-contact-form', (form, btn, original) => {
        const successMessage = document.getElementById('form-success');
        form.style.opacity = '0.3';
        form.style.pointerEvents = 'none';
        btn.style.display = 'none';
        if (successMessage) successMessage.style.display = 'flex';
    });

    // Obsługa szybkiego formularza Call-Back w sekcji Hero
    handleFormSubmit('hero-quick-form', (form, btn, original) => {
        btn.style.background = '#22c55e';
        btn.style.borderColor = '#22c55e';
        btn.innerHTML = '<span><i class="fa-solid fa-check-double"></i> Połączenie zarezerwowane!</span>';
        form.reset();
        
        setTimeout(() => {
            btn.disabled = false;
            btn.style.cursor = 'pointer';
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.innerHTML = original;
        }, 4000);
    });


    // ==========================================================================
    // 6. EFEKT MAGNETYCZNY DLA PRZYCISKÓW PREMIUM (Luksusowy akcent mikro-UX)
    // ==========================================================================
    if (window.innerWidth > 1024) {
        const premiumButtons = document.querySelectorAll('.btn-primary, .phone-cta-top');
        
        premiumButtons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Przesunięcie elementu w stronę kursora (efekt przyciągania)
                btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px) scale(1.02)`;
                btn.style.transition = 'none';
            });

            btn.addEventListener('mouseleave', () => {
                // Płynny powrót do pozycji wyjściowej
                btn.style.transform = 'translate(0px, 0px) scale(1)';
                btn.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            });
        });
    }
});
