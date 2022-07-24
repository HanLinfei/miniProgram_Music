import { playerStore, rankingStore } from "../../store/index";
import { getSwiperImgs, getRecommendSongMenu } from "../../service/api_music";
import query from "../../utils/query";
Page({
  data: {
    swiperImgs: [], //轮播图数据
    swiperHeight: 0,
    flagRender: true,
    recommendHotSongs: [], //推荐歌曲
    RecommendSongMenu: [], //推荐歌单
    hotSongMenu: [], //热门歌单
    rankings: {
      newRanking: {},
      originRanking: {},
      riseRanking: {},
    },
    currentSong: {},
    isPlaying: false,
    playAnimationState: "paused",
    isShow: {},
  },

  onLoad(options) {
    //获取页面数据
    this.getPageData();
    //发起共享数据请求
    //请求推荐歌曲 请求三条榜单
    rankingStore.dispatch("getRankingDataAction");
    this.setUpPlayerStoreLinstener();
    //从store中获取共享数据
    //监听推荐歌曲的数据变化
    rankingStore.onState("hotRanking", (res) => {
      if (!res.tracks) return;
      let recommendHotSongs = res.tracks.slice(0, 6);
      this.setData({
        recommendHotSongs,
      });
    });
    //巅峰榜的数据请求
    rankingStore.onState("newRanking", this.handleRankings("newRanking"));
    rankingStore.onState("riseRanking", this.handleRankings("riseRanking"));
    rankingStore.onState("originRanking", this.handleRankings("originRanking"));
  },

  handleRankings(key) {
    return (res) => {
      if (Object.keys(res).length === 0) return;
      // 1.先将全部展开
      // 2.之后传入当前标识的key 来标识此时是谁调用的
      // 3.将拿到的这个值给到这个key
      // 4.因为一个对象里如果遇到相同的key 后者key的值会覆盖前者key值
      this.data.rankings = {
        ...this.data.rankings,
        [key]: res,
      };
      this.setData({
        rankings: this.data.rankings,
      });
    };
  },

  getPageData() {
    //获得轮播图数据
    getSwiperImgs().then((res) => {
      this.setData({
        swiperImgs: res.banners,
      });
    });

    //请求推荐歌单和热门歌单
    getRecommendSongMenu().then((res) => {
      let recommend = res.result.slice(0, 6);
      let hot = res.result.slice(6, 12);
      this.setData({
        RecommendSongMenu: recommend,
        hotSongMenu: hot,
      });
    });
  },

  //监听搜索点击 跳转搜索页面
  handSearchClick() {
    wx.navigateTo({
      url: "../detail-search/index",
    });
  },
  //监听轮播图的图片加载完毕
  swiperImgsLoaded() {
    if (this.data.flagRender) {
      //query返回的是Promise
      query(".swiper-image").then((res) => {
        this.setData({
          swiperHeight: res[0].height,
        });
      });
    }
  },
  //监听推荐歌曲更多的点击  跳转页面 并且传入更多类别
  moreClick() {
    this.navigateToDetailSongsPage("hotRanking");
  },

  //监听榜单的的点击 并且传入类别进行展示
  rankItem(e) {
    let rankingKey = e.currentTarget.dataset.key;
    this.navigateToDetailSongsPage(rankingKey);
  },
  navigateToDetailSongsPage(rankingKey) {
    wx.navigateTo({
      url: `../detail-songs/index?rankingKey=${rankingKey}&type=ranking`,
    });
  },

  //单击后将当前列表添加到播放列表中 通过添加全局状态
  handlesSongItemClick(e) {
    let index = e.currentTarget.dataset.index;
    playerStore.setState("playListSongs", this.data.recommendHotSongs);
    playerStore.setState("PlayListIndex", index);
  },
  //监听当前全局里正在播放的歌曲
  setUpPlayerStoreLinstener() {
    playerStore.onStates(
      ["currentSong", "isPlaying"],
      ({ currentSong, isPlaying }) => {
        if (currentSong) {
          this.setData({ currentSong });
        }
        if (isPlaying !== undefined)
          this.setData({
            isPlaying,
            playAnimationState: isPlaying ? "running" : "paused",
          });
      }
    );
  },
  //监听play-bar的播放与暂停
  handlePlayClick() {
    playerStore.dispatch("changeMusicStateAction", !this.data.isPlaying);
  },

  //监听paly-bar的跳转歌词页
  handlePlayBarClick() {
    wx.navigateTo({
      url: "/pages/music-player/index",
    });
  },
});
