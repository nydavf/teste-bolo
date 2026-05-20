document.addEventListener('DOMContentLoaded', () => {
    // Loader
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 800);

    // Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    // Check local storage for theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'dark') {
            icon.classList.replace('fa-moon', 'fa-sun');
        }
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            icon.classList.replace('fa-sun', 'fa-moon');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            icon.classList.replace('fa-moon', 'fa-sun');
        }
    });

    // Mobile Menu
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const i = mobileMenu.querySelector('i');
        if (navLinks.classList.contains('active')) {
            i.classList.replace('fa-bars', 'fa-times');
        } else {
            i.classList.replace('fa-times', 'fa-bars');
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenu.querySelector('i').classList.replace('fa-times', 'fa-bars');
        });
    });

    // Sticky Header
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Fade In Animations
    const fadeElements = document.querySelectorAll('.fade-in');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));

    // Accordion FAQ
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');
            
            // Close other open items
            document.querySelectorAll('.accordion-content').forEach(c => {
                if (c !== content) {
                    c.style.maxHeight = null;
                    c.parentElement.querySelector('.accordion-header').classList.remove('active');
                }
            });

            header.classList.toggle('active');
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // Modal Logic
    const modal = document.getElementById('order-modal');
    const closeBtn = document.querySelector('.close-modal');
    const orderBtns = document.querySelectorAll('.btn-pedido');
    const modalProductName = document.getElementById('modal-product-name');
    const modalProductImg = document.getElementById('modal-product-img');
    const copyPixBtn = document.getElementById('copy-pix-btn');
    const pixKeyInput = document.getElementById('pix-key');
    const orderForm = document.getElementById('order-form');

    orderBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const productName = card.querySelector('h3').innerText;
            const productImgSrc = card.querySelector('img').src;

            modalProductName.innerText = productName;
            modalProductImg.src = productImgSrc;
            
            // Reset form
            orderForm.reset();

            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Copy PIX Key
    copyPixBtn.addEventListener('click', () => {
        pixKeyInput.select();
        pixKeyInput.setSelectionRange(0, 99999); // For mobile devices
        navigator.clipboard.writeText(pixKeyInput.value).then(() => {
            const originalText = copyPixBtn.innerHTML;
            copyPixBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
            copyPixBtn.style.backgroundColor = '#25D366';
            setTimeout(() => {
                copyPixBtn.innerHTML = originalText;
                copyPixBtn.style.backgroundColor = '';
            }, 2000);
        });
    });

    // Form Submit -> WhatsApp
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const product = modalProductName.innerText;
        const details = document.getElementById('order-details').value;
        const quantity = document.getElementById('order-quantity').value;
        const date = document.getElementById('order-date').value;
        
        // Format date to BR format
        const [year, month, day] = date.split('-');
        const formattedDate = `${day}/${month}/${year}`;

        let message = `*NOVO PEDIDO - SITE* 🎂\n\n`;
        message += `*Produto:* ${product}\n`;
        message += `*Quantidade/Peso:* ${quantity}\n`;
        message += `*Data do Evento:* ${formattedDate}\n`;
        message += `*Detalhes:* ${details}\n\n`;
        message += `Já realizei o pagamento via PIX e estou enviando o comprovante!`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappNumber = '5582991424574';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
        closeModal();
    });
});
