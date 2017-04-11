// JavaScript Document
(function(window) {
    var jeDt = {}, doc = document, dtCell = ["datebox","datemask"], ymdMacth = /\w+|d+|[\u4E00-\u9FA5\uF900-\uFA2D]|[\uFF00-\uFFEF]/g;
	var MD = function(selector){return document.querySelectorAll(selector);}
    jeDt.each = function(arr, fn) {
        var i = 0, len = arr.length;
        for (;i < len; i++) {
            if (fn(i, arr[i]) === false) {
                break;
            }
        }
    };
	jeDt.bind = function(el,fun) {
		return jeDt.each(el,function(i,elem) {
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
	jeDt.touch = function(elem,fun1,fun2,fun3){
		elem.addEventListener("touchstart",fun1, false);
		elem.addEventListener("touchmove",fun2, false);
		elem.addEventListener("touchend",fun3, false);
	};
    jeDt.stopmp = function(e) {
        e = e || window.event;
        e.stopPropagation ? e.stopPropagation() :e.cancelBubble = true;
        return this;
    };
    jeDt.attr = function(elem, key, val) {
        if (typeof key === "string" && typeof val === 'undefined') {
            return elem.getAttribute(key);
        } else {
            elem.setAttribute(key, val);
        }
        return this;
    };
	jeDt.addClass = function(elem,className) {
		return jeDt.each(elem,function(i,cls) {
			cls.classList.add(className);
		});
	};
	jeDt.removeClass = function(elem,className) {
		return jeDt.each(elem,function(i,cls) {
			cls.classList.remove(className);
		});
	};
	jeDt.hasClass = function(el,className) {
		var elehas, element = el[0];
		elehas = (!element) ? undefined : element.classList.contains(className);
		return elehas
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
        var format = format, hmsCheck = jeDt.parseCheck(format,false) == "hh:mm:ss", num = 2;
        return format.replace(/YYYY|MM|DD|hh|mm|ss/g, function(str, index) {
			var idx = hmsCheck ? ++num : ymd.index = ++ymd.index|0; 
            return jeDt.digit(ymd[idx]);
        });
    };
	jeDt.parseCheck = function(format,bool) {
		var ymdhms = [];
		format.replace(/YYYY|MM|DD|hh|mm|ss/g, function(str, index) {
		    ymdhms.push(str)
	    });
		return ymdhms.join(bool == true ? "-":":");
	}
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
        format:"YYYY-MM-DD hh:mm:ss", //日期格式
        minDate:"1970-01-01 00:00:00", //最小日期
        maxDate:"2030-12-31 23:59:59" //最大日期
    };
	jeDt.initDate = function(opts){
		var createDiv = function (disCell, self, dis){
			if(MD("#"+ self)[0]) return;
			var dateDiv = doc.createElement("div"), maskDiv = doc.createElement("div");
			dateDiv.className = dtCell[0];
			dateDiv.id = self;
			dateDiv.style.cssText = "z-index:"+(opts.zIndex || 999)+";display:block;";
			maskDiv.className = maskDiv.id = dtCell[1];
			disCell.appendChild(dateDiv);
			disCell.appendChild(maskDiv);
		},
		initVals = function (elem){
			var nowDateVal = jeDt.nowDate(null, opts.format||config.format);
			(jeDt.val(elem) || jeDt.text(elem)) == "" ? jeDt.isValHtml(elem) ? jeDt.val(elem, nowDateVal) :jeDt.text(elem, nowDateVal) :jeDt.isValHtml(elem) ? jeDt.val(elem) :jeDt.text(elem);
		},
		valcell = MD(opts.dateCell);
		initVals(valcell[0]);
		createDiv(doc.body,dtCell[0],false);
		jeDt.bind(valcell,function(ev){
			jeDt.stopmp(ev);
			jeDt.setHtml(opts, this, "#"+dtCell[0]);
			MD("#"+dtCell[0])[0].style.display = "block"
			jeDt.addClass(MD("#"+dtCell[0]),"dateshow");
			jeDt.addClass(MD("#"+dtCell[1]),"dateshow");
		});		
	};
	jeDt.setHtml = function(opts, self, merCell) {
		var that = this, date = new Date(),dateHtmStr = "", nowDateVal = jeDt.nowDate(null, opts.format||config.format), 
		    isYYMM = jeDt.parseCheck(opts.format||config.format,true) == "YYYY-MM" ? true :false,
			isYYMMDD = jeDt.parseCheck(opts.format||config.format,true) == "YYYY-MM-DD" ? true :false,
		    ishhmmss = jeDt.parseCheck(opts.format||config.format,false) == "hh:mm:ss" ? true :false, isTimeFormat = !isYYMM ? true : false,
		    initVal = opts.isinitVal ? jeDt.isValHtml(self) ? jeDt.val(self) :jeDt.text(self) :(jeDt.val(self) || jeDt.text(self)) == "" ? nowDateVal :jeDt.isValHtml(self) ? jeDt.val(self) :jeDt.text(self), 
		    tms = (jeDt.val(self) || jeDt.text(self)) != "" ? initVal.match(/\d+/g) : [ date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() ];
			
		var datetopStr = '<div class="datebtn_box"><div class="datebtn datebtn_cancel">取消</div><div class="datebtn datebtn_clear">清空</div><div class="datebtn datebtn_yes">确定</div></div>'	;
		var dateymStr = '<div class="datefixe"><div class="gear dateyear"></div><div class="points"></div></div><div class="datefixe"><div class="gear datemonth"></div><div class="points"></div></div>';
		var datedStr = '<div class="datefixe"><div class="gear datetoday"></div><div class="points"></div></div>';
		var datehmsStr = '<div class="datefixe"><div class="gear datehours"></div><div class="points"></div></div><div class="datefixe"><div class="gear dateminutes"></div><div class="points"></div></div><div class="datefixe"><div class="gear dateseconds"></div><div class="points"></div></div>';

		if(isYYMM){
			dateHtmStr = dateymStr;
		}else if(isYYMMDD){
			dateHtmStr = dateymStr + datedStr;
		}else if(ishhmmss){
			dateHtmStr = datehmsStr;
		}else{
			dateHtmStr = dateymStr + datedStr + datehmsStr;
		}
		jeDt.html(MD(merCell)[0], "");
		jeDt.html(MD(merCell)[0], datetopStr + '<div class="dateroll_mask"><div class="dateroll">'+dateHtmStr+'</div></div>');
		jeDt.getDateStr(opts, self, merCell,[isYYMM,isYYMMDD,ishhmmss], date.getFullYear(), date.getMonth() + 1, date.getDate(), tms)
		//ishhmmss ? jeDt.getDateStr(opts, merCell, date.getFullYear(), date.getMonth() + 1, date.getDate()) : jeDt.getDateStr(opts, merCell, tms[0], tms[1], tms[2]);   
		
	};
	//循环生成日历
	jeDt.getDateStr = function(opts, self, merCell, formatType, ys, ms, ds, tms) {
		var yStr = "", mStr = "", dStr = "", hmsStr = "", date = new Date(), isvalText = (jeDt.val(self) || jeDt.text(self)) != "" ? true :false,
		    yCls = MD(merCell + " .dateyear"),  mCls = MD(merCell + " .datemonth"), dCls = MD(merCell + " .datetoday"),
		    thCls = MD(merCell + " .datehours"), tmCls = MD(merCell + " .dateminutes"), tsCls = MD(merCell + " .dateseconds"),
		    minNum = parseInt(jeDt.parseArr(opts.minDate||config.minDate)[0]), maxNum = parseInt(jeDt.parseArr(opts.maxDate||config.maxDate)[0]),
			tmsValArr = [ tms[0], tms[1], tms[2], tms[3], tms[4], tms[5] ], 
			numValArr = [ isvalText ? tms[0] - minNum : ys - minNum, opts.isLimit ? 0 : tms[1] - 1, tms[2] - 1, tms[3], tms[4], tms[5] ];  
		var generateYM = function(){
			//循环生成年
			for(var y=minNum; y<=maxNum; y++){
				yStr += '<p class="tooth" data-vals='+y+'>'+y+'年</p>';
			}
			jeDt.html(yCls[0], yStr);
			jeDt.attr(yCls[0], "data-len", maxNum - minNum + 1);
			//循环生成月
			var msNum = opts.isLimit ? ms : 1, msLen = opts.isLimit ? jeDt.montharr.length - ms + 1 : jeDt.montharr.length;
			for(var m=msNum; m<=jeDt.montharr.length; m++){
				mStr += '<p class="tooth" data-vals='+jeDt.digit(m)+'>'+jeDt.digit(m)+'月</p>';
			}
			jeDt.html(mCls[0], mStr);
			jeDt.attr(mCls[0], "data-len", msLen);
		},generateDay = function(){		
			//计算某年某月有多少天,如果是二月，闰年28天否则29天
			var setMonthDays = function(year, month) {
				var er = year % 4 == 0 && year % 100 != 0 || year % 400 == 0 ? 29 :28;
				return [ 31, er, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ][month - 1];
			}
			var dayArr = setMonthDays(parseInt(ys), parseInt(ms)), dsNum = opts.isLimit ? parseInt(jeDt.parseArr(opts.minDate||config.minDate)[2]) : 1, 
			    dsLen = opts.isLimit ? dayArr - ds + 1 : dayArr;
			//循环生成日
			for(var d=dsNum; d<=dayArr; d++){
				dStr += '<p class="tooth" data-vals='+jeDt.digit(d)+'>'+jeDt.digit(d)+'日</p>';
			}
			jeDt.html(dCls[0], dStr);
			jeDt.attr(dCls[0], "data-len", dsLen);
		},generatehms = function (hmsArr){	
		    var hmsText = ["时","分","秒"];
			jeDt.each([24,60,60],function(i,hms){
				var hmsStr = [];
				for(var h=0; h<hms; h++){
					hmsStr.push('<p class="tooth" data-vals='+jeDt.digit(h)+'>'+jeDt.digit(h)+hmsText[i]+'</p>');
				}
				jeDt.html(hmsArr[i][0], hmsStr.join(""));
				jeDt.attr(hmsArr[i][0], "data-len", hms);
			});
		};
		
		if(formatType[0]){
			var dateArr = [yCls,mCls],datetype = ["year","month"];
			generateYM();
		}else if(formatType[1]){
			var dateArr = [yCls,mCls,dCls],datetype = ["year","month","today"];
			generateYM(); generateDay();
		}else if(formatType[2]){
			var dateArr = [thCls,tmCls,tsCls],datetype = ["hours","minutes","seconds"];
			generatehms();
		}else{
			var dateArr = [yCls,mCls,dCls,thCls,tmCls,tsCls],datetype = ["year","month","today","hours","minutes","seconds"];
			generateYM(); generateDay(); generatehms([thCls,tmCls,tsCls]);
		};
		
		jeDt.each(dateArr,function(i,cls){
			jeDt.attr(cls[0], "data-type", datetype[i]);
			jeDt.attr(cls[0], "data-val", tmsValArr[i]);
			jeDt.attr(cls[0], "data-num", numValArr[i]);
			jeDt.attr(cls[0], "data-top", -(numValArr[i]*2));
			cls[0].style["-webkit-transform"] = 'translate3d(0,' + -(numValArr[i]*2) + 'em,0)';	
		});
		jeDt.events(opts, self, merCell, tms);
		jeDt.dateTouch(dateArr, merCell);
	};
	//关闭弹层
	jeDt.dateClose = function(cell){
		jeDt.removeClass(MD("#"+cell[0]),"dateshow");
		jeDt.removeClass(MD("#"+cell[1]),"dateshow");
	};
	//各种事件绑定
	jeDt.events = function(opts, self, merCell, tms){
		var newDate = new Date(), minDt= jeDt.parseArr(opts.minDate||config.minDate),tmsArr = [minDt[0],minDt[1],minDt[2],0,0,0];
		//取消事件
		jeDt.bind(MD(merCell + " .datebtn_cancel"),function(){
			jeDt.dateClose(dtCell);
	    });
		//清空事件
		jeDt.bind(MD(merCell + " .datebtn_clear"),function(){
			jeDt.isValHtml(self) ? jeDt.val(self,"") :jeDt.text(self,""); 
			jeDt.dateClose(dtCell);
	    });
		//确定事件
		jeDt.bind(MD(merCell + " .datebtn_yes"),function(){
			var yesArr=[]; //获取当前的值
			jeDt.each(MD(merCell + " .gear"),function(i,cls){
				yesArr.push(jeDt.attr(cls, "data-val"));
			})
			var yesVal = jeDt.parse([ yesArr[0], yesArr[1], yesArr[2] ], [ yesArr[3], yesArr[4], yesArr[5] ], opts.format||config.format);
			jeDt.isValHtml(self) ? jeDt.val(self,yesVal) :jeDt.text(self,yesVal); 
			jeDt.dateClose(dtCell);
	    });
		
	};
	jeDt.dateTouch = function(clsArr, merCell){
		jeDt.each(clsArr,function(i,cls){
		    jeDt.touch(cls[0],gearTouchStart,gearTouchMove,gearTouchEnd);
		})
		//触摸开始
		function gearTouchStart(e) {
			e.preventDefault();
			var target = e.target;
			while (true) {
				if (!target.classList.contains("gear")) {
					target = target.parentElement;
				} else {
					break
				}
			}
			clearInterval(target["int_" + target.id]);
			target["old_" + target.id] = e.targetTouches[0].screenY;
			target["o_t_" + target.id] = (new Date()).getTime();
			var top = jeDt.attr(target,'data-top');
			if (top) {
				target["o_d_" + target.id] = parseFloat(top);
			} else {
				target["o_d_" + target.id] = 0;
			}
			target.style.webkitTransitionDuration = target.style.transitionDuration = '0ms';
		}
		//手指移动
		function gearTouchMove(e) {
			e.preventDefault();
			var target = e.target;
			while (true) {
				if (!target.classList.contains("gear")) {
					target = target.parentElement;
				} else {
					break
				}
			}
			target["new_" + target.id] = e.targetTouches[0].screenY;
			target["n_t_" + target.id] = (new Date()).getTime();
			var winH = (target["new_" + target.id] - target["old_" + target.id]) * 9 / window.innerHeight;
			target["pos_" + target.id] = target["o_d_" + target.id] + winH;
			target.style["-webkit-transform"] = 'translate3d(0,' + target["pos_" + target.id] + 'em,0)';
			jeDt.attr(target,'data-top', target["pos_" + target.id]);
			if(e.targetTouches[0].screenY<1) gearTouchEnd(e);
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
			if (Math.abs(flag) <= 0.2) {
				target["spd_" + target.id] = (flag < 0 ? -0.08 : 0.08);
			} else {
				if (Math.abs(flag) <= 0.5) {
					target["spd_" + target.id] = (flag < 0 ? -0.16 : 0.16);
				} else {
					target["spd_" + target.id] = flag / 2;
				}
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
				target.style.webkitTransitionDuration = target.style.transitionDuration = '200ms';
				stopGear = true;
			}
			clearInterval(target["int_" + target.id]);
			target["int_" + target.id] = setInterval(function() {
				var pos = target["pos_" + target.id];
				var speed = target["spd_" + target.id] * Math.exp(-0.03 * d);
				pos += speed;
				if (Math.abs(speed) > 0.1) {} else {
					var b = Math.round(pos / 2) * 2;
					pos = b;
					setDuration();
				}
				if (pos > 0) {
					pos = 0;
					setDuration();
				}
				var minTop = -(target.dataset.len - 1) * 2;
				if (pos < minTop) {
					pos = minTop;
					setDuration();
				}
				if (stopGear) {
					var gearVal = Math.abs(pos) / 2;
					rollStopVal(target, gearVal);
					clearInterval(target["int_" + target.id]);
				}
				target["pos_" + target.id] = pos;
				target.style["-webkit-transform"] = 'translate3d(0,' + pos + 'em,0)';
				jeDt.attr(target,'data-top', pos);
				d++;
			}, 30);
		}
		//控制插件滚动后停留的值
		function rollStopVal(target, val) {
			val = Math.round(val);
			var vals = jeDt.attr(target.childNodes[val], "data-vals");
			jeDt.attr(target, "data-num", val);
			jeDt.attr(target, "data-val", vals);	
			setGearTooth(target);		
		}
		function setGearTooth(target){
			var len = jeDt.attr(target, "data-len"), gearVal = jeDt.attr(target,'data-num'), maxVal = len - 1;
            if (gearVal > maxVal) gearVal = maxVal;
			jeDt.attr(target,'data-len', len);
			target.style["-webkit-transform"] = 'translate3d(0,' + (-gearVal * 2) + 'em,0)';
            jeDt.attr(target,'data-top', -gearVal * 2 + 'em');
            jeDt.attr(target,'data-num', gearVal);
		}
	};
    //核心部分
	var jemDate = function(options) {
        return new jeDt.initDate(options || {});
    };
	//返回指定日期
    jemDate.now = function(num) {
        var De = new Date((num|0) ? function(tamp){
			return tamp < 86400000 ? (+new Date + tamp*86400000) : tamp;
		}(parseInt(num)) : +new Date), newDate = new Date();
		var Zeros = function (value, length) {
			var result = "00" + value.toString();
			return result.substr(result.length - length);
		}
		function getLocalTime(dateNum) {
			var Den = new Date(dateNum * 1000);			
			return Den.getFullYear() + "-" + Zeros(Den.getMonth() + 1, 2) + "-" + Zeros(Den.getDate(), 2) + " " + Zeros(Den.getHours(), 2) + ":" + Zeros(Den.getMinutes(), 2) + ":" + Zeros(Den.getSeconds(), 2);
		}
        var y = De.getFullYear(), m = De.getMonth() + 1, d = De.getDate();
		var localTime = (typeof num === "string") ? getLocalTime(num) : y + "-" + Zeros(m, 2) + "-" + Zeros(d, 2) + " "+newDate.getHours()+":"+newDate.getMinutes()+":"+newDate.getSeconds() ; 
        return localTime;
    };
    // 多环境支持
	"function" === typeof define ? define(function () { 
	    return jemDate; 
	}) : ("object" === typeof module && "object" === typeof module.exports) ?  module.exports = jemDate : window.jemDate = mDate = jemDate;
})(window);