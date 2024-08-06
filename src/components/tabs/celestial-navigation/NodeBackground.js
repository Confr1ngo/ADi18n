import { svgRingPath } from "./svg-ring-path.js";

export default {
  name: "NodeBackground",
  props: {
    position: {
      type: Object,
      required: true
    },
    ring: {
      type: Object,
      required: true
    },
    isStacked: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    ringBackgroundTransform() {
      return this.position.asTranslate();
    },
    ringBackgroundPath() {
      return svgRingPath(this.ring);
    },
    ringBackgroundFilter() {
      return this.isStacked ? "" : "url(#backgroundGlow)";
    },
  },
  template: `
  <path
    :transform="ringBackgroundTransform"
    :d="ringBackgroundPath"
    fill="rgba(0,0,0,0.75)"
    stroke="none"
    :filter="ringBackgroundFilter"
  />
  `
};