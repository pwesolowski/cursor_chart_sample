/**
 * Excel Data Processing Script
 * Processes sagKlasseReport.xlsx and generates JSON data for the Cases view
 * 
 * This script:
 * - Reads the Excel file from data/sagKlasseReport.xlsx
 * - Extracts and groups data by:
 *   - Column B: Ejende myndighed (Authority)
 *   - Column C: Master IT-systemNavn (IT System Name)
 *   - Column E: KleEmne (Classification)
 *   - Column G: Fremdrift (Progress)
 * - Outputs processed data to public/klasseData.json
 */

import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, '../data/sagKlasseReport.xlsx');
const OUTPUT_FILE = path.join(__dirname, '../public/klasseData.json');

/**
 * Builds a hierarchical tree structure from KleEmne classifications
 * e.g., "01.00.05" and "01.00.00" both become children of "01.00"
 * Creates tree: 01 -> 01.00 -> [01.00.00, 01.00.05]
 */
function buildKleEmneTree(kleEmneCounts) {
  const root = {
    name: 'root',
    children: []
  };

  // Create a map to store nodes by their full path
  const nodeMap = new Map();
  nodeMap.set('root', root);

  // Sort keys to ensure parent nodes are created before children
  const sortedKeys = Object.keys(kleEmneCounts).sort();

  // First pass: create all nodes
  sortedKeys.forEach(key => {
    if (!key || key.trim() === '') return;

    const parts = key.split('.');
    let currentPath = '';

    parts.forEach((part, index) => {
      const previousPath = currentPath;
      currentPath = currentPath ? `${currentPath}.${part}` : part;

      // If this node doesn't exist yet, create it
      if (!nodeMap.has(currentPath)) {
        const newNode = {
          name: currentPath,
          value: 0,
          children: []
        };

        // Add to parent
        const parentPath = index === 0 ? 'root' : previousPath;
        const parent = nodeMap.get(parentPath);
        if (parent) {
          parent.children.push(newNode);
        }

        nodeMap.set(currentPath, newNode);
      }

      // If this is the leaf node (full path from original data), set its value
      if (index === parts.length - 1) {
        const node = nodeMap.get(currentPath);
        if (node) {
          node.value = kleEmneCounts[key];
        }
      }
    });
  });

  // Second pass: aggregate values up the tree
  // Parent nodes should have the sum of their children's values
  function aggregateValues(node) {
    if (!node.children || node.children.length === 0) {
      // Leaf node, return its value
      return node.value;
    }

    // Internal node, sum up children's values
    let totalValue = node.value; // Start with own value (if any)
    node.children.forEach(child => {
      totalValue += aggregateValues(child);
    });

    node.value = totalValue;
    return totalValue;
  }

  aggregateValues(root);

  // Clean tree: remove nodes with no value and no children
  function cleanTree(node) {
    if (node.children) {
      node.children = node.children.filter(child => {
        cleanTree(child);
        return child.value > 0 || (child.children && child.children.length > 0);
      });
    }
    return node;
  }

  cleanTree(root);

  return root;
}

/**
 * Converts a count object to a sorted array of {name, count} objects
 * Limited to top N items
 */
function countsToArray(countsObj, limit = null) {
  const array = Object.entries(countsObj)
    .filter(([key]) => key && key.trim() !== '')
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return limit ? array.slice(0, limit) : array;
}

/**
 * Main processing function
 */
function processExcelFile() {
  console.log('📊 Starting Excel data processing...');
  console.log(`📁 Reading file: ${INPUT_FILE}`);

  // Check if input file exists
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ Error: Input file not found at ${INPUT_FILE}`);
    process.exit(1);
  }

  try {
    // Read the Excel file
    const workbook = XLSX.readFile(INPUT_FILE);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    console.log(`📋 Processing sheet: ${sheetName}`);

    // Convert to JSON (array of arrays for raw access)
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    console.log(`📝 Total rows: ${data.length}`);

    // Initialize counters
    const ejendeMyndighedCounts = {};
    const masterITSystemNavnCounts = {};
    const kleEmneCounts = {};
    const fremdriftCounts = {};

    let processedRows = 0;

    // Process each row (skip header row 0)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];

      // Column indices (0-based): B=1, C=2, E=4, G=6
      const ejendeMyndighed = row[1] ? String(row[1]).trim() : '';
      const masterITSystemNavn = row[2] ? String(row[2]).trim() : '';
      const kleEmne = row[4] ? String(row[4]).trim() : '';
      const fremdrift = row[6] ? String(row[6]).trim() : '';

      // Count each dimension
      if (ejendeMyndighed) {
        ejendeMyndighedCounts[ejendeMyndighed] = (ejendeMyndighedCounts[ejendeMyndighed] || 0) + 1;
      }

      if (masterITSystemNavn) {
        masterITSystemNavnCounts[masterITSystemNavn] = (masterITSystemNavnCounts[masterITSystemNavn] || 0) + 1;
      }

      if (kleEmne) {
        kleEmneCounts[kleEmne] = (kleEmneCounts[kleEmne] || 0) + 1;
      }

      if (fremdrift) {
        fremdriftCounts[fremdrift] = (fremdriftCounts[fremdrift] || 0) + 1;
      }

      processedRows++;

      // Log progress every 10000 rows
      if (processedRows % 10000 === 0) {
        console.log(`   Processed ${processedRows} rows...`);
      }
    }

    console.log(`✅ Processed ${processedRows} data rows`);

    // Build the output data structure
    const outputData = {
      metadata: {
        totalRecords: processedRows,
        processedAt: new Date().toISOString(),
        sourceFile: 'sagKlasseReport.xlsx'
      },
      ejendeMyndighed: countsToArray(ejendeMyndighedCounts),
      masterITSystemNavn: countsToArray(masterITSystemNavnCounts),
      kleEmne: buildKleEmneTree(kleEmneCounts),
      kleEmneFlat: countsToArray(kleEmneCounts, 20), // Top 20 for simple display
      fremdrift: countsToArray(fremdriftCounts)
    };

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write to JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2));

    console.log(`💾 Data written to: ${OUTPUT_FILE}`);
    console.log('\n📈 Summary:');
    console.log(`   - Unique Ejende myndighed: ${Object.keys(ejendeMyndighedCounts).length}`);
    console.log(`   - Unique Master IT-systemNavn: ${Object.keys(masterITSystemNavnCounts).length}`);
    console.log(`   - Unique KleEmne: ${Object.keys(kleEmneCounts).length}`);
    console.log(`   - Unique Fremdrift: ${Object.keys(fremdriftCounts).length}`);
    console.log('\n✨ Processing complete!');

  } catch (error) {
    console.error('❌ Error processing Excel file:', error);
    process.exit(1);
  }
}

// Run the script
processExcelFile();

