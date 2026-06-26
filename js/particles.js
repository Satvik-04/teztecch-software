/**
 * particles.js
 * Premium Canvas-based interactive particle and network system.
 */

class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 180 };
        this.animationFrameId = null;
        this.isTabActive = true;
    }

    init() {
        if (!this.canvas) return;

        this.resizeCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    resizeCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    createParticles() {
        this.particles = [];
        // Scale number of particles based on screen width for performance
        const density = window.innerWidth < 768 ? 40 : 100;
        
        for (let i = 0; i < density; i++) {
            const size = Math.random() * 2 + 1;
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const directionX = (Math.random() - 0.5) * 0.4;
            const directionY = (Math.random() - 0.5) * 0.4;
            
            // Randomly assign primary accent green or yellow theme color
            const color = Math.random() > 0.65 ? 'rgba(253, 184, 19, 0.4)' : 'rgba(10, 79, 46, 0.25)';

            this.particles.push({
                x, y, directionX, directionY, size, color
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });

        // Track cursor relative to the canvas parent element
        const parent = this.canvas.parentElement;
        parent.addEventListener('mousemove', (e) => {
            const rect = parent.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        parent.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        // Pause/resume loop when tab changes focus to save CPU resources
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.isTabActive = false;
                cancelAnimationFrame(this.animationFrameId);
            } else {
                this.isTabActive = true;
                this.animate();
            }
        });
    }

    animate() {
        if (!this.isTabActive) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw and update particles
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Move particle
            p.x += p.directionX;
            p.y += p.directionY;

            // Boundary collision
            if (p.x < 0 || p.x > this.canvas.width) p.directionX = -p.directionX;
            if (p.y < 0 || p.y > this.canvas.height) p.directionY = -p.directionY;

            // Draw particle
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Connect neighboring particles (Network Line effect)
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 110) {
                    // Lines fade out gracefully based on proximity
                    const opacity = (1 - (distance / 110)) * 0.12;
                    this.ctx.strokeStyle = `rgba(10, 79, 46, ${opacity})`;
                    this.ctx.lineWidth = 0.8;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }

            // Connection/attraction to cursor
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouse.radius) {
                    const opacity = (1 - (distance / this.mouse.radius)) * 0.2;
                    this.ctx.strokeStyle = `rgba(253, 184, 19, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.stroke();
                }
            }
        }

        // Draw Mouse Glow Spotlight effect
        if (this.mouse.x !== null && this.mouse.y !== null) {
            const glow = this.ctx.createRadialGradient(
                this.mouse.x, this.mouse.y, 10,
                this.mouse.x, this.mouse.y, this.mouse.radius
            );
            glow.addColorStop(0, 'rgba(253, 184, 19, 0.04)');
            glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            this.ctx.fillStyle = glow;
            this.ctx.beginPath();
            this.ctx.arc(this.mouse.x, this.mouse.y, this.mouse.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }
}

// Auto-initialize inside hero banners when loaded
document.addEventListener('DOMContentLoaded', () => {
    const bgParticles = new ParticleSystem('hero-canvas');
    bgParticles.init();
});
