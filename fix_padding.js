const fs = require('fs');
const path = require('path');
const dir = 'src/components/sections';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
files.forEach(f => {
  const fp = path.join(dir, f);
  let content = fs.readFileSync(fp, 'utf8');
  const orig = content;
  content = content.split('className="py-24 ').join('className="py-16 md:py-24 ');
  content = content.split('className="py-24"').join('className="py-16 md:py-24"');
  if (content !== orig) {
    fs.writeFileSync(fp, content);
    console.log('Fixed: ' + f);
  }
});
