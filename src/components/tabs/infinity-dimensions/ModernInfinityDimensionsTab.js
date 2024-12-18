import InfinityDimensionRow from "./ModernInfinityDimensionRow.js";
import PrimaryButton from "../../PrimaryButton.js";

export default {
  name: "ModernInfinityDimensionsTab",
  components: {
    PrimaryButton,
    InfinityDimensionRow
  },
  data() {
    return {
      infinityPower: new Decimal(0),
      dimMultiplier: new Decimal(0),
      powerPerSecond: new Decimal(0),
      incomeType: "",
      isEC7Running: false,
      isEC8Running: false,
      EC8PurchasesLeft: 0,
      isEC9Running: false,
      isNamelessRunning: false,
      isAnyAutobuyerUnlocked: false,
      conversionRate: 0,
      nextDimCapIncrease: 0,
      tesseractCost: new Decimal(0),
      totalDimCap: 0,
      canBuyTesseract: false,
      namelessCompleted: false,
      boughtTesseracts: 0,
      extraTesseracts: 0,
      creditsClosed: false,
      showLockedDimCostNote: true,
    };
  },
  computed: {
    tesseractCountString() {
      const extra = this.extraTesseracts > 0 ? ` + ${format(this.extraTesseracts, 2, 2)}` : "";
      return `${formatInt(this.boughtTesseracts)}${extra}`;
    },
    iPowAmount() {
      return $p_split("you_have_X_infinity_power", this.infinityPower, format(this.infinityPower, 2, 1));
    },
    ipowText() {
      return $t_split("infinity_power_increased_by", formatPow(this.conversionRate, 2, 3));
    },
    ipowBonus() {
      return $t_split(
        this.isEC9Running
        ? "infinity_power_multiplier_on_tds"
        : "infinity_power_multiplier_on_ads",
        formatX(this.dimMultiplier, 2, 1)
      );
    }
  },
  methods: {
    update() {
      this.showLockedDimCostNote = !InfinityDimension(8).isUnlocked;
      this.isEC9Running = EternityChallenge(9).isRunning;
      this.infinityPower.copyFrom(Currency.infinityPower);
      this.conversionRate = InfinityDimensions.powerConversionRate;
      if (this.isEC9Running) {
        this.dimMultiplier.copyFrom(Decimal.pow(Math.max(this.infinityPower.log2(), 1), 4).max(1));
      } else {
        this.dimMultiplier.copyFrom(this.infinityPower.pow(this.conversionRate).max(1));
      }
      this.powerPerSecond.copyFrom(InfinityDimension(1).productionPerSecond);
      this.isEC7Running = EternityChallenge(7).isRunning;
      this.isEC8Running = EternityChallenge(8).isRunning;
      if (this.isEC8Running) {
        this.EC8PurchasesLeft = player.eterc8ids;
      }
      this.isNamelessRunning = Nameless.isRunning;
      this.isAnyAutobuyerUnlocked = Autobuyer.infinityDimension(1).isUnlocked;
      this.nextDimCapIncrease = Tesseracts.nextTesseractIncrease;
      this.tesseractCost.copyFrom(Tesseracts.nextCost);
      this.totalDimCap = InfinityDimensions.totalDimCap;
      this.canBuyTesseract = Tesseracts.canBuyTesseract;
      this.namelessCompleted = Nameless.isCompleted;
      this.boughtTesseracts = Tesseracts.bought;
      this.extraTesseracts = Tesseracts.extra;
      this.creditsClosed = GameEnd.creditsEverClosed;
    },
    maxAll() {
      InfinityDimensions.buyMax();
    },
    toggleAllAutobuyers() {
      toggleAllInfDims();
    },
    buyTesseract() {
      Tesseracts.buyTesseract();
    }
  },
  template: `
  <div class="l-infinity-dim-tab">
    <div class="c-subtab-option-container">
      <PrimaryButton
        v-if="!isEC8Running"
        class="o-primary-btn--subtab-option"
        @click="maxAll"
      >
        {{ $t("max_all") }}
      </PrimaryButton>
      <PrimaryButton
        v-if="isAnyAutobuyerUnlocked && !isEC8Running"
        class="o-primary-btn--subtab-option"
        @click="toggleAllAutobuyers"
      >
        {{ $t("toggle_all_autobuyers") }}
      </PrimaryButton>
    </div>
    <div>
       <p>
        {{ iPowAmount[0] }}
        <span class="c-infinity-dim-description__accent">{{ iPowAmount[1] }}</span>
        {{ iPowAmount[2] }}
        <br>
        <span v-if="!isEC9Running">
          {{ ipowText[0] }}
          <span class="c-infinity-dim-description__accent">{{ ipowText[1] }}</span>
        </span>
        <span v-else>
          {{ $t("translated") }}
        </span>
        {{ ipowBonus[0] }}
        <span class="c-infinity-dim-description__accent">{{ ipowBonus[1] }}</span>
        {{ ipowBonus[2] }}
      </p>
    </div>
    <div
      v-if="namelessCompleted"
      class="l-infinity-dim-tab__nameless-reward-container"
    >
      <button
        class="c-infinity-dim-tab__tesseract-button"
        :class="{
          'c-infinity-dim-tab__tesseract-button--disabled': !canBuyTesseract,
          'o-pelle-disabled-pointer': creditsClosed
        }"
        @click="buyTesseract"
      >
        <p>
          {{ $t("buy_a_tesseract") }} ({{ tesseractCountString }})
        </p>
        <p>{{ $t("tesseract_effect_display", format(nextDimCapIncrease, 2)) }}</p>
        <p><b>{{ $t("cost_X_infinity_points_short", format(tesseractCost)) }}</b></p>
      </button>
    </div>
    <div v-if="isNamelessRunning">
      {{ $t("all_ids_are_limited_nameless") }}
    </div>
    <div v-else>
      {{ $t("all_ids_are_limited", format(totalDimCap, 2)) }}
    </div>
    <div v-if="isEC7Running">{{ $p("you_are_getting_X_7th_dimensions_per_second", powerPerSecond, format(powerPerSecond, 2, 0)) }}</div>
    <div v-else>{{ $p("you_are_getting_X_infinity_power_per_second", powerPerSecond, format(powerPerSecond, 2, 0)) }}</div>
    <b
      v-if="isEC8Running"
      class="l-infinity-dim-tab__ec8-purchases"
    >
      You have {{ quantifyInt("purchase", EC8PurchasesLeft) }} left within Eternity Challenge 8.
    </b>
    <div class="l-dimensions-container">
      <InfinityDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
      />
    </div>
    <div v-if="showLockedDimCostNote">
      按住<kbd>Shift</kbd>以查看锁定的无限维度的价格。
    </div>
  </div>
  `
};