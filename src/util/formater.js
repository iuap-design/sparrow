/**
 * Module : Sparrow data formater tools
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-28 15:39:01
 */
import {isNumber} from '../util';


function NumberFormater(precision) {
    this.precision = precision;
};

NumberFormater.prototype.update = function (precision) {
    this.precision = precision;
}

NumberFormater.prototype.format = function (value) {
    if (!isNumber(value)) return "";

    // 以0开头的数字将其前面的0去掉
    while ((value + "").charAt(0) == "0" && value.length > 1 && (value + "").indexOf('0.') != 0) {
        value = value.substring(1);
    }
    var result = value;
    if (isNumber(this.precision)) {
        if (window.BigNumber) {
            // 已经引入BigNumber
            result = (new BigNumber(value)).toFixed(this.precision)
        } else {
            var digit = parseFloat(value);
            // 解决toFixed四舍五入问题，如1.345
            result = (Math.round(digit * Math.pow(10, this.precision)) / Math.pow(10, this.precision)).toFixed(this.precision);
        }
        if (result == "NaN")
            return "";
    }


    return result;
};

function DateFormater(pattern) {
    this.pattern = pattern;
};

DateFormater.prototype.update = function (pattern) {
    this.pattern = pattern;
}


DateFormater.prototype.format = function (value) {
    return moment(value).format(this.pattern)
};

//var NumberFormater = NumberFormater;
//var DateFormater = DateFormater;
export {NumberFormater,DateFormater};
