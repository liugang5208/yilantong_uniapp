<template>
  <view class="ai-container">
    <!-- 1. 顶部状态栏安全占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 2. 顶部精细长条栏（圆润返回键 + 商城标识 + 易缆通AI报价助手） -->
    <view class="custom-nav-bar">
      <view class="nav-left" @tap="handleBack">
        <view class="back-icon-wrap">
          <text class="back-icon">‹</text>
        </view>
      </view>
      <view class="nav-center" @tap="handleGoMall">
        <image class="mall-logo" src="/static/appLogo.png" mode="aspectFill"></image>
        <text class="nav-title">{{ pageConfig.assistantName || '易缆通AI报价助手' }}</text>
      </view>
      <view class="nav-right" @tap="handleGoMall">
        <text class="mall-entry-icon">🛒</text>
      </view>
    </view>

    <!-- 3. 中间聊天内容滚动视窗 -->
    <scroll-view 
      scroll-y 
      class="chat-scroll-view" 
      :scroll-into-view="scrollTopId"
      scroll-with-animation
    >
      <view class="message-list">
        <block v-for="(item, index) in messageList" :key="index">
          <view :id="'msg-' + index" :class="['message-item', item.role === 'user' ? 'user-msg' : 'ai-msg']">
            <view class="content-card">
              <!-- 文本内容 -->
              <text class="text-content" v-if="item.type === 'text'" user-select>{{ item.content }}</text>

              <!-- 图片展示 -->
              <image 
                class="media-image" 
                v-if="item.type === 'image'" 
                :src="item.content" 
                mode="widthFix"
                @tap="previewImage(item.content)"
              ></image>

              <!-- 文档/报价单卡片 -->
              <view class="file-card" v-if="item.type === 'file'" @tap="handleOpenFile(item)">
                <text class="file-ico">📄</text>
                <view class="file-detail">
                  <text class="file-name">{{ item.fileName || '线缆报价明细文件' }}</text>
                  <text class="file-size">点击查看文件详情</text>
                </view>
              </view>

              <!-- AI返回结果的操作工具条（支持保存、分享、收藏） -->
              <view class="ai-toolbar" v-if="item.role === 'assistant'">
                <view class="tool-left-actions">
                  <text class="tool-action-btn" @tap="saveToPhone(item)">💾 保存手机</text>
                  <text class="tool-action-btn" @tap="shareToWechat(item)">🔗 微信分享</text>
                  <text class="tool-action-btn" @tap="collectToWechat(item)">⭐ 微信收藏</text>
                </view>
              </view>
            </view>
          </view>
        </block>
      </view>
      <view id="scroll-bottom" style="height: 30rpx;"></view>
    </scroll-view>

    <!-- 4. 底部输入与多功能扩展面板 -->
    <view class="input-panel" :style="{ bottom: keyboardHeight + 'px' }">
      <view class="grid-popup-panel" v-if="showMoreTools">
        <view class="grid-item" @tap="chooseAndUploadImage">
          <view class="grid-ico-wrap"><text class="grid-ico-text">🖼️</text></view>
          <text class="grid-txt">相册图片</text>
        </view>
        <view class="grid-item" @tap="chooseAndUploadFile">
          <view class="grid-ico-wrap"><text class="grid-ico-text">📁</text></view>
          <text class="grid-txt">文档文件</text>
        </view>
      </view>

      <view class="main-input-bar">
        <view class="control-btn-wrap" @tap="showMoreTools = !showMoreTools">
          <text class="unified-control-icon">➕</text>
        </view>
        
        <input 
          v-if="!isVoiceMode"
          class="text-input" 
          type="text" 
          v-model="inputMessage" 
          placeholder="发送线缆型号或规格进行智能报价..." 
          confirm-type="send"
          @confirm="sendTextMessage"
        />

        <button 
          v-if="isVoiceMode" 
          class="voice-btn"
          @touchstart="startVoiceRecord"
          @touchend="stopVoiceRecord"
        >
          {{ isRecording ? '松开 结束发送' : '按住 说话询价' }}
        </button>

        <view class="control-btn-wrap" @tap="toggleVoiceMode">
          <text class="unified-control-icon">{{ isVoiceMode ? '⌨️' : '🎙️' }}</text>
        </view>

        <view class="send-action-btn" v-if="inputMessage.trim().length > 0 && !isVoiceMode" @tap="sendTextMessage">
          <text>发送</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// 改成从根目录的 library 文件夹引入
