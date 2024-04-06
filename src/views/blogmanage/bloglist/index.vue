<template>
    <div class="app-container">
        <el-table :data="data.rows" style="width: 100%" border>
            <el-table-column label="序号" align="center">
                <template slot-scope="scope">{{ scope.$index + (page - 1) * limit + 1 }}</template>
            </el-table-column>
            <el-table-column prop="title" label="文章名称" align="center">
                <template slot-scope="scope">
                    <el-popover class="item" title="博客预览图" trigger="hover" content="aaa" placement="bottom" width="200">
                        <slot>
                            <el-image style="width: 100%; height: 100%" :src="scope.row.thumb" fit="cover"
                                :preview-src-list="srcList"></el-image>
                        </slot>
                        <a slot="reference" href="#" target="_blank" @click.prevent="goToTitleHandle(scope.row)">{{
                            scope.row.title }}</a>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="description" label="文章详情" align="center">
            </el-table-column>
            <el-table-column prop="scanNumber" label="浏览数" align="center">
            </el-table-column>
            <el-table-column prop="category.name" label="所属分类" align="center">
                <template slot-scope="scope">
                    {{ scope.row.category===null ? '未分类' : scope.row.category.name}}
                </template>
            </el-table-column>
            <el-table-column label="创建日期" align="center" width="220">
                <template slot-scope="scope">
                    {{ formatDate(scope.row.createDate) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top" :hide-after="2000">
                        <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="goToEdit(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top" :hide-after="2000">
                        <el-button type="danger" icon="el-icon-delete" circle size="mini"
                            @click="deleteBlog(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" style="margin-top: 30px;"
            background :page-sizes="[5, 10, 15, 20]" :page-size="limit"
            layout="prev, pager, next, total, -> ,sizes,  jumper" :total="data.total">
        </el-pagination>
    </div>
</template>

<script>
import { getBlogs, deleteBlog } from '@/api/blog';
import { fetchData } from '@/mixins/fetchData'
import { formatDate } from '@/utils/formatDate'
import { server_URL, frontEnd_URL } from '@/urlConfig';
export default {
    mixins: [fetchData({ rows: [], total: 0 })],
    data() {
        return {
            currentPage: 1,
            page: 1,
            limit: 5,
            srcList: []
        }
    },
    methods: {
        async fetchData() {
            let resp = await getBlogs(this.page, this.limit)
            resp.data.rows.forEach((value) => {
                // value.thumb = server_URL + value.thumb
                this.srcList.push(value.thumb)
            })
            // console.log(resp.data.rows)
            return resp.data
        },
        goToEdit(blog){
            // console.log(blog)
            this.$router.push({
                name:'EditBlog',
                params:{
                    id:blog.id
                }
            })
        },
        formatDate,
        async handleSizeChange(val) {
            this.limit = val
            this.data = await this.fetchData()
            // console.log(`每页 ${val} 条`);
        },
        async handleCurrentChange(val) {
            this.page = val
            this.data = await this.fetchData()
            // console.log(`当前页: ${val}`);
        },
        goToTitleHandle(blogInfo) {
            window.open(`${frontEnd_URL}/article/${blogInfo.id}`)
        },
        async deleteBlog(blogInfo) {
            this.$confirm('删除该文章会将该文章下面的评论一并删除, 是否继续?', '是否删除该文章', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let resp = await deleteBlog(blogInfo.id)
                console.log(resp)
                this.data = await this.fetchData()
                // console.log(this.data)
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });

                let totalPage = Math.ceil(this.data.total / this.limit)
                //最后一页只有一条数据
                if (this.page > totalPage) {
                    this.page = Math.ceil(this.data.total / this.limit)
                    this.data = await this.fetchData()
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        }
    }
}
</script>

<style lang="less"  scoped>
</style>