<template>
    <div class="nodata">
        <img :src="logo" alt="">
        <p class="fsize14 mt10 center">{{text}}</p>
    </div>
</template>

<script>
export default {
    components:{},
    props:{
        text:{
            type:String,
            default:'暂无数据'
        },
        logo:{
            type:String,
            default:require('@/assets/img/nodata.png')
        }
    },
	data(){
		return {
			
		}
	},
}
</script>

<style lang="scss">
// @import '../assets/css/color';
.nodata{width:160px;margin:0 auto;padding:30px 0;}
</style>