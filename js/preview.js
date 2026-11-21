function parseTime(value) {
  if (!value) return null;
  const normalized = String(value).trim().replace(/-/g, "/");
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatTime(value) {
  const date = parseTime(value);
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}`;
}

function isActivityEnded(item, now = new Date()) {
  if (item.longTerm) return false;
  const end = parseTime(item.endTime);
  if (!end) return false;
  return now.getTime() > end.getTime();
}

function getTimeLabel(item) {
  if (item.longTerm) return "长期";
  const start = formatTime(item.startTime);
  const end = formatTime(item.endTime);
  if (start && end) return `${start} ~ ${end}`;
  if (end) return `至 ${end}`;
  if (start) return start;
  return "";
}

function getTypeMeta(type) {
  if (type === 1) return { label: "站内", className: "is-inner" };
  if (type === 2) return { label: "外链", className: "is-outer" };
  if (type === 3) return { label: "详情", className: "is-dialog" };
  return { label: "活动", className: "" };
}

function sortActivities(list) {
  return [...list].sort((a, b) => {
    const pinA = a.pin ? 1 : 0;
    const pinB = b.pin ? 1 : 0;
    if (pinA !== pinB) return pinB - pinA; // 置顶优先
    const sortA = Number.isFinite(a.sort) ? a.sort : 9999;
    const sortB = Number.isFinite(b.sort) ? b.sort : 9999;
    if (sortA !== sortB) return sortA - sortB; // sort 越小越前
    return String(a.id || "").localeCompare(String(b.id || ""));
  });
}

/** 模糊匹配：支持连续子串，也支持跳字（如 123456 可搜 16） */
function fuzzyMatch(text, query) {
  const source = String(text || "").toLowerCase();
  const q = String(query || "").toLowerCase();
  if (!q) return true;
  if (!source) return false;
  if (source.includes(q)) return true;
  let i = 0;
  for (let c = 0; c < source.length; c++) {
    if (source[c] === q[i]) i += 1;
    if (i >= q.length) return true;
  }
  return false;
}

function matchTypeWord(item, word) {
  const meta = getTypeMeta(item.type);
  const aliases = {
    1: ["站内", "内部", "站内链接", "内链"],
    2: ["外链", "外部", "外部链接", "外站"],
    3: ["详情", "对话框", "弹窗"],
  };
  const list = [meta.label].concat(aliases[item.type] || []);
  return list.some((name) => name.toLowerCase().includes(word) || word.includes(name.toLowerCase()));
}

function matchActivity(item, keyword) {
  if (!keyword) return true;
  const q = String(keyword).trim().toLowerCase();
  if (!q) return true;

  // 多词空格分隔，需全部命中
  return q.split(/\s+/).every((word) => {
    if (matchTypeWord(item, word)) return true;
    if (fuzzyMatch(item.title, word)) return true;
    if (fuzzyMatch(item.desc, word)) return true;
    if (fuzzyMatch(item.keywords, word)) return true;
    if (fuzzyMatch(item.id, word)) return true;
    return false;
  });
}

createSiteApp({
  data() {
    const raw = Array.isArray(window.ACTIVITIES_CONFIG)
      ? window.ACTIVITIES_CONFIG
      : [];
    return {
      keyword: "",
      activities: sortActivities(raw),
      activityDialog: {
        open: false,
        title: "",
        content: "",
      },
    };
  },
  computed: {
    filteredActivities() {
      return this.activities.filter((item) => matchActivity(item, this.keyword));
    },
  },
  methods: {
    timeLabel(item) {
      return getTimeLabel(item);
    },
    typeMeta(item) {
      return getTypeMeta(item.type);
    },
    ended(item) {
      return isActivityEnded(item);
    },
    openActivityDialog(title, content) {
      this.activityDialog = {
        open: true,
        title: title || "提示",
        content: content || "",
      };
      document.body.style.overflow = "hidden";
    },
    closeActivityDialog() {
      this.activityDialog.open = false;
      document.body.style.overflow = "";
    },
    onActivityClick(item, event) {
      event.preventDefault();

      if (this.ended(item)) {
        this.openActivityDialog(
          "活动已结束",
          "<p>此活动已结束，再看看其他活动吧～</p>"
        );
        return;
      }

      if (item.type === 3) {
        this.openActivityDialog(item.dialogTitle || item.title, item.dialogContent || "");
        return;
      }

      if (!item.link) {
        this.$toast.error("活动链接未配置");
        return;
      }

      if (item.type === 2) {
        window.open(item.link, "_blank", "noopener,noreferrer");
        return;
      }

      // type 1 内部跳转
      location.href = item.link;
    },
  },
  mounted() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.activityDialog.open) {
        this.closeActivityDialog();
      }
    });
  },
}).mount("#app");
