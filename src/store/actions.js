import CommonHttp from "../script/commonHttp";
export default {
  //购物车数量
  getShopCartNum({ state, commit }, data) {
    if (state.userInfo.uid)
      CommonHttp.http
        .get("/cart/index", {
          params: {
            uid: state.userInfo.uid
          },
          isLoading: false
        })
        .then(res => {
          let list = 0;

          res.data.forEach(item => {
            list += (item.children && item.children.length) || 0;
          });
          commit("setShopCartNum", list);
        })
        .catch(error => commit("setShopCartNum", 0));
  }
};
