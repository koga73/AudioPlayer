/*
* Copyright (c) 2016 AJ Savino
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
var Spectrum = (function(){
	var _instance = null;
	
	var _consts = {
		FTT_SIZE:256,	//Number of spectrum channels is half this number
		BAR_SPACING:2,	//Pixels between bars
		CLEAR_ALPHA:0.1,
		DRAW_ALPHA:1.0,
		BLUR_ALPHA:0.25,
		BLUR_LOOPS:1,
		OUTER_COLOR:"#00F",
		INNER_COLOR:"#0FF"
	};
	
	var _vars = {
		player:null,
		
		_gfx:null,
		_gradient:null,
		
		_canvasWidth:0,
		_canvasHeight:0,
		_center:[0,0],
		_stepX:0,
		_barWidth:0,
		_blurOffset:0
	};
	
	var _methods = {
		init:function(){
			var player = new AudioPlayer({
				src:"mp3/workwork.mp3",
				debug:true
			});
			OOP.addEventListener(player, AudioPlayer.EVENT_STATE_CHANGE, _methods._handler_player_stateChange);
			_instance.player = player;
			
			_vars._gfx = new GFXRenderer({
				canvas:document.getElementById("canvas"),
				onRender:_methods._handler_render,
				onResize:_methods._handler_resize,
				paused:true
			});
		},
		
		_handler_player_stateChange:function(evt){
			switch (evt._data){
				case AudioPlayer.STATES.READY:
					var player = _instance.player;
					player.analyzer.fftSize = _consts.FTT_SIZE;
					player.play();
					
					_methods._handler_resize();
					_vars._gfx.paused = false;
					break;
			}
		},
		
		_handler_render:function(delta){
			var data = _instance.player.analyze();
			var dataLen = data.length;
			
			var gfx = _vars._gfx;
			var context = gfx.context;
			var canvas = gfx.canvas;
			var canvasWidth = _vars._canvasWidth;
			var canvasHeight = _vars._canvasHeight;
			var center = _vars._center;
			var stepX = _vars._stepX;
			var barWidth = _vars._barWidth;
			var blurOffset = _vars._blurOffset;
			
			//Clear
			context.globalAlpha = _consts.CLEAR_ALPHA;
			context.fillStyle = "#000";
			context.fillRect(0, 0, canvasWidth, canvasHeight);
			
			//Blur
			context.globalAlpha = _consts.BLUR_ALPHA;
			for (var i = 0; i < _consts.BLUR_LOOPS; i++){
				context.drawImage(canvas, blurOffset, 0, canvasWidth - blurOffset, canvasHeight, 0, 0, canvasWidth - blurOffset, canvasHeight);
				context.drawImage(canvas, 0, 0, canvasWidth - blurOffset, canvasHeight, blurOffset, 0, canvasWidth - blurOffset, canvasHeight);
				context.drawImage(canvas, 0, blurOffset, canvasWidth, canvasHeight - blurOffset, 0, 0, canvasWidth, canvasHeight - blurOffset);
				context.drawImage(canvas, 0, 0, canvasWidth, canvasHeight - blurOffset, 0, blurOffset, canvasWidth, canvasHeight - blurOffset);
			}
			
			//Draw
			context.globalAlpha = _consts.DRAW_ALPHA;
			context.fillStyle = _vars._gradient;
			for (var i = 0; i < dataLen; i++){
				var x = i * stepX;
				var y = center[1] * (data[i] / 0xFF);
				context.fillRect(x, center[1] - 1, barWidth, y);
				context.fillRect(x, center[1] + 1, barWidth, -y);
			}
		},
		
		_handler_resize:function(evt){
			var dataLen = _consts.FTT_SIZE >> 1;
			var canvas = _vars._gfx.canvas;
			var canvasWidth = canvas.width;
			var canvasHeight = canvas.height;
			var stepX = canvasWidth / dataLen + _consts.BAR_SPACING >> 0 || 1;
			var barWidth = Math.ceil((canvasWidth - stepX) / dataLen) - _consts.BAR_SPACING || 1;
			
			_vars._canvasWidth = canvasWidth;
			_vars._canvasHeight = canvasHeight;
			_vars._center = [canvasWidth * 0.5, canvasHeight * 0.5];
			_vars._stepX = stepX;
			_vars._barWidth = barWidth;
			_vars._blurOffset = barWidth << 1;
			
			_methods._generateGradient();
		},
		
		_generateGradient:function(){
			var gradient = _vars._gfx.context.createLinearGradient(0, 0, 0, _vars._canvasHeight);
			gradient.addColorStop(0, _consts.OUTER_COLOR);
			gradient.addColorStop(0.5, _consts.INNER_COLOR);
			gradient.addColorStop(1, _consts.OUTER_COLOR);
			_vars._gradient = gradient;
		}/*,
		
		//Pulled from StackOverflow
		_decimalToHex:function(decimal, chars){
			return (decimal + Math.pow(16, chars)).toString(16).slice(-chars).toUpperCase();
		}*/
	};
	
	_instance = {
		player:_vars.player,
		
		init:_methods.init
	};
	_instance.init();
	return _instance;
})();