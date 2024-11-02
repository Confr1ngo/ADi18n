import { DC } from "../../constants.js";

export const normalAchievements = [
  {
    id: 11,
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    description: () => $t("achievement_11_tooltip")
  },
  {
    id: 12,
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    description: () => $t("achievement_12_tooltip")
  },
  {
    id: 13,
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    description: () => $t("achievement_13_tooltip")
  },
  {
    id: 14,
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    description: () => $t("achievement_14_tooltip")
  },
  {
    id: 15,
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    description: () => $t("achievement_15_tooltip")
  },
  {
    id: 16,
    description() {
      return Nameless.isRunning
        ? $t("achievement_16_tooltip_nameless")
        : $t("achievement_16_tooltip");
    },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 17,
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    description: () => $t("achievement_17_tooltip")
  },
  {
    id: 18,
    description() {
      return Nameless.isRunning
        ? $t("achievement_18_tooltip_nameless")
        : $t("achievement_18_tooltip");
    },
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 21,
    checkRequirement: () => true,
    description: () => $t("achievement_21_tooltip"),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => $t("achievement_21_reward", formatInt(100)),
    effect: 100
  },
  {
    id: 22,
    description: () => $t("achievement_22_tooltip", formatInt(50)),
    checkRequirement: () => NewsHandler.uniqueTickersSeen >= 50,
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER
  },
  {
    id: 23,
    description: () => $t("achievement_23_tooltip", formatInt(99)),
    checkRequirement: () => AntimatterDimension(8).amount.eq(99),
    reward: () => $t("achievement_23_reward", formatPercents(0.1)),
    effect: 1.1
  },
  {
    id: 24,
    description: () => $t("achievement_24_tooltip", format(DC.E80)),
    checkRequirement: () => Currency.antimatter.exponent >= 80,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 25,
    description: () => $t("achievement_25_tooltip", formatInt(10)),
    checkRequirement: () => DimBoost.purchasedBoosts >= 10,
    checkEvent: GAME_EVENT.DIMBOOST_AFTER
  },
  {
    id: 26,
    checkRequirement: () => true,
    description: () => $t("achievement_26_tooltip"),
    checkEvent: GAME_EVENT.GALAXY_RESET_BEFORE
  },
  {
    id: 27,
    description: () => $t("achievement_27_tooltip", formatInt(2)),
    checkRequirement: () => player.galaxies >= 2,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER
  },
  {
    id: 28,
    description: () => $t("achievement_28_tooltip",  format(DC.E150)),
    checkRequirement: () => AntimatterDimension(1).amount.exponent >= 150,
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    reward: () => $t("achievement_28_reward", formatPercents(0.1)),
    effect: 1.1
  },
  {
    id: 31,
    description: () => $t("achievement_31_tooltip", formatX(DC.E31)),
    checkRequirement: () => AntimatterDimensions.all.some(x => x.multiplier.exponent >= 31),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: () => $t("achievement_31_reward", formatPercents(0.05)),
    effect: 1.05
  },
  {
    id: 32,
    description: () => $t("achievement_32_tooltip", formatX(600)),
    checkRequirement: () => !NormalChallenge(8).isOnlyActiveChallenge && Sacrifice.totalBoost.gte(600),
    checkEvent: GAME_EVENT.SACRIFICE_RESET_AFTER,
    reward() {
      return `${$t("achievement_32_reward")}
      ${Sacrifice.getSacrificeDescription({ "Achievement32": false, "Achievement57": false, "Achievement88": false })} ➜
      ${Sacrifice.getSacrificeDescription({ "Achievement32": true, "Achievement57": false, "Achievement88": false })}`;
    },
    effect: 0.1,
  },
  {
    id: 33,
    description: () => $t("achievement_33_tooltip", formatInt(10)),
    checkRequirement: () => Currency.infinities.gte(10),
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER
  },
  {
    id: 34,
    description: () => $t("achievement_34_tooltip"),
    checkRequirement: () => AntimatterDimension(8).totalAmount.eq(0),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => $t("achievement_34_reward", formatPercents(0.02)),
    effect: 1.02
  },
  {
    id: 35,
    description: () => $t("achievement_35_tooltip", formatInt(6)),
    checkRequirement: () => Date.now() - player.lastUpdate >= 21600000,
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE
  },
  {
    id: 36,
    description: () => $t("achievement_36_tooltip", formatInt(1)),
    checkRequirement: () => player.galaxies === 1,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => $t("achievement_36_reward", format(1.02, 2, 2)),
    effect: 1 / 1.02
  },
  {
    id: 37,
    description: () => $t("achievement_37_tooltip", formatInt(2)),
    checkRequirement: () => Time.thisInfinityRealTime.totalHours <= 2,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => $t("achievement_37_reward", formatInt(5000)),
    effect: 5000
  },
  {
    id: 38,
    description: () => $t("achievement_38_tooltip"),
    checkRequirement: () => player.requirementChecks.infinity.noSacrifice,
    checkEvent: GAME_EVENT.GALAXY_RESET_BEFORE
  },
  {
    id: 41,
    description: () => $t("achievement_41_tooltip", formatInt(16)),
    checkRequirement: () => player.infinityUpgrades.size >= 16,
    checkEvent: [
      GAME_EVENT.INFINITY_UPGRADE_BOUGHT,
      GAME_EVENT.REALITY_RESET_AFTER,
      GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT
    ],
    reward: () => $t("achievement_41_reward", formatInt(2)),
  },
  {
    id: 42,
    description: () => $t("achievement_42_tooltip", format(DC.E63)),
    checkRequirement: () =>
      Currency.antimatter.exponent >= 63 &&
      Currency.antimatter.productionPerSecond.gt(Currency.antimatter.value),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 43,
    description: () => $t("achievement_43_tooltip"),
    checkRequirement: () => {
      const multipliers = Array.range(1, 8).map(tier => AntimatterDimension(tier).multiplier);
      for (let i = 0; i < multipliers.length - 1; i++) {
        if (multipliers[i].gte(multipliers[i + 1])) return false;
      }
      return true;
    },
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: () => $t("achievement_43_reward", formatPercents(0.08), formatPercents(0.07))
  },
  {
    id: 44,
    description: () => $t("achievement_44_tooltip", formatInt(30)),
    checkRequirement: () => AchievementTimers.marathon1
      .check(Currency.antimatter.productionPerSecond.gt(Currency.antimatter.value), 30),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
  },
  {
    id: 45,
    description: () => $t("achievement_45_tooltip", format(DC.E29)),
    checkRequirement: () => Tickspeed.current.exponent <= -26,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: () => $t("achievement_45_reward", formatX(1.02, 0, 2)),
    effect: 0.98
  },
  {
    id: 46,
    description: () => $t("achievement_46_tooltip", format(DC.E12)),
    checkRequirement: () => AntimatterDimension(7).amount.exponent >= 12,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 47,
    description: () => $t("achievement_47_tooltip", formatInt(3)),
    checkRequirement: () => NormalChallenges.all.countWhere(c => c.isCompleted) >= 3,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT],
  },
  {
    id: 48,
    description: () => $t("achievement_48_tooltip", formatInt(12)),
    checkRequirement: () => NormalChallenges.all.countWhere(c => !c.isCompleted) === 0,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT],
    reward: () => $t("achievement_48_reward", formatPercents(0.1)),
    effect: 1.1
  },
  {
    id: 51,
    description: () => $t("achievement_51_tooltip"),
    checkRequirement: () => player.break,
    checkEvent: [GAME_EVENT.BREAK_INFINITY, GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT],
  },
  {
    id: 52,
    description: () => $t("achievement_52_tooltip"),
    checkRequirement: () => Autobuyer.antimatterDimension.zeroIndexed.concat(Autobuyer.tickspeed)
      .every(a => a.isUnlocked && a.hasMaxedInterval),
    checkEvent: [GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT]
  },
  {
    id: 53,
    description: () => $t("achievement_53_tooltip"),
    // The upgradeable autobuyers are dimensions, tickspeed, dimension boost,
    // galaxy, and big crunch (the ones you get from normal challenges).
    // We don't count autobuyers which can be upgraded via e.g. perks as upgradeable.
    checkRequirement: () => Autobuyers.upgradeable
      .every(a => a.isUnlocked && a.hasMaxedInterval),
    checkEvent: [GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT]
  },
  {
    id: 54,
    description: () => $t("achievement_54_tooltip", formatInt(10)),
    checkRequirement: () => Time.thisInfinityRealTime.totalMinutes <= 10,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => $t("achievement_54_reward", format(5e5)),
    effect: 5e5
  },
  {
    id: 55,
    description: () => $t("achievement_55_tooltip", formatInt(1)),
    checkRequirement: () => Time.thisInfinityRealTime.totalMinutes <= 1,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => $t("achievement_55_reward", format(5e10)),
    effect: 5e10
  },
  {
    id: 56,
    description: () => $t("achievement_56_tooltip", formatInt(3)),
    checkRequirement: () => NormalChallenge(2).isOnlyActiveChallenge && Time.thisInfinityRealTime.totalMinutes <= 3,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => $t("achievement_56_reward", formatInt(3)),
    effect: () => Math.max(6 / (Time.thisInfinity.totalMinutes + 3), 1),
    effectCondition: () => Time.thisInfinity.totalMinutes < 3,
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 57,
    description: () => $t("achievement_57_tooltip", formatInt(3)),
    checkRequirement: () => NormalChallenge(8).isOnlyActiveChallenge && Time.thisInfinityRealTime.totalMinutes <= 3,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward() {
      return `${$t("achievement_57_reward")}
      ${Sacrifice.getSacrificeDescription({ "Achievement32": true, "Achievement57": false, "Achievement88": false })} ➜
      ${Sacrifice.getSacrificeDescription({ "Achievement32": true, "Achievement57": true, "Achievement88": false })}`;
    },
    effect: 0.1
  },
  {
    id: 58,
    description: () => $t("achievement_58_tooltip", formatInt(3)),
    checkRequirement: () => NormalChallenge(9).isOnlyActiveChallenge && Time.thisInfinityRealTime.totalMinutes <= 3,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => $t("achievement_58_reward", formatInt(10), formatPercents(0.01)),
    effect: 1.01
  },
  {
    id: 61,
    description: () => $t("achievement_61_tooltip", formatInt(Autobuyer.antimatterDimension.bulkCap)),
    checkRequirement: () => Autobuyer.antimatterDimension.zeroIndexed.every(x => x.hasMaxedBulk),
    checkEvent: [GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT,
      GAME_EVENT.SAVE_CONVERTED_FROM_PREVIOUS_VERSION],
    reward: () => $t("achievement_61_reward")
  },
  {
    id: 62,
    description: () => $t("achievement_62_tooltip", format(DC.E8)),
    checkRequirement: () => Player.bestRunIPPM.exponent >= 8,
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER
  },
  {
    id: 63,
    description: () => $t("achievement_63_tooltip"),
    checkRequirement: () => Currency.infinityPower.gt(1),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 64,
    description: () => $t("achievement_77_tooltip"),
    checkRequirement: () => player.galaxies === 0 && DimBoost.purchasedBoosts === 0 && NormalChallenge.isRunning,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => $t("achievement_77_reward", formatPercents(0.25)),
    effect: 1.25
  },
  {
    id: 65,
    description: () => $t("achievement_65_tooltip", formatInt(3)),
    checkRequirement: () => Time.challengeSum.totalMinutes < 3,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER],
    reward: () => $t("achievement_65_reward", formatInt(3)),
    effect: () => (Player.isInAnyChallenge ? Math.max(4 / (Time.thisInfinity.totalMinutes + 1), 1) : 1),
    effectCondition: () => Player.isInAnyChallenge && Time.thisInfinity.totalMinutes < 3,
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 66,
    description: () => $t("achievement_66_tooltip", format(DC.E58)),
    checkRequirement: () => Tickspeed.current.exponent <= -55,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: () => $t("achievement_66_reward", formatX(1.02, 0, 2)),
    effect: 0.98
  },
  {
    id: 67,
    description: () => $t("achievement_67_tooltip"),
    checkRequirement: () => InfinityChallenges.completed.length > 0,
    checkEvent: [GAME_EVENT.INFINITY_CHALLENGE_COMPLETED, GAME_EVENT.REALITY_RESET_AFTER]
  },
  {
    id: 68,
    description: () => $t("achievement_68_tooltip", formatInt(10)),
    checkRequirement: () => NormalChallenge(3).isOnlyActiveChallenge && Time.thisInfinityRealTime.totalSeconds <= 10,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => $t("achievement_68_reward", formatPercents(0.5)),
    effect: 1.5
  },
  {
    id: 71,
    description: () => $t("achievement_71_tooltip", formatInt(1)),
    checkRequirement: () =>
      NormalChallenge(2).isOnlyActiveChallenge &&
      AntimatterDimension(1).amount.eq(1) &&
      DimBoost.purchasedBoosts === 0 &&
      player.galaxies === 0,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => $t("achievement_71_reward", formatInt(3)),
    effect: 3
  },
  {
    id: 72,
    description: () => $t("achievement_72_tooltip", formatX(Decimal.NUMBER_MAX_VALUE, 1)),
    checkRequirement: () => AntimatterDimensions.all.every(x => x.multiplier.gte(Decimal.NUMBER_MAX_VALUE)),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: () => $t("achievement_72_reward", formatPercents(0.1)),
    effect: 1.1
  },
  {
    id: 73,
    description: () => $t("achievement_73_tooltip", formatPostBreak(DC.D9_9999E9999, 4)),
    checkRequirement: () => Currency.antimatter.gte(DC.D9_9999E9999),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    effect: () => Currency.antimatter.value.pow(0.00002).plus(1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    id: 74,
    description: () => $t("achievement_74_tooltip", formatInt(5)),
    checkRequirement: () => Time.challengeSum.totalSeconds < 5,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER],
    reward: () => $t("achievement_74_reward", formatPercents(0.4)),
    effect: 1.4,
    effectCondition: () => Player.isInAnyChallenge
  },
  {
    id: 75,
    description: () => $t("achievement_75_tooltip"),
    checkRequirement: () => InfinityDimension(4).isUnlocked,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    effect: () => Achievements.power
  },
  {
    id: 76,
    description: () => $t("achievement_76_tooltip", formatInt(8)),
    checkRequirement: () => Time.totalTimePlayed.totalDays >= 8,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: () => $t("achievement_76_reward"),
    effect: () => Math.max(Math.pow(Time.totalTimePlayed.totalDays / 2, 0.05), 1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    id: 77,
    description: () => $t("achievement_64_tooltip", format(1e6)),
    checkRequirement: () => Currency.infinityPower.exponent >= 6,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 78,
    description: () => $t("achievement_78_tooltip", formatInt(250)),
    checkRequirement: () => Time.thisInfinityRealTime.totalMilliseconds <= 250,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => $t("achievement_78_reward", format(5e25)),
    effect: 5e25
  },
  {
    id: 81,
    description: () => $t("achievement_81_tooltip", formatInt(15)),
    checkRequirement: () => InfinityChallenge(5).isRunning && Time.thisInfinityRealTime.totalSeconds <= 15,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE
  },
  {
    id: 82,
    description: () => $t("achievement_82_tooltip", formatInt(8)),
    checkRequirement: () => InfinityChallenges.completed.length === 8,
    checkEvent: [GAME_EVENT.INFINITY_CHALLENGE_COMPLETED, GAME_EVENT.REALITY_RESET_AFTER],
  },
  {
    id: 83,
    description: () => $t("achievement_83_tooltip", formatInt(50)),
    checkRequirement: () => player.galaxies >= 50,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    reward: () => $t("achievement_83_reward", formatPercents(0.05)),
    effect: () => DC.D0_95.pow(player.galaxies),
    formatEffect: value => `${formatX(value.recip(), 2, 2)}`
  },
  {
    id: 84,
    description: () => $t("achievement_84_tooltip", formatPostBreak("1e35000")),
    checkRequirement: () => Currency.antimatter.exponent >= 35000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    effect: () => Currency.antimatter.value.pow(0.00002).plus(1),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 85,
    description: () => $t("achievement_85_tooltip", format(DC.E150)),
    checkRequirement: () => gainedInfinityPoints().exponent >= 150,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => $t("achievement_85_reward", formatX(4)),
    effect: 4
  },
  {
    id: 86,
    description: () => $t("achievement_86_tooltip", formatX(1000)),
    checkRequirement: () => Tickspeed.multiplier.recip().gte(1000),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: () => $t("achievement_86_reward", formatPercents(0.01)),
    effect: 1.01
  },
  {
    id: 87,
    description: () => $t("achievement_87_tooltip", format(DC.D2E6)),
    checkRequirement: () => Currency.infinities.gt(DC.D2E6),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: () => $t("achievement_87_reward", formatInt(5), formatX(250)),
    effect: 250,
    effectCondition: () => Time.thisInfinity.totalSeconds > 5
  },
  {
    id: 88,
    description: () => $t("achievement_88_tooltip", formatX(Decimal.NUMBER_MAX_VALUE, 1, 0)),
    checkRequirement: () => Sacrifice.nextBoost.gte(Decimal.NUMBER_MAX_VALUE),
    checkEvent: GAME_EVENT.SACRIFICE_RESET_BEFORE,
    reward() {
      return `${$t("achievement_88_reward")}
      ${Sacrifice.getSacrificeDescription({ "Achievement32": true, "Achievement57": true, "Achievement88": false })} ➜
      ${Sacrifice.getSacrificeDescription({ "Achievement32": true, "Achievement57": true, "Achievement88": true })}`;
    },
    effect: 0.1
  },
  {
    id: 91,
    description: () => $t("achievement_91_tooltip", format(DC.E200), formatInt(2)),
    checkRequirement: () => gainedInfinityPoints().exponent >= 200 && Time.thisInfinityRealTime.totalSeconds <= 2,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => $t("achievement_91_reward", formatInt(5)),
    effect: () => Math.max((5 - Time.thisInfinity.totalSeconds) * 60, 1),
    effectCondition: () => Time.thisInfinity.totalSeconds < 5,
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 92,
    description: () => $t("achievement_92_tooltip", format(DC.E250), formatInt(20)),
    checkRequirement: () => gainedInfinityPoints().exponent >= 250 && Time.thisInfinityRealTime.totalSeconds <= 20,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => $t("achievement_92_reward", formatInt(60)),
    effect: () => Math.max((1 - Time.thisInfinity.totalMinutes) * 100, 1),
    effectCondition: () => Time.thisInfinity.totalMinutes < 1,
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 93,
    description: () => $t("achievement_93_tooltip", format(DC.E300)),
    checkRequirement: () => gainedInfinityPoints().exponent >= 300,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => $t("achievement_93_reward", formatX(4)),
    effect: 4
  },
  {
    id: 94,
    description: () => $t("achievement_94_tooltip", format(DC.E260)),
    checkRequirement: () => Currency.infinityPower.exponent >= 260,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    effect: 2
  },
  {
    id: 95,
    description: () => $t("achievement_95_tooltip", format(Decimal.NUMBER_MAX_VALUE, 1, 0), formatInt(1)),
    reward: () => $t("achievement_95_reward", formatInt(1)),
    checkRequirement: () =>
      (Replicanti.amount.eq(Decimal.NUMBER_MAX_VALUE) || player.replicanti.galaxies > 0) &&
      Time.thisInfinityRealTime.totalHours <= 1,
    checkEvent: GAME_EVENT.REPLICANTI_TICK_AFTER
  },
  {
    id: 96,
    description: () => $t("achievement_96_tooltip"),
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 97,
    description: () => $t("achievement_97_tooltip", format(6.66, 2, 2)),
    checkRequirement: () => Time.infinityChallengeSum.totalSeconds < 6.66,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER],
  },
  {
    id: 98,
    description: () => $t("achievement_98_tooltip"),
    checkRequirement: () => InfinityDimension(8).isUnlocked,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 101,
    description: () => $t("achievement_101_tooltip"),
    checkRequirement: () => player.requirementChecks.eternity.onlyAD8,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 102,
    description: () => $t("achievement_102_tooltip"),
    checkRequirement: () => EternityMilestone.all.every(m => m.isReached),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 103,
    description: () => $t("achievement_103_tooltip", formatPostBreak(DC.D9_99999E999, 5, 0)),
    checkRequirement: () => Currency.infinityPoints.exponent >= 1000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: () => $t("achievement_103_reward", formatInt(308), formatFloat(307.8, 1)),
    effect: 307.8
  },
  {
    id: 104,
    description: () => $t("achievement_104_tooltip", formatInt(30)),
    checkRequirement: () => Time.thisEternity.totalSeconds <= 30,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    reward: () => $t("achievement_104_reward", format(5e25)),
    effect: 5e25
  },
  {
    id: 105,
    description: () => $t("achievement_105_tooltip", formatInt(308)),
    checkRequirement: () => player.totalTickGained >= 308,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    effect: () => Tickspeed.perSecond.pow(0.000005),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 106,
    description: () => $t("achievement_106_tooltip", formatInt(10), formatInt(15)),
    checkRequirement: () => Replicanti.galaxies.total >= 10 && Time.thisInfinity.totalSeconds <= 15,
    checkEvent: GAME_EVENT.REPLICANTI_TICK_AFTER
  },
  {
    id: 107,
    description: () => $t("achievement_107_tooltip", formatInt(10)),
    checkRequirement: () => Currency.infinities.lt(10),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 108,
    description: () => $t("achievement_108_tooltip", formatInt(9)),
    checkRequirement: () => Replicanti.amount.round().eq(9),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 111,
    description: () => $t("achievement_111_tooltip", formatInt(10), format(Decimal.NUMBER_MAX_VALUE, 1, 0)),
    checkRequirement: () => {
      if (player.records.recentInfinities.some(i => i[0] === Number.MAX_VALUE)) return false;
      const infinities = player.records.recentInfinities.map(run => run[2]);
      for (let i = 0; i < infinities.length - 1; i++) {
        if (infinities[i].lt(infinities[i + 1].times(Decimal.NUMBER_MAX_VALUE))) return false;
      }
      return true;
    },
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER,
    reward: () => $t("achievement_111_reward")
  },
  {
    id: 112,
    description: () => $t("achievement_112_tooltip", formatInt(750)),
    checkRequirement: () => Time.infinityChallengeSum.totalMilliseconds < 750,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER]
  },
  {
    id: 113,
    description: () => $t("achievement_124_tooltip", formatInt(250)),
    checkRequirement: () => Time.thisEternity.totalMilliseconds <= 250,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    reward: () => $t("achievement_124_reward", formatX(2)),
    effect: 2,
  },
  {
    id: 114,
    description: () => $t("achievement_114_tooltip"),
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.CHALLENGE_FAILED,
    reward: () => $t("achievement_114_reward"),
  },
  {
    id: 115,
    description: () => $t("achievement_115_tooltip"),
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 116,
    description: () => $t("achievement_116_tooltip", formatInt(1)),
    checkRequirement: () => Currency.infinities.lte(1),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    effect: () => Decimal.pow(Currency.infinitiesTotal.value.clampMin(1), LOG10_2 / 4).powEffectOf(TimeStudy(31)),
    cap: () => Effarig.eternityCap,
    formatEffect: value => {
      // Since TS31 is already accounted for in the effect prop, we need to "undo" it to display the base value here
      const mult = formatX(value, 2, 2);
      return TimeStudy(31).canBeApplied
        ? mult
        : mult;
    }
  },
  {
    id: 117,
    description: () => $t("achievement_117_tooltip", formatInt(750)),
    checkRequirement: ([bulk]) => bulk >= 750,
    checkEvent: GAME_EVENT.DIMBOOST_AFTER,
    reward: () => $t("achievement_117_reward", formatPercents(0.01)),
    effect: 1.01
  },
  {
    id: 118,
    description: () => $t("achievement_118_tooltip", formatPostBreak(DC.E9000)),
    checkRequirement: () => Sacrifice.totalBoost.exponent >= 9000,
    checkEvent: GAME_EVENT.SACRIFICE_RESET_AFTER,
    reward: () => $t("achievement_118_reward"),
  },
  {
    id: 121,
    description: () => $t("achievement_121_tooltip", formatPostBreak("1e30008")),
    checkRequirement: () => Currency.infinityPoints.exponent >= 30008,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 122,
    description: () => $t("achievement_122_tooltip"),
    checkRequirement: () => player.requirementChecks.eternity.onlyAD1,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 123,
    description: () => $t("achievement_123_tooltip", formatInt(50)),
    checkRequirement: () => EternityChallenges.completions >= 50,
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER
  },
  {
    id: 124,
    description: () => $t("achievement_113_tooltip", formatInt(60)),
    checkRequirement: () => AchievementTimers.marathon2
      .check(
        !EternityChallenge(7).isRunning &&
        InfinityDimension(1).productionPerSecond.gt(Currency.infinityPower.value),
        60
      ),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 125,
    description: () => $t("achievement_125_tooltip", format(DC.E90)),
    checkRequirement: () => Currency.infinityPoints.exponent >= 90 &&
      player.requirementChecks.eternity.noAD1 && Currency.infinities.eq(0),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    effect() {
      const thisInfinity = Time.thisInfinity.totalSeconds * 10 + 1;
      return DC.D2.pow(Math.log(thisInfinity) * Math.min(Math.pow(thisInfinity, 0.11), 500));
    },
    cap: () => Effarig.eternityCap,
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 126,
    description: () => $t("achievement_126_tooltip", formatInt(180)),
    checkRequirement: () => Replicanti.galaxies.total >= 180 * player.galaxies && player.galaxies > 0,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: () => $t("achievement_126_reward", format(Decimal.NUMBER_MAX_VALUE, 1, 0), formatInt(1))
  },
  {
    id: 127,
    description: () => $t("achievement_127_tooltip", format(Decimal.NUMBER_MAX_VALUE, 1, 0)),
    checkRequirement: () => Currency.eternityPoints.gte(Decimal.NUMBER_MAX_VALUE),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 128,
    description: () => $t("achievement_128_tooltip", formatPostBreak("1e22000")),
    checkRequirement: () => Currency.infinityPoints.exponent >= 22000 && player.timestudy.studies.length === 0,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    effect: () => Math.max(player.timestudy.studies.length, 1),
    formatEffect: value => `${formatX(value)}`
  },
  {
    id: 131,
    description: () => $t("achievement_131_tooltip", format(DC.D2E9)),
    checkRequirement: () => Currency.infinitiesBanked.gt(DC.D2E9),
    checkEvent: [GAME_EVENT.ETERNITY_RESET_AFTER, GAME_EVENT.SAVE_CONVERTED_FROM_PREVIOUS_VERSION],
    reward: () => $t("achievement_131_tooltip", formatX(2), formatPercents(0.05)),
    effects: {
      infinitiesGain: 2,
      bankedInfinitiesGain: () => Currency.infinities.value.times(0.05).floor()
    }

  },
  {
    id: 132,
    description: () => $t("achievement_132_tooltip", formatInt(569)),
    checkRequirement: () => player.galaxies >= 569 && player.requirementChecks.eternity.noRG,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    effect: () => 1.22 * Math.max(Math.pow(player.galaxies, 0.04), 1),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 133,
    description: () => $t("achievement_133_tooltip", formatPostBreak(DC.E200000), formatX(2)),
    checkRequirement: () =>
      Array.dimensionTiers.map(InfinityDimension).every(dim => dim.baseAmount === 0) &&
      player.IPMultPurchases === 0 &&
      Currency.infinityPoints.exponent >= 200000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: () => $t("achievement_133_reward")
  },
  {
    id: 134,
    description: () => $t("achievement_134_tooltip", formatPostBreak(DC.E18000)),
    checkRequirement: () => Replicanti.amount.exponent >= 18000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: () => $t("achievement_134_reward", formatInt(2), format(replicantiCap(), 1))
  },
  {
    id: 135,
    description: () => $t("achievement_135_tooltip", formatPostBreak("1e8296262")),
    checkRequirement: () => Tickspeed.current.exponent <= -8296262,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 136,
    description: () => $t("achievement_136_tooltip"),
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 137,
    description: () => $t("achievement_137_tooltip", formatPostBreak("1e260000"), formatInt(1)),
    checkRequirement: () =>
      Currency.antimatter.exponent >= 260000 &&
      Time.thisEternity.totalMinutes <= 1 &&
      player.dilation.active,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: () => $t("achievement_137_reward", formatX(2)),
    effect: () => (player.dilation.active ? 2 : 1),
  },
  {
    id: 138,
    description: () => $t("achievement_138_tooltip", formatPostBreak("1e26000")),
    checkRequirement: () =>
      player.timestudy.studies.length === 0 &&
      player.dilation.active &&
      Currency.infinityPoints.exponent >= 26000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: () => $t("achievement_138_reward", formatInt(131), formatInt(133))
  },
  {
    id: 141,
    description: () => $t("achievement_141_tooltip"),
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    reward: () => $t("achievement_141_reward", formatX(4), formatInt(10), format(0.1, 0, 1)),
    effects: {
      ipGain: 4,
      buyTenMult: 0.1
    }
  },
  {
    id: 142,
    description: () => $t("achievement_142_tooltip"),
    checkRequirement: () => Player.automatorUnlocked,
    checkEvent: [GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_BOUGHT, GAME_EVENT.PERK_BOUGHT,
      GAME_EVENT.BLACK_HOLE_UNLOCKED],
    reward: () => $t("achievement_142_reward", formatPercents(0.5)),
    effect: 1.5,
  },
  {
    id: 143,
    description: () => $t("achievement_143_tooltip", formatInt(10), format(Decimal.NUMBER_MAX_VALUE, 1, 0)),
    checkRequirement: () => {
      if (player.records.recentEternities.some(i => i[0] === Number.MAX_VALUE)) return false;
      const eternities = player.records.recentEternities.map(run => run[2]);
      for (let i = 0; i < eternities.length - 1; i++) {
        if (eternities[i].lt(eternities[i + 1].times(Decimal.NUMBER_MAX_VALUE))) return false;
      }
      return true;
    },
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    reward: () => $t("achievement_143_reward")
  },
  {
    id: 144,
    description: () => $t("achievement_144_tooltip"),
    checkRequirement: () => BlackHole(1).isUnlocked,
    checkEvent: GAME_EVENT.BLACK_HOLE_UNLOCKED,
  },
  {
    id: 145,
    description: () => $t("achievement_145_tooltip"),
    checkRequirement: () => BlackHoles.list.some(bh => bh.interval < bh.duration),
    checkEvent: GAME_EVENT.BLACK_HOLE_UPGRADE_BOUGHT,
    reward: () => $t("achievement_145_reward", formatPercents(0.1)),
    effect: 0.9
  },
  {
    id: 146,
    description: () => $t("achievement_146_tooltip"),
    checkRequirement: () => player.reality.perks.size === Perks.all.length,
    checkEvent: GAME_EVENT.PERK_BOUGHT,
    reward: () => $t("achievement_146_reward", formatPercents(0.01)),
    effect: 1
  },
  {
    id: 147,
    description: () => $t("achievement_147_tooltip"),
    checkRequirement: () => RealityUpgrades.allBought,
    checkEvent: GAME_EVENT.REALITY_UPGRADE_BOUGHT,
    reward: () => $t("achievement_147_reward")
  },
  {
    id: 148,
    description: () => $t("achievement_148_tooltip"),
    checkRequirement: () => BASIC_GLYPH_TYPES
      .every(type => Glyphs.activeList.some(g => g.type === type)),
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    effect: () => (new Set(Glyphs.activeWithoutCompanion.map(g => g.type))).size,
    formatEffect: value => `+${formatInt(value)}`
  },
  {
    id: 151,
    description: () => $t("achievement_151_tooltip", formatInt(800)),
    checkRequirement: () => player.galaxies >= 800 && player.requirementChecks.infinity.noAD8,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    reward: () => $t("achievement_151_reward")
  },
  {
    id: 152,
    description: () => $t("achievement_152_tooltip", formatInt(100)),
    checkRequirement: () => Glyphs.inventoryList.length >= 100,
    checkEvent: GAME_EVENT.GLYPHS_CHANGED
  },
  {
    id: 153,
    description: () => $t("achievement_153_tooltip"),
    checkRequirement: () => player.requirementChecks.reality.noAM,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
  },
  {
    id: 154,
    description: () => $t("achievement_154_tooltip", formatInt(5)),
    checkRequirement: () => Time.thisReality.totalSeconds <= 5,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    reward: () => $t("achievement_154_tooltip", formatPercents(0.1), formatX(2)),
    effect: 0.1
  },
  {
    id: 155,
    description: () => $t("achievement_155_tooltip", format(1.37e10, 2)),
    checkRequirement: () => Time.totalTimePlayed.totalYears > 13.7e9,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: () => $t("achievement_155_reward", formatPercents(0.1)),
    effect: 1.1
  },
  {
    id: 156,
    description: () => $t("achievement_156_tooltip"),
    checkRequirement: () => player.requirementChecks.reality.noPurchasedTT,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    reward: () => $t("achievement_156_reward", formatX(2.5, 0, 1)),
    effect: 2.5
  },
  {
    id: 157,
    description: () => $t("achievement_157_tooltip", formatInt(4)),
    checkRequirement: () => Glyphs.activeList.concat(Glyphs.inventoryList).map(
      glyph => getGlyphEffectsFromBitmask(glyph.effects, 0, 0)
        .filter(effect => effect.isGenerated).length
    ).max() >= 4,
    checkEvent: GAME_EVENT.GLYPHS_CHANGED
  },
  {
    id: 158,
    description: () => $t("achievement_158_tooltip"),
    checkRequirement: () => BlackHole(1).isPermanent && BlackHole(2).isPermanent,
    checkEvent: GAME_EVENT.BLACK_HOLE_UPGRADE_BOUGHT,
    reward: () => $t("achievement_158_reward", formatPercents(0.1)),
    effect: 1.1
  },
  {
    id: 161,
    description: () => $t("achievement_161_tooltip", formatPostBreak(DC.E1E8)),
    checkRequirement: () => Currency.antimatter.exponent >= 100000000 && player.dilation.active,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 162,
    description: () => $t("achievement_162_tooltip"),
    checkRequirement: () => player.timestudy.studies.length >= 58,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 163,
    description: () => $t("achievement_163_tooltip", formatInt(5), formatInt(1)),
    checkRequirement: () => EternityChallenges.all.map(ec => ec.completions).min() >= 5 &&
      Time.thisReality.totalSeconds <= 1,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 164,
    description: () => $t("achievement_164_tooltip", format(Decimal.NUMBER_MAX_VALUE, 1)),
    checkRequirement: () => Currency.infinitiesTotal.gte(Decimal.NUMBER_MAX_VALUE),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: () => $t("achievement_164_reward", formatInt(1024)),
    effect: 1024
  },
  {
    id: 165,
    description: () => $t("achievement_165_tooltip", formatInt(5000)),
    checkRequirement: () => gainedGlyphLevel().actualLevel >= 5000 &&
      ["repl", "dt", "eternities"].every(
        i => player.celestials.effarig.glyphWeights[i] === player.celestials.effarig.glyphWeights.ep),
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    reward: () => $t("achievement_165_reward"),
  },
  {
    id: 166,
    description: () => $t("achievement_166_tooltip", formatInt(6969)),
    checkRequirement: () => gainedGlyphLevel().actualLevel === 6969,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    reward: () => $t("achievement_166_reward", formatInt(69)),
    effect: 69
  },
  {
    id: 167,
    description: () => $t("achievement_167_tooltip", format(Decimal.NUMBER_MAX_VALUE, 1, 0)),
    checkRequirement: () => Currency.realityMachines.gte(Decimal.NUMBER_MAX_VALUE),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    effect: () => Math.clampMin(1, Currency.realityMachines.value.log2()),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 168,
    description: () => $t("achievement_168_tooltip", formatInt(50)),
    checkRequirement: () => Ra.totalPetLevel >= 50,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: () => $t("achievement_168_reward", formatPercents(0.1)),
    effect: 1.1
  },
  {
    id: 171,
    description: () => $t("achievement_171_tooltip"),
    checkRequirement: () => Object.values(player.reality.glyphs.sac).every(s => s > 0),
    checkEvent: GAME_EVENT.GLYPHS_CHANGED,
    reward: () => $t("achievement_171_reward", formatX(2)),
    effect: 2,
  },
  {
    id: 172,
    description: () => $t("achievement_172_tooltip", format(Decimal.NUMBER_MAX_VALUE, 1)),
    checkRequirement: () => MachineHandler.gainedRealityMachines.gte(Decimal.NUMBER_MAX_VALUE) &&
      player.celestials.ra.charged.size === 0 && Glyphs.activeWithoutCompanion.length === 0 &&
      player.requirementChecks.reality.noTriads,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
  },
  {
    id: 173,
    description: () => $t("achievement_173_tooltip", formatPostBreak(DC.D9_99999E999, 5, 0)),
    checkRequirement: () => player.reality.realityMachines.gte(DC.D9_99999E999),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 174,
    checkRequirement: () => true,
    description: () => $t("achievement_174_tooltip"),
    checkEvent: GAME_EVENT.SINGULARITY_RESET_BEFORE
  },
  {
    id: 175,
    description: () => $t("achievement_175_tooltip", formatInt(Ra.alchemyResourceCap)),
    checkRequirement: () => AlchemyResources.all.every(x => x.amount >= Ra.alchemyResourceCap),
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER,
    reward: () => $t("achievement_175_reward", formatPercents(1), formatX(10)),
    effect: 10,
  },
  {
    id: 176,
    description: () => $t("achievement_176_tooltip"),
  },
  {
    id: 177,
    description: () => $t("achievement_177_tooltip"),
    checkRequirement: () => SingularityMilestones.all.every(x => x.completions > 0),
    checkEvent: GAME_EVENT.SINGULARITY_RESET_AFTER,
  },
  {
    id: 178,
    description: () => $t("achievement_178_tooltip"),
    description: () => $t("achievement_178_tooltip", formatInt(100000)),
    checkRequirement: () => player.galaxies >= 100000,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    reward: () => $t("achievement_178_reward", formatPercents(0.01)),
    effect: 1.01
  },
  {
    id: 181,
    description: () => $t("achievement_181_tooltip"),
    displayId: 666,
    checkRequirement: () => Pelle.isDoomed,
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER,
  },
  {
    id: 182,
    description: () => $t("achievement_182_tooltip"),
    checkRequirement: () => PelleUpgrade.antimatterDimAutobuyers1.canBeApplied &&
      PelleUpgrade.antimatterDimAutobuyers2.canBeApplied,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 183,
    description: () => $t("achievement_183_tooltip"),
    checkRequirement: () => Pelle.isDoomed && InfinityChallenge(5).isCompleted,
    checkEvent: GAME_EVENT.INFINITY_CHALLENGE_COMPLETED,
    // Weirdly specific reward? Yes, its V's ST bonus because we forgot to disable it
    // when balancing Pelle and only realised too late.
    reward: () => $t("achievement_183_reward", formatPow(1.0812403840463596, 0, 3)),
    effect: 1.0812403840463596
  },
  {
    id: 184,
    description: () => $t("achievement_184_tooltip"),
    checkRequirement: () => PelleStrikes.eternity.hasStrike,
    checkEvent: GAME_EVENT.PELLE_STRIKE_UNLOCKED
  },
  {
    id: 185,
    description: () => $t("achievement_185_tooltip"),
    checkRequirement: () => PelleStrikes.ECs.hasStrike,
    checkEvent: GAME_EVENT.PELLE_STRIKE_UNLOCKED
  },
  {
    id: 186,
    description: () => $t("achievement_186_tooltip"),
    displayId: 181,
  },
  {
    id: 187,
    description: () => $t("achievement_187_tooltip"),
    checkRequirement: () => PelleStrikes.dilation.hasStrike,
    checkEvent: GAME_EVENT.PELLE_STRIKE_UNLOCKED,
    // We forgot to disable a singularity milestone while balancing Pelle; now it's disabled
    // and this upgrade has the same effect as it used to.
    reward: () => $t("achievement_187_reward", formatX(1.35, 0, 2)),
    effect: 1.35
  },
  {
    id: 188,
    description: () => $t("achievement_188_tooltip"),
    checkRequirement: () => GameEnd.endState > END_STATE_MARKERS.GAME_END && !GameEnd.removeAdditionalEnd,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
];
