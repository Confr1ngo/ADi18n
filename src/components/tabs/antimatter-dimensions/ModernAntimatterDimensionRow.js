import GenericDimensionRowText from "../../GenericDimensionRowText.js";

export default {
  name: "ModernAntimatterDimensionRow",
  components: {
    GenericDimensionRowText
  },
  props: {
    tier: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      isCapped: false,
      multiplier: new Decimal(0),
      amount: new Decimal(0),
      bought: 0,
      boughtBefore10: 0,
      rateOfChange: new Decimal(0),
      singleCost: new Decimal(0),
      until10Cost: new Decimal(0),
      isAffordable: false,
      buyUntil10: true,
      howManyCanBuy: 0,
      isContinuumActive: false,
      continuumValue: 0,
      isShown: false,
      isCostsAD: false,
      amountDisplay: "",
      hasTutorial: false,
    };
  },
  computed: {
    isDoomed: () => Pelle.isDoomed,
    name() {
      return $a(`ad_full`)[this.tier - 1];
    },
    costDisplay() {
      return this.buyUntil10 ? format(this.until10Cost) : format(this.singleCost);
    },
    continuumString() {
      return formatFloat(this.continuumValue, 2);
    },
    showRow() {
      return this.isShown || this.isUnlocked || this.amount.gt(0);
    },
    boughtTooltip() {
      if (this.isCapped) return `无名氏阻止你拥有超过 ${format(1)} 个第八维`;
      if (this.isContinuumActive) return "连续统生产所有的反物质维度";
      return `已购买 ${formatInt(this.bought)} 次`;
    },
    costUnit() {
      return $t_split("dimension_names_short")[this.tier - 3];
    },
    buttonPrefix() {
      if (!this.isUnlocked) return $t("locked");
      if (this.isCapped) return "Shattered by Nameless";
      if (this.isContinuumActive) return $t("continuum");
      return $t("dimension_locked_buy_previous_dimension", formatInt(this.howManyCanBuy));
    },
    buttonValue() {
      if (this.isCapped) return "";
      if (this.isContinuumActive) return this.continuumString;
      const suffix = this.isCostsAD ? this.costUnit : $t("antimatter_short");
      if (this.showCostTitle(this.buyUntil10 ? this.until10Cost : this.singleCost)) {
        return $t("cost_X_currency", this.costDisplay, suffix);
      } else {
        return `${this.costDisplay} ${suffix}`;
      }
    },
    hasLongText() {
      return this.buttonValue.length > 20;
    },
  },
  methods: {
    update() {
      const tier = this.tier;
      if (tier > DimBoost.maxDimensionsUnlockable && !this.isDoomed) return;
      const dimension = AntimatterDimension(tier);
      this.isUnlocked = dimension.isAvailableForPurchase;
      const buyUntil10 = player.buyUntil10;
      this.isCapped = tier === 8 && Nameless.isRunning && dimension.bought >= 1;
      this.multiplier.copyFrom(AntimatterDimension(tier).multiplier);
      this.amount.copyFrom(dimension.totalAmount);
      this.bought = dimension.bought;
      this.boughtBefore10 = dimension.boughtBefore10;
      this.howManyCanBuy = buyUntil10 ? dimension.howManyCanBuy : Math.min(dimension.howManyCanBuy, 1);
      this.singleCost.copyFrom(dimension.cost);
      this.until10Cost.copyFrom(dimension.cost.times(Math.max(dimension.howManyCanBuy, 1)));
      if (tier < 8) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.isAffordable = dimension.isAffordable;
      this.buyUntil10 = buyUntil10;
      this.isContinuumActive = Laitela.continuumActive;
      if (this.isContinuumActive) this.continuumValue = dimension.continuumValue;
      this.isShown =
        (DimBoost.totalBoosts > 0 && DimBoost.totalBoosts + 3 >= tier) || PlayerProgress.infinityUnlocked();
      this.isCostsAD = NormalChallenge(6).isRunning && tier > 2 && !this.isContinuumActive;
      this.amountDisplay = Pelle.transitionText(
        this.tier < 8 ? format(this.amount, 2) : formatInt(this.amount),
        Pelle.endTabNames[this.tier - 1],
        Math.max(Math.min(GameEnd.endState - (this.tier - 1) % 4 / 10, 1), 0)
      );
      this.hasTutorial = (tier === 1 && Tutorial.isActive(TUTORIAL_STATE.DIM1)) ||
        (tier === 2 && Tutorial.isActive(TUTORIAL_STATE.DIM2));
    },
    buy() {
      if (this.isContinuumActive) return;
      if (this.howManyCanBuy === 1) {
        buyOneDimension(this.tier);
      } else {
        buyAsManyAsYouCanBuy(this.tier);
      }
    },
    showCostTitle(value) {
      return value.exponent < 1000000;
    },
    buttonClass() {
      return {
        "o-primary-btn o-primary-btn--new": true,
        "o-primary-btn--disabled": (!this.isAffordable && !this.isContinuumActive) || !this.isUnlocked || this.isCapped,
        "o-non-clickable o-continuum": this.isContinuumActive
      };
    },
    buttonTextClass() {
      return {
        "button-content l-modern-buy-ad-text": true,
        "tutorial--glow": this.isAffordable && this.hasTutorial
      };
    }
  },
  template: `
  <div
    v-show="showRow"
    class="c-dimension-row l-dimension-row-antimatter-dim c-antimatter-dim-row l-dimension-single-row"
    :class="{ 'c-dim-row--not-reached': !isUnlocked }"
    data-v-modern-antimatter-dimension-row
  >
    <GenericDimensionRowText
      :tier="tier"
      :name="name"
      :multiplier-text="formatX(multiplier, 2, 2)"
      :amount-text="amountDisplay"
      :rate="rateOfChange"
    />
    <div
      class="l-dim-row-multi-button-container c-modern-dim-tooltip-container"
      data-v-modern-antimatter-dimension-row
    >
      <div
        class="c-modern-dim-purchase-count-tooltip"
        data-v-modern-antimatter-dimension-row
      >
        {{ boughtTooltip }}
      </div>
      <button
        :class="buttonClass()"
        @click="buy"
        data-v-modern-antimatter-dimension-row
      >
        <div
          :class="buttonTextClass()"
          data-v-modern-antimatter-dimension-row
        >
          <div>
            {{ buttonPrefix }}
          </div>
          <div
            :class="{ 'l-dim-row-small-text': hasLongText }"
            data-v-modern-antimatter-dimension-row
          >
            {{ buttonValue }}
          </div>
          <div
            v-if="hasTutorial"
            class="fas fa-circle-exclamation l-notification-icon"
          />
        </div>
        <div
          v-if="!isContinuumActive && isUnlocked && !isCapped"
          class="fill"
          data-v-modern-antimatter-dimension-row
        >
          <div
            class="fill-purchased"
            :style="{ 'width': boughtBefore10*10 + '%' }"
            data-v-modern-antimatter-dimension-row
          />
          <div
            class="fill-possible"
            :style="{ 'width': howManyCanBuy*10 + '%' }"
            data-v-modern-antimatter-dimension-row
          />
        </div>
      </button>
    </div>
  </div>
  `
};