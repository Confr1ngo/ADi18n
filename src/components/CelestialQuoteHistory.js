export default {
  name: "CelestialQuoteHistory",
  props: {
    celestial: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isShown: false
    };
  },
  computed: {
    color() {
      return this.celestial === "laitela" ? `var(--color-laitela--accent)` : `var(--color-${this.celestial}--base)`;
    },
    btnText() {
      return $t(`${this.celestial}_quotes`);
    }
  },
  methods: {
    update() {
      this.isShown = Celestials[this.celestial].quotes.all.some(x => x.isUnlocked);
    },
    show() {
      Quote.showHistory(Celestials[this.celestial].quotes.all);
    },
  },
  template: `
  <button
    v-if="isShown"
    class="c-celestial-quote-history--button"
    :style="{
      '--scoped-cel-color': color
    }"
    @click="show"
    data-v-celestial-quote-history
  >
    {{ btnText }}
  </button>
  `
};