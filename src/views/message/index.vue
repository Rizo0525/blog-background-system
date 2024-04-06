<template>
    <div class="app-container">
        <el-table :data="message.rows" style="width: 100%" border>
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
                            @click="deleteMessageHandle(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
            style="margin-top: 30px;" background :page-sizes="[5, 10, 15, 20]" :page-size="limit"
            layout="prev, pager, next, total, -> ,sizes,  jumper" :total="message.total">
        </el-pagination>
    </div>
</template>

<script>
import { getMessages, deleteMessage } from '@/api/message'
import { formatDate } from '@/utils/formatDate'
import { server_URL } from '@/urlConfig'
export default {
    data() {
        return {
            page: 1,
            limit: 5,
            message: {
                rows: [],
                total: 0
            }
        }
    },
    methods: {
        async fetchData() {
            let resp = await getMessages(this.page, this.limit)
            this.message = resp.data
            // this.message.rows.forEach(item=>{
            //     item.avatar2 = server_URL + item.avatar
            // })
            console.log(this.message)
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
        async deleteMessageHandle(mes) {
            this.$confirm('是否删除该留言?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await deleteMessage(mes.id)
                await this.fetchData()
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });

                let totalPage = Math.ceil(this.message.total / this.limit)
                //最后一页只有一条数据
                if (this.page > totalPage) {
                    this.page = Math.ceil(this.message.total / this.limit)
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