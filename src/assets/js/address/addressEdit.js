import { mapState } from "vuex";
import ChooseAddress from "@components/ChooseAddress";
export default {
  name: "AddressAdd",
  data() {
    return {
      queryParams: {},
      showPopup: false,
      addressList: [],
      name: "",
      tel: "",
      address: "",
      desc: "",
      checked: false
    };
  },

  computed: {
    ...mapState(["userInfo"]),

    //页面类型 true-编辑  false-添加
    pageType() {
      return this.queryParams.uid && this.queryParams.addr_id;
    }
  },

  components: { ChooseAddress },

  created() {
    let me = this;
    me.queryParams = me.$route.query;
    me.init();
  },

  methods: {
    init() {
      let me = this;
      me.getAddressInfo();
    },

    getAddressInfo() {
      let me = this,
        params = {
          uid: me.queryParams.uid,
          addr_id: me.queryParams.addr_id
        };
      if (!me.pageType) return;

      me.$http.get("/user/userAddressEdit", { params }).then(res => {
        let data = res.data,
          list = [],
          address = "",
          recursive = obj => {
            list.push(obj);
            address += " " + obj.name;
            if (obj.children) {
              recursive(obj.children);
            }
          };
        recursive(data.list || {});
        me.name = data.realname;
        me.tel = data.telephone;
        me.address = data.area_name;
        me.desc = data.address;
        me.checked = data.is_default == 1;
        me.address = address;
        me.addressList = list;
      });
    },

    //打开地址栏
    onShowPopup() {
      let me = this;
      me.showPopup = !me.showPopup;
    },

    //地址栏加载后
    opendAfter() {
      let me = this,
        addressCmp = me.$refs.addressCmp;
      addressCmp.init();
    },

    //保存
    onSubmit() {
      let me = this,
        addressList = me.addressList || [],
        url = "/user/userAddressAdd",
        data = {
          uid: me.userInfo.uid,
          realname: me.name,
          telephone: me.tel,
          province_id: (addressList[0] && addressList[0].id) || "",
          city_id: (addressList[1] && addressList[1].id) || "",
          district_id: (addressList[2] && addressList[2].id) || "",
          street_id: (addressList[3] && addressList[3].id) || "",
          address: me.desc,
          is_default: me.checked ? 1 : 0
        };
      if (me.pageType) {
        url = "/user/userAddressEdit";
        data["addr_id"] = me.queryParams.addr_id;
      }

      me.$http.post(url, { data }).then(res => {
        me.$toast({
          type: "success",
          message: res.msg,
          onClose() {
            me.$router.back();
          }
        });
      });
    },

    onDelInfo() {
      let me = this,
        data = {
          uid: me.queryParams.uid,
          addr_id: me.queryParams.addr_id
        };

      me.$dialog
        .confirm({
          title: "提示",
          message: "确认执行删除操作吗?"
        })
        .then(res => {
          me.$http.post("user/userAddressDelete", { data }).then(res => {
            me.$toast({
              type: "success",
              message: res.msg,
              onClose() {
                me.$router.back();
              }
            });
          });
        });
    },

    //地址选完后
    chooseAddressAfter(navList) {
      let me = this;
      me.showPopup = !me.showPopup;
      me.addressList = [...navList];
      me.address = "";
      me.addressList.forEach(item => (me.address += " " + item.name));
    }
  }
};
