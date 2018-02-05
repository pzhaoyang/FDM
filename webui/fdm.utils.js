jQuery.namespace("fdm");

/*
* @version    0.4.6
* @date       2014-01-27
* @stability  2 - Unstable
* @author     Lauri Rooden (https://github.com/litejs/natural-compare-lite)
* @license    MIT License
*/
String.naturalCompare = function(a, b) {

	if (a != b) for (var i, ca, cb = 1, ia = 0, ib = 0; cb;) {
		ca = a.charCodeAt(ia++) || 0
		cb = b.charCodeAt(ib++) || 0

		if (ca < 58 && ca > 47 && cb < 58 && cb > 47) {
			for (i = ia; ca = a.charCodeAt(ia), ca < 58 && ca > 47; ia++);
			ca = (a.slice(i - 1, ia) | 0) + 1
			for (i = ib; cb = b.charCodeAt(ib), cb < 58 && cb > 47; ib++);
			cb = (b.slice(i - 1, ib) | 0) + 1
		}

		if (ca != cb) return (ca < cb) ? -1 : 1
	}
	return 0
};
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
if (!String.prototype.endsWith) {
	Object.defineProperty(String.prototype, 'endsWith', {
		value: function (searchString, position) {
			var subjectString = this.toString();
			if (position === undefined || position > subjectString.length) {
				position = subjectString.length;
			}
			position -= searchString.length;
			var lastIndex = subjectString.indexOf(searchString, position);
			return lastIndex !== -1 && lastIndex === position;
		}
	});
}

fdm.Math = {
	round: function(value, significant){
		//var f = value-Math.floor(value);
		//var roundedValue = parseFloat((value.toFixed(/*(a>1e3) && */(f >= 0.1) && (f < 0.9) ? 2 : 0)));
		return value.toPrecision(significant) * 1;
	},

	// calculates how many symbols are in the target number after decimal point
	decimalPlaces: function(num, significant){
		// http://stackoverflow.com/a/10454560
		var match = (num.toPrecision(significant)).match(/(?:[\.,](\d+))?(?:[eE]([+-]?\d+))?$/);
		if (!match) { return 0; }
		return Math.max(
			0,
			// Number of digits right of decimal point.
			(match[1] ? match[1].length : 0)
				// Adjust for scientific notation.
				- (match[2] ? +match[2] : 0));
	},

	calcRoundPow: function(value, significant){
		var result = Math.log(value)/Math.log(fdmApp.bytesInKB) | 0;
		var rounded = value/Math.pow(fdmApp.bytesInKB,result);
		if(rounded > Math.pow(10, significant)){
			result++;
		}
		return result;
	},

    roundPrecision: function(number, count){

        number = number.toString();
        var result = "";

        var n=0;
        for (var i = 0; i < number.length; i++){
            var v = number[i];
            if (parseInt(v) > 0)
                n++;
            if (n > count && parseInt(v) > 0){
                v = '0';
            }
            result = result + v;
        }
        return parseFloat(result);
    }
};

