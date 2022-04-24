<template>
  <div id="upload-page">
    <div v-if="!uploaded" class="import-btn" ref="importBtn" :class="{ 'is-drop': isDrop }" @click="clickUpload">
      <div class="btn" v-if="!isDrop">
        <span class="icon"></span>
        <p class="text">将文件拖拽至框内或点击导入数据
          <br />
          <span class="tip">请导入单个患者口扫数据，避免数据错乱</span>
        </p>
        <input
          type="file"
          ref="upload"
          style="display: none"
          @change="saveFileByClick"
          accept=".stl"
          multiple="multiple"
        />
      </div>
      <div class="btn" v-else><span class="text" style="color: #3760EA;">您可以放手了 : )</span></div>
    </div>
    <div class="import-btnn" v-else>
      <i class="el-icon-close re-upload" @click="handleDeleteModel"/>
      <div class="modal"><span>重新上传</span></div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */

const models = g.models

export default {
  name: 'UploadPage',
  components: { },
  data () {
    return {
      uploaded: false,
      isDrop: false
    }
  },
  computed: { },
  watch: {
  },
  beforeCreate () { },
  created () { },
  mounted () {
    this.initDragUpload(this.saveFileByDrag)
  },
  methods: {
    initDragUpload (call) {
      const { importBtn } = this.$refs

      importBtn.ondragenter = (event) => {
        event.preventDefault()
        this.isDrop = true
      }
      importBtn.ondragleave = (event) => {
        event.preventDefault()
        this.isDrop = false
      }
      importBtn.ondragover = (event) => {
        event.preventDefault()
      }
      call && importBtn.addEventListener('drop', call, false)
    },
    clickUpload () {
      this.$refs.upload.click()
    },
    saveFileByClick (e) {
      e.preventDefault()
      this.handleSaveFiles(e.target.files)
    },
    saveFileByDrag (e) {
      e.preventDefault()
      this.handleSaveFiles(e.dataTransfer.files)
    },
    handleSaveFiles (files) {
      if (files.length) {
        if (files.length > 2) {
          this.$message({
            message: '文件不能超过2个',
            type: 'error'
          })
          this.isDrop = false
          return
        }
        models.push(files[0])
        if (files[1]) models.push(files[1])
        this.uploaded = true
        this.toNext()
      }
    },
    handleDeleteModel () {

    },
    toNext () {
      this.$emit('toNext')
    }
  }
}
</script>

