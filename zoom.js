function zoomable(
  selector,
  option = {
    baseTranslateX: "0",
    baseTranslateY: "0",
    onZoom: () => {},
    scaleEleSelector: "",
    checkPanAvailable: () => true,
  }
) {
  var scale = 1,
    pointX = 0,
    pointY = 0,
    zoomEle = document.querySelector(selector),
    scaleEle = document.querySelector(option.scaleEleSelector || selector),
    panning = false;

  function setTransform() {
    if (option.onZoom) {
      option.onZoom(scale);
    }

    const translateX = `calc(${option.baseTranslateX} - ${pointX}px)`;
    const translateY = `calc(${option.baseTranslateY} - ${pointY}px)`;

    scaleEle.style.transform = `translate(${translateX}, ${translateY}) scale(${scale})`;
  }

  zoomEle.onmousedown = function (e) {
    if (option.checkPanAvailable()) {
      e.preventDefault();
      start = { x: e.clientX + pointX, y: e.clientY + pointY };
      panning = true;

      setTransform();
    }
  };

  zoomEle.onmouseup = function (e) {
    panning = false;
  };
  zoomEle.onmouseleave = function (e) {
    panning = false;
  };

  zoomEle.onmousemove = function (e) {
    if (option.checkPanAvailable()) {
      e.preventDefault();
      if (!panning) {
        return;
      }
      pointX = start.x - e.clientX;
      pointY = start.y - e.clientY;
      setTransform();
    }
  };

  zoomEle.onwheel = function (e) {
    e.preventDefault();

    const zoomEleRect = zoomEle.getBoundingClientRect();

    const isExpanding = e.deltaY > 0;

    const distX = isExpanding
      ? 0
      : zoomEleRect.left + zoomEleRect.width / 2 - e.pageX;
    const distY = isExpanding
      ? 0
      : zoomEleRect.top + zoomEleRect.height / 2 - e.pageY;

    var xs = (distX - pointX) / scale,
      ys = (distY - pointY) / scale,
      delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;

    delta > 0 ? (scale += 0.1) : (scale -= 0.1);

    if (scale < 0.6 || scale > 3) {
      return;
    }

    pointX = distX - xs * scale;
    pointY = distY - ys * scale;

    setTransform();
  };

  return {
    getScale: function () {
      return scale;
    },
    updateScale: function (value) {
      scale = value;
      setTransform();
    },
    clear: function () {
      scale = 1;
      pointX = 0;
      pointY = 0;
      setTransform();
    },
  };
}
