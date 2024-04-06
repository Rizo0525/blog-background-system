<template>
    <div class="app-container">
        <el-table :data="projects" style="width:100%" border>
            <el-table-column label="序号" prop="" align="center" width="80">
                <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column label="项目名称" prop="name" align="center">
                <template slot-scope="scope">
                    <a :href="scope.row.url" target="_blank">{{ scope.row.name }}</a>
                </template>
            </el-table-column>
            <el-table-column label="项目描述" prop="" align="center">
                <template slot-scope='scope'>
                    {{ scope.row.description.toString() }}
                </template>
            </el-table-column>
            <el-table-column label="预览图" prop="" align="center" width="150">
                <template slot-scope="scope">
                    <!-- <el-popover class="item" title="项目预览图" trigger="hover" content="aaa" placement="bottom" width="200">
                        <slot>
                            <el-image style="width: 100%; height: 100%" :src="scope.row.thumb1" fit="cover"
                                :preview-src-list="srcList"></el-image>
                        </slot>
                        <el-image style="width: 100%; height: 100%" :src="scope.row.thumb1" fit="cover"
                                :preview-src-list="srcList" slot="reference"></el-image>
                    </el-popover> -->
                    <el-image style="width: 120px;" :src="scope.row.thumb" fit="cover"
                        :preview-src-list="srcList"></el-image>
                </template>
            </el-table-column>
            <el-table-column label="操作" prop="" align="center" width='150'>
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="github" placement="top" :hide-after="2000">
                        <el-button icon="iconfont icon-github" circle size="mini"
                            @click="goToGithubHandle(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top" :hide-after="2000">
                        <el-button type="primary" icon="el-icon-edit" circle size="mini"
                            @click="editProjectHandle(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top" :hide-after="2000">
                        <el-button type="danger" icon="el-icon-delete" circle size="mini"
                            @click="deletProjectHandle(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="请编辑该项目信息" :visible.sync="dialogVisible" :fullscreen="true">
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
                    <el-select v-model="form.order">
                        <el-option v-for="item in options" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmEditProjectHandle">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getProject, addProject, updateProject, deleteProject } from '@/api/project';
import { server_URL } from '@/urlConfig';
import Upload from '@/components/Upload'
export default {
    data() {
        return {
            projects: [],
            srcList: [],
            dialogVisible: false,
            form: {
                description: '',
                name: '',
                url: '',
                github: '',
                thumb: '',
                order: '',
            },
            options: [1, 2, 3, 4, 5]
        }
    },
    async created() {
        await this.fetchData()
    },
    methods: {
        async fetchData() {
            let resp = await getProject()
            this.projects = resp.data
            console.log(this.projects)
            this.projects.forEach(item => {
                // item.thumb1 = server_URL + item.thumb
                // console.log(item.url)
                this.srcList.push(item.thumb)
            })
        },
        goToGithubHandle(project) {
            window.open(project.github)
        },
        async confirmEditProjectHandle(){
            let obj = {...this.form}
            obj.description = this.form.description.split(',')
            let resp = await updateProject(obj.id,obj)
            if(resp.code === 0){
                this.$message.success('更新项目成功')
            }else{
                this.$message.success('更新项目失败')
            }
            await this.fetchData()
            console.log(this.projects)
            this.dialogVisible = false
        },
        editProjectHandle(project) {
            this.form = project
            this.form.description = this.form.description.toString()
            // console.log(this.form)
            this.dialogVisible = true
        },
        async deletProjectHandle(project) {
            // console.log(project)
            this.$confirm('是否删除该项目, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await deleteProject(project.id)
                await this.fetchData()
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    },
    components: {
        Upload
    }
}
</script>

<style lang="less" scoped></style>