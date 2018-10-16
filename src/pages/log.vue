<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-log"></use>
        </svg>
        {{$t('logManage.name')}}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <el-form inline size="small">
        <el-form-item :label="$t('logManage.date')">
          <el-date-picker v-model="conditionForm.item.timeRange" type="daterange" range-separator="-" :start-placeholder="$t('logManage.startDate')" :end-placeholder="$t('logManage.endDate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input v-model="conditionForm.item.note"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getItems" type="primary">{{$t('common.search')}}</el-button>
          <el-button @click="resetCondition">{{$t('common.all')}}</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="currentItems" @selection-change="selectionChange" border style="width: 100%" size="mini" @sort-change="sortItems" :max-height="maxTableHeight">

        <el-table-column prop="update_time" :label="$t('common.updateTime')" width="140" sortable align="center">
          <template slot-scope="props">
            {{formatTime({timestamp:props.row.time})}}
          </template>
        </el-table-column>
        <el-table-column prop="note" :label="$t('logManage.content')" align="center">
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" @size-change="pageSizeChange" :page-sizes="[30, 50, 100, 200]" :page-size="conditionForm.page.pageSize" :current-page="conditionForm.page.pageNo" @current-change="pageNoChange" layout="total, sizes,prev, pager, next, jumper" :total="conditionForm.page.totalRows">
      </el-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import { formatTime } from '../assets/scripts/utils'

import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      formatTime,
      /* table */
      currentItems: [] as any[],
      selectedItems: [] as any[],
      conditionForm: {
        item: {
          timeRange: '',
          startTime: '',
          endTime: '',
          note: ''
        },
        page: {
          pageSize: 50,
          pageNo: 1,
          totalRows: 0,
          sortname: 'time',
          sortorder: 'desc'
        }
      }
    }
  },
  computed: {
    maxTableHeight() {
      return document.body.clientHeight - 150
    }
  },
  mounted() {
    this.getItems()
  },
  methods: {
    getItems() {
      if (this.conditionForm.item.timeRange.length === 2) {
        this.conditionForm.item.startTime = '' +
          (parseInt(this.conditionForm.item.timeRange[0].valueOf()) / 1000)
        this.conditionForm.item.endTime = '' +
          (parseInt(this.conditionForm.item.timeRange[1].valueOf()) / 1000 + 24 * 3600)
      } else {
        this.conditionForm.item.startTime = ''
        this.conditionForm.item.endTime = ''
      }
      this.$http.postJSON('api/log/list', this.conditionForm).then(res => {
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
    selectionChange(selections: any[]) {
      this.selectedItems = selections.map(item => {
        return item
      })
    },
    pageSizeChange(size: number) {
      this.conditionForm.page.pageSize = size
      this.getItems()
    },
    pageNoChange(no: number) {
      this.conditionForm.page.pageNo = no
      this.getItems()
    },
    resetCondition() {
      this.conditionForm = {
        item: {
          timeRange: '',
          startTime: '',
          endTime: '',
          note: ''
        },
        page: {
          pageSize: 50,
          pageNo: 1,
          totalRows: 0,
          sortname: 'time',
          sortorder: 'desc'
        }
      }
      this.getItems()
    }
  }
})
</script>
<style scoped>
</style>
