import { Laitela } from "../../../core/globals.js";

import SliderComponent from "../../SliderComponent.js";

export default {
  name: "BlackHoleChargingSliders",
  components: {
    SliderComponent
  },
  data() {
    return {
      isNegativeBHUnlocked: false,
      isInverted: false,
      isLaitela: false,
      negativeSlider: 0,
      negativeBHDivisor: 1,
      maxNegativeBlackHole: 300,
      isDisabled: false,
    };
  },
  computed: {
    infoTooltip() {
      return this.isLaitela
        ? $t("bh_disabled")
        : "Black Hole must be paused to activate Inversion";
    },
    reqLockText() {
      return `Inversion strength cannot be modified due to Lock for
        "${ImaginaryUpgrade(24).name}"`;
    }
  },
  methods: {
    update() {
      this.isNegativeBHUnlocked = V.isFlipped && BlackHoles.arePermanent;
      this.isInverted = BlackHoles.areNegative;
      this.isLaitela = Laitela.isRunning;
      this.negativeSlider = -Math.log10(player.blackHoleNegative);
      this.negativeBHDivisor = Math.pow(10, this.negativeSlider);
      const maxInversion = player.requirementChecks.reality.slowestBH <= 1e-300;
      this.isDisabled = ImaginaryUpgrade(24).isLockingMechanics && Ra.isRunning && maxInversion;
    },
    adjustSliderNegative(value) {
      this.negativeSlider = value;
      player.blackHoleNegative = Math.pow(10, -this.negativeSlider);
      player.requirementChecks.reality.slowestBH = Math.max(
        player.requirementChecks.reality.slowestBH,
        player.blackHoleNegative
      );
    },
    sliderProps(negative) {
      return {
        min: 0,
        max: negative ? this.maxNegativeBlackHole : 990,
        interval: 1,
        width: "55rem",
        tooltip: false
      };
    },
  },
  template: `
  <div>
    <div
      v-if="isNegativeBHUnlocked"
      class="l-black-hole-sliders"
      data-v-black-hole-charging-sliders
    >
      <b>
        反转黑洞减速游戏 {{ format(negativeBHDivisor, 2, 2) }} 倍。
        （当前 {{ isInverted ? "已反转" : "未反转" }}<span
          v-if="negativeSlider !== 0 && !isInverted"
          :ach-tooltip="infoTooltip"
        >
          <i
            class="fas fa-question-circle l-margin-left"
            data-v-black-hole-charging-sliders
          />
        </span>）
      </b>
      <SliderComponent
        v-if="!isDisabled"
        v-bind="sliderProps(true)"
        :value="negativeSlider"
        @input="adjustSliderNegative($event)"
        data-v-black-hole-charging-sliders
      />
      <div
        v-else
        class="l-lock-text"
        data-v-black-hole-charging-sliders
      >
        {{ reqLockText }}
      </div>
      <br>
      Inverting the Black Hole only affects its own speedup, no other upgrades or effects, although
      it will also indirectly affect the Effarig Game speed power effect.
    </div>
  </div>
  `
};