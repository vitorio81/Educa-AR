AFRAME.registerComponent("drag-rotate", {
  schema: {
    speed: { type: "number", default: 1.2 },
    limitY: { type: "boolean", default: true },
  },

  init: function () {
    const el = this.el;
    const canvas = el.sceneEl.canvas;
    let isDragging = false;
    let lastX, lastY;

    if (!canvas) {
      el.sceneEl.addEventListener("render-target-loaded", () => {
        this.init();
      });
      return;
    }

    canvas.style.cursor = "grab";

    canvas.addEventListener("mousedown", (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.style.cursor = "grabbing";
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
      canvas.style.cursor = "grab";
    });

    canvas.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      const rotation = el.getAttribute("rotation");

      rotation.y += deltaX * this.data.speed;

      if (this.data.limitY) {
        rotation.x = Math.min(
          90,
          Math.max(-90, rotation.x + deltaY * this.data.speed)
        );
      } else {
        rotation.x += deltaY * this.data.speed;
      }

      el.setAttribute("rotation", rotation);
    });
  },
});
