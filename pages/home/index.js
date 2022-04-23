import dxRequest from "../../service/index"

// pages/home/index.js
Page({


  data: {
    lat1: '',
    lng1: '',
    lat2: '',
    lng2: '',
    show: false,
    className: '',
  },

  onLoad: function (options) {

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


  createClass() {
    this.setData({ className: '' })
    this.setData({ show: true })
  },

  onConfirm() {
    if (this.data.className == '') {
      wx.showToast({
        title: '请输入班级名称',
        // icon: 'none',
        icon: 'error'
      })
    } else {
      const userInfo = JSON.parse(wx.getStorageSync('userInfo'));

      let timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;


      const params = {
        code: timestamp,
        name: this.data.className,
        tid: userInfo.id
      }

      dxRequest.post('/class/createClass', params)
        .then(res => {
          if (res.code === '200') {
            if (res.data) {
              wx.showToast({
                title: '创建成功'
              })
            } else {
              wx.showToast({
                title: '创建失败',
                icon: 'error'
              })
            }
          } else {
            wx.showToast({
              title: '创建失败',
              icon: 'error'
            })
          }
        }).catch(err => [
          wx.showToast({
            title: '创建失败',
            icon: 'error'
          })
        ])
    }
  },

  onClose() {


    this.setData({ show: false });
  },


})