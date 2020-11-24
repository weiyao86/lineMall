import Cache from "../script/localStorage";

let defaultCityId = 45;
let defaultCityName = "重庆";

export default {
  cancelTokenList: [], //取消请求数组
  cityId: defaultCityId,
  cityName: defaultCityName,
  movieAreaType: 1, //1-重庆专区  2-全国专区
  currentCountryCity: "",
  movieAllCountryCities: [], //全国城市
  movieAllHotCities: [], //热门城市
  lng: Cache.getStorage("lng"), //经度
  lat: Cache.getStorage("lat"), //纬度
  //用户登录后信息
  userInfo: Cache.getStorage("userInfo"),
  curCheckAddress: null,
  shopCartNum: "", //购物车数量

  //仅提货卡使用
  pickUpUserInfo: Cache.getStorage("pickUpUserInfo")
};
