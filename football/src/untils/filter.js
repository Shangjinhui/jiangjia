import Vue from 'vue'

//2020-10-10 10:10:10或时间戳    10-10 10:10
Vue.filter('removeYearSecond',date=>{
	if(date.indexOf('-')!=-1){
		date = new Date(date.replace(/-/g, '/'));
	}else{
		date = new Date(Number(date)*1000);
	}
	
	let o = {
		'M+': date.getMonth() + 1>9?(date.getMonth() + 1):('0'+(date.getMonth() + 1)), // 月份
		'd+': date.getDate()>9?date.getDate():'0'+date.getDate(), // 日
		'h+': date.getHours()>9?date.getHours():'0'+date.getHours(), // 小时
		'm+': date.getMinutes()>9?date.getMinutes():'0'+date.getMinutes(), // 分
		's+': date.getSeconds()>9?date.getSeconds():'0'+date.getSeconds(), // 秒
		'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
		'S': date.getMilliseconds() // 毫秒
	};
	return o['M+']+'-'+o['d+']+' '+o['h+']+':'+o['m+'];
})
//时间戳       月-日
Vue.filter('monthDay',date=>{
	date = new Date(Number(date)*1000);
	let o = {
		'M+': date.getMonth() + 1>9?(date.getMonth() + 1):('0'+(date.getMonth() + 1)), // 月份
		'd+': date.getDate()>9?date.getDate():'0'+date.getDate(), // 日
	};
	return o['M+']+'-'+o['d+'];
})
//时间戳       时:分
Vue.filter('hourMinute',date=>{
	date = new Date(Number(date)*1000);
	let o = {
		'h+': date.getHours()>9?date.getHours():'0'+date.getHours(), // 小时
		'm+': date.getMinutes()>9?date.getMinutes():'0'+date.getMinutes(), // 分
	};
	return o['h+']+':'+o['m+'];
})
//时间戳         星期几
Vue.filter('switchWeek',date=>{
	date = new Date(Number(date)*1000);
	let week = {
		"0": "日",
		"1": "一",
		"2": "二",
		"3": "三",
		"4": "四",
		"5": "五",
		"6": "六"
	};
	return '星期'+week[date.getDay()+'']
})
//时间戳     年-月-日 时：分
Vue.filter('removeSrcond',date=>{
	date = new Date(Number(date)*1000);
	let o = {
		'Y+':date.getFullYear(),
		'M+': date.getMonth() + 1>9?(date.getMonth() + 1):('0'+(date.getMonth() + 1)), // 月份
		'd+': date.getDate()>9?date.getDate():'0'+date.getDate(), // 日
		'h+': date.getHours()>9?date.getHours():'0'+date.getHours(), // 小时
		'm+': date.getMinutes()>9?date.getMinutes():'0'+date.getMinutes(), // 分
		's+': date.getSeconds()>9?date.getSeconds():'0'+date.getSeconds(), // 秒
		'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
		'S': date.getMilliseconds() // 毫秒
	};
	return o['Y+']+'-'+o['M+']+'-'+o['d+']+' '+o['h+']+':'+o['m+'];
})


//半场 全场时间----------
Vue.filter('jiao',(time,status_id)=>{

	//console.log(time,status_id);
	let nowTime = parseInt((new Date()).getTime()/1000),matchTime;
	switch(Number(status_id)){
		case 0:
			return '异常';
		case 1:
			return '未';
		case 2:
			matchTime = parseInt((nowTime-time)/60)+1;
			return matchTime>45?"45+'":matchTime+"'" 
		case 3:
			return '中';
		case 4:
		case 5:
			matchTime = parseInt((nowTime-time)/60)+45+1;
			return matchTime>90?"90+'":matchTime+"'"
		case 7:
			return '点球';
		case 8:
			return '完';
		case 9:
			return '推迟';
		case 10:
			return '中断';
		case 11:
			return '腰斩';
		case 12:
			return '取消';
		case 13:
			return '待定'
	}
	
	
})

Vue.filter('removeChinese',str=>{
	return str.replace(/[^0-9]/ig, "");
})

Vue.filter('matchDivide',date=>{
	date = new Date(Number(date)*1000);
	let o = {
		'Y+':date.getFullYear(),
		'M+': date.getMonth() + 1>9?(date.getMonth() + 1):('0'+(date.getMonth() + 1)), // 月份
		'd+': date.getDate()>9?date.getDate():'0'+date.getDate(), // 日
	};
	let week = {
		"0": "日",
		"1": "一",
		"2": "二",
		"3": "三",
		"4": "四",
		"5": "五",
		"6": "六"
	};
	return o['Y+']+'年'+o['M+']+'月'+o['d+']+'日（星期'+week[date.getDay()+'']+'）';
})