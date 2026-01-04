import matter from 'gray-matter';

// Staircase Problem Visualization

class StaircaseVisualizer {
    constructor() {
        this.canvas = document.getElementById('staircase-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.comparisonCanvas = document.getElementById('comparison-canvas');
        this.comparisonCtx = this.comparisonCanvas.getContext('2d');
        this.steps = 5;
        this.paths = [];
        this.currentPathIndex = 0;
        this.isAnimating = false;
        this.animationFrame = null;

        this.setupEventListeners();
        this.calculatePaths();
        this.draw();
        this.loadRelatedPosts();
    }

    setupEventListeners() {
        document.getElementById('steps-slider').addEventListener('input', (e) => {
            this.steps = parseInt(e.target.value);
            document.getElementById('steps-value').textContent = this.steps;
            this.currentPathIndex = 0;
            this.stopAnimation();
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

    // Calculate all possible paths using recursion
    calculatePaths() {
        this.paths = [];
        this.findPaths(0, []);
        this.updateStats();
        this.displayPathsList();
    }

    findPaths(currentStep, currentPath) {
        if (currentStep === this.steps) {
            this.paths.push([...currentPath]);
            return;
        }

        if (currentStep > this.steps) {
            return;
        }

        // Take 1 step
        currentPath.push(1);
        this.findPaths(currentStep + 1, currentPath);
        currentPath.pop();

        // Take 2 steps
        currentPath.push(2);
        this.findPaths(currentStep + 2, currentPath);
        currentPath.pop();
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw staircase
        this.drawStaircase();

        // Draw current path if any
        if (this.currentPathIndex > 0 && this.currentPathIndex <= this.paths.length) {
            this.drawPath(this.paths[this.currentPathIndex - 1]);
        }

        // Draw comparison visualization
        this.drawComparison();
    }

    drawStaircase() {
        const stepWidth = 60;
        const stepHeight = 40;
        const startX = 50;
        const startY = this.canvas.height - 50;

        // Draw ground
        this.ctx.fillStyle = '#e5e7eb';
        this.ctx.fillRect(0, startY, this.canvas.width, 50);

        // Draw each step
        for (let i = 0; i <= this.steps; i++) {
            const x = startX + i * stepWidth;
            const y = startY - i * stepHeight;

            // Step platform
            this.ctx.fillStyle = '#8b5cf6';
            this.ctx.strokeStyle = '#5b21b6';
            this.ctx.lineWidth = 3;

            this.ctx.fillRect(x, y, stepWidth, stepHeight);
            this.ctx.strokeRect(x, y, stepWidth, stepHeight);

            // Step number
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(i, x + stepWidth / 2, y + stepHeight / 2);
        }
    }

    drawPath(path) {
        const stepWidth = 60;
        const stepHeight = 40;
        const startX = 50;
        const startY = this.canvas.height - 50;

        // Draw the path as a line with circles at each step
        this.ctx.strokeStyle = '#f59e0b';
        this.ctx.lineWidth = 4;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        let currentStep = 0;
        let x = startX + stepWidth / 2;
        let y = startY + stepHeight / 2;

        this.ctx.beginPath();
        this.ctx.moveTo(x, y);

        // Draw circle at start
        this.ctx.fillStyle = '#10b981';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 12, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw path
        for (let stepSize of path) {
            currentStep += stepSize;
            x = startX + currentStep * stepWidth + stepWidth / 2;
            y = startY - currentStep * stepHeight + stepHeight / 2;

            // Draw arc for the step
            this.ctx.strokeStyle = stepSize === 1 ? '#3b82f6' : '#ef4444';
            this.ctx.beginPath();
            const prevX = startX + (currentStep - stepSize) * stepWidth + stepWidth / 2;
            const prevY = startY - (currentStep - stepSize) * stepHeight + stepHeight / 2;
            this.ctx.moveTo(prevX, prevY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();

            // Draw label for step size
            const midX = (prevX + x) / 2;
            const midY = (prevY + y) / 2;
            this.ctx.fillStyle = stepSize === 1 ? '#3b82f6' : '#ef4444';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`+${stepSize}`, midX, midY - 15);
        }

        // Draw circle at end
        this.ctx.fillStyle = '#ef4444';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 12, 0, Math.PI * 2);
        this.ctx.fill();
    }

    updateStats() {
        const totalWays = this.paths.length;
        const fibIndex = this.steps + 1;

        document.getElementById('total-ways').textContent = totalWays;
        document.getElementById('fibonacci-info').textContent = `F(${fibIndex}) = ${totalWays}`;

        if (this.currentPathIndex > 0) {
            const path = this.paths[this.currentPathIndex - 1];
            const pathStr = path.map(s => `+${s}`).join(' ');
            document.getElementById('current-path').textContent = `${this.currentPathIndex}/${totalWays}: ${pathStr}`;
        } else {
            document.getElementById('current-path').textContent = '-';
        }
    }

    displayPathsList() {
        const container = document.getElementById('paths-container');
        container.innerHTML = '';

        if (this.paths.length > 20) {
            container.innerHTML = '<p style="color: #666;">Too many paths to display (>20). Use the animation or step-through to view them.</p>';
            return;
        }

        this.paths.forEach((path, index) => {
            const pathDiv = document.createElement('div');
            pathDiv.className = 'path-item';
            pathDiv.textContent = `${index + 1}. ${path.map(s => `+${s}`).join(' → ')} = ${this.steps}`;
            container.appendChild(pathDiv);
        });
    }

    showNextPath() {
        if (this.paths.length === 0) return;

        this.currentPathIndex = (this.currentPathIndex % this.paths.length) + 1;
        this.updateStats();
        this.draw();
    }

    async animateAllPaths() {
        if (this.isAnimating) {
            this.stopAnimation();
            return;
        }

        this.isAnimating = true;
        document.getElementById('animate-btn').textContent = 'Stop Animation';

        for (let i = 1; i <= this.paths.length; i++) {
            if (!this.isAnimating) break;

            this.currentPathIndex = i;
            this.updateStats();
            this.draw();

            await this.sleep(1000);
        }

        this.isAnimating = false;
        document.getElementById('animate-btn').textContent = 'Animate All Paths';
    }

    stopAnimation() {
        this.isAnimating = false;
        document.getElementById('animate-btn').textContent = 'Animate All Paths';
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    reset() {
        this.currentPathIndex = 0;
        this.stopAnimation();
        this.updateStats();
        this.draw();
    }

    // Comparison visualization methods

    calculatePathsForN(n) {
        const paths = [];
        const findPaths = (currentStep, currentPath) => {
            if (currentStep === n) {
                paths.push([...currentPath]);
                return;
            }
            if (currentStep > n) return;

            currentPath.push(1);
            findPaths(currentStep + 1, currentPath);
            currentPath.pop();

            currentPath.push(2);
            findPaths(currentStep + 2, currentPath);
            currentPath.pop();
        };

        findPaths(0, []);
        return paths;
    }

    darkenColor(hexColor) {
        const colorMap = {
            '#ef4444': '#dc2626',
            '#f59e0b': '#d97706',
            '#10b981': '#059669',
            '#8b5cf6': '#5b21b6'
        };
        return colorMap[hexColor] || '#000000';
    }

    drawMiniPath(ctx, path, startX, startY, stepWidth, stepHeight) {
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        let currentStep = 0;
        let x = startX + stepWidth / 2;
        let y = startY + stepHeight / 2;

        ctx.beginPath();
        ctx.moveTo(x, y);

        for (let stepSize of path) {
            currentStep += stepSize;
            x = startX + currentStep * stepWidth + stepWidth / 2;
            y = startY - currentStep * stepHeight + stepHeight / 2;
            ctx.lineTo(x, y);
        }

        ctx.stroke();
    }

    drawMiniStaircase(ctx, n, offsetX, offsetY, scale, color, showAllPaths = false) {
        const stepWidth = 50 * scale;
        const stepHeight = 35 * scale;
        const startX = offsetX;
        const startY = offsetY;

        const paths = this.calculatePathsForN(n);

        // Draw staircase steps
        for (let i = 0; i <= n; i++) {
            const x = startX + i * stepWidth;
            const y = startY - i * stepHeight;

            ctx.fillStyle = color;
            ctx.strokeStyle = this.darkenColor(color);
            ctx.lineWidth = 2;
            ctx.fillRect(x, y, stepWidth, stepHeight);
            ctx.strokeRect(x, y, stepWidth, stepHeight);

            // Step number
            ctx.fillStyle = 'white';
            ctx.font = `bold ${14 * scale}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(i, x + stepWidth / 2, y + stepHeight / 2);
        }

        // Optionally draw all paths
        if (showAllPaths) {
            paths.forEach(path => {
                this.drawMiniPath(ctx, path, startX, startY, stepWidth, stepHeight);
            });
        }

        return {
            count: paths.length,
            centerX: startX + (n * stepWidth) / 2,
            topY: startY - n * stepHeight - 20,
            bottomY: startY + stepHeight + 10
        };
    }

    drawStaircaseLabel(ctx, text, x, y, count) {
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(text, x, y);

        ctx.fillStyle = '#667eea';
        ctx.font = 'bold 20px Arial';
        ctx.fillText(`${count} ways`, x, y + 25);
    }

    drawMathEquation(ctx, info1, info2, info3) {
        const y = 30;
        const centerX = this.comparisonCanvas.width / 2;

        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';

        const equation = `${info1.count} + ${info2.count} = ${info3.count}`;
        ctx.fillText(equation, centerX, y);

        ctx.font = '16px Arial';
        ctx.fillStyle = '#6b7280';
        ctx.fillText('ways(N-2) + ways(N-1) = ways(N)', centerX, y + 25);
    }

    drawCurvedArrow(ctx, x1, y1, x2, y2, color) {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2;

        const cpX = (x1 + x2) / 2;
        const cpY = Math.min(y1, y2) - 20;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(cpX, cpY, x2, y2);
        ctx.stroke();

        const angle = Math.atan2(y2 - cpY, x2 - cpX);
        const arrowSize = 10;

        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(
            x2 - arrowSize * Math.cos(angle - Math.PI / 6),
            y2 - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            x2 - arrowSize * Math.cos(angle + Math.PI / 6),
            y2 - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
    }

    drawCombinationArrows(ctx, info1, info2, info3) {
        const arrowY = 70;

        this.drawCurvedArrow(ctx, info1.centerX, arrowY, info3.centerX - 40, arrowY + 20, '#ef4444');
        this.drawCurvedArrow(ctx, info2.centerX, arrowY, info3.centerX - 20, arrowY + 10, '#f59e0b');
    }

    drawThreeStaircaseComparison() {
        const ctx = this.comparisonCtx;
        const canvasWidth = this.comparisonCanvas.width;
        const canvasHeight = this.comparisonCanvas.height;

        const scale = Math.min(1.0, 8 / this.steps);

        const spacing = canvasWidth / 4;
        const baseY = canvasHeight - 80;

        const n2 = this.steps - 2;
        const info1 = this.drawMiniStaircase(
            ctx, n2, spacing * 0.5, baseY, scale, '#ef4444', true
        );

        const n1 = this.steps - 1;
        const info2 = this.drawMiniStaircase(
            ctx, n1, spacing * 1.5, baseY, scale, '#f59e0b', true
        );

        const info3 = this.drawMiniStaircase(
            ctx, this.steps, spacing * 2.5, baseY, scale, '#10b981', true
        );

        this.drawStaircaseLabel(ctx, `N-2 = ${n2}`, info1.centerX, info1.bottomY, info1.count);
        this.drawStaircaseLabel(ctx, `N-1 = ${n1}`, info2.centerX, info2.bottomY, info2.count);
        this.drawStaircaseLabel(ctx, `N = ${this.steps}`, info3.centerX, info3.bottomY, info3.count);

        this.drawMathEquation(ctx, info1, info2, info3);
        this.drawCombinationArrows(ctx, info1, info2, info3);
    }

    drawTwoStaircaseComparison() {
        const ctx = this.comparisonCtx;
        const canvasWidth = this.comparisonCanvas.width;
        const baseY = this.comparisonCanvas.height - 100;

        const spacing = canvasWidth / 3;

        const info1 = this.drawMiniStaircase(ctx, 1, spacing * 0.5, baseY, 1.0, '#f59e0b', true);
        const info2 = this.drawMiniStaircase(ctx, 2, spacing * 1.5, baseY, 1.0, '#10b981', true);

        this.drawStaircaseLabel(ctx, 'N-1 = 1', info1.centerX, info1.bottomY, info1.count);
        this.drawStaircaseLabel(ctx, 'N = 2', info2.centerX, info2.bottomY, info2.count);

        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${info1.count} + 1 = ${info2.count}`, canvasWidth / 2, 40);

        ctx.font = '16px Arial';
        ctx.fillStyle = '#6b7280';
        ctx.fillText('(N-2 = 0, so we use 1 as the base)', canvasWidth / 2, 65);
    }

    drawSingleStaircaseComparison() {
        const ctx = this.comparisonCtx;
        const centerX = this.comparisonCanvas.width / 2;
        const baseY = this.comparisonCanvas.height - 100;

        const info = this.drawMiniStaircase(ctx, 1, centerX - 40, baseY, 1.0, '#10b981', true);
        this.drawStaircaseLabel(ctx, 'N = 1', info.centerX, info.bottomY, info.count);

        ctx.fillStyle = '#6b7280';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Base case: Only one way to climb 1 step', centerX, 40);
    }

    drawComparison() {
        this.comparisonCtx.clearRect(0, 0, this.comparisonCanvas.width, this.comparisonCanvas.height);

        if (this.steps === 1) {
            this.drawSingleStaircaseComparison();
            return;
        }
        if (this.steps === 2) {
            this.drawTwoStaircaseComparison();
            return;
        }

        this.drawThreeStaircaseComparison();
    }

    async loadRelatedPosts() {
        const postFiles = import.meta.glob('./src/posts/*.md', { as: 'raw' });
        const container = document.getElementById('related-posts-container');
        const relatedPosts = [];

        for (const path in postFiles) {
            const rawContent = await postFiles[path]();
            const { data } = matter(rawContent);

            if (data.game === 'staircase') {
                relatedPosts.push({
                    slug: data.slug,
                    title: data.title,
                    excerpt: data.excerpt,
                });
            }
        }

        if (relatedPosts.length > 0) {
            container.innerHTML = '<h3>Related Articles</h3>';
            const list = document.createElement('div');
            list.className = 'related-posts-list';

            relatedPosts.forEach(post => {
                const postLink = document.createElement('a');
                postLink.href = `./post.html?slug=${post.slug}`;
                postLink.className = 'related-post-card';
                postLink.innerHTML = `
                    <h4>${post.title}</h4>
                    <p>${post.excerpt}</p>
                `;
                list.appendChild(postLink);
            });

            container.appendChild(list);
        }
    }
}

// Initialize the visualizer when the page loads
new StaircaseVisualizer();
