import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const THEMES_DIR = path.join(__dirname, '../craftlayers-ds/themes');
const OUTPUT_DIR = path.join(__dirname, '../src/styles');

// Helper to flatten object keys
function flattenKeys(obj, prefix = '') {
    return Object.keys(obj).reduce((acc, key) => {
        const value = obj[key];
        const newKey = prefix ? `${prefix}-${key}` : key;
        if (typeof value === 'object' && value !== null) {
            Object.assign(acc, flattenKeys(value, newKey));
        } else {
            acc[newKey] = value;
        }
        return acc;
    }, {});
}

// Generate CSS Variable Name with cl- prefix
function toVarName(key) {
    return `--cl-${key}`;
}

// Function to generate responsive scales for typography and spacing
function generateResponsiveScales(flatObj) {
    let responsiveCss = `\n  /* Responsive Typography and Spacing Maps */\n`;
    const getResponsiveVal = (val, scale) => {
        if (typeof val === 'string' && val.endsWith('rem')) {
             return `${(parseFloat(val) * scale).toFixed(3)}rem`;
        }
        if (typeof val === 'string' && val.endsWith('px')) {
             return `${Math.round(parseFloat(val) * scale)}px`;
        }
        return val;
    }

    // Default (Mobile - 85% scale)
    responsiveCss += `\n  @media (max-width: 767px) {\n    :root {\n`;
    for (const [key, value] of Object.entries(flatObj)) {
        if (key.includes('typography-font-size') || key.includes('spacing')) {
             responsiveCss += `      ${toVarName(key)}: ${getResponsiveVal(value, 0.85)};\n`;
        }
    }
    responsiveCss += `    }\n  }\n`;

    // Tablet (95% scale)
    responsiveCss += `\n  @media (min-width: 768px) and (max-width: 1023px) {\n    :root {\n`;
    for (const [key, value] of Object.entries(flatObj)) {
         if (key.includes('typography-font-size') || key.includes('spacing')) {
             responsiveCss += `      ${toVarName(key)}: ${getResponsiveVal(value, 0.95)};\n`;
        }
    }
    responsiveCss += `    }\n  }\n`;

    return responsiveCss;
}

