/**
 @Name : jemobDate v1.0 手机移动端日期控件
 @Author: chen guojun
 @Date: 2016-4-20
 @QQ群：516754269
 @官网：http://www.jayui.com/jemobDate/ 或 https://github.com/singod/jemobDate
 */
(function(window) {
    var jeDt = {}, doc = document, dtCell = [ "datebox", "datemask" ], ymdMacth = /\w+|d+|[\u4E00-\u9FA5\uF900-\uFA2D]|[\uFF00-\uFFEF]/g;
    var MD = function(selector) {
        return document.querySelectorAll(selector);
    };
    jeDt.each = function(arr, fn) {
        var i = 0, len = arr.length;
        for (;i < len; i++) {
            if (fn(i, arr[i]) === false) {
                break;
            }
        }
    };
    jeDt.bind = function(el, fun) {
        return jeDt.each(el, function(i, elem) {
            var move;
            if (!/Android|iPhone|SymbianOS|Windows Phone|iPad|iPod/.test(navigator.userAgent)) {
                return elem.addEventListener("click", function(e) { fun.call(this, e); }, false);
            }
            elem.addEventListener("touchmove", function() { move = true; }, false);
            elem.addEventListener("touchend", function(e) {
                e.preventDefault();
                move || fun.call(this, e);
                move = false;
            }, false);
        });
    };
    jeDt.touch = function(elem, fun1, fun2, fun3) {
        elem.addEventListener("touchstart", fun1, false);
        elem.addEventListener("touchmove", fun2, false);
        elem.addEventListener("touchend", fun3, false);
    };
    jeDt.stopmp = function(e) {
        e = e || window.event;
        e.stopPropagation ? e.stopPropagation() :e.cancelBubble = true;
        return this;
    };
    jeDt.attr = function(elem, key, val) {
        if (typeof key === "string" && typeof val === "undefined") {
            return elem.getAttribute(key);
        } else {
            elem.setAttribute(key, val);
        }
        return this;
    };
    jeDt.addClass = function(elem, className) {
        return jeDt.each(elem, function(i, cls) {
            cls.classList.add(className);
        });
    };
    jeDt.removeClass = function(elem, className) {
        return jeDt.each(elem, function(i, cls) {
            cls.classList.remove(className);
        });
    };
    jeDt.html = function(elem, value) {
        if (typeof value != "undefined" || value !== undefined && elem.nodeType === 1) {
            elem.innerHTML = value;
        } else {
            return elem.innerHTML;
        }
        return this;
    };
    jeDt.text = function(elem, value) {
        if (value !== undefined && elem.nodeType === 1) {
            document.all ? elem.innerText = value :elem.textContent = value;
        } else {
            var emText = document.all ? elem.innerText :elem.textContent;
            return emText;
        }
        return this;
    };
    jeDt.val = function(elem, value) {
        if (value !== undefined && elem.nodeType === 1) {
            elem.value = value;
        } else {
            return elem.value;
        }
        return this;
    };
    //补齐数位
    jeDt.digit = function(num) {
        return num < 10 ? "0" + (num | 0) :num;
    };
    //转换日期格式
    jeDt.parse = function(ymd, hms, format) {
        ymd = ymd.concat(hms);
        var format = format, hmsCheck = jeDt.parseCheck(format, false), num = 2;
        return format.replace(/YYYY|MM|DD|hh|mm|ss/g, function(str, index) {
            var idx = (hmsCheck == "hh:mm:ss" || hmsCheck == "hh:mm") ? ++num :ymd.index = ++ymd.index | 0;
            return jeDt.digit(ymd[idx]);
        });
    };
    jeDt.parseCheck = function(format, bool) {
        var ymdhms = [];
        format.replace(/YYYY|MM|DD|hh|mm|ss/g, function(str, index) {
            ymdhms.push(str);
        });
		var arrPush = bool == undefined ? ymdhms : (ymdhms.join(bool == true ? "-" :":"));
        return arrPush;
    };
    jeDt.parseArr = function(str) {
        var timeArr = str.split(" ");
        return timeArr[0].match(ymdMacth);
    };
    //初始化日期
    jeDt.nowDate = function(timestamp, format) {
        var De = new Date(timestamp | 0 ? function(tamp) {
            return tamp < 864e5 ? +new Date() + tamp * 864e5 :tamp;
        }(parseInt(timestamp)) :+new Date());
        return jeDt.parse([ De.getFullYear(), De.getMonth() + 1, De.getDate() ], [ De.getHours(), De.getMinutes(), De.getSeconds() ], format);
    };
    jeDt.montharr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ];
    //判断元素类型
    jeDt.isValHtml = function(that) {
        return /textarea|input/.test(that.tagName.toLocaleLowerCase());
    };
    var config = {
        format:"YYYY-MM-DD hh:mm:ss",//日期格式
        minDate:"1970-01-01 00:00:00",//最小日期
        maxDate:"2030-12-31 23:59:59" //最大日期
    };
    jeDt.initDate = function(opts) {
        var createDiv = function(disCell, self, dis) {
            if (MD("#" + self)[0]) return;
            var dateDiv = doc.createElement("div"), maskDiv = doc.createElement("div");
            dateDiv.className = dtCell[0];
            dateDiv.id = self;
            dateDiv.style.cssText = "z-index:" + (opts.zIndex || 999) + ";display:block;";
            maskDiv.className = maskDiv.id = dtCell[1];
			maskDiv.style.cssText = "z-index:" + (opts.zIndex - 5 || 999 - 5) + ";";
            disCell.appendChild(dateDiv);
            disCell.appendChild(maskDiv);
        }, initVals = function(elem) {
            var nowDateVal = jeDt.nowDate(null, opts.format || config.format);
            (jeDt.val(elem) || jeDt.text(elem)) == "" ? jeDt.isValHtml(elem) ? jeDt.val(elem, nowDateVal) :jeDt.text(elem, nowDateVal) :jeDt.isValHtml(elem) ? jeDt.val(elem) :jeDt.text(elem);
        }, valcell = MD(opts.dateCell);
        if (opts.isinitVal) initVals(valcell[0]);
        createDiv(doc.body, dtCell[0], false);
        jeDt.bind(valcell, function(ev) {
            jeDt.stopmp(ev);
            jeDt.setHtml(opts, this, "#" + dtCell[0]);
            MD("#" + dtCell[0])[0].style.display = "block";
            jeDt.addClass(MD("#" + dtCell[0]), "dateshow");
            jeDt.addClass(MD("#" + dtCell[1]), "dateshow");
        });
		setTimeout(function() {
			opts.success && opts.success();
		}, 1);
    };
    jeDt.setHtml = function(opts, self, merCell) {
        var that = this, date = new Date(), dateHtmStr = "", optsformat = opts.format || config.format, nowDateVal = jeDt.nowDate(null, optsformat),  
			initVal = opts.isinitVal ? jeDt.isValHtml(self) ? jeDt.val(self) :jeDt.text(self) :(jeDt.val(self) || jeDt.text(self)) == "" ? nowDateVal :jeDt.isValHtml(self) ? jeDt.val(self) :jeDt.text(self), 
			tms = (jeDt.val(self) || jeDt.text(self)) != "" ? initVal.match(/\d+/g) :[ date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() ];
        var dateCls = ["dateyear","datemonth","datetoday","datehours","dateminutes","dateseconds"], dLen = jeDt.parseCheck(optsformat).length,	
            formatType = jeDt.parseCheck(optsformat, optsformat.substring(0,4) == "YYYY" ? true:false), ishms = (formatType == "hh:mm:ss" || formatType == "hh:mm");
					
        var datetopStr = '<div class="datebtn_box"><div class="datebtn btncancel">取消</div><div class="datebtn btnclear">清空</div><div class="datebtn btnyes">确定</div></div>';
		
        for(var i = ishms ? 3 : 0; ishms ? i < dLen + 3 :i < dLen; i++){
			dateHtmStr += '<div class="datefixe"><div class="gear '+dateCls[i]+'"></div><div class="points"></div></div>';
		}
        jeDt.html(MD(merCell)[0], "");
        jeDt.html(MD(merCell)[0], datetopStr + '<div class="dateroll_mask"><div class="dateroll">' + dateHtmStr + "</div></div>");
        jeDt.getDateStr(opts, self, merCell, formatType, tms[0], tms[1], tms[2], tms);
		jeDt.dateTouch(opts, self, merCell, formatType,jeDt.dateClsArr, tms);
    };
    //循环生成日历
    jeDt.getDateStr = function(opts, self, merCell, formatType, ys, ms, ds, tms) {
		ys = parseInt(ys), ms = parseInt(ms), ds = parseInt(ds);
        var date = new Date(), yStr = "", mStr = "", dStr = "", hmsStr = "", valTexts = (jeDt.val(self) || jeDt.text(self)), isvalText = valTexts != "" ? true :false, 
			parsMin = jeDt.parseArr(opts.minDate || config.minDate), parsMax = jeDt.parseArr(opts.maxDate || config.maxDate), 
			yCls = MD(merCell + " .dateyear"), mCls = MD(merCell + " .datemonth"), dCls = MD(merCell + " .datetoday"), 
			thCls = MD(merCell + " .datehours"), tmCls = MD(merCell + " .dateminutes"), tsCls = MD(merCell + " .dateseconds"), 
			minYear = parseInt(parsMin[0]), maxYear = parseInt(parsMax[0]), parmsMin = (ms == parseInt(parsMin[1])),
			dateMs = (date.getMonth() + 1), tmsValArr = [ ys, ms, ds, tms[3], tms[4], tms[5] ];
		//计算某年某月有多少天,如果是二月，闰年28天否则29天
		var setMonthDays = function(year, month) {
			var er = year % 4 == 0 && year % 100 != 0 || year % 400 == 0 ? 29 :28;
			return [ 31, er, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ][month - 1];
		}, generateYM = function() {
            //循环生成年
            for (var y = minYear; y <= maxYear; y++) {
                yStr += '<p class="tooth" data-vals=' + y + ">" + y + "年</p>";
            }
            jeDt.html(yCls[0], yStr);
            jeDt.attr(yCls[0], "data-len", maxYear - minYear + 1);
            //循环生成月
            var msNum = opts.isLimit ? (ys == minYear ? date.getMonth() + 1 : 1) :1, msLen = opts.isLimit ? jeDt.montharr.length - dateMs + 1 :jeDt.montharr.length;
            for (var m = msNum; m <= jeDt.montharr.length; m++) {
                mStr += '<p class="tooth" data-vals=' + jeDt.digit(m) + ">" + jeDt.digit(m) + "月</p>";
            }
            jeDt.html(mCls[0], mStr);
            jeDt.attr(mCls[0], "data-len", msLen);
        }, generateDay = function() {
            var dayArr = setMonthDays(parseInt(ys), parseInt(ms)), dsNum = opts.isLimit ? (parmsMin ? parseInt(parsMin[2]) : 1) :1; 
			if(opts.isLimit){
				if(parmsMin && (parseInt(parsMax[2]) >= parseInt(parsMin[2]))){
					dsLen = parseInt(parsMax[2]) - parseInt(parsMin[2]) + 1;
				}else if(ms != parseInt(parsMin[1])){
					dsLen = dayArr;
				}else{
					dsLen = dayArr - parseInt(parsMin[2]) + 1;
				}
			}else{
				dsLen = dayArr;
			}
            //循环生成日
            for (var d = dsNum; opts.isLimit ? d < dsLen + dsNum :d <= dsLen; d++) {
                dStr += '<p class="tooth" data-vals=' + jeDt.digit(d) + ">" + jeDt.digit(d) + "日</p>";
            }
            jeDt.html(dCls[0], dStr);
            jeDt.attr(dCls[0], "data-len", dsLen);
        }, generatehms = function(hmsArr,matType) {
            //循环生成时分秒
            var hmsText = [ "时", "分", "秒" ], hmsNumArr = matType == "hh:mm" ? [ 24, 60 ] : [ 24, 60, 60 ];
            jeDt.each(hmsNumArr, function(i, hms) {
                var hmsStr = "";
                for (var h = 0; h < hms; h++) {
                    hmsStr += '<p class="tooth" data-vals=' + jeDt.digit(h) + ">" + jeDt.digit(h) + hmsText[i] + "</p>";
                }
                jeDt.html(hmsArr[i][0], hmsStr);
                jeDt.attr(hmsArr[i][0], "data-len", hms);
            });
        };
		
        //根据日期格式进行赋值
		var dateCls = [ yCls, mCls, dCls, thCls, tmCls, tsCls ], subformat = formatType.substring(0,5) == "hh:mm",
		    clsNum = subformat ? 3 : 0, formatLen = jeDt.parseCheck(opts.format || config.format).length;
		if(formatLen == 2){
			var dateArr = subformat ? [ thCls, tmCls ] : [ yCls, mCls ];
			subformat ? generatehms(dateArr,formatType) : generateYM();
		} else if (formatLen == 3) {
			var dateArr = subformat ? [ thCls, tmCls, tsCls ] : [ yCls, mCls, dCls ];
			subformat ? generatehms(dateArr,formatType) : (generateYM(),generateDay());
		}else if (formatLen >= 5){
			var matSplit = (opts.format || config.format).split(" ");
			var dateArr = jeDt.parseCheck(matSplit[1],false) == "hh:mm" ? [ yCls, mCls, dCls, thCls, tmCls ] : [ yCls, mCls, dCls, thCls, tmCls, tsCls ];
			generateYM(); generateDay(); generatehms(jeDt.parseCheck(matSplit[1],false) == "hh:mm" ? [ thCls, tmCls ] : [ thCls, tmCls, tsCls ], jeDt.parseCheck(matSplit[1],false));
		}
        jeDt.dateClsArr = dateArr;
        //赋予各种值
        jeDt.each(jeDt.dateClsArr, function(i, cls) {
			var numVal = "", numValArr = [ ys - minYear, opts.isLimit ? 0 :ms - 1, opts.isLimit ? ds - (parmsMin ? tms[2] : 1) :ds - 1, tms[3], tms[4], tms[5] ],
                hmsformat = formatType == "hh:mm:ss" || formatType == "hh:mm", tmsVals = tmsValArr[valTexts == "" ? (hmsformat ? i + 3 : i) : (valTexts != "" ? i : i + 3)];
            if (opts.isLimit) {
                if (formatLen == 2) {
                    numVal = hmsformat ? tmsVals :0 == i ? ys - parseInt(parsMin[0]) :ys == parseInt(parsMin[0]) ? ms - dateMs :ms - 1;
                } else if (formatLen == 3) {
                    numVal = hmsformat ? tmsVals :2 == i ? parmsMin && ds < parseInt(parsMin[2]) ? 0 :numValArr[i] :0 == i ? ys - parseInt(parsMin[0]) :ys == parseInt(parsMin[0]) ? ms - dateMs :ms - 1;
                } else if (formatLen >= 5) {
					numVal = 0 == i ? ys - parseInt(parsMin[0]) :1 == i ? ys == parseInt(parsMin[0]) ? ms - dateMs :ms - 1 :2 == i ? parmsMin && ds < parseInt(parsMin[2]) ? 0 :numValArr[i] :tmsValArr[i];
				}
            } else {
                numVal = hmsformat ? tmsVals : numValArr[i];
            }
            jeDt.attr(cls[0], "data-val", tmsVals);
            jeDt.attr(cls[0], "data-num", numVal);
            jeDt.attr(cls[0], "data-top", -(numVal * 2.5));
            cls[0].style["-webkit-transform"] = "translate3d(0," + -(numVal * 2.5) + "em,0)";
        });
        jeDt.events(opts, self, merCell, formatType, tms);	
    };
    //关闭弹层
    jeDt.dateClose = function(cell) {
        jeDt.removeClass(MD("#" + cell[0]), "dateshow");
        jeDt.removeClass(MD("#" + cell[1]), "dateshow");
    };
    //各种事件绑定
    jeDt.events = function(opts, self, merCell, formatType, tms) {
        var newDate = new Date();
        //取消事件
        jeDt.bind(MD(merCell + " .btncancel"), function() {
            jeDt.dateClose(dtCell);
        });
        //清空事件
        jeDt.bind(MD(merCell + " .btnclear"), function() {
			var clearVal = jeDt.isValHtml(self) ? jeDt.val(self) :jeDt.text(self);
            jeDt.isValHtml(self) ? jeDt.val(self, "") :jeDt.text(self, "");
            jeDt.dateClose(dtCell);
			if(clearVal != ""){
				if (typeof(opts.clearfun) == "function" || opts.clearfun != null) opts.clearfun(clearVal);
			}
        });
        //确定事件
        jeDt.bind(MD(merCell + " .btnyes"), function() {
            var yesArr = [];
            //获取当前的值
            jeDt.each(MD(merCell + " .gear"), function(i, cls) {
                yesArr.push(jeDt.attr(cls, "data-val"));
            });
            var yesVal = formatType == "hh:mm:ss" || formatType == "hh:mm" ? jeDt.parse([ newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate() ], [ yesArr[0], yesArr[1], yesArr[2] ], opts.format || config.format) : jeDt.parse([ yesArr[0], yesArr[1], yesArr[2] || newDate.getDate() ], [ yesArr[3] || newDate.getHours(), yesArr[4] || newDate.getMinutes(), yesArr[5] || newDate.getSeconds() ], opts.format || config.format);
            jeDt.isValHtml(self) ? jeDt.val(self, yesVal) :jeDt.text(self, yesVal);
            jeDt.dateClose(dtCell);
			if (typeof(opts.yesfun) == "function" || opts.yesfun != null) opts.yesfun(yesVal);
        });
    };
    //进行触摸移动
    jeDt.dateTouch = function(opts, self, merCell, formatType, clsArr, tms) {
        jeDt.each(clsArr, function(i, cls) {
            jeDt.touch(cls[0], gearTouchStart, gearTouchMove, gearTouchEnd);
        });
        //触摸开始
        function gearTouchStart(e) {
            e.preventDefault();
            var target = e.target;
            while (true) {
                if (!target.classList.contains("gear")) {
                    target = target.parentElement;
                } else {
                    break;
                }
            }
            clearInterval(target["int_" + target.id]);
            target["old_" + target.id] = e.targetTouches[0].screenY;
            target["o_t_" + target.id] = new Date().getTime();
            var top = jeDt.attr(target, "data-top");
            target["o_d_" + target.id] = top ? parseFloat(top) :0;
            target.style.webkitTransitionDuration = target.style.transitionDuration = "0ms";
        }
        //手指移动
        function gearTouchMove(e) {
            e.preventDefault();
            var target = e.target;
            while (true) {
                if (!target.classList.contains("gear")) {
                    target = target.parentElement;
                } else {
                    break;
                }
            }
            target["new_" + target.id] = e.targetTouches[0].screenY;
            target["n_t_" + target.id] = new Date().getTime();
            var winH = (target["new_" + target.id] - target["old_" + target.id]) * 9 / window.innerHeight;
            target["pos_" + target.id] = target["o_d_" + target.id] + winH;
            target.style["-webkit-transform"] = "translate3d(0," + target["pos_" + target.id] + "em,0)";
            jeDt.attr(target, "data-top", target["pos_" + target.id]);
            if (e.targetTouches[0].screenY < 1) gearTouchEnd(e);
        }
        //离开屏幕
        function gearTouchEnd(e) {
            e.preventDefault();
            var target = e.target;
            while (true) {
                if (!target.classList.contains("gear")) {
                    target = target.parentElement;
                } else {
                    break;
                }
            }
            var flag = (target["new_" + target.id] - target["old_" + target.id]) / (target["n_t_" + target.id] - target["o_t_" + target.id]);
            if (Math.abs(flag) <= .25) {
                target["spd_" + target.id] = flag < 0 ? -.08 :.08;
            } else {
                target["spd_" + target.id] = Math.abs(flag) <= .5 ? flag < 0 ? -.16 :.16 :flag / 2.5;
            }
            if (!target["pos_" + target.id]) {
                target["pos_" + target.id] = 0;
            }
            effectSlow(target);
        }
        //缓动效果
        function effectSlow(target) {
            var d = 0;
            var stopGear = false;
            function setDuration() {
                target.style.webkitTransitionDuration = target.style.transitionDuration = "150ms";
                stopGear = true;
            }
            clearInterval(target["int_" + target.id]);
            target["int_" + target.id] = setInterval(function() {
                var pos = target["pos_" + target.id], speed = target["spd_" + target.id] * Math.exp(-.015 * d);
                pos += speed;
                if (Math.abs(speed) > .1) {} else {
                    var b = Math.round(pos / 2.5) * 2.5;
                    pos = b;
                    setDuration();
                }
                if (pos > 0) {
                    pos = 0;
                    setDuration();
                }
                var minTop = -(target.dataset.len - 1) * 2.5;
                if (pos < minTop) {
                    pos = minTop;
                    setDuration();
                }
                if (stopGear) {
                    var gearVal = Math.abs(pos) / 2.5;
                    rollStopVal(target, gearVal);
                    clearInterval(target["int_" + target.id]);
                }
                target["pos_" + target.id] = pos;
                target.style["-webkit-transform"] = "translate3d(0," + pos + "em,0)";
                jeDt.attr(target, "data-top", pos);
                d++;
            }, 15);
        }
        //控制插件滚动后停留的值
        function rollStopVal(target, val) {
            val = Math.round(val);
            var rollVal = [], vals = jeDt.attr(target.childNodes[val], "data-vals");
            jeDt.attr(target, "data-num", val);
            jeDt.attr(target, "data-val", vals);
            setGearTooch(target);
            jeDt.each(MD(merCell + " .gear"), function(i, cls) {
                rollVal.push(jeDt.attr(cls, "data-val"));
            });
			var ys = rollVal[0].charAt(0) == 0 ? rollVal[0].replace(/0/,"") : rollVal[0], ms = rollVal[1].charAt(0) == 0 ? rollVal[1].replace(/0/,"") : rollVal[1],
			    ds = rollVal[2] == undefined ? new Date().getDate() : (rollVal[2].charAt(0) == 0 ? rollVal[2].replace(/0/,"") : rollVal[2]);
			jeDt.getDateStr(opts, target, merCell, formatType, ys , ms, ds, tms);
        }
        function setGearTooch(target) {
            var len = jeDt.attr(target, "data-len"), gearVal = jeDt.attr(target, "data-num"), maxVal = len - 1;
            if (gearVal > maxVal) gearVal = maxVal;
            jeDt.attr(target, "data-len", len);
            target.style["-webkit-transform"] = "translate3d(0," + -gearVal * 2.5 + "em,0)";
            jeDt.attr(target, "data-top", -gearVal * 2.5 + "em");
            jeDt.attr(target, "data-num", gearVal);
        }
    };
    //核心部分
    var jemobDate = function(options) {
        return new jeDt.initDate(options || {});
    };
	//版本
	jemobDate.version = "1.0";
    //返回指定日期
    jemobDate.now = function(num) {
        var De = new Date(num | 0 ? function(tamp) {
            return tamp < 864e5 ? +new Date() + tamp * 864e5 :tamp;
        }(parseInt(num)) :+new Date()), newDate = new Date();
        var Zeros = function(value, length) {
            var result = "00" + value.toString();
            return result.substr(result.length - length);
        };
        function getLocalTime(dateNum) {
            var Den = new Date(dateNum * 1e3);
            return Den.getFullYear() + "-" + Zeros(Den.getMonth() + 1, 2) + "-" + Zeros(Den.getDate(), 2) + " " + Zeros(Den.getHours(), 2) + ":" + Zeros(Den.getMinutes(), 2) + ":" + Zeros(Den.getSeconds(), 2);
        }
        var y = De.getFullYear(), m = De.getMonth() + 1, d = De.getDate();
        var localTime = typeof num === "string" ? getLocalTime(num) :y + "-" + Zeros(m, 2) + "-" + Zeros(d, 2) + " " + newDate.getHours() + ":" + newDate.getMinutes() + ":" + newDate.getSeconds();
        return localTime;
    };
    // 多环境支持
    "function" === typeof define ? define(function() {
        return jemobDate;
    }) :"object" === typeof module && "object" === typeof module.exports ? module.exports = jemobDate :window.jemobDate = touchDate = jemobDate;
})(window);