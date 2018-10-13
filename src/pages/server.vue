<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-server"></use>
        </svg>
        {{$t('serverManage.name')}}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <div class="content">
        <el-row>
          <el-button class="long-btn" type="primary" size="small" @click="downDialog('downRom')">
            {{$t('serverManage.downRom')}}
          </el-button>
          <el-button class="long-btn" type="primary" size="small" @click="downDialog('downRomStore')">
            {{$t('serverManage.downFirmware')}}
          </el-button>
          <el-button class="long-btn" type="primary" size="small" @click="downDialog('updateServer')">
            {{$t('serverManage.upgradeServer')}}
          </el-button>
        </el-row>
        <el-form class="row" inline size="small" label-width="110px">
          <el-form-item :label="$t('serverManage.serverState')">
            <el-select v-model="conditionForm.item.state" size="small" class="small-select">
              <el-option :label="$t('common.all')" :value="''">
              </el-option>
              <el-option :label="$t('common.online')" :value="1">
              </el-option>
              <el-option :label="$t('common.offline')" :value="0">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分组">
            <el-select v-model="conditionForm.item.server_group_id" size="small" class="small-select" placeholder="">
              <el-option :label="$t('common.all')" value="">
              </el-option>
              <el-option v-for="item in allGroups" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('serverManage.serverVersion')">
            <el-select v-model="conditionForm.item.server_version" size="small" class="small-select" placeholder="">
              <el-option :label="$t('common.all')" value="">
              </el-option>
              <el-option v-for="item in serverVersions" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('serverManage.romDownResult')">
            <el-select v-model="conditionForm.item.down_result" size="small" class="small-select" placeholder="">
              <el-option :label="$t('common.all')" value="">
              </el-option>
              <el-option :label="$t('common.success')" :value="$t('common.success')">
              </el-option>
              <el-option :label="$t('common.fail')" :value="$t('common.fail')">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('serverManage.firmwareDownResult')">
            <el-select v-model="conditionForm.item.romStore_result" size="small" class="small-select" placeholder="">
              <el-option :label="$t('common.all')" value="">
              </el-option>
              <el-option :label="$t('common.success')" :value="$t('common.success')">
              </el-option>
              <el-option :label="$t('common.fail')" :value="$t('common.fail')">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('serverManage.firmwareVersion')">
            <el-select v-model="conditionForm.item.device_version" size="small" class="small-select" placeholder="">
              <el-option :label="$t('common.all')" value="">
              </el-option>
              <el-option v-for="item in romStores" :key="item.id" :label="item.version" :value="item.version">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="110px" label=" ">
            <el-input v-model="conditionForm.item.server_code" style="width: 200px;" size="small" :placeholder="$t('serverManage.searchServerName')"></el-input>
          </el-form-item>
          <el-form-item label-width="110px" label=" " >
            <el-button @click="getItems" type="primary">{{$t('common.search')}}</el-button>
            <el-button @click="resetCondition">{{$t('common.all')}}</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="currentItems" @selection-change="selectionChange" border style="width: 100%" size="mini" @sort-change="sortItems" :max-height="maxTableHeight">
          <el-table-column type="selection" width="50" align="center">
          </el-table-column>
          <el-table-column prop="server_code" :label="$t('common.name')" align="center">
            <template slot-scope="scope">
              <el-tooltip placement="top">
                <div slot="content">
                  <div>{{$t('serverManage.port')}} : {{scope.row.port}}</div>
                  <div v-if="scope.row.type">{{$t('serverManage.networkSetting')}}</div>
                  <div v-if="scope.row.type == 'Static IPv4'">
                    <div>{{$t('serverManage.networkType')}} : {{$t('serverManage.staticIp')}}</div>
                    <div>{{$t('serverManage.ipAddress')}} : {{scope.row.ip_addr}}</div>
                    <div>{{$t('serverManage.netmask')}} : {{scope.row.subnet_mask}}</div>
                    <div>{{$t('serverManage.gateway')}} : {{scope.row.gateway_addr}}</div>
                  </div>
                  <div v-else-if="scope.row.type == 'PPPoE'">
                    <div>{{$t('serverManage.networkType')}} : {{$t('serverManage.pppoe')}}</div>
                    <div>{{$t('serverManage.broadbandUser')}} : {{scope.row.broadband_account}}</div>
                    <div>{{$t('serverManage.broadbandPass')}} : {{scope.row.broadband_password}}</div>
                  </div>
                </div>
                <div>
                  <div @click="editServer(scope.row)" style="cursor:pointer;">{{scope.row.server_code}}</div>
                  <div>{{scope.row.remark}}</div>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="state" width="80" :label="$t('common.state')" sortable align="center">
            <template slot-scope="props">
              <el-tooltip placement="top">
                <div slot="content">
                  <div>
                    <div>
                      更新时间：
                    </div>
                    <div>
                      {{formatTime({ timestamp: props.row.report_time, isMilli:false})}}
                    </div>
                  </div>
                  <div>
                    <div class="label-name">{{$t('serverManage.deviceStatus')}}</div>
                    <div class="label-nums">
                      <span class="label-num">{{$t('common.online')}}: {{props.row.online}} </span>
                      <span class="label-num">{{$t('common.offline')}}: {{props.row.offline}} </span>
                    </div>
                  </div>
                  <div>
                    <div class="label-name">{{$t('serverManage.dispatchStatus')}}</div>
                    <div class="label-nums">
                      <span class="label-num">{{$t('common.run')}}: {{props.row.dispatch_run}} </span>
                      <span class="label-num">{{$t('common.pause')}}: {{props.row.dispatch_pause}} </span>
                    </div>
                  </div>
                  <div>
                    <div class="label-name">{{$t('serverManage.proxyStatus')}}</div>
                    <div class="label-nums">
                      <span class="label-num">{{$t('common.online')}}: {{props.row.proxy_online}} </span>
                      <span class="label-num">{{$t('common.offline')}}: {{props.row.proxy_offline}} </span>
                    </div>
                  </div>
                </div>
                <div>
                  <span v-if="props.row.state===1" style="color: green;">{{$t('common.online')}}</span>
                  <span v-else style="color: red">{{$t('common.offline')}}</span>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="server_group_name" label="分组" width="80" sortable align="center">
          </el-table-column>
          <el-table-column prop="server_mac" label="MAC" width="120" sortable align="center">
          </el-table-column>
          <el-table-column prop="password" label="向导密码" width="100" sortable align="center">
          </el-table-column>
          <el-table-column prop="ip" label="外网地址" width="120" sortable align="center">
          </el-table-column>
          <!--<el-table-column prop="report_time" :label="$t('common.updateTime')" width="140" sortable align="center">-->
            <!--<template slot-scope="scope">-->
              <!--{{formatTime({timestamp: scope.row.report_time})}}-->
            <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column prop="server_version" width="120" :label="$t('serverManage.serverVersion')" sortable align="center">
          </el-table-column>
          <el-table-column prop="down_result" sortable width="130" :label="$t('serverManage.romDownResult')" align="center">
            <template slot-scope="scope">
              <div v-if="(scope.row.down_result).indexOf('失')!==-1 || (scope.row.down_result).indexOf('fail')!==-1" style="color:red;">{{scope.row.down_result}}</div>
              <div  v-else>{{scope.row.down_result}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="update_result" width="130" :label="$t('serverManage.upgradeResult')" sortable align="center">
            <template slot-scope="scope">
              <span v-if="(scope.row.update_result).indexOf('失')!==-1 || (scope.row.down_result).indexOf('fail')!==-1" style="color:red;">{{scope.row.update_result}}</span>
              <span v-else>{{scope.row.update_result}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="roms_name" width="100" :label="$t('serverManage.upgradePackages')" align="center">
            <template slot-scope="props">
              <span v-if="props.row.allRoms.length === 0">{{$t('common.none')}}</span>
              <ul style="list-style: none;" v-else-if="props.row.romCollapse">
                <li v-for="romName in props.row.collapsedRoms" :key="romName">{{romName}}</li>
              </ul>
              <ul v-else style="list-style: none;">
                <li v-for="romName in props.row.allRoms" :key="romName">{{romName}}</li>
              </ul>
              <div class="text-btn" v-if="props.row.allRoms.length>3" @click="toggleRomCollapse(props.row)">{{ props.row.romCollapse?$t('serverManage.expand'):$t('serverManage.collapse')}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="device_version" width="100" :label="$t('serverManage.firmwareVersion')" sortable align="center">
          </el-table-column>
          <el-table-column prop="romStore_result" width="130" :label="$t('serverManage.firmwareDownResult')" sortable align="center">
            <template slot-scope="scope">
              <span v-if="(scope.row.romStore_result).indexOf('失')!==-1 || (scope.row.romStore_result).indexOf('fail')!==-1" style="color:red;">{{scope.row.romStore_result}}</span>
              <span v-else>{{scope.row.romStore_result}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="romStore_resouce" :label="$t('serverManage.firmwareResources')" align="center">
            <template slot-scope="scope">
              <ul style="list-style: none;">
                <li v-for="romName in scope.row.romStore_resouce.split(',')" :key="romName">{{romName}}</li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.operate')" align="center" fixed="right">
            <template slot-scope="props">
              <a style="text-decoration: none; color:#409eff" target="_blank" :href="'http://'+props.row.server_code+'.dianying2800.com:'+props.row.port+'/node'">
                {{$t('common.link')}}
              </a>
              <el-button v-if="props.row.state!==1" type="text" style="font-size: 12px;" @click="deleteItem(props.row)">
                {{$t('common.delete')}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="pagination" @size-change="pageSizeChange" :page-sizes="[30, 50, 100, 200]" :page-size="conditionForm.page.pageSize" :current-page="conditionForm.page.pageNo" @current-change="pageNoChange" layout="total, sizes,prev, pager, next, jumper" :total="conditionForm.page.totalRows">
        </el-pagination>
        <el-dialog custom-class="server-dialog" width="450px" :title="$t('serverManage.editServerInfo')" :visible.sync="itemDialogVisible" center>
          <el-form label-width="100px" label-position="left" size="small" :model="currentItem">
            <el-form-item :label="$t('common.code')">
              <span>{{currentItem.serverCode}}</span>
            </el-form-item>
            <el-form-item :label="$t('serverManage.serverPassword')">
              <span>{{currentItem.server_password}}</span>
            </el-form-item>
            <el-form-item :label="$t('common.remark')">
              <el-input v-model.trim="currentItem.remark"></el-input>
            </el-form-item>
            <el-form-item :label="$t('serverManage.port')">
              <el-input v-model.trim="currentItem.port"></el-input>
            </el-form-item>
            <div v-if="currentItem.type">
              <div class="sub-title">
                {{$t('serverManage.networkSetting')}}
              </div>
              <div v-if="currentItem.type == 'Static IPv4'">
                <el-form-item :label="$t('serverManage.networkType')">
                  <span>{{$t('serverManage.staticIp')}}</span>
                  <!-- <el-input :disabled="true" :value="$t('serverManage.staticIp')"></el-input> -->
                </el-form-item>
                <el-form-item :label="$t('serverManage.ipAddress')">
                  <span>{{currentItem.ip_addr}}</span>
                  <!-- <el-input :disabled="true" :value="currentItem.ip_addr"></el-input> -->
                </el-form-item>
                <el-form-item :label="$t('serverManage.netmask')">
                  <span>{{currentItem.subnet_mask}}</span>
                  <!-- <el-input :disabled="true" :value="currentItem.subnet_mask"></el-input> -->
                </el-form-item>
                <el-form-item :label="$t('serverManage.gateway')">
                  <span>{{currentItem.gateway_addr}}</span>
                  <!-- <el-input :disabled="true" :value="currentItem.gateway_addr"></el-input> -->
                </el-form-item>
              </div>
              <div v-if="currentItem.type == 'PPPoE'">
                <el-form-item :label="$t('serverManage.networkType')">
                  <span>{{$t('serverManage.pppoe')}}</span>
                  <!-- <el-input :disabled="true" :value="$t('serverManage.pppoe')"></el-input> -->
                </el-form-item>
                <el-form-item :label="$t('serverManage.broadbandUser')">
                  <span>{{currentItem.broadband_account}}</span>
                  <!-- <el-input :disabled="true" :value="currentItem.broadband_account"></el-input> -->
                </el-form-item>
                <el-form-item :label="$t('serverManage.broadbandPass')">
                  <span>{{currentItem.broadband_password}}</span>
                  <!-- <el-input :disabled="true" :value="currentItem.broadband_password"></el-input> -->
                </el-form-item>
              </div>
            </div>
            <el-form-item>
              <el-button @click="itemDialogVisible = false">{{$t('common.cancel')}}</el-button>
              <el-button type="primary" @click="updateServer">{{$t('common.ok')}}</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog :title="downDialogTitle" width="500px" :visible.sync="downDialogVisible" center>
          <div class="down-dialog-content">
            <el-row>
              <label>{{downDialogSelectLabel}}</label>
              <el-select v-model="selectedRom" size="small" :placeholder="downDialogPlaceholder">
                <el-option v-for="item in currentDownOptions" :key="item.id" :label="item.version" :value="item.url">
                </el-option>
              </el-select>
            </el-row>
            <el-row class="btns">
              <el-button @click="downDialogVisible=false" size="small" class="long-btn">{{$t('common.cancel')}}
              </el-button>
              <el-button @click="dialogDown" :disabled="!selectedRom" size="small" class="long-btn" type="primary">
                {{$t('common.ok')}}
              </el-button>
            </el-row>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import { formatTime } from '../assets/scripts/utils'

export default {
  data () {
    return {
      formatTime,
      itemsTimer: null,
      roms: [],
      serverVersions: [],
      romStores: [],
      allGroups:[],
      currentDownOptions: [],
      rom: '',
      selectedRom: '',
      downDialogMode: '',
      downDialogTitle: '',
      downDialogSelectLabel: '',
      downDialogPlaceholder: '',
      downDialogVisible: false,
      itemDialogVisible: false,
      /* table */
      currentItem: {},
      currentItems: [],
      selectedItems: [],
      conditionForm: {
        item: {
          server_group_id:'',
          server_code: '',
          server_mac: '',
          ip: '',
          remark: '',
          report_time: '',
          state: '',
          down_result: '',
          update_result: '',
          server_version: '',
          device_version: '',
          device_num: '',
          rom_num: '',
          roms_name: '',
          port: '',
          update_time: '',
          romStore_resouce: '',
          romStore_result: ''
        },
        page: {
          pageSize: 50,
          pageNo: 1,
          totalRows: 0,
          sortname: 'report_time',
          sortorder: 'desc'
        }
      }
    }
  },
  computed: {
    maxTableHeight () {
      return document.body.clientHeight - 220
    }
  },
  mounted () {
    this.getItems()
    this.getUpdateRoms()
    this.getAllGroups()
    this.getRomStores()
    this.getServerVersions()
  },
  methods: {
    toggleRomCollapse (row) {
      row.romCollapse = !row.romCollapse
      this.currentItems = this.currentItems.slice()
    },
    downDialog (mode) {
      if (!this.selectedItems.length) {
        this.$message.info(
          this.$t('common.selectLeastOne') + this.$t('common.server')
        )
        return
      }
      if (mode === 'downRom') {
        this.currentDownOptions = this.roms
      } else if (mode === 'downRomStore') {
        this.currentDownOptions = this.romStores
      } else {
        let version = this.selectedItems[0].server_version
        for (let server of this.selectedItems) {
          if (version != server.server_version) {
            this.$message.error(this.$t('serverManage.batchSameVersion'))
            return
          }
        }
        this.currentDownOptions = this.roms.filter(
          rom => rom.version > version
        )
      }
      this.selectedRom = ''
      this.downDialogMode = mode
      this.downDialogTitle = this.$t('serverManage.downDialogTitles.' + mode)
      this.downDialogPlaceholder = this.$t(
        'serverManage.downDialogPlaceholders.' + mode
      )
      this.downDialogSelectLabel = this.$t(
        'serverManage.downDialogSelectLabels.' + mode
      )
      this.downDialogVisible = true
    },
    dialogDown () {
      let url = this.downDialogMode
      if (this.downDialogMode == 'updateServer') {
        url = 'updateRom'
      }
      let serverCodes = this.selectedItems
        .map(ele => ele.server_code)
        .join(',')
      this.$http
        .postForm('api/serverInfo/' + url, {
          serverCodes: serverCodes,
          rom: this.selectedRom
        })
        .then(res => {
          if (res.result === 1) {
            this.downDialogVisible = false
            this.$message.success(this.$t('common.operateSuccess'))
          }
        })
    },
    updateRom (serverCodes) {
      this.$http
        .postForm('api/serverInfo/updateRom', {
          serverCodes: serverCodes,
          rom: this.rom
        })
        .then(res => {
          if (res.result === 1) {
            this.$message.success(this.$t('common.operateSuccess'))
          }
        })
    },
    editServer (server) {
      this.currentItem = Object.assign({}, server)
      this.currentItem.id = server.id
      this.currentItem.serverCode = server.server_code
      this.currentItem.remark = server.remark
      this.currentItem.port = server.port
      this.itemDialogVisible = true
    },
    updateServer () {
      this.$http
        .postJSON('api/serverInfo/update', this.currentItem)
        .then(res => {
          if (res.result === 1) {
            this.getItems()
            this.$message.success(this.$t('common.operateSuccess'))
            this.itemDialogVisible = false
          } else {
            this.$message.error(this.$t('common.operateFail'))
          }
        })
    },
    getUpdateRoms () {
      this.$http.get('api/updateRom/getAllList').then(res => {
        if (res.result === 1) {
          this.roms = res.list
        }
      })
    },
    getServerVersions () {
      this.$http.get('api/serverInfo/serverVer').then(res => {
        if (res.result === 1) {
          this.serverVersions = res.list
        }
      })
    },
    getRomStores () {
      this.$http.get('api/romStore/listAll').then(res => {
        if (res.result === 1) {
          this.romStores = res.list
        }
      })
    },
    getAllGroups () {
      this.$http.get('api/serverGroup/listAllGroup').then(res => {
        if (res.result === 1) {
          this.allGroups = res.list
        }
      })
    },
    deleteItem (item) {
      this.$confirm(this.$t('serverManage.confirmDeleteServer'), this.$t('common.confirm'), {
        type: 'warning'
      }).then(() => {
        this.$http.get('api/serverInfo/delete?id=' + item.id).then(res => {
          if (res.result === 1) {
            this.$message.success(this.$t('common.deleteSuccess'))
            this.getItems()
          } else {
            this.$message.error(this.$t('common.deleteFail'))
          }
        })
      }).catch(() => {
      })
    },
    /* table 必备 */
    getItems () {
      clearTimeout(this.itemsTimer)
      this.$http
        .postJSON('api/serverInfo/list', this.conditionForm)
        .then(res => {
          if (res.result === 1) {
            this.itemsTimer = setTimeout(() => {
              this.getItems()
            }, 60 * 1000)
            this.currentItems = res.list
            this.currentItems.forEach(item => {
              let roms = item.roms_name.split(',').filter(rom => rom).sort((a, b) => {
                // 2.3.1.zip 、 2.3.10.zip 类似字段排序
                let aArr = a.split('.')
                let bArr = b.split('.')
                let maxL = aArr.length>bArr.length?aArr.length:bArr.length
                for (let i = 0; i < maxL; i++) {
                  let aSub = isNaN(aArr[i] - 0)?0:aArr[i] - 0
                  let bSub = isNaN(bArr[i] - 0)?0:bArr[i] - 0
                  if(aSub !== bSub) {
                    return bSub - aSub
                  }
                }
                return 0
                // return bSum - aSum
                // return a > b ? -1 : 1
              })
              item.collapsedRoms = roms.slice(0, 3)
              item.allRoms = roms
              item.romCollapse = true
            })
            this.conditionForm.page.totalRows = res.page.totalRows
          }
        })
    },
    resetCondition () {
      this.conditionForm = {
        item: {
          server_group_id:'',
          server_code: '',
          server_mac: '',
          ip: '',
          remark: '',
          report_time: '',
          state: '',
          down_result: '',
          update_result: '',
          server_version: '',
          device_version: '',
          device_num: '',
          rom_num: '',
          roms_name: '',
          port: '',
          update_time: '',
          romStore_resouce: '',
          romStore_result: ''
        },
        page: {
          pageSize: 50,
          pageNo: 1,
          totalRows: 0,
          sortname: 'report_time',
          sortorder: 'desc'
        }
      }
      this.getItems()
    },
    sortItems ({ prop, order }) {
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
    selectionChange (selections) {
      this.selectedItems = selections.map(item => {
        return item
      })
    },
    pageSizeChange (size) {
      this.conditionForm.page.pageSize = size
      this.getItems()
    },
    pageNoChange (no) {
      this.conditionForm.page.pageNo = no
      this.getItems()
    },
    resetForm: function () {
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
<style scoped lang="postcss">
.small-select {
  width: 200px;
}

.down-dialog-content {
  & .el-row {
    margin: 20px;
  }
  & .el-select {
    width: 280px;
  }
  & label {
    display: inline-block;
    width: 60px;
  }
  & .btns {
    text-align: center;
  }
}

.text-btn {
  cursor: pointer;
  color: rgb(64, 158, 255);
}
.label-nums {
  margin-left: 20px;
}

.label-num {
  display: inline-block;
  width: 60px;
}

.sub-title {
  font-weight: 800;
  font-size: 18px;
}
</style>
