<script>
	import { onMount } from 'svelte';

	let canvas;
	let ctx;
	let particles = [];
	let animationFrame;

	class Particle {
		constructor(canvasWidth, canvasHeight) {
			this.x = Math.random() * canvasWidth;
			this.y = Math.random() * canvasHeight;
			this.size = Math.random() * 3 + 1;
			this.speedX = Math.random() * 0.5 - 0.25;
			this.speedY = Math.random() * 0.5 - 0.25;
			this.opacity = Math.random() * 0.5 + 0.2;
		}

		update(w, h) {
			this.x += this.speedX;
			this.y += this.speedY;

			// Wrap around edges
			if (this.x > w) this.x = 0;
			if (this.x < 0) this.x = w;
			if (this.y > h) this.y = 0;
			if (this.y < 0) this.y = h;
		}

		draw(ctx) {
			ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	onMount(() => {
		ctx = canvas.getContext('2d');

		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		resize();
		window.addEventListener('resize', resize);

		// Create particles
		for (let i = 0; i < 50; i++) {
			particles.push(new Particle(canvas.width, canvas.height));
		}

		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			particles.forEach(p => {
				p.update(canvas.width, canvas.height);
				p.draw(ctx);
			});

			animationFrame = requestAnimationFrame(animate);
		};
		animate();

		return () => {
			cancelAnimationFrame(animationFrame);
			window.removeEventListener('resize', resize);
		};
	});
</script>

<canvas bind:this={canvas} class="particle-canvas"></canvas>

<style>
	.particle-canvas {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		opacity: 0.3;
		pointer-events: none;
	}

	[data-theme="dark"] .particle-canvas {
		opacity: 0.5;
	}
</style>