<style lang="scss" scoped>
#upload-page {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .import-btn {
      max-width: 622px;
      max-height: 400px;
      background-color: white;
      width: 100%;
      height: 100%;
      border-radius: 4px;
      border: 2px dashed rgba(55, 96, 234, 0.16);
      position: relative;
      cursor:pointer;
      &.is-drop {
        background: rgba(55, 96, 234, 0.12);
        border-color: #3760ea;
      }
      .btn {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height:200px;
        .icon {
          height: 80px;
          width: 80px;
          cursor: pointer;
          background-image: url("data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAARpSURBVHgB7ZzPbhMxEMY/b0JI+kdqVCG4EZ4A+gRNeYGWIyfKkRPpHYlW4gHKiSNw4gi8AEmfgPIELEeEUCtKs0lIYma2IKFCke21vdmNf9IqhziJ82XGMx7PBggEAoFAIBAIBAIB3wjkjJRy5aSPdrWC61LiFs3oFiRW6KnWuaGxpEtIHNOYw+kYB0tLOBRCHCNHchGQResP0KEPXydR2sgAvb4XCbwhYd82GiKGZ7wKeJLIdgV4nFW0i2Ax5Rh7y8uiB094EdC1cOcR7O4ROouXxVs4xqmASSJbJNpzX8L9gxcRsOfStSM44ntfdqYS73MUj9mmz+8mI3kPjrBugRwgThPsCoGHmCEowu8vLYgdWMaqgCxeMkQ3TUdmEUp/Iok7Nl3amoC/1ruu/Dt/myk4wNC1YUtEKwIWRbzfsIjDOtaaFpJwK0FECrwuingMz7VGS80RLTnISGYBKdruz+ya9z9ozpcSPEZGMrnw90Ru0xs8R4GhH3+HovM+DDEWsGjr3oVQcYL20mumQcXYhadnW7MWio7AyiSDFxlZ4LdTuVWJ8BolgspjGyZFCCMB+4n8WArr+wOu5Cw1xAY00XZhrqyUTTyGLKl9ciLb0ERbQC5LoaSIqv5303JhjrwUPD6ixIzqaOrsULQskHYcmyg5tYFeFUnPhSW2UHJ065fKLsz7Rvp1juCRu4++po+vnqzCJzpurGyB1YH//e7nr9P08k2tj3XVscoC0kDlNy06oqKepikLKEQBKy6G6FSX1IPIWbfAXOBEwDLuPi6CvE3ZWHTSmBbmh5bqQOU05jQhw3YApyqmkfbqauQsxVlsCCVtnB2sqyIyFMWzvNYWuVvg/7j94Ev6+O7ZFfjGhQXGmB9i1YHqAgrk2sjoE+lEQIlDzAlpF6wiOjuRuREQGt9VWcDxBJ8wJ5AoPdWxVdWBkwX0KgN45dpqBXkwqOOD6litRIpO47o5N0w6R/d0TiuRFpG6aRcV7vjXGa9lgXlUpX0zAm40Ndo8tCyQy9wC5bVCdt+mZo+M9l54AuyhpFDI2oUmpq0dZQwmMe1/b0ATo2pMKa0wQgcGGAm43BC9kq2FL0zvajKuBw6B+5ClKDDEowweZSwgRytZAlem77DbzHDLQ6aKNPcWU5HBuL84b3jutOt4iQxkromnyfUQXRStU58qLot1sYaMZD4T4eR6dBm8d4xRHOKRxB1YwMqhUioiCiMiB42NpqVbvaydyvGEUhFnufBKcxvxLV4Wbza0eqzJE+N1ZRYDC8+Jlxob98f9iZNz4YW62JlMKE+cAZemw9hjEq/Dc7ItHuP0ZPooka3aWVP6NnKAqys/KOFvOrzl38vR/ulQbmKaunULHmDhuLLSaIgDOMZrb0TyQ67LMXZd/u2JL+F+k0tzCbt2VWKzIrBl4493uLBB0fVpM4d/Mcq9O4d3MvUxbk7HJCTtZrg371cvYuvc0DjtjqAD/ildUYXyuRoO8hAtEAgEAoFAIBAIBPLlJ6djfSo70JbhAAAAAElFTkSuQmCC");
          background-size: contain;
          background-repeat: no-repeat;
        }

        .importing {
          height: 40px;
          width: 40px;
          background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKKADAAQAAAABAAAAKAAAAAB65masAAAEP0lEQVRYCc1ZPUxTURS+57U1gAgorUYGccEBE3GyCqIsMhACOIArKOJfiJo4uEgIOjiYGGPiD0JgFQbBIIl1URpRNjTRARZ0wEiLCEEwQt/1nPe4fbePV0rpK6XL/Tn3nvO9c+89fwVmw6/8Bt8+GwzkKQB5xE7lfDLb7Zn03YM/ibKHjTAobQrsXV5iVZzzGs6gmDGeZc0H5oDxYQDoc7rYS3+754f1uuizcQEsPjd1IhSC28iuFEHFtZcx4LjP73DwW8Odu4eiQ4qkrEtIyfnpg6Fl9S5qrDJy+8ZGqNEBh1O5+f5Z7pdYHGIC9NYHLwPwBwjOackM2ALOjwODScbZpLYGWB5nnO5jAc5lWO1DkMucw9WRbvcjK7qYiwqwrJU7/04EH6Kgi2KxaAHYPGdKDwLvh2z3mw/3YVHQ5PbYdZ7OZ4OnEEg1MLWOc5Yp06mPH/Ykbb+7+W0rLJtpOt1ilsAtTgReIalcJtNX41Vq50pG20hH5k+ZFqvvbZzfA+pCC17dplWnAex1er6n0gqkpQaP1gcer9YcjG0D5bS/K/drLDBr0Usbpgv/cfUFPrID8jrS5MduzyV5jvqKeYLu3GpwzJee4/QmCo5kEQ/ihV2fLJtkkmx5jvoRGlx5raOmI/Dtq/BU9NZByLw5kXFtD3d8HwwMIo/wNaIrhK/7sPy6IzS4Ykqk1wpj6TmuM3aDow8jnsQbdTQmPpQUQxjEmNqwBnUjzN4JIn2NiylFdhyr4GnV0p1cYuon+dQcDnZSGPOwBkMq3IlggK812eBIniYDZcmyV7yVNqUBLDkbyEODelws0uwcmhIxTnZLZotkSnJKyd/TWAOIt79K9q1khOO1cxLzuLski2QaGzlQMEJj/YhVXm0Q8WKih5DHm9E3y8Q7WUNydYAAJWEQ6FvJfYXHm9TRZOp+XZOoh3EIkIJNRLtDwjEezbdKa2zvrsgcNxjzLMKmUCRsTJLdwagkRT+zbC1KF2F6GJMImcITm9gxySZsiupwzJggJBQMmHglPFRGOnZ9Zgq0oOf4hm6lN8vtfpow140ywEBX3krJV9jVyYRU9b0NU6PoMIqEfMwMM3UzI2ZS2FL0jeILDAgwR2nrlgFIqYGcv1C6SmC3DkDMWwztkTeDvi0DUMtXMKkyAAKnRH/LAKRkypTx+UUVIuVHTAErZXqG9hij6oMYpxRg2bWZHMrw5Gga796AiKZTesSUNC3+Xnoup5+UZlBJRGiP2pQYatKcDs7I6HRQyhVzKWTTAcabuEsppqxY+/ui9LHEVXwQpkIUlj7S8t3NVlKTqsGkFY+sviTWHEW/c8HgBVxXiDfbtvKbbUc8Fwx0YQm1VvsQqqWu8SNTst4Cpm0A0XkeYegOov/kErBnKPq6SIptALFi3YnRSFske72IjgFxv8vJ+oX7ilyz9sjWR+Jt/HVICYV22vk3xH/7E8GbfUpSrAAAAABJRU5ErkJggg==");
          animation: rotation 1s infinite ease;
        }
        .text {
          font-size: 16px;
          color: #121314;
          font-weight: 600;
          margin-top: 14px;
          text-align: center;
          line-height: 28px;
          .star {
            color: red;
          }
          .tip{
            font-size: 14px;
            font-weight: 400;
            color: #696C80;
          }
        }
      }
      /deep/ .el-tabs__item {
        height:50px;
        line-height: 50px;
        &:hover {
          color: #3760EA;
        }
      }
      /deep/ .el-tabs__item.is-active {
        color: #3760EA;
        font-size: 14px;
        font-weight: 500;
      }
      /deep/ .el-tabs__active-bar {
        background-color: #3760EA;
        border-radius: 4px 4px 0px 0px;
        height: 4px;
      }
    }
    .import-btnn {
      max-width: 296px;
      max-height: 340px;
      background-color: white;
      width: 100%;
      height: 100%;
      border-radius: 4px;
      border: 2px dashed rgba(55, 96, 234, 0.16);
      position: relative;
      &.is-drop {
        background: rgba(55, 96, 234, 0.12);
        border-color: #3760ea;
      }
      .modal {
        position:absolute;
        width: 0;
        height: 0;
        background: rgba(55,96,234,0.20);
        span {
          color:#3760EA;
          position: absolute;
          top:50%;
          left:50%;
          transform: translate(-50%, -50%);
          text-decoration: underline;
          display: none;
        }
      }
      .re-upload{
        position:absolute;
        color:rgb(59, 84, 167);
        right:32px;
        top:32px;
        cursor:pointer;
        z-index: 99;
      }
      .re-upload:hover + .modal {
          width: 100%;
          height: 100%;
          span{
            display: block;
          }
      }
    }
  }
  .next-btn {
    text-align: center;
    margin-top: -5%;
    .el-button {
        width: 96px;
        height: 44px;
        font-size:12px;
        border: none;
        background-color: #3760ea;
      }
}
</style>
