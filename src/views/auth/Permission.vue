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
            新增权限
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
        />
        <el-table-column
          fixed
          prop="name"
          label="名称"
        />
        <el-table-column
          fixed
          prop="path"
          label="Path"
        />
        <el-table-column
          fixed
          prop="value"
          label="Value"
        />
        <el-table-column
          fixed
          prop="createdTime"
          label="创建时间"
        />
        <el-table-column
          :fixed="false"
          align="center"
          label="操作"
        >
          <template slot-scope="scope" >
            <el-button @click="del(scope.row.id)" type="danger" icon="el-icon-delete">删除</el-button>
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
    <el-dialog title="新增权限" :visible.sync="dialogAdd" width="25%">
      <el-form :model="newData" ref="userForm" :close-on-click-modal="false" :rules="rules" status-icon
               label-width="80px">
        <el-form-item>
          <template>
            <el-radio v-model="newData.select" label="web:menu:">菜单权限</el-radio>
            <el-radio v-model="newData.select" label="web:button:">按钮权限</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="名称 *" prop="name">
          <el-input v-model="newData.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="值 *" prop="value">
          <el-input v-model="newData.value" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button @click="add" type="primary">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {addRole, pageRole, updateRole} from "@/api/role";
import {addPermission, delPermission, listPermission, pagePermission} from "@/api/permission";

export default {
  name: "Permission",
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('名称不能为空'))
      }
      callback();
    }

    var checkCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('Value不能为空'))
      }
      callback();
    }
    // ---------------data---------------data---------------data---------------data---------------data
    return {
      permissionTree: {},
      dialogEdit: false,
      dialogAdd: false,
      dateSelected: [],
      dataList: [],
      permissionList: [],
      pageQuery: {
        size: 10,
        page: 1,
        total: 0,
        queryParam: {}
      },
      newData: {
        permissionIds: [],
      },
      editData: {
        permissionIds: [],
      },
      rules: {
        name: [
          {validator: checkName, trigger: 'blur'}
        ],
        value: [
          {validator: checkCode, trigger: 'blur'}
        ]
      }
    }
  },
  // -----------------mounted-----------------mounted-----------------mounted-----------------mounted
  mounted() {
    this.page()
  },
  // -----------------methods-----------------methods-----------------methods-----------------methods
  methods: {
    del(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        delPermission(id).then(res => {
          if (res.data.codeSuccess) {
            this.$message({
              showClose: true,
              message: '删除成功',
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
      }).catch(() => {
      });
    },
    update() {
      this.editData.permissionIds = this.$refs.updateTree.getCheckedKeys(true)
      updateRole(this.editData).then(res => {
        if (res.data.codeSuccess) {
          this.editData = {
            permissionIds: [],
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
      if (!this.newData.select){
        this.$message({
          showClose: true,
          message: "请选择权限类型",
          type: 'error'
        })
        return
      }
      this.newData.value = this.newData.select + this.newData.value
      this.newData.path = "/web"
      addPermission(this.newData).then(res => {
        if (res.data.codeSuccess) {
          this.newData = {
            permissionIds: [],
          }
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
      pagePermission(this.pageQuery).then(res => {
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
