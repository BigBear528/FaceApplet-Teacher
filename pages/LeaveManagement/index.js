import dxRequest from "../../service/index"

// pages/LeaveManagement/index.js
Page({


	data: {
		item: {},
		leaveList: [],
		clickData: {}
	},


	onLoad(options) {
		const item = JSON.parse(options.item)
		this.setData({ item })

		this.getLeaveList()



	},

	getLeaveList() {
		dxRequest.post("/teacher/getLeaveListById", this.data.item.cid)
			.then(res => {
				if (res.code === '200') {
					this.setData({ leaveList: res.data })
					this.formartTime()

				} else {
					wx.showToast({
						title: '系统错误',
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

	formartTime() {
		const leaveList = this.data.leaveList

		for (const item of leaveList) {

			item.time = this.timestampTransform(item.time)

		}

		this.setData({ leaveList: leaveList })
	},


	timestampTransform(timestamp) {

		var g = timestamp * 1000; //定义一个时间戳变量
		var d = new Date(g);   //创建一个指定的日期对象
		let time = `${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours()}:${d.getMinutes()}`

		return time;

	},

	clickItem(e) {
		this.setData({ clickData: e.currentTarget.dataset.item })

		wx.showModal({
			title: '请假申请审批',
			editable: true,
			placeholderText: "请输入审批意见",
			cancelText: "驳回",
			confirmText: "同意",
			success: (res) => {
				if (res.confirm) {
					const params = {
						aid: this.data.clickData.aid,
						reason: res.content,
						sid: this.data.clickData.sid,
						status: 3
					}

					dxRequest.post("/teacher/approvalApplication", params)
						.then(res => {
							if (res.code === '200' && res.data === true) {
								wx.showToast({
									title: '审批成功',
								})
								this.getLeaveList()
							} else {
								wx.showToast({
									title: '审批失败',
									icon: 'error'
								})
							}
						}).catch(err => {
							wx.showToast({
								title: '审批失败',
								icon: 'error'
							})
						})
				} else if (res.cancel) {

					const params = {
						aid: this.data.clickData.aid,
						reason: "驳回",
						sid: this.data.clickData.sid,
						status: -1
					}

					dxRequest.post("/teacher/approvalApplication", params)
						.then(res => {
							if (res.code === '200' && res.data === true) {
								wx.showToast({
									title: '审批成功',
								})
								this.getLeaveList()
							} else {
								wx.showToast({
									title: '审批失败',
									icon: 'error'
								})
							}
						}).catch(err => {
							wx.showToast({
								title: '审批失败',
								icon: 'error'
							})
						})
				}
			}
		})
	}


})