fdm.fileUtils = {
	unitNameByPow: function(e){
		return (e?'KMGTPEZY'[--e]+'B': 'B'/*bytes*/);
	},
	fileSizeIEC: function(a,b,c,d,e) {
		// based on http://stackoverflow.com/a/20463021
		var r = (c=Math.log,d=fdmApp.bytesInKB,e=c(a)/c(d)|0,a/Math.pow(d,e));
		var f = r-Math.floor(r);
		return r.toFixed((a>1e3) && (f >= 0.1) && (f < 0.9) ? 2 : 0)
			+' '+ fdm.fileUtils.unitNameByPow(e);
	},

	fileSizeIECUnit: function(a,b,c,d,e) {
		c=Math.log;d=fdmApp.bytesInKB;e=c(a)/c(d)|0;
		return fdm.fileUtils.unitNameByPow(e);
	},

	fileSizeIECUnitless: function(a,b,c,d,e) {
		var r = (c=Math.log,d=fdmApp.bytesInKB,e=c(a)/c(d)|0,a/Math.pow(d,e));
		return parseFloat((c=Math.log, d=fdmApp.bytesInKB, e=c(a)/c(d)|0, a / Math.pow(d,e)).toPrecision(r > 99.5 ? 4 : 3));
	},

	roundFileSizeIEC: function(a,b,c,d,e) {
		if(a == 0) return "0 " + fdm.fileUtils.unitNameByPow(e);
		return parseFloat((c=Math.log,d=fdmApp.bytesInKB,e=c(a)/c(d)|0,a/Math.pow(d,e)).toPrecision(2))
			+' '+ fdm.fileUtils.unitNameByPow(e);
	},

	roundFileSizeIEC2: function(a,b,c,d,e) {
		var r = (c=Math.log,d=fdmApp.bytesInKB,e=c(a)/c(d)|0,a/Math.pow(d,e));
		return parseFloat((c=Math.log,d=fdmApp.bytesInKB,e=c(a)/c(d)|0,a/Math.pow(d,e)).toFixed(r > 99.5 ? 0 : 2))
			+' '+ fdm.fileUtils.unitNameByPow(e);
	},

	roundFileSizeIECUnitless: function(a,reference,b,c,d,e) {
		var r;
		if(reference === undefined)
			r = (c=Math.log,d=fdmApp.bytesInKB,e=c(a)/c(d)|0,a/Math.pow(d,e));
		else
			r = (c=Math.log,d=fdmApp.bytesInKB,e=c(reference)/c(d)|0,a/Math.pow(d,e));  // use the same unit as in reference #1971
		return parseFloat(r).toFixed(r > 99.5 ? 0 : 1);
	},

	extractExtension: function(filePath)
	{
		return (/[.]/.exec(filePath)) ? /[^.]+$/.exec(filePath).toString() : undefined;
	},

	fileListToFileTree: function(files) {
		// the algorithm was created by I.Grygoriev and copied from tools.js with some improvements
		var aTree = [files.length];
		var root = [];

		for (var i = 0; i < files.length; i++) {
			var fileItem = _.clone(files[i]);
			var tmpParent = aTree[fileItem.parentIndex];
			var tmpNode = {
				parentIndex: fileItem.parentIndex,
				node: { index: i, children: [], data: fileItem, checked: fileItem.isChecked, name: fileItem.name/*, parent: tmpParent ? tmpParent.node : null*/ }
			};

			if (tmpNode.parentIndex == -1) {
				root.push(tmpNode.node);
			}
			else { // if (treeNode.parentIndex != -1)
				var parentChildren = aTree[tmpNode.parentIndex].node.children;
				parentChildren.push(tmpNode.node);
				parentChildren.sort(function(a,b){
					return String.naturalCompare(a.name.toLowerCase(), b.name.toLowerCase());
				});
			}

			aTree[i] = tmpNode;
		}

		return root;
	}
};

fdm.speedUtils = {

	formatFloatSpeed: function(num){ num = parseFloat(num) || 0; return parseFloat((Math.round(num * 100) / 100).toFixed(2));},

    speed2SignDigits: function(speed, need_precision) {

        // round to 2 significant digits
        //http://www.quora.com/Google-Sheets/How-can-I-round-to-x-significant-digits
        if (need_precision == null)
            need_precision = true;
		var sizeText = "0";
		var speedPow = Math.log(speed)/Math.log(fdmApp.bytesInKB) | 0;

		if(speed > 0){
            var sizeValue = speed/Math.pow(fdmApp.bytesInKB, speedPow);
            if(sizeValue >= 1000){
                speedPow++;
                sizeValue = speed/Math.pow(fdmApp.bytesInKB, speedPow);
            }
			if (sizeValue < 0.01)
				sizeValue = 0;
			var sizeText = fdm.fileUtils.fileSizeIECUnitless(sizeValue);
            if (need_precision)
            {
                sizeText = fdm.Math.roundPrecision(sizeText, 2);
                sizeText = sizeText.toPrecision(2);
                if (sizeText > 9)
                    sizeText = sizeText*1;
            }
		}
		var units = fdm.fileUtils.unitNameByPow(speedPow);
		// var result = __("%1 " + units +"/s", sizeText);
		var result = sizeText + " " + units +"/s";
		return result;
    },
	//twoSpeedsAsText: function(dlSpeed, ulSpeed, seeding_enabled)
	//{
	//	seeding_enabled = seeding_enabled || false;
    //
	//	if (dlSpeed == 0 && ulSpeed == 0 && seeding_enabled)
	//		return '<span class="arrow_up"></span>' + fdm.speedUtils.speed2SignDigits(ulSpeed);
    //
	//	var resultSpeedText = '';
	//	if (dlSpeed > 0)
	//		resultSpeedText += '<span class="arrow_dwn"></span>' + fdm.speedUtils.speed2SignDigits(dlSpeed);
    //
	//	if (dlSpeed > 0 && ulSpeed > 0)
	//		resultSpeedText += '; ';
    //
	//	if (ulSpeed > 0)
	//		resultSpeedText += '<span class="arrow_up"></span>' + fdm.speedUtils.speed2SignDigits(ulSpeed);
    //
	//	return resultSpeedText;
	//}
};

