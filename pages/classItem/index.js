import dxRequest from "../../service/index"

// pages/classItem/index.js
Page({

	data: {
		item: {}
	},

	onLoad: function (options) {
		const item = JSON.parse(options.item)
		this.setData({ item: item })
	},

	endClass() {

		wx.showModal({
			title: '确认结束该课程吗?',
			success: (res) => {
				if (res.confirm) {
					dxRequest.post("/class/endClass", this.data.item.cid)
						.then(res => {
							if (res.code === '200') {
								wx.reLaunch({
									url: '/pages/home/index',
								})

								wx.showToast({
									title: '课程已结束',
								})
							} else {
								wx.showToast({
									title: '系统错误',
									icon: 'error'
								})
							}
						})
						.catch(err => {
							wx.showToast({
								title: '系统错误',
								icon: 'error'
							})
						})
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})



	}


})