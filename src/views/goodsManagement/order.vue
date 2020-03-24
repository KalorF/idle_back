<template>
  <div class="typePage">
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="商品"
        width="180"
      >
        <template slot-scope="scope">
          <div style="text-align: cneter">
            <img :src="scope.row.forgoods.pics[0]" style="height: 80px;width: 80px; object-fit: cover" class="goosImg" alt="">
            <div>{{ scope.row.forgoods.title }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="兑换用户">
        <template slot-scope="scope">
          <div>用户名：{{ scope.row.user.username }}</div>
          <div>手机号：{{ scope.row.user.phone }}</div>
          <div>微信号：{{ scope.row.user.wechat }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="收货人"
        prop="goodsAre"
        width="160"
      />
      <el-table-column
        label="电话"
        prop="phone"
        width="160"
      />
      <el-table-column
        label="收货地址"
        prop="address"
      />
      <el-table-column label="兑换时间">
        <template slot-scope="scope">
          {{ scope.row.createTime | formatDate }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="handleAddTwo(scope.row)">添加子类</el-button>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
import { requestApi } from '@/api/index.js'
import { formatDate } from '../../utils/common'

export default {

  filters: {
    formatDate(time) {
      var date = new Date(parseInt(time))
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  data() {
    return {
      tableData: []
    }
  },

  mounted() {
    this.getData()
  },

  methods: {
    getData() {
      requestApi('/forgoodsorder/forgoodsList', 'get').then(res => {
        this.tableData = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.typePage {
  padding: 10px 20px;
}
.goosImg {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
/deep/ .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
/deep/ .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
