/**
 * CSV Data Processing Script
 * Processes KOSDY-PROD.{DATE}.csv files and generates JSON data for service analytics
 * 
 * This script:
 * - Scans data/ directory for KOSDY-PROD.*.csv files
 * - Extracts dates from filenames (e.g., 20251130 -> 2025-11-30)
 * - Parses CSV files and filters rows where SERVICEVERSION is not NULL
 * - Aggregates data by hour, IT system, service, operation, etc.
 * - Outputs processed data to public/serviceData.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const OUTPUT_FILE = path.join(__dirname, '../public/serviceData.json');

/**
 * Scans data directory for CSV files matching KOSDY-PROD.*.csv pattern
 */
function findCsvFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    console.log('⚠️  Data directory not found. Skipping CSV processing.');
    return [];
  }

  const files = fs.readdirSync(DATA_DIR);
  const csvFiles = files.filter(file => 
    file.startsWith('KOSDY-PROD.') && file.endsWith('.csv')
  );

  console.log(`📁 Found ${csvFiles.length} CSV file(s): ${csvFiles.join(', ')}`);
  return csvFiles;
}

/**
 * Extracts date from filename (e.g., KOSDY-PROD.20251130.csv -> 2025-11-30)
 */
function extractDateFromFilename(filename) {
  const match = filename.match(/KOSDY-PROD\.(\d{8})\.csv/);
  if (!match) return null;

  const dateStr = match[1]; // e.g., "20251130"
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);

  return `${year}-${month}-${day}`;
}

/**
 * Parses CSV line, handling quoted fields
 */
function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  return result;
}

/**
 * Processes a single CSV file
 */
