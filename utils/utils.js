//封装洗牌函数
export function shuffle(arr) {
  let arrLength = arr.length;
  let randomIndex = null;
  let temp = null;
  while (arrLength > 0) {
    randomIndex = Math.floor(Math.random() * arrLength);
    temp = arr[arrLength - 1];
    arr[arrLength - 1] = arr[randomIndex];
    arr[randomIndex] = temp;
    arrLength--;
  }
  return arr;
}

//封装随机函数
export function randomIndex(min, max) {
  return Math.floor(Math.random() * (max - min)) + min; //含最小值不含最大值
}

//封装随机排序数组
export function randomArray(arr) {
  let newArr = [...arr];
  return newArr.sort(() => Math.random() - 0.5);
}

//封装数组随机取值 无重复
export function randomArr(min, max, arr, count) {
  let newArr = [...arr];
  for (let i = 0; i < count; i++) {
    newArr.splice(randomIndex(min, max--), 1);
  }
  return newArr;
}

//防抖函数
export function debounce(fn, delay = 500, immediately = false, resultCallback) {
  var timer = null;
  let isInvoke = false;
  const _debonce = function (...args) {
    if (timer) clearTimeout(timer);
    if (immediately && !isInvoke) {
      const result = fn.apply(this, args);
      if (resultCallback) resultCallback(result);
      isInvoke = true;
    } else {
      timer = setTimeout(() => {
        const result = fn.apply(this, args);
        if (resultCallback) resultCallback(result);
        isInvoke = false;
        timer = null;
      }, delay);
    }
  };
  _debonce.cancel = function () {
    console.log("取消事件");
    clearTimeout(timer);
    timer = null;
    isInvoke = false;
  };
  return _debonce;
}

//解析歌词
//匹配如下格式 [00:58.650]
const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
export function parseLyric(str) {
  const lyricStrings = str.split("\n");
  const lyricInfos = [];
  for (const lineString of lyricStrings) {
    const timeResult = timeRegExp.exec(lineString);
    if (!timeResult) continue;
    //1.获取时间
    const minute = timeResult[1] * 60 * 1000;
    const second = timeResult[2] * 1000;
    const millsecond =
      timeResult[3].length === 2 ? timeResult[3] * 10 : timeResult[3] * 1;
    const time = minute + second + millsecond;
    //2.获取文本
    const lyricText = lineString.replace(timeRegExp, "");
    //3.push到数组中
    lyricInfos.push({
      time,
      lyricText,
    });
  }

  return lyricInfos;
}
