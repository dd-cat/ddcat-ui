<template>
  <div class="app-container">

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['sys:dept:add']"
        >新增
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="deptList"
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="code" label="部门编码" width="200"></el-table-column>
      <el-table-column prop="label" label="部门名称" width="260"></el-table-column>
      <el-table-column prop="weight" label="排序" width="200"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['sys:dept:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['sys:dept:add']"
          >新增
          </el-button>
          <el-button
            v-if="scope.row.parentId != 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sys:dept:del']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24" v-if="form.parentId != -1">
            <el-form-item label="上级部门" prop="parentId">
              <treeselect v-model="form.parentId" :options="deptOptions" placeholder="选择上级部门"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门编码" prop="code">
              <el-input v-model="form.code" placeholder="请输入部门编码"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入部门名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addDept, delDept, getDept, treeselect, updateDept } from '@/api/system/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'Dept',
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [],
      // 部门树选项
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        name: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: '上级部门不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '显示排序不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_normal_disable').then(response => {
      this.statusOptions = response.data
    })
  },
  methods: {
    /** 查询部门列表 */
    getList() {
      this.loading = true
      treeselect().then(response => {
        this.deptList = response.data
        this.loading = false
      })
    },
    /*禁用节点及其子节点*/
    disabledCheck(data, id) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          data[i].isDisabled = true
          if (data[i].children && data[i].children.length > 0) {
            this.disabledSonCheck(data[i].children)
          }
          break
        }
        if (data[i].children && data[i].children.length > 0) {
          this.disabledCheck(data[i].children, id)
        }
      }
    },
    disabledSonCheck(data) {
      data.forEach(item => {
        item.isDisabled = true
        if (item.children && item.children.length > 0) {
          this.disabledSonCheck(item.children)
        }
      })
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        parentId: undefined,
        name: undefined,
        sort: undefined
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      if (row != undefined) {
        this.form.parentId = row.deptId
      }
      this.open = true
      this.title = '添加部门'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.deptOptions = JSON.parse(JSON.stringify(this.deptList))
      this.disabledCheck(this.deptOptions, row.id)
      getDept(row.id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改部门'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.deptId != undefined) {
            updateDept(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addDept(this.form).then(response => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delDept(row.deptId)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {
      })
    }
  }
}
</script>
