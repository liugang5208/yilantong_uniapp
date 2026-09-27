<template>
	<view class="page">
		<!-- 情况 A：后台配置的是【视频】。video 不能套在 opacity:0 或其他遮挡容器里——
		     它是覆盖在 WebView 之上的原生组件，被遮挡时系统会限制/暂停硬件解码，
		     必须从第一帧起就以完整不透明状态渲染 -->
		<video
			v-if="info.type === 'video' && info.url"
			class="full-video"
			id="adVideo"
			:src="singleLineVideoUrl"
			:autoplay="true"
			:muted="isMuted"
			:controls="false"
			:loop="false"
			object-fit="cover"
			@loadedmetadata="onVideoLoaded"
			@timeupdate="onVideoTimeUpdate"
			@error="onVideoError"
			@ended="doJump">
		</video>

		<!-- 情况 B：后台配置的是【图片】。图片是普通 WebView 元素，不是原生覆盖组件，
		     没有上面那个坑，维持原来的 opacity 淡入方案 -->
		<div class="loadheight" :class="{'fade-in-container': resourceLoaded}" v-if="info.type === 'image' && info.url">
			<image
				:src="singleLineBase64"
				mode="aspectFill"
				class="full-image"
				@load="onImageLoaded"
				@error="onImageError">
			</image>
		</div>

		<!-- 声音开关 / 跳过按钮：cover-view 内部嵌套 <text> 组件在 App-Android 上
		     不显示文字（按钮背景能看到，文字渲染不出来）——cover-view 只支持直接包
		     纯文本或嵌套 cover-view/cover-image，不支持把 <text> 组件当子节点，文字
		     直接写在 cover-view 里面 -->
		<cover-view class="sound-btn" @click="toggleSound" v-if="resourceLoaded && info.type === 'video'">{{ isMuted ? '🔇 点击开启声音' : '🔊 声音已开启' }}</cover-view>
		<cover-view class="jump" @click="doJump()" v-if="resourceLoaded">({{initNumb}})跳过</cover-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {
					type: 'image',
					url: '',
				},
				initNumb: 5,
				singleLineBase64: '',
				singleLineVideoUrl: '',
				initStatus: 0,
				setval: null,
				resourceLoaded: false, // 只有准备好了才显示
				isMuted: true
			}
		},
		onLoad() {
			// 原生开屏 logo 页依赖运行时自己探测"页面渲染完成"来决定何时关闭，这套探测
			// 不稳定，实测同样代码有时 1.5 秒关闭、有时拖到 7~10 秒。不再等它自动探测，
			// 页面一加载就主动关掉
			// #ifdef APP-PLUS
			if (typeof plus !== 'undefined' && plus.navigator) {
				plus.navigator.closeSplashscreen();
			}
			// App 端是原生播放器，不受浏览器"自动播放必须静音"的策略限制，默认开声音；
			// H5 端维持默认静音（浏览器大概率会强制静音/拦截播放，改了也没用）
			this.isMuted = false;
			// #endif
			this.init()
		},
		onUnload() {
			// 防御性释放：页面正常离开时（走正常生命周期，比如划掉/正常跳转）尽量提前
			// 暂停视频，帮助系统更快回收硬件解码器资源，降低"杀进程后立刻重开撞上解码器
			// 还没回收完"这个窗口期的概率。对真正被系统强杀（跳过生命周期钩子）的情况
			// 这段代码根本不会被执行，帮不上忙，只能靠系统自己回收
			if (this.info.type === 'video') {
				try {
					uni.createVideoContext('adVideo', this).pause();
				} catch (e) {
					// 页面已经在销毁，拿不到视频上下文很正常，忽略
				}
			}
		},
		methods: {
			async init() {
				// H5 端没有 uni.saveFile，做不了"本地缓存池"这套方案，维持老逻辑：
				// 直接请求一次 load_banner，选中哪条就用哪条的远程地址流式播放
				if (typeof uni.saveFile !== 'function') {
					return this.initH5Fallback();
				}

				// App 端：本地缓存池里一条能播的都没有——说明是真正的首次启动，或者
				// 缓存被清空/全部失效了。这种情况不放广告、直接进首页，避免用户等首次下载；
				// 同时后台异步把后台配置的全部广告素材下载缓存到本地，供下次启动播放
				let cacheMeta = this.loadCacheMeta();
				let cachedList = ((cacheMeta && cacheMeta.items) || []).filter(it => it.localPath);
				if (cachedList.length === 0) {
					this.doJump();
					this.syncAndCacheAll(cacheMeta);
					return;
				}

				// 本地已经有缓存好的素材：按 id 从小到大顺序选下一条播放（不随机）
				let pick = this.pickNextInOrder(cachedList);
				this.applyPick(pick.type, pick.localPath);

				// 后台异步跟后台数据校准：新增的广告补下载，已下架的广告清理掉本地文件，
				// 不阻塞当前正在播放的这条，为下一次启动做准备
				this.syncAndCacheAll(cacheMeta);
			},

			// H5 端的老逻辑：没有本地缓存能力，每次都现场请求 + 直接播远程地址
			async initH5Fallback() {
				try {
					let res = await this.$api.load_banner({ version: '' });
					let freshList = (res.data && res.data.list) || [];
					if (freshList.length === 0) {
						return this.doJump();
					}
					let pickAd = this.pickNextInOrder(freshList);
					this.applyPick(pickAd.type, pickAd.url);
				} catch (e) {
					console.log(e);
					this.doJump();
				}
			},

			// 按 id 从小到大顺序选下一条素材（取代原来的随机选片），记住上次播的 id，
			// 下次从比它大的最小 id 继续；轮到最后一个之后回到最小 id 重新开始
			pickNextInOrder(list) {
				let sorted = list.slice().sort((a, b) => Number(a.id) - Number(b.id));
				let lastId = this.loadLastPlayedId();
				let next = sorted.find(it => Number(it.id) > lastId);
				if (!next) next = sorted[0]; // 轮完一圈，回到最小 id
				this.saveLastPlayedId(Number(next.id));
				return next;
			},

			loadLastPlayedId() {
				try {
					return uni.getStorageSync('ads_last_played_id_v1') || 0;
				} catch (e) {
					return 0;
				}
			},

			saveLastPlayedId(id) {
				try {
					uni.setStorageSync('ads_last_played_id_v1', id);
				} catch (e) {
					// 忽略
				}
			},

			// 把选中的素材类型/地址应用到页面上，触发对应的渲染与就绪兜底逻辑，
			// 复用于「本地缓存池选片」和「H5 直接播远程地址」两种场景
			applyPick(type, url) {
				this.info.type = type;
				this.info.url = url;

				if (type === 'video') {
					this.singleLineVideoUrl = url.replace(/(\r\n|\n|\r)/gm, "");
					// 兜底：万一 loadedmetadata/timeupdate 在个别机型上全部不触发，
					// 3 秒后强制放行，保证按钮和倒计时不会永远出不来
					setTimeout(() => {
						if (!this.resourceLoaded) {
							this.onVideoLoaded({ detail: {} });
						}
					}, 3000);
				} else {
					this.singleLineBase64 = url.replace(/(\r\n|\n|\r)/gm, "");
					this.resourceLoaded = true;
					this.startCountdown(5);
				}
			},

			// 后台异步校准：拉取最新广告列表，清理已下架的本地缓存文件，
			// 把所有还没有本地缓存的素材逐个下载下来（不管这次有没有播放它），
			// 下一次启动时本地缓存池就是最新、完整的，不需要再现场等下载
			async syncAndCacheAll(cacheMeta) {
				try {
					let res = await this.$api.load_banner({ version: cacheMeta ? cacheMeta.version : '' });
					let freshList = (res.data && res.data.list) || [];
					let freshIds = freshList.map(a => String(a.id));
					let oldItems = (cacheMeta && cacheMeta.items) || [];

					this.cleanupCache(oldItems, freshIds);

					let keepMap = {};
					oldItems.filter(it => freshIds.includes(String(it.id))).forEach(it => {
						keepMap[String(it.id)] = it;
					});

					// 先落盘一次清理结果，哪怕接下来的下载中途失败/被杀进程，已有缓存和
					// 清理结果不会丢
					this.saveCacheMeta({ version: res.data ? res.data.version : '', items: this.mapToList(keepMap) });

					// 逐个下载还没有本地缓存的素材，每下完一个就落盘一次，
					// 不用 Promise.all 并发，避免真机上同时起一堆大文件下载占带宽/内存
					for (let i = 0; i < freshList.length; i++) {
						let ad = freshList[i];
						let existed = keepMap[String(ad.id)];
						if (existed && existed.localPath) continue;

						let saved = await this.downloadAndSave(ad);
						if (saved) {
							keepMap[String(ad.id)] = saved;
							this.saveCacheMeta({ version: res.data.version, items: this.mapToList(keepMap) });
						}
					}
				} catch (e) {
					// 后台校准失败不影响当前展示（不管是刚跳过还是正在播本地缓存），
					// 下次启动再重试即可
					console.log('后台广告缓存校准失败', e);
				}
			},

			mapToList(map) {
				let list = [];
				for (let key in map) {
					list.push(map[key]);
				}
				return list;
			},

			// ---- 本地缓存相关：把广告素材下载持久化到本地，减少重复下载，并按 id 清理失效缓存 ----

			loadCacheMeta() {
				try {
					return uni.getStorageSync('ads_cache_meta_v1') || null;
				} catch (e) {
					return null;
				}
			},

			saveCacheMeta(meta) {
				try {
					uni.setStorageSync('ads_cache_meta_v1', meta);
				} catch (e) {
					// 本地存储异常不影响本次展示，忽略
				}
			},

			// 清理本地缓存里已经不在 freshIds 范围内的文件（对应后台已删除/已下架的广告）
			cleanupCache(oldItems, freshIds) {
				(oldItems || []).forEach(it => {
					if (!freshIds.includes(String(it.id))) {
						this.removeCachedFile(it);
					}
				});
			},

			removeCachedFile(item) {
				if (item && item.localPath && typeof uni.removeSavedFile === 'function') {
					uni.removeSavedFile({
						filePath: item.localPath,
						fail: () => {} // 文件本来就不存在/已被系统清理，忽略
					});
				}
			},

			// 下载并持久化保存一条广告素材，成功返回 {id,type,url,localPath}，
			// 失败或平台不支持本地持久化（如 H5）返回 null，调用方会回退到远程 url
			downloadAndSave(ad) {
				return new Promise((resolve) => {
					if (typeof uni.saveFile !== 'function') {
						resolve(null);
						return;
					}
					uni.downloadFile({
						url: ad.url,
						success: (res) => {
							if (res.statusCode !== 200) {
								resolve(null);
								return;
							}
							uni.saveFile({
								tempFilePath: res.tempFilePath,
								success: (saveRes) => {
									resolve({ id: ad.id, type: ad.type, url: ad.url, localPath: saveRes.savedFilePath });
								},
								fail: () => resolve(null)
							});
						},
						fail: () => resolve(null)
					});
				});
			},

			// @timeupdate 专用过滤：只有 currentTime 真正往前走过一个小阈值（0.2秒）
			// 才认为是真播放，过滤掉个别机型上那种 currentTime 接近 0 的假阳性首个 tick
			onVideoTimeUpdate(e) {
				let currentTime = (e && e.detail && e.detail.currentTime) || 0;
				if (currentTime < 0.2) return;
				this.onVideoLoaded(e);
			},

			onVideoLoaded(e) {
				// @loadedmetadata 或者过滤后的 @timeupdate 共用这个处理函数，@timeupdate
				// 播放期间会持续触发，这个 return 保证只真正执行一次。resourceLoaded 只
				// 控制按钮/倒计时的显示，不控制 video 本身的显隐——它从渲染那一刻就可见
				if (this.resourceLoaded) return;
				// e.type 有值说明是真事件触发；没有 type 说明是 3 秒硬兜底（万一
				// loadedmetadata/timeupdate 全都没触发，避免按钮和倒计时永远出不来）
				let isFallback = !(e && e.type);

				this.resourceLoaded = true;
				// 硬兜底触发大概率没播成功，不用等满默认倒计时，尽快收尾跳走；
				// 真实事件触发才用视频本身的时长
				let duration = isFallback ? 1 : Math.ceil((e && e.detail && e.detail.duration) || 5);
				this.initNumb = duration;
				this.startCountdown(duration);
			},

			onVideoError(e) {
				// 视频加载失败（网络/编码问题等）：不能让用户卡在黑屏上，跳过前用 toast
				// 露出错误，方便真机排查不用接 USB 调试也能看到失败原因
				let detail = (e && e.detail) || {};
				console.log('视频加载失败:', detail);
				uni.showToast({ title: '视频加载失败：' + (detail.errMsg || detail.errCode || '未知错误'), icon: 'none', duration: 2000 });
				setTimeout(() => this.doJump(), 2000);
			},

			onImageLoaded() {
				// 图片加载成功
			},

			onImageError() {
				this.resourceLoaded = true;
			},

			startCountdown(seconds) {
				this.initNumb = seconds;
				let offset = 0;
				this.setval = setInterval(() => {
					this.initNumb = seconds - offset;
					if (this.initStatus > 0) {
						clearInterval(this.setval);
						return;
					}
					if (offset >= seconds) {
						clearInterval(this.setval);
						return this.doJump();
					}
					offset = offset + 1;
				}, 1000);
			},

			toggleSound() {
				this.isMuted = !this.isMuted;
			},

			async doJump() {
				if (this.initStatus === 1) return;
				this.initStatus = 1;
				if (this.setval) {
					clearInterval(this.setval);
				}
				uni.reLaunch({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.page{
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		position: relative;
		background-color: #000000; // 纯黑极简底色
	}

	.loadheight {
		height: 100vh;
		width: 100vw;
		overflow: hidden;
		position: relative;
		text-align: center;
		opacity: 0; /* 资源没准备好之前先隐藏，但元素本身要一直存在于 DOM 里才能触发加载事件 */
	}

	/* 优雅的淡入渐变，绝不生硬 */
	.fade-in-container {
		animation: smoothFadeIn 0.5s ease-out forwards;
	}

	@keyframes smoothFadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	/* 强制视频、图片全屏无缝隙铺满 */
	.full-video, .full-image {
		width: 100vw;
		height: 100vh;
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		object-fit: cover !important;
	}

	/* 右上角跳过按钮 */
	.jump {
		background: rgba(0, 0, 0, 0.4);
		border-radius: 30rpx;
		color: white;
		font-size: 34rpx;
		position: absolute;
		height: 64rpx;
		line-height: 64rpx;
		text-align: center;
		right: 40rpx;
		top: 100rpx;
		width: 150rpx;
		z-index: 10;
	}

	/* 声音开关悬浮按钮样式 */
	.sound-btn {
		position: absolute;
		left: 40rpx;
		top: 100rpx;
		background: rgba(0, 0, 0, 0.4);
		color: white;
		font-size: 28rpx;
		padding: 0 24rpx;
		height: 64rpx;
		line-height: 64rpx;
		border-radius: 30rpx;
		z-index: 10;
	}
</style>