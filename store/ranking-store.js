import { HYEventStore } from "hy-event-store";
import {
  getRecommendHotRankings,
  getRiseRankings,
  getNewRankings,
  getOriginRankings,
} from "../service/api_music";
const rankingStore = new HYEventStore({
  state: {
    hotRanking: {},
    riseRanking: {},
    newRanking: {},
    originRanking: {},
  },
  actions: {
    getRankingDataAction(ctx) {
      //热歌榜 推荐歌曲
      getRecommendHotRankings().then((res) => {
        ctx.hotRanking = res.playlist;
      });

      //飙升榜
      getRiseRankings().then((res) => {
        // console.log("飙升榜", res);
        ctx.riseRanking = res.playlist;
      });
      //新歌榜
      getNewRankings().then((res) => {
        // console.log("新歌榜", res);
        ctx.newRanking = res.playlist;
      }),
        //原创榜
        getOriginRankings().then((res) => {
          // console.log("原创榜", res);
          ctx.originRanking = res.playlist;
        });
    },
  },
});

export { rankingStore };
