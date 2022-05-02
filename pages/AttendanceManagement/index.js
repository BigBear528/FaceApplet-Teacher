import * as echarts from '../../ec-canvas/echarts';
import dxRequest from '../../service/index';

let chart = null;

function initChart(canvas, width, height, dpr) {
	chart = echarts.init(canvas, null, {
		width: width,
		height: height,
		devicePixelRatio: dpr // new
	});
	canvas.setChart(chart);

	var option = {
		// tooltip: {
		// 	trigger: 'axis',
		// 	axisPointer: {
		// 		type: 'cross',
		// 		crossStyle: {
		// 			color: '#999'
		// 		}
		// 	}
		// },
		// toolbox: {
		// 	feature: {
		// 		dataView: { show: true, readOnly: false },
		// 		magicType: { show: true, type: ['line', 'bar'] },
		// 		restore: { show: true },
		// 		saveAsImage: { show: true }
		// 	}
		// },
		legend: {
			data: ['已打卡', '未打卡', '请假', '出勤率']
		},
		xAxis: [
			{
				type: 'category',
				data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
				axisPointer: {
					type: 'shadow'
				}
			}
		],
		yAxis: [
			{
				type: 'value',
				name: '人',
				min: 0,
				max: 20,
				interval: 4,
				axisLabel: {
					formatter: '{value} '
				}
			},
			{
				type: 'value',
				name: '出勤率',
				min: 0,
				max: 100,
				interval: 20,
				axisLabel: {
					formatter: '{value} %'
				}
			}
		],
		series: [
			{
				name: '已打卡',
				type: 'bar',
				tooltip: {
					valueFormatter: function (value) {
						return value;
					}
				},
				data: [
					2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
				]
			},
			{
				name: '未打卡',
				type: 'bar',
				tooltip: {
					valueFormatter: function (value) {
						return value;
					}
				},
				data: [
					2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
				]
			},
			{
				name: '请假',
				type: 'bar',
				tooltip: {
					valueFormatter: function (value) {
						return value;
					}
				},
				data: [
					2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
				]
			},
			{
				name: '出勤率',
				type: 'line',
				yAxisIndex: 1,
				tooltip: {
					valueFormatter: function (value) {
						return value;
					}
				},
				data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
			}
		]
	};

	chart.setOption(option);
	return chart;
}
Page({
	data: {
		ec: {
			onInit: initChart
		},
		item: {},
		attendanceSheetList: []
	},

	onLoad: function (options) {
		const item = JSON.parse(options.item)
		this.setData({ item: item })
		this.getChartData()
		this.getAttendanceSheet()
	},

	// onReady: function () {
	// 	setTimeout(function () {
	// 		console.log(chart)
	// 		chart.setOption({
	// 			xAxis: {
	// 				data: ['1', '2', '3', '4', '5', '6', '7']
	// 			}
	// 		})
	// 	}, 2000);
	// },


	getChartData() {
		dxRequest.post("/teacher/getChartData", this.data.item.cid)
			.then(res => {
				if (res.code === '200') {
					// console.log(res.data)
					chart.setOption({
						xAxis: {
							data: res.data.countNumberList
						},
						series: [{
							data: res.data.completedNumberList
						}, {
							data: res.data.immatureNumberList
						}, {
							data: res.data.leaveNumberList
						},
						{
							data: res.data.attendanceRateList
						},
						]
					})


				} else {
					wx.showToast({
						title: '系统错误',
						icon: 'error'
					})
				}

			}).catch(err => {
				wx.showToast({
					title: '系统错误',
					icon: 'error'
				})
			})
	},


	getAttendanceSheet() {
		dxRequest.post("/teacher/getAttendanceSheet", this.data.item.cid)
			.then(res => {
				if (res.code === '200') {

					const attendanceSheetList = res.data;
					for (const item of attendanceSheetList) {
						item.startTime = this.timestampTransform(item.startTime);
						item.endTime = this.timestampTransform(item.endTime)
					}

					this.setData({ attendanceSheetList: attendanceSheetList })

				} else {
					wx.showToast({
						title: '系统错误',
						icon: 'error'
					})
				}

			}).catch(err => {
				wx.showToast({
					title: '系统错误',
					icon: 'error'
				})
			})
	},

	timestampTransform(timestamp) {

		var g = timestamp * 1000; //定义一个时间戳变量
		var d = new Date(g);   //创建一个指定的日期对象
		let time = `${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours()}:${d.getMinutes()}`

		return time;

	},
})
