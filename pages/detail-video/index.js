import { getDetailMv, getRelatedMv, getVideoMv, getRelatedMvURL, getRelatedMvInfo } from "../../service/api_video"
Page({

  data: {
    id: "",
    mvURLInfo: {},//视频地址
    mvDetail: {},//视频详情信息
    mvRelatedVideos: []//相关联的视频
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //判断是MV视频 还是推荐视频
    if (options.flag) {
      const vid = options.id
      this.getRelatedPageData(vid)
    } else {
      const id = options.id
      this.getPageData(id)
    }
  },
  //请求视频资源
  getPageData(id) {

    //请求视频播放地址
    getVideoMv(id).then(res => {
      this.setData({
        mvURLInfo: res.data
      })
    })

    //请求视频详情数据
    getDetailMv(id).then(res => {
      this.setData({
        mvDetail: res.data
      })
    })

    //请求视频的相关联视频
    getRelatedMv(id).then(res => {
      this.setData({
        mvRelatedVideos: res.data
      })
    })
  },
  //请求MV资源
  getRelatedPageData(id) {
    //推荐视频链接
    getRelatedMvURL(id).then(res => {
      this.setData({
        mvURLInfo: res
      })
    })

    //推荐视频信息
    getRelatedMvInfo(id).then(res => {
      this.setData({
        mvDetail: res.data
      })
    })

    //请求视频的相关联视频
    getRelatedMv(id).then(res => {
      this.setData({
        mvRelatedVideos: res.data
      })
    })
  },

  //监听跳转
  videoItemClick(e) {
    let id = e.currentTarget.dataset.item.vid
    //判断是MV类别 还是视频类别
    if (id.length === 32) {
      wx.navigateTo({
        url: `../detail-video/index?id=${id}&flag=related`,
      })
    } else {
      wx.navigateTo({
        url: `../detail-video/index?id=${id}`,
      })
    }
  }
})