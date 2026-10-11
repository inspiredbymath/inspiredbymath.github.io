const STEP_INSET = 44;
const BASELINE_PAD = 44;

class StaircaseVisualizer {
    constructor() {
        this.canvas = document.getElementById('staircase-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.steps = 5;
        this.paths = [];
        this.currentPathIndex = 0;
        this.isAnimating = false;
        this.timer = null;

        this.setupEventListeners();
        this.calculatePaths();
        this.draw();
    }

    setupEventListeners() {
        document.getElementById('steps-slider').addEventListener('input', (event) => {
            this.stopAnimation();
            this.steps = parseInt(event.target.value, 10);
            document.getElementById('steps-value').textContent = this.steps;
            this.currentPathIndex = 0;
            this.calculatePaths();
            this.draw();
        });

        document.getElementById('animate-btn').addEventListener('click', () => {
            this.animateAllPaths();
        });

        document.getElementById('step-btn').addEventListener('click', () => {
            this.showNextPath();
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            this.reset();
        });
    }

    calculatePaths() {
        this.paths = [];
        this.findPaths(0, []);
        this.updateStats();
    }

    findPaths(position, current) {
        if (position === this.steps) {
            this.paths.push([...current]);
            return;
        }
        if (position > this.steps) return;

        current.push(1);
        this.findPaths(position + 1, current);
        current.pop();

        current.push(2);
        this.findPaths(position + 2, current);
        current.pop();
    }

    draw() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        ctx.clearRect(0, 0, width, height);

        const steps = this.steps;
        const stepWidth = Math.min(58, (width - 90) / (steps + 1));
        const stepHeight = Math.min(36, (height - 90) / (steps + 1));
        const baseline = height - BASELINE_PAD;

        // Ground
        ctx.fillStyle = '#efe7d6';
        ctx.fillRect(0, baseline, width, height - baseline);
        ctx.strokeStyle = '#ded6c6';
        ctx.beginPath();
        ctx.moveTo(0, baseline);
        ctx.lineTo(width, baseline);
        ctx.stroke();

        // Steps
        for (let i = 0; i <= steps; i++) {
            const x = STEP_INSET + i * stepWidth;
            const y = baseline - i * stepHeight;

            ctx.fillStyle = '#f3ecdd';
            ctx.strokeStyle = '#d8cfba';
            ctx.lineWidth = 2;
            ctx.fillRect(x, y - stepHeight, stepWidth, stepHeight);
            ctx.strokeRect(x, y - stepHeight, stepWidth, stepHeight);

            ctx.fillStyle = '#a89e8b';
            ctx.font = `500 ${Math.round(stepHeight * 0.5)}px 'IBM Plex Mono', monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(i, x + stepWidth / 2, y - stepHeight / 2);
        }

        // Current path
        if (this.currentPathIndex > 0 && this.currentPathIndex <= this.paths.length) {
            const path = this.paths[this.currentPathIndex - 1];
            let position = 0;
            let fromX = STEP_INSET + stepWidth / 2;
            let fromY = baseline - stepHeight / 2;

            ctx.fillStyle = '#177f7a';
            ctx.beginPath();
            ctx.arc(fromX, fromY, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';

            for (const stepSize of path) {
                position += stepSize;
                const toX = STEP_INSET + position * stepWidth + stepWidth / 2;
                const toY = baseline - position * stepHeight - stepHeight / 2;
                const color = stepSize === 1 ? '#2f6fb0' : '#b8442c';

                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.moveTo(fromX, fromY);
                ctx.lineTo(toX, toY);
                ctx.stroke();

                ctx.fillStyle = color;
                ctx.font = "600 13px 'IBM Plex Mono', monospace";
                ctx.fillText(`+${stepSize}`, (fromX + toX) / 2 + 12, (fromY + toY) / 2 - 8);

                fromX = toX;
                fromY = toY;
            }

            ctx.fillStyle = '#b8442c';
            ctx.beginPath();
            ctx.arc(fromX, fromY, 7, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    updateStats() {
        const total = this.paths.length;
        document.getElementById('total-ways').textContent = total;
        document.getElementById('fibonacci-info').textContent = `F(${this.steps + 1}) = ${total}`;
        this.updateCurrentPathLabel();
    }

    updateCurrentPathLabel() {
        const label = document.getElementById('current-path');

        if (this.currentPathIndex > 0) {
            const path = this.paths[this.currentPathIndex - 1]
                .map((step) => `+${step}`)
                .join(' ');
            label.textContent = `${this.currentPathIndex}/${this.paths.length}  ${path}`;
        } else {
            label.textContent = '—';
        }
    }

    showNextPath() {
        if (this.paths.length === 0) return;

        this.currentPathIndex = (this.currentPathIndex % this.paths.length) + 1;
        this.updateCurrentPathLabel();
        this.draw();
    }

    animateAllPaths() {
        if (this.isAnimating) {
            this.stopAnimation();
            return;
        }

        this.isAnimating = true;
        this.currentPathIndex = 0;
        document.getElementById('animate-btn').textContent = 'Stop';

        let index = 0;
        const next = () => {
            index++;
            if (index > this.paths.length) {
                this.stopAnimation();
                return;
            }
            this.currentPathIndex = index;
            this.updateCurrentPathLabel();
            this.draw();
            this.timer = setTimeout(next, 850);
        };

        this.timer = setTimeout(next, 300);
    }

    stopAnimation() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.isAnimating = false;
        document.getElementById('animate-btn').textContent = 'Animate all paths';
    }

    reset() {
        this.stopAnimation();
        this.currentPathIndex = 0;
        this.updateCurrentPathLabel();
        this.draw();
    }
}

new StaircaseVisualizer();
