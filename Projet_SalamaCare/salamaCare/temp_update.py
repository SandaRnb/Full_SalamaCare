import re
from pathlib import Path
path = Path('src/utils/patients.js')
text = path.read_text(encoding='utf-8')
lines = text.splitlines()
new_lines = []
sex = None
pid = None
for line in lines:
    m_id = re.match(r"\s*id:\s*(\d+),", line)
    if m_id:
        pid = int(m_id.group(1))
    m_sex = re.match(r"\s*sexe:\s*['\"]([^'\"]+)['\"],", line)
    if m_sex:
        sex = m_sex.group(1).strip().lower()
    m_photo = re.match(r"(\s*photoIdentite:\s*)['\"][^'\"]*['\"],", line)
    if m_photo and pid is not None:
        gender = 'women' if 'f' in sex else 'men'
        index = pid % 100
        if index == 0:
            index = 1
        url = f'https://randomuser.me/api/portraits/{gender}/{index}.jpg'
        new_lines.append(f"{m_photo.group(1)}'{url}',")
    else:
        new_lines.append(line)
path.write_text('\n'.join(new_lines) + '\n', encoding='utf-8')
