/**
 * 全站顶部右侧菜单 / 弹窗配置（所有页面共用，改这里即可）
 */
(function (global) {
  function detectRoot() {
    const path = (location.pathname || "").replace(/\\/g, "/");
    if (/\/hd\/[^/]+\//.test(path)) return "../../";
    if (/\/hd(\/|$)/.test(path)) return "../";
    if (/\/activities(\/|$)/.test(path)) return "../";
    return "./";
  }

  const root = detectRoot();

  global.SITE_CONFIG = {
    siteName: "小小会玩-会玩活动",
    root: root,
    // 右侧抽屉菜单
    menuLinks: [
      {
        id: "home",
        title: "首页",
        desc: "活动预览列表",
        href: root + "index.html",
        icon: "🏠",
        action: "link",
        external: false,
      },
      {
        id: "official",
        title: "小小会玩官网",
        desc: "品牌宣传主站",
        href: "https://shuool.github.io/hw_promo/",
        icon: "🌐",
        action: "link",
        external: true,
      },
      {
        id: "tools",
        title: "作者小工具",
        desc: "实用工具合集",
        href: "https://shuool.github.io/tools/",
        icon: "🛠️",
        action: "link",
        external: true,
      },
      {
        id: "app",
        title: "小小会玩",
        desc: "应用即将上线",
        icon: "🎮",
        action: "tip",
      },
      {
        id: "about",
        title: "关于作者",
        desc: "联系与投喂",
        icon: "👤",
        action: "about",
      },
    ],
    // 关于作者弹窗
    author: {
      avatar: root + "assets/logo.jpg",
      hwId: "bieqiangwodebabiwawa",
      wechat: "Fanys0507",
      room: "503123",
      tip: root + "assets/wechat-tip.png",
      note: "需网站 / 小程序 / 自动化开发可联系作者",
    },
  };

  global.detectSiteRoot = detectRoot;
})(window);
