class TrVExtension {
    constructor(runtime) {
        this.runtime = runtime;
    }

    getInfo() {
        return {
            id: 'trvTime',
            name: 'TrV 时间',
            color1: '#6750A4', // 紫色主题（呼应 TrVR）
            color2: '#4C3889',
            blocks: [
                {
                    opcode: 'getFullTimeString',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '获取当前完整 TrV 时间',
                },
                {
                    opcode: 'getTimePart',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '获取当前 TrV [PART]',
                    arguments: {
                        PART: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'timePartMenu',
                            defaultValue: 'year'
                        }
                    }
                },
                '---', // 分割线，让积木分类更清晰
                {
                    opcode: 'getInfoMessage',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '关于此扩展'
                }
            ],
            menus: {
                timePartMenu: {
                    acceptReporters: true,
                    items: [
                        { text: '年份', value: 'year' },
                        { text: '月份', value: 'month' },
                        { text: '日期', value: 'day' },
                        { text: '小时', value: 'hour' },
                        { text: '分钟', value: 'minute' },
                        { text: '季节', value: 'season' }
                    ]
                }
            }
        };
    }

    // 核心计算逻辑（复用你之前的代码）
    calcTrvTime() {
        const startRealTime = new Date('2024-10-15T16:00:00Z').getTime();
        const nowRealTime = new Date().getTime();
        const elapsedRealSeconds = (nowRealTime - startRealTime) / 1000;

        const SEC_PER_HOUR = 3600;
        const SEC_PER_DAY = SEC_PER_HOUR * 30; // TrV一天30小时
        const DAYS_PER_YEAR = 520;             // TrV一年520天

        const totalDays = Math.floor(elapsedRealSeconds / SEC_PER_DAY);
        const remainSeconds = elapsedRealSeconds % SEC_PER_DAY;

        const years = Math.floor(totalDays / DAYS_PER_YEAR) + 1;
        let daysInYear = totalDays % DAYS_PER_YEAR;

        const monthDays = [36,34,34, 36,34,34, 36,34,34, 36,34,34, 36,34,34];
        let month = 1;
        let currentMonthDays = 0;
        for (let i = 0; i < 15; i++) {
            if (daysInYear < monthDays[i]) {
                month = i + 1;
                currentMonthDays = daysInYear;
                break;
            }
            daysInYear -= monthDays[i];
        }

        const day = currentMonthDays + 1;
        const hour = Math.floor(remainSeconds / SEC_PER_HOUR);
        const minute = Math.floor((remainSeconds % SEC_PER_HOUR) / 60);
        const second = Math.floor(remainSeconds % 60);

        let season = '';
        if (month >= 1 && month <= 3) season = '暖季';
        else if (month >= 4 && month <= 6) season = '炎季';
        else if (month >= 7 && month <= 10) season = '寒季';
        else if (month >= 11 && month <= 15) season = '暖季';

        return { years, month, day, hour, minute, second, season };
    }

    getFullTimeString() {
        const t = this.calcTrvTime();
        return `童世 ${t.years}年 ${t.month}月 ${t.day}日 ${String(t.hour).padStart(2,'0')}:${String(t.minute).padStart(2,'0')}:${String(t.second).padStart(2,'0')} (${t.season})`;
    }

    getTimePart(args) {
        const t = this.calcTrvTime();
        return t[args.PART];
    }

    // 新增的返回说明的积木
    getInfoMessage() {
        return 'Tiry（原童友团）的TurboWarp扩展！会持续更新！';
    }
}

// 注册扩展
Scratch.extensions.register(new TrVExtension());