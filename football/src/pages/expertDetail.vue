<template>
  <div class="pt80">
    <my-header nav="4"></my-header>

    <div class="wid1200 marginauto f-cb pb50">
      <div class="fl bgfff radius4 expert-fl">
        <div class="fb fsize16 center lh46 home-lable mb10 bold">
          <div
            class="item-flex-1 cursor"
            :class="[{ on: item.id == type }]"
            v-for="item in typeList"
            :key="item.id"
            @click="type = item.id"
          >
            {{ item.name }}
          </div>
        </div>
        <!-- 正在推荐与历史推荐 (分页在组件里，点击分页穿过来请求数据再传回去)-->
        <!-- 正在推荐 -->
        <keep-alive>
          <article-list
            v-show="type == 1"
            ctype="1"
            :result="recommend1"
            @changePage="changePage1"
          ></article-list>
        </keep-alive>
        <!-- 历史推荐 -->
        <keep-alive>
          <article-list
            v-show="type == 2"
            ctype="1"
            :result="recommend2"
            @changePage="changePage2"
          ></article-list>
        </keep-alive>
      </div>

      <div class="fr expert-fr" v-if="detail.id">
        <div class="bgfff radius4 center pd22 pt30 pb20 mb30">
          <div class="rel home-expert-tx home-expert-tx1 marginauto mb15">
            <img :src="detail.avatar" class="img-cover radius img1 block" />
            <img src="../assets/img/home-ico2.png" class="abs img2" />
          </div>
          <div class="fsize18 mb10">{{ detail.nickName }}</div>

          <div class="fsize12 mb5">
            <!-- <div class="home-hot-tx rel ml5" v-if="detail.label">
              <div class="rel row1">{{ detail.label }}</div>
            </div>
            <div v-else>
              <div class="home-hot-tx rel ml5" v-if="detail.continueFocus >= 3">
                <div class="rel row1">{{ detail.continueFocus }}连红</div>
              </div>
              <div class="home-hot-tx rel ml5" v-if="detail.focus >= 10">
                <div class="rel row1">近20中{{ detail.focus }}</div>
              </div>
              <div
                class="home-hot-tx rel ml5"
                v-if="
                  (detail.continueFocus < 3 || detail.focus < 10) &&
                  detail.articleCount > 0 &&
                  detail.focusArticleCount > 0
                "
              >
                <div class="rel row1">
                  总{{ detail.articleCount }}中{{ detail.focusArticleCount }}
                </div>
              </div>
            </div> -->
            <div class="home-hot-tx rel ml5" v-if="detail.label">
                <div class="rel row1">{{detail.label}}</div>
              </div>
              <div class="home-hot-tx rel ml5" v-if="detail.continueFocus>=3">
                <div class="rel row1">{{detail.continueFocus}}连红</div>
              </div>
              <div class="home-hot-tx rel ml5" v-if="(!detail.label||detail.continueFocus<3)&&detail.focus>=10">
                <div class="rel row1">近20中{{detail.focus}}</div>
              </div>
              <div class="home-hot-tx rel ml5" v-if="((!detail.label&&detail.continueFocus<3)||(!detail.label&&detail.focus<10)||(detail.continueFocus<3&&detail.focus<10))&&detail.articleCount>0&&detail.focusArticleCount>0">
                <div class="rel row1">总{{detail.articleCount}}中{{detail.focusArticleCount}}</div>
              </div>
          </div>
          <div class="fsize12 co8b8b8b mb15">粉丝：{{ detail.collect }}</div>
          <div
            class="fsize12 radius2 cofff wid76 lh28 bgfea830 marginauto cursor mb10"
            :class="[{ hascollect: detail.isCollect == 1 }]"
            @click="toCollect"
          >
            <i class="el-icon-plus mr5" v-if="!detail.isCollect"></i
            >{{ detail.isCollect == 1 ? "已关注" : "关注" }}
          </div>
          <div class="expert-fr-box left co666 fsize12 lh20">
            {{ detail.intro }}
          </div>

          <article v-if="detail.articleCount>1">
            <div class="echarts-title flex fsize14 co666" v-if="detail.articleCount>10">
              <p class="">近10场：</p>
              <p class="coff261a">
                近10中{{ focusAvg[8].focus }}
                {{ focusAvg[8].focusArticleAvg * 100 }}%
              </p>
            </div>
            <div class="echarts-title flex fsize14 co666" v-else>
              <p class="">近{{detail.articleCount}}场：</p>
              <p class="coff261a">
                近{{detail.articleCount}}中{{detail.focusArticleCount}}
                {{ detail.focusArticleAvg * 100 }}%
              </p>
            </div>
            <div id="echarts-line"></div>
          </article>
        </div>
      </div>
    </div>

    <my-footer></my-footer>
  </div>
