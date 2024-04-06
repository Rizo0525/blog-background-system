<template>
    <div class="app-container">
        <div class="block">文章标题</div>
        <div style="margin-bottom: 15px;">
            <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
        </div>
        <div class="block">文章编辑</div>
        <editor :initialValue="form.editorText" height="600px" ref="editor"></editor>
        <div class="block">文章描述</div>
        <el-input v-model="form.description" type="textarea" :rows="6"></el-input>
        <div class="block">文章头图</div>
        <Upload v-model="form.thumb"></Upload>
        <div class="block">选择分类</div>
        <el-select v-model="form.selected" placeholder="请选择文章分类" @change="changeHandle">
            <el-option v-for="item in blogTypes" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
        </el-select>
        <div>
            <el-button type="primary" style="margin-top: 15px;" @click="updateArticle">更新文章</el-button>
        </div>
    </div>
</template>

<script>
import '@toast-ui/editor/dist/toastui-editor.css';

import { Editor } from '@toast-ui/vue-editor';
import Upload from '@/components/Upload';
import { getBlog,getBlogTypes,editBlog} from '@/api/blog';
import {upload} from '@/api/upload.js'

export default {
    data() {
        return {
            form: {
                title: '',
                editorText: '',
                description: '',
                thumb: '',
                selected:''
            },
            blogTypes:[]
        }
    },
    components: {
        Editor, Upload
    },
    async created() {
        let resp1 = await getBlogTypes()
        this.blogTypes = resp1.data
        // console.log(this.id)
        let resp = await getBlog(this.id)
        console.log(resp)
        // this.blog = resp.data
        this.form = resp.data
        this.form.selected = this.form.category === null ? '' : this.form.category.id
        this.$refs.editor.invoke(`setHTML`,this.form.htmlContent);
        
    },
    computed:{
        id(){
            return this.$route.params.id
        }
    },
    mounted(){
        this.$refs.editor.editor.eventEmitter.removeEventHandler('addImageBlobHook')
        this.$refs.editor.editor.eventEmitter.listen('addImageBlobHook',async (blob,callback)=>{
            const formData = new FormData()
            // console.log(blob)
            formData.append('file',blob,blob.name)
            let resp = await upload(formData)
            // console.log(resp)
            callback(resp.data)
        })
    },
    methods:{
        changeHandle(){
            this.$forceUpdate()
        },
        async updateArticle(){
            let html = this.$refs.editor.invoke('getHTML');
            let markdown = this.$refs.editor.invoke('getMarkdown');
            // console.log(html)
            let obj = {
                title:this.form.title,
                description:this.form.description,
                createDate:new Date().getTime(),
                categoryId:this.form.selected,
                toc:[],
                htmlContent:html,
                thumb:this.form.thumb,
                markdownContent:markdown,
            }
            if(obj.title && obj.description && obj.htmlContent && obj.categoryId){
                let resp = await editBlog({id:this.id,data:obj})
                console.log(resp)
                if(resp.code===0){
                    //发布成功
                    this.$message.success('文章更新成功')
                    this.$router.push('/blogmanage/blogList')
                }else{
                    this.$message.error('文章更新失败')
                }
            }
        },
    }
}
</script>

<style lang="less" scoped>
.block {
    margin: 15px 0;
    font-weight: 100;
}
</style>