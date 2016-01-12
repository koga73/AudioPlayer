/*
* OOP v1.0.1 Copyright (c) 2016 AJ Savino
* https://github.com/koga73/OOP
* MIT LICENSE
*/
var OOP=function(){var e={namespace:function(e,n){for(var t=e.split("."),r=t.length,a=window,v=0;r>v;v++){var i=t[v];a[i]=v==r-1?n:a[i]||{},a[i]._type=t.slice(0,v+1).join("."),a=a[i]}return n},extend:function(n,t){if("undefined"==typeof n)throw"Error base object is undefined";if(!e._isFunction(n))throw"Error base object must be a function";var r=new n;for(var a in r)"undefined"==typeof t[a]&&(t[a]=r[a]);var v=r;do v._interface=t,v=v._super;while("undefined"!=typeof v);return t._super=r,t},construct:function(n,t,r){var a=null;arguments&&arguments.callee&&arguments.callee.caller&&(a=arguments.callee.caller._type,n._type=a),n._isType=function(t){return e.isType(n,t)},n._interface=n;for(var v in t)e._isFunction(n[v])?n[v](t[v]):n[v]=t[v];return 1==r&&(n._eventHandlers||(n._eventHandlers={}),n.addEventListener||(n.addEventListener=e._addEventListener),n.removeEventListener||(n.removeEventListener=e._removeEventListener),n.dispatchEvent||(n.dispatchEvent=e._dispatchEvent)),n},event:function(e,n){var t=null;try{t=new CustomEvent(e)}catch(r){document.createEventObject?(t=document.createEventObject("Event"),t.initCustomEvent&&t.initCustomEvent(e,!0,!0)):t={}}return t._type=e,t._data=n,t},addEventListener:function(n,t,r){n._eventHandlers||(n._eventHandlers={}),t=t.split(",");for(var a=t.length,v=0;a>v;v++){var i=t[v];if(n.addEventListener)r=e._addEventHandler(n,i,r),n.addEventListener(i,r);else if(n.attachEvent){var d=function(){r(window.event)};d.handler=r,d=e._addEventHandler(n,i,d),n.attachEvent("on"+i,d)}else"undefined"!=typeof jQuery?(r=e._addEventHandler(n,i,r),jQuery.on(i,r)):(n.addEventListener=e._addEventListener,n.addEventListener(i,r))}},_addEventListener:function(n,t){t._isCustom=!0,e._addEventHandler(this,n,t)},_addEventHandler:function(e,n,t){e._eventHandlers[n]||(e._eventHandlers[n]=[]);for(var r=e._eventHandlers[n],a=r.length,v=0;a>v;v++){if(r[v]===t)return t;if(r[v].handler&&r[v].handler===t)return r[v]}return r.push(t),t},removeEventListener:function(n,t,r){n._eventHandlers||(n._eventHandlers={}),t=t.split(",");for(var a=t.length,v=0;a>v;v++){var i,d=t[v];i="undefined"==typeof r?n._eventHandlers[d]||[]:[r];for(var s=i.length,o=0;s>o;o++){var r=i[o];n.removeEventListener?(r=e._removeEventHandler(n,d,r),n.removeEventListener(d,r)):n.detachEvent?(r=e._removeEventHandler(n,d,r),n.detachEvent("on"+d,r)):"undefined"!=typeof jQuery?(r=e._removeEventHandler(n,d,r),jQuery.off(d,r)):(n.removeEventListener=e._removeEventListener,n.removeEventListener(d,r))}}},_removeEventListener:function(n,t){n=n.split(",");for(var r=n.length,a=0;r>a;a++){var v,i=n[a];v="undefined"==typeof t?this._eventHandlers[i]||[]:[t];for(var d=v.length,s=0;d>s;s++){var t=v[s];t._isCustom=!1,e._removeEventHandler(this,i,t)}}},_removeEventHandler:function(e,n,t){e._eventHandlers[n]||(e._eventHandlers[n]=[]);for(var r=e._eventHandlers[n],a=r.length,v=0;a>v;v++){if(r[v]===t)return r.splice(v,1)[0];if(r[v].handler&&r[v].handler===t)return r.splice(v,1)[0]}},dispatchEvent:function(n,t){n._eventHandlers||(n._eventHandlers={}),n.dispatchEvent?n.dispatchEvent(t):n.fireEvent?n.fireEvent("on"+type,t):"undefined"!=typeof jQuery?jQuery(n).trigger(jQuery.Event(t._type,{_type:t._type,_data:t._data})):(n.dispatchEvent=e._dispatchEvent,n.dispatchEvent(t))},_dispatchEvent:function(n){e._dispatchEventHandlers(this,n)},_dispatchEventHandlers:function(e,n){var t=e._eventHandlers[n._type];if(t)for(var r=t.length,a=0;r>a;a++)t[a](n)},isType:function(e,n){var t=e;do{if(t._type==n||t._type==n._type)return!0;t=t._super}while("undefined"!=typeof t);return!1},_isFunction:function(e){return e&&"[object Function]"==Object.prototype.toString.call(e)}};return{Namespace:e.namespace,Extend:e.extend,Construct:e.construct,Event:e.event,addEventListener:e.addEventListener,removeEventListener:e.removeEventListener,dispatchEvent:e.dispatchEvent,isType:e.isType}}();
/*
* AudioPlayer v0.0.3 Copyright (c) 2016 AJ Savino
* https://github.com/koga73/AudioPlayer
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/
OOP.Namespace("AudioPlayer", function(params){
	var _instance = null;
	
	var _vars = {
		context:null,
		analyzer:null,
		gain:null,
		bufferSource:null,
		buffer:null,
		
		debug:false,
		autoPlay:false,
		autoLoop:false,
		
		_src:null,
		_volume:1,
		_isReady:false,
		_isPlaying:false,
		_isPaused:false,
		_isMuted:false,
		_lastVolume:-1,
		_lastTime:-1,
		_state:null,
	};
	
	var _methods = {
		init:function(){
			if (!("AudioContext" in window)){
				throw new Error("Your browser does not support AudioContext");
			}
			var context = new AudioContext();
			
			var analyzer = context.createAnalyser();
			analyzer.connect(context.destination);
			_instance.analyzer = analyzer;
			
			var gain = context.createGain();
			gain.connect(analyzer);
			_instance.gain = gain;
			
			_instance.context = context;
			
			_methods._stateChange(AudioPlayer.STATES.IDLE);
			if (_vars._src){
				_methods._load(_vars._src);
			}
		},
		
		destroy:function(){
			_instance.buffer = null;
			
			_instance.stop(); //bufferSource
			
			_instance.gain = null;
			
			_instance.analyzer = null;
			
			if (_instance.context){
				_instance.context.close();
				_instance.context = null;
			}
			
			_methods._stateChange(null);
		},
		
		src:function(value){ //Getter/Setter
			if (typeof value !== typeof undefined){
				_vars._src = value;
				if (_vars._state){
					_methods._load(_vars._src);
				}
			}
			return _vars._src;
		},
		
		volume:function(value){ //Getter/Setter
			if (typeof value !== typeof undefined){
				_vars._volume = value;
				_instance.gain.gain.value = _vars._volume;
			}
			return _vars._volume;
		},
		
		currentTime:function(){ //Getter
			return _instance.context.currentTime;
		},
		
		duration:function(){ //Getter
			return _instance.buffer.duration;
		},
		
		isPlaying:function(){ //Getter
			return _vars._isPlaying;
		},
		
		isPaused:function(){ //Getter
			return _vars._isPaused;
		},
		
		isMuted:function(){ //Getter
			return _vars._isMuted;
		},
		
		state:function(){ //Getter
			return _vars._state;
		},
		
		play:function(startTime, loop){
			if (typeof startTime === typeof undefined){
				if (_vars._isPaused){
					startTime = _vars._lastTime;
				} else {
					startTime = 0;
				}
			}
			loop = loop === true;
			
			if (_vars._isPlaying){
				return;
			}
			if (_vars._isPaused){
				_vars._isPaused = false;
				_instance.stop();
			}
			_vars._isPlaying = true;
			var context = _instance.context;
			
			//Re-create bufferSource because ".buffer" cannot be reassigned
			var bufferSource = context.createBufferSource();
			bufferSource.connect(_instance.gain);
			if (!bufferSource.start){ //Legacy
				bufferSource.start = bufferSource.noteOn;
				bufferSource.stop = bufferSource.noteOff;
			}
			bufferSource.onended = function(evt){
				if (_vars._isPlaying){ //Only fire complete if isPlaying (stop was not called)
					_vars._isPlaying = false;
					_methods._stateChange(AudioPlayer.STATES.COMPLETE);
				}
			};
			_instance.bufferSource = bufferSource;
			
			_methods._log("PLAY: " + _vars._src +  " | startTime:" + startTime + " | loop:" + loop, "#0080FF");
			_methods._stateChange(AudioPlayer.STATES.PLAYING);
			
			bufferSource.buffer = _instance.buffer;
			bufferSource.loop = loop;
			bufferSource.start(0, startTime);
		},
		
		pause:function(){
			if (!_vars._isPlaying){
				return;
			}
			if (_vars._isPaused){
				return;
			}
			_methods._stateChange(AudioPlayer.STATES.PAUSED);
			
			_vars._lastTime = _instance.currentTime();
			_instance.stop();
			_vars._isPaused = true;
		},
		
		stop:function(){
			if (!_vars._isPlaying){
				return;
			}
			_methods._stateChange(AudioPlayer.STATES.STOPPED);
			
			_vars._isPlaying = false;
			_vars._isPaused = false;
			
			var bufferSource = _instance.bufferSource;
			bufferSource.stop();
			bufferSource.onended = null;
			bufferSource = null;
		},
		
		seek:function(time){
			_methods._log("SEEK: " + time, "#0080FF");
			
			_instance.stop();
			if (_vars._isPaused){
				_vars._lastTime = time;
			} else {
				_instance.play(time);
			}
		},
		
		//Returns an array half the size of analyzer.fttSize
		//Each index contains an unsigned int between 0-255
		analyze(){
			var analyzer = _instance.analyzer;
			var data = new Uint8Array(analyzer.frequencyBinCount);
			analyzer.getByteFrequencyData(data);
			return data;
		},
		
		mute:function(){
			if (_vars._isMuted){
				return;
			}
			_methods._log("MUTE", "#0080FF");
			
			_vars._isMuted = true;
			_vars._lastVolume = _instance.volume();
			_instance.volume(0);
		},
		
		unmute:function(){
			if (!_vars._isMuted){
				return;
			}
			_methods._log("UNMUTE", "#0080FF");
			
			_vars._isMuted = false;
			_instance.volume(_vars._lastVolume);
		},
		
		_stateChange:function(toState){
			_methods._log("EVENT_STATE_CHANGE: " + toState, "#FF8000");
			
			_vars._state = toState;
			_instance.dispatchEvent(new OOP.Event(AudioPlayer.EVENT_STATE_CHANGE, _vars._state));
		},
		
		_log:function(message, color){
			if (_instance.debug){
				console.log("%c" + message, "color:" + color + ";");
			}
		},
		
		_load:function(src){
			_vars._isReady = false;
			_methods._stateChange(AudioPlayer.STATES.LOADING);
			_methods._ajax({
				url:src,
				responseType:"blob",
				onSuccess:function(response){
					_methods._log("FILE LOADED: " + src, "#0080FF");
					_methods._stateChange(AudioPlayer.STATES.PROCESSING);
					
					var fr = new FileReader();
					fr.onload = function(evt){
						_methods._log("DECODING AUDIO: " + src, "#0080FF");
						
						var fileBytes = evt.target.result;
						_instance.context.decodeAudioData(fileBytes, function(buffer){
							_instance.buffer = buffer;
							_vars._isReady = true;
							
							_methods._log("AUDIO PROCESSED: " + src, "#0080FF");
							_methods._stateChange(AudioPlayer.STATES.READY);
							
							if (_instance.autoPlay){
								_instance.play(0, _instance.autoLoop);
							}
						});
					};
					fr.readAsArrayBuffer(response);
				}
			});
		},
		
		_ajax:function(inputParams){
			var params = {
				url:null,
				onSuccess:null,
				onError:null,
				verb:"GET",
				data:null,
				contentType:null,
				responseType:null
			};
			for (var param in inputParams){
				params[param] = inputParams[param];
			}
			
			var request;
			try { //Non-IE
				request = new XMLHttpRequest();
			} catch (ex){ //IE
				request = new ActiveXObject("Microsoft.XMLHTTP");
			}
			var onerror = function(){
				if (params.onError){
					params.onError({
						params:params,
						status:request.status
					});
				} else {
					throw new Error("Request for '" + params.url + "' returned a " + request.status);
				}
			};
			request.onload = function(){
				if (request.status >= 200 && request.status < 400){
					params.onSuccess(request.response);
				} else {
					onerror();
				}
			};
			request.onerror = onerror;
			request.open(params.verb, params.url, true);
			if (params.contentType){
				request.setRequestHeader("Content-type", params.contentType);
				request.setRequestHeader("Accept", params.contentType);
			}
			if (params.responseType){
				request.responseType = params.responseType;
			}
			if (params.data){
				request.send(data);
			} else {
				request.send();
			}
		}
	};
	
	_instance = OOP.Construct({
		context:_vars.context,
		buffer:_vars.buffer,
		bufferSource:_vars.bufferSource,
		analyzer:_vars.analyzer,
		gain:_vars.gain,
		
		debug:_vars.debug,					//Boolean
		autoPlay:_vars.autoPlay,			//Boolean
		autoLoop:_vars.autoLoop,			//Boolean
		
		src:_methods.src,					//String
		autoPlay:_methods.autoPlay,			//Boolean
		volume:_methods.volume,				//0-1
		currentTime:_methods.currentTime,
		duration:_methods.duration,
		isPlaying:_methods.isPlaying,
		isPaused:_methods.isPaused,
		isMuted:_methods.isMuted,
		state:_methods.state,
		
		init:_methods.init,
		destroy:_methods.destroy,
		play:_methods.play,
		pause:_methods.pause,
		stop:_methods.stop,
		seek:_methods.seek,
		analyze:_methods.analyze,
		mute:_methods.mute,
		unmute:_methods.unmute
	}, params, true);
	_instance.init();
	return _instance;
});
OOP.Namespace("AudioPlayer.EVENT_STATE_CHANGE", "change");
OOP.Namespace("AudioPlayer.STATES", {
	IDLE:"idle",
	LOADING:"loading",
	PROCESSING:"processing",
	READY:"ready",
	PLAYING:"playing",
	PAUSED:"paused",
	STOPPED:"stopped",
	COMPLETE:"complete"
});