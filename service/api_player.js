import request from "./index"

//获取音乐详情
export function getSongsDetail(id) {
  return (new request).get("song/detail", {
    ids: id
  })
}

//获取音乐是否可以播放
export function checkSongsUsable(id) {
  return (new request).get("check/music", {
    id,
  })
}
//获取歌曲Url
export function getMusicUrl(id) {
  return (new request).get("song/url", {
    id,
  })
}

//获取歌词
export function getLyric(id) {
  return (new request).get("lyric", {
    id,
  })
}