<template>
	<div class="pt148">
		<my-header nav="3"></my-header>

		<div class="bgfff match-top">
			<div class="wid1200 marginauto f-cb">
				<div :class="['fl match-top-con tra',{'on':item.id==type}]" @click="changeType(item.id)" v-for="(item,index) in typeList" :key="index">{{item.name}}</div>

				<div class="fr match-top-con tra">
				<el-popover
						placement="bottom"
						width="400"
						trigger="click"
						ref="popover">
					<div class="">
						<div class="match-pop-box bor-boc6c6c6" v-if="chooseType==0">
							<div class="rel match-pop" v-for="(item,index) in chooseTypeList[chooseType].list" :key="index">
								<div v-if="item.list.length>0">
									<div class="tx">{{item.first_char}}</div>
									<div class="f-cb match-pop-con">
										<div :class="['fl mr10 mb5 cursor',{'on':ids.indexOf(item2.competition_id)!=-1}]" v-for="(item2,index2) in item.list" :key="index2" @click="chooseMatchItem(item2.competition_id)"><span><i class="el-icon-check"></i></span>{{item2.short_name_zh}}</div>
									</div>
								</div>

							</div>
						</div>
						<div class="match-pop-box bor-boc6c6c6" v-else>
							<div class="rel match-pop">
								<!-- <div class="tx">{{item.first_char}}</div> -->
								<div class="f-cb match-pop-con">
									<div :class="['fl mr10 mb5 cursor',{'on':ids.indexOf(item.competition_id)!=-1}]" v-for="(item,index) in chooseTypeList[chooseType].list" :key="index" @click="chooseMatchItem(item.competition_id)"><span><i class="el-icon-check"></i></span>{{item.short_name_zh}}</div>
								</div>
							</div>
						</div>

						<div class="f-cb pl10 pr10 pt10 pb10">
							<div :class="['fl cursor match-pop-btn tra',{'on':item.id==chooseType}]" v-for="(item,index) in chooseTypeList" :key="index" @click="changeMatchTab(item.id)">{{item.name}}</div>
						</div>
						<div class="bgf5f5f5 lh46 fb">
							<div class="item-grow-1 fb-cross-center cursor hover center" @click="quanXuan">全选</div>
							<div class="item-grow-1 fb-cross-center cursor hover center" @click="backXuan">反选</div>
							<div class="item-grow-1 fb-cross-center cursor hover center" @click="confirm">确定</div>
							<div class="item-grow-1 fb-cross-center cursor hover center" @click="close">取消</div>
						</div>
					</div>
					<el-button slot="reference">选择赛事 <i class="el-icon-arrow-down"></i></el-button>
				</el-popover>
				</div>
			</div>
		</div>

		<div class="wid1200 marginauto mh850">
			<!-- 时间选择 赛程赛果有-->
			<div class="bgfff radius4 f-cb mb20 match-date" v-if="type ==2||type ==3">
				<div class="fl cursor hover match-date-con" :class="[{'on':date ==item.date}]" v-for="(item,index) in dateList" :key="index" @click="chooseDate(item.date)">
					<div class="fsize12 mb5 co999">{{item.showDate}}</div>
					<div class="fsize16">{{nowDate==item.date?'今天':item.name}}</div>
				</div>
				<div class="fl  cursor match-date-con match-date-con1 fsize16 center">
					<i class="el-icon-date mr5 co999 fsize18"></i>日历 <i class="el-icon-arrow-down ml5 co999"></i>
					<el-date-picker
							v-model="date"
							type="date"
							value-format="yyyy-MM-dd"
							placeholder="选择日期"
							@change="chooseDate">
					</el-date-picker>
				</div>
			</div>


			<div class=" bgfff pd15 radius4 pt15 pb20 mb30 minhei550">
				<table class="match-table bgf5f5f5 lh36 co666">
					<tr >
						<td width="166" class="center">时间</td>
						<td width="90">赛事</td>
						<td width="70" class="pl5">状态</td>
						<td width="165" class="right pl5">主场球队</td>
						<td width="70" class="center">比分</td>
						<td width="165" class="pr5">客场球队</td>
						<td width="125" class=" center">半场</td>
						<td width="125" class=" center">角球</td>
						<td class="right pr24">{{type!=3?'关注':''}}</td>
					</tr>
				</table>

				<keep-alive>
				<div class="" v-if="type==0">
					<div v-if="nowList.length>0">
						<div class="center fsize18 color match-tit">
							<img src="../assets/img/match-ico1.png" alt="">正在进行中的比赛
						</div>
						<my-matchList ctype="2" myCollect="0" :list="page*limit<nowList.length&&!showAll?nowList.slice(0,page*limit):nowList"></my-matchList>
					</div>
					
					<div v-if="noStartList.length>0&&(showAll||page*limit>nowList.length)">
						<div class="center fsize18 co1b8ee7 match-tit">
							<img src="../assets/img/match-ico2.png" alt="">未开始的比赛
						</div>
						<my-matchList ctype="2" myCollect="0" :list="page*limit<nowList.length+noStartList.length&&!showAll?noStartList.slice(0,page*limit-nowList.length):noStartList"></my-matchList>
					</div>
					
					<div v-if="tomorrowList.length>0&&(showAll||page*limit>nowList.length+noStartList.length)">
						<div class="center fsize18 cobb53eb match-tit">
							<img src="../assets/img/match-ico4.png" alt="">{{tomorrowDate}}
						</div>
						<my-matchList ctype="2" myCollect="0" :list="page*limit<nowList.length+noStartList.length+tomorrowList.length&&!showAll?tomorrowList.slice(0,page*limit-nowList.length-noStartList.length):tomorrowList"></my-matchList>
					</div>
					
					<div v-if="overList.length>0&&(showAll||page*limit>nowList.length+noStartList.length+tomorrowList.length)">
						<div class="center fsize18 co999 match-tit">
							<img src="../assets/img/match-ico3.png" alt="">已结束的比赛
						</div>
						<my-matchList ctype="2" myCollect="0" :list="showAll?overList:overList.slice(0,page*limit-nowList.length-noStartList.length-tomorrowList.length)"></my-matchList>
					</div>
					<p class="center mt20 color cursor" v-if="nowList.length+noStartList.length+tomorrowList.length+overList.length>page*limit&&!showAll" @click="showAll=true">查看更多 ></p>
					<no-data v-if="nowList.length==0&&noStartList.length==0&&tomorrowList.length==0&&overList.length==0"></no-data>
				</div>
				</keep-alive>

				<keep-alive>
					<div v-if="type!=0">
						<my-matchList ctype="2" :myCollect="type" :list="list.slice(0,page*limit)"></my-matchList>
						<p class="center mt20 color cursor" v-if="list.length>page*limit" @click="page++">查看更多 ></p>
					</div>
				</keep-alive>
			</div>
		</div>




		<my-footer></my-footer>

	</div>

