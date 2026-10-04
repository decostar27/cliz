const allLabels = ['Members', 'Contact', 'Achievements', 'Profile', 'About', 'Gallery', 'Social', 'Hub', 'News', 'Events', 'Shop', 'More'];

const pathsGroup = document.getElementById('pathsGroup');
const arrowsGroup = document.getElementById('arrowsGroup');
const labelsGroup = document.getElementById('labelsGroup');
const container = document.getElementById('container');
const mainBtn = document.getElementById('mainBtn');

function renderBranches() {
    const count = parseInt(document.getElementById('lineCount').value);
    const gap = parseInt(document.getElementById('lineGap').value);
    
    document.getElementById('lineCountVal').textContent = count;
    document.getElementById('lineGapVal').textContent = gap + '°';
    
    pathsGroup.innerHTML = '';
    arrowsGroup.innerHTML = '';
    labelsGroup.innerHTML = '';
    
    const totalAngle = (count - 1) * gap;
    const startAngle = -90 - (totalAngle / 2); // Center around the top (-90 degrees)

    for (let i = 0; i < count; i++) {
        const angleDeg = startAngle + (i * gap);
        const angleRad = angleDeg * Math.PI / 180;
        
        // Organic curve math
        const startR = 65; // Edge of central button
        const endR = 250 + (Math.random() * 50); // Organic varying lengths
        
        const sx = 500 + Math.cos(angleRad) * startR;
        const sy = 500 + Math.sin(angleRad) * startR;
        const ex = 500 + Math.cos(angleRad) * endR;
        const ey = 500 + Math.sin(angleRad) * endR;
        
        // Create an organic curve by offsetting the control points tangentially
        const curveOffset = (Math.random() - 0.5) * 80; 
        const c1Angle = angleRad + (curveOffset / 200);
        const c1R = startR + (endR - startR) * 0.3;
        const cx1 = 500 + Math.cos(c1Angle) * c1R;
        const cy1 = 500 + Math.sin(c1Angle) * c1R;
        
        const c2Angle = angleRad - (curveOffset / 200);
        const c2R = startR + (endR - startR) * 0.7;
        const cx2 = 500 + Math.cos(c2Angle) * c2R;
        const cy2 = 500 + Math.sin(c2Angle) * c2R;
        
        const pathStr = `M ${sx} ${sy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${ex} ${ey}`;
        
        // 1. Create Path
        const pathNode = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathNode.setAttribute('d', pathStr);
        pathNode.setAttribute('class', 'nerve-path');
        pathNode.setAttribute('filter', 'url(#pencil)'); 
        pathsGroup.appendChild(pathNode);

        const len = pathNode.getTotalLength() || 300;
        pathNode.style.setProperty('--path-length', len);

        // Perfectly calculate arrowhead angle based on the very end of the exact generated path
        const endPt = pathNode.getPointAtLength(len);
        const preEndPt = pathNode.getPointAtLength(Math.max(0, len - 2)); 
        const arrowAngle = Math.atan2(endPt.y - preEndPt.y, endPt.x - preEndPt.x) * 180 / Math.PI;

        // 2. Create Arrowhead
        const arrowGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        arrowGroup.setAttribute('transform', `translate(${endPt.x}, ${endPt.y}) rotate(${arrowAngle})`);
        arrowGroup.setAttribute('class', 'arrow-wrapper');
        const arrowShape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arrowShape.setAttribute('d', 'M -12 -8 L 0 0 L -12 8');
        arrowShape.setAttribute('class', 'arrow-shape nerve-path'); 
        arrowShape.setAttribute('fill', 'none');
        arrowShape.setAttribute('filter', 'url(#pencil)');
        arrowGroup.appendChild(arrowShape);
        arrowsGroup.appendChild(arrowGroup);

        // 3. Create Label
        const labelDiv = document.createElement('div');
        labelDiv.className = 'nerve-label';
        
        const textSpan = document.createElement('span');
        textSpan.className = 'label-text';
        textSpan.textContent = allLabels[i % allLabels.length];
        labelDiv.appendChild(textSpan);
        
        // Automatic Alignment Math for ANY angle spacing
        const arrowAngleRad = arrowAngle * Math.PI / 180;
        const pad = 30; // Push text away from the arrow tip
        const px = endPt.x + Math.cos(arrowAngleRad) * pad;
        const py = endPt.y + Math.sin(arrowAngleRad) * pad;
        
        labelDiv.style.left = `${px}px`;
        labelDiv.style.top = `${py}px`;
        
        // Continuous translation to perfectly align bounding box
        const tx = (Math.cos(arrowAngleRad) - 1) * 50; 
        const ty = (Math.sin(arrowAngleRad) - 1) * 50;
        let baseTransform = `translate(${tx}%, ${ty}%)`;
        
        // Scale origin based on where the arrow is pointing
        const ox = (1 - Math.cos(arrowAngleRad)) * 50; 
        const oy = (1 - Math.sin(arrowAngleRad)) * 50; 
        labelDiv.style.transformOrigin = `${ox}% ${oy}%`;
        labelDiv.style.setProperty('--base-transform', baseTransform);

        // Background Highlighter Box Scribble
        const brushSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        brushSvg.setAttribute('class', 'pastel-brush-svg');
        brushSvg.setAttribute('viewBox', '0 0 100 40');
        brushSvg.setAttribute('preserveAspectRatio', 'none');
        const brushPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        brushPath.setAttribute('d', 'M 5,6 L 95,8 L 3,16 L 98,16 L 4,24 L 97,26 L 5,34 L 94,32');
        brushPath.setAttribute('stroke-width', '9');
        brushPath.setAttribute('stroke-linecap', 'round');
        brushPath.setAttribute('stroke-linejoin', 'round');
        brushPath.setAttribute('fill', 'none');
        brushPath.setAttribute('class', 'brush-path');
        brushPath.setAttribute('filter', 'url(#pencil)');
        brushSvg.appendChild(brushPath);
        labelDiv.appendChild(brushSvg);
        
        const randomOffset = Math.random() * 0.2;
        const delay = (i * 0.05) + randomOffset; 
        pathNode.style.transitionDelay = `${delay}s`;
        arrowGroup.style.transitionDelay = `${delay + 0.6}s`; 
        labelDiv.style.transitionDelay = `${delay + 0.7}s`;
        
        labelsGroup.appendChild(labelDiv);
    }
}

