# 2026-09 功能更新说明（App 前端）

> 分支：`feature/20260830-update`
> 整理日期：2026-09-04（最后更新：2026-09-05）
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
- [十五、文件变更清单](#十五文件变更清单)
- [十六、已知问题 / 待确认事项](#十六已知问题--待确认事项)

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

## 十五、文件变更清单

| 文件 | 状态 | 变更内容 |
|---|---|---|
| （36 个页面/组件 + 新增文件，见第二节） | 已提交 `cf7f0fd` | UI 改版批量合入 |
| `config/publicConfig.js` | 未提交 | 接口地址本地/线上切换 |
| `pages/shops/shop_lists.vue` | 未提交 | 标准/类型二级联动、客服电话改用等级配置 |
| `pages/my/my.vue` | 未提交 | 联系客服电话改用等级配置 |
| `pages/poindex/poindex.vue` | 未提交 | 账号类型/证件号码/联系电话字段修复、企业证件照绑定修正、图片上传补 base64 转换 |
| `library/api.js` | 未提交 | 新增 `feedbackAdd`/`feedbackList`/`reportQuickList`/`reportQuickAdd`/`reportQuickDel` |
| `pages/my/setindex/setindex.vue` | 未提交 | 修正"意见反馈"跳转路径 |
| `pages/my/setindex/setfeedback.vue` | 未提交 | 提交补 `uid`、新增反馈记录+回复展示 |
| `pages/report/repinfos.vue` | 未提交 | 常用单位/模板库改为后端存储，报价/询价单位库拆分为独立列表；新增单品备注条件展示行 |
| `pages/cart/cart.vue` | 未提交 | `clear()` 补 `ticket` 参数，避免清空误删其他税率分组商品；单品备注展示移到调整数量行的虚线上方 |
| `pages/cart/confirm.vue` | 未提交 | 客服电话弹窗改读 `ulevel.tel`，不再写死固定号码 |
| `docs/2026-09-changelog.md` | 新增/追加（本文件） | — |

## 十六、已知问题 / 待确认事项

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
