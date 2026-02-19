import "aframe";

declare const AFRAME: any;

AFRAME.registerComponent("zoom-scale", {
  schema: {
    zoomSpeed: { type: "number", default: 0.2 },
    minScale: { type: "number", default: 0.05 },
    maxScale: { type: "number", default: 2.0 },
  },

  init: function () {
    const el = this.el as any;
    const data = this.data;

    const setupZoom = () => {
      const canvas = el.sceneEl?.canvas as HTMLCanvasElement | undefined;

      if (!canvas) return;

      canvas.addEventListener("wheel", (e: WheelEvent) => {
        e.preventDefault();

        const scale = el.getAttribute("scale") as {
          x: number;
          y: number;
          z: number;
        };

        let newScale = scale.x - e.deltaY * 0.001 * data.zoomSpeed;

        newScale = Math.max(data.minScale, Math.min(data.maxScale, newScale));

        el.setAttribute("scale", {
          x: newScale,
          y: newScale,
          z: newScale,
        });
      });
    };

    // Garante que o canvas existe
    if (!el.sceneEl?.canvas) {
      el.sceneEl.addEventListener("render-target-loaded", setupZoom);
    } else {
      setupZoom();
    }
  },
});
