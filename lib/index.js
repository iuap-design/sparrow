'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.u = undefined;

var _extend = require('./extend');

var _cookies = require('./cookies');

var _util = require('./util');

var _env = require('./env');

var _event = require('./event');

var _dom = require('./dom');

var _class = require('./class');

var _core = require('./core');

var _ajax = require('./ajax');

var _dataRender = require('./util/dataRender');

var _formater = require('./util/formater');

var _dateUtils = require('./util/dateUtils');

var _masker = require('./util/masker');

var _hotKeys = require('./util/hotKeys');

var _ripple = require('./util/ripple');

var _rsautils = require('./util/rsautils');

var _i18n = require('./util/i18n');

//公开接口、属性对外暴露
var api = {
	ajax: _ajax.ajax,
	extend: _extend.extend,
	setCookie: _cookies.setCookie,
	getCookie: _cookies.getCookie,
	createShellObject: _util.createShellObject,
	execIgnoreError: _util.execIgnoreError,
	getFunction: _util.getFunction,
	getJSObject: _util.getJSObject,
	isDate: _util.isDate,
	isNumber: _util.isNumber,
	isArray: _util.isArray,
	isEmptyObject: _util.isEmptyObject,
	inArray: _util.inArray,
	isDomElement: _util.isDomElement,
	each: _util.each,
	on: _event.on,
	off: _event.off,
	trigger: _event.trigger,
	stopEvent: _event.stopEvent,
	event: _event.event,
	addClass: _dom.addClass,
	removeClass: _dom.removeClass,
	hasClass: _dom.hasClass,
	toggleClass: _dom.toggleClass,
	closest: _dom.closest,
	css: _dom.css,
	wrap: _dom.wrap,
	getStyle: _dom.getStyle,
	getZIndex: _dom.getZIndex,
	makeDOM: _dom.makeDOM,
	makeModal: _dom.makeModal,
	getOffset: _dom.getOffset,
	getScroll: _dom.getScroll,
	showPanelByEle: _dom.showPanelByEle,
	Class: _class.Class,
	core: _core.core,
	floatRender: _dataRender.floatRender,
	integerRender: _dataRender.integerRender,
	dateRender: _dataRender.dateRender,
	dateTimeRender: _dataRender.dateTimeRender,
	timeRender: _dataRender.timeRender,
	percentRender: _dataRender.percentRender,
	dateToUTCString: _dataRender.dateToUTCString,
	date: _dateUtils.date,
	NumberFormater: _formater.NumberFormater,
	DateFormater: _formater.DateFormater,
	AddressMasker: _masker.AddressMasker,
	NumberMasker: _masker.NumberMasker,
	CurrencyMasker: _masker.CurrencyMasker,
	PercentMasker: _masker.PercentMasker,
	hotkeys: _hotKeys.hotkeys,
	Ripple: _ripple.Ripple,
	RSAUtils: _rsautils.RSAUtils,
	BigInt: _rsautils.BigInt,
	BarrettMu: _rsautils.BarrettMu,
	twoDigit: _rsautils.twoDigit,
	trans: _i18n.trans
}; /**
    * Module : Sparrow entry index
    * Author : Kvkens(yueming@yonyou.com)
    * Date	  : 2016-08-04 09:48:36
    */

(0, _extend.extend)(api, _env.env);
// export api;
//export default api;
(0, _extend.extend)(api, window.u || {});

window.u = api;
window.iweb = {};
window.iweb.browser = window.u;
exports.u = api;