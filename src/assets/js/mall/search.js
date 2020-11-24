export default {
  name: "Search",

  data() {
    return {
      key: "",
      hotWords: []
    };
  },

  created() {
    let me = this;
    me.init();
  },

  methods: {
    init() {
      let me = this;
      me.getHotsWords();
    },

    getHotsWords() {
      let me = this;
      me.$http
        .get("/shop/search")
        .then(res => (me.hotWords = res.data.keyword || []));
    },

    onSearch(item) {
      let me = this;
      me.$router.push({
        path: "/mall/searchCatgory",
        query: {
          keyWord: (item && item) || me.key
        }
      });
    }
  }
};
