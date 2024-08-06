import AntimatterDimensionProgressBar from "./AntimatterDimensionProgressBar.js";
import AntimatterDimensionRow from "./ModernAntimatterDimensionRow.js";
import AntimatterGalaxyRow from "./ModernAntimatterGalaxyRow.js";
import DimensionBoostRow from "./ModernDimensionBoostRow.js";
import PrimaryButton from "../../PrimaryButton.js";
import TickspeedRow from "./TickspeedRow.js";

export default {
  name: "ModernAntimatterDimensionsTab",
  components: {
    PrimaryButton,
    AntimatterDimensionProgressBar,
    AntimatterDimensionRow,
    AntimatterGalaxyRow,
    DimensionBoostRow,
    TickspeedRow
  },
  data() {
    return {
      hasDimensionBoosts: false,
      buyUntil10: true,
      isSacrificeUnlocked: false,
      isSacrificeAffordable: false,
      buy10Mult: new Decimal(0),
      currentSacrifice: new Decimal(0),
      sacrificeBoost: new Decimal(0),
      disabledCondition: "",
      isQuickResetAvailable: false,
      hasContinuum: false,
      isContinuumActive: false,
      multiplierText: "",
    };
  },
  computed: {
    sacrificeTooltip() {
      return $t("sacrifice_total_multiplier", formatX(this.sacrificeBoost, 2, 2));
    },
  },
  methods: {
    maxAll() {
      maxAll();
    },
    sacrifice() {
      sacrificeBtnClick();
    },
    // Toggle single/10 without Continuum, otherwise cycle through all 3 if it's unlocked
    changeBuyMode() {
      if (!this.hasContinuum) {
        player.buyUntil10 = !player.buyUntil10;
        return;
      }
      // "Continuum" => "Until 10" => "Buy 1" => "Continuum"
      if (this.isContinuumActive) {
        Laitela.setContinuum(false);
        player.buyUntil10 = true;
      } else if (player.buyUntil10) {
        player.buyUntil10 = false;
      } else {
        if (ImaginaryUpgrade(21).isLockingMechanics && player.auto.disableContinuum) {
          ImaginaryUpgrade(21).tryShowWarningModal();
          return;
        }
        Laitela.setContinuum(true);
      }
    },
    getUntil10Display() {
      if (this.isContinuumActive) return $t("htp_continuum_title");
      return this.buyUntil10 ? "买到10个" : "购买1个";
    },
    update() {
      this.hasDimensionBoosts = player.dimensionBoosts > 0;
      this.buyUntil10 = player.buyUntil10;
      this.hasContinuum = Laitela.continuumUnlocked;
      this.isContinuumActive = Laitela.continuumActive;
      this.isQuickResetAvailable = Player.isInAntimatterChallenge && Player.antimatterChallenge.isQuickResettable;

      const isSacrificeUnlocked = Sacrifice.isVisible;
      this.isSacrificeUnlocked = isSacrificeUnlocked;

      this.buy10Mult.copyFrom(AntimatterDimensions.buyTenMultiplier);

      this.multiplierText = $t("buy_ten_multiplier", formatX(this.buy10Mult, 2, 2));
      if (!isSacrificeUnlocked) return;
      this.isSacrificeAffordable = Sacrifice.canSacrifice;
      this.currentSacrifice.copyFrom(Sacrifice.totalBoost);
      this.sacrificeBoost.copyFrom(Sacrifice.nextBoost);
      this.disabledCondition = Sacrifice.disabledCondition;
      const sacText = this.isSacrificeUnlocked
        ? ` | ${$t("sacrifice_total_multiplier", formatX(this.currentSacrifice, 2, 2))}`
        : "";
      this.multiplierText += sacText;
    }
  },
  template: `
  <div class="l-antimatter-dim-tab">
    <div class="modes-container">
      <button
        class="o-primary-btn l-button-container"
        @click="changeBuyMode"
        data-v-modern-antimatter-dimensions-tab
      >
        {{ getUntil10Display() }}
      </button>
      <PrimaryButton
        v-show="isSacrificeUnlocked"
        v-tooltip="sacrificeTooltip"
        :enabled="isSacrificeAffordable"
        class="o-primary-btn--sacrifice"
        @click="sacrifice"
      >
        <span v-if="isSacrificeAffordable">{{ $t("sacrifice_next_multiplier", formatX(sacrificeBoost, 2, 2)) }}</span>
        <span v-else>{{ $t("sacrifice_locked_text", disabledCondition) }}</span>
      </PrimaryButton>
      <button
        class="o-primary-btn l-button-container"
        @click="maxAll"
        data-v-modern-antimatter-dimensions-tab
      >
        {{ $t("max_all") }}
      </button>
    </div>
    <span>{{ multiplierText }}</span>
    <TickspeedRow />
    <div class="l-dimensions-container">
      <AntimatterDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
      />
    </div>
    <div class="resets-container">
      <DimensionBoostRow />
      <PrimaryButton
        v-if="isQuickResetAvailable"
        class="o-primary-btn--quick-reset"
        onclick="softReset(-1, true, true)"
      >
        {{ $t(hasDimensionBoosts ? "quick_reset" : "quick_reset_2") }}
      </PrimaryButton>
      <AntimatterGalaxyRow />
    </div>
    <AntimatterDimensionProgressBar />
  </div>
  `
};