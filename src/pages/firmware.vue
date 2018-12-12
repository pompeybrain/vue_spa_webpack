<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>
        <svg
          class="icon"
          aria-hidden="true"
        >
          <use xlink:href="#icon-firmware"></use>
        </svg>
        {{$ts('firmwareManage.name')}}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <div class="row">
        <el-button
          icon="plus"
          class="long-btn"
          type="primary"
          size="small"
          @click="addItem"
        >{{$ts('common.add')}}</el-button>
        <el-button
          icon="delete"
          size="small"
          plain
          type="danger"
          @click="confirmDelete()"
          class="long-btn"
        >{{$ts('common.delete')}}</el-button>
        <el-button
          icon="plus"
          size="small"
          @click="confirmAllDownload"
          class="long-btn"
        >{{$ts('common.oneKeyDeliver')}}</el-button>
      </div>
      <el-table
        :data="currentItems"
        @selection-change="selectionChange"
        border
        style="width: 100%"
        size="mini"
        @sort-change="sortItems"
        :max-height="maxTableHeight"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="version"
          :label="$ts('common.version')"
          width="100"
          sortable
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="note"
          :label="$ts('common.versionNote')"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="update_time"
          :label="$ts('common.updateTime')"
          width="140"
          sortable
          align="center"
        >
          <template slot-scope="props">
            {{formatTime({timestamp:props.row.update_time})}}
          </template>
        </el-table-column>
        <el-table-column
          prop="url"
          :label="$ts('firmwareManage.firmwarePath')"
          align="center"
        >
        </el-table-column>
        <el-table-column
          :label="$ts('common.operate')"
          align="center"
        >
          <template slot-scope="props">
            <div class="btn-group">
              <el-button
                type="text"
                @click="editItem(props.row)"
              >{{$ts('common.edit')}}</el-button>
              <el-button
                type="text"
                @click="confirmDelete(props.row.id)"
              >{{$ts('common.delete')}}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @size-change="pageSizeChange"
        :page-sizes="[30, 50, 100, 200]"
        :page-size="conditionForm.page.pageSize"
        :current-page="conditionForm.page.pageNo"
        @current-change="pageNoChange"
        layout="total, sizes,prev, pager, next, jumper"
        :total="conditionForm.page.totalRows"
      >
      </el-pagination>
      <!--item form-->
      <el-dialog
        :title="itemForm.id !== -1?$ts('common.edit'):$ts('common.add')"
        :visible.sync="itemFormVisible"
        custom-class="update-form-dialog"
        @close="resetForm"
      >
        <el-form
          :model="itemForm"
          ref="itemForm"
          label-width="100px"
          class="account-form"
          :rules="itemFormRules"
        >
          <el-form-item
            :label="$ts('common.version')"
            prop="version"
          >
            <span v-if="itemForm.id !== -1">{{itemForm.version}}</span>
            <el-input
              v-else
              v-model.trim="itemForm.version"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$ts('firmwareManage.firmwarePath')"
            prop="url"
          >
            <el-input v-model.trim="itemForm.url"></el-input>
          </el-form-item>
          <el-form-item
            :label="$ts('common.versionNote')"
            prop="note"
          >
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 10}"
              v-model.trim="itemForm.note"
            >
            </el-input>
          </el-form-item>
          <el-button
            type="primary"
            class="lg-btn"
            :loading="saving"
            @click="saveItem"
          >{{$ts('common.save')}}</el-button>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { formatTime } from '../assets/scripts/utils'
export default Vue.extend({
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
          { required: true, message: this.$ts('romManage.pleaseInputVersion') }
        ],
        url: [
          {
            required: true,
            message: this.$ts('firmwareManage.pleaseInputFirmwarePath')
          }
        ],
        note: [
          { required: true, message: this.$ts('romManage.pleaseInputVersionNote') }
        ]
      },
      /* table */
      currentItems: [] as any[],
      selectedItems: [] as any[],
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
        this.$message.info(<string>this.$ts('firmwareManage.selectOneFirmware'))
        return false
      }
      if (this.selectedItems.length !== 1) {
        this.$message.info(this.$ts('firmwareManage.onlyOneFirmware'))
        return false
      }
      let rom = this.selectedItems[0].url
      this.$confirm(
        this.$ts('romManage.confirmOneKey'),
        this.$ts('common.confirm'),
        { type: 'warning' }
      )
        .then(() => {
          this.allDownload(rom)
        })
        .catch(() => { })
    },
    allDownload(rom: any) {
      this.$http
        .postForm('api/serverInfo/downRomStore', {
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
    editItem(item: any) {
      this.itemForm.id = item.id
      this.itemForm.version = item.version
      this.itemForm.url = item.url
      this.itemForm.note = item.note
      this.itemFormVisible = true
    },
    saveItem() {
      let itemForm: any = this.$refs['itemForm'];
      itemForm.validate((valid: boolean) => {
        if (valid) {
          this.saving = true
          let url = 'api/romStore/add'
          if (this.itemForm.id !== -1) {
            url = 'api/romStore/update'
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
    confirmDelete(ids: any = 0) {
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
        .catch(() => { })
    },
    deleteItem(ids: any) {
      this.$http.get('api/romStore/delete?ids=' + ids).then(res => {
        if (res.result === 1) {
          this.$message.success(this.$ts('common.operateSuccess'))
          this.getItems()
        }
      })
    } /* table 必备 */,
    getItems() {
      this.$http.postJSON('api/romStore/list', this.conditionForm).then(res => {
        if (res.result === 1) {
          this.currentItems = res.list
          this.conditionForm.page.pageNo = res.page.pageNo
          this.conditionForm.page.totalRows = res.page.totalRows
          this.conditionForm.page.pageSize = res.page.pageSize
        }
      })
    },
    sortItems({ prop, order }: any) {
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
    selectionChange(selections: any) {
      this.selectedItems = selections.map((item: any) => {
        return item
      })
    },
    pageSizeChange(size: any) {
      this.conditionForm.page.pageSize = size
      this.getItems()
    },
    pageNoChange(no: any) {
      this.conditionForm.page.pageNo = no
      this.getItems()
    },
    resetForm: function () {
      let itemForm: any = this.$refs['itemForm']
      itemForm.resetFields()
      this.itemForm = {
        id: -1,
        version: '',
        url: '',
        note: ''
      }
    }
  }
})
</script>
<style scoped>
</style>
