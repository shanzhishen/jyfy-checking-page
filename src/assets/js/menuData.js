export default {
    menu: [
        {
            menuId: 1,
            name: "考核评分",
            url: "",
            img: "fa fa-calendar-check-o fa-fw",
            pid: 0
        },
        {
            menuId: 2,
            name: "数据导入",
            url: "",
            img: "fa fa-cloud-upload fa-fw",
            pid: 0
        },
        {
            menuId: 4,
            name: "月查考核",
            url: "/MonthCheck",
            pid: 1
        },
        {
            menuId: 7,
            name: "员工互评",
            url: "/UserChecking",    
            pid: 1
        },
        {
            menuId: 8,
            name: "日常得分",
            url: "/DailyScore",    
            pid: 1
        },
        {
            menuId: 14,
            name: "设置月查考核",
            url: "/CheckInfo",
            pid: 2
        },
        {
            menuId: 9,
            name: "排班数据",
            url: "/ClassesData",
            pid: 2
        },
        {
            menuId: 10,
            name: "替班数据",
            url: "/ChangeClassData",
            pid: 2
        },
        {
            menuId: 11,
            name: "指纹数据",
            url: "/FingerPrintData",
            pid: 2
        },

    ]
}