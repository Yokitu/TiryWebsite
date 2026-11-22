/**
 * TrV (Tirvod Rilet) 时间换算核心库
 * 参考起点：现实 2024-10-16 00:00:00 (UTC+8) = 童世1年1月1日 00:00:00
 * 规则：TrV一天30小时，一年15个月（大月36天，小月34天，每三个月一循环），一年520天。
 */

function getTrvTime(realDate = new Date()) {
    // 1. 计算现实流逝的时间（毫秒）
    // 注意：这里使用 ISO 字符串，确保在不同时区（如手机系统时区）下起点一致。
    // 北京时间 2024-10-16 00:00:00 对应的 UTC 时间是 2024-10-15T16:00:00Z
    const startRealTime = new Date('2024-10-15T16:00:00Z').getTime(); 
    const nowRealTime = realDate.getTime();
    const elapsedRealSeconds = (nowRealTime - startRealTime) / 1000;

    // 如果时间早于起点，可以做特殊处理（这里暂时默认当前时间都在起点之后）
    if (elapsedRealSeconds < 0) {
        return { error: "早于TrV起始时间" };
    }

    // 2. 换算为 TrV 时间
    const SEC_PER_HOUR = 3600;
    const SEC_PER_DAY = SEC_PER_HOUR * 30; // TrV 一天30小时
    const DAYS_PER_YEAR = 520;             // TrV 一年520天

    const totalDays = Math.floor(elapsedRealSeconds / SEC_PER_DAY);
    const remainSeconds = elapsedRealSeconds % SEC_PER_DAY;

    // 3. 计算年份和当年剩余天数
    // (假设起点是第1天，那么总天数除以520，商是经过的整年数，余数是当年的第几天)
    const years = Math.floor(totalDays / DAYS_PER_YEAR) + 1; 
    let daysInYear = totalDays % DAYS_PER_YEAR;

    // 4. 计算月份
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

    // 5. 计算日期和时间
    const day = currentMonthDays + 1; // 当月第几天
    const hour = Math.floor(remainSeconds / SEC_PER_HOUR);
    const minute = Math.floor((remainSeconds % SEC_PER_HOUR) / 60);
    const second = Math.floor(remainSeconds % 60);

    // 6. 计算季节 (1-3暖, 4-6炎, 7-10寒, 11-15暖)
    let season = '';
    if (month >= 1 && month <= 3) season = '暖季';
    else if (month >= 4 && month <= 6) season = '炎季';
    else if (month >= 7 && month <= 10) season = '寒季';
    else if (month >= 11 && month <= 15) season = '暖季';

    return {
        year: years,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        second: second,
        season: season,
        string: `童世 ${years}年 ${month}月 ${day}日 ${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}:${String(second).padStart(2,'0')} (${season})`
    };
}

// ==========================================
// 使用示例 (如果是在 Node.js 或小程序中)
// ==========================================
// const trv = getTrvTime();
// console.log(trv.string);

// 为了方便浏览器直接通过 <script> 标签引入，将其挂载到 window 对象上
if (typeof window !== 'undefined') {
    window.getTrvTime = getTrvTime;
}