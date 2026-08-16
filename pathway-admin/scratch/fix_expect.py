import os
import glob

files = glob.glob('c:/$$$/PATHWAY/pathway-admin/src/**/*.ts*', recursive=True)
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    if '@ts-expect-error' in content and '@ts-expect-error -' not in content:
        content = content.replace('@ts-expect-error', '@ts-expect-error - type mismatch')
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
print("Globally added descriptions to ts-expect-error")
