import { getAllMv, getLatestMv, getTopMv } from "../../service/api_video";
import { shuffle, randomIndex } from "../../utils/utils";
Page({
  data: {
    Mvs: [],
    hasMore: true,
  },

  onLoad(options) {
    //请求顶部 MV数据
    this.getMvData(0);
  },
  //封装网络请求方法
  async getMvData(offset) {
    // 判断是否可以请求
    // hasMore属性表示接下来是否还有数据可以请求 当hasMore为false时候 条件即为真 直接return出去
    if (!this.data.hasMore) return;

    //数据请求时动画
    wx.showNavigationBarLoading();
    //发送数据请求
    const res = await getAllMv(offset);
    let randomMvs = shuffle(res.data);
    let tempMvs = [];
    if (offset === 0) {
      tempMvs = randomMvs;
    } else {
      tempMvs = this.data.Mvs.concat(randomMvs);
    }
    this.setData({
      Mvs: tempMvs,
      hasMore: res.hasMore,
    });
    wx.hideNavigationBarLoading();
  },

  //上拉加载更多
  onReachBottom() {
    this.getMvData(this.data.Mvs.length);
  },

  //下拉刷新
  async onPullDownRefresh() {
    let res = await getTopMv(0, 50);

    //调用洗牌函数
    let randomMvs = shuffle(res.data);
    this.setData({
      Mvs: randomMvs,
    });
    wx.stopPullDownRefresh();
  },

  //监听页面跳转
  videoItemClick(e) {
    const id = e.currentTarget.dataset.item.id;
    wx.navigateTo({
      url: `../detail-video/index?id=${id}`,
    });
  },
});