async function generate() {
    console.log('Starting Craftlayers CSS Generation (Whitelabel DS with cl- prefix)...');

    // 1. Read Themes
    const defaultThemePath = path.join(THEMES_DIR, 'craftlayers-default.theme.json');
    const lightThemePath = path.join(THEMES_DIR, 'craftlayers-light.theme.json');

    if (!fs.existsSync(defaultThemePath)) {
        console.error('Error: Default theme file not found!', defaultThemePath);
        process.exit(1);
    }
    const hasLight = fs.existsSync(lightThemePath);

    const defaultTheme = JSON.parse(fs.readFileSync(defaultThemePath, 'utf8'));
    const lightTheme = hasLight ? JSON.parse(fs.readFileSync(lightThemePath, 'utf8')) : {};

    // 2. Flatten Tokens
    const flatDefault = flattenKeys(defaultTheme);
    const flatLight = hasLight ? flattenKeys(lightTheme) : {};

    // 3. Generate variables.css
    let variablesCss = `/* 
  🎨 CRAFTLAYERS DESIGN SYSTEM (Whitelabel)
  Auto-generated. DO NOT EDIT.
  All variables prefixed with --cl-
*/\n\n`;

    // Default Theme Block
    variablesCss += `:root {\n`;
    for (const [key, value] of Object.entries(flatDefault)) {
        variablesCss += `  ${toVarName(key)}: ${value};\n`;
    }
    variablesCss += `}\n\n`;

    // Light Theme Block (if exists via data-theme)
    if (hasLight) {
        variablesCss += `:root[data-theme="light"] {\n`;
        for (const [key, value] of Object.entries(flatLight)) {
            variablesCss += `  ${toVarName(key)}: ${value};\n`;
        }
        variablesCss += `}\n`;
    }

    // Responsive Definitions
    variablesCss += generateResponsiveScales(flatDefault);

    // 4. Generate utilities.css
    let utilitiesCss = `/* 
  🛠️ CRAFTLAYERS UTILITIES
  Auto-generated. DO NOT EDIT.
  Prefix: .cl-
*/\n\n`;

    // INTENT BUNDLES
    utilitiesCss += `/* Intent Bundles */\n`;
    utilitiesCss += `.cl-surface-page { background-color: var(--cl-color-neutral-surface-level-0); color: var(--cl-color-neutral-text-high-contrast); }\n`;
    utilitiesCss += `.cl-surface-card { background-color: var(--cl-color-neutral-surface-level-1); border: 1px solid var(--cl-color-border-color-default); }\n`;
    utilitiesCss += `.cl-focus-ring:focus-visible { outline: 2px solid var(--cl-color-brand-primary-base); outline-offset: 2px; }\n`;
    utilitiesCss += `.cl-motion-standard { transition-property: all; transition-duration: var(--cl-motion-duration-medium, 300ms); transition-timing-function: var(--cl-motion-easing-standard, ease); }\n`;

    utilitiesCss += `\n/* Atomic Utilities */\n`;

    function addVariants(baseSelector, property, value) {
        let css = '';
        css += `${baseSelector} { ${property}: ${value}; }\n`;
        css += `.cl-hover-${baseSelector.replace('.cl-', '')}:hover { ${property}: ${value}; }\n`;
        css += `.cl-focus-${baseSelector.replace('.cl-', '')}:focus { ${property}: ${value}; }\n`;
        css += `.group:hover .cl-group-hover-${baseSelector.replace('.cl-', '')} { ${property}: ${value}; }\n`;
        return css;
    }

    for (const key of Object.keys(flatDefault)) {
        const varName = `var(${toVarName(key)})`;
        const shortKeyColor = key.replace('color-', ''); // strip color- for class names to match existing components

        if (key.match(/^(color|semantic|brand|neutral|surface)/) || key.includes('color')) {
            if (key.includes('text') || key.includes('contrast')) {
                utilitiesCss += addVariants(`.cl-text-${shortKeyColor}`, 'color', varName);
                if (key.includes('color-')) utilitiesCss += addVariants(`.cl-text-${key}`, 'color', varName);
            }
            else if (key.includes('icon')) {
                utilitiesCss += addVariants(`.cl-fill-${shortKeyColor}`, 'fill', varName);
            }
            else if (key.includes('border') && !key.includes('width') && !key.includes('style')) {
                utilitiesCss += addVariants(`.cl-border-${shortKeyColor}`, 'border-color', varName);
                if (key.includes('color-')) utilitiesCss += addVariants(`.cl-border-${key}`, 'border-color', varName);
            }
            else if (key.includes('surface') || key.includes('background') || key.includes('level')) {
                utilitiesCss += addVariants(`.cl-bg-${shortKeyColor}`, 'background-color', varName);
                if (key.includes('color-')) utilitiesCss += addVariants(`.cl-bg-${key}`, 'background-color', varName);
            }
            else {
                utilitiesCss += addVariants(`.cl-bg-${shortKeyColor}`, 'background-color', varName);
                utilitiesCss += addVariants(`.cl-text-${shortKeyColor}`, 'color', varName);
                if (key.includes('color-')) {
                   utilitiesCss += addVariants(`.cl-bg-${key}`, 'background-color', varName);
                   utilitiesCss += addVariants(`.cl-text-${key}`, 'color', varName);
                }
            }
        }

        if (key.startsWith('radius-')) utilitiesCss += `.cl-${key} { border-radius: ${varName}; }\n`;
        
        if (key.startsWith('elevation-') || key.includes('shadow')) {
            if (key.includes('focus-ring')) utilitiesCss += `.cl-ring-${key} { box-shadow: 0 0 0 2px ${varName}; }\n`;
            else {
                utilitiesCss += `.cl-${key} { box-shadow: ${varName}; }\n`;
                utilitiesCss += `.cl-hover-${key}:hover { box-shadow: ${varName}; }\n`;
            }
        }
        
        if (key.startsWith('spacing-') || key.startsWith('scale-')) {
            const shortKey = key.replace('spacing-', '').replace('scale-', '');
            const prefix = key.startsWith('scale-') ? 'scale-' : '';
            
            // Standard Utility Set
            utilitiesCss += `.cl-p-${prefix}${shortKey} { padding: ${varName}; }\n`;
            utilitiesCss += `.cl-m-${prefix}${shortKey} { margin: ${varName}; }\n`;
            utilitiesCss += `.cl-gap-${prefix}${shortKey} { gap: ${varName}; }\n`;
            
            // Logical Properties
            utilitiesCss += `.cl-px-${prefix}${shortKey} { padding-left: ${varName}; padding-right: ${varName}; }\n`;
            utilitiesCss += `.cl-py-${prefix}${shortKey} { padding-top: ${varName}; padding-bottom: ${varName}; }\n`;
            utilitiesCss += `.cl-pt-${prefix}${shortKey} { padding-top: ${varName}; }\n`;
            utilitiesCss += `.cl-pb-${prefix}${shortKey} { padding-bottom: ${varName}; }\n`;
            utilitiesCss += `.cl-mx-${prefix}${shortKey} { margin-left: ${varName}; margin-right: ${varName}; }\n`;
            utilitiesCss += `.cl-my-${prefix}${shortKey} { margin-top: ${varName}; margin-bottom: ${varName}; }\n`;
            utilitiesCss += `.cl-mt-${prefix}${shortKey} { margin-top: ${varName}; }\n`;
            utilitiesCss += `.cl-mb-${prefix}${shortKey} { margin-bottom: ${varName}; }\n`;

            // Dimensional (only for scale)
            if (key.startsWith('scale-')) {
                utilitiesCss += `.cl-w-${prefix}${shortKey} { width: ${varName}; }\n`;
                utilitiesCss += `.cl-h-${prefix}${shortKey} { height: ${varName}; }\n`;
            }
        }

        if (key.startsWith('layout-')) {
            const shortKey = key.replace('layout-', '');
            if (shortKey.includes('container-')) {
                utilitiesCss += `.cl-max-w-${shortKey.replace('container-', 'container-')} { max-width: ${varName}; }\n`;
                utilitiesCss += `.cl-w-${shortKey.replace('container-', 'container-')} { width: ${varName}; }\n`;
            } else {
                utilitiesCss += `.cl-${shortKey} { ${shortKey.includes('width') ? 'max-width' : 'margin-top'}: ${varName}; }\n`;
            }
        }
        
        if (key.startsWith('border-width-')) {
            const shortKey = key.replace('border-width-', '');
            utilitiesCss += `.cl-border-${shortKey} { border-width: ${varName}; }\n`;
            utilitiesCss += `.cl-border-t-${shortKey} { border-top-width: ${varName}; }\n`;
            utilitiesCss += `.cl-border-r-${shortKey} { border-right-width: ${varName}; }\n`;
            utilitiesCss += `.cl-border-b-${shortKey} { border-bottom-width: ${varName}; }\n`;
            utilitiesCss += `.cl-border-l-${shortKey} { border-left-width: ${varName}; }\n`;
        }
        if (key.startsWith('typography-font-size-')) {
            utilitiesCss += `.cl-text-${key.replace('typography-font-size-', '')} { font-size: ${varName}; }\n`;
            utilitiesCss += `.cl-text-${key.replace('typography-font-', '')} { font-size: ${varName}; }\n`; // Fallback for shortened text sizing
        }
        if (key.startsWith('typography-font-weight-')) utilitiesCss += `.cl-weight-${key.replace('typography-font-weight-', '')} { font-weight: ${varName}; }\n`;
        if (key.startsWith('typography-line-height-')) utilitiesCss += `.cl-leading-${key.replace('typography-line-height-', '')} { line-height: ${varName}; }\n`;
    }

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    fs.writeFileSync(path.join(OUTPUT_DIR, 'variables.css'), variablesCss);
    fs.writeFileSync(path.join(OUTPUT_DIR, 'utilities.css'), utilitiesCss);

    console.log(`✅ Generated variables.css (${(variablesCss.length / 1024).toFixed(2)} KB)`);
    console.log(`✅ Generated utilities.css (${(utilitiesCss.length / 1024).toFixed(2)} KB)`);
}

generate();
