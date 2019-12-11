export default {
    stageInfo: [{
            value: 1,
            label: "需求分析"
        },
        {
            value: 2,
            label: "开发"
        }, {
            value: 3,
            label: "测试"
        }, {
            value: 4,
            label: "实施"
        }, {
            value: 5,
            label: "验收"
        },{
            value: 6,
            label: "维护"
        },
    ],
    progressInfo: [{
            value: 1,
            label: "提前"
        },
        {
            value: 2,
            label: "按进度"
        }, {
            value: 3,
            label: "稍滞后"
        }, {
            value: 4,
            label: "严重滞后"
        }, {
            value: 5,
            label: "其他"
        }
    ],
    projectState: [{
        value: 1,
        label: '在用'
    }, {
        value: 0,
        label: '停止'
    }],
    getStage(stage) {
        switch (stage) {
            case 1:
                return "需求分析";
            case 2:
                return "开发";
            case 3:
                return "测试";
            case 4:
                return "实施";
            case 5:
                return "验收";
            default:
                return "维护"
        }
    },
    getProgress(progress) {
        switch (progress) {
            case 1:
                return "提前";
            case 2:
                return "按进度";
            case 3:
                return "稍滞后";
            case 4:
                return "严重滞后";
            default:
                return "其他"
        }
    },
    // 递归查询到的menu转为树形
    convertToTreeData(data, pid) {
        const result = [];
        let temp = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].pid === pid) {
                const obj = {
                    projectId: data[i].projectId,
                    projectName: data[i].projectName,
                    pid: data[i].pid,
                    pname: data[i].pname,
                    stage: data[i].stage,
                    progress: data[i].progress,
                    info: data[i].info,
                    remark: data[i].remark,
                    state: data[i].state,
                    jnum1: data[i].jnum1,
                    jnum2: data[i].jnum2,
                    jnum3: data[i].jnum3
                };
                temp = this.convertToTreeData(data, data[i].projectId);
                if (temp.length > 0) {
                    obj.children = temp;
                }
                result.push(obj);
            }
        }
        return result;
    },
    jobDetail: {
        detailId: "",
        weekId: "",
        type: "",
        content: "",
        operSituation: "",
        operProgress: "",
        operRate: "",
        planFinishTime: "",
        degree: "",
        ord: "",
        solution: ""
      },
}