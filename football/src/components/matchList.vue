<template>
<div>
	<table class="match-table">
		<tr :class="['fsize12 cursor ',{'bor-bof5f5f5':index!=4},{'on':item.note},{'bgf5f5f5':index%2!=0&&ctype==2}]" v-for="(item,index) in list" :key="index">
			<div class="divide-time fsize18 co666 center" v-if="(myCollect==0||myCollect==1)&&item.divide_time">{{item.match_time|matchDivide}}</div>
			<div v-if="myCollect!=4||item.isCollect==1">

				<td width="70"><img src="../assets/img/home-ico1.png" class="opa2 wid16 img1"></td>
				<td width="96" class="co333"><span v-if="ctype==2&&myCollect!=0&&myCollect!=1">{{item.match_time|monthDay}}</span> <span class="color">{{item.match_time|hourMinute}}</span></td>
				<td width="90" class="co8b8b8b">{{item.competition_name}}</td>
				<td width="70" class="co8b8b8b pl5 ">{{item.startBallTime|jiao(item.status_id)}}</td>
				<td width="130" class="right pl5">
					<span class="bgffb519 cofff pl2 pr2 mr5" v-if="item.home_scores[3]&&item.home_scores[3]!=0">{{item.home_scores[3]}}</span>
					<span class="bgE71415 cofff pl2 pr2 mr5" v-if="item.home_scores[2]&&item.home_scores[2]!=0">{{item.home_scores[2]}}</span>
					<span class="col999 mr5" v-if="item.home_position">[{{item.home_position|removeChinese}}]</span>
					<span>{{item.home_team_name}}</span>
				</td>
				<td width="35" class="center"><img :src="item.home_team_logo||require('@/assets/img/tx.png')" class="img2 img-contain"></td>
				<td width="65" class="center rel">
					<div class="co8b8b8b" v-if="item.status_id==1||item.status_id==9">V S</div>
					<div class="color" v-else>{{item.home_scores[0]}}-{{item.away_scores[0]}}</div>
					<!-- <div class="co8b8b8b" v-if="isVs==1||myCollect==2">VS</div>
					<div class="color" v-else-if="item.home_scores[0]!=0||item.away_scores[0]!=0">{{item.home_scores[0]}}-{{item.away_scores[0]}}</div>
					<div class="color" v-else>-</div> -->
					<div class="match-lable" v-if="item.note">{{item.note}}</div>
				</td>
				<td width="35" class="center"><img :src="item.away_team_logo||require('@/assets/img/tx.png')" class="img2 img-contain"></td>
				<td width="130" class="pr5">
					<span>{{item.away_team_name}}</span>
					<span class="col999 ml5" v-if="item.away_position">[{{item.away_position|removeChinese}}]</span>
					<span class="bgE71415 cofff pl2 pr2 ml5" v-if="item.away_scores[2]&&item.away_scores[2]!=0">{{item.away_scores[2]}}</span>
					<span class="bgffb519 cofff pl2 pr2 ml5" v-if="item.away_scores[3]&&item.away_scores[3]!=0">{{item.away_scores[3]}}</span>
				</td>
				<td width="125" class="co666 center" v-if="item.home_scores[1]!=0||item.away_scores[1]!=0||(item.status_id!=1&&item.status_id!=9)">半：{{item.home_scores[1]}}-{{item.away_scores[1]}}</td>
				<td width="125" class="co666 center" v-else>半： - </td>
				<td width="125" class="co666 center" v-if="item.home_scores[4]!=0||item.away_scores[4]!=0||(item.status_id!=1&&item.status_id!=9)">角：{{item.home_scores[4]}}-{{item.away_scores[4]}}</td>
				<td width="125" class="co666 center" v-else>角： - </td>
				<td width="194" :class="['coc2c2c2 right',{'pr24':ctype==2}]">
					<i class="el-icon-arrow-right" v-if="ctype==1||myCollect==3"></i>
					<div v-else @click="toCollect(item.match_id,index)">
						<img v-if="item.isCollect == 1" src="../assets/img/match-ico6.png" alt="">
						<img v-else src="../assets/img/match-ico5.png" alt="">
					</div>
					
				</td>
				
			</div>
			
		</tr>
	</table>
	<no-data v-if="list.length==0"></no-data>
</div>
	
</template>

<script>
import noData from '@/components/noData'
export default {
	components:{noData},
	props:{
		list: {
			type: Array,
			// default: function () { return [] }
			default: () => []
		},
		ctype:{
			type:String,
			default:'' //1首页2赛事主页
		},
		myCollect:{            //赛事类型
			type:String,
			default:'0' //4赛事里的我的关注3赛事里的赛果2赛事里的赛程1进行中0全部
		},
		// isVs:{
		// 	type:String,
		// 	default:'0'  //未开始的比赛只需vs不需0-0,1为未开始
		// }
	},
	data(){
		return {
		}
	},
	computed:{

	},
	methods:{
		toCollect(id,index){
			if(!this.$store.state.userInfo.token){
				this.$store.commit('until/SET_LOGINSHOW',true);
				return;
			}
			this.$fetch('/api/football/collect',{matchId:id},'POST').then(res=>{
				//console.log(res,'关注比赛')
				if(res.data.returnCode == '0000'){
					let isCollect = this.list[index].isCollect;
					this.list[index].isCollect = isCollect==1?0:1;
					this.$message({message:isCollect==1?'取消成功':'关注成功',type:'success'});
				}else{
					this.$message(res.data.msg);
				}
			})
		}
	},
	created(){},
	watch:{

	},
	mounted(){
		//console.log(this.list)
	}
}
</script>