import API from '@/library/api.js';

export default {
  data() {
    return {
      statusBarHeight: 20,
      keyboardHeight: 0,
      scrollTopId: '',
      isVoiceMode: false,
      isRecording: false,
      showMoreTools: false,
      inputMessage: '',
      
      // 页面动态配置（初始占位，随后从后端接口动态读取）
      pageConfig: {
        assistantName: '易缆通AI报价助手',
        welcomeMessage: '',
        voiceType: 'BV700_streaming'
      },

      messageList: [],
      apiBaseUrl: 'https://app2.elccc.cn/Home/Ai/' // 严格对应后端统一控制器路由
    }
  },
  onLoad() {
    const sys = uni.getSystemInfoSync();
    this.statusBarHeight = sys.statusBarHeight || 20;

    uni.onKeyboardHeightChange(res => {
      this.keyboardHeight = res.height;
      this.scrollToBottom();
    });

    // 页面加载：先通过接口异步获取后台的配置和欢迎语（绝不写死）
    this.fetchBackendConfig();
  },
  methods: {
    // 核心：从后端接口动态读取配置与欢迎语（此处可按需通过API或原生请求获取）
    fetchBackendConfig() {
      uni.request({
        url: this.apiBaseUrl + 'getConfig',
        method: 'GET',
        success: (res) => {
          if (res.data && res.data.code === 200 && res.data.data) {
            const cfg = res.data.data;
            this.pageConfig.assistantName = cfg.ai_name || '易缆通AI报价助手';
            this.pageConfig.voiceType = cfg.tts_voice || 'BV700_streaming';
            this.pageConfig.welcomeMessage = cfg.welcome_msg || '';
          }
          
          // 展示欢迎语并自动语音播报（完全由接口下发驱动）
          if (this.pageConfig.welcomeMessage) {
            this.appendMessage({ 
              role: 'assistant', 
              type: 'text', 
              content: this.pageConfig.welcomeMessage
            });
            this.playTextVoice(this.pageConfig.welcomeMessage);
          }
        },
        fail: () => {
          console.log('配置获取网络异常');
        }
      });
    },

    handleBack() {
      uni.navigateBack({ 
        delta: 1, 
        fail: () => { uni.switchTab({ url: '/pages/index/index' }); } 
      });
    },

    handleGoMall() {
      uni.navigateTo({ url: '/pages/shops/shop_lists' });
    },

    toggleVoiceMode() {
      this.isVoiceMode = !this.isVoiceMode;
      this.showMoreTools = false;
    },

    sendTextMessage() {
      if (!this.inputMessage.trim()) return;
      const content = this.inputMessage;
      this.inputMessage = '';
      this.showMoreTools = false;

      this.appendMessage({ role: 'user', type: 'text', content });
      this.requestAiServer(content, '');
    },

    // 核心：无缝对接后端接口 (通过封装好的 API.aiChat 调用)
    async requestAiServer(promptText, imagePath = '') {
      try {
        let res = await API.aiChat({
          prompt: promptText,
          image_path: imagePath,
          voice_type: this.pageConfig.voiceType,
          need_tts: true,
          messages: this.messageList.slice(-6)
        });

        if (res && res.code === 200) {
          const data = res.data;
          
          this.appendMessage({
            role: 'assistant',
            type: 'text',
            content: data.text
          });

          // 自动进行语音朗读（采用后台设定的音色）
          if (data.audio_url) {
            const audioUrl = data.audio_url.startsWith('http') ? data.audio_url : ('https://app2.elccc.cn' + data.audio_url);
            const innerAudio = uni.createInnerAudioContext();
            innerAudio.src = audioUrl;
            innerAudio.play();
          }
        } else {
          uni.showToast({ title: (res && res.msg) || 'AI响应异常', icon: 'none' });
        }
      } catch (e) {
        uni.showToast({ title: '网络连接超时', icon: 'none' });
      }
    },

    // 图片上传并交由大模型分析
    chooseAndUploadImage() {
      uni.chooseImage({
        count: 1,
        sourceType: ['album', 'camera'],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          uni.showLoading({ title: '图片上传中...' });
          
          uni.uploadFile({
            url: this.apiBaseUrl + 'uploadTestMedia',
            filePath: tempFilePath,
            name: 'file',
            success: (uploadRes) => {
              uni.hideLoading();
              try {
                const resData = JSON.parse(uploadRes.data);
                if (resData.code === 200) {
                  const serverPath = resData.data.file_path;
                  this.appendMessage({ role: 'user', type: 'image', content: tempFilePath });
                  this.showMoreTools = false;
                  
                  this.requestAiServer('请帮我识别并分析刚才上传的电缆图纸/图片规格', serverPath);
                } else {
                  uni.showToast({ title: resData.msg || '图片上传失败', icon: 'none' });
                }
              } catch (e) {
                uni.showToast({ title: '数据解析异常', icon: 'none' });
              }
            },
            fail: () => {
              uni.hideLoading();
              uni.showToast({ title: '上传请求失败', icon: 'none' });
            }
          });
        }
      });
    },

    // 文档上传
    chooseAndUploadFile() {
      uni.chooseMessageFile({
        count: 1,
        type: 'file',
        success: (res) => {
          const file = res.files[0];
          uni.showLoading({ title: '文档上传中...' });
          
          uni.uploadFile({
            url: this.apiBaseUrl + 'uploadTestMedia',
            filePath: file.path,
            name: 'file',
            success: (uploadRes) => {
              uni.hideLoading();
              try {
                const resData = JSON.parse(uploadRes.data);
                if (resData.code === 200) {
                  this.appendMessage({ role: 'user', type: 'file', content: file.path, fileName: file.name });
                  this.showMoreTools = false;
                  this.requestAiServer('请帮我解析该电缆报价文档并核算明细');
                }
              } catch (e) {}
            },
            fail: () => {
              uni.hideLoading();
              uni.showToast({ title: '文档上传失败', icon: 'none' });
            }
          });
        }
      });
    },

    startVoiceRecord() {
      this.isRecording = true;
      const recorderManager = uni.getRecorderManager();
      recorderManager.start({ format: 'mp3' });
    },

    stopVoiceRecord() {
      this.isRecording = false;
      const recorderManager = uni.getRecorderManager();
      recorderManager.stop();
      recorderManager.onStop((res) => {
        uni.uploadFile({
          url: this.apiBaseUrl + 'uploadTestMedia',
          filePath: res.tempFilePath,
          name: 'file',
          success: () => {
            this.requestAiServer('查询刚才语音输入的电缆规格报价');
          }
        });
      });
    },

    // 文本转语音播报（改用 API.aiTts 调用）
    async playTextVoice(text) {
      try {
        let res = await API.aiTts({
          text: text,
          voice: this.pageConfig.voiceType
        });
        if (res && res.code === 200 && res.data && res.data.audio_url) {
          const audioUrl = res.data.audio_url.startsWith('http') ? res.data.audio_url : ('https://app2.elccc.cn' + res.data.audio_url);
          const audio = uni.createInnerAudioContext();
          audio.src = audioUrl;
          audio.play();
        }
      } catch (e) {
        console.log('语音播报异常', e);
      }
    },

    appendMessage(msg) {
      this.messageList.push(msg);
      this.scrollToBottom();
    },

    scrollToBottom() {
      this.$nextTick(() => {
        this.scrollTopId = 'scroll-bottom';
      });
    },

    // 保存到手机
    saveToPhone(item) {
      if (item.type === 'image') {
        uni.saveImageToPhotosAlbum({
          filePath: item.content,
          success: () => { uni.showToast({ title: '已成功保存到相册', icon: 'success' }); }
        });
      } else {
        uni.downloadFile({
          url: item.content,
          success: (res) => {
            uni.openDocument({ filePath: res.tempFilePath });
          }
        });
      }
    },

    // 微信分享
    shareToWechat(item) {
      uni.setClipboardData({
        data: item.content,
        success: () => { uni.showToast({ title: '内容已复制，可发给微信好友' }); }
      });
    },

    // 微信收藏
    collectToWechat(item) {
      uni.setClipboardData({
        data: item.content,
        success: () => { uni.showToast({ title: '已复制，可前往微信收藏' }); }
      });
    },

    handleOpenFile(item) {
      uni.openDocument({ filePath: item.content });
    },

    previewImage(url) {
      uni.previewImage({
        urls: [url]
      });
    }
  }
}
</script>

