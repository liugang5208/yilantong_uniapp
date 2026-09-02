export default{
	//分享给好友
	onShareAppMessage(){
		return {
			title:'分享好友标题'
		}
	},
	//分享到朋友圈
	onShareTimeline(){
		return {
			title:'分享朋友圈标题'
		}
	}
}