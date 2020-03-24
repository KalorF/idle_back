<template>
  <div class="typePage">
    <el-button type="primary" size="medium" @click="addOneDialog = true">添加类型</el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="类型名称"
        width="180"
        prop="name"/>
      <el-table-column
        label="子类型">
        <template slot-scope="scope">
          <div v-if="scope.row.children" class="twoBox">
            <div v-for="(item, index) in scope.row.children" :key="index" class="item">
              <img :src="item.pic" alt="">
              <span>{{ item.name }}</span>
            </div>
          </div>
          <div v-else>暂无子类型</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="handleAddTwo(scope.row)">添加子类</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">删除此类型</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="addOneDialog" :before-close="handleAddClose" title="添加类型" width="30%">
      <el-form label-width="100px" style="width: 80%">
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="oneName" placeholder="类型名称" maxlength="15"/>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button @click="handleAddClose">取 消</el-button>
        <el-button type="primary" @click="handleAddone">确 认</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="addTwoDialog" :before-close="handleTwoClose" title="添加子类" width="30%">
      <el-form label-width="100px" style="width: 80%">
        <el-form-item label="子类型名称" prop="name">
          <el-input v-model="twoName" placeholder="子类型名称" maxlength="15"/>
        </el-form-item>
        <el-form-item label="子类型图片">
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
        <el-button @click="handleTwoClose">取 消</el-button>
        <el-button type="primary" @click="addTwo">确 认</el-button>
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
      addOneDialog: false,
      addTwoDialog: false,
      oneName: '',
      twoName: '',
      parentId: '',
      imageUrl: ''
    }
  },

  mounted() {
    this.getData()
  },

  methods: {
    handleAddTwo(row) {
      this.parentId = row._id
      this.addTwoDialog = true
    },
    handleTwoClose() {
      this.addTwoDialog = false
      this.twoName = ''
      this.imageUrl = ''
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
    handleDelete(row) {
      requestApi('/type/deltype', 'post', { id: row._id }).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getData()
        }
      })
    },
    handleAddClose() {
      this.addOneDialog = false
      this.oneName = ''
    },
    addTwo() {
      if (this.twoName === '') {
        this.$message('请输入子类型名称')
      } else if (this.imageUrl === '') {
        this.$message('请上传子类型图片')
      } else {
        const params = { name: this.twoName, pic: this.imageUrl, parentId: this.parentId }
        requestApi('/type/addTwo', 'post', params).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.handleTwoClose()
            this.getData()
          }
        })
      }
    },
    handleAddone() {
      if (this.oneName === '') {
        this.$message('请输入类型名称')
      } else {
        requestApi('/type/addOne', 'post', { name: this.oneName }).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.handleAddClose()
            this.getData()
          }
        })
      }
    },
    getData() {
      requestApi('/type/typeList', 'get').then(res => {
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
.twoBox {
  display: flex;
  .item {
    position: relative;
    margin-right: 10px;
    width: 50px;
    text-align: center;
    img {
      height: 40px;
      width: 40px;
      object-fit: cover;
    }
    span {
      margin-top: 3px;
    }
  }
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
