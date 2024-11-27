import RealityUpgradeButton from "./RealityUpgradeButton.js";

export default {
  name: "RealityUpgradesTab",
  components: {
    RealityUpgradeButton
  },
  computed: {
    upgrades: () => RealityUpgrades.all,
    costScalingTooltip: () => `价格在达到 ${format(1e30)} 现实机器后加速增长，并在达到
	${format(Decimal.NUMBER_MAX_VALUE, 1)} 现实机器后进一步加速增长。`,
    possibleTooltip: () => `Checkered upgrades are impossible to unlock this Reality. Striped upgrades are
      still possible.`,
    lockTooltip: () => `This will only function if you have not already failed the condition or
      unlocked the upgrade.`,
  },
  methods: {
    id(row, column) {
      return (row - 1) * 5 + column - 1;
    }
  },
  template: `
  <div class="l-reality-upgrade-grid">
    <div
      class="c-reality-upgrade-infotext"
      data-v-reality-upgrades-tab
    >
      将鼠标悬停于 <i class="fas fa-question-circle" /> 标志上显示补充信息。
      <br>
      第一行升级可无限购买，但价格逐渐提升 <span :ach-tooltip="costScalingTooltip"><i class="fas fa-question-circle" /></span>；剩余升级仅能购买一次。
      <br>
      Single-purchase upgrades also have requirements which, once completed, permanently unlock the ability
      to purchase the upgrades at any point.
      <span :ach-tooltip="possibleTooltip">
        <i class="fas fa-question-circle" />
      </span>
      <br>
      Locked upgrades show their requirement and effect by default; unlocked ones show
      their effect, current bonus, and cost. Hold shift to swap this behavior.
      <br>
      You can shift-click upgrades with <i class="fas fa-lock-open" /> to make the game prevent you
      from doing anything this Reality which would cause you to fail their unlock condition.
      <span :ach-tooltip="lockTooltip">
        <i class="fas fa-question-circle" />
      </span>
      <br>
      Every completed row of purchased upgrades increases your Glyph level by {{ formatInt(1) }}.
    </div>
    <div
      v-for="row in 5"
      :key="row"
      class="l-reality-upgrade-grid__row"
    >
      <RealityUpgradeButton
        v-for="column in 5"
        :key="id(row, column)"
        :upgrade="upgrades[id(row, column)]"
      />
    </div>
  </div>
  `
};