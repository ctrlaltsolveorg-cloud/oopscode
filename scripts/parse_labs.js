const fs = require('fs');
const path = require('path');

const readmePath = path.join(__dirname, '../readme.md');
const labsDir = path.join(__dirname, '../labs');

const readmeContent = fs.readFileSync(readmePath, 'utf8');
const lines = readmeContent.split('\n');

const labsData = {};

let currentTutorial = "";
let currentLabNum = null;
let currentLabTitle = "";
let currentProblems = [];

for (let line of lines) {
  line = line.trim();
  if (!line) continue;

  const tutMatch = line.match(/^TUTORIAL\s+(\d+)\s*:\s*(.*)$/i);
  if (tutMatch) {
    currentTutorial = tutMatch[2].trim();
    continue;
  }

  const labMatch = line.match(/^LAB\s+(\d+)\s*:\s*(.*)$/i);
  if (labMatch) {
    // Save previous lab
    if (currentLabNum !== null) {
      labsData[currentLabNum] = {
        labNum: currentLabNum,
        tutorial: currentTutorial || `Tutorial for Lab ${currentLabNum}`,
        title: currentLabTitle,
        problems: currentProblems
      };
    }
    currentLabNum = parseInt(labMatch[1]);
    currentLabTitle = labMatch[2].trim();
    currentTutorial = ""; 
    currentProblems = [];
    continue;
  }

  const probMatch = line.match(/^(\d+)\.\s*(.*)$/);
  if (probMatch && currentLabNum !== null) {
    const index = parseInt(probMatch[1]);
    const title = probMatch[2].trim();
    currentProblems.push({
      index,
      title,
      code: ""
    });
  }
}

// Save last lab
if (currentLabNum !== null) {
  labsData[currentLabNum] = {
    labNum: currentLabNum,
    tutorial: currentTutorial || `Tutorial for Lab ${currentLabNum}`,
    title: currentLabTitle,
    problems: currentProblems
  };
}

// Define explicit overrides for tutorials or topics to make it high-quality
const tutorialDefaults = {
  2: "VARIABLE TYPES AND TYPE CONVERSIONS",
  3: "BRANCHING AND LOGICAL EXPRESSIONS",
  4: "LOOPS, WHILE AND FOR LOOPS",
  5: "1D ARRAYS: SEARCHING, SORTING",
  6: "2D ARRAYS & STRING MANIPULATION",
  7: "FUNCTIONS, CALL BY VALUE",
  8: "NUMERICAL METHODS (ROOT FINDING, DIFFERENTIATION, INTEGRATION)",
  9: "RECURSION, STRUCTURE OF RECURSIVE CALLS",
  10: "POINTERS, STRUCTURES AND DYNAMIC MEMORY ALLOCATION",
  11: "FILE HANDLING & FILE OPERATIONS"
};

// Now read files for each lab
const allLabs = [];
for (let labNum = 2; labNum <= 11; labNum++) {
  const labFolder = path.join(labsDir, `lab${labNum}`);
  if (!fs.existsSync(labFolder)) {
    console.log(`Warning: folder labs/lab${labNum} does not exist.`);
    continue;
  }

  const files = fs.readdirSync(labFolder);
  const labInfo = labsData[labNum] || {
    labNum,
    tutorial: tutorialDefaults[labNum] || `Tutorial for Lab ${labNum}`,
    title: `LAB ${labNum}: Programming Solutions`,
    problems: []
  };

  if (!labInfo.tutorial) {
    labInfo.tutorial = tutorialDefaults[labNum] || `Tutorial for Lab ${labNum}`;
  }

  // We want to match files like "1_sum_avg.c", "2_simple_interest.c", etc.
  for (const file of files) {
    if (!file.endsWith('.c')) continue;
    const match = file.match(/^(\d+)_/);
    if (!match) continue;
    const index = parseInt(match[1]);
    const filePath = path.join(labFolder, file);
    const code = fs.readFileSync(filePath, 'utf8');

    // Find problem in parsed readme list
    let prob = labInfo.problems.find(p => p.index === index);
    if (!prob) {
      // If not found in readme (e.g. index discrepancy), create a placeholder
      const titleName = file.replace(/^\d+_/, '').replace('.c', '').replace(/_/g, ' ');
      const capitalizedTitle = titleName.charAt(0).toUpperCase() + titleName.slice(1);
      prob = {
        index,
        title: capitalizedTitle,
      };
      labInfo.problems.push(prob);
    }
    prob.code = code;
    prob.fileName = file;
  }

  // Filter out any problems that do not have code
  labInfo.problems = labInfo.problems.filter(p => p.code !== "");

  // Sort problems by index
  labInfo.problems.sort((a, b) => a.index - b.index);
  allLabs.push(labInfo);
}

// Generate the final JSON
const outputDir = path.join(__dirname, '../lab-portal/src/data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outputDir, 'labsData.json'),
  JSON.stringify(allLabs, null, 2),
  'utf8'
);

console.log("Successfully generated labsData.json with all code files compiled!");
