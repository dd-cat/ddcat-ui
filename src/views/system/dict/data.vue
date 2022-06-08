<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="字典名称" prop="type">
        <el-select v-model="queryParams.type" size="small">
          <el-option
            v-for="item in typeOptions"
            :key="item.id"
            :label="item.name"
            :value="item.type"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="字典标签" prop="dictLabel">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入字典标签"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="数据状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="Number(dict.value)"
            :label="dict.name"
            :value="Number(dict.value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['sys:dict:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['sys:dict:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['sys:dict:del']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['sys:dict:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="字典编码" align="center" prop="type"/>
      <el-table-column label="字典标签" align="center" prop="name"/>
      <el-table-column label="字典键值" align="center" prop="value"/>
      <el-table-column label="字典排序" align="center" prop="sort"/>
      <el-table-column label="状态" align="center" prop="status">
        <template v-slot="scope">
          <el-switch v-model="scope.status" :active-value="false" :inactive-value="true" :disabled="true"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['sys:dict:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sys:dict:del']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典类型">
          <el-input v-model="form.type" :disabled="true"/>
        </el-form-item>
        <el-form-item label="数据标签" prop="name">
          <el-input v-model="form.name" placeholder="请输入数据标签"/>
        </el-form-item>
        <el-form-item label="数据键值" prop="value">
          <el-input v-model="form.value" placeholder="请输入数据键值"/>
        </el-form-item>
        <el-form-item label="显示排序" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" :min="0"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="false" :inactive-value="true"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addData, delData, getData, listData, updateData } from '@/api/system/dict/data'
import { getType, listType } from '@/api/system/dict/type'

export default {
  name: 'Data',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 字典表格数据
      dataList: [],
      // 默认字典类型
      defaultDictType: '',
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 类型数据字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        name: undefined,
        type: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dictLabel: [
          { required: true, message: '数据标签不能为空', trigger: 'blur' }
        ],
        dictValue: [
          { required: true, message: '数据键值不能为空', trigger: 'blur' }
        ],
        dictSort: [
          { required: true, message: '数据顺序不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    const dictId = this.$route.params && this.$route.params.dictId
    this.getType(dictId)
    this.getTypeList()
    this.getDicts('sys_normal_disable').then(response => {
      this.statusOptions = response.data
    })
  },
  methods: {
    /** 查询字典类型详细 */
    getType(dictId) {
      getType(dictId).then(response => {
        this.queryParams.type = response.data.type
        this.defaultDictType = response.data.type
        this.getList()
      })
    },
    /** 查询字典类型列表 */
    getTypeList() {
      listType().then(response => {
        this.typeOptions = response.data
      })
    },
    /** 查询字典数据列表 */
    getList() {
      this.loading = true
      listData(this.queryParams).then(response => {
        this.dataList = response.data.records
        this.total = response.data.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        dictCode: undefined,
        dictLabel: undefined,
        dictValue: undefined,
        dictSort: 0,
        status: '0',
        remark: undefined
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.current = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.queryParams.type = this.defaultDictType
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加字典数据'
      this.form.type = this.queryParams.type
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.dictCode)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const ids = row.id || this.ids
      getData(ids).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改字典数据'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.dictCode != undefined) {
            updateData(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addData(this.form).then(response => {
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
      const ids = row.id || this.ids
      this.$confirm('是否确认删除此项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delData(ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/dict/data/export', {
        ...this.queryParams
      }, `data_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
