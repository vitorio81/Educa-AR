import React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "a-scene": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "a-assets": any;
      "a-asset-item": any;
      "a-sky": any;
      "a-gltf-model": any;
      "a-camera": any;
      "a-cursor": any;
    }
  }
}
