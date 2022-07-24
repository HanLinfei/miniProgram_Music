import request from "../service/index"
export function getSwiperImgs() {
  return (new request).get("banner", {
    type: 2
  })
}

//获取所有榜单
export function getRanks() {
  return (new request).get("toplist")
}

//获取热歌榜 用于推荐歌曲
export function getRecommendHotRankings() {
  return (new request).get("playlist/detail?id=3778678")
}

//获取飙升榜 用于排行
export function getRiseRankings() {
  return (new request).get("playlist/detail?id=19723756")
}

//获取新歌榜 用于排行
export function getNewRankings() {
  return (new request).get("playlist/detail?id=3779629")
}

//获取原创榜 用于排行
export function getOriginRankings() {
  return (new request).get("playlist/detail?id=2884035")
}
//获取歌单
export function getRecommendSongMenu() {
  return (new request).get("personalized")
}

//获取歌单详情
export function getSongMenuDetail(id) {
  return (new request).get("playlist/detail", {
    id
  })
}