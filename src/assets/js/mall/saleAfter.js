import { mapState } from "vuex";
export default {
  name: "SaleAfter",
  data() {
    return {
      queryParams: {},
      saleList: [], //列表
      goodsList: [],
      globalCkd: false,
      totalPrice: 0, //总价格
      remark: "", //说明
      fileList: []
    };
  },

  computed: {
    ...mapState(["userInfo"])
  },

  created() {
    let me = this;
    me.queryParams = me.$route.query;
    me.init();
  },
  methods: {
    init() {
      let me = this;
      me.getSaleList();
    },

    //pull list
    getSaleList() {
      let me = this,
        params = {
          order_id: me.queryParams.order_id
        };

      me.$http.get("/orderservice/afterSale", { params }).then(res => {
        me.saleList = res.data && res.data.storeList;
        me.goodsList = me.saleList.goodsList || [];
      });
    },

    //获取总价
    calcAllPrice() {
      let me = this,
        data = {
          uid: me.userInfo.uid,
          order_id: me.queryParams.order_id,
          goods_nums: {}
        },
        arr = me.getSelectItems();

      me.totalPrice = 0;

      if (!arr.length) return;

      arr.forEach((item, idx) => {
        data.goods_nums[item.order_goods_id] = item.goods_num;
      });

      me.$http
        .post("/orderservice/countGoodsPrice", { data })
        .then(res => (me.totalPrice = +res.data.total_amount * 100));
    },

    // 提交
    onSubmit() {
      let me = this,
        arr = me.getSelectItems(),
        data = {
          uid: me.userInfo.uid,
          order_goods_nums: {},
          klt_order_id: [],
          order_id: me.queryParams.order_id,
          question_desc: me.remark,
          files: []
        };

      if (!arr.length) return me.$toast("请选择商品");

      data.files = me.fileList.map(file => {
        if (me.$utils.trim(file.status) == "done") {
          return file.serverPath;
        }
      });

      arr.forEach((item, idx) => {
        data.order_goods_nums[item.order_goods_id] = item.goods_num; //转换使用
        data.klt_order_id.push(item.klt_order_id); //转换使用
      });

      data.klt_order_id = data.klt_order_id.join(",");

      me.$http.post("/orderservice/submitAfterSale", { data }).then(res => {
        me.$toast({
          type: "success",
          message: res.msg,
          onClose() {
            me.$router.replace({
              path: "/mall/saleAfterList"
            });
          }
        });
      });
    },

    //文件大小
    onOversize(file) {
      let me = this;
      me.$toast.fail("文件大小不能超过 20MB");
    },

    //选择图后回调 上传
    afterRead(file) {
      let me = this;
      //通过 status 属性可以标识上传状态，uploading 表示上传中，failed 表示上传失败，done 表示上传完成
      file.status = "uploading";
      file.message = "上传中...";

      let formData = new FormData();
      formData.append("file", file.file);

      me.$http
        .post("/upload/uploadFile", { data: formData })
        .then(res => {
          file.status = "done  ";
          file.message = "上传成功";
          file.serverPath = res.data[0];
        })
        .catch(err => {
          file.status = "failed";
          file.message = "上传失败";
        });
    },

    onDeleteImg() {
      let me = this;
      console.log(me.fileList);
    },

    //获取当前选中项
    getSelectItems() {
      let me = this;

      return me.goodsList.filter(item => {
        return item["checked"];
      });
    },

    //全选
    onSelectAll() {
      let me = this;
      me.goodsList.forEach(res => (res["checked"] = me.globalCkd));
      me.calcAllPrice();
    },

    validAllCk() {
      let me = this,
        allCkd = me.goodsList.every(res => res["checked"]);
      me.globalCkd = allCkd;

      me.calcAllPrice();
    }
  }
};
