/**
 * Module : Sparrow date util
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-06 13:37:20
 */

import { core } from '../core';
import { dateFormat } from '../util';
import { trans } from './i18n';
var u = {};
u.date = {

    /**
     * 多语言处理
     */
    //TODO 后续放到多语文件中
    _dateLocale: {
        'zh-CN': {
            months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
            monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
            weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
            weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
            weekdaysMin: '日_一_二_三_四_五_六'.split('_')
        },
        'en-US': {
            months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
            monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
            weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thurday_Friday_Saturday'.split('_'),
            weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
            weekdaysMin: 'S_M_T_W_T_F_S'.split('_')
        }
    },
    _jsonLocale: {
        months: trans('date.months', "一月\n二月\n三月\n四月\n五月\n六月\n七月\n八月\n九月\n十月\n十一月\n十二月").split('\n'),
        monthsShort: trans('date.monthsShort', "1月\n2月\n3月\n4月\n5月\n6月\n7月\n8月\n9月\n10月\n11月\n12月").split('\n'),
        weekdays: trans('date.weekdays', "星期日\n星期一\n星期二\n星期三\n星期四\n星期五\n星期六").split('\n'),
        weekdaysShort: trans('date.weekdaysShort', "周日\n周一\n周二\n周三\n周四\n周五\n周六").split('\n'),
        weekdaysMin: trans('date.weekdaysMin', "日\n一\n二\n三\n四\n五\n六").split('\n'),
        defaultMonth: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
    },

    _formattingTokens: /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYY|YY|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g,

    leftZeroFill: function leftZeroFill(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;
        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? forceSign ? '+' : '' : '-') + output;
    },

    _formats: {
        //year
        YY: function YY(date) {
            return u.date.leftZeroFill(date.getFullYear() % 100, 2);
        },
        YYYY: function YYYY(date) {
            return date.getFullYear();
        },
        //month
        M: function M(date) {
            return date.getMonth() + 1;
        },
        MM: function MM(date) {
            var m = u.date._formats.M(date);
            return u.date.leftZeroFill(m, 2);
        },
        MMM: function MMM(date, language) {
            var m = date.getMonth();
            // return u.date._dateLocale[language].monthsShort[m];
            return u.date._jsonLocale.monthsShort[m];
        },
        MMMM: function MMMM(date, language) {
            var m = date.getMonth();
            // return u.date._dateLocale[language].months[m];
            return u.date._jsonLocale.months[m];
        },
        //date
        D: function D(date) {
            return date.getDate();
        },
        DD: function DD(date) {
            var d = u.date._formats.D(date);
            return u.date.leftZeroFill(d, 2);
        },
        // weekday
        d: function d(date) {
            return date.getDay();
        },
        dd: function dd(date, language) {
            var d = u.date._formats.d(date);
            // return u.date._dateLocale[language].weekdaysMin[d];
            return u.date._jsonLocale.weekdaysMin[d];
        },
        ddd: function ddd(date, language) {
            var d = u.date._formats.d(date);
            // return u.date._dateLocale[language].weekdaysShort[d];
            return u.date._jsonLocale.weekdaysShort[d];
        },
        dddd: function dddd(date, language) {
            var d = u.date._formats.d(date);
            // return u.date._dateLocale[language].weekdays[d];
            return u.date._jsonLocale.weekdays[d];
        },
        // am pm
        a: function a(date) {
            if (date.getHours() > 12) {
                return 'pm';
            } else {
                return 'am';
            }
        },
        //hour
        h: function h(date) {
            var h = date.getHours();
            h = h > 12 ? h - 12 : h;
            return h;
        },
        hh: function hh(date) {
            var h = u.date._formats.h(date);
            return u.date.leftZeroFill(h, 2);
        },
        H: function H(date) {
            return date.getHours();
        },
        HH: function HH(date) {
            return u.date.leftZeroFill(date.getHours(), 2);
        },
        // minutes
        m: function m(date) {
            return date.getMinutes();
        },
        mm: function mm(date) {
            return u.date.leftZeroFill(date.getMinutes(), 2);
        },
        //seconds
        s: function s(date) {
            return date.getSeconds();
        },
        ss: function ss(date) {
            return u.date.leftZeroFill(date.getSeconds(), 2);
        }
    },

    /**
     * 日期格式化
     * @param date
     * @param formatString
     */
    format: function format(date, formatString, language) {
        if (!date && date != 0) return ''; // renturn date 改为 return '',因：setFormat初始会赋值为undefined,造成二次选择报错
        var array = formatString.match(u.date._formattingTokens),
            i,
            length,
            output = '';
        var _date = u.date.getDateObj(date);
        if (!_date) return date;
        language = language || core.getLanguages();
        for (i = 0, length = array.length; i < length; i++) {
            if (u.date._formats[array[i]]) {
                output += u.date._formats[array[i]](_date, language);
            } else {
                output += array[i];
            }
        }
        return output;
    },
    strToDateByTimezone: function strToDateByTimezone(str, timezone) {
        var dateObj = u.date.getDateObj(str);
        var localTime = dateObj.getTime();
        var localOffset = dateObj.getTimezoneOffset() * 60000;
        var utc = localTime + localOffset; //得到国际标准时间
        utc = utc + 3600000 * parseFloat(timezone);
        return utc;
    },

    /**
     * 根据当前时区日期对象获取指定时区日期对象
     * @param  {Date} date     当前时区日期对象
     * @param  {number} timezone 指定时区
     * @return {Date}          转化后的日期对象
     */
    getDateByTimeZonec2z: function getDateByTimeZonec2z(date, timezone) {
        var dateObj = u.date.getDateObj(date);
        var localTime = dateObj.getTime();
        var localOffset = dateObj.getTimezoneOffset() * 60000;
        var utc = localTime + localOffset;
        var calctime = utc + 3600000 * parseFloat(timezone);
        return new Date(calctime);
    },
    /**
     * 根据指定时区日期对象获取当前时区日期对象
     * @param  {Date} date     指定时区日期对象
     * @param  {number} timezone 指定时区
     * @return {Date}          转化后的日期对象
     */
    getDateByTimeZonez2c: function getDateByTimeZonez2c(date, timezone) {
        var dateObj = u.date.getDateObj(date);
        var localTime = dateObj.getTime();
        var localOffset = dateObj.getTimezoneOffset() * 60000;
        var utc = localTime - 3600000 * parseFloat(timezone) - localOffset;
        return new Date(utc);
    },

    _addOrSubtract: function _addOrSubtract(date, period, value, isAdding) {
        var times = date.getTime(),
            d = date.getDate(),
            m = date.getMonth(),
            _date = u.date.getDateObj(date);
        if (period === 'ms') {
            times = times + value * isAdding;
            _date.setTime(times);
        } else if (period == 's') {
            times = times + value * 1000 * isAdding;
            _date.setTime(times);
        } else if (period == 'm') {
            times = times + value * 60000 * isAdding;
            _date.setTime(times);
        } else if (period == 'h') {
            times = times + value * 3600000 * isAdding;
            _date.setTime(times);
        } else if (period == 'd') {
            d = d + value * isAdding;
            _date.setDate(d);
        } else if (period == 'w') {
            d = d + value * 7 * isAdding;
            _date.setDate(d);
        } else if (period == 'M') {
            m = m + value * isAdding;
            _date.setMonth(m);
        } else if (period == 'y') {
            m = m + value * 12 * isAdding;
            _date.setMonth(m);
        }
        return _date;
    },

    add: function add(date, period, value) {
        return u.date._addOrSubtract(date, period, value, 1);
    },
    sub: function sub(date, period, value) {
        return u.date._addOrSubtract(date, period, value, -1);
    },
    getDateObj: function getDateObj(value, obj) {
        var timezone;
        if (obj) {
            timezone = obj.timezone;
        }
        if (!value && value != 0 || typeof value == 'undefined') return value;
        var dateFlag = false;
        var _date = new Date(dateFormat(value));
        if (isNaN(_date)) {
            // IE的话对"2016-2-13 12:13:22"进行处理
            var index1, index2, index3, s1, s2, s3, s4;
            if (value.indexOf) {
                index1 = value.indexOf('-');
                index2 = value.indexOf(':');
                index3 = value.indexOf(' ');
                if (index1 > 0 || index2 > 0 || index3 > 0) {
                    _date = new Date();
                    if (index3 > 0) {
                        s3 = value.split(' ');
                        s1 = s3[0].split('-');
                        s2 = s3[1].split(':');
                        s4 = s3[2];
                    } else if (index1 > 0) {
                        s1 = value.split('-');
                    } else if (index2 > 0) {
                        s2 = value.split(':');
                    }
                    if (s1 && s1.length > 0) {
                        _date.setYear(s1[0]);
                        _date.setMonth(parseInt(s1[1] - 1));
                        _date.setDate(s1[2] ? s1[2] : 0);
                        _date.setMonth(parseInt(s1[1] - 1));
                        _date.setDate(s1[2] ? s1[2] : 0);
                        dateFlag = true;
                    }
                    if (s2 && s2.length > 0) {
                        //解决ie和firefox等时间pm直接变am问题
                        if (s4 == "pm") {
                            s2[0] = s2[0] - -12;
                        }
                        _date.setHours(s2[0] ? s2[0] : 0);
                        _date.setMinutes(s2[1] ? s2[1] : 0);
                        _date.setSeconds(s2[2] ? s2[2] : 0);
                        dateFlag = true;
                    }
                } else {
                    _date = new Date(parseInt(value));
                    if (isNaN(_date)) {
                        // throw new TypeError('invalid Date parameter');
                    } else {
                        dateFlag = true;
                    }
                }
            }
        } else {
            dateFlag = true;
        }
        if (dateFlag) {
            if (timezone) {
                _date = u.date.getDateByTimeZonec2z(_date, timezone);
            }
            return _date;
        } else return null;
    }

};

var date = u.date;
export { date };