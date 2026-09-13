import http from './http.js'
class Ht{
    //接口统一

	getBarList(data){
		return http.post("index/getBarList",data)
	}
	
	load_banner(data){
		return http.post("Index/load_banner.html",data)
	}
	Cats(data){
		return http.post("Cats/index.html",data)
	}
	
	article(data){
		return http.post("Index/article.html",data)
	}
	
	login(data){
		return http.post("Index/login.html",data)
	}
	Users(data){
		return http.post("Users/index.html",data)
	}
	
	updates(data){
		return http.post("Users/updates.html",data)
	}
	up_check(data){
		return http.post("Users/up_check.html",data)
	}
	
	Carts(data){
		return http.post("Carts/index.html",data)
	}
	cartup(data){
		return http.post("Carts/cartup.html",data)
	}
	cartcancel(data){
		return http.post("Carts/cartcancel.html",data)
	}
	cartdel(data){
		return http.post("Carts/cartdel.html",data)
	}
	cartclear(data){
		return http.post("Carts/cartclear.html",data)
	}
	uaddr_list(data){
		return http.post("Users/uaddr_list.html",data)
	}
	
	order(data){
		return http.post("Carts/order.html",data)
	}
	
	order_pay(data){
		return http.post("Carts/order_pay.html",data)
	}
	ticket_list(data){
		return http.post("Users/ticket_list.html",data)
	}
	
	glist(data){
		return http.post("Goods/glist.html",data)
	}
	Newcartadd(data){
		return http.post("ReportNew/cartadd.html",data)
	}
	
	
	cartadd(data){
		return http.post("Carts/cartadd.html",data)
	}
	
	ReportNewList(data){
		return http.post("ReportNew/lists.html",data)
	}
	
	ReportNewChange(data){
		return http.post("reportNew/change",data)
	}
	
	lists_add(data){
		return http.post("ReportNew/lists_add.html",data)
	}
	clearall(data){
		return http.post("Report/clearall.html",data)
	}
	replist(data){
		return http.post("Report/replist.html",data)
	}
	repdel(data){
		return http.post("Report/repdel.html",data)
	}
	
	reportAgain(data){
		return http.post("reportNew/reportAgain",data)
	}
	repinfos(data){
		return http.post("Report/repinfos.html",data)
	}
	repall(data){
		return http.post("Report/repall.html",data)
	}
	
	orderIndex(data){
		return http.post("Order/index.html",data)
	}
	
	oinfo_fixd(data){
		return http.post("Order/oinfo_fixd.html",data)
	}
	
	addr_addon(data){
		return http.post("Users/uaddr_addon.html",data)
	}
	uaddr_dels(data){
		return http.post("Users/uaddr_dels.html",data)
	}
	
	uaddr_info(data){
		return http.post("Users/uaddr_info.html",data)
	}
	uaddr_edits(data){
		return http.post("Users/uaddr_edits.html",data)
	}
	
	artall(data){
		return http.post("Index/artall.html",data)
	}
	helps(data){
		return http.post("Index/helps.html",data)
	}
	helps_info(data){
		return http.post("Index/helps_info.html",data)
	}
	
	
	orderOinfo(data){
		return http.post("Order/oinfo.html",data)
	}
	
	oinfo_up(data){
		return http.post("Order/oinfo_up.html",data)
	}
	getLogoList(data){
		return http.post("users/getLogoList",data)
	}
	logo_dels(data){
		return http.post("users/logo_dels",data)
	}
	
	logo_save(data){
		return http.post("users/logo_save",data)
	}
	
	getRemarkList(data){
		return http.post("users/getRemarkList",data)
	}
	remark_dels(data){
		return http.post("users/remark_dels",data)
	}
	remark_save(data){
		return http.post("users/remark_save",data)
	}
	
	search(data){
		return http.post("Index/search.html",data)
	}
	msg_list(data){
		return http.post("Index/msg_list.html",data)
	}
	sys_msgs(data){
		return http.post("Core/dels/model/sys_msgs.html",data)
	}
	
	reportDel(data){
		return http.post("Core/dels/model/report.html",data)
	}
	reportChange(data){
		return http.post("Core/change/model/report.html",data)
	}
	
	
	outUrl(data){
		return http.get("reportNew/outUrl",data)
	}
	ticket_addon(data){
		return http.post("Users/ticket_addon.html",data)
	}
	ticket_dels(data){
		return http.post("Users/ticket_dels.html",data)
	}
	ticket_info(data){
		return http.post("Users/ticket_info.html",data)
	}
	
	getSmsCode(data){
		return http.post("Index/getSmsCode.html",data)
	}
	reg(data){
		return http.post("Index/reg.html",data)
	}
	logCode(data){
		return http.post("Index/logCode.html",data)
	}
	forget(data){
		return http.post("Index/forget.html",data)
	}
	peis(data){
		return http.post("Cats/peis.html",data)
	}
	gmores(data){
		return http.post("Goods/gmores.html",data)
	}
	update_version(data){
		return http.post("Index/update_version",data)
	}
	
	checkReport(data){
		return http.post("ReportNew/checkReport",data)
	}
	
	msgs_dels(data){
		return http.post("Users/msgs_dels",data)
	}
	changeTicket(data){
		return http.post("ReportNew/changeTicket",data)
	}
	
	upset_head(data){
		return http.post("Users/upset_head",data)
	}
	
	msg_info(data){
		return http.post("Index/msg_info.html",data)
	}
	regionAdd(data){
		return http.post("Index/regionAdd",data)
	}
	
	userDel(data){
		return http.post("Users/userDel",data)
	}
	userDelPrecheck(data){
		return http.post("Users/userDelPrecheck",data)
	}
	
	
	regionAll(data){
		return http.post("index/regionAll",data)
	}
	
	
	checkArea(data){
		return http.post("index/checkArea",data)
	}

    // --- AI 助手扩展接口 (精准匹配宝塔后台 AiController.class.php) ---
    	aiChat(data){
    		return http.post("Ai/runAiChat", data)
    	}
    	getAiKnowledge(data){
    		return http.post("Ai/getKnowledgeList", data)
    	}
    	aiTts(data){
    		return http.post("Ai/testTtsSynthesis", data)
    	}
    	getAiQuoteList(data){
    		return http.post("Ai/getQuoteList", data)
    	}

    // --- 意见反馈 ---
    	feedbackAdd(data){
    		return http.post("Users/feedbackAdd", data)
    	}
    	feedbackList(data){
    		return http.post("Users/feedbackList", data)
    	}

    // --- 报价单：常用单位/备注模板 ---
    	reportQuickList(data){
    		return http.post("ReportNew/quickList", data)
    	}
    	reportQuickAdd(data){
    		return http.post("ReportNew/quickAdd", data)
    	}
    	reportQuickDel(data){
    		return http.post("ReportNew/quickDel", data)
    	}
}
export default new Ht()