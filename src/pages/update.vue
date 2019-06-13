<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-package-up"></use>
        </svg>
        {{$t('romManage.name')}}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <div class="row">
        <el-button icon="plus" class="long-btn" type="primary" size="small" @click="addItem">{{$t('common.add')}}</el-button>
        <el-button icon="delete" size="small" plain type="danger" @click="confirmDelete()" class="long-btn">{{$t('common.delete')}}</el-button>
        <el-button icon="plus" size="small" @click="confirmAllDownload" class="long-btn">{{$t('common.oneKeyDeliver')}}</el-button>
      </div>
      <el-table :data="currentItems" @selection-change="selectionChange" border style="width: 100%" size="mini" @sort-change="sortItems" :max-height="maxTableHeight">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column prop="version" :label="$t('common.version')" width="100" sortable align="center">
        </el-table-column>
        <el-table-column prop="note" :label="$t('common.versionNote')" align="center">
        </el-table-column>
        <el-table-column prop="update_time" :label="$t('common.updateTime')" width="140" sortable align="center">
          <template slot-scope="props">
            {{formatTime({timestamp:props.row.update_time})}}
          </template>
        </el-table-column>
        <el-table-column prop="url" :label="$t('romManage.romPath')" align="center">
        </el-table-column>
        <el-table-column :label="$t('common.operate')" width="210" align="center">
          <template slot-scope="props">
            <div class="btn-group">
              <el-button type="text" @click="editItem(props.row)">{{$t('common.edit')}}</el-button>
              <el-button type="text" @click="confirmDelete(props.row.id)">{{$t('common.delete')}}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" @size-change="pageSizeChange" :page-sizes="[30, 50, 100, 200]" :page-size="conditionForm.page.pageSize" :current-page="conditionForm.page.pageNo" @current-change="pageNoChange" layout="total, sizes,prev, pager, next, jumper" :total="conditionForm.page.totalRows">
      </el-pagination>
      <!--item form-->
      <el-dialog :title="itemForm.id !== -1?$t('common.edit'):$t('common.add')" :visible.sync="itemFormVisible" custom-class="update-form-dialog" @close="resetForm">
        <el-form :model="itemForm" ref="itemForm" label-width="100px" class="account-form" :rules="itemFormRules">
          <el-form-item :label="$t('common.version')" prop="version">
            <span v-if="itemForm.id !== -1">{{itemForm.version}}</span>
            <el-input v-else v-model.trim="itemForm.version"></el-input>
          </el-form-item>
          <el-form-item :label="$t('romManage.romPath')" prop="url">
            <el-input v-model.trim="itemForm.url"></el-input>
          </el-form-item>
          <el-form-item :label="$t('common.versionNote')" prop="note">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" v-model.trim="itemForm.note">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="lg-btn" :loading="saving" @click="saveItem">{{$t('common.save')}}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {formatTime} from '../../assets/utils'
