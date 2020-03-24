<template>
  <div class="typePage">
    <el-button type="primary" size="medium" @click="addGoodsDialog = true">添加商品</el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="商品名称"
        width="180"
        prop="title"/>
      <el-table-column
        label="所需闲置币"
        prop="cost"
        width="160"
      />
      <el-table-column
        label="商品图片">
        <template slot-scope="scope">
          <img :src="scope.row.pics[0]" class="goosImg" alt="">
        </template>
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          {{ scope.row.status === 1 ? '上架': '下架' }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            :type="scope.row.status === 0 ? 'success' : 'warning'"
            size="mini"
            @click="pul(scope.row)">{{ scope.row.status === 0 ? '上架': '下架' }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="addGoodsDialog" :before-close="addGoodsDialogClose" title="添加子类" width="30%">
      <el-form label-width="100px" style="width: 80%">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="name" placeholder="商品名称" maxlength="15"/>
        </el-form-item>
        <el-form-item label="所需闲置币" prop="name">
          <el-input v-model="cost" placeholder="所需闲置币" maxlength="15"/>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            :http-request="uploadUserImg"
            :show-file-list="false"
            class="avatar-uploader"
            action=""
            accept="image/*"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button @click="addGoodsDialogClose">取 消</el-button>
        <el-button type="primary" @click="addGoods">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { requestApi } from '@/api/index.js'
import axios from 'axios'

export default {
  data() {
    return {
      tableData: [],
      addGoodsDialog: false,
      name: '',
      cost: '',
      imageUrl: ''
    }
  },

  mounted() {
    this.getData()
  },

  methods: {
    addGoodsDialogClose() {
      this.addGoodsDialog = false
      this.name = ''
      this.imageUrl = ''
      this.cost = ''
    },
    uploadUserImg(file) {
      const forms = new FormData()
      forms.append('file', file.file)
      axios.post(`${process.env.BASE_API}/user/uploadPics`, forms, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => {
        this.imageUrl = res.data.data.url
      })
    },
    pul(row) {
      const status = row.status === 0 ? 1 : 0
      requestApi('/forgoods/upStatus', 'post', { id: row._id, status }).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: `${row.status === 1 ? '下架成功' : '上架成功'}`
          })
          this.getData()
        }
      })
    },
    addGoods() {
      if (this.name === '') {
        this.$message('请输入商品名称')
      } else if (this.imageUrl === '') {
        this.$message('请上传图片')
      } else if (this.cost === '') {
        this.$message('请输入所需闲置币')
      } else {
        const params = { title: this.name, pics: [this.imageUrl], cost: this.cost }
        requestApi('/forgoods/addgoods', 'post', params).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.addGoodsDialogClose()
            this.getData()
          }
        })
      }
    },
    getData() {
      requestApi('/forgoods/getForgoods', 'get').then(res => {
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
