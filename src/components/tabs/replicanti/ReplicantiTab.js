import wordShift from "../../../core/word-shift.js";

import ReplicantiUpgradeButton, { ReplicantiUpgradeButtonSetup } from "./ReplicantiUpgradeButton.js";
import PrimaryButton from "../../PrimaryButton.js";
import ReplicantiGainText from "./ReplicantiGainText.js";
import ReplicantiGalaxyButton from "./ReplicantiGalaxyButton.js";

export default {
  name: "ReplicantiTab",
  components: {
    PrimaryButton,
    ReplicantiGainText,
    ReplicantiUpgradeButton,
    ReplicantiGalaxyButton,
  },
  data() {
    return {
      isUnlocked: false,
      isUnlockAffordable: false,
      isInEC8: false,
      ec8Purchases: 0,
      amount: new Decimal(),
      mult: new Decimal(),
      hasTDMult: false,
      multTD: new Decimal(),
      hasDTMult: false,
      multDT: new Decimal(),
      hasIPMult: false,
      multIP: new Decimal(),
      hasRaisedCap: false,
      replicantiCap: new Decimal(),
      capMultText: "",
      distantRG: 0,
      remoteRG: 0,
      effarigInfinityBonusRG: 0,
      isUncapped: false,
      nextEffarigRGThreshold: 0,
      canSeeGalaxyButton: false,
      unlockCost: new Decimal(),
      scrambledText: "",
      maxReplicanti: new Decimal(),
      estimateToMax: 0,
    };
  },
  computed: {
    isDoomed: () => Pelle.isDoomed,
    replicantiChanceSetup() {
      return new ReplicantiUpgradeButtonSetup(
        ReplicantiUpgrade.chance,
        value => `复制概率: ${formatPercents(value)}`,
        cost => `+${formatPercents(0.01)} 成本：${format(cost)} 无限点数`
      );
    },
    replicantiIntervalSetup() {
      const upgrade = ReplicantiUpgrade.interval;
      function formatInterval(interval) {
        const actualInterval = upgrade.applyModifiers(interval);
        const intervalNum = actualInterval.toNumber();
        if (
          Number.isFinite(intervalNum) &&
          intervalNum > 1 &&
          upgrade.isCapped
        ) {
          // Checking isCapped() prevents text overflow when formatted as "__ ➜ __"
          return TimeSpan.fromMilliseconds(intervalNum).toStringShort(false);
        }
        if (actualInterval.lt(0.01)) return `< ${format(0.01, 2, 2)}ms`;
        if (actualInterval.gt(1000))
          return `${format(actualInterval.div(1000), 2, 2)} 秒`;
        return `${format(actualInterval, 2, 2)} 毫秒`;
      }
      return new ReplicantiUpgradeButtonSetup(
        upgrade,
        value => `复制间隔：${formatInterval(value)}`,
        cost =>
          `➜ ${formatInterval(upgrade.nextValue)} 成本：${format(cost)} 无限点数`
      );
    },
    maxGalaxySetup() {
      const upgrade = ReplicantiUpgrade.galaxies;
      return new ReplicantiUpgradeButtonSetup(
        upgrade,
        value => {
          let description = `最大复制星系数量：`;
          const extra = upgrade.extra;
          if (extra > 0) {
            const total = value + extra;
            description += `<br>${formatInt(value)} + ${formatInt(extra)} = ${formatInt(total)}`;
          } else {
            description += formatInt(value);
          }
          return description;
        },
        cost => `+${formatInt(1)} 成本：${format(cost)} 无限点数`
      );
    },
    boostText() {
      const boostList = [];
      boostList.push(`为所有无限维度提供了 <span class="c-replicanti-description__accent">${formatX(this.mult, 2, 2)}</span>
        倍率。`);
      if (this.hasTDMult) {
        boostList.push(`一项膨胀升级为所有时间维度提供了 <span class="c-replicanti-description__accent">${formatX(this.multTD, 2, 2)}</span> 倍率。`);
      }
      if (this.hasDTMult) {
        const additionalEffect = GlyphAlteration.isAdded("replication") ? "和复制速度" : "";
        boostList.push(`符文为膨胀时间${additionalEffect}提供了 <span class="c-replicanti-description__accent">${formatX(this.multDT, 2, 2)}</span> 倍率。`);
      }
      if (this.hasIPMult) {
        boostList.push(`a <span class="c-replicanti-description__accent">${formatX(this.multIP)}</span>
          multiplier to Infinity Points from Glyph Alchemy`);
      }
      if (boostList.length === 1) return `${boostList[0]}`;
      if (boostList.length === 2) return `${boostList[0]}<br>${boostList[1]}`;
      return `${boostList.join("<br>")}`;
    },
    hasMaxText: () => PlayerProgress.realityUnlocked() && !Pelle.isDoomed,
    toMaxTooltip() {
      if (this.amount.lte(this.replicantiCap)) return null;
      return this.estimateToMax.lt(0.01)
        ? "Currently Increasing"
        : TimeSpan.fromSeconds(this.estimateToMax.toNumber()).toStringShort();
    }
  },
  methods: {
    update() {
      this.isUnlocked = Replicanti.areUnlocked;
      this.unlockCost = new Decimal(1e140).dividedByEffectOf(PelleRifts.vacuum.milestones[1]);
      if (this.isDoomed) this.scrambledText = this.vacuumText();
      if (!this.isUnlocked) {
        this.isUnlockAffordable = Currency.infinityPoints.gte(this.unlockCost);
        return;
      }
      this.isInEC8 = EternityChallenge(8).isRunning;
      if (this.isInEC8) {
        this.ec8Purchases = player.eterc8repl;
      }
      this.amount.copyFrom(Replicanti.amount);
      this.mult.copyFrom(replicantiMult());
      this.hasTDMult = DilationUpgrade.tdMultReplicanti.isBought;
      this.multTD.copyFrom(DilationUpgrade.tdMultReplicanti.effectValue);
      this.hasDTMult = getAdjustedGlyphEffect("replicationdtgain") !== 0 && !Pelle.isDoomed;
      this.multDT = Math.clampMin(
        Decimal.log10(Replicanti.amount) *
          getAdjustedGlyphEffect("replicationdtgain"),
        1
      );
      this.hasIPMult = AlchemyResource.exponential.amount > 0 && !this.isDoomed;
      this.multIP = Replicanti.amount.powEffectOf(AlchemyResource.exponential);
      this.isUncapped = PelleRifts.vacuum.milestones[1].canBeApplied;
      this.hasRaisedCap = EffarigUnlock.infinity.isUnlocked && !this.isUncapped;
      this.replicantiCap.copyFrom(replicantiCap());
      if (this.hasRaisedCap) {
        const mult = this.replicantiCap.div(Decimal.NUMBER_MAX_VALUE);
        this.capMultText = TimeStudy(31).canBeApplied
          ? `基础效果：${formatX(mult.pow(1 / TimeStudy(31).effectValue), 2)}；购买时间研究 31 后: ${formatX(mult, 2)}`
          : formatX(mult, 2);
      }
      this.distantRG = ReplicantiUpgrade.galaxies.distantRGStart;
      this.remoteRG = ReplicantiUpgrade.galaxies.remoteRGStart;
      this.effarigInfinityBonusRG = Effarig.bonusRG;
      this.nextEffarigRGThreshold = Decimal.NUMBER_MAX_VALUE.pow(
        Effarig.bonusRG + 2
      );
      this.canSeeGalaxyButton =
        Replicanti.galaxies.max >= 1 || PlayerProgress.eternityUnlocked();
      this.maxReplicanti.copyFrom(player.records.thisReality.maxReplicanti);
      this.estimateToMax = this.calculateEstimate();
    },
    vacuumText() {
      return wordShift.wordCycle(PelleRifts.vacuum.name);
    },
    // This is copied out of a short segment of ReplicantiGainText with comments and unneeded variables stripped
    calculateEstimate() {
      const updateRateMs = player.options.updateRate;
      const logGainFactorPerTick = Decimal.divide(getGameSpeedupForDisplay() * updateRateMs *
        (Math.log(player.replicanti.chance + 1)), getReplicantiInterval());
      const postScale = Math.log10(ReplicantiGrowth.scaleFactor) / ReplicantiGrowth.scaleLog10;
      const nextMilestone = this.maxReplicanti;
      const coeff = Decimal.divide(updateRateMs / 1000, logGainFactorPerTick.times(postScale));
      return coeff.times(nextMilestone.divide(this.amount).pow(postScale).minus(1));
    }
  },
  template: `
  <div class="l-replicanti-tab">
    <br>
    <PrimaryButton
      v-if="!isUnlocked"
      :enabled="isUnlockAffordable"
      class="o-primary-btn--replicanti-unlock"
      onclick="Replicanti.unlock();"
    >
      解锁复制器
      <br>
      Cost: {{ format(unlockCost) }} IP
    </PrimaryButton>
    <template v-else>
      <div
        v-if="isDoomed"
        class="modified-cap"
        data-v-replicanti-tab
      >
        Your Replicanti cap has been removed due to the second {{ scrambledText }} milestone.
      </div>
      <div
        v-else-if="hasRaisedCap"
        class="modified-cap"
        data-v-replicanti-tab
      >
        完成鹿颈长的现实给予你如下奖励：
        <br>
        未购买时间研究 192 时复制器上限为 {{ format(replicantiCap, 2) }}
        ({{ capMultText }})
        <br>
        额外获得 {{ formatInt(effarigInfinityBonusRG) }} 个复制星系（下一个复制星系需要达到 {{ format(nextEffarigRGThreshold, 2) }} 的上限）
      </div>
      <p class="c-replicanti-description">
        你当前的
        <span class="c-replicanti-description__accent">{{ format(amount, 2, 0) }}</span>
        个复制器
        <br>
        <span v-html="boostText" />
      </p>
      <div
        v-if="hasMaxText"
        class="c-replicanti-description"
      >
        你当前现实中获取的最大复制器数量是
        <span
          v-tooltip="toMaxTooltip"
          class="max-accent"
          data-v-replicanti-tab
        >{{ format(maxReplicanti, 2) }}</span>。
      </div>
      <br>
      <div v-if="isInEC8">
        You have {{ quantifyInt("purchase", ec8Purchases) }} left within Eternity Challenge 8.
      </div>
      <div class="l-replicanti-upgrade-row">
        <ReplicantiUpgradeButton :setup="replicantiChanceSetup" />
        <ReplicantiUpgradeButton :setup="replicantiIntervalSetup" />
        <ReplicantiUpgradeButton :setup="maxGalaxySetup" />
      </div>
      <div>
        最大复制星系数量可以无限购买，但在购买 {{ formatInt(distantRG) }} 次后价格大幅提升，购买 {{ formatInt(remoteRG) }} 次后增长更加迅速。</div>
      <br><br>
      <ReplicantiGainText />
      <br>
      <ReplicantiGalaxyButton v-if="canSeeGalaxyButton" />
    </template>
  </div>
  `
};