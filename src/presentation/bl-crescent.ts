import * as T from 'three';
export const BL1_ENABLED=true;
export const BL2_ENABLED=true;
export function crescentGeometry(radius=.5){const shape=new T.Shape();shape.moveTo(0,radius);shape.bezierCurveTo(-radius*1.15,radius*.65,-radius*1.15,-radius*.65,0,-radius);shape.bezierCurveTo(-radius*.42,-radius*.45,-radius*.42,radius*.45,0,radius);return new T.ShapeGeometry(shape,12);}
export function makeTwinBlades(parent:T.Group){const group=new T.Group();parent.add(group);const material=new T.MeshBasicMaterial({color:'#ba96ff',side:T.DoubleSide,toneMapped:false}),linkMaterial=new T.MeshBasicMaterial({color:'#9675e8',transparent:true,opacity:.18,depthWrite:false,side:T.DoubleSide});for(const sign of [-1,1]){const blade=new T.Mesh(crescentGeometry(.55),material);blade.position.set(sign*1.05,.68,.08);blade.scale.x=-sign;group.add(blade);const link=new T.Mesh(new T.PlaneGeometry(.42,.045),linkMaterial);link.position.set(sign*.65,.68,.06);group.add(link);}group.visible=false;return group;}
