import request from "../service/index"
//热门搜索推荐
export function getSearchHotWord() {
  return (new request).get("search/hot/detail")
}


//关键字搜索建议
export function getSearchSuggest(keywords) {
  return (new request).get("search/suggest", {
    keywords,
    type: "mobile"
  })
}
//根据搜索的关键字获取歌曲列表
export function getSearchResult(keywords) {
  return (new request).get("cloudsearch", {
    keywords
  })
}