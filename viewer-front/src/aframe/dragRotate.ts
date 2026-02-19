import "aframe";

declare const AFRAME: any;

AFRAME.registerComponent("drag-rotate", {
  schema: {
    speed: { type: "number", default: 1.2 },
    limitY: { type: "boolean", default: true },
  },

  init: function () {
    const el = this.el as any;
    const canvas = el.sceneEl?.canvas as HTMLCanvasElement | null;

    let isDragging: boolean = false;
    let lastX: number = 0;
    let lastY: number = 0;

    if (!canvas) {
      el.sceneEl.addEventListener("render-target-loaded", () => {
        this.init();
      });
      return;
    }

    canvas.style.cursor = "grab";

    canvas.addEventListener("mousedown", (e: MouseEvent) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.style.cursor = "grabbing";
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
      canvas.style.cursor = "grab";
    });

    canvas.addEventListener("mousemove", (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;

      lastX = e.clientX;
      lastY = e.clientY;

      const rotation = el.getAttribute("rotation") as {
        x: number;
        y: number;
        z: number;
      };

      rotation.y += deltaX * this.data.speed;

      if (this.data.limitY) {
        rotation.x = Math.min(
          90,
          Math.max(-90, rotation.x + deltaY * this.data.speed),
        );
      } else {
        rotation.x += deltaY * this.data.speed;
      }

      el.setAttribute("rotation", rotation);
    });
  },
});
