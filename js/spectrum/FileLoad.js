/*
* AJ Savino
*/
(function(){
	var _consts = {
		DRAG_LEAVE_TIMEOUT:2500
	};
	
	var _vars = {
		_initialLoadContainerClass:"",
		_dragLeaveTimeout:null
	};
	
	var _methods = {
		_init:function(){
			var btnLoad = document.getElementById("btnLoad");
			OOP.addEventListener(window, "dragenter", _methods._handler_window_dragEnter);
			OOP.addEventListener(window, "dragleave", _methods._handler_window_dragLeave);
			OOP.addEventListener(btnLoad, "dragenter", _methods._handler_btnLoad_dragEnter);
			OOP.addEventListener(btnLoad, "dragleave", _methods._handler_btnLoad_dragLeave);
			OOP.addEventListener(btnLoad, "drop", _methods._handler_btnLoad_drop);
			OOP.addEventListener(btnLoad, "change", _methods._handler_btnLoad_change);
			
			var btnLoadContainer = document.getElementById("btnLoadContainer");
			_vars._initialLoadContainerClass = btnLoadContainer.getAttribute("class") || "";
		},
		
		_handler_window_dragEnter:function(evt){
			var btnLoadContainer = document.getElementById("btnLoadContainer");
			var currentClass = btnLoadContainer.getAttribute("class");
			if (!/^drag/i.test(currentClass)){
				btnLoadContainer.setAttribute("class", "drag-begin");
			}
		},
		
		_handler_window_dragLeave:function(evt){
			if (_vars._dragLeaveTimeout){
				clearTimeout(_vars._dragLeaveTimeout);
				_vars._dragLeaveTimeout = null;
			}
			_vars._dragLeaveTimeout = setTimeout(function(){
				_vars._dragLeaveTimeout = null;
				var btnLoadContainer = document.getElementById("btnLoadContainer");
				btnLoadContainer.setAttribute("class", _vars._initialLoadContainerClass);
			}, _consts.DRAG_LEAVE_TIMEOUT);
		},
		
		_handler_btnLoad_dragEnter:function(evt){
			var btnLoadContainer = document.getElementById("btnLoadContainer");
			btnLoadContainer.setAttribute("class", "drag-over");
		},
		
		_handler_btnLoad_dragLeave:function(evt){
			var btnLoadContainer = document.getElementById("btnLoadContainer");
			btnLoadContainer.setAttribute("class", "drag-begin");
		},
		
		_handler_btnLoad_drop:function(evt){
			evt.preventDefault();
			evt.stopPropagation();
			
			var btnLoadContainer = document.getElementById("btnLoadContainer");
			btnLoadContainer.setAttribute("class", _vars._initialLoadContainerClass);
			
			_methods._loadFile(evt.dataTransfer.files[0]);
		},
		
		_handler_btnLoad_change:function(evt){
			_methods._loadFile(evt.target.files[0]);
		},
		
		_loadFile:function(file){
			var reader = new FileReader();
			reader.onload = function(evt){
				try {
					var fileContents = evt.target.result;
					//var frmObj = JSON.parse(fileContents);
				} catch (ex){
					_methods._logError(ex);
				}
			};
			console.log(file);
			//reader.readAsText(file, "UTF-8");
		}
	};
	
	_methods._init();
})();