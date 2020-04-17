<template>
  <div class="circle-box">
    <svg :viewBox="svgObject.viewBox" :width="svgObject.width" :height="svgObject.height">
      <circle
        class="backline"
        :cx="svgObject.cx"
        :cy="svgObject.cy"
        :r="svgObject.r"
        fill="white"
        :stroke-width="svgObject.strokeWidth"
      />
      <circle
        :id="id"
        class="outline"
        :stroke="color"
        :cx="svgObject.cx"
        :cy="svgObject.cy"
        :r="svgObject.r"
        fill="white"
        :stroke-width="svgObject.strokeWidth"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "SkyCircularProgress",
  props: {
    width: {
      type: Number,
      default: 60
    },
    height: {
      type: Number,
      default: 60
    },
    // 每次循环时间，最小值为4ms
    delay: {
      type: Number,
      default: 60
    },
    // 设置环形进度条的颜色
    color: {
      type: String,
      default: "#1890ff"
    }
  },
  data() {
    return {
      minValue: 10,
      percent: 0,
      timer: null,
      id: `front-${Number(new Date())}`
    }
  },
  computed: {
    svgObject() {
      let w = this.minValue
      let h = this.minValue
      if (this.width && this.width > this.minValue) {
        w = this.width
      }
      if (this.height && this.height > this.minValue) {
        h = this.height
      }
      // 动态调整参数来控制宽度展示
      return {
        viewBox: `0, 0, ${w} ${h}`,
        width: `${w}`,
        height: `${h}`,
        cx: `${w / 2}`,
        cy: `${h / 2}`,
        r: `${w * 0.4}`,
        strokeWidth: `${w * 0.1}`
      }
    }
  },
  mounted() {
    const circle = document.querySelector(`#${this.id}`)
    // 获取半径
    const radius = circle.r.baseVal.value
    const perimeter = radius * Math.PI * 2
    circle.style.strokeDasharray = `${perimeter} ${perimeter}`
    circle.style.strokeDashoffset = perimeter
    this.percent = 0
    clearTimeout(this.timer)
    this.timer = null
    this.update(circle, perimeter)
  },
  beforeDestroy() {
    this.percent = 0
    clearTimeout(this.timer)
    this.timer = null
  },
  methods: {
    update(circle, perimeter) {
      clearTimeout(this.timer)
      this.timer = null
      this.timer = setTimeout(async () => {
        const change = (1 - this.percent / 100) * perimeter
        circle.style.strokeDashoffset = change
        this.percent += 1
        this.update(circle, perimeter)
        // 每次循环后处理事件
        if (this.percent % 101 === 0) {
          this.$emit("on-loopend")
        }
      }, this.delay)
    }
  }
}
</script>
<style lang="scss" scoped>
.circle-box {
  display: inline-block;
  vertical-align: middle;
  line-height: 0;
  .backline {
    stroke: #eee;
  }
  .outline {
    stroke-linecap: round;
    /* 添加过渡效果 */
    transition: stroke-dashoffset 0.3s;
    /* SVG circle strokeDashoffset 默认以中心，右边作为起始刻度，因此需要旋转90度 */
    transform: rotate(-90deg);
    transform-origin: center;
  }
}
</style>