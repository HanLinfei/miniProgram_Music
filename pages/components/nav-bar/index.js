// pages/components/nav-bar/index.js
Component({
  options: {
    //声明具名插槽
    multipleSlots: true,
  },
  properties: {
    title: {
      type: String,
      value: "我是默认标题",
    },
  },

  data: {
    statusBarHeight: 0,
    navBarHeight: 0,
  },
  lifetimes: {
    ready() {
      const globalData = getApp().globalData;
      this.setData({
        statusBarHeight: globalData.statusBarHeight,
        navBarHeight: globalData.navBarHeight,
      });
    },
  },
  methods: {
    handleLeftClick() {
      //用户点击左边区域时候触发 然后给父元素发事件
      this.triggerEvent("click");
    },
  },
});
