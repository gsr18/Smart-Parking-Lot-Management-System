const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace bg-white/90 or bg-white without dark:bg-... with nothing if glass-panel is present
  // Actually, let's just strip bg-white, bg-white/80, bg-white/90, bg-slate-50, bg-slate-100 completely if they are redundant or add dark variants.
  
  // A safer approach: for text colors that don't have dark: variants:
  // text-slate-600 -> text-slate-600 dark:text-slate-300
  // text-slate-700 -> text-slate-700 dark:text-slate-200
  // text-slate-800 -> text-slate-800 dark:text-slate-200
  // text-slate-900 -> text-slate-900 dark:text-white
  // text-[#0f172a] -> text-[#0f172a] dark:text-white
  
  const replacements = [
    { regex: /text-slate-600(?!\s+dark:text-)/g, replacement: 'text-slate-600 dark:text-slate-300' },
    { regex: /text-slate-700(?!\s+dark:text-)/g, replacement: 'text-slate-700 dark:text-slate-200' },
    { regex: /text-slate-800(?!\s+dark:text-)/g, replacement: 'text-slate-800 dark:text-slate-200' },
    { regex: /text-slate-900(?!\s+dark:text-)/g, replacement: 'text-slate-900 dark:text-white' },
    { regex: /text-slate-500(?!\s+dark:text-)/g, replacement: 'text-slate-500 dark:text-slate-400' },
    { regex: /text-\[\#0f172a\](?!\s+dark:text-)/g, replacement: 'text-[#0f172a] dark:text-white' },
    
    // Backgrounds: 
    { regex: /bg-white\/90(?!\s+dark:bg-)/g, replacement: 'bg-white/90 dark:bg-[#133155]/60' },
    { regex: /bg-white\/80(?!\s+dark:bg-)/g, replacement: 'bg-white/80 dark:bg-[#133155]/60' },
    { regex: /bg-white(?!\s+dark:bg-|\/)/g, replacement: 'bg-white dark:bg-[#133155]' },
    { regex: /bg-slate-50(?!\s+dark:bg-)/g, replacement: 'bg-slate-50 dark:bg-[#080b38]' },
    { regex: /bg-slate-100(?!\s+dark:bg-)/g, replacement: 'bg-slate-100 dark:bg-[#133155]/80' },
    
    // Borders:
    { regex: /border-slate-200(?!\s+dark:border-)/g, replacement: 'border-slate-200 dark:border-[#522377]/50' },
    { regex: /border-\[\#9ed9db\]\/50(?!\s+dark:border-)/g, replacement: 'border-[#9ed9db]/50 dark:border-[#522377]/50' },
    
    // Shadows:
    { regex: /shadow-sm(?!\s+dark:shadow-)/g, replacement: 'shadow-sm dark:shadow-[#080b38]/50' },
  ];

  for (const { regex, replacement } of replacements) {
    content = content.replace(regex, replacement);
  }

  // Also remove redundant ones if glass-panel handles it, but since glass-panel has its own bg, we can just leave the dark variants we just added or strip them.
  // Wait, if it has `glass-panel` or `glass-card`, it doesn't need `bg-white/90` or `text-slate-900` because the CSS handles it!
  // Let's strip bg-white, bg-white/x from elements that have glass-panel.
  content = content.replace(/glass-panel\s+(?:bg-white(?:\/\d+)?\s*(?:dark:bg-\[[^\]]+\](?:\/\d+)?\s*)?)/g, 'glass-panel ');
  content = content.replace(/(?:bg-white(?:\/\d+)?\s*(?:dark:bg-\[[^\]]+\](?:\/\d+)?\s*)?)glass-panel/g, 'glass-panel');
  content = content.replace(/glass-card\s+(?:bg-white(?:\/\d+)?\s*(?:dark:bg-\[[^\]]+\](?:\/\d+)?\s*)?)/g, 'glass-card ');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walk(srcDir);
console.log('Done');