</template>
<script>
import Header from "../components/header";
import Footer from "../components/footer";
import articleList from "@/components/articleList";

export default {
  name: "index",
  components: {
    "my-header": Header,
    "my-footer": Footer,
    articleList,
  },
  data() {
    return {
      id: "",
      detail: {}, //专家详情
      focusAvg: [], //近几中几

      typeList: [
        { id: 1, name: "正在推荐" },
        { id: 2, name: "历史推荐" },
      ],
      type: 2,
      buyShow: false,
      fillShow: false,
      successShow: false,

      option: {
        xAxis: {
          type: "category",
          data: [],
          axisLabel: {
            interval: "auto",
          },
        },
        yAxis: [
          {
            type: "value",
            axisLabel: {
              margin: 2,
              show: true,
              interval: "auto",
              formatter: "{value} %",
            },
            show: true,
          },
        ],
        grid: {
          left: 45,
        },
        series: [
          {
            data: [],
            type: "line",
            smooth: true,
            label:{
              show:true,
              fontSize:7,
              formatter:params=>{
                return params.data+'%'
              }
            },
            areaStyle: {
              normal: {
                color: {
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#f28c93", // 0% 处的颜色
                    },
                    {
                      offset: 0.7,
                      color: "#ffffff", // 100% 处的颜色
                    },
                  ],
                  globalCoord: false, // 缺省为 false
                },
              },
            },
          },
        ],
      },
      recommend1: {},
      recommend2: {},
    };
  },
  created() {},
  mounted() {
    //console.log(this.$route.query.id,'专家id');
    this.id = this.$route.query.id;
    this.getDetail();
  },
  methods: {
    getDetail() {
      this.$fetch("/api/expert/expert_detail", { id: this.id }).then((res) => {
        //console.log(res,'专家详情')
        if (res.data.returnCode == "0000") {
          this.detail = res.data.data;
          this.focusAvg = res.data.data.articleCount>10?[...res.data.data.focusAvg].reverse().splice(0,9):[...res.data.data.focusAvg].reverse();
          this.option.xAxis.data = res.data.data.focusAvg.map(
            (item) => "近" + item.count + "场"
          );
          this.option.series[0].data = res.data.data.focusAvg.map(
            (item) => parseInt(item.focusArticleAvg * 100)
          );
          if(res.data.data.articleCount>1){
            this.$nextTick(() => {
              this.createEcharts();
            });
          }
          
        } else {
          this.$message(res.data.msg);
        }
      });
    },
    toCollect() {
      if (!this.$store.state.userInfo.token) {
        this.$store.commit("until/SET_LOGINSHOW", true);
        return;
      }
      let num = Number(this.detail.collect);
      if (this.detail.isCollect == 1) {
        //取消关注
        this.$fetch("/api/expert/collect_expert", {
          id: this.detail.id,
          type: 2,
        }).then((res) => {
          //console.log(res,'取消关注')
          if (res.data.returnCode == "0000") {
            this.$message({ message: "取关成功", type: "success" });
            this.detail.isCollect = 0;
            this.detail.collect = num - 1;
          }
        });
      } else {
        //关注
        this.$fetch("/api/expert/collect_expert", {
          id: this.detail.id,
          type: 1,
        }).then((res) => {
          //console.log(res,'关注')
          if (res.data.returnCode == "0000") {
            this.$message({ message: "收藏成功", type: "success" });
            this.detail.isCollect = 1;
            this.detail.collect = num + 1;
          }
        });
      }
    },
    createEcharts() {
      let myChart = this.$echarts.init(document.getElementById("echarts-line"));
      myChart.setOption(this.option);
    },
    //正在推荐2
    changePage1(page, limit) {
      //console.log(page,limit,'1')
      this.getRecommend(2, page, limit);
    },
    //历史推荐3
    changePage2(page, limit) {
      //console.log(page,limit,'2')
      this.getRecommend(3, page, limit);
    },
    getRecommend(type, page, limit) {
      const id = this.$route.query.id;
      this.$fetch("/api/expert/expert_detail_article", {
        type,
        page,
        limit,
        id,
      }).then((res) => {
        //console.log(res,'推荐')
        if (res.data.returnCode == "0000") {
          if (type == 2) this.recommend1 = res.data.data;
          if (type == 3) this.recommend2 = res.data.data;
        }
      });
    },
  },
};
</script>

<style lang="scss">
@import "../assets/css/index";
body {
  background: $bodyBg;
}
.echarts-title {
  height: 50px;
  border-top: 1px solid #e2e2e2;
}
#echarts-line {
  // width: 100%;
  width:400px;
  height: 250px;
  margin-top: -50px;
  margin-left:-20px;
}

.hascollect {
  background: #cecece;
  color: #666;
}
</style>
