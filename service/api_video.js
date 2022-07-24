import request from "./index"

//封装顶部MV数据请求
export function getTopMv(offset, limit) {
  return (new request).get("top/mv", {
    offset,
    limit
  })
}

//封装全部MV数据请求
export function getAllMv(offset, limit = 10) {
  return (new request).get("mv/all", {
    offset,
    limit
  })
}

//封装推荐MV数据请求
export function getLatestMv() {
  return (new request).get("mv/first")
}

//封装MV播放请求
export function getVideoMv(id) {
  return (new request).get("mv/url", {
    id
  })
}

//封装MV详情数据请求
export function getDetailMv(id) {
  return (new request).get("mv/detail", {
    mvid: id
  })
}

//封装MV相关视频
export function getRelatedMv(id) {
  return (new request).get("related/allvideo", {
    id
  })
}

export function getRelatedMvURL(id) {
  return (new request).get("video/url", {
    id
  })
}

export function getRelatedMvInfo(id) {
  return (new request).get("video/detail", {
    id
  })
}