fdm.dateUtils = {
	downloadDateText: function(valueUnwrapped){

		var downloadDateText = '';
		if(valueUnwrapped == null ||
			(typeof valueUnwrapped === 'object' && valueUnwrapped.getTime() == 0))
		{
			downloadDateText = '';
		}
		else
		{
			var m = moment(valueUnwrapped);
			var now = moment();
			if(Math.abs(m.diff(now, 'hours')) < 24 && m.day() == now.day())
				downloadDateText = m.format("H:mm");
			else{

				if (Strings.current_lang_id == 'ru')
					downloadDateText = m.format("D MMM");
				else
					downloadDateText = m.format("MMM D");
			}
		}

		return downloadDateText;
	},
	downloadDateTitle: function(valueUnwrapped){

		//moment.locale();
		var m = moment(valueUnwrapped);
		return m.format('llll');
	}
};

fdm.timeUtils = {

	roundUp: function(x, step) { return x <= 1 ? 1 : x; step = step || 5; var r = Math.round(x/step)*step; return r <= 1 ? 1 : r; },
	remainingTime: function(remainingTime){

		var seconds, minutes, hours, days, weeks, years, text;

		var valueUnwrapped = remainingTime;

		if (!valueUnwrapped || valueUnwrapped < 0)
			return "";

		seconds = Math.floor(valueUnwrapped / 1000);

		if (seconds >= 3153600000)
			return "∞";

		var time_type = 'seconds';
		minutes = Math.floor(seconds/60);
		if (minutes > 0 || this.roundUp(seconds) == 60){
			time_type = 'minutes';
			hours = Math.floor(seconds/3600);
			if (hours > 0 || this.roundUp(minutes) == 60){
				time_type = 'hours';
				days = Math.floor(seconds/86400);
				if (days > 0 || hours >= 24){
					time_type = 'days';
					weeks = Math.floor(seconds/604800);
					if (weeks > 0 || days >= 7){
						time_type = 'weeks';
						years = Math.floor(seconds/31536000);
						if (years > 0 || weeks >= 52){
							time_type = 'years';
						}
					}
				}
			}
		}

		switch (time_type){
			case 'seconds':

				text = __("%ns", this.roundUp(seconds));
				break;
			case 'minutes':

				var s = seconds % 60;
				text = __("%nm", this.roundUp(minutes)) + (s > 0 ? ' ' + __("%ns", s) : '');
				break;
			case 'hours':

				if (hours > 23)
					hours = 23;
				if (hours < 1)
					hours = 1;

				var m = minutes % 60;
				text = __("%nh", hours) + (m > 0 ? ' ' + __("%nm", m) : '');
				break;
			case 'days':

				var h = hours % 24;
				text = __("%nd", days) + (h > 0 ? ' ' + __('%nh', h) : '');

				break;
			case 'weeks':

				var d = days % 7;
				text = __("%nw", weeks) + (d > 0 ? ' ' + __('%nd', d): '');

				break;
			case 'years':

				var w = weeks % 52;
				text = __("%ny", years) + (w > 0 ? ' ' + __('%nw', w) : '');

				break;
		}

		return text;

		/*
		if(seconds > 86400)
		{
			var days = Math.floor(seconds/86400);
			text = days == 1 ? "1 day" : days + " days";
		} else
		if(seconds > 60*10)
		{
			var hours = Math.floor(seconds / (60*60));
			var minutes = Math.floor ((seconds - hours*60*60)/60);
			if(minutes < 0) minutes = 0;
			if(hours != 0)
				text = hours + "h ";
			minutes = this.roundUp(minutes);
			if(minutes != 0)
				text += minutes + "m";
		} else
		{
			var minutes = Math.floor(seconds/60);
			var s = seconds - minutes*60;
			if(s < 0) s = 0;
			s = this.roundUp(s);
			if(minutes != 0)
			{
				text = minutes + "m ";
				if(s != 0)
					text += s + "s";
			}
			else
			{
				if(valueUnwrapped < 1500)
					text = "1s";
				else if (valueUnwrapped < 5000)
					text = "5s";
				else
					text = s + "s";
			}
		}

		return text;
		*/
	}
};

