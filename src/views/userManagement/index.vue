<template>
  <div class="userPage">
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="用户头像"
        width="120"
      >
        <template slot-scope="scope">
          <img v-if="scope.row.avatars" :src="scope.row.avatars" style="width: 60px;height: 60px;border-radius: 50%" >
          <img v-else style="width: 60px;height: 60px;border-radius: 50%" src="@/assets/header.png" alt="">
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="140">
        <template slot-scope="scope">
          <div>{{ scope.row.username }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="手机号"
        prop="phone"
        width="140"
      />
      <el-table-column
        label="微信号"
        prop="wechat"
        width="150"
      />
      <el-table-column label="创建时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.createTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="handleViewGoods(scope.row._id)">查看商品</el-button>
          <el-button
            size="mini"
            type="warning"
            @click="handleViewDym(scope.row._id)">查看动态</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialog" :before-close="dialogClose" :title="title" width="70%">
      <template v-if="title === '用户商品'">
        <div v-for="(item, index) in goodsList" :key="index" class="goods">
          <img :src="item.goodsPics[0]" alt="">
          <div class="msg">
            <div class="title">{{ item.desc }}</div>
            <div class="price">¥{{ item.price }}</div>
          </div>
        </div>
      </template>
      <template v-if="title === '用户动态'">
        <div v-for="(item, index) in dyList" :key="index" class="dym">
          <div class="title">{{ item.content }}</div>
          <div class="imgBox">
            <img v-for="(ite, index) in item.pics" :src="ite" :key="index" alt="">
          </div>
        </div>
      </template>
      <div style="text-align: center">
        <el-button @click="dialogClose">确 认</el-button>
      </div>
    </el-dialog>
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
      tableData: [],
      dialog: false,
      goodsList: [],
      dyList: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      requestApi('/user/alluser', 'get').then(res => {
        this.tableData = res.data
      })
    },
    getGoodsAndDym(id) {
      requestApi('/user/getGoodsAndDy', 'post', { id: id }).then(res => {
        this.goodsList = res.data.goods
        this.dyList = res.data.dyms
        this.dialog = true
      })
    },
    handleViewGoods(id) {
      this.title = '用户商品'
      this.getGoodsAndDym(id)
    },
    handleViewDym(id) {
      this.title = '用户动态'
      this.getGoodsAndDym(id)
    },
    dialogClose() {
      this.dialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.userPage {
  padding: 10px 20px;
  .goods {
    display: flex;
    margin-bottom: 10px;
    border-bottom: 1px solid #eeeeee;
    padding-bottom: 10px;
    img {
      width: 100px;
      height: 130px;
      object-fit: cover;
    }
    .msg {
      margin-left: 10px;
      .title {
        margin-bottom: 10px;
        font-size: 16px;
      }
      .price {
        color: #e74c3c;
      }
    }
  }
  .dym {
    margin-bottom: 10px;
    padding-bottom: 12px;
    border-bottom: 1px solid #eeeeee;
    .title {
      font-size: 17px;
      margin-bottom: 10px;
    }
    .imgBox {
      display: flex;
      img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
