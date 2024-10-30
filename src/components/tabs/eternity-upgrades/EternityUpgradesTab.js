import EPMultiplierButton from "./EPMultiplierButton.js";
import EternityUpgradeButton from "./EternityUpgradeButton.js";

export default {
  name: "EternityUpgradesTab",
  components: {
    EternityUpgradeButton,
    EPMultiplierButton
  },
  computed: {
    grid() {
      return [
        [
          EternityUpgrade.idMultEP,
          EternityUpgrade.idMultEternities,
          EternityUpgrade.idMultICRecords
        ],
        [
          EternityUpgrade.tdMultAchs,
          EternityUpgrade.tdMultTheorems,
          EternityUpgrade.tdMultRealTime,
        ]
      ];
    },
    costIncreases: () => EternityUpgrade.epMult.costIncreaseThresholds.map(x => new Decimal(x))
  },
  methods: {
    formatPostBreak
  },
  template: `
  <div
    class="l-eternity-upgrades-grid"
    data-v-eternity-upgrades-tab
  >
    <div
      v-for="(row, i) in grid"
      :key="i"
      class="l-eternity-upgrades-grid__row"
      data-v-eternity-upgrades-tab
    >
      <EternityUpgradeButton
        v-for="upgrade in row"
        :key="upgrade.id"
        :upgrade="upgrade"
        class="l-eternity-upgrades-grid__cell"
        data-v-eternity-upgrades-tab
      />
    </div>
    <EPMultiplierButton data-v-eternity-upgrades-tab />
    <div>
      永恒点数 {{ formatX(5) }} 升级的价格在达到 {{ format(costIncreases[0]) }},
      {{ formatPostBreak(costIncreases[1], 2) }}, and {{ formatPostBreak(costIncreases[2]) }} 永恒点数时大幅提升。
      <br>
      价格将在 {{ formatPostBreak(costIncreases[3]) }} 永恒点数后超指数增长。
    </div>
  </div>
  `
};