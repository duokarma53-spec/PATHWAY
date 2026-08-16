import os
import glob

files = glob.glob('c:/$$$/PATHWAY/pathway-admin/src/**/*.ts*', recursive=True)
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    if '@ts-ignore' in content:
        content = content.replace('@ts-ignore', '@ts-expect-error')
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
print("Globally replaced ts-ignore")