function processCsvFile(filename, date) {
  console.log(`📊 Processing ${filename}...`);

  const filePath = path.join(DATA_DIR, filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());

  // Skip header row
  const dataLines = lines.slice(1);

  // Initialize aggregation objects
  const hourlyData = {};
  const itSystemData = {};
  const serviceData = {};
  const operationData = {};
  const supportSystemData = {};
  const serviceVersionData = {};
  const itSystemOperations = {};

  let totalCalls = 0;
  let processedRows = 0;
  let filteredRows = 0;

  for (const line of dataLines) {
    const columns = parseCsvLine(line);

    // Column indices (0-based)
    const antalKald = parseInt(columns[0]) || 0; // A: Call count
    const itSystem = columns[2] || 'Unknown'; // C: IT System
    const periode = columns[6] || ''; // G: Period (timestamp)
    const serviceNavn = columns[7] || 'Unknown'; // H: Service name
    const serviceOperation = columns[8] || 'Unknown'; // I: Operation
    const serviceVersion = columns[9] || ''; // J: Service version
    const supportSystem = columns[10] || 'Unknown'; // K: Support system

    // Filter: Only include rows where SERVICEVERSION is not NULL
    if (!serviceVersion || serviceVersion === 'NULL' || serviceVersion.trim() === '') {
      filteredRows++;
      continue;
    }

    processedRows++;
    totalCalls += antalKald;

    // Extract hour from period (format: 2025-11-30T00:00:00)
    const hourMatch = periode.match(/T(\d{2}):/);
    const hour = hourMatch ? `${hourMatch[1]}:00` : '00:00';

    // Aggregate by hour
    hourlyData[hour] = (hourlyData[hour] || 0) + antalKald;

    // Aggregate by IT system
    itSystemData[itSystem] = (itSystemData[itSystem] || 0) + antalKald;

    // Aggregate by service name
    serviceData[serviceNavn] = (serviceData[serviceNavn] || 0) + antalKald;

    // Aggregate by operation
    operationData[serviceOperation] = (operationData[serviceOperation] || 0) + antalKald;

    // Aggregate by support system
    supportSystemData[supportSystem] = (supportSystemData[supportSystem] || 0) + antalKald;

    // Aggregate by service version
    serviceVersionData[serviceVersion] = (serviceVersionData[serviceVersion] || 0) + antalKald;

    // Aggregate IT System × Operation matrix
    const key = `${itSystem}|${serviceOperation}`;
    if (!itSystemOperations[key]) {
      itSystemOperations[key] = {
        itSystem,
        operation: serviceOperation,
        calls: 0
      };
    }
    itSystemOperations[key].calls += antalKald;

    // Log progress for large files
    if (processedRows % 5000 === 0) {
      console.log(`   Processed ${processedRows} valid rows...`);
    }
  }

  console.log(`✅ Processed ${processedRows} rows (filtered ${filteredRows} rows with NULL SERVICEVERSION)`);
  console.log(`   Total calls: ${totalCalls.toLocaleString()}`);

  // Convert to sorted arrays
  const hourlyArray = Object.entries(hourlyData)
    .map(([hour, calls]) => ({ hour, calls }))
    .sort((a, b) => a.hour.localeCompare(b.hour));

  const topITSystems = Object.entries(itSystemData)
    .map(([name, calls]) => ({ name, calls }))
    .sort((a, b) => b.calls - a.calls)
    .slice(0, 15);

  const topServices = Object.entries(serviceData)
    .map(([name, calls]) => ({ name, calls }))
    .sort((a, b) => b.calls - a.calls)
    .slice(0, 15);

  const topOperations = Object.entries(operationData)
    .map(([name, calls]) => ({ name, calls }))
    .sort((a, b) => b.calls - a.calls)
    .slice(0, 15);

  const supportSystems = Object.entries(supportSystemData)
    .map(([name, calls]) => ({ name, calls }))
    .sort((a, b) => b.calls - a.calls);

  const serviceVersions = Object.entries(serviceVersionData)
    .map(([version, calls]) => ({ version, calls }))
    .sort((a, b) => b.calls - a.calls)
    .slice(0, 10);

  const itSystemOperationsArray = Object.values(itSystemOperations)
    .sort((a, b) => b.calls - a.calls)
    .slice(0, 50);

  // Find most active hour
  const mostActiveHour = hourlyArray.reduce((max, curr) => 
    curr.calls > max.calls ? curr : max, 
    { hour: '00:00', calls: 0 }
  );

  return {
    totalCalls,
    processedRows,
    uniqueITSystems: Object.keys(itSystemData).length,
    uniqueServices: Object.keys(serviceData).length,
    uniqueOperations: Object.keys(operationData).length,
    mostActiveHour: mostActiveHour.hour,
    mostActiveITSystem: topITSystems[0]?.name || 'Unknown',
    hourly: hourlyArray,
    topITSystems,
    topServices,
    topOperations,
    supportSystems,
    serviceVersions,
    itSystemOperations: itSystemOperationsArray
  };
}

/**
 * Main processing function
 */
function processAllCsvFiles() {
  console.log('📊 Starting CSV data processing...');

  const csvFiles = findCsvFiles();

  if (csvFiles.length === 0) {
    console.log('⚠️  No CSV files found. Creating empty output file.');
    const emptyOutput = {
      dates: [],
      data: {},
      metadata: {
        processedAt: new Date().toISOString(),
        filesProcessed: 0
      }
    };
    
    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(emptyOutput, null, 2));
    console.log('✨ Created empty serviceData.json');
    return;
  }

  const dates = [];
  const data = {};

  for (const filename of csvFiles) {
    const date = extractDateFromFilename(filename);

    if (!date) {
      console.log(`⚠️  Could not extract date from ${filename}, skipping...`);
      continue;
    }

    dates.push(date);
    data[date] = processCsvFile(filename, date);
  }

  // Sort dates
  dates.sort();

  const output = {
    dates,
    data,
    metadata: {
      processedAt: new Date().toISOString(),
      filesProcessed: csvFiles.length
    }
  };

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

  console.log(`\n💾 Data written to: ${OUTPUT_FILE}`);
  console.log('\n📈 Summary:');
  console.log(`   - Dates processed: ${dates.join(', ')}`);
  console.log(`   - Total files: ${csvFiles.length}`);
  console.log('\n✨ CSV processing complete!');
}

// Run the script
processAllCsvFiles();

