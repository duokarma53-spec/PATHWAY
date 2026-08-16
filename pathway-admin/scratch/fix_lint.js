const fs = require('fs');
const path = require('path');

const files = [
  'src/app/(dashboard)/applications/page.tsx',
  'src/app/(dashboard)/applications/[id]/page.tsx',
  'src/app/(dashboard)/audit-logs/page.tsx',
  'src/app/(dashboard)/destinations/page.tsx',
  'src/app/(dashboard)/documents/page.tsx',
  'src/app/(dashboard)/faqs/page.tsx',
  'src/app/(dashboard)/insights/page.tsx',
  'src/app/(dashboard)/leads/[id]/page.tsx',
  'src/app/(dashboard)/page.tsx',
  'src/app/(dashboard)/services/page.tsx',
  'src/app/(dashboard)/students/actions.ts',
  'src/app/(dashboard)/students/page.tsx',
  'src/app/(dashboard)/students/[id]/page.tsx',
  'src/app/(dashboard)/success-stories/page.tsx',
  'src/app/(dashboard)/tasks/page.tsx',
  'src/app/(dashboard)/team/page.tsx',
  'src/app/(dashboard)/universities/page.tsx',
  'src/components/actions/quick-actions.tsx',
  'src/components/layout/sidebar.tsx',
  'src/components/layout/topbar.tsx',
  'src/components/ui/input.tsx',
  'src/lib/supabase/client.ts',
];

for (const relPath of files) {
  const fullPath = path.join('c:\\$$$\\PATHWAY\\pathway-admin', relPath);
  if (!fs.existsSync(fullPath)) continue;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // 1. @ts-ignore -> @ts-expect-error
  content = content.replace(/\/\/ @ts-ignore/g, '// @ts-expect-error');
  
  // 2. Unused imports
  content = content.replace(/Plus, /g, '');
  content = content.replace(/, Plus/g, '');
  content = content.replace(/Link, /g, '');
  content = content.replace(/, Link/g, '');
  content = content.replace(/Clock, /g, '');
  content = content.replace(/, Clock/g, '');
  content = content.replace(/CardDescription, /g, '');
  content = content.replace(/, CardDescription/g, '');
  content = content.replace(/createBrowserClient, /g, '');
  content = content.replace(/, createBrowserClient/g, '');
  content = content.replace(/import { createBrowserClient } from '@supabase\/ssr'\n/g, '');
  
  // 3. unexpected any
  content = content.replace(/: any/g, ': unknown');
  content = content.replace(/as any/g, 'as unknown');
  
  // 4. empty interface in input.tsx
  if (relPath.includes('input.tsx')) {
    content = content.replace(/export interface InputProps\n  extends React.InputHTMLAttributes<HTMLInputElement> {}\n/g, 
                              'export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;\n');
  }

  // 5. Unescaped entities in page.tsx
  if (relPath === 'src/app/(dashboard)/page.tsx') {
    content = content.replace(/It's /g, 'It&apos;s ');
    content = content.replace(/doesn't/g, 'doesn&apos;t');
    content = content.replace(/today's/g, 'today&apos;s');
    content = content.replace(/won't/g, 'won&apos;t');
    content = content.replace(/let's/g, 'let&apos;s');
  }

  fs.writeFileSync(fullPath, content, 'utf8');
}
console.log('Done fixing lint errors');