export default {
  data() {
    return {
      formatTime,
      /* item form */
      itemForm: {
        id: -1,
        version: '',
        url: '',
        note: ''
      },
      itemFormVisible: false,
      saving: false,
      itemFormRules: {
        version: [
          {required: true, message: this.$ts('romManage.pleaseInputVersion')}
        ],
        url: [
          {required: true, message: this.$ts('romManage.pleaseInputRomPath')}
        ],
        note: [
          {required: true, message: this.$ts('romManage.pleaseInputVersionNote')}
        ]
      },
      /* table */
      currentItems: [],
      selectedItems: [],
      conditionForm: {
        item: {
          id: '',
          version: '',
          url: '',
          note: ''
        },
        page: {
          pageSize: 50,
          pageNo: 1,
          totalRows: 0,
          sortname: 'id',
          sortorder: 'desc'
        }
      }
    }
  },
  computed: {
    maxTableHeight() {
      return document.body.clientHeight - 140
    }
  },
  mounted() {
    this.getItems()
  },
  methods: {
    confirmAllDownload() {
      if (!this.selectedItems.length) {
        this.$message.info(this.$ts('romManage.selectOnePackage'))
        return false
      }
      if (this.selectedItems.length !== 1) {
        this.$message.info(this.$ts('romManage.onlyOnePackage'))
        return false
      }
      let rom = this.selectedItems[0].url
      this.$confirm(
        this.$ts('romManage.confirmOneKey'),
        this.$ts('common.confirm'),
        {type: 'warning'}
      )
        .then(() => {
          this.allDownload(rom)
        })
        .catch(() => {})
    },
    allDownload(rom) {
      this.$http
        .postForm('api/serverInfo/downRom', {
          serverCodes: 'all',
          rom: rom
        })
        .then(res => {
          if (res.result === 1) {
            this.$message.success(this.$ts('common.operateSuccess'))
          } else {
            this.$message.error(this.$ts('common.operateFail'))
          }
        })
    },
    /* item form */
    addItem() {
      this.itemFormVisible = true
    },
    editItem(item) {
      this.itemForm.id = item.id
      this.itemForm.version = item.version
      this.itemForm.url = item.url
      this.itemForm.note = item.note
      this.itemFormVisible = true
    },
    saveItem() {
      this.$refs['itemForm'].validate(valid => {
        if (valid) {
          this.saving = true
          let url = 'api/updateRom/add'
          if (this.itemForm.id !== -1) {
            url = 'api/updateRom/update'
          }
          this.$http.postJSON(url, this.itemForm).then(res => {
            this.saving = false
            if (res.result === 1) {
              this.$message.success(this.$ts('common.operateSuccess'))
              this.itemFormVisible = false
              this.getItems()
            } else {
              this.$message.error(this.$ts('common.operateFail'))
            }
          })
        } else {
          this.$message.error(this.$ts('common.formError'))
        }
      })
    },
    confirmDelete(ids = 0) {
      let confirmText = this.$ts('common.confirmDeleteOne')
      if (!ids) {
        // 勾选操作
        confirmText = this.$ts('common.confirmDeleteSelected')
        ids = this.selectedItems.map(ele => {
          return ele.id
        })
        if (!ids.length) {
          // 没有勾选
          this.$message.info(this.$ts('common.selectLeastOne'))
          return false
        } else {
          ids = ids.join(',')
        }
      }
      this.$confirm(confirmText, this.$ts('common.confirm'), {
        type: 'warning'
      })
        .then(() => {
          this.deleteItem(ids)
        })
        .catch(() => {})
    },
    deleteItem(ids) {
      this.$http.get('api/updateRom/delete?ids=' + ids).then(res => {
        if (res.result === 1) {
          this.$message.success(this.$ts('common.operateSuccess'))
          this.getItems()
        }
      })
    },
    getItems() {
      this.$http
        .postJSON('api/updateRom/list', this.conditionForm)
        .then(res => {
          if (res.result === 1) {
            this.currentItems = res.list
            this.conditionForm.page.pageNo = res.page.pageNo
            this.conditionForm.page.totalRows = res.page.totalRows
            this.conditionForm.page.pageSize = res.page.pageSize
          }
        })
    },
    sortItems({prop, order}) {
      if (prop) {
        this.conditionForm.page.sortname = prop
        if (order === 'descending') {
          this.conditionForm.page.sortorder = 'desc'
        } else {
          this.conditionForm.page.sortorder = 'asc'
        }
      } else {
        this.conditionForm.page.sortname = 'id'
        this.conditionForm.page.sortorder = 'desc'
      }
      this.getItems()
    },
    selectionChange(selections) {
      this.selectedItems = selections.map(item => {
        return item
      })
    },
    pageSizeChange(size) {
      this.conditionForm.page.pageSize = size
      this.getItems()
    },
    pageNoChange(no) {
      this.conditionForm.page.pageNo = no
      this.getItems()
    },
    resetForm: function() {
      this.$refs['itemForm'].resetFields()
      this.itemForm = {
        id: -1,
        version: '',
        url: '',
        note: ''
      }
    }
  }
}
</script>
<style scoped>

</style>
