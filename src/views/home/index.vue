<template>
    <div class="app-container" style="position: relative;">
        <el-table :data="data" border style="width: 100%">
            <el-table-column type="index" label="序号" width="50">
                <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" width="150" align="center"></el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
            <el-table-column prop="description" label="中图预览" align="center">
                <template slot-scope="scope">
                    <el-image style="width: 100px; height: 100px" :src="scope.row.midImg" fit="cover"></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="description" label="大图预览" align="center">
                <template slot-scope="scope">
                    <el-image style="width: 100px; height: 100px" :src="scope.row.bigImg" fit="cover"></el-image>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="Top Center 提示文字" placement="top" :hide-after="2000">
                        <el-button type="primary" icon="el-icon-edit" circle size="mini"
                            @click="editBanner($event,scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="修改信息" :visible.sync="dialogFormVisible" top="5vh" @keyup.enter.native="editBannerConfirm">
            <el-form :model="form">
                <el-form-item label="标题">
                    <el-input v-model="form.title" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.description" autocomplete="off"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="首页中图">
                            <!-- <Upload :value="form.midImg"></Upload> -->
                            <Upload v-model="form.midImg"></Upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="首页大图">
                            <Upload v-model="form.bigImg"></Upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editBannerConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getBanners,setBanner } from '@/api/banner'
// import { server_URL } from '@/urlConfig'
import Upload from '@/components/Upload/index.vue'
export default {
    data() {
        return {
            data: [],
            dialogFormVisible: false,
            form: {
                id:'',
                midImg: '',
                bigImg: '',
                title: '',
                description: ''
            },
            formLabelWidth: '120px'
        }
    },
    created() {
        this.fetchData()
    },
    methods: {
        async fetchData() {
            let resp = await getBanners()
            this.data = resp.data
            // this.data.forEach(value => {
            //     value.midImg2 = server_URL + value.midImg
            //     value.bigImg2 = server_URL + value.bigImg
            // })
        },
        editBanner(event,scope) {
            this.form = { ...scope }
            this.dialogFormVisible = true
        },
        async editBannerConfirm(){
            // console.log(this.form)
            let arr = [...this.data]
            for(let i=0;i<arr.length;i++){
                if(arr[i].id === this.form.id){
                    arr[i] = this.form
                }
            }
            await setBanner(arr)
            this.dialogFormVisible = false
            this.$message({
                message:'修改banner成功',
                type:'success'
            })
            this.fetchData()
        }
    },
    components: {
        Upload
    }
}
</script>

<style lang="less" scoped></style>