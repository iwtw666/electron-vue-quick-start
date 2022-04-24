import * as THREE from 'three'
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js'
import ThreeCanvas from './ThreeCanvas'

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
THREE.Mesh.prototype.raycast = acceleratedRaycast

export { THREE, STLLoader, STLExporter, ColladaLoader, ThreeCanvas }
