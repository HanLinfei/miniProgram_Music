import { HYEventStore } from "hy-event-store";
import { getSongsDetail, getLyric } from "../service/api_player";
import { parseLyric, randomIndex } from "../utils/utils";
// const audioContext = wx.createInnerAudioContext();
const audioContext = wx.getBackgroundAudioManager();
const playerStore = new HYEventStore({
  state: {
    isFristPlay: true,
    id: 0, //当前歌曲ID
    currentSong: {}, //歌曲信息
    duration: 0, //歌曲时长
    lyricInfos: [], //歌词信息
    currentTime: 0, //当前播放的时间
    currentIndex: 0, //当前播放到的歌词
    currentLyricText: "", //当前歌词内容
    playModeIndex: 0, //0:顺序播放  1:单曲循环  2:随机播放
    isPlaying: false, //是否正在播放
    playListSongs: [], //播放列表
    PlayListIndex: 0, //播放列表下标
  },
  actions: {
    //请求歌曲的数据
    playMusicWithSongIdAction(ctx, { id, isRefresh = false }) {
      //如果当前播放的歌曲和下一次点进来的歌曲是一样的话 不需要在重新播放的
      if (ctx.id === id && !isRefresh) return;

      ctx.id = id;
      //1.请求对应的数据
      //获取歌曲信息
      getSongsDetail(id).then((res) => {
        ctx.currentSong = res.songs[0];
        ctx.duration = res.songs[0].dt;
        audioContext.title = res.songs[0].name;
      }),
        //获取歌词
        getLyric(id).then((res) => {
          const lyricString = res.lrc.lyric;
          //解析歌词
          const lyrics = parseLyric(lyricString);
          ctx.lyricInfos = lyrics;
        });
      //2.开始播放ID对应的歌曲

      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
      audioContext.onCanplay(() => {
        audioContext.play();
        //监听歌曲播放完成
        ctx.isPlaying = true; //更改状态为播放
      });
      // ctx.isPlaying = true;
      // console.log("开始播放");
      //监听可以播放了
      // audioContext.onCanplay(() => {
      //   audioContext.play();
      //   //监听歌曲播放完成
      //   ctx.isPlaying = true; //更改状态为播放
      // });
      //监听播放状态
      audioContext.onPlay(() => {
        ctx.isPlaying = true;
      });
      //监听暂停状态
      audioContext.onPause(() => {
        ctx.isPlaying = false;
      });
      audioContext.onStop(() => {
        ctx.isPlaying = false;
      });

      //3.更改歌曲状态以及歌词
      if (ctx.isFristPlay) {
        //因为用的是同一个音频实例对象 所以没有必要每次歌曲播放完成都来添加实例的监听方法
        this.dispatch("setupAudioContextListenerAction");
        ctx.isFristPlay = false;
      }
    },
    //播放歌曲与展示歌词
    setupAudioContextListenerAction(ctx) {
      audioContext.onTimeUpdate(() => {
        //获取当前时间
        const currentTime = audioContext.currentTime * 1000;
        ctx.currentTime = currentTime;
        //根据当前时间设置播放位置 用户滑块过程中禁止修改状态

        //根据当前时间去查找歌词
        for (let i = 0; i < ctx.lyricInfos.length; i++) {
          const lyricInfo = ctx.lyricInfos[i];
          if (currentTime < lyricInfo.time) {
            const currentIndex = i - 1;
            //如果当前歌词和需要在设置的歌词一样的话 就没有必要在设置一次
            if (ctx.currentIndex !== currentIndex) {
              ctx.currentIndex = currentIndex;
              ctx.currentLyricText = ctx.lyricInfos[currentIndex].lyricText;
            }
            break;
          }
        }
      });
      //监听歌曲自然播放完毕
      audioContext.onEnded(() => {
        this.dispatch("changeMusicAction");
      });
    },
    //设置播放和暂停
    changeMusicStateAction(ctx, isPlaying = true) {
      ctx.isPlaying = isPlaying;
      ctx.isPlaying ? audioContext.play() : audioContext.pause();
    },

    //切歌
    changeMusicAction(ctx, isNext = true) {
      this.dispatch("clearSongStateAction");
      //获取索引
      let index = ctx.PlayListIndex;

      //根据不同的播放模式获取下一首歌的索引
      switch (ctx.playModeIndex) {
        //顺序播放
        case 0:
          index = isNext ? index + 1 : index - 1;
          if (index === -1) index = ctx.playListSongs.length - 1;
          if (index === ctx.playListSongs.length) index = 0;
          break;
        //单曲循环
        case 1:
          break;
        //随机播放
        case 2:
          //调用随机函数产生随机指定范围下标
          index = randomIndex(0, ctx.playListSongs.length);
          break;
      }

      ctx.PlayListIndex = index;
      const curentSong = ctx.playListSongs[index];
      console.log(curentSong);

      //开始播放新的歌曲
      this.dispatch("playMusicWithSongIdAction", {
        id: curentSong.id,
        isRefresh: true,
      });
    },
    //清楚所有状态
    clearSongStateAction(ctx) {
      ctx.isPlaying = false;
      ctx.currentSong = {};
      ctx.duration = 0;
      ctx.lyricInfos = [];
      ctx.currentTime = 0;
      ctx.currentIndex = 0;
      ctx.currentLyricText = "";
      audioContext.stop();
      console.log("清除当前所有状态");
    },
  },
});
export { audioContext, playerStore };
