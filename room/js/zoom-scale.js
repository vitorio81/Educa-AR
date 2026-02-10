AFRAME.registerComponent("zoom-scale", {
  schema: {
    zoomSpeed: { type: "number", default: 0.2 }, 
    minScale: { type: "number", default: 0.05 }, 
    maxScale: { type: "number", default: 2.0 }, // 
  },

  init: function () {
    const el = this.el;
    const canvas = el.sceneEl.canvas;

    if (!canvas) {
      el.sceneEl.addEventListener("render-target-loaded", () => {
        this.init();
      });
      return;
    }

    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();

      const scale = el.getAttribute("scale").x;

      let newScale = scale - e.deltaY * 0.001 * this.data.zoomSpeed;

      newScale = Math.max(
        this.data.minScale,
        Math.min(this.data.maxScale, newScale)
      );

      el.setAttribute("scale", { x: newScale, y: newScale, z: newScale });
    });
  },
});
