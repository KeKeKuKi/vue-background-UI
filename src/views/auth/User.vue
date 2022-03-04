<template>
  <div>
    <div style="width: 90%;margin-left: 5%;margin-top: 2%">
      <el-form :inline="true" style="border-color: #ececec;border-radius: 5px; padding: 5px;margin-top: 30px">
        <el-form-item>
          <!--          <el-date-picker-->
          <!--            v-model="dateSelected"-->
          <!--            class="eldatapicker"-->
          <!--            type="daterange"-->
          <!--            value-format="yyyy-MM-dd HH:mm:ss"-->
          <!--            unlink-panels-->
          <!--            range-separator="至"-->
          <!--            start-placeholder="开始日期"-->
          <!--            end-placeholder="结束日期"-->
          <!--            :default-time="['00:00:00', '23:59:59']"-->
          <!--            @change="page"-->
          <!--          />-->
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" icon="el-icon-search" @click="page">
            查询
          </el-button>
          <el-button type="warning" icon="el-icon-plus" @click="dialogAdd = true">
            新增用户
          </el-button>
        </el-form-item>
      </el-form>
      <hr>
      <el-table
        :data="dataList"
        :stripe="true"
      >
        <el-table-column
          fixed
          prop="id"
          label="ID"
          width="70"
        />
        <el-table-column
          fixed
          prop="avatar"
          label="头像"
          width="100"
        >
          <template slot-scope="scope">
            <el-image
              style="width: 50px; height: 50px;border-radius: 45%"
              :src="scope.row.avatar"
              fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          prop="name"
          label="姓名"
        />
        <el-table-column
          fixed
          prop="username"
          label="账户名"
        />
        <el-table-column
          fixed
          prop="mobilePhoneNumber"
          label="电话号码"
        />
        <el-table-column
          fixed
          label="角色"
        >
          <template slot-scope="scope">
            {{
              scope.row.roles && scope.row.roles.length > 0 ? scope.row.roles.map(i => {
                return i.name
              }) : ''
            }}
          </template>
        </el-table-column>
        <el-table-column
          fixed
          prop="lastLogin"
          label="最近登录时间"
        />
        <el-table-column
          fixed
          prop="createDate"
          label="创建时间"
        />
        <el-table-column
          fixed
          label="加锁状态"
        >
          <template v-slot="slot">
            <el-tag type="success" v-if="slot.row.locked === 0">未锁定</el-tag>
            <el-tag type="danger" v-else>已锁定</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          label="可用状态"
        >
          <template v-slot="slot">
            <el-tag type="success" v-if="slot.row.enabled === 0">可用</el-tag>
            <el-tag type="danger" v-else>不可用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          :fixed="false"
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="primary" icon="el-icon-edit">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>


      <!--分页工具栏-->
      <el-col :span="24" class="toolbar">
        <el-pagination
          :current-page="pageQuery.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageQuery.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageQuery.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </div>
    <el-dialog title="新增用户" :visible.sync="dialogAdd" width="25%">
      <el-form :model="newData" ref="userForm" :close-on-click-modal="false" :rules="rules" status-icon
               label-width="80px">
        <el-form-item label="用户名 *" prop="username">
          <el-input v-model="newData.username" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="密码 *" prop="password">
          <el-input v-model="newData.password" type="password" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="确认密码 *" prop="password2">
          <el-input v-model="newData.password2" type="password" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="使用者 *" prop="name">
          <el-input v-model="newData.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="电话号码 *" prop="mobilePhoneNumber">
          <el-input v-model="newData.mobilePhoneNumber" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="邮箱 " prop="email">
          <el-input v-model="newData.email" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="角色">
          <el-checkbox-group v-model="newData.roleIds" :min="1">
            <el-checkbox v-for="role in roleList" :key="role.id" :label="role.id">{{ role.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <div style="text-align: right">
        <el-button @click="add" type="primary">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑用户" :visible.sync="dialogEdit" width="25%">
      <el-form ref="userForm" :close-on-click-modal="false" status-icon
               label-width="80px">
        <el-form-item label="使用者" prop="name">
          <el-input v-model="editData.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="电话号码" prop="mobilePhoneNumber">
          <el-input v-model="editData.mobilePhoneNumber" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editData.email" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="角色">
          <el-checkbox-group v-model="editData.roleIds" :min="1">
            <el-checkbox v-for="role in roleList" :key="role.id" :label="role.id">{{ role.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <div style="text-align: right">
        <el-button @click="update" type="primary">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {addUser, pageUser, updateUser} from "@/api/user";
import {listRoles} from "@/api/role";

export default {
  name: "User",
  data() {
    var checkUserName = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        return callback(new Error('用户名不能为空'))
      }
      setTimeout(() => {
        if (!/^[a-zA-Z0-9_-]{4,16}$/.test(value)) {
          return callback(new Error('用户名4到16位（只能为字母、数字、下划线、减号）'))
        } else {
          callback();
        }
      }, 300);
    }

    var checkPassWord = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        return callback(new Error('密码不能为空'))
      }
      setTimeout(() => {
        if (!/^(\w){6,20}$/.test(value)) {
          return callback(new Error('密码为6-20个字母、数字、下划线'))
        } else {
          callback();
        }
      }, 300);
    }

    var checkPassWord2 = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        return callback(new Error('密码不能为空'))
      }
      setTimeout(() => {
        if (value !== this.newData.password) {
          return callback(new Error('两次密码输入不一致'))
        } else {
          callback();
        }
      }, 300);
    }

    var checkName = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        return callback(new Error('姓名不能为空'))
      }
      callback();
    }

    var checkTelephone = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        return callback(new Error('电话不能为空'))
      }
      callback();
    }
    // ---------------data---------------data---------------data---------------data---------------data
    return {
      list: [1],
      dialogEdit: false,
      dialogAdd: false,
      dateSelected: [],
      dataList: [],
      roleList: [],
      pageQuery: {
        size: 10,
        page: 1,
        total: 0,
        queryParam: {}
      },
      newData: {
        roleIds: []
      },
      editData: {
        roleIds: []
      },
      rules: {
        username: [
          {validator: checkUserName, trigger: 'blur'}
        ],
        password: [
          {validator: checkPassWord, trigger: 'blur'}
        ],
        password2: [
          {validator: checkPassWord2, trigger: 'blur'}
        ],
        name: [
          {validator: checkName, trigger: 'blur'}
        ],
        mobilePhoneNumber: [
          {validator: checkTelephone, trigger: 'blur'}
        ]
      }
    }
  },
  // -----------------mounted-----------------mounted-----------------mounted-----------------mounted
  mounted() {
    this.page()
    this.listRoles()
  },
  // -----------------methods-----------------methods-----------------methods-----------------methods
  methods: {
    listRoles() {
      listRoles({}).then(res => {
        this.roleList = res.data.data
      })
    },
    edit(row) {
      let temp = Object.assign({}, row)
      temp.roleIds = temp.roles.map(i => {
        return i.id
      })
      this.editData = temp
      this.dialogEdit = true
    },
    update() {
      updateUser(this.editData).then(res => {
        if (res.data.codeSuccess) {
          this.editData = {
            roleIds: []
          }
          this.dialogEdit = false
          this.$message({
            showClose: true,
            message: '编辑成功',
            type: 'success'
          })
          this.page()
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    add() {
      addUser(this.newData).then(res => {
        if (res.data.codeSuccess) {
          this.newData = {}
          this.dialogAdd = false
          this.$message({
            showClose: true,
            message: '新增成功',
            type: 'success'
          })
          this.page()
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    page() {
      pageUser(this.pageQuery).then(res => {
        this.dataList = res.data.data.data
        this.pageQuery.total = res.data.data.totalCount
      })
    },
    handleSizeChange(val) {
      this.pageQuery.size = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange(val) {
      this.pageQuery.page = val
      this.page()
    },
  }
}
</script>

<style scoped>

</style>
