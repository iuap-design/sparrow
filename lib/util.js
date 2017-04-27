/**
 * Module : Sparrow util tools
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-27 21:46:50
 */

/**
 * 创建一个带壳的对象,防止外部修改
 * @param {Object} proto
 */
var createShellObject = function createShellObject(proto) {
	var exf = function exf() {};
	exf.prototype = proto;
	return new exf();
};
var execIgnoreError = function execIgnoreError(a, b, c) {
	try {
		a.call(b, c);
	} catch (e) {}
};

var getFunction = function getFunction(target, val) {
	if (!val || typeof val == 'function') return val;
	if (typeof target[val] == 'function') return target[val];else if (typeof window[val] == 'function') return window[val];else if (val.indexOf('.') != -1) {
		var func = getJSObject(target, val);
		if (typeof func == 'function') return func;
		func = getJSObject(window, val);
		if (typeof func == 'function') return func;
	}
	return val;
};
var getJSObject = function getJSObject(target, names) {
	if (!names) {
		return;
	}
	if ((typeof names === 'undefined' ? 'undefined' : babelHelpers['typeof'](names)) == 'object') return names;
	var nameArr = names.split('.');
	var obj = target;
	for (var i = 0; i < nameArr.length; i++) {
		obj = obj[nameArr[i]];
		if (!obj) return null;
	}
	return obj;
};
var isDate = function isDate(input) {
	return Object.prototype.toString.call(input) === '[object Date]' || input instanceof Date;
};
var isNumber = function isNumber(obj) {
	//return obj === +obj
	//加了个typeof 判断，因为'431027199110.078573'会解析成number
	return obj - parseFloat(obj) + 1 >= 0;
};
var isArray = Array.isArray || function (val) {
	return Object.prototype.toString.call(val) === '[object Array]';
};
var isEmptyObject = function isEmptyObject(obj) {
	var name;
	for (name in obj) {
		return false;
	}
	return true;
};
var inArray = function inArray(node, arr) {
	if (!arr instanceof Array) {
		throw "arguments is not Array";
	}
	for (var i = 0, k = arr.length; i < k; i++) {
		if (node == arr[i]) {
			return true;
		}
	}
	return false;
};
var isDomElement = function isDomElement(obj) {
	if (window['HTMLElement']) {
		return obj instanceof HTMLElement;
	} else {
		return obj && obj.tagName && obj.nodeType === 1;
	}
};
var each = function each(obj, callback) {
	if (obj.forEach) {
		obj.forEach(function (v, k) {
			callback(k, v);
		});
	} else if (obj instanceof Object) {
		for (var k in obj) {
			callback(k, obj[k]);
		}
	} else {
		return;
	}
};
try {
	NodeList.prototype.forEach = Array.prototype.forEach;
} catch (e) {}

/**
 * 获得字符串的字节长度
 */
String.prototype.lengthb = function () {
	//	var str = this.replace(/[^\x800-\x10000]/g, "***");
	var str = this.replace(/[^\x00-\xff]/g, "**");
	return str.length;
};

/**
 * 将AFindText全部替换为ARepText
 */
String.prototype.replaceAll = function (AFindText, ARepText) {
	//自定义String对象的方法
	var raRegExp = new RegExp(AFindText, "g");
	return this.replace(raRegExp, ARepText);
};

var dateFormat = function dateFormat(str) {
	//如果不是string类型  原型返回
	if (typeof str !== 'string') {
		return str;
	}
	//判断 str 格式如果是 yy-mm-dd
	if (str && str.indexOf('-') > -1) {
		//获取当前是否是 ios版本,>8是因为ios不识别new Date（“2016/11”）格式
		var ua = navigator.userAgent.toLowerCase();
		if (/iphone|ipad|ipod/.test(ua)) {
			//转换成 yy/mm/dd
			str = str.replace(/-/g, "/");
			str = str.replace(/(^\s+)|(\s+$)/g, "");
			if (str.length <= 8) {
				str = str += "/01";
			}
		}
	}

	return str;
};

export { createShellObject, execIgnoreError, getFunction, getJSObject, isDate, isNumber, isArray, isEmptyObject, inArray, isDomElement, each, dateFormat };