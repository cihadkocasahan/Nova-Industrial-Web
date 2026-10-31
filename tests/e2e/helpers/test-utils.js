/**
 * E2E Test Suite Utilities & Assertions for Nova Agro
 * Target: D:\projects\Nova-Industrial-Web
 * Specification: ORIGINAL_REQUEST.md & PROJECT.md
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

export class AssertionError extends Error {
  constructor(message, actual, expected) {
    super(message);
    this.name = 'AssertionError';
    this.actual = actual;
    this.expected = expected;
  }
}

export function assert(condition, message = 'Assertion failed') {
  if (!condition) {
    throw new AssertionError(message, condition, true);
  }
}

export function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    const msg = message || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`;
    throw new AssertionError(msg, actual, expected);
  }
}

export function assertDeepEqual(actual, expected, message) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    const msg = message || `Deep equality mismatch:\nActual: ${actualStr}\nExpected: ${expectedStr}`;
    throw new AssertionError(msg, actual, expected);
  }
}

export function assertIncludes(actual, target, message) {
  if (typeof actual === 'string') {
    if (!actual.includes(target)) {
      throw new AssertionError(message || `String does not include target: "${target}"`, actual, target);
    }
  } else if (Array.isArray(actual)) {
    if (!actual.includes(target)) {
      throw new AssertionError(message || `Array does not include item: ${JSON.stringify(target)}`, actual, target);
    }
  } else {
    throw new AssertionError('assertIncludes requires a string or array', actual, target);
  }
}

export function assertNotIncludes(actual, target, message) {
  if (typeof actual === 'string' && actual.includes(target)) {
    throw new AssertionError(message || `String unexpectedly includes target: "${target}"`, actual, target);
  } else if (Array.isArray(actual) && actual.includes(target)) {
    throw new AssertionError(message || `Array unexpectedly includes item: ${JSON.stringify(target)}`, actual, target);
  }
}

export function assertMatch(actual, regex, message) {
  if (!regex.test(actual)) {
    throw new AssertionError(message || `Value "${actual}" does not match regex ${regex}`, actual, regex.toString());
  }
}

export function assertGreaterThanOrEqual(actual, expected, message) {
  if (!(actual >= expected)) {
    throw new AssertionError(message || `Expected ${actual} >= ${expected}`, actual, expected);
  }
}

export function assertLessThanOrEqual(actual, expected, message) {
  if (!(actual <= expected)) {
    throw new AssertionError(message || `Expected ${actual} <= ${expected}`, actual, expected);
  }
}

/**
 * Parses Hex color to [r, g, b] (0-255)
 */
export function hexToRgb(hex) {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  if (clean.length < 6) return [0, 0, 0];
  const num = parseInt(clean.substring(0, 6), 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Calculates WCAG 2.1 relative luminance
 */
export function getRelativeLuminance(rgb) {
  const [r, g, b] = rgb.map(val => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculates WCAG contrast ratio between two colors (hex strings)
 */
export function calculateContrastRatio(colorA, colorB) {
  const lumA = getRelativeLuminance(hexToRgb(colorA));
  const lumB = getRelativeLuminance(hexToRgb(colorB));
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

/**
 * Parses CSS content into a Map of custom properties (:root variables)
 */
export function parseCssVariables(cssContent) {
  const vars = new Map();
  const rootRegex = /:root\s*\{([^}]+)\}/g;
  let match;
  while ((match = rootRegex.exec(cssContent)) !== null) {
    const block = match[1];
    const lineRegex = /(--[\w-]+)\s*:\s*([^;]+);/g;
    let varMatch;
    while ((varMatch = lineRegex.exec(block)) !== null) {
      vars.set(varMatch[1].trim(), varMatch[2].trim());
    }
  }
  return vars;
}

/**
 * Scans directory recursively for files matching extension filter
 */
export function getFilesRecursively(dir, extensions = ['.ts', '.tsx', '.css', '.html', '.svg', '.json'], excludes = ['node_modules', 'dist', '.git']) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!excludes.includes(entry.name)) {
        results.push(...getFilesRecursively(fullPath, extensions, excludes));
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (extensions.includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

/**
 * Scans files for specific string patterns or regex matches
 */
export function scanFilesForPatterns(dir, patterns, extensions = ['.ts', '.tsx', '.css', '.html', '.svg']) {
  const matches = [];
  const files = getFilesRecursively(dir, extensions);

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const pattern of patterns) {
        let isMatch = false;
        if (pattern instanceof RegExp) {
          isMatch = pattern.test(line);
        } else {
          isMatch = line.includes(pattern);
        }

        if (isMatch) {
          matches.push({
            file: path.relative(dir, file),
            line: i + 1,
            pattern: pattern.toString(),
            snippet: line.trim()
          });
        }
      }
    }
  }
  return matches;
}

/**
 * Runs a command safely and captures output
 */
export function runCommand(command, cwd, timeoutMs = 60000) {
  const startTime = Date.now();
  try {
    const stdout = execSync(command, {
      cwd,
      timeout: timeoutMs,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/sh'
    });
    return {
      success: true,
      exitCode: 0,
      stdout,
      stderr: '',
      durationMs: Date.now() - startTime
    };
  } catch (err) {
    return {
      success: false,
      exitCode: err.status || 1,
      stdout: err.stdout ? err.stdout.toString() : '',
      stderr: err.stderr ? err.stderr.toString() : err.message,
      durationMs: Date.now() - startTime
    };
  }
}

/**
 * Turkish phone number validator
 */
export function isValidTurkishPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  // Normalize international country code (+90, 0090, 90) to leading 0
  const trimmed = phone.trim();
  const normalized = trimmed.replace(/^(\+90|0090|90)/, '0');
  const digits = normalized.replace(/\D/g, '');
  // Matches 05XXXXXXXXX (11 digits) or 5XXXXXXXXX (10 digits)
  return /^(0?5\d{9})$/.test(digits);
}

/**
 * Validates agricultural quote payload
 */
export function validateAgriculturalQuote(payload) {
  const errors = [];

  if (!payload.serviceType || typeof payload.serviceType !== 'string' || payload.serviceType.trim().length === 0) {
    errors.push('serviceType is required');
  }

  if (payload.landArea === undefined || payload.landArea === null || String(payload.landArea).trim() === '') {
    errors.push('landArea is required');
  } else {
    const areaNum = Number(payload.landArea);
    if (isNaN(areaNum) || areaNum <= 0) {
      errors.push('landArea must be a positive number');
    }
  }

  if (!payload.fullName || typeof payload.fullName !== 'string' || payload.fullName.trim().length < 2) {
    errors.push('fullName must be at least 2 characters');
  }

  if (!isValidTurkishPhone(payload.phone)) {
    errors.push('phone must be a valid Turkish mobile number');
  }

  if (payload.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      errors.push('email format is invalid');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Generates tracking reference code
 */
export function generateQuoteReferenceCode(prefix = 'AGRO-2026-') {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${randomSuffix}`;
}
