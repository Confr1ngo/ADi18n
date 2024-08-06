import AutobuyerIntervalLabel from "./AutobuyerIntervalLabel.js";
import { BigCrunchAutobuyerState } from "../../../core/autobuyers/big-crunch-autobuyer.js";
import { EternityAutobuyerState } from "../../../core/autobuyers/eternity-autobuyer.js";
// This component is used for autobuyer entries which take up an entire row and may (AD/tickspeed) or may not
// (prestige) have an associated slow version unlockable pre-infinity
export default {
  name: "AutobuyerBox",
  components: {
    AutobuyerIntervalLabel
  },
  props: {
    autobuyer: {
      type: Object,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    showInterval: {
      type: Boolean,
      required: false,
      default: false
    },
    isModal: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      isUnlocked: false,
      isActive: false,
      globalToggle: false,
      canBeBought: false,
      isUnlockable: false,
      antimatterCost: new Decimal(),
      isBought: false,
      antimatter: new Decimal(),
      currMode: 0,
      nextValue: 0,
      nextTime: 0,
    };
  },
  computed: {
    autobuyerBuyBoxClass() {
      return {
        "c-autobuyer-buy-box": true,
        "o-primary-btn": true,
        "o-primary-btn--enabled": this.isUnlockable,
        "o-primary-btn--disabled": !this.isUnlockable
      };
    },
    autobuyerBoxRowClass() {
      return {
        "c-autobuyer-box-row": true,
        "c-autobuyer-box-row__modal": this.isModal
      };
    },
    autobuyerToggleClass() {
      if (!this.globalToggle) {
        return this.isActive ? "fas fa-pause" : "fas fa-times";
      }
      return this.isActive ? "fas fa-check" : "fas fa-times";
    },
    autobuyerStateClass() {
      if (!this.globalToggle) {
        return {
          "o-autobuyer-toggle-checkbox__label": true,
          "o-autobuyer-toggle-checkbox__label-modal": this.isModal,
          "o-autobuyer-toggle-checkbox__label--active-paused": this.isActive,
          "o-autobuyer-toggle-checkbox__label--deactive-paused": !this.isActive,
          "o-autobuyer-toggle-checkbox__label--disabled": !this.globalToggle
        };
      }
      return {
        "o-autobuyer-toggle-checkbox__label": true,
        "o-autobuyer-toggle-checkbox__label-modal": this.isModal,
        "o-autobuyer-toggle-checkbox__label--active": this.isActive,
        "o-autobuyer-toggle-checkbox__label--disabled": !this.globalToggle
      };
    },
    showEternity() {
      return PlayerProgress.eternityUnlocked();
    },
    isShowingStateInfo() {
      // Prestiging for a static amount is zero in both AUTO_CRUNCH_MODE and AUTO_ETERNITY_MODE
      return this.isActive && ((this.autobuyer instanceof BigCrunchAutobuyerState) || (this.autobuyer instanceof EternityAutobuyerState)) && this.currMode !== 0;
    },
    extraInfo() {
      // This logic takes advantage of AUTO_CRUNCH_MODE and AUTO_ETERNITY_MODE being identical
      switch (this.currMode) {
        case AUTO_ETERNITY_MODE.TIME:
          return this.nextTime > 0
            ? $("will_trigger_in_X", TimeSpan.fromSeconds(this.nextTime).toStringShort())
            : $t("will_trigger_asap");
        case AUTO_ETERNITY_MODE.X_HIGHEST:
        default:
          return $t("will_trigger_at_X", `${format(this.nextValue, 2)} ${this.autobuyer.name instanceof BigCrunchAutobuyerState ? $t("infinity_points_short") : $t("eternity_points_short")}`);
      }
    }
  },
  watch: {
    isActive(newValue) {
      // eslint-disable-next-line vue/no-mutating-props
      this.autobuyer.isActive = newValue;
    }
  },
  methods: {
    update() {
      const autobuyer = this.autobuyer;
      this.isUnlocked = autobuyer.isUnlocked;
      this.isActive = autobuyer.isActive;
      this.globalToggle = player.auto.autobuyersOn;
      this.canBeBought = autobuyer.canBeBought;
      this.isUnlockable = autobuyer.canUnlockSlowVersion;
      this.antimatterCost = autobuyer.antimatterCost;
      this.isBought = autobuyer.isBought;
      this.antimatter.copyFrom(player.records.thisEternity.maxAM);

      this.currMode = autobuyer.mode;
      if (this.isShowingStateInfo) {
        this.nextValue = new Decimal(autobuyer.highestPrevPrestige).times(autobuyer.xHighest);
        this.nextTime = autobuyer.timeToNextTick;
      }
    },
    toggle() {
      this.isActive = !this.isActive;
    },
    purchase() {
      this.autobuyer.purchase();
      TabNotification.newAutobuyer.clearTrigger();
      GameCache.cheapestAntimatterAutobuyer.invalidate();
    }
  },
  template: `
  <div
    v-if="isUnlocked || isBought"
    :class="autobuyerBoxRowClass"
  >
    <div class="l-autobuyer-box__header">
      {{ name }}
      <AutobuyerIntervalLabel
        v-if="showInterval"
        :autobuyer="autobuyer"
      />
      <div v-if="isShowingStateInfo">
        {{ extraInfo }}
      </div>
    </div>
    <div class="c-autobuyer-box-row__intervalSlot">
      <slot name="intervalSlot" />
    </div>
    <div class="c-autobuyer-box-row__toggleSlot">
      <slot name="toggleSlot" />
    </div>
    <div class="c-autobuyer-box-row__checkboxSlot">
      <slot name="checkboxSlot" />
    </div>
    <div class="c-autobuyer-box-row__optionSlot">
      <slot name="optionSlot" />
    </div>
    <div
      class="l-autobuyer-box__footer"
      @click="toggle"
    >
      <label :class="autobuyerStateClass">
        <span :class="autobuyerToggleClass" />
      </label>
      <input
        :checked="isActive && globalToggle"
        :disabled="!globalToggle"
        :name="name"
        type="checkbox"
      >
    </div>
  </div>
  <div
    v-else-if="canBeBought"
    :class="autobuyerBuyBoxClass"
    @click="purchase"
  >
    {{ name }}
    <br>
    <template v-if="showEternity">
      {{ $t("autobuyer_unlock_requirement_this_eternity", format(antimatterCost)) }}
    </template>
    <template v-else>
      {{ $t("autobuyer_unlock_requirement", format(antimatterCost)) }}
    </template>
  </div>
  `
};