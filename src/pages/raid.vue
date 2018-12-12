<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-raid"></use>
        </svg>
        {{$t('raidManage.name')}}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <el-form class="condition" :model="conditionForm" ref="allotCondition" :inline="true">
        <el-form-item label="MAC" prop="mac">
          <el-input size="small" v-model.trim=conditionForm.mac></el-input>
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input size="small" v-model.trim=conditionForm.ip></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="getItems">{{$t('common.search')}}</el-button>
          <el-button @click="resetCondition" size="small">{{$t('common.all')}}</el-button>
        </el-form-item>
      </el-form>
      <div class="btn-wrapper">
        <el-button size="small" type="warning" @click="clearOffline">{{$t('raidManage.clearOffline')}}</el-button>
      </div>
      <el-table :data="currentItems" :max-height="maxTableHeight" border style="width:100%;" size="mini">
        <el-table-column type="index" :label="$t('common.order')" width="55" align="center">
        </el-table-column>
        <el-table-column prop="server_code" :label="$t('common.name')" min-width="200" align="center">
          <template slot-scope="props">
            <div>{{props.row.server_code}}</div>
            <div v-if="props.row.editing">
              <el-input size="small" v-model="editingNote"></el-input>
              <el-button type="text" @click="saveNote(props.row)">{{$t('common.save')}}</el-button>
              <el-button type="text" @click="cancelEdit(props.row)">{{$t('common.cancel')}}</el-button>
            </div>
            <div v-else-if="props.row.server_code" @click="editRemark" style="cursor: pointer;">
              {{props.row.remark || $t('common.unRemark')}}
            </div>
            <div v-else @click="editNote(props.row)" style="cursor: pointer;">{{props.row.note ||
              $t('common.unRemark')}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('common.state')" width="70" align="center">
          <template slot-scope="props">
            <span v-if="props.row.status === 1" style="color: green;">{{$t('common.online')}}</span>
            <span v-else style="color: red;">{{$t('common.offline')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="size" :label="$t('common.updateTime')" width="140" align="center">
          <template slot-scope="scope">
            {{formatTime({timestamp:scope.row.log_time})}}
          </template>
        </el-table-column>
        <!--<el-table-column :label="$t('common.remark')" min-width="200" align="center">-->
        <!--<template slot-scope="props">-->
        <!--<div v-if="props.row.editing">-->
        <!--<el-input size="small" v-model="editingNote"></el-input>-->
        <!--<el-button type="text" @click="saveNote(props.row)">{{$t('common.save')}}</el-button>-->
        <!--<el-button type="text" @click="cancelEdit(props.row)">{{$t('common.cancel')}}</el-button>-->
        <!--</div>-->
        <!--<span v-else-if="props.row.server_code" @click="editRemark">-->
        <!--{{props.row.remark || $t('common.unRemark')}}-->
        <!--</span>-->
        <!--<span v-else @click="editNote(props.row)">{{props.row.note || $t('common.unRemark')}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column prop="mac" label="MAC" min-width="160" align="center">
        </el-table-column>
        <el-table-column prop="ip" label="IP" min-width="120" align="center">
        </el-table-column>
        <el-table-column prop="raid_level" :label="$t('common.level')" width="100" align="center">
        </el-table-column>
        <el-table-column prop="size" label="DATA" width="100" align="center">
          <template slot-scope="props">
            <span :class="{dangerText: renderUsed(props.row.data_size,props.row.data_used).danger}">{{renderUsed(props.row.data_size,props.row.data_used).label}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="NAS" width="100" align="center">
          <template slot-scope="props">
            <span :class="{dangerText: renderUsed(props.row.nas_size,props.row.nas_used).danger}">{{renderUsed(props.row.nas_size,props.row.nas_used).label}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="RAID" width="100" align="center">
          <template slot-scope="props">
            <span>{{props.row.used + '/'+props.row.size}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="raid_state" width="150" :label="'RAID'+$t('common.state')" align="center"
                         :filters="[{ text: $t('common.normal'), value: 1 }, { text: $t('common.abnormal'), value: 0 }]"
                         :filter-method="filterTag">
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.raid_state === 0">{{$t('common.abnormal')}}</el-tag>
            <el-tag type="success" v-else-if="scope.row.raid_state === 1">{{$t('common.normal')}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="detail" :label="$t('common.detail')" min-width="160" align="center">
          <template slot-scope="scope">
            <ul style="list-style: none;">
              <li class="device" v-for="detail in scope.row.detail.split(';').slice(0,-1)" :key="detail">{{detail}}</li>
            </ul>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination class="pagination" @size-change="pageSizeChange" @current-change="pageNoChange"
                     :page-sizes="[20, 30, 50,100,200]" :page-size=page.pageSize layout="total,sizes, prev, pager, next"
                     :total=page.totalRows>
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import { formatTime } from '../../assets/utils'

  export default {
    data () {
      return {
        formatTime,
        conditionForm: {
          mac: '',
          ip: ''
        },
        page: {
          pageNo: 1,
          pageSize: 50,
          totalRows: 0
        },
        currentItems: [],
        editingFlag: false,
        editingNote: ''
      }
    },
    computed: {
      maxTableHeight () {
        return document.body.clientHeight - 170
      }
    },
    created: function () {
      this.getItems()
    },
    methods: {
      clearOffline () {
        this.$confirm(this.$t('raidManage.clearOfflineConfirm'), { type: 'warning' }).then(() => {
          this.$http.get('api/raidInfo/delete').then(res => {
            if (res.result === 1) {
              this.getItems()
            }
          })
        }).catch(() => {
        })
      },
      saveNote (row) {
        this.$http
          .postForm('api/raidInfo/note', { id: row.id, note: this.editingNote })
          .then(res => {
            if (res.result === 1) {
              this.getItems()
            } else {
              this.$message.error(this.$t('raidManage.saveNoteFail'))
            }
          })
      },
      cancelEdit (row) {
        row.editing = false
        this.currentItems = this.currentItems.slice()
      },
      editRemark () {
        this.$message.info(this.$t('raidManage.pleaseEditInServerManage'))
      },
      editNote (row) {
        row.editing = true
        this.editingNote = row.note
        this.currentItems.forEach(item => {
          if (item !== row) {
            item.editing = false
          }
        })
        this.currentItems = this.currentItems.slice()
      },
      renderUsed (total, used) {
        if (total) {
          total = parseInt(total)
        } else {
          return { danger: false, label: '' }
        }
        if (used) {
          used = parseInt(used)
        }
        return { danger: (used / total) > 0.9, label: `${used}/${total}` }
      },
      pageSizeChange (pageSize) {
        this.page.pageSize = pageSize
        this.page.pageNo = 1
        this.getItems()
      },
      pageNoChange (pageNo) {
        this.page.pageNo = pageNo
        this.getItems()
      },
      getItems () {
        this.$http
          .postForm('api/raidInfo/list', {
            beanJson: JSON.stringify(this.conditionForm),
            pageJson: JSON.stringify(this.page)
          })
          .then(res => {
            if (res.result === 1) {
              this.currentItems = res.list
              this.currentItems.forEach(item => {
                item.editing = false
              })
              this.page.pageNo = res.page.pageNo
              this.page.totalRows = res.page.totalRows
              this.page.pageSize = res.page.pageSize
            }
          })
      },
      resetCondition () {
        this.conditionForm = {
          mac: '',
          ip: ''
        }
        this.page = {
          pageNo: 1,
          pageSize: 50,
          totalRows: 0
        }
        this.getItems()
      },
      filterTag (value, row) {
        return row.raid_state == value
      }
    }
  }
</script>
<style scoped>
  .dangerText {
    color: red;
  }

  .content {
    position: relative;
  }

  .btn-wrapper {
    position: absolute;
    right: 20px;
    top: 5px;
  }
</style>
