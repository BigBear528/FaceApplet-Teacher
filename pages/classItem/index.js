import dxRequest from "../../service/index"

// pages/classItem/index.js
Page({

	data: {
		item: {},
		showClockDialog: false,
		showStartTime: false,
		startTime: new Date().getTime(),
		endTime: new Date().getTime(),
		sTime: '',
		eTime: '',
		lat: '',
		lon: '',
		location: '',
		radius: '',

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



	},

	clock() {
		this.setData({
			showClockDialog: true,
			location: '',
			radius: '',
			startTime: new Date().getTime(),
			endTime: new Date().getTime(),
		})
	},

	onClockClose() {
		this.setData({ showClockDialog: false })
	},

	onClockConfirm() {
		if (this.data.endTime <= this.data.startTime) {
			wx.showToast({
				title: '结束时间应大于开始时间',
				icon: 'none'
			})
			return
		} else if (this.data.location == '' || this.data.radius == '') {
			wx.showToast({
				title: '请正确填写数据',
				icon: 'none'
			})
			return
		} else {

			let endTimestamp = this.data.endTime / 1000
			let startTimestamp = this.data.startTime / 1000


			const params = {
				cid: this.data.item.cid,
				endTime: endTimestamp,
				lat: this.data.lat,
				location: this.data.location,
				lon: this.data.lon,
				radius: this.data.radius,
				startTime: startTimestamp,
				type: this.data.item.type
			}
			dxRequest.post('/attendance/addAttendance', params)
				.then(res => {
					if (res.code === '200') {
						wx.showToast({
							title: '发布成功',
						})

					} else {
						wx.showToast({
							title: '发布失败',
							icon: 'error'
						})
					}

				}).catch(err => {
					wx.showToast({
						title: '系统错误',
						icon: 'error'
					})
				})
		}
	},

	onInputStartTime(event) {
		this.setData({
			startTime: event.detail,
		});

		var g = event.detail; //定义一个时间戳变量
		var d = new Date(g);   //创建一个指定的日期对象
		let time = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`

		this.setData({
			sTime: time
		})
	},

	showStartTime() {
		this.setData({ showStartTime: true })
	},

	startTimeConfirm() {
		this.setData({ showStartTime: false })
	},

	startTimeCancel() {
		this.setData({ showStartTime: false })
	},

	showEndTime() {
		this.setData({ showEndTime: true })
	},

	onInputEndTime(event) {
		this.setData({
			endTime: event.detail,
		});

		var g = event.detail; //定义一个时间戳变量
		var d = new Date(g);   //创建一个指定的日期对象
		let time = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`

		this.setData({
			eTime: time
		})
	},

	endTimeConfirm() {
		this.setData({ showEndTime: false })
	},

	endTimeCancel() {
		this.setData({ showEndTime: false })
	},

	chooseLocation() {
		wx.chooseLocation({
			success: res => {
				this.setData({
					location: res.address
				})

				this.setData({
					lat: res.latitude
				})

				this.setData({
					lon: res.longitude
				})
			}
		})
	},

	inputRadius(e) {
		this.setData({ radius: e.detail.value })

	}
})