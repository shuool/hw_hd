/**
 * 活动列表配置
 * 活动页面目录：hd/活动名/（一个活动一个文件夹）
 *
 * ========== 字段说明 ==========
 * id            string   唯一标识，勿重复
 * type          number   1=跳转内部链接  2=跳转外部链接  3=弹出对话框
 * longTerm      boolean  true=长期活动（列表显示「长期」，不写开始时间）
 *                        false=限时活动（显示开始~结束；已结束点击会提示）
 * startTime     string   开始时间，如 "2026-01-01 00:00:00"（longTerm 为 true 时可忽略展示）
 * endTime       string   结束时间，如 "2099-12-31 23:59:59"
 * image         string   封面图链接（本地或网络），卡片铺满展示
 * title         string   标题
 * desc          string   说明（卡片底部展示）
 * link          string   跳转链接（type=1 内部相对路径，type=2 外部完整 URL）
 * dialogTitle   string   对话框标题（type=3 使用）
 * dialogContent string   对话框内容，支持 HTML（type=3 使用）
 * pin           boolean  是否置顶，true 排在最前
 * sort          number   排序权重，数字越小越靠前（同是否置顶时按此排序）
 * ==============================
 */
window.ACTIVITIES_CONFIG = [
  {
    id: 0,
    type: 1,
    longTerm: false,
    startTime: "2026-11-19 12:00:00",
    endTime: "2026-12-24 00:00:00",
    image: "https://a1.boltp.com/2026/11/22/6b01f2229a8d3.png",
    title: "疯狂星期四(2026冬季赛)",
    desc: "可领取头像框/玩友圈卡片",
    link: "hd/20261122/index.html",
    dialogTitle: "",
    dialogContent: "",
    pin: false,
    sort: 0,
  },
  {
    id: 2,
    type: 3,
    longTerm: true,
    startTime: "",
    endTime: "",
    image: "./assets/gcczz.png",
    title: "全新广场创作激励计划",
    desc: "免费抽取戒指/会员/道具",
    link: "",
    dialogTitle: "活动说明",
    dialogContent: "<p>首页→活动→福利→全新广场创作激励计划</p><p>每日做任务可免费抽取<span style='color:red'>戒指/会员/道具</span></p>",
    pin: false,
    sort: 0,
  },
  {
    id: 3,
    type: 3,
    longTerm: false,
    startTime: "2026-11-11 12:00:00",
    endTime: "2026-12-01 23:59:59",
    image: "./assets/ylcxbqy.png",
    title: "全新熊出没联名戒指",
    desc: "做任务抽取戒指奖励/礼物卡/称号等道具",
    link: "",
    dialogTitle: "活动说明",
    dialogContent: "<p>首页→活动→推荐→全新熊出没联名戒指</p><p>每日做任务可免费抽取<span style='color:red'>奖励/礼物卡/称号等道具</span></p>",
    pin: false,
    sort: 0,
  },
  {
    id: 3,
    type: 3,
    longTerm: false,
    startTime: "2026-11-11 12:00:00",
    endTime: "2026-11-30 23:59:59",
    image: "./assets/zyss.png",
    title: "绝世会玩秀限时返场",
    desc: "做任务抽取会玩秀奖励",
    link: "",
    dialogTitle: "活动说明",
    dialogContent: "<p>首页→活动→会玩秀→绝世会玩秀限时返场</p><p>每日做任务可免费抽取<span style='color:red'>会玩秀奖励</span></p>",
    pin: false,
    sort: 0,
  },

];