</template>
<script>
import Header from "../components/header";
import MatchList from "../components/matchList";
import Footer from "../components/footer";
import noData from '@/components/noData'
export default {
	name: 'index',
	components: {
		"my-header": Header,
		"my-matchList": MatchList,
		"my-footer": Footer,
		noData
	},
	data() {
		return {
			bannerList:[],
			typeList: [                   //tab1
				{ id: '0', name: '全部' },
				{ id: '1', name: '进行中' },
				{ id: '2', name: '赛程' },
				{ id: '3', name: '赛果' },
				{ id: '4', name: '关注' },

			],
			type:0,
			chooseTypeList:[              //tab2     list为对应的赛事列表
				{ id: 0, name: '完整' ,list:[]},
				{ id: 1, name: '一级' ,list:[]},
				{ id: 2, name: '竞彩' ,list:[]},
				{ id: 3, name: '北单' ,list:[]},
				{ id: 4, name: '足彩' ,list:[]}
			],
			chooseType:0,

			dateList:[                  //时间选择tab
				{ date:'9.10' },
			],
			matchList:[],              //赛事选择tab
			nowDate:'',//当前时间
			date:'',//选中日期（赛程赛果可选择日期）
			list:[],     //
			nowList:[],   //全部下正在进行中的比赛
			noStartList:[],     //全部下未开始的比赛
			tomorrowList:[],    //全部下明天的比赛
			tomorrowDate:'',
			overList:[],        //全部下已结束的比赛
			showAll:false,     //是否展开全部下全部比赛

			page:1,             
			limit:20,
			// nowList_page:1,
			// noStartList_page:1,
			// tomorrowList_page:1,
			// overList_page:1,

			idsAll:[],            //当前chooseType下的全部id
			ids:[],              //要查询的赛事id列表
			timer:null,
		};
	},
	created() {

	},
	mounted() {
		this.nowDate = this.date=this.$public.fmtDate(new Date(), 'yyyy-MM-dd',2)
		this.getAllPage();
		this.getMatchList();
	},
	methods: {
			chooseMatchItem(id){
				let ids = [...this.ids];
				if(ids.indexOf(id)==-1){
					ids.push(id);
				}else{
					ids.splice(ids.indexOf(id),1);
				}
				this.ids = ids.length==0?[-1]:ids;
			},
			//全选
			quanXuan(){
				//console.log(this.chooseTypeList[this.chooseType],'---------')
				let list = this.chooseTypeList[this.chooseType].list,ids=[];
				if(this.chooseType==0){
					for(let i=0;i<list.length;i++){
						for(let j=0;j<list[i].list.length;j++){
							ids.push(list[i].list[j].competition_id)
						}
					}
				}else{
					for(let i=0;i<list.length;i++){
						ids.push(list[i].competition_id)
					}
				}
				
				//console.log(ids,'ids');
				this.ids = ids;
				this.idsAll = ids;
			},
			//反选
			backXuan(){
				let idsAll = this.idsAll,ids = this.ids,arr=[];
				//console.log(idsAll,ids)
				for(let i=0;i<idsAll.length;i++){
					if(ids.indexOf(idsAll[i])==-1) arr.push(idsAll[i])
				}
				this.ids = arr.length==0?[-1]:arr;
			},
			confirm(){
				if(this.type==0){
					this.getAllPage();
				}else{
					this.getData();
				}
				
				this.$refs['popover'].doClose();
			},
			close(){
				this.$refs['popover'].doClose();
			},
			changeMatchTab(id){
				this.chooseType = id;
				
				this.quanXuan();
			},
			getMatchList(){
				let data = {
					type:this.type,
					date:this.date
				}
				this.$fetch('/api/football/filter_list',data,'GET',false).then(res=>{
					//console.log(res,'选择赛事列表')
					if(res.data.returnCode=='0000'){
						let data = res.data.data;
						
						this.chooseTypeList[0].list = data.competition_list;
						this.chooseTypeList[1].list = data.competition_yj;
						this.chooseTypeList[2].list = data.competition_jc;
						this.chooseTypeList[3].list = data.competition_bd;
						this.chooseTypeList[4].list = data.competition_zc;

						this.quanXuan();
					}else{
						this.$message(res.data.msg)
					}
				})
			},
			createTime(){
				let type=this.type;	
				if (type == '2') {
					// 赛程前七天日期
					let dateList = [];
					for (let i = 0; i < 7; i++) {
						dateList.push({
							date: this.getAnyDay('-', i),
							name: '星期' + this.$public.fmtDate(this.getAnyDay('-', i), 'E',1),
							showDate: this.getAnyDay('-', i).substring(5, 10)
						})
					}
					this.dateList=dateList;
					//console.log(dateList,'-------------')
				} else if (type == '3') {
					// 赛果前七天日期
					let dateList = [];
					for (let i = 0; i < 7; i++) {
						dateList[6 - i] = {
							date: this.getAnyDay('-', -i),
							name: '星期' + this.$public.fmtDate(this.getAnyDay('-', -i), 'E',1),
							showDate: this.getAnyDay('-', -i).substring(5, 10)
						}
					}
					this.dateList=dateList;
				}
			},
			chooseDate(date){
				this.date = date;
				this.getMatchList();
				this.getData();
			},
			// 全部的话调三个接口  今日，明日，已结束
			getAllPage(load=true){
				clearTimeout(this.timer);

				let data = {
					competition:this.ids.join(',')
				}
				//今日
				this.$fetch('/api/football/today_list',data,'GET',load).then(res=>{
					if(res.data.returnCode=='0000'){
						let data = res.data.data;
						let nowList = [],noStartList = [];
						for(let i=0;i<data.today_list.length;i++){
							if(data.today_list[i].status_id == 1){
								noStartList.push(data.today_list[i]);
							}else if(data.today_list[i].status_id<=7&&data.today_list[i].status_id>=2){
								nowList.push(data.today_list[i]);
							}
						}
						//console.log(nowList,noStartList)
						// this.nowList = nowList;
						// this.noStartList = noStartList;
						this.divideTime('nowList',nowList);
						this.divideTime('noStartList',noStartList);
					}else{
						this.$message(res.data.msg)
					}
				})
				//明日
				this.$fetch('/api/football/tomorrow_list',data,'GET',load).then(res=>{
					if(res.data.returnCode=='0000'){
						let data = res.data.data;
						this.tomorrowList = data.tomorrow_list;
						this.tomorrowDate = data.tomorrow_date;
					}else{
						this.$message(res.data.msg)
					}
				})
				//已结束
				this.$fetch('/api/football/end_list',data,'GET',load).then(res=>{
					if(res.data.returnCode=='0000'){
						let data = res.data.data;
						//this.overList = data.end_list;
						this.divideTime('overList',data.end_list);
					}else{
						this.$message(res.data.msg)
					}
				})

				this.timer = setTimeout(()=>{
					this.getAllPage(false);
				},60000)
			},
			//进行中的，赛程，赛果，关注用这个接口
			getData(load=true){
				clearTimeout(this.timer);

				let data = {
					type:this.type,
					date:this.date,
					competition:this.ids.join(',')
				}
				
				this.$fetch('/api/football/list',data,'GET',load).then(res=>{
					//console.log(res,'比赛列表')
					if(res.data.returnCode=='0000'){
						let data = res.data.data;
						// if(this.type == 0){//全部
						// 	let nowList = [],noStartList = [];
						// 	//筛选正在进行的和未开始的
						// 	for(let i=0;i<data.today_list.length;i++){
						// 		if(data.today_list[i].status_id == 1){
						// 			noStartList.push(data.today_list[i]);
						// 		}else if(data.today_list[i].status_id<=7&&data.today_list[i].status_id>=2){
						// 			nowList.push(data.today_list[i]);
						// 		}
						// 	}
						// 	this.nowList = nowList;
						// 	this.noStartList = noStartList;
						// 	this.tomorrowList = data.tomorrow_list;
						// 	this.tomorrowDate = data.tomorrow_date;
						// 	this.overList = data.end_list;
						// }else{
						// 	this.list = res.data.data.list;
						// }
						if(this.type==1){
							this.divideTime('list',res.data.data.list);
						}else{
							this.list = res.data.data.list;
						}
					}else{
						this.$message(res.data.msg)
					}
				})

				this.timer = setTimeout(()=>{
					this.getData(false);
				},60000)
			},
			//全部下和进行中的比赛要添加日期间隔
			divideTime(name,list){
				if(list.length==0){
					this[name] = [];
					return;
				}
				//先排序
				list.sort(this.compare('match_time'));
				//第一个数据判断是否为当天，不是在展示
				let oneDate = new Date(list[0].match_time*1000),thisDate = new Date();
				if(oneDate.getMonth()!=thisDate.getMonth()||(oneDate.getMonth()==thisDate.getMonth()&&oneDate.getDate()!=thisDate.getDate())){
					list[0].divide_time = true;
				}
				//list[0].divide_time = true;
				//找日期差
				for(let i=1;i<list.length;i++){
					let nowDate = new Date(list[i].match_time*1000),lastDate = new Date(list[i-1].match_time*1000);
					//console.log(name,nowDate.getMonth()+1,nowDate.getDate())
					list[i].divide_time = false;
					if(nowDate.getMonth()!=lastDate.getMonth()||(nowDate.getMonth()==lastDate.getMonth()&&nowDate.getDate()!=lastDate.getDate())){
						list[i].divide_time = true;
					}
				}
				this[name] = list;
			},
			compare(property){
				return function(a,b){
					var value1 = a[property];
					var value2 = b[property];
					return value1 - value2;
				}
			},
			changeType(id){
				if(id == this.type) return;
				//查看我的关注比赛需登录
				if(id==4&&!this.$store.state.userInfo.token){
					this.$store.commit('until/SET_LOGINSHOW',true);
					return;
				}
				this.type = id;
				this.page = 1;
				this.showAll = false;
				this.date = this.nowDate;

				//切换类型，选择赛事置空，空表示全部
				this.ids = [];
				this.idsAll = [];

				this.getMatchList();				
				this.createTime();
				if(id==0){
					this.getAllPage();
				}else{
					this.getData();
				}


			},
			// //获取之前N天(n<0)或者之后N天(n>0)
			getAnyDay(symbol, n) {
				symbol = symbol || '-';
				let nowDate = new Date();
				nowDate = nowDate.setDate(nowDate.getDate() + n);
				nowDate = new Date(nowDate);
				let y = nowDate.getFullYear(),
					m = nowDate.getMonth() + 1,
					d = nowDate.getDate();
				m = m < 10 ? '0' + m : m;
				d = d < 10 ? '0' + d : d;
				return y + symbol + m + symbol + d;
			},


		// changeType:function( type )
		// {
		// 	var _this=this
		// 	_this.type =type

		// 	if (type == 3) {
		// 		// 赛程后七天日期
		// 		let dateList = [];
		// 		for (let i = 0; i < 7; i++) {
		// 			dateList.push({
		// 				date: _this.getAnyDay('-', i),
		// 				name: '星期' + _this.$public.fmtDate(_this.getAnyDay('-', i), 'E',1),
		// 				showDate: _this.getAnyDay('-', i).substring(5, 10)
		// 			})
		// 		}
		// 		_this.dateList=dateList;

		// 	} else if (type == 4) {
		// 		// 赛果前七天日期
		// 		let dateList = [];
		// 		for (let i = 0; i < 7; i++) {
		// 			dateList[6 - i] = {
		// 				date: _this.getAnyDay('-', -i),
		// 				name: '星期' + _this.$public.fmtDate(_this.getAnyDay('-', -i), 'E',1),
		// 				showDate: _this.getAnyDay('-', -i).substring(5, 10)
		// 			}
		// 		}
		// 		_this.dateList=dateList;

		// 	}
		// },

		// getList(){
		// 	const _this = this;

		// 	this.getData('goods/program','get','').then(res=>{
		// 		if(res.data.returnCode=='0000'){
		// 			const data=res.data.data;
		// 			_this.list=data.goods_program_list;
		// 			_this.bannerList=data.banner;
		// 			_this.articleList=data.article_list;
		// 			_this.aboutImg=data.about.photo;
		// 			_this.onLoad=true;
		// 		}else{
		// 			this.$toast(res.data.data.msg)
		// 		}
		// 	})
		// },
	}
};

</script>

<style lang="scss">
	@import '../assets/css/color';
	@import '../assets/css/index';

	body{
		background: $bodyBg;
	}
	.pt148{
		padding-top:148px;
	}
	.el-popover{
		padding: 10px 0 0;
	}
	img{
		display:inline-block;
	}
</style>
