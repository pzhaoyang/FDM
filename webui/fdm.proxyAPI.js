fdm.ProxyAPI = {
	wrap: function(target, source, prop) {
		var rawApi = source[prop];
		target[prop] = {_rawApi: rawApi};
		this.wrapProperties(target[prop], rawApi, prop);
	},

	wrapProperties: function(target, source, sourceName){
		// reflect all original properties as getter proxies
		for (var prop in source){
			if (source.hasOwnProperty(prop)/* && !_.isFunction(source[prop])*/){
				var sourceProp = source[prop];
				if(Array.isArray(sourceProp)){
					Object.defineProperty(target, prop, {
						get: _.bind(function (sourceName, rawProp){
							//console.log(sourceName + "." + rawProp);
							return this._rawApi[rawProp];
						}, target, sourceName, prop),
						set: _.bind(function (sourceName, rawProp, value){
							console.log(sourceName + "." + rawProp + "=%o", value);
							this._rawApi[rawProp] = value;
						}, target, sourceName, prop),
						enumerable: true
					});
				}
				else if(typeof(sourceProp) === 'object'){
				//console.log("wrap skip:" + sourceName + "." + prop );
					target[prop] = {_rawApi: source[prop]};
					this.wrapProperties(target[prop], source[prop], sourceName + "." + prop);
				}
				else if(_.isFunction(sourceProp) && !/^on[A-Z]/.test(prop) /* skip event func */){
					target["raw-"+prop] = sourceProp;
					target[prop] = _.partial(_.bind(function (sourceName, rawProp){
							//console.log(sourceName + "." + rawProp);
							var rawArgs = Array.prototype.slice.call(arguments, 2);
							var result = this["raw-"+rawProp].apply(this._rawApi, rawArgs);
							return result;
						}, target), sourceName, prop);
				}
				else{
					var sourcePropConf = Object.getOwnPropertyDescriptor(source, prop);
//console.log("descriptor: %o=%o, isFunction=%o", prop, sourcePropConf, _.isFunction(sourcePropConf.get));
					if(_.isFunction(sourcePropConf.get)){
						target["raw-"+prop+"-get"] = sourcePropConf.get;
					}
					else if(_.isFunction(source.__lookupGetter__)){
						var getter =  source.__lookupGetter__(prop);
console.log("__lookupGetter__: %o=%o", prop, getter);
						if(_.isFunction(getter)){
							target["raw-"+prop+"-get"] = getter;
						}
					}
					Object.defineProperty(target, prop, {
						get: _.bind(function (sourceName, rawProp){
							//console.log(sourceName + "." + rawProp);
							if(_.isFunction(this["raw-"+prop+"-get"])){
							console.log("apply: " + sourceName + "." + rawProp);
								return this["raw-"+prop+"-get"].apply(this._rawApi);
							}
							return this._rawApi[rawProp];
						}, target, sourceName, prop),
						set: _.bind(function (sourceName, rawProp, value){
							console.log(sourceName + "." + rawProp + "=%o", value);
							this._rawApi[rawProp] = value;
						}, target, sourceName, prop),
						enumerable: true
					});
				}
			}
		}
	}
};

//function loopDownloadItems(loopCount){
//	var dlds = window.app.controllers.downloads;
//	var rawItemCache = dlds._rawItemCache;
//
////	window.fdmApp.downloads
//	loopCount = loopCount || 1000;
//	for(var j = 0; j < loopCount; j++) {
//		for(var i = 0, l = rawItemCache.length; i < l; i++) {
//			var rawModel = dlds.rawItemToModel(rawItemCache[i].rawItem, false);
//		}
//	}
//}