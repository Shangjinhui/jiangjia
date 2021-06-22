<template>
    <div v-html="textarea"></div>
</template>

<script>
export default {
    components:{},
    props:{
        id:{
            type:String,
            default:''
        }
    },
	data(){
		return {
			textarea:''
		}
    },
    mounted(){
        this.getText();
    },
    methods:{
        getText(){
            this.$fetch('/api/common/get_page',{id:this.id}).then(res=>{
                if(res.data.returnCode == '0000'){
                    this.textarea = res.data.data.content;
                }else{
                    this.$message(res.data.msg);
                }
            })
        }
    }
}
</script>

<style lang="scss">

</style>