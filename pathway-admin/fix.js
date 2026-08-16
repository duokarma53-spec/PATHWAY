const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}
const files = walk('c:/$$$/PATHWAY/pathway-admin/src');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let orig = content;
  content = content.replace(/\(\s*([a-zA-Z0-9_]+)\s*:\s*unknown\s*\)/g, '($1: any)');
  content = content.replace(/variant\?:\s*unknown/g, 'variant?: any');
  content = content.replace(/item\.icon\s*:\s*unknown/g, 'item.icon: any');
  content = content.replace(/\/\/ @ts-expect-error - type mismatch/g, '// @ts-ignore');
  if (content !== orig) {
    fs.writeFileSync(f, content);
    console.log('Fixed ' + f);
  }
});
