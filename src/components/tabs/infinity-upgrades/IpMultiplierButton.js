import InfinityUpgradeButton from "../../InfinityUpgradeButton.js";
import PrimaryButton from "../../PrimaryButton.js";
import PrimaryToggleButton from "../../PrimaryToggleButton.js";

export default {
  name: "IpMultiplierButton",
  components: {
    PrimaryButton,
    PrimaryToggleButton,
    InfinityUpgradeButton
  },
  data() {
    return {
      isAutobuyerActive: false,
      isAutoUnlocked: false,
      isCapped: false
    };
  },
  computed: {
    upgrade() {
      return InfinityUpgrade.ipMult;
    }
  },
  watch: {
    isAutobuyerActive(newValue) {
      Autobuyer.ipMult.isActive = newValue;
    }
  },
  methods: {
    update() {
      this.isAutoUnlocked = Autobuyer.ipMult.isUnlocked;
      this.isAutobuyerActive = Autobuyer.ipMult.isActive;
      this.isCapped = this.upgrade.isCapped;
    },
    buyMaxIPMult() {
      InfinityUpgrade.ipMult.buyMax();
    }
  },
  template: `
  <div class="l-spoon-btn-group">
    <InfinityUpgradeButton
      :upgrade="upgrade"
      class="o-infinity-upgrade-btn--multiplier"
    >
      <template v-if="isCapped">
        <br>
        <span>（于 {{ format(upgrade.config.costCap) }} IP 达到上限）</span>
      </template>
    </InfinityUpgradeButton>
    <PrimaryButton
      class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
      @click="buyMaxIPMult()"
    >
      购买最大数量无限点数倍增
    </PrimaryButton>
    <PrimaryToggleButton
      v-if="isAutoUnlocked"
      v-model="isAutobuyerActive"
      :label="$t('autobuy_ip_mult')"
      class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
    />
  </div>
  `
};