<style scoped>
.ai-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f7f8fa;
}

.status-bar {
  width: 100%;
  background-color: #ffffff;
}

.custom-nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  background-color: #ffffff;
  padding: 0 24rpx;
  border-bottom: 1rpx solid #f0f2f5;
}

.nav-left {
  width: 60rpx;
  display: flex;
  align-items: center;
}

.back-icon-wrap {
  width: 56rpx;
  height: 56rpx;
  background-color: #f2f3f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 40rpx;
  color: #333;
  font-weight: 500;
  line-height: 1;
  margin-top: -4rpx;
}

.nav-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mall-logo {
  width: 42rpx;
  height: 42rpx;
  border-radius: 50%;
  margin-right: 12rpx;
}

.nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #111;
}

.nav-right {
  width: 60rpx;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.mall-entry-icon {
  font-size: 36rpx;
}

.chat-scroll-view {
  flex: 1;
  padding: 24rpx 12rpx;
  box-sizing: border-box;
}

.message-list {
  display: flex;
  flex-direction: column;
}

.message-item {
  display: flex;
  margin-bottom: 28rpx;
  width: 100%;
}

.ai-msg {
  justify-content: flex-start;
}

.user-msg {
  justify-content: flex-end;
}

.content-card {
  max-width: 92%;
  padding: 24rpx 28rpx;
  border-radius: 20rpx;
  font-size: 30rpx;
  line-height: 1.6;
  word-break: break-all;
  box-sizing: border-box;
}

.ai-msg .content-card {
  background-color: #ffffff;
  color: #222222;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.user-msg .content-card {
  background-color: #2f68ff;
  color: #ffffff;
  box-shadow: 0 4rpx 16rpx rgba(47, 104, 255, 0.15);
}

.media-image {
  max-width: 400rpx;
  border-radius: 12rpx;
}

.file-card {
  display: flex;
  align-items: center;
  padding: 16rpx;
  border-radius: 12rpx;
}

.ai-msg .file-card {
  background-color: #f7f8fa;
}

.user-msg .file-card {
  background-color: rgba(255, 255, 255, 0.15);
}

.file-detail {
  margin-left: 16rpx;
  display: flex;
  flex-direction: column;
}

.file-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.user-msg .file-name {
  color: #fff;
}

.file-size {
  font-size: 22rpx;
  color: #888;
}

.user-msg .file-size {
  color: rgba(255, 255, 255, 0.8);
}

.ai-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16rpx;
  padding-top: 12rpx;
  border-top: 1rpx solid #f0f2f5;
}

