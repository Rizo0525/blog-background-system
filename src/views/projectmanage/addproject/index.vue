<template>
    <div class="app-container">
        <el-form :model="form" label-position="top">
            <el-form-item label="名称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="项目描述（每一项描述以英文逗号分隔）">
                <el-input v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item label="项目链接">
                <el-input v-model="form.url"></el-input>
            </el-form-item>
            <el-form-item label="github地址">
                <el-input v-model="form.github"></el-input>
            </el-form-item>
            <el-form-item label="预览图地址">
                <Upload v-model="form.thumb"></Upload>
            </el-form-item>
            <el-form-item label="排序等级">
                <el-select v-model="form.order" placeholder="请选择项目等级">
                    <el-option v-for="item in options" :key="item" :label="item" :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="text-align: right;">
                <el-button type="primary" @click="submitProjectHandle">发布项目</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import Upload from '@/components/Upload'
import {addProject} from '@/api/project'
export default {
    data() {
        return {
            form: {
                name: '',
                description: '',
                url: '',
                github: '',
                thumb: '',
                order: ''
            },
            options: [1, 2, 3, 4, 5]
        }
    },
    methods:{
        async submitProjectHandle(){
            let obj = {...this.form}
            obj.description = obj.description.split(',')
            let resp = await addProject(obj)
            if(resp.code === 0){
                this.$message.success('添加项目成功')
                this.$router.push('/projectmanage/projectlist')
            }else{
                this.$message.error('添加项目失败')
            }
        }
    },
    components: {
        Upload
    }
}
</script>

<style lang="less" scoped></style>