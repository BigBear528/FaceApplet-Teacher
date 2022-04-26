import dxRequest from "../../service/index"

// pages/home/index.js
Page({


  data: {
    userInfo: {},
    lat1: '',
    lng1: '',
    lat2: '',
    lng2: '',
    classParams: {
      end: 0,
      statusName: '进行中',
      name: "",
      type: 0,
      typeName: '线下课堂'
    },
    classes: []
  },

  onLoad: function (options) {
    const userInfo = JSON.parse(wx.getStorageSync('userInfo'))
    userInfo.face = ''
    this.setData({ userInfo: userInfo })
  },

  onShow: function () {
    this.getClasses()
  },

  test() {
    wx.chooseLocation({
      success: res => {
        console.log('纬度1 ' + res.latitude)
        console.log('经度1 ' + res.longitude)

        this.setData({
          lat1: res.latitude
        })
        this.setData({
          lng1: res.longitude
        })
      }
    })
  },

  test2() {
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      success: (res) => {
        console.log(res)

        console.log('纬度2 ' + res.latitude)
        console.log('经度2 ' + res.longitude)
        this.setData({
          lat2: res.latitude
        })
        this.setData({
          lng2: res.longitude
        })
      }
    })
  },

  btn() {
    const params = {
      lat1: this.data.lat1,
      lat2: this.data.lat2,
      lon1: this.data.lng1,
      lon2: this.data.lng2
    }
    dxRequest.post('/student/distance', params)
      .then(res => {
        if (res.code === "200") {
          console.log(res.data)
        } else {
          console.log('error')
        }
      }).catch(err => {
        console.log(err)
      })
  },

  Face() {
    wx.navigateTo({
      url: '/pages/FaceRecognition/index',
    })
  },

  classNameInput(e) {
    this.setData({ 'classParams.name': e.detail.value })
  },

  selectStatus() {
    wx.showActionSheet({
      itemList: ['进行中', '已结束'],
      success: (res) => {
        if (res.tapIndex == 0) {
          this.setData({ 'classParams.end': 0 })
          this.setData({ 'classParams.statusName': "进行中" })
        }

        if (res.tapIndex == 1) {
          this.setData({ 'classParams.end': 1 })
          this.setData({ 'classParams.statusName': "已结束" })

        }

        if (res.tapIndex == 2) {
          this.setData({ 'classParams.type': 2 })
          this.setData({ 'classParams.typeName': "课外团体实践活动" })
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },

  selectType() {
    wx.showActionSheet({
      itemList: ['线下课堂', '线上课堂', '课外团体实践活动'],
      success: (res) => {
        if (res.tapIndex == 0) {
          this.setData({ 'classParams.type': 0 })
          this.setData({ 'classParams.typeName': "线下课堂" })
        }

        if (res.tapIndex == 1) {
          this.setData({ 'classParams.type': 1 })
          this.setData({ 'classParams.typeName': "线上课堂" })

        }

        if (res.tapIndex == 2) {
          this.setData({ 'classParams.type': 2 })
          this.setData({ 'classParams.typeName': "课外团体实践活动" })
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },

  getClasses() {
    const params = {
      end: this.data.classParams.end,
      name: this.data.classParams.name,
      tid: this.data.userInfo.id,
      type: this.data.classParams.type
    }

    dxRequest.post("/class/getClasses", params)
      .then(res => {
        if (res.code === '200') {
          this.setData({ classes: res.data })
        } else {
          wx.showToast({
            title: res.message,
            icon: "error"
          })
        }
      }).catch(err => {
        wx.showToast({
          title: '系统错误',
          icon: "error"
        })
      })

  },

  itemClick(event) {
    const item = event.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/classItem/index?item=${JSON.stringify(item)}`
    })

  }


})