.tool-left-actions {
  display: flex;
  gap: 20rpx;
}

.tool-action-btn {
  font-size: 24rpx;
  color: #2f68ff;
}

.input-panel {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  border-top: 1rpx solid #eee;
  padding: 20rpx 24rpx;
  z-index: 99;
}

.grid-popup-panel {
  display: flex;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f2f5;
  margin-bottom: 16rpx;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 40rpx;
}

.grid-ico-wrap {
  width: 80rpx;
  height: 80rpx;
  background-color: #f7f8fa;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.grid-ico-text {
  font-size: 38rpx;
}

.grid-txt {
  font-size: 24rpx;
  color: #666;
  margin-top: 6rpx;
}

.main-input-bar {
  display: flex;
  align-items: center;
}

.control-btn-wrap {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f2f5ff;
  border-radius: 50%;
  margin: 0 8rpx;
}

.unified-control-icon {
  font-size: 34rpx;
  color: #2f68ff;
}

.text-input {
  flex: 1;
  height: 76rpx;
  background-color: #f2f3f5;
  border-radius: 38rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  margin: 0 8rpx;
}

.voice-btn {
  flex: 1;
  height: 76rpx;
  line-height: 76rpx;
  background-color: #f2f3f5;
  border-radius: 38rpx;
  text-align: center;
  font-size: 28rpx;
  color: #333;
  margin: 0 8rpx;
}

.send-action-btn {
  background-color: #2f68ff;
  color: #ffffff;
  font-size: 28rpx;
  padding: 0 24rpx;
  height: 72rpx;
  line-height: 72rpx;
  border-radius: 36rpx;
  margin-left: 8rpx;
  flex-shrink: 0;
}
</style>