// Initial draw
renderBranches();

mainBtn.addEventListener('click', () => {
    container.classList.toggle('active');
});

// Edit Labels Logic
document.getElementById('editLabelsBtn').addEventListener('click', () => {
    // Stop animation (force it to be fully open)
    container.classList.add('active');
    
    document.querySelectorAll('.label-text').forEach(span => {
        span.setAttribute('contenteditable', 'true');
        span.style.borderBottom = '2px dashed rgba(255,255,255,0.5)';
        span.style.outline = 'none';
        span.style.cursor = 'text';
    });
    
    document.getElementById('saveLabelsBtn').style.display = 'block';
});

// Save Labels Logic
document.getElementById('saveLabelsBtn').addEventListener('click', () => {
    const spans = document.querySelectorAll('.label-text');
    spans.forEach((span, i) => {
        allLabels[i] = span.textContent.trim();
        span.removeAttribute('contenteditable');
        span.style.borderBottom = 'none';
        span.style.cursor = 'pointer';
    });
    
    document.getElementById('saveLabelsBtn').style.display = 'none';
});

// Control Panel Interactions
document.getElementById('textColor').addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--text-color', e.target.value);
});
document.getElementById('lineColor').addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--line-color', e.target.value);
});
document.getElementById('highlightColor').addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--highlight-color', e.target.value);
    // Update accent color for sliders to match
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.style.accentColor = e.target.value;
    });
});
document.getElementById('lineCount').addEventListener('input', () => {
    container.classList.add('is-editing');
    container.classList.remove('active');
    renderBranches();
});
document.getElementById('lineGap').addEventListener('input', () => {
    container.classList.add('is-editing');
    container.classList.remove('active');
    renderBranches();
});

