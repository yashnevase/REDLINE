"""Original reference-study socket meshes; Blender Z-up export to Three Y-up.
Run from project root: blender --background --factory-startup --python tools/build-core-sockets.py
No reference image/code is embedded. Body pivot is origin; nominal sphere radius is 1.
"""
import bpy, math, json
from mathutils import Vector
from pathlib import Path
root=Path.cwd(); source=root/'art/match/core/source'; target=root/'public/models'
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
roles={name:{'v':[],'f':[]} for name in ['SocketPanel','SocketRim','SocketDeck','SocketRecess','SocketBolt']}
def blender(v):return (v.x,-v.z,v.y)
def surface(role,normal,up,radii,heights,segments=64):
 data=roles[role];offset=len(data['v']);right=up.cross(normal).normalized()
 for radius,height in zip(radii,heights):
  for i in range(segments):
   a=i*math.tau/segments;v=(normal*math.sqrt(max(0,1-radius*radius))+up*(math.cos(a)*radius)+right*(math.sin(a)*radius))*height;data['v'].append(blender(v))
 for ring in range(len(radii)-1):
  for i in range(segments):
   j=(i+1)%segments;a=offset+ring*segments+i;b=offset+ring*segments+j;c=offset+(ring+1)*segments+j;d=offset+(ring+1)*segments+i;data['f'].append((a,d,c,b))
def panel_surface(normal,up):
 # Dense spherical annulus with a real circular opening below the recessed socket.
 data=roles['SocketPanel'];offset=len(data['v']);right=up.cross(normal).normalized();segments=96;rings=25
 for ring in range(rings):
  t=1-ring/(rings-1);height=1.005+min(1,(1-t)/.05)*.004
  for i in range(segments):
   a=i*math.tau/segments;u=math.cos(a)*(.16+(.72-.16)*t);v=math.sin(a)*(.16+(.30-.16)*t)
   point=normal*math.sqrt(max(0,1-u*u-v*v))+up*u+right*v;data['v'].append(blender(point*height))
 for ring in range(rings-1):
  for i in range(segments):
   j=(i+1)%segments;a=offset+ring*segments+i;b=offset+ring*segments+j;c=offset+(ring+1)*segments+j;d=offset+(ring+1)*segments+i;data['f'].append((a,d,c,b))
for side in [-1,1]:
 normal=Vector((side*.9799,0,.2)).normalized();up=Vector((0,1,0));panel_surface(normal,up)
 surface('SocketRim',normal,up,[.335,.326,.311],[1.006,1.020,1.020])
 surface('SocketDeck',normal,up,[.311,.19,.16],[1.020,1.018,1.016])
 surface('SocketRecess',normal,up,[.16,.137,.12,.001],[1.016,1.006,1.007,1.007])
 right=up.cross(normal).normalized()
 for i in range(3):
  a=i*math.tau/3;boltNormal=(normal*math.sqrt(1-.248**2)+(up*math.cos(a)+right*math.sin(a))*.248).normalized()
  surface('SocketBolt',boltNormal,Vector((0,1,0)),[.02,.017,.001],[1.020,1.027,1.028],12)
colours={'SocketPanel':(.72,.70,.90,1),'SocketRim':(.82,.8,.94,1),'SocketDeck':(.66,.64,.83,1),'SocketRecess':(.45,.43,.64,1),'SocketBolt':(.91,.9,.98,1)}
objects=[]
for role,data in roles.items():
 mesh=bpy.data.meshes.new(role);mesh.from_pydata(data['v'],[],data['f']);mesh.update();obj=bpy.data.objects.new(role,mesh);bpy.context.collection.objects.link(obj);objects.append(obj)
 material=bpy.data.materials.new(role);material.diffuse_color=colours[role];mesh.materials.append(material)
 for poly in mesh.polygons:poly.use_smooth=True
 assert all(poly.normal.dot(poly.center)>0 for poly in mesh.polygons), role+' has inward faces'
 obj['role']=role;obj['pivot']='Core sphere centre; Three.js Y-up after GLB export'
# All positions are already authored around the origin; no destructive auto-centering.
bpy.context.view_layer.objects.active=objects[0]
for obj in objects:obj.select_set(True)
vertices=[Vector(v) for data in roles.values() for v in data['v']]
maxRadius=max(v.length for v in vertices)
assert maxRadius<=1.04 and all(obj.location.length==0 for obj in objects)
source.mkdir(parents=True,exist_ok=True);target.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(source/'core-sockets.blend'))
bpy.ops.export_scene.gltf(filepath=str(target/'core-sockets.glb'),export_format='GLB',use_selection=True,export_yup=True,export_extras=True,export_apply=True,export_materials='EXPORT')
report={'source':'tools/build-core-sockets.py','asset':'public/models/core-sockets.glb','pivot':[0,0,0],'nominalBodyRadius':1,'maxRadius':maxRadius,'objects':len(objects),'vertices':sum(len(x['v']) for x in roles.values()),'quadFaces':sum(len(x['f']) for x in roles.values()),'axes':'Authored Three Y-up, converted to Blender Z-up, GLB Y-up','noExternalTextures':True}
(source/'bounds.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
