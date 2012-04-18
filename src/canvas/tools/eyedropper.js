/**
 * Eyedropper tool
 */
(function (TeledrawCanvas) {
	var ctor = function () {
		this.previewContainer = document.createElement('div');
		_.extend(this.previewContainer.style, {
			position: 'absolute',
			width: '10px',
			height: '10px',
			border: '1px solid black',
			display: 'none'
		});
		document.body.appendChild(this.previewContainer);
		if (this.canvas.state.mouseOver) {
			this.previewContainer.style.display = 'block';
		}
	};
	var EyeDropper = TeledrawCanvas.Tool.createTool("eyedropper", "crosshair", ctor);
	
	EyeDropper.prototype.pick = function (pt) {
		var previewContainer = this.previewContainer,
			lightness,
			left = this.canvas.element.offsetLeft,
			top = this.canvas.element.offsetTop,
			pixel = this.canvas.ctx().getImageData(pt.x,pt.y,1,1).data;
		this.color = TeledrawCanvas.util.rgba2rgb(Array.prototype.slice.call(pixel));
		var lightness = TeledrawCanvas.util.rgb2hsl(this.color)[2];
		_.extend(previewContainer.style, {
			left: (left + pt.xd + 15) + 'px', 
			top: (top + pt.yd + 5) + 'px',
			background: TeledrawCanvas.util.cssColor(this.color),
			'border-color': lightness >= 50 ? '#000' : '#888'
		});
		if (this.canvas.state.mouseOver) {
			// hack for chrome, since it seems to ignore this and not redraw for some reason...
			previewContainer.style.display='none';
			previewContainer.offsetHeight; // no need to store this anywhere, the reference is enough
			previewContainer.style.display='block';
		} else {
			previewContainer.style.display = 'none';
		}
	};

	EyeDropper.prototype.enter = function () {
		this.previewContainer.style.display = 'block';
	};
	
	EyeDropper.prototype.leave = function () {
		this.previewContainer.style.display = 'none';
	};
	
	EyeDropper.prototype.move = function (down, from, pt) {
		this.pick(pt);
	};
	
	EyeDropper.prototype.down = function (pt) {
		this.pick(pt);
	};
	
	EyeDropper.prototype.up = function (pt) {
	    this.pick(pt);
		this.canvas.setColor(this.color);
		this.previewContainer.parentNode.removeChild(this.previewContainer);
		this.canvas.previousTool();
	};
})(TeledrawCanvas);

