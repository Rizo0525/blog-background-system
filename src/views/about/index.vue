<template>
    <div class="app-container">
        <div class="block">关于我</div>
        <el-input v-model="link" :disabled="edit===true?false:true"></el-input>
        <div class="block">
            <el-button type="primary" @click="editHandle" v-if="!edit">编辑</el-button>
            <el-button type="primary" @click="confirmHandle" v-else>修改</el-button>
        </div>
    </div>
</template>

<script>
import { getAbout,setAbout } from '@/api/about';
    export default {
        async created(){
            await this.fetchData()
        },
        methods:{
            async fetchData(){
                let resp = await getAbout()
                this.link = resp.data
                console.log(resp)
            },
            editHandle(){
                this.edit = true
            },
            async confirmHandle(){
                this.edit = false
                let resp = await setAbout({url:this.link})
                if(resp.code==0){
                    this.$message.success('修改成功')          
                }else{
                    this.$message.error('修改失败')
                }
            }
        },
        data(){
            return {
                link:'',
                edit:false
            }
        }
    }
</script>

<style lang="less" scoped>
.block{
    margin: 15px 0;
}
</style>