document.getElementById('lineCount').addEventListener('change', () => {
    container.classList.remove('is-editing');
    void container.offsetWidth; // Force reflow
    container.classList.add('active');
});
document.getElementById('lineGap').addEventListener('change', () => {
    container.classList.remove('is-editing');
    void container.offsetWidth; // Force reflow
    container.classList.add('active');
});

// Export Logic
document.getElementById('exportBtn').addEventListener('click', () => {
    const textColor = document.getElementById('textColor').value;
    const lineColor = document.getElementById('lineColor').value;
    const highlightColor = document.getElementById('highlightColor').value;
    const lineCount = document.getElementById('lineCount').value;
    const lineGap = document.getElementById('lineGap').value;
    
    const fullCode = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Animated Nerve Branch</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap');

:root {
    --text-color: ${textColor};
    --line-color: ${lineColor};
    --highlight-color: ${highlightColor};
}

body {
    background-color: #0b0c10; margin: 0; height: 100vh; display: flex;
    justify-content: center; align-items: center; font-family: 'Caveat', cursive;
    overflow: hidden; background-image: radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 60%);
}

.interactive-container { position: relative; width: 1000px; height: 1000px; }

.center-btn {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 120px; height: 120px; border-radius: 50%; cursor: pointer; z-index: 10;
    box-shadow: 0 0 0 3px rgba(224, 228, 236, 0.4), 2px 2px 5px rgba(0,0,0,0.5);
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    overflow: hidden; filter: url(#pencil);
}

.center-btn img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform 0.6s ease, filter 0.4s ease;
    filter: grayscale(100%) contrast(140%) brightness(0.9);
}

.center-btn:hover { transform: translate(-50%, -50%) scale(1.05); box-shadow: 0 0 0 4px rgba(224, 228, 236, 0.6), 4px 4px 10px rgba(0,0,0,0.6); }
.center-btn:hover img { transform: scale(1.1); filter: grayscale(80%) contrast(120%) brightness(1); }
.center-btn::after {
    content: ''; position: absolute; inset: 0; border-radius: 50%;
    background: radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%); pointer-events: none;
}
.interactive-container.active .center-btn { transform: translate(-50%, -50%) scale(0.95); box-shadow: 0 0 0 2px rgba(224, 228, 236, 0.8), 1px 1px 3px rgba(0,0,0,0.8); }

.nerve-svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }

.nerve-path {
    fill: none; stroke: var(--line-color); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round;
    stroke-dasharray: var(--path-length, 1000); stroke-dashoffset: var(--path-length, 1000);
    transition: stroke-dashoffset 0.8s cubic-bezier(0.65, 0, 0.35, 1); opacity: 0.9;
}

