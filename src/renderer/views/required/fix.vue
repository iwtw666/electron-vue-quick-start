<template>
  <div id="fix-page">
    <div class="left-panel">
      <div class="guide"></div>
      <el-button type="primary" @click="handleCutModel"><i class="el-icon-scissors icon" />修剪{{ cutting ? '1' : '' }}</el-button>
      <el-button type="primary" @click="undoCutModel" :disabled="!undoStack.length"><i class="el-icon-scissors icon" />undo</el-button>
      <el-button type="primary" @click="testExport" :disabled="cutting"><i class="el-icon-scissors icon" />test exoprt</el-button>
    </div>
    <div id="container"/>
  </div>
</template>

<script>
/* eslint-disable no-undef *//* eslint-disable no-unused-vars */
import { THREE, ThreeCanvas, STLExporter } from '@/assets/initThree/index'
import Chain from '@/assets/Chain'
let chain

const models = g.models
let scene, camera, renderer, controls, threeCanvas
let raycaster, mouse

export default {
  name: 'FixPage',
  components: { },
  data () {
    return {
      cutting: false,
      undoStack: []
    }
  },
  computed: { },
  watch: {
  },
  beforeCreate () { },
  created () {
    chain = () => { return new Chain().init() } // 链式调用初始化
  },
  mounted () {
    chain()
      .run(this.initThree)
      .run(this.showModels, 'promise')
      .run(this.test1)
  },
  methods: {
    initThree () {
      const dom = document.getElementById('container')
      const width = 1200
      const height = 820
      threeCanvas = new ThreeCanvas({ dom, width, height })
      scene = threeCanvas.scene
      camera = threeCanvas.camera
      renderer = threeCanvas.renderer
      controls = threeCanvas.controls
    },
    showModels () {
      return threeCanvas.showModels(models)
    },
    toNext () {
      this.$emit('toNext')
    },
    test1 () {
      console.log(models)
      // debugger
    },
    handleCutModel () {
      if (!this.cutting) {
        this.initRaycaster()
      } else {
        this.removeRaycaster()
        this.cutModels()
      }
      this.cutting = !this.cutting
    },
    initRaycaster () {
      raycaster = new THREE.Raycaster()
      mouse = new THREE.Vector2()
      renderer.domElement.addEventListener('pointermove', this.onPointerMove)
      renderer.domElement.addEventListener('pointerdown', this.onPointerDown)
    },
    removeRaycaster () {
      raycaster = null
      mouse = null
      renderer.domElement.removeEventListener('pointermove', this.onPointerMove)
      renderer.domElement.removeEventListener('pointerdown', this.onPointerDown)
    },
    onPointerMove (event) {
      mouse.x = ((event.clientX - renderer.domElement.getBoundingClientRect().left) / renderer.domElement.clientWidth) * 2 - 1
      mouse.y = -((event.clientY - renderer.domElement.getBoundingClientRect().top) / renderer.domElement.clientHeight) * 2 + 1
    },
    onPointerDown (event) {
      if (event.button === 0) {
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(models.filter(item => item.visible), true)
        if (intersects.length) {
          const inter = intersects[0]
          if (inter.object.name === 'cutPoint') {
            this.removePoints(inter)
          } else {
            this.createCutPoint(inter)
          }
        }
      }
    },
    createCutPoint (intersect) {
      const model = intersect.object
      const position = intersect.point
      const pointG = new THREE.SphereGeometry(0.5, 8, 8)
      pointG.translate(position.x, position.y, position.z)
      const point = new THREE.Mesh(pointG, new THREE.MeshBasicMaterial({ color: 0x3760EA }))
      point.pointPosition = position.clone()
      point.name = 'cutPoint'
      model.add(point)
      if (model.children.length > 2) {
        this.createLineForModel(model)
      }
    },
    removePoints (intersect) {
      const point = intersect.object
      const model = intersect.object.parent
      point.geometry.dispose()
      point.material.dispose()
      model.remove(point)
      if (model.children.length > 2) {
        this.createLineForModel(model)
      } else {
        this.removeCutLineObject(model)
      }
    },
    createLineForModel (model) {
      this.removeCutLineObject(model)
      const points = model.children.map(item => item.pointPosition)
      const curve = new THREE.CatmullRomCurve3(points)
      const lineG = new THREE.TubeGeometry(curve, 32, 0.25)
      const curveObject = new THREE.Mesh(lineG, new THREE.MeshBasicMaterial({ color: 0x3760EA }))
      scene.add(curveObject)
      model.cutLineObject = curveObject
    },
    removeCutLineObject (model) {
      if (model.cutLineObject) {
        model.cutLineObject.geometry.dispose()
        model.cutLineObject.material.dispose()
        scene.remove(model.cutLineObject)
        model.cutLineObject = null
      }
    },
    removePointsAndLine (model) {
      if (model.children.length) {
        for (let i = model.children.length - 1; i >= 0; i--) {
          const point = model.children[i]
          point.geometry.dispose()
          point.material.dispose()
          model.remove(point)
        }
      }
      this.removeCutLineObject(model)
    },
    /**
     * 裁剪面片
     */
    cutModels () {
      if (!(models && models.length)) {
        return
      }
      const undoStack = []
      for (let i = 0; i < models.length; i++) {
        const model = models[i]
        if (model.cutLineObject) { // 判断是否画线
          const xyFacesMap = new Map()
          const faces = []
          const points = model.cutLineObject.geometry.parameters.path.getPoints(2000) // 获取线上2000个点（参考牙龈线）
          let targetZ = points[0].z
          const positions = model.geometry.attributes.position.array // 模型点集合
          /**
           * 定义获取要删除的面片方法
           */
          const castToDelete = () => { // TODO
            if (!xyFacesMap.size) {
              return
            }
            const threshold = 1 // 阈值
            let tempFaceList = [] // 临时faceid数组
            let face // 某面片
            const res = new Set() // 最终结果
            for (let p = 0; p < points.length; p++) {
              const potisionZ = points[p].z // 线上点的Z
              const midX = Math.round(points[p].x)
              const midY = Math.round(points[p].y)
              for (let xx = midX - threshold; xx <= midX + threshold; xx++) {
                for (let yy = midY - threshold; yy <= midY + threshold; yy++) {
                  const tempKey = xx + '_' + yy
                  if (xyFacesMap.has(tempKey)) {
                    tempFaceList = xyFacesMap.get(tempKey)
                    for (let i = 0; i < tempFaceList.length; i++) {
                      face = faces[tempFaceList[i]]
                      if (model.customType === 'upper') { // 区分上下颌
                        if (face.minZ > potisionZ) {
                          res.add(tempFaceList[i])
                        }
                      } else {
                        if (face.maxZ < potisionZ) {
                          res.add(tempFaceList[i])
                        }
                      }
                    }
                  }
                }
              }
            }
            return res
          }
          /**
           * 定义删除面片的方法
           */
          const deleteFaces = () => { // TODO
            if (!(final && final.size)) {
              return
            }
            const deletedPositions = []
            final.forEach((faceIndex) => { // 根据faceindex 找到geometry position中的index
              for (let i = 0; i < 9; i++) {
                const positionIndex = faceIndex * 9 + i
                deletedPositions.push({index: positionIndex, value: Number(positions[positionIndex])})
                positions[positionIndex] = null
              }
            })
            final.clear()
            model.geometry.attributes.position.needsUpdate = true
            this.removePointsAndLine(model)
            return deletedPositions
          }
          // 主流程开始
          // 上下颌区分拿到线的最低（高）点
          for (let j = 1; j < points.length; j++) {
            if (model.customType === 'upper') {
              if (points[j].z > targetZ) {
                targetZ = points[j].z // 拿到线的最高点
              }
            } else {
              if (points[j].z < targetZ) {
                targetZ = points[j].z // 拿到线的最低点
              }
            }
          }
          // 构造face列表
          for (let k = 0; k < positions.length; k += 9) {
            let tempList
            const maxX = Math.round(Math.max(positions[k], positions[k + 3], positions[k + 6]))
            const minX = Math.round(Math.min(positions[k], positions[k + 3], positions[k + 6]))
            const maxY = Math.round(Math.max(positions[k + 1], positions[k + 4], positions[k + 7]))
            const minY = Math.round(Math.min(positions[k + 1], positions[k + 4], positions[k + 7]))
            const maxZ = Math.max(positions[k + 2], positions[k + 5], positions[k + 8])
            const minZ = Math.min(positions[k + 2], positions[k + 5], positions[k + 8])
            faces.push(
              {
                vertices: [
                  positions[k], positions[k + 1], positions[k + 2],
                  positions[k + 3], positions[k + 4], positions[k + 5],
                  positions[k + 6], positions[k + 7], positions[k + 8]
                ],
                maxX,
                minX,
                maxY,
                minY,
                maxZ,
                minZ
              }
            )
            const faceIndex = k / 9
            for (let m = minX; m <= maxX; m++) {
              for (let n = minY; n <= maxY; n++) {
                let key = m + '_' + n
                if (xyFacesMap.has(key)) {
                  tempList = xyFacesMap.get(key)
                  tempList.push(faceIndex)
                  xyFacesMap.set(key, tempList)
                } else {
                  tempList = [faceIndex]
                  xyFacesMap.set(key, tempList)
                }
              }
            }
          }
          // 获取要删除的面
          const final = castToDelete()
          for (let o = 0; o < faces.length; o++) {
            if (model.customType === 'upper') {
              if (faces[o].minZ > targetZ) {
                final.add(o)
              }
            } else {
              if (faces[o].maxZ < targetZ) {
                final.add(o)
              }
            }
          }
          // 删除
          undoStack.push({modelName: model.name, positions: deleteFaces()})
        }
      }
      this.undoStack.push(undoStack)
    },
    undoCutModel () {
      if (!this.undoStack.length) {
        return
      }
      const lastStep = this.undoStack.pop()
      if (!lastStep) return
      for (let i = 0; i < lastStep.length; i++) {
        const step = lastStep[i]
        let model
        for (let j = 0; j < models.length; j++) {
          if (models[j].name === step.modelName) {
            model = models[j]
            break
          }
        }
        const positions = model.geometry.attributes.position.array
        for (let k = 0; k < step.positions.length; k++) {
          const { index, value } = step.positions[k]
          positions[index] = value
        }
        model.geometry.attributes.position.needsUpdate = true
      }
    },
    testExport () {

      // if (!models.length) return
      // const exporter = new STLExporter()
      // const result = exporter.parse(mesh, { binary: true })
      // new Blob([result], { type: 'application/octet-stream' })
    },
    // TODO 引入raycaster增加准确性，和点不能完美兼容
    createLineForModelAlpha (model) {
      const oldPoints = this.removeCutLineObjectAlpha(model)
      let originPoints
      if (!oldPoints.length) {
        originPoints = model.children.map(item => item.pointPosition)
      } else {
        originPoints = [model.children[model.children.length - 2].pointPosition, model.children[model.children.length - 1].pointPosition]
      }
      const len = originPoints.length * 5 - 1
      const originCurve = new THREE.CatmullRomCurve3(originPoints)
      const newPoints = originCurve.getPoints(len)
      const raycaster = new THREE.Raycaster()
      const cameraDirection = new THREE.Vector3()
      camera.getWorldDirection(cameraDirection)
      cameraDirection.normalize()
      const cameraDirectionN = cameraDirection.clone().multiplyScalar(-100)
      for (let i = 0; i < newPoints.length; i++) {
        const point = newPoints[i]
        raycaster.set(point.add(cameraDirectionN), cameraDirection)
        const intersect = raycaster.intersectObject(model)
        if (intersect.length) {
          newPoints[i] = intersect[0].point
        }
      }
      const points = oldPoints.concat(newPoints)
      const curve = new THREE.CatmullRomCurve3(points)
      const lineG = new THREE.TubeGeometry(curve, 32, 0.25)
      const curveObject = new THREE.Mesh(lineG, new THREE.MeshBasicMaterial({ color: 0x3760EA }))
      scene.add(curveObject)
      model.cutLineObject = curveObject
      model.cutLineObject.points = points
    },
    removeCutLineObjectAlpha (model) {
      if (model.cutLineObject) {
        model.cutLineObject.geometry.dispose()
        model.cutLineObject.material.dispose()
        scene.remove(model.cutLineObject)
        const points = model.cutLineObject.points
        model.cutLineObject = null
        return points
      }
      return []
    }
  }
}
</script>

<style lang="scss" scoped>
#fix-page {
  width: 100%;
  height: 100%;
  display: flex;
  .left-panel {
    min-width: 208px;
    width: 208px;
    padding: 40px 16px;
    display: flex;
    flex-direction: column;
    background-color: #FFFFFF;
    align-items: center;
    .guide {
      min-width: 208px;
      height: 170px;
      background-color: #F6F7F8;
    }
    .el-button {
      width: 80%;
      margin: 16px auto;
      background-color: #3760EA;
      .icon{
        margin-right: 11px;
      }
    }
  }
  #container {
    flex: 1;
    min-width: 1200px;
  }
  .el-button--primary.is-disabled{
    background-color: #FFFFFF;
    color: #000;
  }
}
</style>
