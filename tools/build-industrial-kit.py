"""Original chamfered saw, shield plank and curved armour kit. No external assets.
Blender Z-up source, GLB Y-up; pivots remain origin for runtime animation.
"""
import bpy, math, json
from pathlib import Path
root=Path.cwd();out=root/'art/match/industrial/source';out.mkdir(parents=True,exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
def create(name,v,f,bevel):
 mesh=bpy.data.meshes.new(name);mesh.from_pydata([(x,-z,y) for x,y,z in v],[],f);mesh.update();o=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(o);bpy.context.view_layer.objects.active=o;o.select_set(True)
 mod=o.modifiers.new('Machined bevel','BEVEL');mod.width=bevel;mod.segments=1;bpy.ops.object.modifier_apply(modifier=mod.name);o.select_set(False);return o
# Closed thin hooked saw with chamfered teeth; XY face, thin Z.
p=[]
for i in range(24):
 for r,a in [(.82,-.09),(1,.015),(.98,.06),(.85,.08)]:p.append((math.cos(i*math.tau/24+a)*r,math.sin(i*math.tau/24+a)*r))
n=len(p);v=[(x,y,z) for z in [-.035,.035] for x,y in p];f=[tuple(reversed(range(n))),tuple(range(n,n*2))]+[(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)]
create('sawRing',v,f,.008)
v=[(x,y,z) for z in [-.055,.055] for x,y in [(-.26,-.68),(.24,-.66),(.28,.61),(.18,.69),(-.24,.65)]]
create('shieldPlank',v,[(4,3,2,1,0),(5,6,7,8,9)]+[(i,(i+1)%5,(i+1)%5+5,i+5) for i in range(5)],.025)
# A curved plate patch for the boss; shared origin at boss centre.
v=[];f=[]
for j in range(5):
 a=.23+j*.66/4
 for i in range(7):
  b=-.48+i*.96/6;v.append((math.sin(b)*math.cos(a)*1.64,math.sin(a)*1.64,math.cos(b)*math.cos(a)*1.64))
for j in range(4):
 for i in range(6):q=j*7+i;f.append((q,q+1,q+8,q+7))
create('armourPlate',v,f,.012)
# Three curved planks per half, enclosing the ball around an oval face opening.
for upper in [True,False]:
 v=[];f=[]
 for plank in range(3):
  start=len(v);segments=12
  for layer in range(2):
   radius=.71+layer*.10
   for edge in range(2):
    for j in range(segments+1):
     a=-1.20+plank*.80+.02+j*.76/segments;x=math.sin(a)*radius;z=math.cos(a)*radius
     opening=math.sqrt(max(0,.42**2-x*x))*1.10+.02
     outer=1.02-.18*(abs(a)/1.20)**2
     y=(outer if edge else opening)*(1 if upper else -1)
     taper=1.01 if upper else .99
     v.append((x*(taper if edge else 1),y,z*(taper if edge else 1)))
  stride=segments+1
  for j in range(segments):
   a=start+j;b=a+1;c=a+stride;d=c+1;f.extend([(a,c,d,b),(a+2*stride,b+2*stride,d+2*stride,c+2*stride),(a,b,b+2*stride,a+2*stride),(c,c+2*stride,d+2*stride,d)])
  for j in [0,segments]:a=start+j;f.append((a,a+2*stride,a+3*stride,a+stride))
 create('shieldUpper' if upper else 'shieldLower',v,f,.012)
objects=list(bpy.context.scene.objects)
for o in objects:o.select_set(True)
bpy.ops.wm.save_as_mainfile(filepath=str(out/'industrial-kit.blend'))
bpy.ops.export_scene.gltf(filepath=str(root/'public/models/industrial-kit.glb'),export_format='GLB',use_selection=True,export_yup=True,export_apply=True,export_materials='NONE')
report={}
for o in objects:
 pts=[o.matrix_world@v.co for v in o.data.vertices];assert o.location.length==0
 report[o.name]={'pivot':[0,0,0],'vertices':len(pts),'faces':len(o.data.polygons),'boundsBlender':[[min(v[k] for v in pts) for k in range(3)],[max(v[k] for v in pts) for k in range(3)]]}
(out/'bounds.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
