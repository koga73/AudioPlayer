/*
* AudioPlayer v0.0.1 Copyright (c) 2016 AJ Savino
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
		ctx:null,
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
	};
	
	var _methods = {
		init:function(){
			if (!("AudioContext" in window)){
				throw new Error("Your browser does not support AudioContext");
			}
			var ctx = new AudioContext();
			
			var analyzer = ctx.createAnalyser();
			analyzer.connect(ctx.destination);
			_instance.analyzer = analyzer;
			
			var gain = ctx.createGain();
			gain.connect(analyzer);
			_instance.gain = gain;
			
			_instance.ctx = ctx;
			
			if (_instance.debug){
				console.log("AudioPlayer INITIALIZED");
			}
		},
		
		destroy:function(){
			_instance.buffer = null;
			
			_instance.stop(); //bufferSource
			
			_instance.gain = null;
			
			_instance.analyzer = null;
			
			if (_instance.ctx){
				_instance.ctx.close();
				_instance.ctx = null;
			}
			
			if (_instance.debug){
				console.log("AudioPlayer DESTROYED");
			}
		},
		
		src:function(value){ //Getter/Setter
			if (typeof value !== typeof undefined){
				_vars._src = value;
				_methods._load(_vars._src);
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
			return _instance.ctx.currentTime;
		},
		
		duration:function(){ //Getter
			return _instance.buffer.duration;
		},
		
		isReady:function(){ //Getter
			return _vars._isReady;
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
			var ctx = _instance.ctx;
			
			var bufferSource = ctx.createBufferSource();
			bufferSource.connect(_instance.gain);
			if (!bufferSource.start){ //Legacy
				bufferSource.start = bufferSource.noteOn;
				bufferSource.stop = bufferSource.noteOff;
			}
			bufferSource.onended = function(evt){
				if (_vars._isPlaying){ //Only fire complete if isPlaying (stop was not called)
					_vars._isPlaying = false;
					if (_instance.debug){
						console.log("EVENT_COMPLETE");
					}
					_instance.dispatchEvent(new OOP.Event(AudioPlayer.EVENT_COMPLETE));
				}
			};
			_instance.bufferSource = bufferSource;
			
			if (_instance.debug){
				console.log("PLAY: " + _vars._src +  " | startTime:" + startTime + " | loop:" + loop);
			}
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
			if (_instance.debug){
				console.log("PAUSE");
			}
			
			_vars._lastTime = _instance.currentTime();
			_instance.stop();
			_vars._isPaused = true;
		},
		
		stop:function(){
			if (!_vars._isPlaying){
				return;
			}
			if (_instance.debug){
				console.log("STOP");
			}
			_vars._isPlaying = false;
			_vars._isPaused = false;
			
			var bufferSource = _instance.bufferSource;
			bufferSource.stop();
			bufferSource.onended = null;
			bufferSource = null;
		},
		
		seek:function(time){
			if (_instance.debug){
				console.log("SEEK: " + time);
			}
			_instance.stop();
			if (_vars._isPaused){
				_vars._lastTime = time;
			} else {
				_instance.play(time);
			}
		},
		
		analyze(){
			throw new Error("TODO: Analyze");
		},
		
		mute:function(){
			if (_vars._isMuted){
				return;
			}
			if (_instance.debug){
				console.log("MUTE");
			}
			_vars._isMuted = true;
			_vars._lastVolume = _instance.volume();
			_instance.volume(0);
		},
		
		unmute:function(){
			if (!_vars._isMuted){
				return;
			}
			if (_instance.debug){
				console.log("UNMUTE");
			}
			_vars._isMuted = false;
			_instance.volume(_vars._lastVolume);
		},
		
		_load:function(src){
			_vars._isReady = false;
			_methods._ajax({
				url:src,
				responseType:"blob",
				onSuccess:function(response){
					if (_instance.debug){
						console.log("FILE LOADED: " + src);
					}
					var fr = new FileReader();
					fr.onload = function(evt){
						console.log("DECODING AUDIO: " + src);
						var fileBytes = evt.target.result;
						_instance.ctx.decodeAudioData(fileBytes, function(buffer){
							_instance.buffer = buffer;
							if (_instance.debug){
								console.log("AUDIO PROCESSED: " + src);
								console.log("EVENT_READY");
							}
							_vars._isReady = true;
							_instance.dispatchEvent(new OOP.Event(AudioPlayer.EVENT_READY));
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
		ctx:_vars.ctx,
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
		isReady:_methods.isReady,
		isPlaying:_methods.isPlaying,
		isPaused:_methods.isPaused,
		isMuted:_methods.isMuted,
		
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
OOP.Namespace("AudioPlayer.EVENT_READY", "ready");
OOP.Namespace("AudioPlayer.EVENT_COMPLETE", "complete");