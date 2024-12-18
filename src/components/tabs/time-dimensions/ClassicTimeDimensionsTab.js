import PrimaryButton from "../../PrimaryButton.js";
import TimeDimensionRow from "./ClassicTimeDimensionRow.js";

export default {
  name: "ClassicTimeDimensionsTab",
  components: {
    PrimaryButton,
    TimeDimensionRow
  },
  data() {
    return {
      totalUpgrades: 0,
      multPerTickspeed: 0,
      tickspeedSoftcap: 0,
      timeShards: new Decimal(0),
      upgradeThreshold: new Decimal(0),
      shardsPerSecond: new Decimal(0),
      incomeType: "",
      areAutobuyersUnlocked: false,
      showLockedDimCostNote: true,
    };
  },
  computed: {
    costIncreases: () => TimeDimension(1).costIncreaseThresholds,
  },
  methods: {
    update() {
      this.showLockedDimCostNote = !TimeDimension(8).isUnlocked && player.realities >= 1;
      this.totalUpgrades = player.totalTickGained;
      this.multPerTickspeed = FreeTickspeed.multToNext;
      this.tickspeedSoftcap = FreeTickspeed.softcap;
      this.timeShards.copyFrom(Currency.timeShards);
      this.upgradeThreshold.copyFrom(FreeTickspeed.fromShards(Currency.timeShards.value).nextShards);
      this.shardsPerSecond.copyFrom(TimeDimension(1).productionPerRealSecond);
      this.incomeType = EternityChallenge(7).isRunning ? "第八无限维度" : "时间碎片";
      this.areAutobuyersUnlocked = Autobuyer.timeDimension(1).isUnlocked;
    },
    maxAll() {
      tryUnlockTimeDimensions();
      maxAllTimeDimensions();
    },
    toggleAllAutobuyers() {
      toggleAllTimeDims();
    }
  },
  template: `
  <div class="l-time-dim-tab l-centered-vertical-tab">
    <div class="c-subtab-option-container">
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="maxAll"
      >
        Max all
      </PrimaryButton>
      <PrimaryButton
        v-if="areAutobuyersUnlocked"
        class="o-primary-btn--subtab-option"
        @click="toggleAllAutobuyers"
      >
        Toggle all autobuyers
      </PrimaryButton>
    </div>
    <div>
      <p>
        You have gained
        <span class="c-time-dim-description__accent">{{ formatInt(totalUpgrades) }}</span> Tickspeed upgrades from
        <span class="c-time-dim-description__accent">{{ format(timeShards, 2, 1) }}</span> Time Shards.
      </p>
      <p>
        Next Tickspeed upgrade at
        <span class="c-time-dim-description__accent">{{ format(upgradeThreshold, 2, 1) }}</span>, increasing by
        <span class="c-time-dim-description__accent">{{ formatX(multPerTickspeed, 2, 2) }}</span> per
        Tickspeed upgrade gained.
      </p>
    </div>
    <div>
      The amount each additional upgrade requires will start
      increasing above {{ formatInt(tickspeedSoftcap) }} Tickspeed upgrades.
    </div>
    <div>
      你每秒可获取 {{ format(shardsPerSecond, 2, 0) }}{{ incomeType }}。
    </div>
    <div class="l-dimensions-container">
      <TimeDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
        :are-autobuyers-unlocked="areAutobuyersUnlocked"
      />
    </div>
    <div>
      Time Dimension costs jump at {{ format(costIncreases[0], 2, 2) }} and
      {{ format(costIncreases[1]) }} Eternity Points,
      <br>
      and costs increase much faster after {{ format(costIncreases[2]) }} Eternity Points.
      <br>
      <div v-if="showLockedDimCostNote">
        Hold shift to see the Eternity Point cost for locked Time Dimensions.
      </div>
      Any 8th Time Dimensions purchased above {{ format(1e8) }} will not further increase the multiplier.
    </div>
  </div>
  `

};