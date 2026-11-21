/**
 * 全站公共布局：头部 + 底部 + 右侧菜单 + 弹窗
 * 右侧抽屉/对话框由顶部菜单统一控制，所有页面内容一致
 */
(function (global) {
  function detectRoot() {
    if (typeof global.detectSiteRoot === "function") return global.detectSiteRoot();
    const path = (location.pathname || "").replace(/\\/g, "/");
    if (/\/hd\/[^/]+\//.test(path)) return "../../";
    if (/\/hd(\/|$)/.test(path)) return "../";
    return "./";
  }

  const SiteLayout = {
    name: "SiteLayout",
    template: `
      <div class="site-shell" :class="{ 'drawer-open': drawerOpen }">
        <header class="site-header">
          <div class="container header-inner">
            <a class="site-brand" :href="homeHref">
              <img class="site-logo" :src="asset('assets/logo.jpg')" alt="小小会玩" width="36" height="36" />
              <span>{{ siteName }}</span>
            </a>
            <button
              class="menu-btn"
              type="button"
              aria-label="打开菜单"
              :aria-expanded="drawerOpen"
              @click="openDrawer"
            >
              <span class="menu-btn__bar"></span>
              <span class="menu-btn__bar"></span>
              <span class="menu-btn__bar"></span>
            </button>
          </div>
        </header>

        <main class="site-main">
          <slot></slot>
        </main>

        <footer class="site-footer">
          <div class="container site-footer__inner">
            <span>{{ siteName }}</span>
            <span class="site-footer__dot">·</span>
            <button class="site-footer__copy" type="button" @click="openAbout">©by fanys</button>
          </div>
        </footer>

        <!-- 右侧抽屉 + 弹窗：挂到 body，全站样式一致，不受页面主题影响 -->
        <teleport to="body">
          <div
            class="drawer-mask site-overlay"
            :class="{ 'is-visible': drawerOpen }"
            @click="closeDrawer"
          ></div>

          <aside
            class="drawer site-overlay"
            :class="{ 'is-open': drawerOpen }"
            role="dialog"
            aria-modal="true"
            aria-label="快捷链接"
          >
            <div class="drawer__header">
              <div class="drawer__brand">
                <img :src="asset('assets/logo.jpg')" alt="" width="40" height="40" />
                <div>
                  <strong>快捷入口</strong>
                  <span>常用链接</span>
                </div>
              </div>
              <button class="drawer__close" type="button" aria-label="关闭" @click="closeDrawer">
                <span></span>
                <span></span>
              </button>
            </div>

            <nav class="drawer__nav">
              <a
                v-for="link in menuLinks"
                :key="link.id"
                class="drawer__link"
                :href="link.action === 'link' ? link.href : 'javascript:void(0)'"
                :target="link.external ? '_blank' : undefined"
                :rel="link.external ? 'noopener noreferrer' : undefined"
                @click="onMenuClick(link, $event)"
              >
                <span class="drawer__link-icon">{{ link.icon || '›' }}</span>
                <span class="drawer__link-text">
                  <strong>{{ link.title }}</strong>
                  <em v-if="link.desc">{{ link.desc }}</em>
                </span>
              </a>
            </nav>
          </aside>

          <div
            class="modal-mask site-overlay"
            :class="{ 'is-visible': tipDialog }"
            @click.self="closeTip"
          >
            <div class="modal" role="dialog" aria-modal="true" aria-labelledby="tip-title">
              <img class="modal__logo" :src="asset('assets/logo.jpg')" alt="" width="56" height="56" />
              <h3 id="tip-title" class="modal__title">小小会玩</h3>
              <p class="modal__text">暂未发布，请耐心等待</p>
              <button class="modal__btn" type="button" @click="closeTip">知道了</button>
            </div>
          </div>

          <div
            class="modal-mask site-overlay"
            :class="{ 'is-visible': aboutDialog }"
            @click.self="closeAbout"
          >
            <div class="modal modal--about" role="dialog" aria-modal="true" aria-labelledby="about-title">
              <button class="modal__x" type="button" aria-label="关闭" @click="closeAbout">
                <span></span><span></span>
              </button>

              <div class="about__head">
                <img class="about__avatar" :src="author.avatar" alt="作者头像" width="72" height="72" />
                <h3 id="about-title" class="modal__title">关于作者</h3>
                <p class="about__note">{{ author.note }}</p>
              </div>

              <ul class="about__list">
                <li>
                  <span>会玩 ID</span>
                  <button type="button" @click="copyText(author.hwId)">{{ author.hwId }}</button>
                </li>
                <li>
                  <span>微信</span>
                  <button type="button" @click="copyText(author.wechat)">{{ author.wechat }}</button>
                </li>
                <li>
                  <span>会玩房间号</span>
                  <button type="button" @click="copyText(author.room)">{{ author.room }}</button>
                </li>
              </ul>

              <div class="about__tip">
                <p class="about__tip-title">微信投喂</p>
                <img class="about__tip-img" :src="author.tip" alt="微信投喂二维码" />
              </div>
            </div>
          </div>
        </teleport>
      </div>
    `,
    data() {
      const cfg = global.SITE_CONFIG || {};
      const root = cfg.root || detectRoot();
      return {
        root,
        siteName: cfg.siteName || "小小会玩-会玩活动",
        drawerOpen: false,
        tipDialog: false,
        aboutDialog: false,
        menuLinks: Array.isArray(cfg.menuLinks) ? cfg.menuLinks : [],
        author: cfg.author || {
          avatar: root + "assets/logo.jpg",
          hwId: "",
          wechat: "",
          room: "",
          tip: "",
          note: "",
        },
        _onKeydown: null,
      };
    },
    computed: {
      homeHref() {
        return this.root + "index.html";
      },
    },
    methods: {
      asset(path) {
        return this.root + path.replace(/^\.\//, "");
      },
      lockScroll() {
        document.body.style.overflow = "hidden";
      },
      unlockScroll() {
        if (!this.drawerOpen && !this.tipDialog && !this.aboutDialog) {
          document.body.style.overflow = "";
        }
      },
      openDrawer() {
        this.drawerOpen = true;
        this.lockScroll();
      },
      closeDrawer() {
        this.drawerOpen = false;
        this.unlockScroll();
      },
      onMenuClick(link, event) {
        if (link.action === "link") return;
        event.preventDefault();
        if (link.action === "tip") {
          this.tipDialog = true;
          this.lockScroll();
        } else if (link.action === "about") {
          this.openAbout();
        }
      },
      closeTip() {
        this.tipDialog = false;
        this.unlockScroll();
      },
      openAbout() {
        this.aboutDialog = true;
        this.lockScroll();
      },
      closeAbout() {
        this.aboutDialog = false;
        this.unlockScroll();
      },
      async copyText(text) {
        const toast = this.$toast || global.ToastTip;
        try {
          await navigator.clipboard.writeText(text);
          toast.success("已复制：" + text);
        } catch (e) {
          const input = document.createElement("input");
          input.value = text;
          document.body.appendChild(input);
          input.select();
          document.execCommand("copy");
          document.body.removeChild(input);
          toast.success("已复制：" + text);
        }
      },
    },
    mounted() {
      this._onKeydown = (e) => {
        if (e.key !== "Escape") return;
        if (this.aboutDialog) this.closeAbout();
        else if (this.tipDialog) this.closeTip();
        else if (this.drawerOpen) this.closeDrawer();
      };
      window.addEventListener("keydown", this._onKeydown);
    },
    beforeUnmount() {
      if (this._onKeydown) window.removeEventListener("keydown", this._onKeydown);
      document.body.style.overflow = "";
    },
  };

  SiteLayout.install = function (app) {
    app.component("SiteLayout", SiteLayout);
  };

  function createSiteApp(pageOptions = {}) {
    const app = Vue.createApp(pageOptions);
    if (global.ToastTip) app.use(global.ToastTip);
    app.use(SiteLayout);
    return app;
  }

  global.SiteLayout = SiteLayout;
  global.createSiteApp = createSiteApp;
  if (!global.detectSiteRoot) global.detectSiteRoot = detectRoot;
})(window);
