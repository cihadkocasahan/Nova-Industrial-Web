#!/usr/bin/env node
/**
 * Nova Agro E2E Standalone Test Runner
 * Orchestrates Tiers 1-4 tests derived strictly from ORIGINAL_REQUEST.md & PROJECT.md
 *
 * Usage:
 *   node tests/e2e/runner.js
 *   node tests/e2e/runner.js --tier=1
 *   node tests/e2e/runner.js --tier=2
 *   node tests/e2e/runner.js --tier=3
 *   node tests/e2e/runner.js --tier=4
 *   node tests/e2e/runner.js --json
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tier1Tests } from './tier1-feature-coverage.test.js';
import { tier2Tests } from './tier2-boundary-cases.test.js';
import { tier3Tests } from './tier3-cross-feature.test.js';
import { tier4Tests } from './tier4-real-world-scenarios.test.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..', '..');

// ANSI Color Helpers
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m'
};

const args = process.argv.slice(2);
const tierArg = args.find(a => a.startsWith('--tier='));
const selectedTier = tierArg ? parseInt(tierArg.split('=')[1], 10) : null;
const isJson = args.includes('--json');
const isVerbose = args.includes('--verbose') || args.includes('-v');

const allSuites = [
  { tier: 1, suite: tier1Tests },
  { tier: 2, suite: tier2Tests },
  { tier: 3, suite: tier3Tests },
  { tier: 4, suite: tier4Tests }
];

async function runTestSuite() {
  const suitesToRun = selectedTier
    ? allSuites.filter(s => s.tier === selectedTier)
    : allSuites;

  if (suitesToRun.length === 0) {
    console.error(`${colors.red}Error: Invalid tier specified: ${selectedTier}. Valid options are 1, 2, 3, 4.${colors.reset}`);
    process.exit(1);
  }

  const overallStart = Date.now();
  const results = {
    timestamp: new Date().toISOString(),
    rootDir: ROOT_DIR,
    selectedTier: selectedTier || 'all',
    suites: [],
    totals: {
      total: 0,
      passed: 0,
      failed: 0,
      durationMs: 0
    }
  };

  if (!isJson) {
    console.log(`\n${colors.bold}${colors.green}======================================================================${colors.reset}`);
    console.log(`${colors.bold}${colors.green}   🌱 NOVA AGRO — STANDALONE E2E TEST RUNNER (TIERS 1 - 4)${colors.reset}`);
    console.log(`${colors.bold}${colors.green}======================================================================${colors.reset}`);
    console.log(`${colors.dim}Target Codebase:${colors.reset} ${ROOT_DIR}`);
    console.log(`${colors.dim}Execution Mode:${colors.reset}  ${selectedTier ? `Tier ${selectedTier} only` : 'All Tiers (1 to 4)'}\n`);
  }

  for (const { tier, suite } of suitesToRun) {
    if (!isJson) {
      console.log(`${colors.bold}${colors.cyan}--- Tier ${tier}: ${suite.name} ---${colors.reset}`);
    }

    const suiteResult = {
      tier,
      name: suite.name,
      tests: [],
      passed: 0,
      failed: 0,
      durationMs: 0
    };
    const suiteStart = Date.now();

    for (const test of suite.tests) {
      const testStart = Date.now();
      let status = 'PASSED';
      let error = null;

      try {
        await test.fn({ rootDir: ROOT_DIR, isVerbose });
        suiteResult.passed++;
        results.totals.passed++;
      } catch (err) {
        status = 'FAILED';
        error = {
          message: err.message,
          actual: err.actual !== undefined ? err.actual : null,
          expected: err.expected !== undefined ? err.expected : null,
          stack: isVerbose ? err.stack : undefined
        };
        suiteResult.failed++;
        results.totals.failed++;
      }

      const durationMs = Date.now() - testStart;
      suiteResult.tests.push({
        id: test.id,
        title: test.title,
        status,
        durationMs,
        error
      });
      results.totals.total++;

      if (!isJson) {
        const symbol = status === 'PASSED'
          ? `${colors.green}✔ PASS${colors.reset}`
          : `${colors.red}✖ FAIL${colors.reset}`;
        console.log(`  ${symbol} ${colors.bold}[${test.id}]${colors.reset} ${test.title} ${colors.dim}(${durationMs}ms)${colors.reset}`);
        if (status === 'FAILED') {
          console.log(`         ${colors.red}${error.message.replace(/\n/g, '\n         ')}${colors.reset}`);
        }
      }
    }

    suiteResult.durationMs = Date.now() - suiteStart;
    results.suites.push(suiteResult);
    if (!isJson) console.log('');
  }

  results.totals.durationMs = Date.now() - overallStart;

  if (isJson) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    printSummaryTable(results);
  }

  // Return exit code
  if (results.totals.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

function printSummaryTable(results) {
  console.log(`${colors.bold}======================================================================${colors.reset}`);
  console.log(`${colors.bold}                        E2E TEST SUMMARY REPORT                       ${colors.reset}`);
  console.log(`${colors.bold}======================================================================${colors.reset}`);
  console.log(`${'Tier / Suite'.padEnd(42)} | ${'Total'.padStart(5)} | ${'Pass'.padStart(5)} | ${'Fail'.padStart(5)} | ${'Rate'.padStart(6)} | ${'Time'.padStart(8)}`);
  console.log('-------------------------------------------+-------+-------+-------+--------+---------');

  for (const suite of results.suites) {
    const rate = suite.tests.length > 0
      ? `${Math.round((suite.passed / suite.tests.length) * 100)}%`
      : '0%';
    const rateColor = suite.failed === 0 ? colors.green : colors.yellow;
    console.log(
      `${suite.name.padEnd(42)} | ${String(suite.tests.length).padStart(5)} | ${colors.green}${String(suite.passed).padStart(5)}${colors.reset} | ${suite.failed > 0 ? colors.red : colors.dim}${String(suite.failed).padStart(5)}${colors.reset} | ${rateColor}${rate.padStart(6)}${colors.reset} | ${String(suite.durationMs + 'ms').padStart(8)}`
    );
  }

  console.log('-------------------------------------------+-------+-------+-------+--------+---------');
  const totalRate = results.totals.total > 0
    ? `${Math.round((results.totals.passed / results.totals.total) * 100)}%`
    : '0%';
  const totalRateColor = results.totals.failed === 0 ? colors.green : (results.totals.passed > 0 ? colors.yellow : colors.red);
  console.log(
    `${colors.bold}${'TOTALS'.padEnd(42)}${colors.reset} | ${String(results.totals.total).padStart(5)} | ${colors.green}${String(results.totals.passed).padStart(5)}${colors.reset} | ${results.totals.failed > 0 ? colors.red : colors.green}${String(results.totals.failed).padStart(5)}${colors.reset} | ${totalRateColor}${totalRate.padStart(6)}${colors.reset} | ${String(results.totals.durationMs + 'ms').padStart(8)}`
  );
  console.log(`${colors.bold}======================================================================${colors.reset}`);

  if (results.totals.failed === 0) {
    console.log(`\n${colors.bold}${colors.green}🎉 ALL ${results.totals.total} E2E TESTS PASSED SUCCESSFULLY! NOVA AGRO IS READY.${colors.reset}\n`);
  } else {
    console.log(`\n${colors.bold}${colors.yellow}⚠️  ${results.totals.failed} of ${results.totals.total} tests failed. Implementation is in progress.${colors.reset}\n`);
  }
}

runTestSuite().catch(err => {
  console.error('Test execution failed catastrophically:', err);
  process.exit(1);
});
