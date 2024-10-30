import EternityMilestoneButton from "./EternityMilestoneButton.js";

export default {
  name: "EternityMilestonesTab",
  components: {
    EternityMilestoneButton
  },
  data() {
    return {
      eternityCount: new Decimal(),
    };
  },
  computed: {
    milestones() {
      return Object.values(GameDatabase.eternity.milestones)
        .sort((a, b) => a.eternities - b.eternities)
        .map(config => new EternityMilestoneState(config));
    },
    rows() {
      return Math.ceil(this.milestones.length / 3);
    }
  },
  methods: {
    update() {
      this.eternityCount.copyFrom(Currency.eternities.value.floor());
    },
    getMilestone(row, column) {
      return () => this.milestones[(row - 1) * 3 + column - 1];
    }
  },
  template: `
  <div class="l-eternity-milestone-grid">
    <div>{{ $p("statistics_eternities", eternityCount, format(eternityCount, 2)) }}</div>
    <div>
	  离线生产里程碑仅在特定条件下有效，将鼠标悬停在对应里程碑上来查看条件。
    </div>
    <div
      v-for="row in rows"
      :key="row"
      class="l-eternity-milestone-grid__row"
    >
      <EternityMilestoneButton
        v-for="column in 3"
        :key="row * 3 + column"
        :get-milestone="getMilestone(row, column)"
        class="l-eternity-milestone-grid__cell"
      />
    </div>
  </div>
  `
};