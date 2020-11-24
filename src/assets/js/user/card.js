import { mapState } from "vuex";
export default {
  name: "Card",
  data() {
    return {
      digit: "",
      cardList:[]
    };
  },

  computed: {
    ...mapState(["userInfo"]),

    needFixed(){
      let me=this,
          classList=[];
      if(!me.cardList.length){
        classList.push('normal-btns');
      }else{
        classList.push('van-hairline--top');
      }
      return classList.join(" ");
    }
  },

  created() {
    let me = this;
    me.getCardList();
  },

  methods: {
    init() {},

    getCardList() {
      let me = this;
      me.$http
        .get("/user/userCardsList", {
          params: {
            uid: me.userInfo.uid
          }
        })
        .then(res => (me.cardList = res.data));
    },

    onAddCard(){
      let me=this;
      me.$router.push("/user/cardAdd");
    },

    //详细页
    toDetail(item) {
      let me = this;

      me.$router.push({
        path: "/user/cardDetail",
        query: {
          title: item.product,
          cardId:item.id
        }
      });
    }
  }
};
