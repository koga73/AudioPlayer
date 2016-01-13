/*
* FileDrop v1.0.0 Copyright (c) 2016 AJ Savino
* https://github.com/koga73/FileDrag
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
if (!OOP){
	/*
	* OOP v1.0.1 Copyright (c) 2016 AJ Savino
	* https://github.com/koga73/OOP
	* MIT LICENSE
	*/
	var OOP=function(){var e={namespace:function(e,n){for(var t=e.split("."),r=t.length,a=window,v=0;r>v;v++){var i=t[v];a[i]=v==r-1?n:a[i]||{},a[i]._type=t.slice(0,v+1).join("."),a=a[i]}return n},extend:function(n,t){if("undefined"==typeof n)throw"Error base object is undefined";if(!e._isFunction(n))throw"Error base object must be a function";var r=new n;for(var a in r)"undefined"==typeof t[a]&&(t[a]=r[a]);var v=r;do v._interface=t,v=v._super;while("undefined"!=typeof v);return t._super=r,t},construct:function(n,t,r){var a=null;arguments&&arguments.callee&&arguments.callee.caller&&(a=arguments.callee.caller._type,n._type=a),n._isType=function(t){return e.isType(n,t)},n._interface=n;for(var v in t)e._isFunction(n[v])?n[v](t[v]):n[v]=t[v];return 1==r&&(n._eventHandlers||(n._eventHandlers={}),n.addEventListener||(n.addEventListener=e._addEventListener),n.removeEventListener||(n.removeEventListener=e._removeEventListener),n.dispatchEvent||(n.dispatchEvent=e._dispatchEvent)),n},event:function(e,n){var t=null;try{t=new CustomEvent(e)}catch(r){document.createEventObject?(t=document.createEventObject("Event"),t.initCustomEvent&&t.initCustomEvent(e,!0,!0)):t={}}return t._type=e,t._data=n,t},addEventListener:function(n,t,r){n._eventHandlers||(n._eventHandlers={}),t=t.split(",");for(var a=t.length,v=0;a>v;v++){var i=t[v];if(n.addEventListener)r=e._addEventHandler(n,i,r),n.addEventListener(i,r);else if(n.attachEvent){var d=function(){r(window.event)};d.handler=r,d=e._addEventHandler(n,i,d),n.attachEvent("on"+i,d)}else"undefined"!=typeof jQuery?(r=e._addEventHandler(n,i,r),jQuery.on(i,r)):(n.addEventListener=e._addEventListener,n.addEventListener(i,r))}},_addEventListener:function(n,t){t._isCustom=!0,e._addEventHandler(this,n,t)},_addEventHandler:function(e,n,t){e._eventHandlers[n]||(e._eventHandlers[n]=[]);for(var r=e._eventHandlers[n],a=r.length,v=0;a>v;v++){if(r[v]===t)return t;if(r[v].handler&&r[v].handler===t)return r[v]}return r.push(t),t},removeEventListener:function(n,t,r){n._eventHandlers||(n._eventHandlers={}),t=t.split(",");for(var a=t.length,v=0;a>v;v++){var i,d=t[v];i="undefined"==typeof r?n._eventHandlers[d]||[]:[r];for(var s=i.length,o=0;s>o;o++){var r=i[o];n.removeEventListener?(r=e._removeEventHandler(n,d,r),n.removeEventListener(d,r)):n.detachEvent?(r=e._removeEventHandler(n,d,r),n.detachEvent("on"+d,r)):"undefined"!=typeof jQuery?(r=e._removeEventHandler(n,d,r),jQuery.off(d,r)):(n.removeEventListener=e._removeEventListener,n.removeEventListener(d,r))}}},_removeEventListener:function(n,t){n=n.split(",");for(var r=n.length,a=0;r>a;a++){var v,i=n[a];v="undefined"==typeof t?this._eventHandlers[i]||[]:[t];for(var d=v.length,s=0;d>s;s++){var t=v[s];t._isCustom=!1,e._removeEventHandler(this,i,t)}}},_removeEventHandler:function(e,n,t){e._eventHandlers[n]||(e._eventHandlers[n]=[]);for(var r=e._eventHandlers[n],a=r.length,v=0;a>v;v++){if(r[v]===t)return r.splice(v,1)[0];if(r[v].handler&&r[v].handler===t)return r.splice(v,1)[0]}},dispatchEvent:function(n,t){n._eventHandlers||(n._eventHandlers={}),n.dispatchEvent?n.dispatchEvent(t):n.fireEvent?n.fireEvent("on"+type,t):"undefined"!=typeof jQuery?jQuery(n).trigger(jQuery.Event(t._type,{_type:t._type,_data:t._data})):(n.dispatchEvent=e._dispatchEvent,n.dispatchEvent(t))},_dispatchEvent:function(n){e._dispatchEventHandlers(this,n)},_dispatchEventHandlers:function(e,n){var t=e._eventHandlers[n._type];if(t)for(var r=t.length,a=0;r>a;a++)t[a](n)},isType:function(e,n){var t=e;do{if(t._type==n||t._type==n._type)return!0;t=t._super}while("undefined"!=typeof t);return!1},_isFunction:function(e){return e&&"[object Function]"==Object.prototype.toString.call(e)}};return{Namespace:e.namespace,Extend:e.extend,Construct:e.construct,Event:e.event,addEventListener:e.addEventListener,removeEventListener:e.removeEventListener,dispatchEvent:e.dispatchEvent,isType:e.isType}}();
}
OOP.Namespace("FileDrop", function(container){
	var _instance = null;
	
	var _consts = {
		DRAG_LEAVE_TIMEOUT:2500,
		
		CLASS_DRAG_BEGIN:"drag-begin",
		CLASS_DRAG_OVER:"drag-over"
	};
	
	var _vars = {
		container:container,
		
		_fileInput:null,
		_dragLeaveTimeout:null
	};
	
	var _methods = {
		init:function(){
			var container = _instance.container;
			if (!container){
				throw new Error("Container does not exist");
			}
			var fileInput = _instance.container.querySelector("input[type='file']");
			if (!fileInput){
				throw new Error("input[type='file'] not found in container");
			}
			_vars._fileInput = fileInput;
			
			OOP.addEventListener(window, "dragenter", _methods._handler_window_dragEnter);
			OOP.addEventListener(window, "dragleave", _methods._handler_window_dragLeave);
			
			OOP.addEventListener(fileInput, "dragenter", _methods._handler_fileInput_dragEnter);
			OOP.addEventListener(fileInput, "dragleave", _methods._handler_fileInput_dragLeave);
			OOP.addEventListener(fileInput, "drop", _methods._handler_fileInput_drop);
			OOP.addEventListener(fileInput, "change", _methods._handler_fileInput_change);
		},
		
		destroy:function(){
			var dragLeaveTimeout = _vars._dragLeaveTimeout;
			if (dragLeaveTimeout){
				clearTimeout(dragLeaveTimeout);
				_vars._dragLeaveTimeout = null;
			}
			
			var fileInput = _vars._fileInput;
			if (fileInput){
				OOP.removeEventListener(fileInput, "dragenter", _methods._handler_fileInput_dragEnter);
				OOP.removeEventListener(fileInput, "dragleave", _methods._handler_fileInput_dragLeave);
				OOP.removeEventListener(fileInput, "drop", _methods._handler_fileInput_drop);
				OOP.removeEventListener(fileInput, "change", _methods._handler_fileInput_change);
				_vars._fileInput = null;
			}
			
			var container = _instance.container;
			if (container){
				ClassHelper.removeClass(container, _consts.CLASS_DRAG_BEGIN + " " + _consts.CLASS_DRAG_OVER);
			}
			
			OOP.removeEventListener(window, "dragenter", _methods._handler_window_dragEnter);
			OOP.removeEventListener(window, "dragleave", _methods._handler_window_dragLeave);
		},
		
		_handler_window_dragEnter:function(evt){
			ClassHelper.addClass(_instance.container, _consts.CLASS_DRAG_BEGIN);
		},
		
		_handler_window_dragLeave:function(evt){
			if (_vars._dragLeaveTimeout){
				clearTimeout(_vars._dragLeaveTimeout);
				_vars._dragLeaveTimeout = null;
			}
			_vars._dragLeaveTimeout = setTimeout(function(){
				_vars._dragLeaveTimeout = null;
				ClassHelper.removeClass(_instance.container, _consts.CLASS_DRAG_BEGIN + " " + _consts.CLASS_DRAG_OVER);
			}, _consts.DRAG_LEAVE_TIMEOUT);
		},
		
		_handler_fileInput_dragEnter:function(evt){
			ClassHelper.addClass(_instance.container, _consts.CLASS_DRAG_OVER);
		},
		
		_handler_fileInput_dragLeave:function(evt){
			ClassHelper.removeClass(_instance.container, _consts.CLASS_DRAG_OVER);
		},
		
		_handler_fileInput_drop:function(evt){
			evt.preventDefault();
			evt.stopPropagation();
			
			ClassHelper.removeClass(_instance.container, _consts.CLASS_DRAG_BEGIN + " " + _consts.CLASS_DRAG_OVER);
			
			_methods._gotFile(evt.dataTransfer.files[0]);
		},
		
		_handler_fileInput_change:function(evt){
			_methods._gotFile(evt.target.files[0]);
		},
		
		_gotFile:function(file){
			_instance.dispatchEvent(new OOP.Event(FileDrop.EVENT_FILE, file));
		}
	};
	
	var ClassHelper = (function(){
		//Trim shim
		if (typeof String.prototype.trim !== 'function'){
			String.prototype.trim = function(){
				return this.replace(/^\s+|\s+$/g, ''); 
			}
		}
		
		return {
			addClass:function(element, classes){
				var elementClasses = (element.getAttribute("class") || "").split(" ");
				classes = classes.split(" ");
				for (var className in classes){
					var elementClassesLen = elementClasses.length;
					for (var i = 0; i < elementClassesLen; i++){
						if (elementClasses[i] == classes[className].trim()){
							break;
						}
					}
					if (i == elementClassesLen){
						elementClasses.push(classes[className].trim());
					}
				}
				element.setAttribute("class", elementClasses.join(" ").trim());
			},
			
			removeClass:function(element, classes){
				var elementClasses = (element.getAttribute("class") || "").split(" ");
				classes = classes.split(" ");
				for (var className in classes){
					var elementClassesLen = elementClasses.length;
					for (var i = 0; i < elementClassesLen; i++){
						if (elementClasses[i] == classes[className].trim()){
							elementClasses.splice(i, 1);
							elementClassesLen--;
							i--;
						}
					}
				}
				element.setAttribute("class", elementClasses.join(" ").trim());
			},
			
			hasClass:function(element, classes){
				var elementClasses = (element.getAttribute("class") || "").split(" ");
				classes = classes.split(" ");
				var hasCount = 0;
				for (var className in classes){
					var elementClassesLen = elementClasses.length;
					for (var i = 0; i < elementClassesLen; i++){
						if (elementClasses[i] == classes[className].trim()){
							hasCount++;
							break;
						}
					}
				}
				if (hasCount == classes.length){
					return true;
				} else {
					return false
				}
			}
		};
	})();
	
	_instance = OOP.Construct({
		container:_vars.container,
		
		init:_methods.init,
		destroy:_methods.destroy
	}, null, true);
	_instance.init();
	return _instance;
});
OOP.Namespace("FileDrop.EVENT_FILE", "file");