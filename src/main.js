import './style.css'
import { portfolioData } from './data.js'

document.querySelector('#app').innerHTML = `
  <main>
    <section id="hero">
      <div class="container hero-content">
        <h1 class="id-typing"></h1>
        <p class="reveal delay-1">${portfolioData.hero.subtitle}</p>
        <a href="#projects" class="cta-button reveal delay-2 hover-trigger">${portfolioData.hero.cta}</a>
      </div>
    </section>

    <section id="skills">
      <div class="container">
        <h2 class="reveal">Technical Skills</h2>
        <div class="skills-grid">
          ${portfolioData.skills.map((skill, index) => `
            <div class="skill-card reveal hover-trigger" style="animation-delay: ${index * 0.1}s">
              ${skill.icon ? `<img src="${skill.icon}" alt="${skill.name}" class="skill-icon">` : `<div class="skill-icon" style="background:${skill.color}; border-radius:50%"></div>`}
              <h3>${skill.name}</h3>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <section id="experience">
      <div class="container">
        <h2 class="reveal">Experience</h2>
        <div class="experience-list">
          ${portfolioData.experience.map((exp, index) => `
            <div class="experience-item reveal" style="animation-delay: ${index * 0.2}s">
              <h3>${exp.role}</h3>
              <p style="color: var(--accent-primary)">${exp.company} | ${exp.period}</p>
              <p>${exp.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <section id="projects">
      <div class="container">
        <h2 class="reveal">Featured Projects</h2>
        <div class="project-grid">
          ${portfolioData.projects.map((proj, index) => `
            <div class="project-card reveal hover-trigger" style="animation-delay: ${index * 0.2}s">
              <h3>${proj.title}</h3>
              <p>${proj.description}</p>
              <div class="tech-stack">
                ${proj.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
              </div>
      
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <section id="contact">
      <div class="container">
        <h2 class="reveal">Get In Touch</h2>
        <div class="contact-links reveal delay-1">
          <a href="mailto:${portfolioData.contact.email}" class="contact-link hover-trigger">📧 ${portfolioData.contact.email}</a>
          <a href="https://${portfolioData.contact.linkedin}" target="_blank" class="contact-link hover-trigger">💼 LinkedIn</a>
          <a href="https://${portfolioData.contact.github}" target="_blank" class="contact-link hover-trigger">💻 GitHub</a>
        </div>
      </div>
    </section>
  </main>
`

/* --- TYPING EFFECT --- */
const typingElement = document.querySelector('.id-typing');
const textToType = portfolioData.hero.title;
let charIndex = 0;

function typeText() {
  if (charIndex < textToType.length) {
    typingElement.textContent += textToType.charAt(charIndex);
    charIndex++;
    setTimeout(typeText, 100); 
  }
}

// Start typing after a short delay
setTimeout(typeText, 500);

/* --- CUSTOM CURSOR (Removed for clean Apple feel) --- */
// Logic removed to match new CSS

/* --- MAGNETIC 3D TILT EFFECT --- */
function applyTilt(selector, strength = 20) {
    document.querySelectorAll(selector).forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation based on cursor position relative to center
            const rotateX = ((y - centerY) / centerY) * -(strength / 2); 
            const rotateY = ((x - centerX) / centerX) * (strength / 2);

            // Magnetic translation (move element slightly towards mouse)
            const translateX = ((x - centerX) / centerX) * 5;
            const translateY = ((y - centerY) / centerY) * 5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${translateX}px, ${translateY}px, 0) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translate3d(0, 0, 0) scale3d(1, 1, 1)';
        });
    });
}

// Apply tilt to cards
applyTilt('.skill-card, .project-card', 10); // Subtle tilt

// Apply stronger magnetic effect to buttons
applyTilt('.cta-button', 25);
applyTilt('.contact-link', 15);


/* --- INTERACTIVE COLORFUL BACKGROUND (Mesh Gradient) --- */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let orbs = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const colors = [
    { r: 255, g: 113, b: 206 }, // VW Pink
    { r: 1, g: 205, b: 254 },   // VW Blue
    { r: 185, g: 103, b: 255 }, // VW Purple
    { r: 5, g: 255, b: 161 }    // VW Mint
];

class Orb {
    constructor() {
        this.radius = Math.random() * 150 + 200; // Big soft blobs
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5; // Slow movement
        this.vy = (Math.random() - 0.5) * 0.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.2 + 0.1; // Low opacity
    }

    draw() {
        ctx.beginPath();
        // Create radical gradient for soft edge
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius
        );
        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`);
        gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    update(mouseX, mouseY) {
        // Move naturally
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x < -this.radius || this.x > canvas.width + this.radius) this.vx *= -1;
        if (this.y < -this.radius || this.y > canvas.height + this.radius) this.vy *= -1;

        // Subtle Mouse Attraction/Repulsion
        if (mouseX && mouseY) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 600) {
                this.x += dx * 0.005;
                this.y += dy * 0.005;
            }
        }

        this.draw();
    }
}

function initOrbs() {
    orbs = [];
    const numOrbs = 6;
    for (let i = 0; i < numOrbs; i++) {
        orbs.push(new Orb());
    }
}

let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initOrbs();
});

function animateOrbs() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Add white overlay to blend/blur trails? No, just clear
    
    // Global heavy blur for "Mesh" effect
    // Note: context filter is expensive, might be better to blur via CSS on the canvas element.
    // We already have opacity in style.css, let's add blur there or just rely on gradient softness.
    
    orbs.forEach(orb => orb.update(mouseX, mouseY));
    requestAnimationFrame(animateOrbs);
}

initOrbs();
animateOrbs();


/* --- SCROLL REVEAL (Kept from Phase 1) --- */
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  observer.observe(el);
});
