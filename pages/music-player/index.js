import { checkSongsUsable, getMusicUrl } from "../../service/api_player";
import { audioContext, playerStore } from "../../store/index";
import Toast from "@vant/weapp/toast/toast";

const playModeNames = ["order", "one", "random"]; //歌曲播放模式映射
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    currentSong: {}, //歌曲信息
    currentPage: 0, //当前是歌曲页还是歌词页
    contentHeight: 0, //除去状态栏和头部的内容高度
    lyricScrollBaseScrollTop: 0,
    lyricScrollBaseScrollBottom: 0,
    isMusicLyric: false, //是否显示歌词
    duration: 0, //总时长
    sliderValue: 0, //滑块位置
    isSliderChanging: false, //判断是否正在滑动
    lyricInfos: [], //歌词内容
    lyricScrollTop: 0, //当前歌词滚动到的距离
    playModeIndex: 0, //当前播放模式的下标
    playModeName: "order", //当前播放模式的名称
    isPlaying: false, //是否在播放状态
    playingIconName: "paused",
  },

  onLoad(options) {
    //1. 获取ID
    const id = options.id;
    //2. 保存ID
    this.setData({
      id,
    });
    //3.监听歌曲信息发生改变
    this.setupPlayerStoreListener();
    //4.动态计算内容高度
    const globalData = getApp().globalData;
    const screenHeight = globalData.screenHeight;
    const statusBarHeight = globalData.statusBarHeight;
    const navBarHeight = globalData.navBarHeight;
    const contentHeight = screenHeight - statusBarHeight - navBarHeight;
    const lyricScrollBaseScrollTop = contentHeight * 0.5 - contentHeight * 0.18;
    const lyricScrollBaseScrollBottom =
      contentHeight * 0.5 - contentHeight * 0.18;
    //适配小屏是否显示歌词
    const deviceRadio = globalData.deviceRadio;
    this.setData({
      contentHeight,
      isMusicLyric: deviceRadio >= 2, //高宽比大于2 才显示歌词
      lyricScrollBaseScrollTop,
      lyricScrollBaseScrollBottom,
    });

    //4. 检查是否可用
    checkSongsUsable(id)
      .then((res) => {})
      .catch(() => {
        Toast.fail("对不起，暂无版权");
      });

    //实时监听 用于更新当前播放时间与滑块位置
  },

  //监听歌曲的信息数据发生改变
  setupPlayerStoreListener() {
    playerStore.onStates(
      ["currentSong", "duration", "lyricInfos"],
      ({ currentSong, duration, lyricInfos }) => {
        if (currentSong) this.setData({ currentSong });
        if (duration) this.setData({ duration });
        if (lyricInfos) this.setData({ lyricInfos });
      }
    );

    playerStore.onStates(
      ["currentTime", "currentIndex", "currentLyricText"],
      ({ currentTime, currentIndex, currentLyricText }) => {
        //时间变化的操作
        if (currentTime && !this.data.isSliderChanging) {
          this.setData({
            currentTime,
            sliderValue: (currentTime / this.data.duration) * 100,
          });
        }
        //歌词变化
        if (currentIndex) {
          this.setData({
            lyricScrollTop: currentIndex * 60,
            currentIndex: currentIndex,
          });
        }
        if (currentLyricText) {
          this.setData({ currentLyricText });
        }
      }
    );

    //监听当前播放模式
    playerStore.onStates(
      ["playModeIndex", "isPlaying"],
      ({ playModeIndex, isPlaying }) => {
        if (playModeIndex !== undefined) {
          this.setData({
            playModeIndex,
            playModeName: playModeNames[playModeIndex],
          });
        }
        if (isPlaying !== undefined) {
          this.setData({
            isPlaying,
            playingIconName: isPlaying ? "paused" : "start",
          });
        }
      }
    );
  },

  //监听滑动页事件
  handleSwiperChange(e) {
    this.setData({
      currentPage: e.detail.current,
    });
  },
  //监听滑块事件
  handleSliderChange(e) {
    // audioContext.pause();
    //1.获取slider变化的值 百分比
    const value = e.detail.value;
    //2.计算需要播放的时间位置
    const currentTime = (this.data.duration * value) / 100;
    //3.设置播放的位置
    audioContext.seek(currentTime / 1000);
    //4.更新状态 记录最新的sliderValue
    this.setData({
      sliderValue: value,
      isSliderChanging: false,
    });
    //设置状态为正在播放 更改图标
    playerStore.setState("isPlaying", true);
    this.setData({
      playingIconName: "paused",
    });
  },
  //监听滑块正在拨动中事件
  handleSliderChanging(e) {
    const value = e.detail.value;
    const currentTime = (value / 100) * this.data.duration;
    this.setData({
      isSliderChanging: true,
      currentTime,
    });
  },

  //监听返回事件
  handleBackClick() {
    wx.navigateBack();
  },

  //监听播放模式事件
  handleModeBtnClick() {
    //计算最新的playModeIndex
    let playModeIndex = this.data.playModeIndex + 1;
    if (playModeIndex === 3) playModeIndex = 0;

    playerStore.setState("playModeIndex", playModeIndex);
  },

  //监听播放与暂停
  handlePlayingBtnClick() {
    playerStore.dispatch("changeMusicStateAction", !this.data.isPlaying);
  },

  //监听下一首事件
  changeMusicActionPrev() {
    playerStore.dispatch("changeMusicAction", false);
  },
  changeMusicActionNext() {
    playerStore.dispatch("changeMusicAction");
  },
});
