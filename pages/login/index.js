import dxRequest from "../../service/index"

// pages/login/index.js


Page({
  data: {
    tid: "",
    tpwd: "",
  },


  onLoad: function (options) {
    // 判断时候有token,如果有token跳转到首页
    let token = ''
    if (wx.getStorageSync('userInfo').length > 0) {
      token = JSON.parse(wx.getStorageSync('userInfo')).token;
    }
    if (token.length > 0) {

      wx.reLaunch({
        url: '/pages/home/index',
      })
    }
  },



  tLogin() {
    const params = {
      id: this.data.tid,
      password: this.data.tpwd
    }

    dxRequest.post('/teacher/login', params)
      .then(res => {
        if (res.code === '200') {
          wx.setStorageSync("userInfo", JSON.stringify(res.data))

          wx.reLaunch({
            url: '/pages/home/index',
          })

        } else {
          wx.showToast({
            title: res.message, // 标题
            icon: 'error', // 图标类型，默认success
          })
        }
      })
      .catch(err => {
        wx.showToast({
          title: "系统错误", // 标题
          icon: 'error', // 图标类型，默认success
        })
      })
  }
})