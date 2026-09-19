<template>
	<view class="page">
		<!-- 广告内容区：媒体元素本身必须一直渲染在这里才能触发它自己的加载事件，
		     不能像之前那样整个容器都用 resourceLoaded 控制 v-if——那样视频/图片标签
		     永远不会被创建，@loadedmetadata / @load 永远不会触发，resourceLoaded 就
		     永远变不成 true，是个死循环。改成用 resourceLoaded 只控制淡入动画和
		     跳过/声音按钮的显示，媒体元素只要拿到 info.url 就立刻渲染开始加载 -->
		<div class="loadheight" :class="{'fade-in-container': resourceLoaded}" v-if="info.url">

			<!-- 情况 A：后台配置的是【视频】 -->
			<block v-if="info.type === 'video'">
				<video
					class="full-video"
					:src="singleLineVideoUrl"
					:autoplay="true"
					:muted="isMuted"
					:controls="false"
					:loop="false"
					object-fit="cover"
					@loadedmetadata="onVideoLoaded"
					@error="onVideoError"
					@ended="doJump">
				</video>

				<!-- 声音开关控制按钮：资源没准备好之前先不展示，避免闪现在黑屏上 -->
				<div class="sound-btn" @click="toggleSound" v-if="resourceLoaded">
					<text>{{ isMuted ? '🔇 点击开启声音' : '🔊 声音已开启' }}</text>
				</div>
			</block>

			<!-- 情况 B：后台配置的是【图片】 -->
			<block v-else-if="info.type === 'image'">
				<image
					:src="singleLineBase64"
					mode="aspectFill"
					class="full-image"
					@load="onImageLoaded"
					@error="onImageError">
				</image>
			</block>

			<!-- 右上角统一的跳过按钮 -->
			<div class="jump" @click="doJump()" v-if="resourceLoaded">({{initNumb}})跳过</div>
		</div>
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
			this.init()
		},
		methods: {
			async init() {
				try {
					let cacheMeta = this.loadCacheMeta();
					let res = await this.$api.load_banner({ version: cacheMeta ? cacheMeta.version : '' });
					let freshList = (res.data && res.data.list) || [];

					// 没有配置/启用任何开屏广告时，不展示空白/异常界面，直接跳过进入首页；
					// 顺带清空本地缓存（全部广告都被下架/删除了）
					if (freshList.length === 0) {
						this.cleanupCache(cacheMeta ? cacheMeta.items : [], []);
						this.saveCacheMeta({ version: res.data ? res.data.version : '', items: [] });
						return this.doJump();
					}

					let freshIds = freshList.map(a => String(a.id));
					let oldItems = (cacheMeta && cacheMeta.items) || [];

					// 按 id 比对：本地缓存里存在、但这次后台已经不返回的（已删除/已下架），
					// 清理掉对应的本地缓存文件，不留孤儿文件
					let keepItems = oldItems.filter(it => freshIds.includes(String(it.id)));
					this.cleanupCache(oldItems, freshIds);

					// 本次展示哪一条由客户端随机选，优先用已经缓存到本地的文件，
					// 缓存里没有（新广告/首次启动）才现场下载
					let keepMap = {};
					keepItems.forEach(it => { keepMap[String(it.id)] = it; });
					let pickAd = freshList[Math.floor(Math.random() * freshList.length)];
					let pickItem = keepMap[String(pickAd.id)];
					if (!pickItem || !pickItem.localPath) {
						let saved = await this.downloadAndSave(pickAd);
						pickItem = saved || { id: pickAd.id, type: pickAd.type, url: pickAd.url, localPath: '' };
						keepMap[String(pickAd.id)] = pickItem;
					}

					// 立刻落盘一次（哪怕下面预缓存其它广告失败/较慢，这次的清理结果和选中项也不会丢）
					let keepList = [];
					for (let key in keepMap) {
						keepList.push(keepMap[key]);
					}
					this.saveCacheMeta({ version: res.data.version, items: keepList });

					this.info.type = pickItem.type;
					this.info.url = pickItem.localPath || pickItem.url; // 有本地缓存文件优先用本地，否则回退到远程地址

					if (this.info.type === 'video') {
						this.singleLineVideoUrl = this.info.url.replace(/(\r\n|\n|\r)/gm, "");
					} else {
						this.singleLineBase64 = this.info.url.replace(/(\r\n|\n|\r)/gm, "");
						// 图片直接给予渲染许可
						this.resourceLoaded = true;
						this.startCountdown(5);
					}

					// 后台预缓存这次没选中的其它广告，不阻塞本次展示，为下次启动做准备
					freshList
						.filter(a => String(a.id) !== String(pickAd.id) && !keepMap[String(a.id)])
						.forEach(a => this.prefetchAd(a));
				} catch (e) {
					// 广告接口异常（网络失败等）：不能让用户卡在黑屏上，直接跳过
					console.log(e);
					this.doJump();
				}
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

			// 后台预缓存：下载成功后追加进本地缓存清单，不影响本次展示
			prefetchAd(ad) {
				this.downloadAndSave(ad).then(saved => {
					if (!saved) return;
					let meta = this.loadCacheMeta();
					if (!meta) return;
					let items = meta.items || [];
					if (items.some(it => String(it.id) === String(saved.id))) return;
					items.push(saved);
					this.saveCacheMeta({ version: meta.version, items });
				});
			},

			onVideoLoaded(e) {
				this.resourceLoaded = true;
				let duration = Math.ceil(e.detail.duration || 5);
				this.initNumb = duration;
				this.startCountdown(duration);
			},

			onVideoError() {
				// 视频加载失败（网络/编码问题等）：不能让用户卡在黑屏上，直接跳过
				this.doJump();
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