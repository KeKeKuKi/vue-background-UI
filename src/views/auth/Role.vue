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
            新增角色
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
          prop="name"
          label="名称"
        />
        <el-table-column
          fixed
          prop="code"
          label="CODE"
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
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button @click="del(scope.row.id)" type="danger" icon="el-icon-edit">删除</el-button>
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
    <el-dialog title="新增角色" :visible.sync="dialogAdd" width="25%">
      <el-form :model="newData" ref="userForm" :close-on-click-modal="false" :rules="rules" status-icon
               label-width="80px">
        <el-form-item label="名称 *" prop="name">
          <el-input v-model="newData.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="CODE *" prop="code">
          <el-input v-model="newData.code" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="权限" prop="code">
          <el-tree
            :data="permissionTree"
            ref="addTree"
            show-checkbox
            node-key="id">
          </el-tree>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button @click="add" type="primary">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑角色" :visible.sync="dialogEdit" width="25%">
      <el-form ref="userForm" :close-on-click-modal="false" status-icon
               label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editData.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="code" prop="name">
          <el-input v-model="editData.code" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="权限" prop="code">
          <el-tree
            :data="permissionTree"
            :default-checked-keys="this.editData.permissionIds"
            show-checkbox
            ref="updateTree"
            node-key="id">
          </el-tree>
        </el-form-item>
      </el-form>

      <div style="text-align: right">
        <el-button @click="update" type="primary">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {addRole, delRole, pageRole, updateRole} from "@/api/role";
import {listPermission} from "@/api/permission";

export default {
  name: "Role",
  data() {
    var checkName = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        return callback(new Error('名称不能为空'))
      }
      callback();
    }

    var checkCode = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        return callback(new Error('CODE不能为空'))
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
        code: [
          {validator: checkCode, trigger: 'blur'}
        ]
      }
    }
  },
  // -----------------mounted-----------------mounted-----------------mounted-----------------mounted
  mounted() {
    this.page()
    this.listPermission()
  },
  // -----------------methods-----------------methods-----------------methods-----------------methods
  methods: {
    listPermission() {
      listPermission({}).then(res => {
        let temp = res.data.data.map(i => {
          return {
            id: i.id,
            name: i.name,
            permission: i.value.split(':')
          }
        })
        if (temp.length > 0) {
          let tree = []
          temp.forEach(i => {
            let l1 = null
            tree.forEach(j => {
              if (j.label === i.permission[0]) {
                l1 = j
              }
            })
            if (l1) {
              let l2 = null
              l1.children.forEach(k => {
                if (k.label === i.permission[1]) {
                  l2 = k
                }
              })
              if (l2) {
                l2.children.push({
                  id: i.id,
                  label: i.name,
                  children: []
                })
              } else {
                l1.children.push({
                  id: null,
                  label: i.permission[1],
                  children: [{
                    id: i.id,
                    label: i.name,
                    children: []
                  }]
                })
              }
            } else {
              tree.push({
                id: null,
                label: i.permission[0],
                children: [{
                  id: null,
                  label: i.permission[1],
                  children: [{
                    id: i.id,
                    label: i.name,
                    children: []
                  }]
                }]
              })
            }
          })
          this.permissionTree = tree
        }
      })
    },
    edit(row) {
      let temp = Object.assign({}, row)
      temp.permissionIds = row.permissions.map(i => {
        return i.id
      })
      this.editData = temp
      this.dialogEdit = true
    },
    del(id){
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delRole(id).then(res => {
          if (res.data){
            this.$message({
              showClose: true,
              message: '删除',
              type: 'success'
            })
            this.page()
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
          this.listPermission()
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
      this.newData.permissionIds = this.$refs.addTree.getCheckedKeys(true)
      addRole(this.newData).then(res => {
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
          this.listPermission()
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
      pageRole(this.pageQuery).then(res => {
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
