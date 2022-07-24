// pages/detail-songs/index.js
import { rankingStore } from "../../store/index";
import { getSongMenuDetail } from "../../service/api_music";
import { playerStore } from "../../store/index";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    rankingKey: "",
    songInfo: {},
    type: "",
  },

  //通过外面传入的key来标识榜单
  onLoad(options) {
    if (options.type === "ranking") {
      this.setData({
        rankingKey: options.rankingKey,
        type: options.type,
      });
      //直接获取共享的榜单数据
      rankingStore.onState(this.data.rankingKey, this.getRankingData);
    } else if (options.type === "menu") {
      //请求歌单数据
      getSongMenuDetail(options.id).then((res) => {
        console.log(res);
        this.setData({
          type: options.type,
          songInfo: res.playlist,
        });
      });
    }
  },

  getRankingData(res) {
    //存储数据
    this.setData({
      songInfo: res,
    });
  },

  onUnload() {
    if (this.data.rankingKey) {
      rankingStore.offState(this.data.rankingKey, this.getRankingData);
    }
  },

  //当我点击的是songItemV2的时候应该是将当前列表全部载入到播放列表中
  handleSongItemClick(e) {
    const index = e.currentTarget.dataset.index;
    playerStore.setState("playListSongs", this.data.songInfo.tracks);
    playerStore.setState("PlayListIndex", index);
  },
});
