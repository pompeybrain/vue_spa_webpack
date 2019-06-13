<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-group"></use>
        </svg>
        服务器分组
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <div class="row">
        <el-button icon="plus" class="long-btn" type="primary" size="small" @click="addItem">{{$t('common.add')}}
        </el-button>
        <el-button icon="delete" size="small" plain type="danger" @click="confirmDelete()" class="long-btn">
          {{$t('common.delete')}}
        </el-button>
      </div>
      <el-table :data="currentItems" @selection-change="selectionChange" border style="width: 100%" size="mini"
                @sort-change="sortItems" :max-height="maxTableHeight">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column prop="name" label="分组名称" align="center">
        </el-table-column>
        <el-table-column prop="server_num" label="服务器数量" align="center">
        </el-table-column>
        <el-table-column :label="$t('common.operate')" align="center">
          <template slot-scope="props">
            <div class="btn-group">
              <el-button type="text" @click="groupDetail(props.row)">分组详情</el-button>
              <el-button type="text" @click="editItem(props.row)">{{$t('common.edit')}}</el-button>
              <el-button type="text" @click="confirmDelete(props.row.id)">{{$t('common.delete')}}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" @size-change="pageSizeChange" :page-sizes="[30, 50, 100, 200]"
                     :page-size="conditionForm.page.pageSize" :current-page="conditionForm.page.pageNo"
                     @current-change="pageNoChange" layout="total, sizes,prev, pager, next, jumper"
                     :total="conditionForm.page.totalRows">
      </el-pagination>
      <!--item form-->
      <el-dialog :title="itemForm.id !== -1?$t('common.edit'):$t('common.add')" :visible.sync="itemFormVisible"
                 width="700px" @close="resetForm">
        <el-form :model="itemForm" ref="itemForm" label-width="100px" class="account-form" :rules="itemFormRules">
          <el-form-item label="分组名称" prop="name">
            <el-input size="small" style="width: 200px;" v-model.trim="itemForm.name"></el-input>
          </el-form-item>
          <el-form-item label="选择服务器">
            <el-transfer
              ref="transfer"
              filterable
              :titles="['未选择','已选择']"
              size="small"
              :props="{label:'server_code', key:'id'}"
              filter-placeholder="搜索服务器名称"
              v-model="selectedServers"
              :data="allServers">
            </el-transfer>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" :loading="saving" @click="saveItem">{{$t('common.save')}}</el-button>
            <el-button size="small" @click="itemFormVisible = false">{{$t('common.cancel')}}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog title="分组详情" :visible.sync="groupDetailVisible" width="500px">
        <div>
          <span>当前分组：{{groupDetailName}}</span>
        </div>
        <div>服务器列表：</div>
        <div v-if="!groupServers.length"> 无服务器</div>
        <div v-else class="servers">
          <span v-for="server in groupServers" :key="server.server_code" class="server">{{server.server_code}}</span>
        </div>
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
          name: '',
          serverIds: '',
        },
        itemFormVisible: false,
        saving: false,
        itemFormRules: {
          name: [
            {required: true, message: '请输入分组名称'}
          ],
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
        },
        allServers: [],
        selectedServers: [],
        groupServers: [],
        groupDetailName: '',
        groupDetailVisible: false
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
      groupDetail({name, id}) {
        this.groupDetailName = name
        this.getServerByGroup(id).then(servers => {
          this.groupServers = servers
          this.groupDetailVisible = true
        }).catch()
      },
      getServerByGroup(groupId) {
        return this.$http.get('api/serverInfo/listServerByGroupId?groupId=' + groupId).then(res => {
          if (res.result === 1) {
            return res.list
          } else {
            return []
          }
        })
      },
      getEditGroup(groupId) {
        return this.$http.get('api/serverInfo/serverBindGroupInfo?groupId=' + groupId).then(res => {
          if (res.result === 1) {
            return {allServers: res.object.allList, selectedServers: res.object.bindSelfList}
          } else {
            return {allServers: [], selectedServers: []}
          }
        })
      },
      /* item form */
      addItem() {
        this.getEditGroup('').then(({allServers, selectedServers}) => {
          this.allServers = allServers
          this.selectedServers = selectedServers.map(_ => _.id)
          this.itemFormVisible = true
        })
      },
      editItem(item) {
        this.itemForm.id = item.id
        this.itemForm.name = item.name
        this.getEditGroup(item.id).then(({allServers, selectedServers}) => {
          this.allServers = allServers
          this.selectedServers = selectedServers.map(_ => _.id)
          this.itemFormVisible = true
        })
      },
      saveItem() {
        this.$refs['itemForm'].validate(valid => {
          if (valid) {
            this.saving = true
            let url = 'api/serverGroup/add'
            if (this.itemForm.id !== -1) {
              url = 'api/serverGroup/update'
            }
            this.itemForm.serverIds = this.selectedServers.join(',')
            this.$http.postForm(url, this.itemForm).then(res => {
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
          .catch(() => {
          })
      },
      deleteItem(ids) {
        this.$http.get('api/serverGroup/delete?ids=' + ids).then(res => {
          if (res.result === 1) {
            this.$message.success(this.$ts('common.operateSuccess'))
            this.getItems()
          }
        })
      } /* table 必备 */,
      getItems() {
        this.$http.postJSON('api/serverGroup/list', this.conditionForm).then(res => {
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
      resetForm () {
        this.$refs['transfer'].clearQuery('left')
        this.$refs['transfer'].clearQuery('right')
        this.itemForm = {
          id: -1,
          name: '',
          serverIds: ''
        }
        this.$refs['itemForm'].resetFields()
      }
    }
  }
</script>
<style scoped>
  .servers {
    max-height: 400px;
    overflow: auto;
  }

  .servers .server {
    display: inline-block;
    width: 140px;
    padding: 0 8px;
    line-height: 30px;
    height: 30px;
    text-align: center;
    background-color: #4a87ff;
    color: #ffffff;
    margin: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
