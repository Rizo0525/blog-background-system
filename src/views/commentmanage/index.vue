<template>
    <div class="app-container">
        <el-table :data="comment.rows" style="width: 100%" border>
            <el-table-column label="序号" align="center" width="60">
                <template slot-scope="scope">{{ scope.$index + (page - 1) * limit + 1 }}</template>
            </el-table-column>
            <el-table-column label="头像" align="center">
                <template slot-scope="scope">
                    <el-image style="width: 30px; height: 100%" :src="scope.row.avatar" fit="cover"></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="nickname" label="昵称" align="center">
            </el-table-column>
            <el-table-column prop="blog.title" label="评论文章" align="center">
            </el-table-column>
            <el-table-column prop="content" label="评论内容" align="center">
            </el-table-column>
            <el-table-column label="创建日期" align="center" width="220">
                <template slot-scope="scope">
                    {{ formatDate(scope.row.createDate) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="80">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="删除" placement="top" :hide-after="2000">
                        <el-button type="danger" icon="el-icon-delete" circle size="mini"
                            @click="deleteCommentHandle(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
            style="margin-top: 30px;" background :page-sizes="[5, 10, 15, 20]" :page-size="limit"
            layout="prev, pager, next, total, -> ,sizes,  jumper" :total="comment.total">
        </el-pagination>
    </div>
</template>

<script>
import { getComments, deleteComment } from '@/api/comment'
import { formatDate } from '@/utils/formatDate'
import { server_URL } from '@/urlConfig'
export default {
    data() {
        return {
            page: 1,
            limit: 10,
            comment: {
                rows: [],
                total: 0
            }
        }
    },
    methods: {
        async fetchData() {
            let resp = await getComments(this.page, this.limit)
            console.log(resp)
            this.comment = resp.data
            // console.log(this.comment)
            this.comment.rows.forEach(item=>{
                // item.avatar2 = server_URL + item.avatar
            })
            console.log(this.comment)
        },
        formatDate,
        async handleSizeChange(val) {
            this.page = 1
            this.limit = val
            await this.fetchData()
        },
        async handleCurrentChange(val) {
            this.page = val
            await this.fetchData()
        },
        async deleteCommentHandle(cmt) {
            this.$confirm('是否删除该评论?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await deleteComment(cmt.id)
                await this.fetchData()
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });

                let totalPage = Math.ceil(this.comment.total / this.limit)
                //最后一页只有一条数据
                if (this.page > totalPage) {
                    this.page = Math.ceil(this.comment.total / this.limit)
                    await this.fetchData()
                }

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        }
    },
    async created() {
        await this.fetchData()
    }
}
</script>

<style lang="less" scoped></style>