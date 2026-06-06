// noinspection SpellCheckingInspection

import { defineTeekConfig } from "vitepress-theme-teek/config";

// Teek 完整配置：
// https://github.com/Kele-Bingtang/vitepress-theme-teek/blob/main/packages/config/types.ts
export const teekConfig = defineTeekConfig({
  // 是否启用 Teek 主题，如果为 false，则不会主题的 99% 功能，只保留永久链接、锚点滚动、深色、浅色模式过渡动画这三个功能
  teekTheme: true,
  // 是否启用主题的首页风格（博客风格），如果 teekHome 为 false 且 vpHome 为 true，则首页还原到 vitepress 的默认首页，其他功能不变
  teekHome: true,
  // 是否启用 VitePress 首页风格，支持 teekHome 和 vpHome 同时存在
  vpHome: false,
  // 是否启用锚点滚动功能，即阅读文章时，自动将 h1 ~ h6 标题添加到地址栏 # 后面
  anchorScroll: true,
  // 首页卡片栏列表位置
  homeCardListPosition: 'right',
  // 首页卡片的位置排序，当设置了 `homeCardSort` 但没有设置全部五个值，则剩余内容默认按照 `homeCardSort` 的顺序进行排序
  homeCardSort: [ 'topArticle', 'category', 'tag', 'friendLink', 'docAnalysis' ],
  // 主题背景色，用于精选文章卡片的 top + sticky 功能和标签卡片的背景色，支持在首页 index.md 的 frontmatter 配置 tk.bgColor
  // tagColor: [
  //   { bg: 'gray', text: 'white', border: 'yellow' }
  // ],
  // 文章页的样式风格，default 为 VitePress 原生风格，card 为单卡片风格，segment 为片段卡片风格，card-nav 和 segment-nav 会额外修改导航栏样式
  pageStyle: 'default',
  // 设置当前主题尺寸（只影响 Teek 主题首页和功能页，不影响 VitePress 默认主题）
  themeSize: 'default',
  // 页面加载 Loading 动画，如果为 boolean，则控制是否启用，如果为字符串，则指定加载 Loading 动画的文案
  loading: false,
  // 深色、浅色模式切换时的过渡动画配置
  viewTransition: {
    enabled: true, // 是否启用深浅色切换动画效果
    mode: "out-in", // 动画模式，out 始终从点击点往全屏扩散，out-in 第一次从点击点往全屏扩散，再次点击从全屏回到点击点
    duration: 300, // 动画持续时间，当 mode 为 out 时，默认为 300ms，mode 为 out-in 时，默认为 600ms
    easing: "ease-in", // 缓动函数
  },
  // 回到顶部按钮配置
  backTop: {
    enabled: true, // 是否启动回到顶部功能
    content: "icon", // 回到顶部按钮的显示内容，可选配置 progress | icon
    // done: TkMessage => TkMessage.success("返回顶部成功"), // 回到顶部后的回调
  },
  // 滚动到评论区配置
  toComment: {
    enabled: true, // 是否启动滚动到评论区功能
    // done: TkMessage => TkMessage.success("滚动到评论区成功"), // 滚动到评论区后的回调
  },
  // 文章页顶部使用 VitePress 容器添加提示
  articleTopTip: (frontmatter) => {
    // 在每个文章页顶部显示 VitePress 容器添加提示，使用场景如超过半年的文章自动提示文章内容可能已过时
    const tip: Record<string, string> = {
      type: frontmatter.topTip?.type ?? "warning",
      title: frontmatter.topTip?.title ?? "",
      text: frontmatter.topTip?.text ??  "文章发布较早，内容可能过时，阅读注意甄别。",
    };
    // 大于半年，添加提示
    const longTime = 6 * 30 * 24 * 60 * 60 * 1000;
    if (frontmatter.date && Date.now() - new Date(frontmatter.date).getTime() > longTime)
      return tip;
  },
  // 文章页底部使用 VitePress 容器添加提示
  // 此处传入 true (ts 声明禁止传入 boolean，但后续解析允许) 或函数后，Layout (package/components/theme/Layout/src/index.vue) 会判定启用 articleBottomTip 及相关插槽
  //   teek-article-bottom-tip-before
  //   teek-article-bottom-tip-after
  // 此处的函数由动态运行时执行 (emit)，故而无法使用外部变量，而内部又无法使用 import 导入 useData，从而无法读取 teekConfig。
  // 因此，我使用传递空函数，使原 VpContainer (packages/components/common/VpContainer/src/index.vue) 由于未获取到有效值而不解析显示。
  // 作为替代，我在 .vitepress/theme/components/ArticleBottomTipBefore.vue 中获得完整参数，并同样使用 VpContainer 作最终展示。
  // 最终，在 .vitepress/theme/components/TeekLayoutProvider 中使用 teek-article-bottom-tip-before 插槽导入 ArticleBottomTipBefore 组件完成配置。
  articleBottomTip: () => ({}),
  // 是否启用侧边栏展开/折叠触发器
  sidebarTrigger: false,
  // 是否全局启用视图渐入过渡效果
  windowTransition: true,
  // 站点特性列表，在文档风格的首页展渲染
  // features: [],
  // body 背景图片配置 (全图模式基础配置，由于全图模式下，首页的分页组件、页脚信息组、页脚徽章待优化显示效果，且博客风页与文档风页需要强行启用主题增强，暂不使用)
  // bodyBgImg: {
  //   imgSrc: ["/homepage/mmAir_124883229.jpg"], // body 背景图片链接。单张图片 string | 多张图片 string[], 多张图片时每隔 imgInterval 秒换一张
  //   imgOpacity: 1, // body 背景图透明度，选值 0.1 ~ 1.0
  //   imgInterval: 15000, //  body 当多张背景图时（imgSrc 为数组），设置切换时间，单位：毫秒
  //   imgShuffle: false, // body 背景图是否随机切换，为 false 时按顺序切换
  //   mask: false, // body 背景图遮罩
  //   maskBg: "rgba(0, 0, 0, 0.2)", // body 背景图遮罩颜色，如果为数字，则是 rgba(0, 0, 0, ${maskBg})，如果为字符串，则作为背景色。mask 为 true 时生效
  //   bannerStyle: "full", // Banner 风格，part 为局部 Banner，显示 feature；full 为全屏 Banner，不显示 feature
  // },
  // 主题增强配置，当开启后，右上角将有主题增强面板出现。
  themeEnhance: {
    enabled: true, // 是否启用主题增强功能
    hidden: true, // 是否隐藏主题增强面板
    position: "top", // 位置，top 为导航栏右侧，bottom 为右下角
    // 布局切换配置
    layoutSwitch: {
      disabled: false, // 禁用布局切换
      hidden: false, // 是否隐藏布局切换面板
      defaultMode: "original", // 布局切换的默认模式
      switchModeDone: () => {}, // 布局切换完成后的回调
      disableHelp: false, // 禁用帮助提示
      disableAnimation: false, // 禁用布局切换动画
      defaultDocMaxWidth: 90, // 内容布局最大宽度的默认百分比，仅限 0-100
      disableDocMaxWidthHelp: false, // 禁用帮助提示
      defaultPageMaxWidth: 95, // 页面布局最大宽度的默认百分比，仅限 0-100
      disablePageMaxWidthHelp: false, // 禁用帮助提示
    },
    // 布局主题色配置
    themeColor: {
      disabled: false, // 禁用布局主题色切换
      hidden: false, // 是否隐藏布局主题色切换面板
      customize: false, // 是否从 0 完全自定义布局主题色，不使用内置主题色
      defaultColorName: "vp-success", // 布局默认主题色
      switchColorDone: () => {}, // 主题色切换完成后的回调
      defaultSpread: false, // 是否将主题色扩散到其他元素（根据主题色计算其他元素需要的颜色）
      disableHelp: true, // 禁用帮助提示
      disabledInMobile: false, // 是否在移动端禁用
      append: [], // 自定义主题色，将会追加到内置主题色后面
    },
    // 聚光灯配置
    spotlight: {
      disabled: false, // 禁用聚光灯
      hidden: false, // 是否隐藏聚光灯面板
      defaultStyle: "aside", // 聚光灯默认样式
      disableHelp: false, // 禁用帮助提示
      defaultValue: true, // 聚光灯默认开关状态
    },
  },
  // 文章默认的作者信息 (在文章介绍卡片下展示) (在 articleBottomTip 中硬编码了作者名称)
  author: {
    name: "廖浩龙", // 作者名称
    link: "https://github.com/ALiaoHaolong", // 点击作者名称后跳转的链接
  },
  // 首页 Banner 配置 (部分配置似乎会被 bodyBgImg 干扰，但当前禁用了 bodyBgImg 配置，所以没有问题)
  banner: {
    enabled: true, // 是否启用 Banner
    // name: "Teek", // Banner 标题，默认读取 vitepress 的 title 属性
    bgStyle: "fullImg", // Banner 背景风格：pure 为纯色背景，partImg 为局部图片背景，fullImg 为全屏图片背景
    pureBgColor: "#28282d", // Banner 背景色，bgStyle 为 pure 时生效
    imgSrc: [ // 首页 Banner 图片链接。bgStyle 为 partImg 或 fullImg 时生效
      "/homepage/mmAir_124883229.jpg",
    ],
    imgInterval: 15000, // 当多张图片时（imgSrc 为数组），设置切换时间，单位：毫秒
    imgShuffle: false, // 图片是否随机切换，为 false 时按顺序切换，bgStyle 为 partImg 或 fullImg 时生效
    imgWaves: true, // 是否开启 Banner 图片波浪纹，bgStyle 为 fullImg 时生效
    mask: true, // Banner 图片遮罩，bgStyle 为 partImg 或 fullImg 时生效
    maskBg: "rgba(0, 0, 0, 0)", // Banner 遮罩颜色，如果为数字，则是 rgba(0, 0, 0, ${maskBg})，如果为字符串，则作为背景色。bgStyle 为 partImg 或 fullImg 且 mask 为 true 时生效
    textColor: "#ffffff", // Banner 字体颜色，bgStyle 为 pure 时为 '#000000'，其他为 '#ffffff'
    titleFontSize: "3.2rem", // 标题字体大小
    descFontSize: "1.4rem", // 描述字体大小
    descStyle: "types", // 描述信息风格：default 为纯文字渲染风格（如果 description 为数组，则取第一个），types 为文字打印风格，switch 为文字切换风格
    description: [
      "海到无边天作岸，山登绝顶我为峰 —— 林则徐",
    ], // 描述信息
    // switchTime: 4000, // 描述信息切换间隔时间，单位：毫秒。descStyle 为 switch 时生效
    // switchShuffle: false, // 描述信息是否随机切换，为 false 时按顺序切换。descStyle 为 switch 时生效
    typesInTime: 200, // 输出一个文字的时间，单位：毫秒。descStyle 为 types 时生效
    typesOutTime: 100, // 删除一个文字的时间，单位：毫秒。descStyle 为 types 时生效
    typesNextTime: 800, // 打字与删字的间隔时间，单位：毫秒。descStyle 为 types 时生效
    typesShuffle: false, // 描述信息是否随机打字，为 false 时按顺序打字，descStyle 为 types 时生效
    // features: [{ title: "", details: "", link: "", image: "" }], // Banner 特性卡片列表，支持 frontmatter.tk.features 配置
    // featureCarousel: 4000, // Banner 特性卡片轮播间隔时间，单位：毫秒。仅在移动端生效（屏幕小于 719px）
  },
  // 壁纸模式，在首页 最顶部 进入全屏后开启，仅当 banner.bgStyle = 'fullImg' 或 bodyBgImg.imgSrc 存在才生效。
  wallpaper: {
    enabled: false, // 是否启用壁纸模式
    // hideBanner: false, // 开启壁纸模式后，是否隐藏 Banner
    // hideMask: false, // 开启壁纸模式后，是否隐藏 Banner 或 bodyBgImage 的遮罩层，则确保 banner.mask 和 bodyBgImage.mask 为 true 才生效
  },
  // 文章列表配置
  post: {
    postStyle: "list", // 文章模板风格，list 为列表风格，card 为卡片风格
    excerptPosition: "top", // 文章摘要位置
    showMore: false, // 是否显示更多按钮
    moreLabel: "阅读全文 >", // 更多按钮文字
    emptyLabel: "暂无文章", // 文章列表为空时的标签
    coverImgMode: "full", // 文章封面图模式，在 frontmatter.coverImg 中设置
    showCapture: true, // 是否在摘要位置显示文章部分文字，当为 true 且不使用 frontmatter.describe 和 <!-- more --> 时，会自动截取前 300 个字符作为摘要
    splitSeparator: true, // 文章信息（作者、创建时间、分类、标签等信息）是否添加 | 分隔符
    transition: true, // 是否开启过渡动画
    transitionName: "tk-slide-fade", // 自定义过渡动画名称
    listStyleTitleTagPosition: "left", // 列表模式下的标题标签位置（postStyle 为 list），在 frontmatter.titleTag 中设置
    // cardStyleTitleTagPosition: "left", // 卡片模式下的标题标签位置（postStyle 为 card）
    defaultCoverImg: [], // 默认封面图地址，如果不设置封面图则使用默认封面图地址
  },
  // 首页文章列表的分页组件配置
  page: {
    pageSize: 10, // 每页显示条目数
    // total: 0, // 总条目数，勿配置
    // pageCount: 0, // 总页数，与 total 二选一，勿配置
    pagerCount: 6, // 设置最大页码按钮数。页码按钮的数量，当总页数超过该值时会折叠
    layout: "prev, pager, next, jumper, ->, total", // 组件布局，子组件名用逗号分隔
    // prevText: "", // 替代图标显示的上一页文字
    // prevIcon: "", // 上一页的图标， 比 prev-text 优先级更高
    // nextText: "", // 替代图标显示的下一页文字
    // nextIcon: "", // 下一页的图标，比 next-text 优先级更高
    size: "default", // 分页大小
    background: false, // 是否为分页按钮添加背景色
    disabled: false, // 是否禁用
    hideOnSinglePage: true, // 只有一页时是否隐藏
  },
  // 博主信息，显示在首页左边第一个卡片
  blogger: {
    name: "和平鸽", // 博主昵称
    slogan: "俺不中咧啊呜呜", // 博主签名
    avatar: "https://avatars.githubusercontent.com/u/58694991", // 博主头像
    shape: "circle-rotate", // 头像风格：square 为方形头像，circle 为圆形头像，circle-rotate 可支持鼠标悬停旋转，circle-rotate-last 将会持续旋转 59s
    circleBgImg: "/homepage/LiaoHaolong_20150912.jpg", // 背景图片
    circleBgMask: true, // 遮罩层是否显示，仅当 shape 为 circle 相关值且 circleBgImg 配置时有效
    circleSize: 100, // 头像大小
    color: "#ffffff", // 字体颜色
    // 状态，仅当 shape 为 circle 相关值时有效
    status: {
      icon: "😪", // 状态图标
      size: 24, // 图标大小
      title: "困", // 鼠标悬停图标的提示语
    },
  },
  // 精选文章卡片配置
  topArticle: {
    enabled: true, // 是否启用精选文章卡片
    // title: "${icon}精选文章", // 卡片标题
    emptyLabel: "暂无精选文章", // 精选文章为空时的标签
    limit: 5, // 一页显示的数量
    autoPage: true, // 是否自动翻页
    pageSpeed: 5000, // 翻页间隔时间，单位：毫秒。autoPage 为 true 时生效
    dateFormat: "yyyy-MM-dd hh:mm:ss", // 精选文章的日期格式
    titleClick: () => {}, // 点击标题时触发，可以通过 router.go 跳转到其他页面，也可以通过 window.open 打开新窗口
  },
  // 分类卡片配置
  category: {
    enabled: true, // 是否启用分类卡片
    path: "/categories", // 分类页访问地址
    // pageTitle: "${icon}全部分类", // 全部分类页中的卡片标题
    // homeTitle: "${icon}文章分类", // 卡片标题
    moreLabel: "全部分类 ...", // 查看更多分类标签，设为空字符串无法禁用
    emptyLabel: "暂无文章分类", // 分类为空时的标签
    limit: 5, // 一页显示的数量
    autoPage: false, // 是否自动翻页
    // pageSpeed: 4000, // 翻页间隔时间，单位：毫秒。autoPage 为 true 时生效
  },
  // 标签卡片配置
  tag: {
    enabled: true, // 是否启用标签卡片
    path: "/tags", // 标签页访问地址
    // pageTitle: "${icon}全部标签", // 全部标签页中的卡片标题
    // homeTitle: "${icon}热门标签", // 卡片标题
    moreLabel: "全部标签 ...", // 查看更多分类标签，设为空字符串无法禁用
    emptyLabel: "暂无标签", // 标签为空时的标签
    limit: 20, // 一页显示的数量
    autoPage: false, // 是否自动翻页
    // pageSpeed: 4000, // 翻页间隔时间，单位：毫秒。autoPage 为 true 时生效
  },
  // 友情链接卡片配置
  friendLink: {
    enabled: true, // 是否启用友情链接卡片
    list: [ // 友情链接数据列表
      {
        name: "Zhenyu Zhang",
        desc: "追风赶月莫停留 平芜尽处是春山",
        avatar: "https://avatars.githubusercontent.com/u/157590849",
        link: "https://github.com/LittleRookie1115",
      },
    ],
    // title: "${icon}友情链接", // 卡片标题
    emptyLabel: "暂无友情链接", // 友情链接为空时的标签
    limit: 5, // 一页显示的数量
    autoScroll: false, // 是否自动滚动
    scrollSpeed: 2500, // 滚动间隔时间，单位：毫秒。autoScroll 为 true 时生效
    autoPage: false, // 是否自动翻页
    // pageSpeed: 4000, // 翻页间隔时间，单位：毫秒。autoPage 为 true 时生效
  },
  // 站点信息卡片配置
  docAnalysis: {
    enabled: true, // 是否启用站点信息卡片
    createTime: "2026-05-14 00:00:00", // 站点创建时间
    wordCount: true, // 是否开启文章页的字数统计
    readingTime: true, // 是否开启文章页的阅读时长统计
    // 访问量、访客数统计配置
    statistics: {
      provider: "busuanzi", // 网站流量统计提供商
      siteView: true, // 是否开启首页的访问量和排名统计
      pageView: true, // 是否开启文章页的浏览量统计
      tryRequest: false, // 如果请求网站流量统计接口失败，是否重试
      tryCount: 5, // 重试次数，仅当 tryRequest 为 true 时有效
      tryIterationTime: 2000, // 重试间隔时间，单位：毫秒，仅当 tryRequest 为 true 时有效
      permalink: false, // 如果为 true，分别统计同一页面的永久链接与文档链接的访问次数；如果为 false，合并统计永久链接与文档链接的访问次数
    },
    // 自定义现有信息
    overrideInfo: [
      {
        key: "lastActiveTime",
        label: "活跃时间",
        value: (_, currentValue) => (currentValue + "").replace("前", ""),
        show: true,
      },
    ],
    // 自定义额外信息
    appendInfo: [
      // { key: "", label: "", value: "" }
    ],
  },
  // 社交信息配置
  social: [
    { icon: "mdi:github", name: "GitHub", link: "https://github.com/ALiaoHaolong", },
    { icon: "simple-icons:gitee", name: "Gitee", link: "https://gitee.com/AnNight", },
    { icon: "simple-icons:bilibili", name: "Bilibili", link: "https://space.bilibili.com/200696877", },
  ],
  // 页脚信息组配置
  footerGroup: [
    {
      title: "官网",
      links: [
        { name: "VitePress", link: "https://vitepress.dev/zh/" },
        { name: "Teek", link: "https://vp.teek.top/" },
      ],
    },
    {
      title: "内部链接",
      links: [
        { name: "分类", link: "/@pages/categoriesPage.html" },
        { name: "标签", link: "/@pages/tagsPage.html" },
        { name: "归档", link: "/@pages/archivesPage.html" },
        { name: "文章清单", link: "/@pages/articleOverviewPage.html" },
      ],
    },
  ],
  // 页脚配置
  footerInfo: {
    // 页脚信息，支持 HTML 格式（位于主题版权上方）
    topMessage: [
      // 图片
      `<img alt="Cats" src="/homepage/cats.png" style="height: 100px;">`,
      // 徽章
      `<span style="display: flex;flex-wrap: wrap;justify-content: center;margin-top: 6px;margin-bottom: 6px;gap: 4px 10px;">
        <a title="GitHub last commit" target="_blank" href="https://github.com/ALiaoHaolong/ALiaoHaolong.github.io">
          <img src="https://img.shields.io/github/last-commit/ALiaoHaolong/ALiaoHaolong.github.io?color=lightseagreen&label=commit&logo=github" alt="GitHub last commit">
        </a>
        <a title="VitePress" target="_blank" href="https://vitepress.dev/">
          <img src="https://img.shields.io/badge/vitepress-v1.6.4-mediumpurple?logo=vitepress" alt="VitePress">
        </a>
        <a title="Teek" target="_blank" href="https://vp.teek.top/">
          <img src="https://img.shields.io/badge/teek-v1.6.0-cornflowerblue" alt="Teek">
        </a>
        <a title="VitePress I18n" target="_blank" href="https://vitepress-i18n.cdget.com/">
          <img src="https://img.shields.io/badge/vitepress--i18n-v1.3.5-palevioletred" alt="VitePress I18n">
        </a>
        <a title="License" target="_blank" href="https://github.com/ALiaoHaolong/ALiaoHaolong.github.io/blob/master/LICENSE">
          <img src="https://img.shields.io/badge/license-Apache_2.0-green" alt="License">
        </a>
      </span>`,
    ],
    // 页脚信息，支持 HTML 格式（位于主题版权下方）
    // bottomMessage: ["上面的内容和图标都可以修改（本条内容也可以隐藏的）"],
    // 主题版权配置
    theme: {
      show: true, // 是否显示主题版权，建议显示
      name: `Teek`, // 自定义名称
      link: "https://github.com/Kele-Bingtang/vitepress-theme-teek/", // 自定义链接
    },
    // 博客版权配置
    copyright: {
      show: true, // 是否显示博客版权
      createYear: 2026, // 创建年份
      suffix: "白羽拾光", // 后缀
    },
    // ICP 备案信息配置
    // icpRecord: {
    //   name: "桂ICP备2021009994号",
    //   link: "https://beian.miit.gov.cn/",
    // },
    // 网络安全备案信息配置
    // securityRecord: {
    //   name: "",
    //   link: "",
    // },
    // 自定义 HTML 片段
    customHtml: `<span id="runtime"></span>`,
  },
  // 新版代码块配置
  codeBlock: {
    enabled: true, // 是否启用新版代码块
    collapseHeight: false, // 超出高度 (px) 后自动折叠，设置 true 则默认折叠，false 则默认不折叠
    overlay: false, // 代码块底部是否显示展开/折叠遮罩层（启用后，原本的全部折叠将替换为显示 overlayHeight 高度的内容，并在底部增加渐变遮罩，显示：查看更多）
    overlayHeight: 400, // 当出现遮罩层时，指定代码块显示高度，当 overlay 为 true 时生效
    langTextTransform: "lowercase", // 语言文本显示样式，为 text-transform 的值:none, capitalize, lowercase, uppercase
    // copiedDone: TkMessage => TkMessage.success("复制成功！"), // 复制代码完成后的回调
  },
  // 文章页顶部 Banner，仅在没有侧边栏的文章页生效
  articleBanner: {
    enabled: true, // 是否启用单文章页 Banner
    showCategory: true, // 是否展示分类
    showTag: true, // 是否展示标签
    // defaultCoverImg: "", // 默认封面图
    defaultCoverBgColor: "#4169E1", // 默认封面背景色，优先级低于 defaultCoverImg
  },
  // 文章信息配置
  articleAnalyze: {
    showIcon: true, // 作者、日期、分类、标签、字数、阅读时长、浏览量等文章信息的图标是否显示
    dateFormat: "yyyy-MM-dd hh:mm:ss", // 文章日期格式，首页和文章页解析日期时使用
    showInfo: true, // 是否展示作者、日期、分类、标签、字数、阅读时长、浏览量等文章信息，分别作用于首页和文章页
    showAuthor: true, // 是否展示作者
    showCreateDate: true, // 是否展示创建日期
    showUpdateDate: false, // 是否展示更新日期，仅在文章页显示
    showCategory: false, // 是否展示分类
    showTag: false, // 是否展示标签
    // 将文章信息传送到指定位置，仅限在文章页生效，默认在文章页顶部 (即，把作者、日期等信息换个地方展示)
    // teleport: {
    //   selector: "h1",
    //   position: "after",
    //   className: "h1-bottom-info",
    // },
  },
  // 文章分享配置
  articleShare: {
    enabled: true, // 是否开启文章链接分享功能
    text: "分享此页面", // 分享按钮文本
    copiedText: "链接已复制", // 复制成功文本
    query: false, // 是否包含查询参数
    hash: false, // 是否包含哈希值
  },
  // 文章页最近更新栏配置
  articleUpdate: {
    enabled: true, // 是否启用文章最近更新栏
    limit: 5, // 文章最近更新栏显示数量
  },
  // 私密功能配置
  private: {
    enabled: false,
  },
  // 风险链接提示功能配置
  riskLink: {
    enabled: false,
  },
  // 赞赏功能配置，已使用赞赏页替代此功能
  // appreciation: {
  // },
  // 面包屑配置
  breadcrumb: {
    enabled: true, // 是否启用面包屑
    showCurrentName: false, // 面包屑最后一列是否显示当前文章的文件名
    separator: "/", // 面包屑分隔符
    homeLabel: "首页", // 鼠标悬停首页图标的提示文案
  },
  // 公告配置
  notice: {
    enabled: false, // 是否启用公告功能
  },
  // 评论配置
  comment: {
    provider: "giscus", // 评论区提供者
    options: {
      // giscus 配置，官网：https://giscus.app/zh-CN
      repo: "ALiaoHaolong/ALiaoHaolong.github.io",
      repoId: "R_kgDOSP76Fw",
      category: "Announcements",
      categoryId: "DIC_kwDOSP76F84C9Smp",
      mapping: "pathname",
      strict: "0",
      reactionsEnabled: "1",
      emitMetadata: "0",
      inputPosition: "top",
      lang: "zh-CN",
      theme: "preferred_color_scheme",
      loading: "lazy", // 评论懒加载
      // useOnline: true, // 是否使用在线链接，使用默认值
      // link: 'https://giscus.app/client.js', // giscus.js 在线链接，useOnline 为 true 时生效，使用默认值
      // integrity: undefined, // giscus.js 的 integrity，未知，不配
    },
  },
  // 内置 Vite 插件配置，全部使用默认值
  // vitePlugins: {
  //   sidebar: true, // 是否启用 sidebar 插件
  //   sidebarOption: {}, // sidebar 插件配置项
  //   permalink: true, // 是否启用 permalink 插件
  //   permalinkOption: {}, // permalinks 插件配置项
  //   mdH1: true, // 是否启用 mdH1 插件
  //   catalogueOption: {}, // catalogues 插件配置项
  //   docAnalysis: true, // 是否启用 docAnalysis 插件
  //   docAnalysisOption: {}, // docAnalysis 插件配置项
  //   fileContentLoaderIgnore: [], // fileContentLoader 插件扫描 markdown 文档时，指定忽略路径，格式为 glob 表达式，如 **/test/**
  //   autoFrontmatter: true, // 是否启用 autoFrontmatter 插件
  //   // autoFrontmatter 插件配置项
  //   autoFrontmatterOption: {
  //     permalink: true, // 是否开启生成永久链接
  //     recoverTransform: false, // 是否开启同名 key 覆盖
  //     categories: true, // 是否开启自动生成 categories
  //     coverImg: false, // 是否开启添加文档封面图
  //     forceCoverImg: false, // 是否开启强制覆盖封面图
  //     coverImgList: [], // 封面图列表
  //     // 处理永久链接的规则
  //     permalinkRules: [
  //       //{ folderName: "01.指南/01.简介/", prefix: "/$path/$uuid", removeLevel: 99 }, // 添加前缀
  //     ],
  //   },
  // },
  // Markdown 插件配置，疑似需要写在 config.mts 中才会生效，请移步 config.mts 查看
  // markdown: {},
  // 站点分析配置，更详细的用户行为统计，需要去对应的第三方服务商申请/配置/查看统计结果，暂不配置
  // siteAnalytics: [
  //   { provider: "google", options: { id: "******" } },
  //   { provider: "baidu", options: { id: "******" } },
  //   { provider: "umami", options: { id: "******", src: "**" } },
  // ],
});
