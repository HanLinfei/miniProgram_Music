//封装网络请求
const BASE_URL = "http://106.53.152.247:3000/"
class request {
  request(url, method, params) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: BASE_URL + url,
        method: method,
        data: params,
        success: res => {
          resolve(res.data)
        },
        fail: reject
      })
    })
  }

  get(url, params) {
    return this.request(url, "GET", params)
  }

  post(url, data) {
    return this.request(url, "POST", data)
  }
}

export default request