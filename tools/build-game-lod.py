"""Bake a gameplay LOD from our own Blender source; studio source is preserved."""
import bpy
from pathlib import Path
root=Path.cwd()
bpy.ops.wm.open_mainfile(filepath=str(root/'art/match/industrial/source/industrial-kit.blend'))
for obj in bpy.context.scene.objects:
 if obj.type != 'MESH': continue
 bpy.context.view_layer.objects.active=obj
 mod=obj.modifiers.new('Phone silhouette LOD','DECIMATE')
 mod.ratio=.16 if obj.name.startswith('shield') else .24
 bpy.ops.object.modifier_apply(modifier=mod.name)
 obj.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(root/'public/models/industrial-kit-game.glb'),export_format='GLB',use_selection=True,export_yup=True,export_apply=True,export_materials='NONE')
