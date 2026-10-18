"""Package source without installed dependencies, hosting identity, user data or signing secrets."""
from pathlib import Path
import hashlib,json,subprocess,sys,zipfile
root=Path(__file__).resolve().parent.parent
out=Path(sys.argv[1]) if len(sys.argv)>1 else root.parent/'Off-Script-iOS-VSCode-Handoff.zip'
skip_parts={'.git','node_modules','.expo','dist','native-export','playwright-report','test-results','.openai','__pycache__'}
skip_names={'credentials.json','site-source.mjs','check-party-public.mjs'}
private_suffixes={'.p8','.p12','.pem','.key','.mobileprovision','.keystore','.jks','.db','.sqlite','.sqlite3','.log','.zip','.tgz','.gz','.pyc'}
entries={}
for p in root.rglob('*'):
 if not p.is_file():continue
 rel=p.relative_to(root)
 if set(rel.parts)&skip_parts or rel.parts[0] in {'ios','android'} or p.name in skip_names:continue
 if p.name.startswith('.env') and p.name!='.env.example':continue
 if p.suffix in private_suffixes or p.name.endswith(('-wal','-shm')):continue
 entries[rel.as_posix()]=p
revision=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
manifest={'app':'Off Script','purpose':'Native iOS source handoff; no account/device-local saves','sourceCommit':revision,'files':{name:hashlib.sha256(p.read_bytes()).hexdigest() for name,p in sorted(entries.items())},'excluded':['Git metadata','Sites identity','dependencies/build output','generated native project','runtime/user databases','local environment values','signing material']}
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
 for name,p in sorted(entries.items()):z.write(p,'off-script-ios/'+name)
 z.writestr('off-script-ios/HANDOFF_MANIFEST.json',json.dumps(manifest,indent=2)+'\n')
print(json.dumps({'archive':str(out),'files':len(entries)+1,'bytes':out.stat().st_size}))
