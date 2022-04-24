<template>
  <div class="progress-content">
    <div class="right">
      <div
        v-for="(item, index) in processData"
        :key="index"
        class="item"
        :class="{ 'item-clickable': clickable }"
      >
        <div class="icon-desc">
          <div :class="['img', 'sprite', getMapKey(item)]" />
          <p class="desc_text">{{ item.desc }}</p>
        </div>
        <div v-if="index !== processData.length-1" :class="['img-arrow', getBackgroundKey(item)]" />
      </div>
    </div>
  </div>
</template>

<script>
const IconMap = {
  icon_1: {
    default: 'icon_1_default',
    completed: 'icon_1_completed'
  },
  icon_2: {
    default: 'icon_2_default',
    completed: 'icon_2_completed'
  },
  icon_3: {
    default: 'icon_3_default',
    completed: 'icon_3_completed'
  },
  icon_4: {
    default: 'icon_4_default',
    completed: 'icon_4_completed'
  },
  icon_5: {
    default: 'icon_5_default',
    completed: 'icon_5_completed'
  }
}
const IconMap2 = {
  icon_1: {
    default: 'icon_progressbar_arrow_default',
    completed: 'icon_progressbar_arrow_completed'
  },
  icon_2: {
    default: 'icon_progressbar_arrow_default',
    completed: 'icon_progressbar_arrow_completed'
  },
  icon_3: {
    default: 'icon_progressbar_arrow_default',
    completed: 'icon_progressbar_arrow_completed'
  },
  icon_4: {
    default: 'icon_progressbar_arrow_default',
    completed: 'icon_progressbar_arrow_completed'
  },
  icon_5: {
    default: 'icon_progressbar_arrow_default',
    completed: 'icon_progressbar_arrow_completed'
  }
}
export default {
  name: 'ProgressBar',
  props: {
    step: {
      type: Number,
      default: 0
    },
    clickable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      processData: [
        {
          name: 'Import',
          status: 'completed',
          arrowStatus: 'default',
          iconName: 'icon_1',
          desc: '导入数据'
        },
        {
          name: 'Fix',
          status: 'default',
          arrowStatus: 'default',
          iconName: 'icon_2',
          desc: '修复'
        },
        {
          name: 'Confirm',
          status: 'default',
          arrowStatus: 'default',
          iconName: 'icon_3',
          desc: '确认底面'
        },
        {
          name: 'Generate',
          status: 'default',
          iconName: 'icon_4',
          desc: '生成'
        }
      ]}
  },
  mounted () {},
  watch: {
    step (val) {
      for (let i = 0; i < this.processData.length; i++) {
        this.processData[i].status = (i <= val) ? 'completed' : 'default'
        if (this.processData[i - 1]) {
          this.processData[i - 1].arrowStatus = (i <= val) ? 'completed' : 'default'
        }
      }
    }
  },
  methods: {
    getMapKey (item) {
      return IconMap[item.iconName || item.name][item.status]
    },
    ontapStep (item) {
      if (!this.clickable) return false
      this.$emit('ontapStep', item)
    },
    getBackgroundKey (item) {
      return IconMap2[item.iconName || item.name][item.arrowStatus]
    }
  }
}
</script>

<style lang="scss" scoped>
div {
  box-sizing: border-box;
}
.progress-content {
  min-width: 1440px;
  width: 100%;
  height: 88px;
  display: flex;
  top: 8px;
  position: absolute;
  z-index: 99;
  justify-content: center;
}
.right {
  width:662px;
  // flex: 1;
  padding: 10px 48px;
  display: flex;
  justify-content: space-around;
  background-color: #fff;
  border-radius: 8px;
  .item {
    display: flex;
    height: 100%;
    width: auto;
    text-align: center;
    justify-content: center;
    .img {
        display: block;
        margin: auto;
        width: 48px;
        height: 48px;
      }
    .img-arrow {
        display: block;
        margin: 16px 16px auto 36px;
        width: 48px;
        height: 48px;
      }
      .desc_text {
        font-size:12px;
        text-align: center;
        height: 22px;
        line-height: 12px;
        margin-top: 8px;
      }
    &-clickable {
      cursor: pointer;
    }
  }
}
.sprite {
  background: url("./image/icon_flow.png") no-repeat top left;
}

.icon_1_default {
  background-position: 0 -68px;
}
.icon_1_completed {
  background-position: 0 0;
}

.icon_2_default {
  background-position: 0 -204px;
}
.icon_2_completed {
  background-position: 0 -136px;
}

.icon_3_default {
  background-position: 0 -340px;
}
.icon_3_completed {
  background-position: 0 -272px;
}

.icon_4_default {
  background-position: 0 -476px;
}
.icon_4_completed {
  background-position: 0 -408px;
}

.icon_5_default {
  background-position: 0;
}
.icon_5_completed {
  background-position: 0;
}

.icon_progressbar_arrow_default {
  background: url("./image/right_arrow_default.png") no-repeat top left;
  background-size: contain;
}
.icon_progressbar_arrow_completed {
  background: url("./image/right_arrow_completed.png") no-repeat top left;
  background-size: contain;
}

</style>