fdm.sizeUtils = {
    getSizeText: function(bytes, sizePow){

        var sizeValue = bytes/Math.pow(fdmApp.bytesInKB, sizePow);

		if (sizeValue < 0.01)
			sizeValue = 0;
        // round to 3 significant digits
        //http://www.quora.com/Google-Sheets/How-can-I-round-to-x-significant-digits
        var sizeText = fdm.fileUtils.fileSizeIECUnitless(sizeValue);

        if (sizePow != 0){

            if (sizeText >= 1000)
                sizeText = sizeText.toPrecision(4);
            else{
                sizeText = fdm.Math.roundPrecision(sizeText, 3);
                sizeText = sizeText.toPrecision(3);
            }
        }
        return sizeText;

    },
    bytesAsText: function(bytes) {

        var sizePow = Math.log(bytes)/Math.log(fdmApp.bytesInKB) | 0;
        var sizeText = fdm.sizeUtils.getSizeText(bytes, sizePow);

		if (sizeText >= fdmApp.bytesInKB){
			sizeText = 1;
			sizePow++;
		}

        var units = fdm.fileUtils.unitNameByPow(sizePow);

        return sizeText + " " + units;
        // return __('%1 ' + units, sizeText);
    },
    bytesAsTextObj: function(bytes) {

        var sizePow = Math.log(bytes)/Math.log(fdmApp.bytesInKB) | 0;
        var sizeText = fdm.sizeUtils.getSizeText(bytes, sizePow);

		if (sizeText >= fdmApp.bytesInKB){
			sizeText = 1;
			sizePow++;
		}

        var units = fdm.fileUtils.unitNameByPow(sizePow);

        return {
			size: sizeText,
			units: units
		};
    },
	allBytesAsText: function(done, all) {

		var d = this.bytesAsTextObj(done);

		if (all < 0)
			return d.size + " " + d.units;

		var a = this.bytesAsTextObj(all);

		if (d.units == a.units && d.size == a.size)
			return d.size + " " + d.units;

		if (d.units == a.units)
			return __('%1 of %2', [d.size, a.size + " " + d.units]);
			// return __('%1 of %2', [d.size, __('%1 ' + d.units, a.size)]);

		return __('%1 of %2', [ d.size + " " + d.units, a.size + " " + a.units ]);
		// return __('%1 of %2', [ __('%1 ' + d.units, d.size) , __('%1 ' + a.units, a.size) ]);
    },
    byteProgressAsText: function(done, all){

		if (done == 0 && all < 0)
			return "0 B / \u2014";

		if (all < 0 || !all)
			all = 0;

		if (done == 0 && all == 0)
			return "0 B";

        var ln=Math.log, d = fdmApp.bytesInKB;
        var maxPow = ln(all)/ln(d)|0;
        var base = Math.pow(d, maxPow);
        //var resultDone = fdm.Math.round(done / base, 3);
        //var resultAll = fdm.Math.round(all / base, 3);
		var resultDone = parseFloat(fdm.sizeUtils.getSizeText(done, maxPow));
		var resultAll = parseFloat(fdm.sizeUtils.getSizeText(all, maxPow));

		if (resultAll >= d){
			maxPow++;
			base = Math.pow(d, maxPow);
			//resultDone = fdm.Math.round(done / base, 3);
			//resultAll = fdm.Math.round(all / base, 3);
			resultDone = parseFloat(fdm.sizeUtils.getSizeText(done, maxPow));
			resultAll = parseFloat(fdm.sizeUtils.getSizeText(all, maxPow));
		}

        var decimalPlaces = fdm.Math.decimalPlaces(resultAll, 3);
        var resultDoneText = "";
        if(resultDone == 0 || maxPow == 0){
            resultDoneText = resultDone + "";
        }
        else if(resultDone < 0.01){
            resultDoneText = "0";
        }
        else{
            resultDoneText = resultDone.toFixed(decimalPlaces)
        }

        var resultText = ((resultDone < resultAll) ? resultDoneText + " / " : "") +
            resultAll.toFixed(decimalPlaces) +
            " " + fdm.fileUtils.unitNameByPow(maxPow);
        // var resultText = ((resultDone < resultAll) ? resultDoneText + " / " : "") +
        //     __('%1 ' + fdm.fileUtils.unitNameByPow(maxPow), resultAll.toFixed(decimalPlaces));
        // If total size is unknown, then show downloaded bytes without total size.
        if (resultDone >= 0 && resultAll == 0)
        {
            maxPow = ln(done)/ln(d)|0;
            base = Math.pow(d, maxPow);
            resultDone = fdm.Math.round(done / base, 3);
            decimalPlaces = fdm.Math.decimalPlaces(resultDone, 3);

            resultDoneText = maxPow == 0 ? resultDone + "" : resultDone.toFixed(decimalPlaces);
            resultText = resultDoneText + " " +  fdm.fileUtils.unitNameByPow(maxPow) + " / \u2014";// \u2014 long dash code symbol
            // resultText = __("%1 " +  fdm.fileUtils.unitNameByPow(maxPow), resultDoneText) + " / \u2014";// \u2014 long dash code symbol
        }
        return resultText;
    }
};

