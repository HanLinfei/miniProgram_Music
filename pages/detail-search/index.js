import {
  getSearchHotWord,
  getSearchSuggest,
  getSearchResult
} from "../../service/api_search"
import {
  debounce,
  randomArr,
} from "../../utils/utils"
import {
  stringToNodes
} from "../../utils/string2nodes"
import Toast from '@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotKeyWords: [],
    randomHotKeyWords: [],
    suggestSongs: [],
    suggestSongsNodes: [],
    searchValue: "",
    resultSongs: [],
    debounceSendSuggestKey: null
  },
  onLoad(options) {
    this.data.debounceSendSuggestKey = debounce(this.sendSuggestSongKey, 300)
    this.handleSearchHotWord()
  },

  // 获取热门搜索词汇
  handleSearchHotWord() {
    getSearchHotWord().then(res => {
      // 随机一下这个关键词
      let hotKeyWords = [...res.data]
      this.setData({
        randomHotKeyWords: randomArr(0, hotKeyWords.length, hotKeyWords, 10),
        hotKeyWords
      })
    })
  },


  //监听文本框搜索  需要做防抖处理
  handleSearch(e) {
    const searchValue = e.detail
    if (!searchValue) {
      //当没有值的时候 重置一下值 并且return掉
      this.setData({
        searchValue: "",
        resultSongs: [],
        // suggestSongsNodes: [], //富文本节点
        suggestSongs: []
      })
      this.data.debounceSendSuggestKey.cancel()
      return
    }
    //发送关键字搜索请求
    this.data.debounceSendSuggestKey(searchValue)
  },


  sendSuggestSongKey(searchValue) {
    //根据用户的输入的关键字发送请求
    getSearchSuggest(searchValue).then(res => {
      //1.获取建议的关键字
      const suggestSongs = res.result.allMatch
      this.setData({
        searchValue,
        suggestSongs,
      })
    })
  },

  // 富文本 着重突出关键字做法
  // sendSuggestSongKey(searchValue) {
  //   //根据用户的输入的关键字发送请求
  //   getSearchSuggest(searchValue).then(res => {

  //     //1.获取建议的关键字
  //     const suggestSongs = res.result.allMatch
  //     if (!suggestSongs) return
  //     const suggestSongsNodes = []
  //     //2.转成nodes节点
  //     const suggestKeyWords = suggestSongs.map(item => item.keyword)
  //     for (const keyword of suggestKeyWords) {
  //       const nodes = stringToNodes(keyword, searchValue)
  //       suggestSongsNodes.push(nodes)
  //     }
  //     this.setData({
  //       searchValue,
  //       suggestSongsNodes,
  //       suggestSongs,
  //     })
  //   })
  // },


  //监听用户点击回车
  searchAction() {
    if (!this.data.searchValue) return
    const searchValue = this.data.searchValue
    getSearchResult(searchValue).then(res => {
      this.setData({
        resultSongs: res.result.songs,
        randomHotKeyWords: randomArr(0, this.data.hotKeyWords.length, this.data.hotKeyWords, 10),
      })
    }).catch(() => {
      Toast.fail('服务器似乎出了点问题....');
    })
  },
  //监听用户点击标签
  handleSuggestClick(e) {
    let keyword = e.currentTarget.dataset.item
    this.setData({
      searchValue: keyword,
      // suggestSongsNodes: [],
    })
    this.searchAction()
  },
  //监听用户清空文本框
  clearSearchValue() {
    this.setData({
      searchValue: "",
      resultSongs: [],
      // suggestSongsNodes: [],
      suggestSongs: []
    })
  }
})