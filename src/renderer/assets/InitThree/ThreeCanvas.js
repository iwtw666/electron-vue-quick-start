/* eslint-disable no-unused-vars */
import { THREE, STLLoader } from './index'
import { TrackballControls } from './TrackballControls'
class ThreeCanvas {
  constructor ({ dom, width, height, controlsTarget }) {
    this.initCanvas({ dom, width, height, controlsTarget })
    this.renderer.domElement.addEventListener('contextmenu', (e) => {
      e.preventDefault()
    }, false)
    this.models = {}
    this.points = {}
    const textureloader = new THREE.TextureLoader()
    const matcap = textureloader.load(__static + '/images/texture.jpg')
    this.modelMaterial = new THREE.MeshMatcapMaterial({
      matcap,
      side: THREE.DoubleSide,
      color: 0xffffff,
      transparent: true
    })
    const helper = new THREE.AxesHelper()
    this.scene.add(helper)
  }

  /**
   *
   * @param {Object} dom canvas父级Dom
   * @param {Number} width 宽
   * @param {Number} height 高
   * @param {THREE.Vector3} controlsTarget 视野中心
   */
  initCanvas ({ dom, width, height, controlsTarget }) {
    const canvasWidth = width || dom.clientWidth; const canvasHeight = height || dom.clientHeight

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(35, canvasWidth / canvasHeight, 0.1, 1500)
    camera.position.set(0, -450, 220)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    scene.add(camera)

    scene.add(new THREE.AmbientLight(0x555555))

    const light = new THREE.SpotLight(0xFAFAFA)
    light.position.set(0, 1000, 1000)
    const light1 = light.clone()
    light1.position.set(0, 1000, -1000)
    light.castShadow = true
    light1.castShadow = true
    scene.add(light)
    scene.add(light1)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(canvasWidth, canvasHeight)
    renderer.shadowMap.enabled = true
    renderer.setClearColor(0xfafafa, 1.0)
    renderer.localClippingEnabled = true

    dom.appendChild(renderer.domElement)
    renderer.render(scene, camera)

    const controls = new TrackballControls(camera, renderer.domElement)

    controlsTarget && controls.target.set(controlsTarget.x, controlsTarget.y, controlsTarget.z)
    controls.screenSpacePanning = true // 在平面内移动
    controls.rotateSpeed = 6
    controls.zoomSpeed = 4.5
    controls.minDistance = 1
    controls.maxDistance = 1000

    window.onresize = function () {
      const width = dom.clientWidth
      const height = dom.clientHeight
      renderer.domElement.width = width
      renderer.domElement.height = height
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    const animate = () => {
      requestAnimationFrame(animate)

      renderer.render(scene, camera)
      controls.update()
    }

    animate()

    this.scene = scene
    this.camera = camera
    this.controls = controls
    this.renderer = renderer
    this.animate = animate
    this.dom = dom
    this.width = canvasWidth
    this.height = canvasHeight
  }
  /**
   * 展示模型
   * @param {*} files - 模型文件或者mesh
   * @returns promise
   */
  showModels (files, filterUpper = false) {
    return new Promise((resolve, reject) => {
      if (!(files && files.length)) {
        return resolve()
      }
      const errorList = []
      let index = 0
      const returnLogical = () => {
        index++
        if (index >= files.length) {
          if (filterUpper) this.filterUpper(files)
          if (errorList.length) {
            if (errorList.length === files.length) {
              alert('上传的模型存在问题，请重试！')
              return location.reload()
            } else if (errorList.length < files.length) {
              files.splice(errorList[0], 1)
              alert('部分模型有问题，已被删除！')
            }
          }
          return resolve()
        }
      }
      files.forEach((file, i) => {
        if (file instanceof File) {
          const loader = new STLLoader()
          const fr = new FileReader()
          fr.readAsArrayBuffer(file)
          fr.onload = (e) => {
            let g
            try {
              g = loader.parse(e.target.result)
            } catch (error) {
              errorList.push(i)
              returnLogical()
              return
            }
            const mesh = new THREE.Mesh(g, this.modelMaterial.clone())
            mesh.name = file.name
            this.scene.add(mesh)
            files[i] = mesh
            returnLogical()
          }
          fr.onerror = (err) => {
            returnLogical()
            console.log(err)
          }
        } else if (file instanceof THREE.Mesh) {
          this.scene.add(file)
          returnLogical()
        }
      })
    })
  }
  changeOpacity (model, opacity, visible) {
    if (visible === true) {
      model.visible = true
    } else if (visible === false) {
      model.visible = false
    }

    if (typeof opacity === 'number') {
      model.material.opacity = opacity
    }
  }
  filterUpper (files) {
    let midPointZ
    if (files.length > 1) {
      for (let i = 0; i < files.length; i++) {
        const mesh = files[i]
        const g = mesh.geometry
        g.computeBoundingSphere()
        if (midPointZ) {
          if (g.boundingSphere.center.z > midPointZ) {
            mesh.customType = 'upper'
          } else {
            files[0].customType = 'upper'
          }
        } else {
          midPointZ = g.boundingSphere.center.z
        }
      }
    }
  }
}

export default ThreeCanvas