fdm.urlUtils = {
	isValidTrtUrl: function(sUrl)
	{
		var nColonPosition = sUrl.indexOf(":");
		if (nColonPosition != 1 && nColonPosition != -1)
			return false;

		var sIllegalPathSymbols = "*?\"<>|";
		for (var i = 0; i < sIllegalPathSymbols.length; i++) {
			var sChar = sIllegalPathSymbols.substr(i, 1);
			if (sUrl.indexOf(sChar) != -1)
				return false;
		}
		return true;
		
	},
	
	// the method is got from tools.js as is
	getDownloadType: function(sUrl)
	{
		if (sUrl.length >= 7) {
			var sProtocol = sUrl.substr(0, 7);
			sProtocol = sProtocol.toUpperCase();
			if (sProtocol == "HTTP://")
				return fdm.models.DownloadType.Regular; // ordernary download
		}

		if (sUrl.length >= 8) {
			var sProtocol = sUrl.substr(0, 8);
			sProtocol = sProtocol.toUpperCase();
			if (sProtocol == "HTTPS://")
				return fdm.models.DownloadType.Regular; // ordernary download
		}

		if (sUrl.length >= 6) {
			var sProtocol = sUrl.substr(0, 6);
			sProtocol = sProtocol.toUpperCase();
			if (sProtocol == "FTP://")
				return fdm.models.DownloadType.Regular; // ordinary download
		}

		if (sUrl.length >= 7) {
			var sProtocol = sUrl.substr(0, 7);
			sProtocol = sProtocol.toUpperCase();
			if (sProtocol == "RTSP://" || sProtocol == "MMSH://" || sProtocol == "MMST://")
				return 2; // rtsp
		}

		if (sUrl.length >= 6) {
			var sProtocol = sUrl.substr(0, 6);
			sProtocol = sProtocol.toUpperCase();
			if (sProtocol == "MMS://")
				return 2; // mms
		}

		if (sUrl.length < 8)
			return -1;

		if (fdm.urlUtils.isMagnetLink(sUrl))
			return fdm.models.DownloadType.Trt; // Magnet

		var sExt = sUrl.substr(sUrl.length - 8, 8);
		sExt = sExt.toUpperCase();
		if (sExt == ".TORRENT")
		{
			if (fdm.urlUtils.isValidTrtUrl(sUrl))
				return fdm.models.DownloadType.Trt; // bitorrent
		}
		
		return -1;
	},

	isMagnetLink: function(sUrl) {
		if (sUrl == undefined) {
			return false;
		}
		if (sUrl.length >= 7) {
			var sProtocol = sUrl.substr(0, 7);
			sProtocol = sProtocol.toUpperCase();
			if (sProtocol == "MAGNET:")
				return true;
		}
		return false;
	},

	extractDomain: function(url) {
		if(!url){
			return undefined;
		}
		if(url.search(/^https?\:\/\//) != -1)
			url = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i, "");
		else
			url = url.match(/^([^\/?#]+)(?:[\/?#]|$)/i, "");
		return url[1];
	}
};

fdm.htmlUtils = {
	checkInterval:null,
	//setFocus: function(element, callback) {
	//	if (typeof element == "string")	{
	//		element = document.getElementById(element);
	//	}
     //   if (!element)
     //       return;
	//	if(this.checkInterval) {
	//		clearInterval(fdm.htmlUtils.checkInterval);
	//	}
	//	this.checkInterval = setInterval(function() {
	//		if (element.offsetWidth && element.offsetHeight
	//			&& document.activeElement && document.activeElement != element)
	//		{
	//			element.focus();
	//			ko.utils.triggerEvent(element, "focusin"); // For IE, which doesn't reliably fire "focus" or "blur" events synchronously
	//
	//			clearInterval(fdm.htmlUtils.checkInterval);
	//			this.checkInterval = null;
	//			if (typeof callback =="function"){
	//				callback();
	//			}
	//		}
	//	}, 10);
	//},
	//lostFocus: function() {
	//	if(this.checkInterval) {
	//		clearInterval(this.checkInterval);
	//		this.checkInterval = null;
	//	}
	//},
	_uniqueIdCounter: 0,
	uniqueId: function(el, prefix) {
		if(el.id != ""){
			return el.id;
		}
		if(!prefix || prefix === "") {
		   prefix = "uid";
		}
		el.id = prefix + "-" + fdm.htmlUtils._uniqueIdCounter++;
		return el.id;
	},
	setCaretPosition: function(ctrl, pos)
	{
		if(ctrl.setSelectionRange)
		{
			ctrl.focus();
			ctrl.setSelectionRange(pos,pos);
		}
		else if (ctrl.createTextRange) {
			var range = ctrl.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}
	}
};

fdm.domUtils = {
	initChangeEvent: function(element)
	{
		if ("createEvent" in document) {
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent("change", false, true);
			element.dispatchEvent(evt);
		}
		else
			element.fireEvent("onchange");
	}
};

fdm.DEBUG = (function(){
	// http://stackoverflow.com/q/18410119/749922
	var timestamp = function(){};
	timestamp.toString = function(){
		return "[" + (new Date).toLocaleTimeString("en-US", {hour12: false}) + "]";
	};

	var result = {
		// console log
		error: console.error.bind(console, '%s', timestamp),
		info: console.info.bind(console, '%s', timestamp),
		warn: console.warn.bind(console, '%s', timestamp),
		log: console.log.bind(console, '%s', timestamp),

		// log enter leave methods
		logInOutAll: function(obj){
			var funcs = [].slice.call(arguments, 1);
			if (funcs.length === 0) throw new Error("logInOut must be passed function names");
			_.each(funcs, function(f) { obj[f] = fdm.DEBUG.logInOut(f, obj); });
		},
		logInOut: function(funcName, obj){
			var func = obj[funcName];
			return _.wrap(func, function(func) {
				var args = [].slice.call(arguments, 1);
				console.log(funcName + "(%o) {", args);
				var time = new Date();
				var result = func.apply(obj, args);
				time = (new Date()) - time;
				console.log(" } // " + funcName + " has worked %o milliseconds.", time);
				return result;
			});

		}
	};
	return result;
})();