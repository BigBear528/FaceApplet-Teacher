import dxRequest from "../../service/index"

// pages/createClass/index.js
Page({

	data: {
		className: "",
		classType: '',
		classTypeName: ''
	},


	onLoad: function (options) {

	},

	selectType() {
		wx.showActionSheet({
			itemList: ['线下课堂', '线上课堂', '课外团体实践活动'],
			success: (res) => {
				// console.log(res.tapIndex, res)
				if (res.tapIndex == 0) {
					this.setData({ classType: 0 })
					this.setData({ classTypeName: "线下课堂" })
				}

				if (res.tapIndex == 1) {
					this.setData({ classType: 1 })
					this.setData({ classTypeName: "线上课堂" })

				}

				if (res.tapIndex == 2) {
					this.setData({ classType: 2 })
					this.setData({ classTypeName: "课外团体实践活动" })
				}
			},
			fail(res) {
				console.log(res.errMsg)

			}
		})
	},

	createClass() {
		if (this.data.className == '') {
			wx.showToast({
				title: '请输入班级名称',
				// icon: 'none',
				icon: 'error'
			})
			return
		} else if (this.data.classTypeName == '') {
			wx.showToast({
				title: '请选择班级类型',
				// icon: 'none',
				icon: 'error'
			})
			return
		} else {
			const userInfo = JSON.parse(wx.getStorageSync('userInfo'));

			let timestamp = Date.parse(new Date());
			timestamp = timestamp / 1000;


			const params = {
				code: timestamp,
				name: this.data.className,
				tid: userInfo.id,
				type: this.data.classType
			}

			dxRequest.post('/class/createClass', params)
				.then(res => {
					if (res.code === '200') {
						if (res.data) {
							wx.switchTab({
								url: '/pages/home/index',
							})

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
	}
})