const fs = require('fs');
const path = require('path');

// Helper to escape special XML characters for SVG text
function escapeSvg(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Line-by-line simple parser to extract logic flow steps from C code
function extractStepsFromCCode(code) {
  if (!code) return [{ type: 'start', text: 'Start' }, { type: 'end', text: 'End' }];
  
  const lines = code.split('\n');
  const steps = [];
  steps.push({ type: 'start', text: 'Start' });

  const declRegex = /^\s*(int|float|double|char)\s+([^;]+);/;

  for (let line of lines) {
    line = line.trim();
    
    // Skip empty, braces, include tags, comments, return tags
    if (
      !line || 
      line.startsWith('#') || 
      line.startsWith('//') || 
      line.startsWith('/*') || 
      line.startsWith('*') ||
      line === '}' || 
      line === '{' || 
      line.startsWith('return') ||
      line.startsWith('int main')
    ) {
      continue;
    }

    // Detect variable declarations
    const declMatch = line.match(declRegex);
    if (declMatch) {
      const vars = declMatch[2].replace(/\s+/g, ' ');
      steps.push({ type: 'process', text: `Declare ${vars}` });
      continue;
    }

    // Detect scanf (inputs)
    if (line.includes('scanf(')) {
      const match = line.match(/&([a-zA-Z0-9_\[\]\(\)\+\-\*\/]+)/g);
      if (match) {
        const vars = match.map(v => v.replace('&', '')).join(', ');
        steps.push({ type: 'input', text: `Read ${vars}` });
      } else {
        steps.push({ type: 'input', text: 'Read Input' });
      }
      continue;
    }

    // Detect printf (outputs)
    if (line.includes('printf(')) {
      // Ignore user input prompts to keep flowchart minimal and clean
      if (line.toLowerCase().includes('enter') || line.toLowerCase().includes('input')) {
        continue;
      }
      const match = line.match(/"([^"]+)"/);
      if (match) {
        let text = match[1]
          .replace(/\\n/g, '')
          .replace(/%[a-zA-Z.]+/g, '')
          .replace(/:/g, '')
          .trim();
        if (!text) text = 'Print Output';
        steps.push({ type: 'output', text: `Print "${text}"` });
      } else {
        steps.push({ type: 'output', text: 'Print Output' });
      }
      continue;
    }

    // Detect conditions
    if (line.startsWith('if ') || line.startsWith('if(')) {
      const match = line.match(/if\s*\(([^)]+)\)/);
      if (match) {
        steps.push({ type: 'decision', text: `Is ${match[1].trim()}?` });
      }
      continue;
    }
    if (line.startsWith('else if') || line.startsWith('else  if')) {
      const match = line.match(/if\s*\(([^)]+)\)/);
      if (match) {
        steps.push({ type: 'decision', text: `Is ${match[1].trim()}?` });
      }
      continue;
    }
    if (line.startsWith('else')) {
      steps.push({ type: 'process', text: 'Else branch' });
      continue;
    }

    // Detect loops
    if (line.startsWith('while ') || line.startsWith('while(')) {
      const match = line.match(/while\s*\(([^)]+)\)/);
      if (match) {
        steps.push({ type: 'decision', text: `While ${match[1].trim()}` });
      }
      continue;
    }
    if (line.startsWith('for ') || line.startsWith('for(')) {
      const match = line.match(/for\s*\(([^)]+)\)/);
      if (match) {
        // clean up loop parameter details
        const forContent = match[1].replace(/;/g, ' | ').trim();
        steps.push({ type: 'process', text: `Loop: ${forContent}` });
      }
      continue;
    }

    // Detect assignments (process nodes)
    if (line.includes('=') && !line.includes('==') && !line.includes('!=') && !line.includes('<=') && !line.includes('>=')) {
      if (line.startsWith('break;') || line.startsWith('continue;')) {
        continue;
      }
      const cleanLine = line.replace(';', '').trim();
      steps.push({ type: 'process', text: cleanLine });
      continue;
    }
  }

  steps.push({ type: 'end', text: 'End' });
  return steps;
}

