import SelectedEffectToggle from "./SelectedEffectToggle.js";

export default {
  name: "AutoSacrificeEffectTab",
  components: {
    SelectedEffectToggle
  },
  props: {
    glyphType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      effectCount: 0,
    };
  },
  computed: {
    typeConfig() {
      return GlyphTypes[this.glyphType];
    },
    autoSacrificeSettings() {
      return AutoGlyphProcessor.types[this.glyphType];
    },
    effects() {
      return this.typeConfig.effects;
    },
    descStyle() {
      return {
        "color": GlyphAppearanceHandler.getBorderColor(this.glyphType),
        "border-color": this.typeConfig.color
      };
    },
    questionmarkTooltip() {
      return `Glyph score is rarity, minus ${formatInt(200)} for every missing effect.
        Glyphs with less than the specified rarity are sacrificed. Additional effects
        beyond ones specified will not increase Glyph score.`;
    }
  },
  methods: {
    update() {
      this.effectCount = this.autoSacrificeSettings.effectCount;
    },
    setEffectCount(event) {
      const inputValue = event.target.value;
      if (!isNaN(inputValue)) {
        this.autoSacrificeSettings.effectCount = Math.clamp(inputValue, 0, 8);
      }
    }
  },
  template: `
  <div class="c-glyph-sacrifice-options__advanced">
    <div>
      <span
        v-tooltip="questionmarkTooltip"
        class="o-questionmark"
      >
        ?
      </span>
      {{ $t("selected_glyphs_must_have_at_least") }}
      <input
        ref="effectCount"
        type="number"
        min="0"
        max="8"
        class="c-auto-sac-effect-tab__input"
        :value="effectCount"
        @blur="setEffectCount"
      >
      {{ $t("specified_effect_info") }}
    </div>
    <div
      v-for="effect in effects"
      :key="effect.id"
      class="l-auto-sac-type-tab__row-wrapper"
    >
      <SelectedEffectToggle
        class="c-auto-sac-type-tab__effect-desc l-specified-effect-tab__effect-desc"
        :effect="effect"
        :glyph-type="glyphType"
        :style="descStyle"
      />
    </div>
    {{ $t("click_to_toggle_effects") }}
  </div>
  `
};