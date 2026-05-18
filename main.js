import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', () => {
    // Reveal elements on scroll
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(el => revealOnScroll.observe(el));

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.padding = '10px 0';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.8)';
            navbar.style.padding = '20px 0';
        }
    });

    // Modal logic
    const applyModal = document.getElementById('applyModal');
    const openModalBtn = document.getElementById('openApplyModal');
    const closeModalBtn = document.getElementById('closeApplyModal');
    const modalBackdrop = document.querySelector('.modal-backdrop');

    const openModal = () => {
        if (applyModal) applyModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    const closeModal = () => {
        if (applyModal) applyModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (openModalBtn) openModalBtn.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // Form submission
    const form = document.getElementById('membershipForm');
    const submitBtn = form?.querySelector('button[type="submit"]');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = 'Applying...';
            }

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            try {
                const { error } = await supabase
                    .from('applications')
                    .insert([
                        {
                            full_name: data.name,
                            phone: data.phone,
                            area: data.area,
                            frequency: data.frequency,
                            membership_tier: data.membership,
                            status: 'pending'
                        }
                    ]);

                if (error) throw error;

                // Show success state
                const container = form.parentElement;
                container.innerHTML = `
                    <div class="text-center" style="padding: 40px 0;">
                        <h2 style="margin-bottom: 10px;">Application Received</h2>
                        <p style="color: var(--text-muted); margin-bottom: 30px;">Thank you, ${data.name}. Our concierge will contact you on WhatsApp shortly to discuss your membership.</p>
                        <button onclick="location.reload()" class="btn btn-outline">Close</button>
                    </div>
                `;
            } catch (err) {
                console.error('Error submitting form:', err);
                alert('Something went wrong. Please try again or contact us directly.');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = 'Submit Application';
                }
            }
        });
    }

    // Smooth scroll for anchor links and trigger modal for #apply
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            if (href === '#apply') {
                openModal();
            } else {
                const target = document.querySelector(href);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
