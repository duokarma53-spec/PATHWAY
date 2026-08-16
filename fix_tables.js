const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(walk(file));
      } else {
        if (file.endsWith('.tsx')) results.push(file);
      }
    });
  } catch(e) {}
  return results;
}

const files = walk('pathway-admin/src/app/(dashboard)');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  const orig = content;
  // Wrap Table components that aren't already in overflow containers
  content = content.split('<Table>').join('<div className="overflow-x-auto -mx-1"><Table>');
  content = content.split('</Table>').join('</Table></div>');
  // Avoid double-wrapping
  content = content.split('<div className="overflow-x-auto -mx-1"><div className="overflow-x-auto -mx-1">').join('<div className="overflow-x-auto -mx-1">');
  content = content.split('</Table></div></div>').join('</Table></div>');
  if (content !== orig) {
    fs.writeFileSync(f, content);
    console.log('Fixed tables: ' + f);
  }
});
