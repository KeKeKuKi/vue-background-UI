<template>
  <div style="width: 96%;margin-left: 2%">
    <el-form :inline="true" style="border-color: #ececec;border-radius: 5px; padding: 5px;margin-top: 30px">
      <el-form-item>
        <el-date-picker
          v-model="dateSelected"
          class="eldatapicker"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="datePickerOptions"
          :default-time="['00:00:00', '23:59:59']"
          @change="pageArticle"
        />
      </el-form-item>
      <el-form-item style="float: right">
        <el-button type="primary" icon="el-icon-search" @click="pageArticle">
          查询
        </el-button>
        <el-button type="warning" icon="el-icon-edit" @click="newArticle">
          写文章
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="pageList"
      :stripe="true"
      width="100%"
    >
      <el-table-column
        fixed
        prop="id"
        label="ID"
        width="70"
      />
      <el-table-column
        fixed
        prop="authorId"
        label="作者ID"
        width="100"
      />
      <el-table-column
        label="横幅图"
        width="150"
      >
        <template slot-scope="scope">
          <el-image :src="scope.row.banner">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        width="200"
      />
      <el-table-column
        prop="summary"
        label="概述"
        width="800"
      />

      <el-table-column
        label="状态"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag
            :type="status(scope.row.status).type"
          >
            {{ status(scope.row.status).name }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="createDate"
        label="创建时间"
      />

      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <span>
            <el-button v-if="scope.row.status === 2" type="success" icon="el-icon-upload2" @click="putOnArticle(scope.row.id)">上架</el-button>
            <el-button v-if="scope.row.status === 1" type="warning" icon="el-icon-download" @click="putOffArticle(scope.row.id)">下架</el-button>
            <el-button v-if="scope.row.status === 3" type="success" icon="el-icon-check" @click="passArticle(scope.row.id)">通过</el-button>
            <el-button v-if="scope.row.status === 3" type="warning" icon="el-icon-close" @click="refuseArticle(scope.row.id)">驳回</el-button>
            <el-button v-if="scope.row.status === 4" type="primary" icon="el-icon-top-right" @click="submitReviewArticle(scope.row.id)">提交审核</el-button>
            <el-button type="primary" icon="el-icon-edit" @click="editArticle(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="delArticle(scope.row.id)">删除</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <!--分页工具栏-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        :current-page="page.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-col>

    <el-dialog title="文章编辑" :visible.sync="dialogArticleEdit" width="80%" :close-on-click-modal="false">
      <el-form ref="form" :model="articleEditIng" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="articleEditIng.title" />
        </el-form-item>
        <el-form-item label="概要">
          <el-input v-model="articleEditIng.summary" />
        </el-form-item>
        <el-form-item label="横幅图">
          <el-upload
            class="avatar-uploader"
            :action="baseURL+'/oss/uploadImage'"
            name="multipartFile"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="articleEditIng.banner" :src="articleEditIng.banner" style="width: 40%;margin-right: 60%">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="articleEditIng.categoryId" clearable placeholder="请选择">
            <el-option
              v-for="item in categorys"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!--        <el-form-item label="分类">-->
        <!--          <el-select v-model="articleEditIng.categoryId" clearable placeholder="请选择">-->
        <!--            <el-option-->
        <!--              v-for="item in tages"-->
        <!--              :key="item.id"-->
        <!--              :label="item.name"-->
        <!--              :value="item.id">-->
        <!--            </el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="内容">
          <mavon-editor v-model="articleEditIng.articleBodyDTO.markdown" :toolbars="toolbars" code-style="agate" :transition="true" style="margin: 10px 0 20px 0" @keydown="" @imgAdd="addImg" @imgDel="delImg" ref=md />
        </el-form-item>
        <div style="margin-left: 80%;display: ">
          <el-button @click="dialogArticleEdit = false">取消编辑</el-button>
          <el-button type="primary" @click="updateArticle">保存编辑</el-button>
        </div>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import {
  articleBody, delArticle,
  pageArticle,
  passArticle,
  putOffArticle,
  putOnArticle, refuseArticle,
  saveArticle, submitReviewArticle,
  updateArticle, uploadImage
} from '@/api/article'
import { blogService } from '@/utils/request'
export default {
  name: 'ArticleManage',
  data() {
    return {
      baseURL: blogService.defaults.baseURL,
      categorys: [{
        id: 1,
        name: 'vue'
      }],
      status(id) {
        switch (id) {
          case 1: return { name: '发布中', type: 'success' }
          case 2: return { name: '下架', type: 'danger' }
          case 3: return { name: '审核中', type: 'warning' }
          case 4: return { name: '暂存', type: 'info' }
        }
      },
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        mark: true, // 标记
        superscript: true, // 上角标
        quote: true, // 引用
        ol: true, // 有序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        help: true, // 帮助
        code: true, // code
        subfield: true, // 是否需要分栏
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        // /* 1.3.5 */
        undo: true, // 上一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        // /* 1.4.2 */
        navigation: true // 导航目录
      },
      page: {
        size: 10,
        page: 1,
        queryParam: {

        }
      },
      pageList: [],
      total: 0,
      dateSelected: [],
      dialogArticleEdit: false,
      articleEditIng: {
        id: null,
        articleBodyDTO: {
          markdown: ''
        }
      },
      datePickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      img_file: [

      ]
    }
  },
  mounted() {
    this.pageArticle()
  },
  methods: {
    addImg(pos, file){
      var formdata = new FormData()
      formdata.append('multipartFile', file)
      this.img_file[pos] = file
      uploadImage(formdata).then(res => {
        this.$refs.md.$img2Url(pos, res.data.data)
      })
    },
    delImg(pos){
      delete this.img_file[pos]
    },
    putOnArticle(id) {
      putOnArticle(id).then(res => {
        if (res.data.data) {
          this.$message({
            showClose: true,
            message: '变更成功',
            type: 'success'
          })
          this.pageArticle()
        }
      })
    },
    putOffArticle(id) {
      putOffArticle(id).then(res => {
        if (res.data) {
          this.$message({
            showClose: true,
            message: '变更成功',
            type: 'success'
          })
          this.pageArticle()
        }
      })
    },
    passArticle(id) {
      passArticle(id).then(res => {
        if (res.data) {
          this.$message({
            showClose: true,
            message: '变更成功',
            type: 'success'
          })
          this.pageArticle()
        }
      })
    },
    refuseArticle(id) {
      refuseArticle(id).then(res => {
        if (res.data) {
          this.$message({
            showClose: true,
            message: '变更成功',
            type: 'success'
          })
          this.pageArticle()
        }
      })
    },
    submitReviewArticle(id) {
      submitReviewArticle(id).then(res => {
        if (res.data) {
          this.$message({
            showClose: true,
            message: '变更成功',
            type: 'success'
          })
          this.pageArticle()
        }
      })
    },
    handleAvatarSuccess(res) {
      if (res.data) {
        this.articleEditIng.banner = res.data
      } else {
        this.$message.error('上传失败')
      }
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 3
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    editArticle(row) {
      articleBody(row.id).then(res => {
        this.articleEditIng = res.data.data
      })
      this.dialogArticleEdit = true
    },
    delArticle(id) {
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delArticle(id).then(res => {
          if (res.data) {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            this.pageArticle()
          }
        })
      }).catch(() => {
      })
    },
    newArticle() {
      this.articleEditIng = {
        id: null,
        title: '',
        banner: '',
        summary: '',
        categoryId: null,
        articleBodyDTO: {
          markdown: ''
        }
      }
      this.dialogArticleEdit = true
    },
    updateArticle() {
      if (this.articleEditIng.id) {
        updateArticle(this.articleEditIng).then(res => {
          if (res.data) {
            this.$message({
              showClose: true,
              message: '修改成功',
              type: 'success'
            })
            this.dialogArticleEdit = false
            this.pageArticle()
          }
        })
      } else {
        saveArticle(this.articleEditIng).then(res => {
          if (res.data) {
            this.$message({
              showClose: true,
              message: '保存成功',
              type: 'success'
            })
            this.dialogArticleEdit = false
            this.pageArticle()
          }
        })
      }
    },
    handleSizeChange(val) {
      this.page.size = val
      this.handleCurrentChange(1)
    },
    /**
     * 处理当前页变化
     * @param val 当前页
     */
    handleCurrentChange(val) {
      this.page.page = val
      this.pageArticle()
    },
    pageArticle() {
      pageArticle(this.page).then(res => {
        this.pageList = res.data.data.records
        this.total = res.data.data.total
      })
    }
  }
}
</script>

<style scoped>

</style>