// Generate the SVG string from step objects
function generateSvgFlowchart(steps, title) {
  const nodeSpacing = 95;
  const padding = 40;
  const canvasWidth = 460;
  const canvasHeight = (steps.length * nodeSpacing) + padding * 2;

  let svg = `<?xml version="2.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${canvasWidth} ${canvasHeight}">
  <defs>
    <!-- Background grid blueprint pattern -->
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#101827" stroke-width="0.75" />
    </pattern>
    
    <!-- Neon Arrow Marker -->
    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#6366f1" />
    </marker>
    
    <!-- Indigo glow effect for arrows and shapes -->
    <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Dark slate canvas background -->
  <rect width="100%" height="100%" fill="#070a13" />
  <rect width="100%" height="100%" fill="url(#grid)" opacity="0.45" />

  <!-- Flowchart Title banner -->
  <text x="230" y="32" text-anchor="middle" fill="#6366f1" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="700" letter-spacing="1.5" opacity="0.8">FLOWCHART SYSTEM</text>
  <text x="230" y="48" text-anchor="middle" fill="#f8fafc" font-size="13" font-family="'Outfit', sans-serif" font-weight="600" letter-spacing="0.25">${escapeSvg(title)}</text>
  <line x1="160" y1="58" x2="300" y2="58" stroke="#1e293b" stroke-width="1.5" />
`;

  // Draw connecting arrows
  for (let i = 0; i < steps.length - 1; i++) {
    const cy1 = padding + 50 + (i * nodeSpacing);
    const cy2 = padding + 50 + ((i + 1) * nodeSpacing);
    
    let y1 = cy1;
    let y2 = cy2;

    // Calculate vertical shape offsets based on node shapes
    const type1 = steps[i].type;
    const type2 = steps[i + 1].type;

    if (type1 === 'start' || type1 === 'end') y1 += 20;
    else if (type1 === 'process') y1 += 24;
    else if (type1 === 'input' || type1 === 'output') y1 += 22;
    else if (type1 === 'decision') y1 += 28;

    if (type2 === 'start' || type2 === 'end') y2 -= 20;
    else if (type2 === 'process') y2 -= 24;
    else if (type2 === 'input' || type2 === 'output') y2 -= 22;
    else if (type2 === 'decision') y2 -= 28;

    // Draw lines
    svg += `  <line x1="230" y1="${y1}" x2="230" y2="${y2}" stroke="#6366f1" stroke-width="2" marker-end="url(#arrow)" opacity="0.85" filter="url(#neon-glow)" />\n`;
  }

  // Draw nodes on top
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const cy = padding + 50 + (i * nodeSpacing);
    const textLines = step.text.split('\n');

    let shapeSvg = '';
    
    if (step.type === 'start' || step.type === 'end') {
      // Oval
      shapeSvg = `  <rect x="140" y="${cy - 20}" width="180" height="40" rx="20" fill="rgba(129, 140, 248, 0.08)" stroke="#818cf8" stroke-width="2" />`;
    } else if (step.type === 'process') {
      // Rectangle
      shapeSvg = `  <rect x="100" y="${cy - 24}" width="260" height="48" rx="6" fill="rgba(56, 189, 248, 0.06)" stroke="#38bdf8" stroke-width="1.5" />`;
    } else if (step.type === 'input' || step.type === 'output') {
      // Parallelogram (skewed block)
      shapeSvg = `  <polygon points="120,${cy - 22} 350,${cy - 22} 330,${cy + 22} 100,${cy + 22}" fill="rgba(52, 211, 153, 0.06)" stroke="#34d399" stroke-width="1.5" />`;
    } else if (step.type === 'decision') {
      // Diamond
      shapeSvg = `  <polygon points="230,${cy - 28} 360,${cy} 230,${cy + 28} 100,${cy}" fill="rgba(251, 191, 36, 0.06)" stroke="#fbbf24" stroke-width="1.5" />`;
    }

    svg += shapeSvg + '\n';

    // Draw text inside nodes
    if (textLines.length === 1) {
      svg += `  <text x="230" y="${cy + 4}" text-anchor="middle" font-size="11.5" fill="#f1f5f9" font-family="'Outfit', sans-serif" font-weight="500">${escapeSvg(textLines[0])}</text>\n`;
    } else {
      svg += `  <text x="230" y="${cy - (textLines.length - 1) * 6.5 + 3.5}" text-anchor="middle" font-size="11" fill="#f1f5f9" font-family="'Outfit', sans-serif" font-weight="500">\n`;
      textLines.forEach((line, idx) => {
        svg += `    <tspan x="230" dy="${idx === 0 ? 0 : 14.5}">${escapeSvg(line)}</tspan>\n`;
      });
      svg += `  </text>\n`;
    }
  }

  svg += `</svg>\n`;
  return svg;
}

// Main execution process
function main() {
  const labsDataPath = path.join(__dirname, '../src/data/labsData.json');
  const publicFlowchartsDir = path.join(__dirname, '../public/flowcharts');

  // Create public directory if not exists
  if (!fs.existsSync(publicFlowchartsDir)) {
    fs.mkdirSync(publicFlowchartsDir, { recursive: true });
  }

  // Load labs data
  if (!fs.existsSync(labsDataPath)) {
    console.error("Labs data not found at:", labsDataPath);
    process.exit(1);
  }

  const labsData = JSON.parse(fs.readFileSync(labsDataPath, 'utf8'));

  // Iterate over each lab and problem to generate SVG and update labsData.json paths
  labsData.forEach((lab) => {
    lab.problems.forEach((problem) => {
      console.log(`Generating flowchart for Lab ${lab.labNum} Problem ${problem.index}: ${problem.title}`);
      
      const steps = extractStepsFromCCode(problem.code);
      const svgContent = generateSvgFlowchart(steps, problem.title);
      
      const svgFileName = `lab_${lab.labNum}_prob_${problem.index}.svg`;
      const svgFilePath = path.join(publicFlowchartsDir, svgFileName);
      
      // Save SVG flowchart
      fs.writeFileSync(svgFilePath, svgContent, 'utf8');
      
      // Update image notes url link
      problem.notesImageUrl = `flowcharts/${svgFileName}`;
    });
  });

  // Save modified labsData.json back
  fs.writeFileSync(labsDataPath, JSON.stringify(labsData, null, 2), 'utf8');
  console.log("Successfully updated all labsData.json notesImageUrl fields to local SVG flowcharts!");
}

main();
