import NewTimeDimensionRow from "./ModernTimeDimensionRow.js";
import PrimaryButton from "../../PrimaryButton.js";

export default {
  name: "NewTimeDimensionsTab",
  components: {
    PrimaryButton,
    NewTimeDimensionRow
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
      this.shardsPerSecond.copyFrom(TimeDimension(1).productionPerSecond);
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
        购买最大数量
      </PrimaryButton>
      <PrimaryButton
        v-if="areAutobuyersUnlocked"
        class="o-primary-btn--subtab-option"
        @click="toggleAllAutobuyers"
      >
        切换自动购买器状态
      </PrimaryButton>
    </div>
    <div>
      <p>
        你已从 
        <span class="c-time-dim-description__accent">{{ format(timeShards, 2, 1) }}</span> 个时间碎片中获得
        <span class="c-time-dim-description__accent">{{ formatInt(totalUpgrades) }}</span> 个计数频率升级。
      </p>
      <p>
        下一次计数频率升级需要 
        <span class="c-time-dim-description__accent">{{ format(upgradeThreshold, 2, 1) }}</span> 个时间碎片，每次增长 
        <span class="c-time-dim-description__accent">{{ formatX(multPerTickspeed, 2, 2) }}</span>。
      </p>
    </div>
    <div>
	  每次额外升级所需的数量将从 {{ formatInt(tickspeedSoftcap) }} 个计数频率升级开始增加。
    </div>
    <div>
	  你每秒可获取 {{ format(shardsPerSecond, 2, 0) }} 个{{ incomeType }}。
	</div>
    <div class="l-dimensions-container">
      <NewTimeDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
        :are-autobuyers-unlocked="areAutobuyersUnlocked"
      />
    </div>
    <div>
      时间维度价格在 {{ format(costIncreases[0], 2, 2) }} 和
      {{ format(costIncreases[1]) }} 永恒点数处大幅提升，
      <br>
      并在 {{ format(costIncreases[2]) }} 永恒点数后大幅加速增长。
      <br>
      <div v-if="showLockedDimCostNote">
        按住 Shift 键查看未解锁的时间维度价格。
      </div>
     第八维度购买超过 {{ format(1e8) }} 次后倍率不再提升。
    </div>
  </div>
  `
};