export default {
  common: {
    abnormal: '异常',
    account: '账号',
    add: '新增',
    all: '全部',
    cancel: '取消',
    code: '编号',
    confirm: '确认',
    confirmDeleteOne: '删除此项目吗？',
    confirmDeleteSelected: '确定删除选中的项目吗？',
    delete: '删除',
    deleteFail: '删除失败',
    deleteSuccess: '删除成功',
    detail: '详情',
    edit: '编辑',
    fail: '失败',
    firmware: '固件',
    formError: '表单信息填写错误',
    level: '级别',
    link: '跳转',
    login: '登录',
    loginFail: '@:common.login@:common.fail',
    loginFormError: '登录信息填写错误',
    loginSuccess: '@:common.login@:common.success',
    modify: '修改',
    name: '名称',
    none: '无',
    normal: '正常',
    offline: '离线',
    ok: '确定',
    oneKeyDeliver: '一键下发',
    online: '在线',
    onlyOne: '只支持一个',
    operate: '操作',
    operateSuccess: '操作成功',
    operateFail: '操作失败',
    order: '序号',
    pause: '暂停',
    password: '密码',
    pleaseInput: '请输入',
    pleaseInputAccount: '@:common.pleaseInput@:common.account',
    pleaseInputPassword: '@:common.pleaseInput@:common.password',
    quit: '退出',
    remark: '备注',
    rememberMe: '记住我',
    run: '运行',
    save: '保存',
    search: '搜索',
    selectLeastOne: '请选择至少一个',
    selectOne: '请勾选一个',
    server: '服务器',
    state: '状态',
    success: '成功',
    systemName: '服务器管理系统',
    unRemark: '未备注',
    updateTime: '更新时间',
    version: '版本',
    versionNote: '版本说明'
  },
  header: {
    inputOldPassword: '@:common.pleaseInput@:header.oldPassword',
    inputNewPassword: '@:common.pleaseInput@:header.newPassword',
    logoutSuccess: '注销成功',
    modifyPassword: '@:common.modify@:common.password',
    newPassword: '新密码',
    oldPassword: '原密码',
    oldPasswordError: '原密码出错',
    repeatPassword: '重复密码',
    repeatPasswordError: '两次输入的密码不一致',
    timeoutMessage: '登录超时请重新登录',
    welcome: '欢迎'
  },
  logManage: {
    content: '内容',
    date: '日期',
    endDate: '结束日期',
    name: '日志管理',
    startDate: '开始日期'
  },
  firmwareManage: {
    name: '固件管理',
    confirmOneKey: '确认一键下发该固件？',
    firmwarePath: '固件地址',
    onlyOneFirmware: '@:common.onlyOne固件下发',
    pleaseInputFirmwarePath:
      '@:common.pleaseInput@:firmwareManage.firmwarePath',
    selectOneFirmware: '@:common.selectOne固件'
  },
  raidManage: {
    diskTotal: '磁盘总量',
    name: '磁盘管理',
    clearOffline: '清除离线',
    clearOfflineConfirm: '确认要清除离线磁盘吗？',
    pleaseEditInServerManage: '请在服务器管理中修改',
    saveNoteFail: '保存备注失败',
    used: '已使用'
  },
  romManage: {
    name: '升级包管理',
    confirmOneKey: '确认一键下发该升级包？',
    onlyOnePackage: '@:common.onlyOne升级包下发',
    pleaseInputRomPath: '@:common.pleaseInput@:romManage.romPath',
    pleaseInputVersion: '@:common.pleaseInput@:common.version',
    pleaseInputVersionNote: '@:common.pleaseInput@:common.versionNote',
    romPath: '升级包地址',
    selectOnePackage: '@:common.selectOne升级包'
  },
  serverManage: {
    batchSameVersion: '批量升级必须选择相同版本服务器',
    collapse: '收起',
    confirmDeleteServer: '确定删除该服务器吗？',
    deviceStatus: '设备状态',
    dispatchStatus: '调度状态',
    networkSetting: '服务器网络配置信息',
    networkType: '上网方式',
    pppoe: '宽带拨号(PPPoE)',
    staticIp: '固定IP(Static IPv4)',
    broadbandUser: '宽带账号',
    broadbandPass: '宽带密码',
    proxyStatus: '网络状态',
    ipAddress: 'IP地址',
    netmask: '子网掩码',
    gateway: '网关地址',
    downDialogPlaceholders: {
      updateServer: '选择版本',
      downRomStore: '选择固件版本',
      downRom: '选择升级包版本'
    },
    downDialogSelectLabels: {
      updateServer: '版本',
      downRomStore: '版本',
      downRom: '升级包'
    },
    downDialogTitles: {
      updateServer: '@:serverManage.upgradeServer',
      downRomStore: '@:serverManage.downFirmware',
      downRom: '@:serverManage.downRom'
    },
    downFirmware: '下发固件',
    downRom: '下发升级包',
    editServerInfo: '修改服务器信息',
    expand: '展开',
    firmwareDownResult: '固件下发结果',
    firmwareResources: '固件资源',
    firmwareVersion: '@:common.firmware@:common.version',
    name: '服务器管理',
    port: '端口',
    romDownResult: '升级包下发结果',
    searchServerName: '搜索服务器名称',
    serverCode: '服务器编号',
    serverPassword: '服务器密码',
    serverState: '@:common.server@:common.state',
    serverVersion: '@:common.server@:common.version',
    upgradePackages: '升级包资源',
    upgradeResult: '升级结果',
    upgradeServer: '升级服务器'
  }
}
