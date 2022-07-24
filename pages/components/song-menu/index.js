const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    songMenu: {
      type: Array,
      value: [],
    },
    title: {
      type: String,
      value: "默认歌单"
    }
  },

  data: {
    // screenWidth: app.globalData.screenWidth,
    // screenHeight: app.globalData.screenHeight
  },

  methods: {
    //监听歌单点击的跳转
    menuItemClick(e) {
      let songmeunid = e.currentTarget.dataset.item.id
      wx.navigateTo({
        url: `../detail-songs/index?id=${songmeunid}&type=menu`,
      })
    }
  }
})