.interactive-container.active .nerve-path { stroke-dashoffset: 0; }
.arrow-wrapper { transition: opacity 0.3s ease; opacity: 0; }
.interactive-container.active .arrow-wrapper { opacity: 1; }
.arrow-shape { stroke-dasharray: 40; stroke-dashoffset: 40; transition: stroke-dashoffset 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.interactive-container.active .arrow-shape { stroke-dashoffset: 0; }

/* Editing State (Static Display) */
.interactive-container.is-editing .nerve-path,
.interactive-container.is-editing .arrow-shape,
.interactive-container.is-editing .arrow-wrapper,
.interactive-container.is-editing .nerve-label {
    transition: none !important;
}
.interactive-container.is-editing .nerve-path,
.interactive-container.is-editing .arrow-shape {
    stroke-dashoffset: 0;
}
.interactive-container.is-editing .arrow-wrapper,
.interactive-container.is-editing .nerve-label {
    opacity: 1;
}
.interactive-container.is-editing .nerve-label {
    transform: var(--base-transform) scale(1) rotate(0deg);
}

#labelsGroup { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5; }

.nerve-label {
    position: absolute; color: var(--text-color); font-size: 28px; font-weight: 700; letter-spacing: 2px;
    padding: 2px 14px; white-space: nowrap; opacity: 0;
    transform: var(--base-transform) scale(0.9) rotate(-3deg);
    transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.2s ease;
}

.interactive-container.active .nerve-label {
    opacity: 1; transform: var(--base-transform) scale(1) rotate(0deg); pointer-events: auto; cursor: pointer;
}

.pastel-brush-svg { position: absolute; top: 50%; left: -5%; width: 110%; height: 130%; transform: translateY(-50%); z-index: -1; pointer-events: none; }
.brush-path {
    stroke: var(--highlight-color); stroke-dasharray: 800; stroke-dashoffset: 800; opacity: 0.95; transition: stroke-dashoffset 0.5s ease-out;
}
.nerve-label:hover .brush-path { stroke-dashoffset: 0; }
.nerve-label:hover { color: #000000; text-shadow: 0 0 2px rgba(255, 255, 255, 0.3); }

.action-btn {
    background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7)); color: #000;
    border: 1px solid rgba(255,255,255,0.8); padding: 12px 24px; border-radius: 40px; font-size: 14px;
    font-weight: 700; font-family: 'Outfit', sans-serif; cursor: pointer; transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255,255,255,0.2), inset 0 -2px 5px rgba(0,0,0,0.1);
}
.action-btn:hover { transform: translateY(-2px); background: #fff; box-shadow: 0 8px 25px rgba(255,255,255,0.4), inset 0 -2px 5px rgba(0,0,0,0.05); }

.top-corner-btn {
    position: absolute; top: 30px; right: 30px; z-index: 200;
    background: linear-gradient(135deg, rgba(255, 234, 66, 0.9), rgba(255, 200, 0, 0.8)); color: #000;
    border: 2px solid rgba(255, 255, 255, 0.8); padding: 14px 32px; border-radius: 40px;
    font-size: 16px; font-weight: 800; font-family: 'Outfit', sans-serif; cursor: pointer;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 8px 25px rgba(255, 234, 66, 0.4), inset 0 -3px 10px rgba(0,0,0,0.2); backdrop-filter: blur(10px);
}
.top-corner-btn:hover { transform: scale(1.05) translateY(-3px); background: linear-gradient(135deg, rgba(255, 255, 100, 1), rgba(255, 220, 0, 1)); box-shadow: 0 12px 30px rgba(255, 234, 66, 0.6), inset 0 -3px 10px rgba(0,0,0,0.1); }
</style>
</head>
<body>

<div class="interactive-container" id="container">
    <svg class="nerve-svg" viewBox="0 0 1000 1000" id="nerveSvg">
        <defs>
            <filter id="pencil" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" result="displaced" />
                <feGaussianBlur in="displaced" stdDeviation="0.5" />
            </filter>
        </defs>
        <g id="pathsGroup"></g>
        <g id="arrowsGroup"></g>
    </svg>
    <div id="labelsGroup"></div>
    <div class="center-btn" id="mainBtn">
        <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop" alt="Core Node" />
    </div>
</div>

<script>
const allLabels = ${JSON.stringify(allLabels)};
const count = \${lineCount};
const gap = \${lineGap};

const pathsGroup = document.getElementById('pathsGroup');
const arrowsGroup = document.getElementById('arrowsGroup');
const labelsGroup = document.getElementById('labelsGroup');

const totalAngle = (count - 1) * gap;
const startAngle = -90 - (totalAngle / 2);

for (let i = 0; i < count; i++) {
    const angleDeg = startAngle + (i * gap);
    const angleRad = angleDeg * Math.PI / 180;
    
    const startR = 65; 
    const endR = 250 + (Math.random() * 50); 
    
    const sx = 500 + Math.cos(angleRad) * startR;
    const sy = 500 + Math.sin(angleRad) * startR;
    const ex = 500 + Math.cos(angleRad) * endR;
    const ey = 500 + Math.sin(angleRad) * endR;
    
    const curveOffset = (Math.random() - 0.5) * 80; 
    const c1Angle = angleRad + (curveOffset / 200);
    const c1R = startR + (endR - startR) * 0.3;
    const cx1 = 500 + Math.cos(c1Angle) * c1R;
    const cy1 = 500 + Math.sin(c1Angle) * c1R;
    
    const c2Angle = angleRad - (curveOffset / 200);
    const c2R = startR + (endR - startR) * 0.7;
    const cx2 = 500 + Math.cos(c2Angle) * c2R;
    const cy2 = 500 + Math.sin(c2Angle) * c2R;
    
    const pathNode = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathNode.setAttribute('d', \`M \${sx} \${sy} C \${cx1} \${cy1}, \${cx2} \${cy2}, \${ex} \${ey}\`);
    pathNode.setAttribute('class', 'nerve-path');
    pathNode.setAttribute('filter', 'url(#pencil)'); 
    pathsGroup.appendChild(pathNode);

    const len = pathNode.getTotalLength() || 300;
    pathNode.style.setProperty('--path-length', len);

    const endPt = pathNode.getPointAtLength(len);
    const preEndPt = pathNode.getPointAtLength(Math.max(0, len - 2)); 
    const arrowAngle = Math.atan2(endPt.y - preEndPt.y, endPt.x - preEndPt.x) * 180 / Math.PI;

    const arrowGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    arrowGroup.setAttribute('transform', \`translate(\${endPt.x}, \${endPt.y}) rotate(\${arrowAngle})\`);
    arrowGroup.setAttribute('class', 'arrow-wrapper');
    const arrowShape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    arrowShape.setAttribute('d', 'M -12 -8 L 0 0 L -12 8');
    arrowShape.setAttribute('class', 'arrow-shape nerve-path'); 
    arrowShape.setAttribute('fill', 'none');
    arrowShape.setAttribute('filter', 'url(#pencil)');
    arrowGroup.appendChild(arrowShape);
    arrowsGroup.appendChild(arrowGroup);

    const labelDiv = document.createElement('div');
    labelDiv.className = 'nerve-label';
    
    const textSpan = document.createElement('span');
    textSpan.className = 'label-text';
    textSpan.textContent = allLabels[i % allLabels.length];
    labelDiv.appendChild(textSpan);

    const arrowAngleRad = arrowAngle * Math.PI / 180;
    const pad = 30;
    const px = endPt.x + Math.cos(arrowAngleRad) * pad;
    const py = endPt.y + Math.sin(arrowAngleRad) * pad;
    
    labelDiv.style.left = \`\${px}px\`;
    labelDiv.style.top = \`\${py}px\`;
    
    const tx = (Math.cos(arrowAngleRad) - 1) * 50; 
    const ty = (Math.sin(arrowAngleRad) - 1) * 50;
    let baseTransform = \`translate(\${tx}%, \${ty}%)\`;
    
    const ox = (1 - Math.cos(arrowAngleRad)) * 50; 
    const oy = (1 - Math.sin(arrowAngleRad)) * 50; 
    labelDiv.style.transformOrigin = \`\${ox}% \${oy}%\`;
    labelDiv.style.setProperty('--base-transform', baseTransform);

    const brushSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    brushSvg.setAttribute('class', 'pastel-brush-svg');
    brushSvg.setAttribute('viewBox', '0 0 100 40');
    brushSvg.setAttribute('preserveAspectRatio', 'none');
    const brushPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    brushPath.setAttribute('d', 'M 5,6 L 95,8 L 3,16 L 98,16 L 4,24 L 97,26 L 5,34 L 94,32');
    brushPath.setAttribute('stroke-width', '9');
    brushPath.setAttribute('stroke-linecap', 'round');
    brushPath.setAttribute('stroke-linejoin', 'round');
    brushPath.setAttribute('fill', 'none');
    brushPath.setAttribute('class', 'brush-path');
    brushPath.setAttribute('filter', 'url(#pencil)');
    brushSvg.appendChild(brushPath);
    labelDiv.appendChild(brushSvg);

    const randomOffset = Math.random() * 0.2;
    const delay = (i * 0.05) + randomOffset; 
    pathNode.style.transitionDelay = \`\${delay}s\`;
    arrowGroup.style.transitionDelay = \`\${delay + 0.6}s\`; 
    labelDiv.style.transitionDelay = \`\${delay + 0.7}s\`;
    labelsGroup.appendChild(labelDiv);
}

document.getElementById('mainBtn').addEventListener('click', () => { 
    document.getElementById('container').classList.toggle('active'); 
});
</script>
</body>
</html>`;

    const blob = new Blob([fullCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'edited_template.txt';
    a.click();
    URL.revokeObjectURL(url);
});
