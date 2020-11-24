export default {
  // 缓存异步请求
  setCancelToken(state, cancel) {
    state.cancelTokenList.push(cancel);
  },

  // 取消未完成异步请求
  removeCancelToken(state, opts) {
    let prevNum = 0;
    if (opts && opts["prevNum"]) {
      prevNum = opts["prevNum"];
    }
    for (let i = state.cancelTokenList.length - 1; i >= 0; i--) {
      state.cancelTokenList[i].call(null, "取消中。。。");
      state.cancelTokenList.splice(i, 1);
    }
  },

  //设置当前选中的收货地址
  setCurCheckAddress(state, opts) {
    state.curCheckAddress = opts.address;
  },

  //设置经纬度
  setLngAndLat(state, opts) {
    state.lng = opts.lng;
    state.lat = opts.lat;
  },

  //设置商城用户信息
  setUserInfo(state, opts) {
    state.userInfo = opts;
  },

  //设置提货卡用户信息
  setPickUpUserInfo(state, opts) {
    state.pickUpUserInfo = opts;
  },

  //设置当前城市类型
  chooseMovieAreaType(state, type) {
    //重庆与全国  1/2

    state.movieAreaType = type;
  },
  //热门城市,全国城市
  setShopCartNum(state, data) {
    state.shopCartNum = data || "";
  }
};
