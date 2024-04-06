<template>
    <div class="app-container">
        <!-- <el-select v-model="value">
            <el-option v-for="item in options" :key="item" :value="item">
            </el-option>
        </el-select>
        <el-input v-model="input" placeholder="请输入内容"></el-input>
        <el-button type="primary">搜索</el-button> -->
        <div>
            <el-input placeholder="请输入要添加的分类，左边选择该分类的等级" v-model="input" class="input-with-select">
                <el-select v-model="select" slot="prepend" placeholder="请选择" class="select">
                    <el-option v-for="item in options" :key="item" :value="item" :label="item">
                    </el-option>
                </el-select>
            </el-input>
            <el-button style="margin-left: 10px;" type="primary" @click="addBlogTypeHandle">添加</el-button>
        </div>

        <el-table :data="data" border style="width: 100%" v-loading="loading" spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.5)">
            <el-table-column type="index" label="序号" align='center' width="80">
            </el-table-column>
            <el-table-column prop="name" label="博客类别" align='center'>
                <template slot-scope="scope">
                    <span v-if="!scope.row.editing">{{ scope.row.name }}</span>
                    <el-input v-else v-model="scope.row.name"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="articleCount" label="文章数量" align='center'>
                <template slot-scope="scope">
                    <span>{{ scope.row.articleCount }}</span>
                    <!-- <span v-if="!editing">{{ scope.row.articleCount }}</span> -->
                    <!-- <el-input v-else v-model="scope.row.articleCount"></el-input> -->
                </template>
            </el-table-column>
            <el-table-column prop="name" label="排序等级" align='center'>
                <template slot-scope="scope">
                    <span v-if="!scope.row.editing">{{ scope.row.order }}</span>
                    <!-- <el-input v-else v-model="scope.row.order"></el-input> -->
                    <el-select v-model="scope.row.order" slot="prepend" placeholder="请选择" class="select" v-else @focus="handleFocus(scope.row)">
                        <el-option v-for="item in options" :key="item" :value="item" :label="item">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="操作" align='center' width="150">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top" :hide-after="2000" v-if="!scope.row.editing">
                        <el-button type="primary" icon="el-icon-edit" circle size="mini"
                            @click="editBlogTypeHandle(scope.row)"></el-button>
                    </el-tooltip>
                    <template v-else>
                        <el-tooltip class="item" effect="dark" content="提交" placement="top" :hide-after="2000">
                            <el-button type="success" icon="el-icon-check" circle size="mini"
                                @click="confirmBlogTypeHandle(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="取消" placement="top" :hide-after="2000">
                            <el-button type="success" icon="el-icon-circle-close" circle size="mini"
                                @click="cancelBlogTypeHandle(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top" :hide-after="2000">
                        <el-button type="danger" icon="el-icon-delete" circle size="mini"
                            @click="deleteBlogTypeHandle(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { fetchData } from '@/mixins/fetchData';
import { getBlogTypes, addBlogType, updateBlogType, deleteBlogType } from '@/api/blog';
export default {
    mixins: [fetchData()],
    data() {
        return {
            options: [1, 2, 3, 4, 5],
            select: '1',
            input: '',
            // editing: false
            order: ''
        }
    },
    methods: {
        handleFocus(blogType){
            this.order = blogType.order
        },
        deleteBlogTypeHandle(blogType) {
            this.$confirm('删除该分类，会导致该分类下面的所有文章变为无分类状态, 是否继续?', '是否删除该分类', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await deleteBlogType(blogType.id)
                this.data = await this.fetchData()
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
        },
        cancelBlogTypeHandle(blogType) {
            console.log(this.order)
            if(this.order){
                blogType.order = this.order
                this.$message({
                    type: 'success',
                    message: '取消修改成功!'
                })
            }
            blogType.editing = false
        },
        editBlogTypeHandle(blogType) {
            blogType.editing = true
        },
        addBlogTypeHandle() {
            if (this.input) {
                addBlogType({ name: this.input, order: this.select }).then(async (r) => {
                    this.data = await this.fetchData()
                    this.$message.success('添加分类成功')
                })
            } else {
                this.$message.error('分类名称不能为空')
            }
        },
        confirmBlogTypeHandle(blogType) {
            blogType.editing = false
            let editInfo = { id: blogType.id, data: { name: blogType.name, order: blogType.order } }
            // console.log(editInfo)
            updateBlogType(editInfo).then(async r => {
                // console.log(r)
                this.$message.success('更新分类成功')
                this.data = await this.fetchData()
            })
        },
        async fetchData() {
            let resp = await getBlogTypes()
            resp.data = resp.data.map(item=>{
                item.editing = false
                return item
            })
            return resp.data
        }
    },

}
</script>

<style lang="less" scoped>
.input-with-select {
    width: 400px;
    margin: 15px 0;
}

.select {
    width: 60px;
}
</style>