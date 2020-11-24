const pageRouters = [
  {
    path: "/",
    redirect: "/main/index"
  },
  {
    path: "/main/index",
    name: "Index",
    component: () => import("@views/home/MainPage"),
    meta: {
      title: "首页",
      keepAlive: true,
      index: 1,
      isNavBar: true
    }
  },
  {
    path: "/main/my",
    name: "My",
    component: () => import("@views/home/My"),
    meta: {
      title: "我的",
      keepAlive: true,
      index: 3,
      isNavBar: true
    }
  },
  {
    path: "/user/auth",
    name: "Auth",
    component: () => import("@views/user/Auth"),
    meta: {
      title: "身份验证",
      index: 20
    }
  },
  {
    path: "/user/card",
    name: "Card",
    component: () => import("@views/user/Card"),
    meta: {
      title: "我的兑换卡包",
      index: 21
    }
  },
  {
    path: "/user/cardDetail",
    name: "CardDetail",
    component: () => import("@views/user/CardDetail"),
    meta: {
      title: "卡",
      index: 22
    }
  },
  {
    path: "/user/cardAdd",
    name: "CardAdd",
    component: () => import("@views/user/CardAdd"),
    meta: {
      title: "添加兑换卡",
      index: 23
    }
  },
  {
    path: "/user/personInfo",
    name: "PersonInfo",
    component: () => import("@views/user/PersonInfo"),
    meta: {
      title: "个人资料",
      index: 24
    }
  },
  {
    path: "/user/editPhone",
    name: "EditPhone",
    component: () => import("@views/user/EditPhone"),
    meta: {
      title: "修改手机号",
      index: 25
    }
  },
  {
    path: "/user/validAuth",
    name: "ValidAuth",
    component: () => import("@views/user/ValidAuth"),
    meta: {
      title: "验证身份",
      index: 26
    }
  },
  {
    path: "/user/address",
    name: "Address",
    component: () => import("@views/address/Address"),
    meta: {
      title: "我的收货地址",
      index: 40
    }
  },
  {
    path: "/user/addressAdd",
    name: "AddressAdd",
    component: () => import("@views/address/AddressEdit"),
    meta: {
      title: "添加收货地址",
      index: 41
    }
  },
  {
    path: "/user/editAddress",
    name: "EditAddress",
    component: () => import("@views/address/AddressEdit"),
    meta: {
      title: "编辑收货地址",
      index: 42
    }
  },

  {
    path: "/mall/search",
    name: "Search",
    component: () => import("@views/mall/Search"),
    meta: {
      title: "搜索",
      index: 50,
      isNavBar: true
    }
  },
  {
    path: "/mall/searchCatgory",
    name: "SearchCatgory",
    component: () => import("@views/mall/SearchCatgory"),
    meta: {
      title: "逛一逛",
      index: 51,
      keepAlive: true,
      isBack: true,
      isNavBar: true
    }
  },
  {
    path: "/mall/detail",
    name: "Detail",
    component: () => import("@views/mall/Detail"),
    meta: {
      title: "商品详情",
      index: 52,
      isNavBar: true
    }
  },
  {
    path: "/mall/shopCart",
    name: "ShopCart",
    component: () => import("@views/mall/ShopCart"),
    meta: {
      title: "购物车",
      index: 53
    }
  },
  {
    path: "/mall/confirmOrder",
    name: "ConfirmOrder",
    component: () => import("@views/mall/ConfirmOrder"),
    meta: {
      title: "确认订单",
      index: 54
    }
  },
  {
    path: "/mall/order",
    name: "Order",
    component: () => import("@views/mall/Order"),
    meta: {
      title: "我的订单",
      isBack:true,
      keepAlive: true,
      index: 55
    }
  },
  {
    path: "/mall/logistics",
    name: "Logistics",
    component: () => import("@views/mall/Logistics"),
    meta: {
      title: "物流信息",
      index: 56
    }
  },
  {
    path: "/mall/saleAfter",
    name: "SaleAfter",
    component: () => import("@views/mall/SaleAfter"),
    meta: {
      title: "申请售后",
      index: 57
    }
  },
  {
    path: "/mall/saleAfterList",
    name: "SaleAfterList",
    component: () => import("@views/mall/SaleAfterList"),
    meta: {
      title: "我的售后",
      index: 58
    }
  },
  {
    path: "/mall/saleAfterReturn",
    name: "SaleAfterReturn",
    component: () => import("@views/mall/SaleAfterReturn"),
    meta: {
      title: "退货",
      index: 59
    }
  },
  {
    path: "/mall/paySubmit",
    name: "PaySubmit",
    component: () => import("@views/pay/PaySubmit"),
    meta: {
      title: "支付",
      index: 501
    }
  },
  {
    path: "/mall/payResult",
    name: "PayResult",
    component: () => import("@views/pay/PayResult"),
    meta: {
      title: "支付结果",
      index: 502
    }
  },
  {
    path: "/mall/category",
    name: "Category",
    component: () => import("@views/mall/Category"),
    meta: {
      title: "分类",
      index: 503,
      isNavBar:true,
      keepAlive:true
    }
  },
  {
    path: "/mall/catgoryKlt",
    name: "CatgoryKlt",
    component: () => import("@views/mall/KltCategory"),
    meta: {
      title: "优选商城",
      index: 504,
      isNavBar:true,
      keepAlive:true
    }
  },
  {
    path: "/pickUp",
    name: "PickUp",
    redirect: "/pickUp/detail",
    component: () => import("@views/pickUp/Main"),
    children: [
      {
        path: "auth",
        name: "Auth",
        component: () => import("@views/pickUp/Auth"),
        meta: {
          title: "授权",
          index: 60
        }
      },
      {
        path: "detail",
        name: "Detail",
        component: () => import("@views/pickUp/Detail"),
        meta: {
          title: "商品信息",
          index: 61
        }
      },
      {
        path: "card",
        name: "Card",
        component: () => import("@views/pickUp/Card"),
        meta: {
          title: "提货卡",
          index: 62
        }
      },
      {
        path: "writeCard",
        name: "WriteCard",
        component: () => import("@views/pickUp/WriteCard"),
        meta: {
          title: "填写提货单",
          index: 63
        }
      },
      {
        path: "cardList",
        name: "CardList",
        component: () => import("@views/pickUp/CardList"),
        meta: {
          title: "我的提货单",
          index: 64
        }
      },
      {
        path: "logistics",
        name: "Logistics",
        component: () => import("@views/pickUp/Logistics"),
        meta: {
          title: "物流",
          index: 65
        }
      }
    ]
  },
  {
    path: "*",
    name: "404",
    component: () => import("@views/404")
  }
];

export default pageRouters;
