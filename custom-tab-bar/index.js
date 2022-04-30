import dxRequest from "../service/index";

var app = getApp()
Component({
	data: {
		selected: 0,
		color: "#ccc",
		selectedColor: "#1296db",
		list: [{
			pagePath: "/pages/home/index",
			iconPath: "../assets/images/tabbar/home_normal.png",
			text: "首页",
			selectedIconPath: "../assets/images/tabbar/home_active.png",
			id: 0
		},
		{
			// pagePath: "/pages/FaceEntry/index",
			text: "+",
			id: 1
		},
		{
			pagePath: "/pages/mine/index",
			iconPath: "../assets/images/tabbar/mine_normal.png",
			text: "我的",
			selectedIconPath: "../assets/images/tabbar/mine_active.png",
			id: 2
		}
		]
	},
	ready: function () {
		this.setData({
			selected: app.globalData.selected
		})
	},
	methods: {
		switchTab(e) {
			const data = e.currentTarget.dataset;
			const url = data.path;
			app.globalData.selected = data.index;
			if (data.index === 1) {
				wx.navigateTo({
					url: '/pages/createClass/index'
				})
			} else {
				wx.switchTab({
					url: url
				})
			}
		},
	}
})