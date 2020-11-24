import Methods from "./methods";

let directives = {
  
  iosFixScroll() {
    if (Methods.utils.isIOS()) {
      return {
        bind: function() {},
        inserted: function(el, binding) {
          let startY = 0;
          let prevent = e =>
            e.cancelable && !e.defaultPrevented && e.preventDefault();

          el.addEventListener(
            "touchstart",
            function(evt) {
              startY = evt.changedTouches[0].pageY;
            },
            {
              passive: false
            }
          );

          el.addEventListener(
            "touchmove",
            function(evt) {
              let moveY = evt.changedTouches[0].pageY,
                top = el.scrollTop,
                ch = el.clientHeight,
                sh = el.scrollHeight;

              if (top === 0 && moveY > startY) {
                prevent(evt);
                el.scrollTop = 1;
              }
              if (top + ch === sh && moveY < startY) {
                prevent(evt);
                el.scrollTop -= 1;
              }
            },
            {
              passive: false
            }
          );

          el.classList.add("fix-ios-scroll");
        },
        update: function() {},
        componentUpdated: function() {},
        unbind: function() {}
      };
    }

    return () => {};
  },

  safeAreaInsetBottom() {
    return function(el, bind, vnode, oldVnode) {
      el.classList.add("custom-safe-area-inset-bottom");
    };
  }
};

export default directives;
