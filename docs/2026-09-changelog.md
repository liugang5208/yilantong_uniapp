# 2026-09 功能更新说明（App 前端）

> 分支：`feature/20260830-update`
> 整理日期：2026-09-04（最后更新：2026-09-28）
> 对应后端变更：见 `yilan` 仓库 [`docs/2026-09-changelog.md`](../../yilan/docs/2026-09-changelog.md) 及 [`docs/2026-09-migration.sql`](../../yilan/docs/2026-09-migration.sql)

## 目录

- [一、功能概述](#一功能概述)
- [二、UI 改版批量合入（已提交 `ui init`）](#二ui-改版批量合入已提交-ui-init)
- [三、本地/线上接口地址切换](#三本地线上接口地址切换)
- [四、商品详情页"标准/类型"改为真正的二级联动](#四商品详情页标准类型改为真正的二级联动)
- [五、客服电话来源统一改为用户等级配置](#五客服电话来源统一改为用户等级配置)
- [六、账号资料编辑页（poindex）字段修复](#六账号资料编辑页poindex字段修复)
- [七、新增功能：意见反馈完整闭环](#七新增功能意见反馈完整闭环)
- [八、新增功能：报价单常用单位/备注模板改为后端存储](#八新增功能报价单常用单位备注模板改为后端存储)
- [九、商品"单品备注"打通报价单/购物车/购买中心/订单详情/订单管理](#九商品单品备注打通报价单购物车购买中心订单详情订单管理)
- [十、后端修复：点击"立即生成报价单"必现崩溃](#十后端修复点击立即生成报价单必现崩溃)
- [十一、修复：购物车"清空"误删其他税率分组商品](#十一修复购物车清空误删其他税率分组商品)
- [十二、后端修复：购物车同规格换税率添加会顶替已有记录](#十二后端修复购物车同规格换税率添加会顶替已有记录)
- [十三、购物车单品备注展示位置调整](#十三购物车单品备注展示位置调整)
- [十四、结算中心页客服电话补齐用户等级配置](#十四结算中心页客服电话补齐用户等级配置)
- [十五、修复：开屏视频播放死循环，视频广告实际上从未能播放过](#十五修复开屏视频播放死循环视频广告实际上从未能播放过)
- [十六、开屏视频深度排查：本地缓存池方案 + 真正病根是原生 logo 页关闭时机不稳定](#十六开屏视频深度排查本地缓存池方案--真正病根是原生-logo-页关闭时机不稳定)
- [十七、新增功能：开屏视频"默认播放声音"改为读后台配置](#十七新增功能开屏视频默认播放声音改为读后台配置)
- [十八、新增功能：接入阿里云验证码2.0 + 注册手机号姓名实名核验](#十八新增功能接入阿里云验证码20--注册手机号姓名实名核验)
- [十九、新增功能：发票资料提交接入企业二要素核验](#十九新增功能发票资料提交接入企业二要素核验)
- [二十、文件变更清单](#二十文件变更清单)
- [二十一、已知问题 / 待确认事项](#二十一已知问题--待确认事项)

---

## 一、功能概述

本次会话先把姊妹 UI 项目（`yilantong_uniapp-UI/yilantong_new`）里已经做好的改版整体合入本项目，随后针对合入后暴露/复查出的几个后端联动问题做了排查与修复：

1. **UI 改版批量合入**：36 个页面/组件的样式与交互改版、AI 助手页、意见反馈页等新功能、配套静态资源，`pages.json`/`manifest.json` 按需合并
2. **接口地址切换**：`config/publicConfig.js` 在本地联调与线上环境之间切换过，当前指向线上
3. **商品详情页"标准/类型"筛选**：原来的筛选栏数据没有正确关联后台"标准选项管理"分组，改成真正的二级联动，并接入用户等级的展示位开关（后端配合）
4. **客服电话统一改口径**：商品详情页 + "我的"页的"联系客服"，原来分别是商品自身字段（后台无编辑入口，恒为空）和写死的固定号码，统一改为按用户等级读取
5. **账号资料编辑页修复**：账号类型、证件号码、联系电话三个字段填了保存不生效；企业单位的证件照上传功能实际不可用
6. **补完意见反馈功能闭环**：入口跳转路径写错、提交接口前端没实现、后端全无代码/表——三处断点一次性打通，加上后台查看/回复、前端展示回复

---

## 二、UI 改版批量合入（已提交 `ui init`）

**来源**：`/Users/liugang/data/workspace/yilantong_uniapp-UI/yilantong_new`（同一批底层代码的 UI 设计分支，非本仓库的 git 历史）

对比两个工作目录的差异（排除 `.git`/`node_modules`/`unpackage`/证书等无关目录），把源项目里相对本项目 HEAD 的全部改动拷贝过来：

- **36 个既有文件的样式/交互改版**：`components/u-tabbar/u-tabbar.vue`、`library/api.js`、`library/http.js`、`pages/cart/*`、`pages/home/*`、`pages/index/index.vue`、`pages/login_md/*`、`pages/my/adindex/*`、`pages/my/heindex/*`、`pages/my/order/*`、`pages/my/setindex/*`、`pages/my/tiindex/*`、`pages/poindex/poindex.vue`、`pages/report/*`、`pages/shops/shop_lists.vue`、`pages/welcome/welcome.vue`、`static/imgs/login_banner.png`
- **新增功能文件**：`mixins/share.js`、`pages/ai/ai_assistant/ai_assistant.vue`（AI 智能报价管家）、`pages/my/setindex/setfeedback.vue`（意见反馈，新增后已在 `pages.json` 注册）
- **新增静态资源**：`static/ai-logo.png`、`static/user-avatar.png`、`static/icon/`（支付方式/操作图标共 9 张）
- **`pages.json` 合并**（保留本项目自己的格式化与 `condition` 开发模式配置，只合入源项目的实际内容变化）：
  - `pages/index/index`、`pages/cart/cart` 新增 `popGesture: none`
  - `pages/home/search` 改为自定义导航栏样式
  - 新增页面注册：`pages/ai/ai_assistant/ai_assistant`、`pages/my/setindex/setfeedback`
- **`manifest.json`**：只合入了 Android 打包的 `abiFilters`（`armeabi-v7a`/`arm64-v8a`/`x86`）；App 名称/`appid` 保留本项目自己的身份，未采用源项目里不同品牌（"ELANTO"）的配置；`splashscreen` 下依赖尚未生成的图标资源的配置未合入
- **根目录参考资料**：`APP图标.png`（新版 App 图标原始文件）、`樣式修改規範文件.txt`（UI 改版说明文档），按用户要求一并拷贝，不参与代码逻辑

**结果**：`git diff` 两个工作目录，除 `manifest.json`/`pages.json`（按上述策略有意保留差异）外全部一致；已由用户提交为 commit `cf7f0fd "ui init"`。

---

## 三、本地/线上接口地址切换

`config/publicConfig.js` 的 `server` 在会话中来回切换：本地测试一度改为 `http://127.0.0.1:8088/Inter/`，之后改回线上 `https://app.elccc.cn/Inter/`（当前生效值）。三个候选地址都以注释形式保留在文件里，切换只需调整哪一行被注释：

```js
module.exports = {
	 server:'https://app.elccc.cn/Inter/',
	 //server:'https://two.elccc.cn/Inter/',
	 //server:'http://127.0.0.1:8088/Inter/',
	 version:32000,
}
```

> 注：`http://127.0.0.1` 仅在浏览器/H5 预览下可用，真机/模拟器需换成本机局域网 IP。

---

## 四、商品详情页"标准/类型"改为真正的二级联动

**文件**：`pages/shops/shop_lists.vue`

**背景**：排查发现底部"标准:"那排 pill 实际读的是 `blank.catname`（对应后台"商品属性管理"），从未关联后台真正的"标准选项管理"分组（`plate_conts_blank_group`），一个商品配置多个分组时会被摊平混在一起；"类型:"那排则是完全写死的阻燃等级下拉（`无阻燃型/阻燃C级/阻燃B级/阻燃A级`），后端没有任何数据支撑。

**改动**：
- **"标准:"** 行改为渲染新的 `groups`（来自后端新增的分组查询），点击 `groupChange(g)` 设置 `group_id` 并重新请求
- **"类型:"** 行改为渲染 `blank`（随所选 `group_id` 联动返回），点击 `blankChange(item)` 用返回项真实的 `cat_index`（而不是数组下标 `i+1`）
- 删除写死的 `subTypeList`/`sub_type_index`/`subTypeChange`（阻燃等级下拉）
- `doIninit()` 请求参数新增 `group_id`，响应读取新增 `groups`/`group_id`
- `getActiveStandardName()` 从按数组下标取值（`blank[cat_index-1]`）改为按 `cat_index` 精确查找，因为 `blank` 不再是连续下标序列
- 顶部导航栏拨号来源同时改为 `ulevel.tel`（见下一节）

**后端配合**：`Inter/Goods::glist()` 新增分组查询、按用户等级 `type1~type10` 过滤可见标准、`group_id` 合法性校验，详见 `yilan` 仓库变更记录。

---

## 五、客服电话来源统一改为用户等级配置

**背景**：排查发现全项目有三处"联系客服"/拨打电话入口，来源各不相同：
1. `pages/shops/shop_lists.vue` 顶部导航栏：`ginfo.g_phone`（商品自身字段，后台"添加/修改细分商品"表单从未提供编辑入口，线上数据基本是空的）
2. `pages/my/my.vue`"我的"页卡片：`servicePhone: '18883333289'`（写死的固定号码，代码注释明确写"已按要求写死"）
3. `pages/my/setindex/setcuetom.vue`"客服中心"页：`Index/artall.html` 全站统一配置（`cus_phone`），跟用户是谁、什么等级无关

**改动**（1、2 两处改为统一读用户等级配置的客服电话，第 3 处未改动，仍是全站统一号码）：
- `pages/shops/shop_lists.vue`：`callnumber()` 从 `ginfo.g_phone` 改为 `ulevel.tel`
- `pages/my/my.vue`：移除写死的 `servicePhone`，`makePhoneCall()` 改读 `infos.ac_level_tel`（`$api.Users()` 返回，为空时提示"暂无客服电话"而不是拨空号）

**后端配合**：`Inter/Users::index()` 新增返回 `ac_level_tel`（查 `users_level.tel`）；`Inter/Goods::glist()` 返回的 `ulevel` 本身就是 `users_level` 整行，天然带 `tel`，无需额外改动。

---

## 六、账号资料编辑页（poindex）字段修复

**文件**：`pages/poindex/poindex.vue`

**背景**：审查发现"编辑账号资料"页的账号类型、证件号码、联系电话填了保存后又变回空——前端提交的 `accountType`/`idCardOrLicence`/`contactPhone` 在 `users` 表里根本没有同名列，后端 `save()` 会自动过滤未知字段，静默丢弃；企业单位的两张证件照复用了个人身份证的 `pic_id`/`pic_back`，而库里其实为企业单独留了 `pic_head`/`pic_cont` 两个字段；上传的图片也从未转成后端要求的 base64 格式，保存时被静默置空。

**改动**：
- **企业证件照绑定字段修正**：企业单位模板下的两个上传框改为绑定 `form.pic_head`（营业执照）/`form.pic_cont`（负责人证件照），不再跟个人身份证的 `pic_id`/`pic_back` 混用
- **`chooseImage()` 补上 base64 转换**：`uni.chooseImage` → `uni.getImageInfo` → `pathToBase64`（`image-tools` 包），对齐 `pages/my/pohead.vue` 头像上传已验证过的写法；此前只是把本地临时文件路径原样存进表单，后端永远识别不出来
- **读取回填对齐后端真实字段**：账号类型从 `data.ac_type`（0=个人/其余=企业）换算；证件号码按当前账号类型分别读 `data.idcard`（个人身份证号）或 `data.licence_no`（企业营业执照号，新字段）；联系电话从 `data.maphone` 读取
- **提交参数补上 `pic_head`/`pic_cont`**，与个人的 `pic_id`/`pic_back` 一样经过 `isValidImage()` 判断后再提交

**后端配合**（`yilan` 仓库）：`Inter/Users::updates()` 新增 `accountType`/`idCardOrLicence`/`contactPhone` 到真实列名的映射、四张证件照改为按需处理（未提交的字段不再被无条件置空）、图片格式判断新增支持 `png`；`users` 表新增 `licence_no` 列，`nickname`/`street` 顺带放宽长度限制。详见 `yilan` 仓库 `docs/2026-09-changelog.md` 第四节、`docs/2026-09-migration.sql`。

---

## 七、新增功能：意见反馈完整闭环

**背景**：审查发现"设置"页的"意见反馈"入口，从跳转到提交到后端存储，全链路三处断点：
1. `pages/my/setindex/setindex.vue` 的 `gotoFeedback()` 跳转到 `/pages/my/setindex/feedback`（不存在的路径，代码注释自己写着"预留路径"），实际注册页面是 `/pages/my/setindex/setfeedback`
2. `pages/my/setindex/setfeedback.vue` 提交调用 `this.$api.feedbackAdd(...)`，但 `library/api.js` 里根本没有这个方法，点提交会同步抛 `TypeError`，`uni.showLoading` 永远不会关闭
3. 后端（`App/Home`、`App/Inter`）、数据库全项目搜索，无任何相关代码/表

**改动**：
- **`library/api.js`**：新增 `feedbackAdd(data)`（`Users/feedbackAdd`）、`feedbackList(data)`（`Users/feedbackList`）
- **`pages/my/setindex/setindex.vue`**：`gotoFeedback()` 跳转路径修正为 `/pages/my/setindex/setfeedback`，顺带清掉"预留路径"的过期注释
- **`pages/my/setindex/setfeedback.vue`**：
  - 提交参数补上 `uid`（原来完全没传，后端现在也会因缺 `uid` 拒绝提交）
  - 新增"我的反馈记录"列表区：`onLoad` 时拉取 `feedbackList`，展示每条反馈的内容、提交时间、状态徽章（待回复/已回复）；已回复的额外展示"客服回复：xxx"
  - 提交成功后不再自动跳转返回，而是清空输入框并刷新列表，让用户能立刻看到自己刚提交的这条记录

**后端配合**（`yilan` 仓库）：新增 `users_feedback` 表；`Inter/Users::feedbackAdd()`/`feedbackList()` 提供提交与查询；`Home/Users::feedback()`/`feedback_reply()` + 新增视图提供后台查看与回复，入口在"用户管理"→"用户反馈"。详见 `yilan` 仓库 `docs/2026-09-changelog.md` 第五节、`docs/2026-09-migration.sql`。

**验证**：本地起服务后用 `curl` 跑通了提交 → 查询 → （手动模拟后台回复）→ 再查询确认回复生效的完整链路。上线后用户在真实登录会话里打开后台列表页时暴露了两处模板语法错误（`eq` 用在裸 `{...}` 表达式里、`htmlspecialchars,###` 缺 `=`），已在 `yilan` 仓库修复，详见该仓库 `docs/2026-09-changelog.md` 第五节。

---

## 八、新增功能：报价单常用单位/备注模板改为后端存储

**文件**：`pages/report/repinfos.vue`、`library/api.js`

**背景**：报价单详情页的"选择报价单位""选择询价单位""选择与管理模板"三个入口，排查发现"选中的值"本来就有正确落库（走 `reportNewChange()` → `report_temp.rep_comp`/`question_comp`/`tags`），但"选择"背后的常用单位库/模板库本身完全是 `uni.setStorageSync` 本地缓存（`local_rep_comp_list_<uid>`、`local_quick_remark_templates_<uid>`），换设备、清缓存就丢，服务端也看不到。另外原来"报价单位"和"询价单位"共用同一份本地列表，本次按需求方要求拆成两份独立列表，三者共用同一张新建的后端表 `report_quick_list`（`type` 区分：1=报价单位 2=询价单位 3=备注模板）。

**改动**：
- `library/api.js`：新增 `reportQuickList`/`reportQuickAdd`/`reportQuickDel`
- `data()`：`repCompList`（原报价/询价单位共用一份）拆成 `repCompListRep`/`repCompListQuestion` 两个独立数组；`quickTemplates` 保留原名，但元素从纯字符串改为 `{id, content}` 对象
- 新增 `computed.currentRepCompList`：按当前 `repCompTarget`（'rep'/'question'）返回对应的单位列表，弹窗模板统一绑定这一个计算属性，不用在模板里写三元判断
- `loadLocalQuickTemplates`/`saveLocalQuickTemplates`/`loadLocalRepComps`/`saveLocalRepComps` 整组本地存储方法删除，改为 `loadQuickTemplates()`（对应 type=3）、`loadRepCompList(type)`（type=1/2 分别加载两份列表），新增/删除操作都改为调用对应的 `reportQuickAdd`/`reportQuickDel` 后重新拉取列表
- 列表渲染的 `:key` 和删除操作从数组下标（`idx`）改为后端返回的真实 `id`，避免列表变动后下标错位删错项
- 不再像本地版本那样在列表为空时自动塞几条示例文案（"某某电缆销售有限公司"之类），交由用户自己录入真实数据

**后端配合**（`yilan` 仓库）：新增 `report_quick_list` 表；`Inter/ReportNew::quickList()`/`quickAdd()`/`quickDel()` 提供增删查，删除时校验 `uid` 防止越权。详见 `yilan` 仓库 `docs/2026-09-changelog.md` 第六节、`docs/2026-09-migration.sql`。

---

## 九、商品"单品备注"打通报价单/购物车/购买中心/订单详情/订单管理

**背景**：`shop_lists.vue` 商品详情弹窗的"单品备注"，提交时一直都带着 `item_remark` 参数，但排查发现只有"加入购物车"链路的**展示代码**提前写好了，数据链路本身在后端完全没打通。

**结论——三个 App 端展示页面本次全部无需改动**：
- `pages/cart/cart.vue`
- `pages/cart/confirm.vue`（"购买中心"结算页）
- `pages/my/order/infos.vue`（订单详情）

这三个页面早就写好了 `v-if="x.remark || ..."` 这样"有则显示、无则自动隐藏"的条件展示代码（部分还带了 `x.list.remark`/`x.memo` 等兜底字段名），只是后端 `carts`/`orders_goods` 两张表之前根本没有 `remark` 字段，数据一直是空的，显示逻辑虽然写好了但从没真正触发过。本次后端补上字段和写入逻辑后，这三处会自动生效，不需要动前端代码。

**唯一需要改的前端文件**：`pages/report/repinfos.vue`（报价单详情页）——这是当前会话审查过的四个相关页面里，**唯一一个完全没有单品备注展示代码**的页面，新增了一个条件展示行：

```html
<view class="item-remark-row" v-if="item.remark" @click="openDetailModalConditionally('单品备注全称', item.remark, $event)">
    <text class="attr-label">单品备注：</text>
    <text class="attr-val ellipsis-text remark-text-styled">{{ item.remark }}</text>
</view>
```

配套新增了 `.item-remark-row`/`.remark-text-styled` 的 scoped 样式（浅黄底色提示条，风格与该页面其他卡片一致）。

**后端配合**（`yilan` 仓库）：`report`/`carts`/`orders_goods` 打通 `remark` 字段的写入与读取；顺带修复了三个独立的、跟本次需求无关但排查/联调过程中必现触发的预置崩溃 bug——"加入报价单"和"购物车列表"接口在严格模式 MySQL 下的 `GROUP BY` 语法错误，以及 ThinkPHP `insertAll()` 处理 NULL 值的框架级缺陷（批量创建订单商品行时，新旧数据混合会导致列数不匹配崩溃）。详见 `yilan` 仓库 `docs/2026-09-changelog.md` 第七节、`docs/2026-09-migration.sql` 第四节。

**验证**：本地起服务后用 `curl` 完整跑通了"加入报价单→查询报价单列表看到备注"、"加入购物车→查询购物车列表看到备注"、"结算创建订单→查询订单详情看到备注"三条链路，并核对了无备注商品行正确返回空字符串（不是 `null` 也不是空格）。

---

## 十、后端修复：点击"立即生成报价单"必现崩溃

**文件**：无前端改动，纯后端问题

**现象**：`repinfos.vue` 点击"立即生成报价单"（`apply()` 方法）必现报错 `time() expects exactly 0 arguments, 1 given`。

**根因**：跟 8 月已修复过的 `Home/CoreController::edits()` 那次是完全相同的根因（ThinkPHP 的 `_auto` 自动填充规则遇到提交数据里已经带了同名字段的值时，会把这个值当参数传给填充函数，PHP 8 下 `time($已有值)` 直接报错），只是这次是 `Inter` 端一个完全独立的代码路径（`ReportNewController::lists_add()`）踩了同一个坑，8 月的修复范围没有覆盖到这里。前端代码完全没有问题，`apply()` 提交的参数是正常的。

**修复**：`yilan` 仓库后端一处改动，详见该仓库 `docs/2026-09-changelog.md` 第八节。

**验证**：本地起服务后用 `curl` 完整模拟了 `apply()` 实际提交的参数集，确认 `ReportNew/lists_add` 正常返回成功，DB 里核实了报价单正确生成、草稿数据正确清空。

---

## 十一、修复：购物车"清空"误删其他税率分组商品

**文件**：`pages/cart/cart.vue`

**背景**：购物车页面按发票税率分成"不含发票/普通发票/专用发票"三个 tab。排查发现"全选"（`toggleSelectAll()`）本来就只对当前 tab 拉到的 `this.list` 操作，逻辑没问题；但"清空"按钮调用 `$api.cartclear({ uid: that.uid })` 时根本没带 `ticket` 参数，后端也是无条件按 `uid` 删除全部购物车行——在任意一个税率 tab 点"清空"，会把另外两个税率分组的商品也一起删掉。

**改动**：`clear()` 调用 `cartclear` 时补上 `ticket: that.ticket`（当前 tab 对应的税率），确认弹窗文案同步改为"确定要清空当前分类下的购物车商品吗？"，避免用户误以为会清空全部购物车。

**后端配合**（`yilan` 仓库）：`Inter/Carts::cartclear()` 新增按 `ticket` 过滤的能力，不传时保持原有全清空行为。详见 `yilan` 仓库 `docs/2026-09-changelog.md` 第九节。

**未改动、留待确认**：购物车勾选商品时（包括这次的"全选"），后端有一条既有规则——选中当前税率分组的商品会自动取消勾选其他税率分组已选中的商品，让"待结算"状态同一时间只能属于一个税率分组。这次判断这是独立于"清空误删数据"的另一个问题（一个是删数据，一个是改选中状态），没有一并改动。如果这也是你想要修的"不影响其他税率数据"的一部分，需要单独确认，因为这条规则背后跟"报价单/订单只能单一税率结算"的约束是绑定的，改动影响面更大。

**验证**：本地起服务后用 `curl` 分别在两个税率分组下各加一条测试商品，验证带 `ticket` 参数清空只删对应分组、另一分组商品原样保留。

---

## 十二、后端修复：购物车同规格换税率添加会顶替已有记录

**文件**：无前端改动，纯后端问题（前端 `shop_lists.vue` 加购时本来就正确传了 `ticket` 参数）

**现象**：同一个商品规格先按"不含发票"加 500 米，再按"专用发票"加 300 米，购物车里不会变成两条独立记录，而是同一条记录被顶替——税率、税点都被改成后一次的值，数量变成 800，原来那 500 米按"不含发票"的价格和税务归属直接消失。

**根因**：`CartsOpera::checkIsInfo()` 判断"购物车里是否已有这一行"时，没有把 `ticket`（税率/发票类型）算进匹配条件，只要商品规格一样就会被判定成同一行，直接数量相加、税率覆盖。

**修复**：`yilan` 仓库后端一处改动——把 `ticket` 也纳入购物车行的识别维度，详见该仓库 `docs/2026-09-changelog.md` 第十节。跟已有的"同一时间只能有一个税率分组处于待结算勾选状态"规则会有交互（新加的另一税率记录会被自动取消勾选，但不会被删除/覆盖），已跟用户确认可以接受。

**验证**：本地起服务后用 `curl` 完整跑了"加 500 米不含发票→加 300 米专票（生成独立新记录，原记录数据保留只是取消勾选）→再加 200 米不含发票（正确合并回原记录，没有误合并进专票那条）"三步。

---

## 十三、购物车单品备注展示位置调整

**文件**：`pages/cart/cart.vue`

**背景**：第九节里"单品备注"的展示代码原本嵌在商品规格双列网格（`spec-grid-box-double`）内部，跟型号/规格/单价混在一起。用户要求把它挪到"调整数量"那一行的虚线分割线（`.card-nums-lower-row` 的 `border-top: dashed`）上方，单独占一行。

**改动**：把这段条件展示代码从规格网格内部搬到 `.card-main-content` 和 `.card-nums-lower-row` 之间，作为独立一行；沿用原来的 `v-if="x.remark || x.list.remark || x.memo"` 判断（有值才渲染，无值不留空白），样式复用已有的 `.spec-grid-item`/`.font-remark`，新增 `.cart-item-remark-row` 只加了一点上边距。只涉及标准电缆商品卡片（`x.types=='0'`）这一种卡片布局，多规格组合商品卡片（`x.types=='1'`）没有"调整数量+虚线"这种结构，其备注展示位置未改动。

---

## 十四、结算中心页客服电话补齐用户等级配置

**文件**：`pages/cart/confirm.vue`

**背景**：延续第五节"客服电话来源统一改为用户等级配置"——排查发现"结算中心"页（下单确认页）顶部"客服电话"按钮弹出的弹窗里，号码和拨打逻辑都还是写死的固定号码 `18883333289`（弹窗文案展示一处、`makePhoneCall()` 拨号一处），没有被第五节那次覆盖到。

**改动**：
- 弹窗里的号码展示改为 `{{ ulevel && ulevel.tel ? ulevel.tel : '暂无客服电话' }}`
- `makePhoneCall()` 改读 `this.ulevel.tel`，为空时提示"暂无客服电话"而不是拨空号

**说明**：本页 `doIninit()` 本来就调用 `$api.Carts()`（跟购物车页、结算页同一个接口）并把 `ret.data.ulevel` 存到 `this.ulevel`，页面一加载就有这份数据，本次不需要新增接口调用，只是把写死的号码换成读现成的字段。

---

## 十五、修复：开屏视频播放死循环，视频广告实际上从未能播放过

**文件**：`pages/welcome/welcome.vue`

> 对应后端排查：见 `yilan` 仓库 [`docs/2026-09-16-changelog.md`](../../yilan/docs/2026-09-16-changelog.md)（后台上传功能的参数缺陷修复、本地环境缺失上传目录、清理两条文件已丢失的历史广告记录）

**现象**：后台"开屏广告管理"成功配置了一条真实视频广告、接口也正确返回了视频信息之后，App 端开屏页访问一直是纯黑屏，没有任何内容，也不会自动跳过进首页。

**根因**：
```html
<!-- 修复前 -->
<div class="loadheight fade-in-container" v-if="resourceLoaded">
    <video ... @loadedmetadata="onVideoLoaded" ...>
```
整个内容容器（包括 `<video>` 标签本身）被 `v-if="resourceLoaded"` 包住，而 `resourceLoaded` 初始为 `false`，只有在 `onVideoLoaded()`（绑定在 `<video>` 的 `@loadedmetadata` 事件上）里才会被置为 `true`。也就是说：**`<video>` 标签要等 `resourceLoaded=true` 才会被创建，`resourceLoaded` 又只能靠 `<video>` 自己触发的加载事件才能变 true**——这是一个无法自解的死循环，视频类型的开屏广告从功能设计上就永远无法播放。

图片类型之所以一直正常，是因为 `init()` 里图片分支会提前手动设置 `this.resourceLoaded = true`，绕开了这个死锁；视频分支从来没有类似的兜底代码。这是"开屏广告支持视频"功能自上线起就存在的 bug，此前从未被发现，是因为一直没有一个真实可用的视频完整走通过这条链路做端到端验证——本次是第一次。

**修复**：
1. 容器改成用 `v-if="info.url"` 控制渲染（视频/图片标签只要拿到地址就立即创建、开始加载），不再依赖 `resourceLoaded`。
2. `resourceLoaded` 改为只控制淡入动画（`fade-in-container` class）和"跳过/声音开关"按钮的显示时机，不再控制媒体元素本身是否存在。
3. CSS 给 `.loadheight` 容器默认 `opacity: 0`：资源没准备好时视觉上仍是黑屏（跟修复前观感一致），但视频这时已经在后台真实开始加载，一旦 `loadedmetadata` 触发、`resourceLoaded` 变 true，容器才淡入显示。
4. 新增视频的 `@error` 处理（`onVideoError()`）：视频真的加载失败（网络/编码问题等）时直接调用 `doJump()` 跳过进首页，而不是无限卡在黑屏——这个异常兜底此前完全缺失，图片分支已有对应的 `onImageError()`，视频分支之前是漏掉的。

**验证**：本地 HBuilderX 的 uniapp-cli H5 开发服务器支持热更新，改动应已自动生效；由于当前没有可用的浏览器自动化工具，视频自动播放、静音切换、倒计时、播完跳转等实际播放效果需要用户在浏览器/真机里肉眼确认，本次仅完成代码逻辑修复与静态验证。

---

## 十六、开屏视频深度排查：本地缓存池方案 + 真正病根是原生 logo 页关闭时机不稳定

**文件**：`pages/welcome/welcome.vue`

**背景**：第十五节的死循环修复上线后，用户真机测试反馈"loading 转圈几秒钟后直接进首页，没有任何错误提示"，怀疑是视频太大下载超时。围绕这个现象做了多轮真机排查，中间走了几个弯路，最终定位到的根因跟最初任何一个猜测都不一样。排查过程中依次验证/排除了以下假设：

1. **后台视频地址是 http 明文、被 Android 9+ 默认阻止**——排查后确认后台配置的是 https，排除。
2. **首次下载慢导致黑屏**——针对这个确认过的真实问题，把开屏方案从"每次现场请求+下载"改成**本地缓存池方案**：
   - 本地缓存池（`uni.saveFile` 持久化 + `uni.setStorageSync('ads_cache_meta_v1', ...)` 记录清单）里一条能播的素材都没有（真正首次启动，或缓存被清空）→ 不放广告、直接跳首页，同时后台异步把后台配置的**全部**广告素材下载缓存到本地（不再只预取没选中的那条）
   - 本地已有缓存 → 直接从本地缓存池选一条本地文件播放，不经过任何网络请求，同时后台异步跟后台数据做增量校准（新增的补下载、已下架的清理本地文件）
   - 后续应用户要求，选片策略从随机改成**按 id 从小到大顺序播放**（`pickNextInOrder()`，用 `uni.setStorageSync('ads_last_played_id_v1', ...)` 记住上次播放的 id，轮到最后一个后回到最小 id 重新开始），保留至今，主要目的是让"哪个素材在播"更可预测，方便后续如果再复现问题时定位。
3. **声音开关/跳过按钮不显示**——原因是这两个按钮用的是普通 `view`，而 App 端 `<video>` 是覆盖在 WebView 之上的原生组件，普通 view 无论 z-index 多高都会被原生视频盖住。改成 `cover-view`（专门用于覆盖原生组件的 uni-app 组件）后仍不显示，进一步发现 `cover-view` 内部**不支持嵌套 `<text>` 组件**（文字渲染不出来，只有背景可见），去掉 `<text>` 包裹、文字直接写在 `cover-view` 里才彻底解决。
4. **`@loadedmetadata` 在部分机型上不触发**——即使视频确实在正常播放，这个事件也可能不来，导致依赖它判断"资源就绪"的按钮/倒计时永远出不来。改成 `@loadedmetadata` + `@timeupdate`（`currentTime` 真实前进超过 0.2 秒才采信，过滤掉个别机型上 `currentTime` 接近 0 的假阳性首个 tick）双重信号，外加一个 3 秒硬兜底超时（万一两个事件都不触发，强制放行，避免用户被无限卡住）。
5. **两次没有命中根因的中间尝试**（已回退，记录下来避免以后重复踩坑）：
   - 怀疑视频在"看不见的时间里偷跑了几秒"、画面一出来就是中间位置，加过 `videoContext.seek(0)` 把播放位置拉回开头——事后验证这不是真正原因，已移除。
   - 怀疑同样的"偷跑"问题，改用全屏不透明 `cover-view` 遮罩盖住视频直到就绪——结果这个遮罩本身让问题从"偶发"变成了**100% 必现**的长时间卡顿，推测是 Android 系统对判定为"完全遮挡"的视频原生渲染层（SurfaceView）会主动限制/暂停硬件解码省电，遮挡越彻底解码限速越狠。已确认是这次改动本身引入的回归，随即移除，video 不再用任何方式遮挡，从渲染那一刻起就以完整不透明状态展示。

**真正的根因（借助 `adb logcat` 抓取真机原生日志定位）**：上述所有 JS 层面的修复都对症但没有找对病灶所在的层。用 `adb logcat` 抓取一次真实复现"长时间 loading"的完整原生日志后发现：

- 原生视频解码器（`IjkMediaPlayer`/`MediaCodec`）在四次测试启动里，**全部**在页面显示后 1.2~1.4 秒就成功开始渲染（`MEDIA_INFO_VIDEO_RENDERING_START`），包括被判定为"卡住"的那两次，解码链路本身从未变慢或失败过。
- 真正的差异在 `WebAppActivity`/`closeSplashScreen0`（DCloud 原生开屏 logo 页，由 `manifest.json` 里 `app-plus.splashscreen` 的 `alwaysShowBeforeRender`/`autoclose` 配置驱动）：这个原生 logo 页从创建到关闭的耗时**不稳定**，正常时 1.4~1.5 秒，异常时能拖到 7~10+ 秒——而 `alwaysShowBeforeRender: true` 依赖 uni-app 原生运行时自己探测"页面渲染完成"来决定何时关闭这个 logo 页，这套探测本身不可靠。也就是说：**视频其实全程都在原生 logo 页背后正常解码播放，用户看到的"一直 loading"其实是这个原生 logo 页迟迟不关闭**，跟 `welcome.vue` 自己的任何 JS 逻辑都没有关系，前面几轮所有的事件/按钮/遮罩修复都是在修一个本来就没坏的地方。

**修复**：`onLoad()` 里页面一加载就主动调用 `plus.navigator.closeSplashscreen()`（`// #ifdef APP-PLUS` 包裹，H5 端不执行），不再依赖运行时自己的自动探测，行为变成确定性的、立即关闭。

**其他保留的改动**：
- `onUnload()` 新增防御性释放：页面正常离开（划掉 App、正常跳转等走完整生命周期的场景）时尝试 `videoContext.pause()`，帮助系统更快回收硬件解码器资源；对真正被系统强杀（跳过生命周期钩子）的情况无法生效，只能靠系统自己回收。
- `onVideoError()` 保留用户可见的错误 toast（"视频加载失败：xxx"，2 秒后自动跳首页），这是应用户明确要求加的——原来的死循环修复只做到"不再卡死"，没有做到"失败时让用户/开发者看得见发生了什么"。

**排查方法论记录**：这轮排查的关键转折点是从"继续在 JS 层面猜测、加日志 toast"切换到"用 `adb logcat` 直接看 Android 原生系统日志"。前几轮所有基于 toast/console.log 的诊断都只能看到 WebView JS 层面的事件是否触发，看不到原生开屏 logo 页、原生视频解码器这些更底层组件的真实状态；真正定位到病灶靠的是对照"卡住"和"正常"几次启动的原生日志时间戳差异，而不是继续猜 JS 事件。

**验证**：`node -e` 静态语法检查通过（每一轮改动都做过）；`adb logcat` 实测确认根因；用户真机多轮验证确认原生 logo 页能稳定立即关闭、不再出现时长时短的"loading"。**本次未涉及任何后端/数据库改动**，纯前端 + uni-app 原生 API 调用，无需配套 SQL。

---

## 十七、新增功能：开屏视频"默认播放声音"改为读后台配置

**文件**：`pages/welcome/welcome.vue`

**背景**：开屏视频是否默认有声音播放，之前是写死在代码里的（App 端默认开声音，H5 端默认静音），改成由后台"广告管理"页（`Home/Know/advs.html`）配置一个全局开关，App 冷启动时动态读取。

**改动**：
- 新增 `loadDefaultMuted()`/`saveDefaultMuted(muted)`：把后台配置的默认声音状态缓存到本地（`uni.setStorageSync('ads_default_muted_v1', ...)`），没缓存过时保守地默认静音
- `onLoad()`：App 端不再写死 `this.isMuted = false`，改成读 `this.loadDefaultMuted()`
- `syncAndCacheAll()`：`load_banner()` 接口返回的 `defaultMuted` 字段顺带缓存下来，供下一次启动使用

**架构细节要注意**：现在的开屏是"本地缓存池，下次启动播上次缓存好的素材"，播放那一刻不一定发起了网络请求，所以拿到的后台配置得跟着缓存一起存到本地，不能指望每次播放前都能现场请求到最新值。H5 端每次都现场请求（`initH5Fallback()`），本来就能拿到最新值，但**保持原有静音默认不变**——这个需求原文只针对 App 端，H5 浏览器的自动播放策略本来就会强制静音，改了也没意义。

**后端配合**（`yilan` 仓库）：复用 `sysconfig` 通用配置表新增一行（`id=5`），`Home/Know/advs.html` 广告管理页新增开关控件，`Inter/IndexController::load_banner()` 返回结果新增 `defaultMuted` 字段。详见 `yilan` 仓库 `docs/2026-09-changelog.md`"📅 2026-09-27"批次第二节、`docs/2026-09-migration.sql`。

**验证**：`node -e` 静态语法检查通过；`curl` 直接测本地 `load_banner.html` 确认返回体里带上了 `defaultMuted:false`（对应后台当前配置"默认开声音"）。**未做真机实测**——建议上线前实际去后台切一下这个开关，确认 App 下次启动播放本地缓存素材时声音状态跟着变化。

---

## 十八、新增功能：接入阿里云验证码2.0 + 注册手机号姓名实名核验

**背景**：登录/注册/找回密码/注销账号四处"获取验证码"入口，之前没有任何人机校验；注册流程新增手机号+姓名二要素实名核验（严格模式，不一致直接拒绝注册）。后端配合详见 `yilan` 仓库 `docs/2026-09-changelog.md`"📅 2026-09-27"批次第四、五节。

**新增文件**：`mixins/captcha.js`——封装阿里云验证码 Web JS SDK 的动态加载、弹出式初始化、`requestCaptchaVerify()` 统一入口（返回 `Promise<captchaVerifyParam>`）。阿里云 SDK 是"绑定在一个真实按钮上，点击才弹出验证"的模式，没有"直接调用拿结果"的简单接口，这里用一个业务页面看不到的隐藏按钮承接 SDK 绑定：业务按钮自己的手机号/倒计时校验先跑，通过后再用 JS 程序化点击隐藏按钮触发验证码流程，两边互不干扰、原有校验逻辑完全不变。App 端（5+ Runtime WebView 渲染）和 H5 端页面本身就有 `window`/`document`，方案两端通用。

**4 个页面接入同一套模式**（`getCodes()`/`sendDelCode()` 改成 `async`，在"倒计时校验通过"和"调用 `getSmsCode`"之间插入 `await this.requestCaptchaVerify()`，拿到的 `captchaVerifyParam` 随手机号一起传给后端）：
- `pages/login_md/login.vue`
- `pages/login_md/regirest.vue`
- `pages/login_md/passwd.vue`
- `pages/my/setindex/setindex.vue`（`sendDelCode()`，注销账号二次确认）

**注册页配合实名核验的改动**（`pages/login_md/regirest.vue`）：
- "用户姓名"字段占位文案从"请输入您的名称"改成"请输入手机号实名登记的真实姓名"，明确要求，避免用户以为是填个昵称
- **顺带修了一个预置 bug**：`doRegist()` 的注册失败回调 `.catch(err => {})` 原来是空的，不管什么原因失败用户都看不到任何提示——这次新加的后端实名核验拒绝提示要能展示给用户，必须先把这个空回调补上，改成 `uni.showToast(err.msg)`

**验证**：语法检查（`node -e` 剥离条件编译后重新验证）全部通过；`setindex.vue` 编辑时触发过一次"重复声明 `system`"的误报，是文件里已有的 `#ifdef APP-IOS`/`#ifdef APP-ANDROID` 互斥分支导致，跟本次改动无关，剥离条件编译分支后确认无误。**未做真机/浏览器完整交互实测**——建议先在 `login.vue` 一个页面上完整点一遍"获取验证码"确认弹窗/无痕验证正常，再确认其它三处；注册页建议用真实姓名手机号测一次"核验通过、注册成功"路径，再用不匹配的信息测一次"核验拒绝、能看到提示"路径。

---

## 十九、新增功能：发票资料提交接入企业二要素核验

**文件**：`pages/my/tiindex/tiadds.vue`

**背景**：发票资料提交（新增/编辑都走同一个后端接口 `Users::ticket_addon()`，编辑页 `tiedit.vue` 复用同一个接口，自动一并覆盖）新增企业名称+统一社会信用代码的实名核验，不一致直接拒绝提交。后端配合详见 `yilan` 仓库 `docs/2026-09-changelog.md`"📅 2026-09-28"批次第一节。

**改动**：
- **顺带修了一个跟 regirest.vue 同款的预置 bug**：`apply()` 提交失败的回调 `.catch(err => { uni.hideLoading(); })` 原来只关 loading，不展示任何错误信息——这次后端给的拒绝提示是两行文案（"填写的【企业名称】或【信用代码】有误" + "为了更准确的为您开具相关发票，请核对后重新填写提交信息"），改用 `uni.showModal` 展示（不用 `showToast`，两行文案用 toast 容易显示不全/一闪而过，`showModal` 更适合需要用户看清楚的多行提示）

**验证**：`node -e` 静态语法检查通过。**未做真机/浏览器完整交互实测**——建议用真实、能匹配的企业名称+信用代码测一次"核验通过、提交成功"路径，再用不匹配的信息测一次"核验拒绝、弹窗能看清两行提示文案"路径。

---

## 二十、修复：【新增地址】/【修改地址】选了地区保存不上（后端修复，前端未改动）

**涉及页面**：`pages/my/adindex/adadds.vue`、`adedit.vue`、`adindex.vue`（**本次均未改动代码**，记在这里是因为问题是从 App 端发现的，且前端的数据形态是定位根因的关键）

**现象**：地区选择器选好"四川/成都/武侯区"，点保存提示成功，但列表和编辑页里省市区都是空的，只有手填的"详细地址"存住了。

**根因在后端**：前端 `confirmRegion()` 提交的是**名称字符串**（`e.province.label` = `"四川"`），而 `users_addr.prov/city/label` 三列是 int、存的是 `sysregion.id`。MySQL 非严格模式下往 int 列写非数字字符串会**静默截断成 0**，所以接口返回 `status:1`、前端拿不到任何错误信号，地区却实实在在丢了。`street` 是 varchar 不受影响，正好把问题伪装成"只有地区存不上"。

**修复方式**：后端 `Users::uaddr_addon()`/`uaddr_edits()` 写库前把地区字段统一归一化成 `sysregion.id`，`uaddr_info()` 回显时再反查回名称字符串。**前端一行代码没动**，`adedit.vue` 里 `that.prov = info.prov` 拿到的从数字变成了名称，模板里原有的 `v-if="prov && prov != 0"` 判断对空字符串一样成立，展示逻辑不受影响。详见 `yilan` 仓库 `docs/2026-09-changelog.md`"📅 2026-09-28"批次第三节。

**值得前端注意的一点**：排查时发现 `uaddr_edits` 这个接口有**两个调用方、提交的数据形态完全不一样**——

- `adedit.vue`（编辑页）提交的是**名称**（来自地区选择器）
- `adindex.vue::setDefault()`（列表页"设为默认"）提交的是**数字 ID**（把 `uaddr_list` 返回的 `item.prov` 原样回传，而列表接口里 `prov` 是原始 id，名称是另挂的 `p_name`/`c_name`/`l_name`）

后端第一版修复没考虑这一支，差点导致"每点一次设为默认就把地区抹掉一次"，已加数字判断兼容。**后续如果要动这几个页面，注意别让同一个接口的入参类型继续混着用**——更彻底的做法是让 `setDefault()` 也改传名称（或者后端另开一个只收 `ids`+`def` 的轻接口），本次为了不扩大改动范围没做。

**验证**：后端做了四条路径的实测（新增/编辑/设为默认/回显，均通过，见后端 changelog 的表格）。**前端未做真机实测**，建议在 App 上走一遍"新增地址选地区 → 列表看展示 → 进编辑页看地区是否带出来 → 点设为默认再看地区还在不在"。

---

## 二十一、文件变更清单

| 文件 | 状态 | 变更内容 |
|---|---|---|
| （36 个页面/组件 + 新增文件，见第二节） | 已提交 `cf7f0fd` | UI 改版批量合入 |
| `config/publicConfig.js` | 未提交 | 接口地址本地/线上切换 |
| `pages/shops/shop_lists.vue` | 未提交 | 标准/类型二级联动、客服电话改用等级配置 |
| `pages/my/my.vue` | 未提交 | 联系客服电话改用等级配置 |
| `pages/poindex/poindex.vue` | 未提交 | 账号类型/证件号码/联系电话字段修复、企业证件照绑定修正、图片上传补 base64 转换 |
| `library/api.js` | 未提交 | 新增 `feedbackAdd`/`feedbackList`/`reportQuickList`/`reportQuickAdd`/`reportQuickDel` |
| `pages/my/setindex/setindex.vue` | 未提交 | 修正"意见反馈"跳转路径；接入验证码2.0（`sendDelCode()`，见第十八节） |
| `pages/my/setindex/setfeedback.vue` | 未提交 | 提交补 `uid`、新增反馈记录+回复展示 |
| `pages/report/repinfos.vue` | 未提交 | 常用单位/模板库改为后端存储，报价/询价单位库拆分为独立列表；新增单品备注条件展示行 |
| `pages/cart/cart.vue` | 未提交 | `clear()` 补 `ticket` 参数，避免清空误删其他税率分组商品；单品备注展示移到调整数量行的虚线上方 |
| `pages/cart/confirm.vue` | 未提交 | 客服电话弹窗改读 `ulevel.tel`，不再写死固定号码 |
| `pages/welcome/welcome.vue` | 未提交 | 修复开屏视频播放死循环（第十五节）；本地缓存池方案、按 id 顺序播放、cover-view 按钮修复、主动关闭原生 logo 页等深度排查修复（第十六节）；默认声音改为读后台配置（第十七节） |
| `mixins/captcha.js` | 新增，未提交 | 阿里云验证码2.0 Web JS SDK 公共封装（见第十八节） |
| `pages/login_md/login.vue` | 未提交 | 接入验证码2.0（见第十八节） |
| `pages/login_md/passwd.vue` | 未提交 | 接入验证码2.0（见第十八节） |
| `pages/login_md/regirest.vue` | 未提交 | 接入验证码2.0；配合注册实名核验改占位文案；补上注册失败提示（见第十八节） |
| `pages/my/tiindex/tiadds.vue` | 未提交 | 配合企业二要素核验，补上提交失败弹窗提示（见第十九节） |
| `docs/2026-09-changelog.md` | 新增/追加（本文件） | — |

---

## 二十二、已知问题 / 待确认事项

1. `pages/my/setindex/setcuetom.vue`（客服中心页）仍是全站统一客服号码，未接入用户等级——如需要也统一改口径需另行确认
2. `users_level` 里"亚建出厂价"等级的 `tel` 与 `type1~type10` 全部为空，该等级用户目前会看到"没有任何标准"筛选项 + "暂无客服电话"提示
3. 证件号码（身份证号/营业执照号）目前前后端均未做格式校验，纯文本直存
4. `nickname`（单位名称/用户姓名共用同一列）与 `users.name`（姓名，未使用）字段语义有一定重叠，本次未做调整
5. 意见反馈没有做提交频率限制，同一账号理论上可无限次提交
6. 后台"用户反馈"列表页最初的模板语法问题已修复，但只经过一次真实登录会话验证，不排除还有未触发到的边界情况
7. 常用单位/备注模板库没有做数量上限和去重，理论上可以无限堆积重复内容
8. 后台"订单管理"详情页的单品备注展示因管理员登录态限制未做真实浏览器验证，只做了后端 API 层验证 + 模板语法比对
9. ThinkPHP `insertAll()` 的 NULL 值缺陷只在订单创建这一处做了防御，项目里其他批量插入调用点是否有同样风险尚未排查
10. 购物车"选中会取消其他税率分组勾选状态"的既有规则本次未改动，如果用户反馈的"不影响其他税率数据"也包含这一点，需要单独确认后再改（涉及报价单/订单单一税率结算的约束）
11. 开屏视频问题（第十五、十六节）已经过多轮真机验证，真正病根（原生 logo 页关闭时机不稳定）已确认修复；视频加载失败时的兜底仍是直接跳过进首页，没有重试或降级展示默认图片，是否需要更完善的降级策略需要业务确认
12. 本地缓存池方案（第十六节）目前没有对已下载素材做文件完整性校验（依赖 `uni.downloadFile` 的 `success` 回调等同于"下载完整"这个平台约定），也没有对缓存目录设置总大小上限，理论上后台配置的广告素材数量/体积持续增长时，本地存储占用会无限累积
13. `onUnload()` 的防御性视频资源释放只覆盖走正常生命周期的场景（划掉 App、正常跳转），系统直接强杀进程时不会执行，属于已知的、无法从前端代码层面完全规避的限制
14. 验证码 `prefix` 缺失及 H5 初始化问题已于 2026-09-29 修复，配置为 `nh4pu2`；真实验证码及短信发送尚未端到端验证，App 逻辑层接入仍需单独适配，详见后续补充记录。
15. 验证码2.0弹窗在浏览器环境测试时可能受"域名白名单未授权"（阿里云场景通常绑定允许调用的域名）或"接口跨域 CORS"限制，本机/局域网测试地址如果没有加入白名单会表现为弹窗加载不出来或调用失败，不代表代码有问题
16. 注册页"姓名+手机号实名核验"目前只验证过"核验被拒绝"这一条路径（后端 API 层 + 一次真实请求），**没有验证过"姓名手机号匹配、核验通过、正常注册成功"这条路径**，上线前必须用真实、能匹配的手机号+姓名测一次
17. `App/Common/Common/function.php::uploadFile()` 根目录不存在时不会自动创建（yilan 后端，见 [`docs/2026-09-16-changelog.md`](../../yilan/docs/2026-09-16-changelog.md) 第七节），本次只手动补齐了本地环境缺失的 6 个上传目录，其它环境如果也缺目录会复现同样的报错链路
18. 发票资料"企业二要素核验"（第十九节）同样**没有真实企业数据验证过"核验通过、提交成功"路径**，只测过拒绝路径；后端那边也发现过一次"文档说的是字符串、实测是布尔值"的字段类型坑（已修复），如果以后这个接口的返回格式又变了，前端这边看到的现象会是"提交一直失败"，需要先去后端确认返回的原始 JSON 再排查
19. 地址地区修复（第二十节）只做了后端实测，**前端未做真机验证**；另外 `uaddr_edits` 同一个接口被两个调用方用两种入参类型调用（编辑页传名称、列表页"设为默认"传数字 ID）这个设计没改，后端靠 `is_numeric()` 兼容着，属于容易被后续改动踩到的隐患
20. 历史地址未批量改库。2026-09-29 已支持根据保留的区县/城市父级补齐详情回显；没有可用地区 ID 的记录仍需用户重新选择。前述 17 条为历史排查时统计值，并非当前实时数量。

---

## 📅 2026-09-29～2026-09-30：地址、验证码与企业发票资料修复补充

本节补充此前未记录的会话修改。前文为各批次历史记录；涉及地址“前端未修改”、验证码“App 与 H5 通用”及缺少 prefix 的旧描述，以本节为准。

### 一、地址地区保存和编辑回显（2026-09-29）

- `pages/my/adindex/adedit.vue`：地区选择器绑定 `default-region`，将接口返回的省市简称映射为 uView 完整名称；兼容北京、天津、上海、重庆的“市辖区”等第二级结构。匹配不到时返回空默认值，避免无效索引；补充保存失败提示，删除文件尾部多余的引用标记。
- `pages/my/adindex/adadds.vue`：新增失败显示后端错误，地区无法识别时用户可看到提示。
- 配套后端按行政层级和父级匹配名称，并从保留的区县 ID 补齐旧地址缺失省市的详情回显；不是批量修复数据库。
- 验证：本地地址 105 的真实详情接口返回“北京 / 北京 / 东城区”；四组选择器恢复测试及六组后端地区归一化测试通过。未完成浏览器交互及 App 真机验证。

### 二、首页第一张产品图片排查（2026-09-29，仅排查和方案）

当时前端请求 `app2.elccc.cn`，首页铜芯电力产品首项 ID 782 的 `source_url` 却指向 `app.elccc.cn/Public/uploads/ads/6abbd2a25542f.jpg`。实测 app 域名返回 404，app2 同名文件返回 200 / JPEG；第二张图片在 app 域名返回 200。

提出只调整 app2 部署配置中的 `WEBIMG` 为 `https://app2.elccc.cn/Public/uploads/`，保留承担其他用途的 `WEBURL`；发布前检查其他上传资源完整性。用户要求先给方案，因此未修改图片域名配置、首页代码或线上服务器。

### 三、验证码 prefix 与 H5 初始化修复（2026-09-29）

- `mixins/captcha.js`：配置 `region: 'cn', prefix: 'nh4pu2'`，保留场景 `1vbsr7hh`；以模块共享实例管理 DOM，消除通过 `this` 读取 Vue 下划线 data 属性导致的按钮 ID 问题。
- 增加 SDK 加载检查、15 秒加载超时、20 秒初始化超时；等待 `getInstance` 回调并预留 2.1 秒资源准备时间后触发按钮。页面 `onReady` 提前初始化，加载失败允许重试。
- 回调处理当前请求，修复重复获取仍绑定首次 Promise 的问题；拦截并发点击；单次请求 120 秒超时；页面隐藏/卸载时取消本页面未完成请求。服务端短信接口仍负责最终核验。
- `pages/login_md/login.vue`、`regirest.vue`、`passwd.vue`、`pages/my/setindex/setindex.vue`：展示具体异常消息，取消或重复点击不额外弹失败提示。涵盖登录、注册、找回密码、注销四个入口。
- 验证：JS 语法、差异空白检查及模拟测试通过，覆盖 prefix、DOM ID、就绪等待、防连点、连续两次验证、页面取消、初始化失败重试、超时及无 DOM 环境。没有真实发送短信，也未验证真实阿里云挑战成功流程。
- 限制：当前实现用于 Web/H5；uni-app App 逻辑层无 DOM，需要另行通过视图层或验证码页面适配。此次没有修改后端验证码逻辑。

### 四、企业发票资料查重、编辑和核验（2026-09-30）

**原因**：编辑页误调用 `ticket_addon`，且未传原记录 ID；列表只在 `onLoad` 加载，返回后显示旧内容；后端编辑接口缺少二要素核验。

| 文件 | 修改内容 |
|---|---|
| `library/api.js` | 新增 `ticket_edits()`，调用 `Users/ticket_edits.html` |
| `pages/my/tiindex/tiedit.vue` | 改调编辑接口并提交 `ids: tid`；保存期间禁用按钮、防连点；显示“核验并保存中”和后端失败原因 |
| `pages/my/tiindex/tiadds.vue` | 添加期间禁用按钮、防连点；显示“核验并保存中”；失败恢复提交状态并保留错误提示 |
| `pages/my/tiindex/tiindex.vue` | 在 `onShow` 重新加载列表，新增或修改后返回可看到最新资料 |

业务规则由后端执行：同一用户下相同企业名称不可重复添加，不按普票/专票分别放行；编辑排除自身，但不能改为该用户另一条资料的名称；历史同名记录保留原企业名称编辑时允许保存（见下方补充）。新增及每次编辑都先核验企业名称和信用代码，通过后才写入；失败保持原资料。不同用户可各自保存同一企业。

验证：前端模拟调用确认编辑接口与 ID 正确、防连点及列表刷新生效；配套后端七组模拟回归通过。真实企业二要素成功链路、浏览器完整交互及数据库并发场景尚未实测。

### 五、交付状态及现有改动覆盖

- 前后端代码写入本地工作区，未在此次操作中提交 Git 或部署线上。
- 早前桌面 `yilan-update` 已复制后端十个 Git 改动文件；地址修复曾同步其中的 `UsersController.class.php`。2026-09-30 企业发票补丁及本次文档更新尚未同步该目录，不能将桌面目录视为最新完整补丁。
- 当前其他未提交修改已有前文记录：`config/publicConfig.js` 的接口环境切换、`pages/welcome/welcome.vue` 的开屏默认声音与缓存、注册姓名文案/失败提示及四个页面的验证码初次接入。环境地址以实际配置为准，不应直接将本地配置整体覆盖线上。
- 后端详细记录见 `yilan/docs/2026-09-changelog.md` 同日期补充。本次地址与企业资料补丁无新增表结构或数据迁移；原有迁移文件保持其此前用途。


### 六、历史同名企业资料编辑误拦截（2026-09-30 补充）

- 真实只读接口确认同一用户的发票资料 ID 62、63 为同名企业。前端已正确调用 `ticket_edits` 并提交当前 ID；原查重排除自身后仍命中另一条历史记录，因此编辑提示重复。
- 后端调整：企业名称去除首尾空格后未变化，允许编辑原资料；新增或改成其他企业名称仍执行同用户查重。保存前的事务内使用锁定后的最新名称再次判定，二要素核验仍在每次编辑保存前执行。
- 本次无前端业务代码变更，未删除或合并历史资料。后端模拟回归覆盖历史同名原名编辑、核验失败不写入，以及新增/改名查重；未调用真实企业核验或写入真实资料。


### 七、Android 获取验证码：接入 App 视图层（2026-09-30）

**问题**：Android 注册点击“获取验证码”提示“当前环境不支持 Web 验证码，请使用 H5 页面”。原公共 mixin 在 uni-app App 逻辑层直接访问 `window/document`，该层没有 DOM，导致在请求短信之前退出。

**修改**：

- 新增 `library/captcha-runtime.js`：抽出已有 SDK 加载、初始化和验证流程，保留 `prefix=nh4pu2`、场景 `1vbsr7hh`、超时/防连点/重试处理；只在具备 DOM 的 H5 或 App 视图层运行。
- 新增 `components/aliyun-captcha/aliyun-captcha.vue`：App 通过 renderjs 动态加载 SDK；逻辑层传递带请求 ID 的验证/取消命令，视图层用 `callMethod` 回传参数或错误。Promise 留在逻辑层，不跨层序列化；忽略过期回调，支持取消、超时和重复点击拦截。
- `mixins/captcha.js` 按平台分流：H5 使用共享 DOM 运行时，App 使用组件桥接；页面隐藏/卸载时取消请求。
- 注册、登录、找回密码、注销四个页面添加仅 App 编译的验证码组件。
- 后端短信/验证码接口不变；验证参数仍交由原接口进行服务端核验。本次仅前端适配，不需 SQL 迁移。

**验证**：运行时模拟回归及 App 桥接测试通过（参数回传、过期回调忽略、重复点击、取消、失败）。使用 HBuilderX 内置 Node 和编译配置完成 App-plus 生产资源编译，输出 `/tmp/yilan-captcha-app-build`；不是已签名 APK。ADB 未发现已连接设备，尚未完成 Android 真实挑战与短信发送验收。此前“App 接入尚待适配”的说明更新为“已完成代码适配，待真机验收”。Android 需重新运行到手机或重新打包更新，旧安装包不会因本地源码修改自动生效。


### 八、注册获取短信前增加姓名手机号二要素核验（2026-09-30）

- 注册页获取验证码改走专用 `Index/getRegisterSmsCode` 接口，提交 `nickname`、`phone` 和 `captchaVerifyParam`；缺少姓名或手机号格式不正确时直接提示。增加发送中防连点、人机验证期间姓名/手机号变化检查；只有发送成功才开始倒计时，失败显示原因并允许重试。
- 后端新增 `getRegisterSmsCode()`，与原 `getSmsCode()` 共用 `sendSmsCode($registration)`。注册路径依次检查输入、人机验证码、姓名手机号二要素，全部通过后才调用短信发送；二要素不一致、查无或服务异常均不发送。
- 登录、找回密码和注销保持使用原通用短信接口，不要求填写姓名。通用手机号校验统一为完整 11 位 `1[3-9]` 号段格式。
- 最终 `reg()` 的原有短信校验和二要素核验逻辑未变；获取短信时通过不替代提交注册时的再次核验。
- 修改文件：前端 `library/api.js`、`pages/login_md/regirest.vue`；后端 `App/Inter/Controller/IndexController.class.php`。前后端应配套发布；无数据库迁移。
- 验证：PHP 语法及六组隔离测试通过，覆盖调用顺序、核验失败不发短信、人机失败、缺姓名、非法手机号和其他短信入口；前端模拟验证参数、成功倒计时及失败恢复；逐段比对确认 `reg()` 不变。未发送真实短信或调用付费二要素服务。桌面 `yilan-update` 尚未同步本次补丁。
