/**
 * 底部提示组件（Vue 3）
 * 用法：在页面里挂 <toast-tip ref="toast" />，然后 this.$refs.toast.show('提示文字')
 * 或：ToastTip.show('提示文字') 全局调用
 */
(function (global) {
  const ToastTip = {
    name: "ToastTip",
    template: `
      <teleport to="body">
        <transition name="toast-fade">
          <div
            v-show="visible"
            class="toast-tip"
            :class="'toast-tip--' + type"
            role="status"
            aria-live="polite"
          >
            <span class="toast-tip__icon" v-if="icon">{{ icon }}</span>
            <span class="toast-tip__text">{{ message }}</span>
          </div>
        </transition>
      </teleport>
    `,
    data() {
      return {
        visible: false,
        message: "",
        type: "info",
        icon: "",
        _timer: null,
      };
    },
    methods: {
      show(message, options = {}) {
        const {
          type = "info",
          icon = "",
          duration = 2200,
        } = typeof options === "number" ? { duration: options } : options;

        if (this._timer) {
          clearTimeout(this._timer);
          this._timer = null;
        }

        this.message = message;
        this.type = type;
        this.icon = icon || defaultIcon(type);
        this.visible = true;

        if (duration > 0) {
          this._timer = setTimeout(() => {
            this.hide();
          }, duration);
        }
      },
      success(message, duration) {
        this.show(message, { type: "success", duration });
      },
      error(message, duration) {
        this.show(message, { type: "error", duration });
      },
      hide() {
        this.visible = false;
        if (this._timer) {
          clearTimeout(this._timer);
          this._timer = null;
        }
      },
    },
    beforeUnmount() {
      if (this._timer) clearTimeout(this._timer);
    },
  };

  function defaultIcon(type) {
    if (type === "success") return "✓";
    if (type === "error") return "!";
    return "";
  }

  // 全局轻量调用：ToastTip.show('已复制')
  let hostApp = null;
  let hostApi = null;

  function ensureHost() {
    if (hostApi) return hostApi;
    const el = document.createElement("div");
    el.id = "toast-tip-host";
    document.body.appendChild(el);
    hostApp = Vue.createApp({
      components: { ToastTip },
      template: `<toast-tip ref="toast" />`,
      mounted() {
        hostApi = this.$refs.toast;
      },
    });
    const vm = hostApp.mount(el);
    hostApi = vm.$refs.toast;
    return hostApi;
  }

  ToastTip.show = function (message, options) {
    const api = ensureHost();
    api.show(message, options);
    return api;
  };

  ToastTip.success = function (message, duration) {
    return ToastTip.show(message, { type: "success", duration });
  };

  ToastTip.error = function (message, duration) {
    return ToastTip.show(message, { type: "error", duration });
  };

  ToastTip.install = function (app) {
    app.component("ToastTip", ToastTip);
    app.config.globalProperties.$toast = {
      show: (...args) => ToastTip.show(...args),
      success: (...args) => ToastTip.success(...args),
      error: (...args) => ToastTip.error(...args),
    };
  };

  global.ToastTip = ToastTip;
})(window);
