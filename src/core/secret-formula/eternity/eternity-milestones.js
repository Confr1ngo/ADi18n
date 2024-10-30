export const eternityMilestones = {
  autobuyerIPMult: {
    eternities: 1,
    reward: () => $t("milestone_1_eternity"),
    pelleUseless: true
  },
  keepAutobuyers: {
    eternities: 2,
    reward: () => $t("milestone_2_eternities"),
  },
  autobuyerReplicantiGalaxy: {
    eternities: 3,
    reward: () => $t("milestone_3_eternities"),
  },
  keepInfinityUpgrades: {
    eternities: 4,
    reward: () => $t("milestone_4_eternities"),
    givenByPelle: () => PelleUpgrade.keepInfinityUpgrades.isBought,
    pelleUseless: true
  },
  bigCrunchModes: {
    eternities: 5,
    reward: () => $t("milestone_5_eternities"),
  },
  autoEP: {
    eternities: 6,
    reward: () => {
      const EPmin = getOfflineEPGain(TimeSpan.fromMinutes(1).totalMilliseconds);
      const em200 = getEternitiedMilestoneReward(TimeSpan.fromHours(1).totalMilliseconds,
        EternityMilestone.autoEternities.isReached).gt(0);
      const em1000 = getInfinitiedMilestoneReward(TimeSpan.fromHours(1).totalMilliseconds,
        EternityMilestone.autoInfinities.isReached).gt(0);
      if (!player.options.offlineProgress) return $t("milestone_6_eternities_b");
      const effectText = (em200 || em1000) ? $t("disabled") : $t("milestone_6_eternities_reward", format(EPmin, 2, 2));
      return `${$t("milestone_6_eternities", formatPercents(0.25))} (${effectText})`;
    },
    activeCondition: () => (player.options.offlineProgress
      ? `当里程碑 ${formatInt(200)} 和 ${formatInt(1000)} 均未生效时，该里程碑将生效`
      : ""),
  },
  autoIC: {
    eternities: 7,
    reward: () => $t("milestone_7_eternities"),
    pelleUseless: true
  },
  keepBreakUpgrades: {
    eternities: 8,
    reward: () => $t("milestone_8_eternities"),
    givenByPelle: () => PelleUpgrade.keepBreakInfinityUpgrades.isBought,
    pelleUseless: true
  },
  autobuyMaxGalaxies: {
    eternities: 9,
    reward: () => $t("milestone_9_eternities"),
  },
  unlockReplicanti: {
    eternities: 10,
    reward: () => $t("milestone_10_eternities"),
    givenByPelle: () => PelleUpgrade.replicantiStayUnlocked.isBought,
    pelleUseless: true
  },
  autobuyerID1: {
    eternities: 11,
    reward: () => $t("milestone_11_eternities"),
    givenByPelle: () => PelleUpgrade.IDAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerID2: {
    eternities: 12,
    reward: () => $t("milestone_12_eternities"),
    givenByPelle: () => PelleUpgrade.IDAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerID3: {
    eternities: 13,
    reward: () => $t("milestone_13_eternities"),
    givenByPelle: () => PelleUpgrade.IDAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerID4: {
    eternities: 14,
    reward: () => $t("milestone_14_eternities"),
    givenByPelle: () => PelleUpgrade.IDAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerID5: {
    eternities: 15,
    reward: () => $t("milestone_15_eternities"),
    givenByPelle: () => PelleUpgrade.IDAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerID6: {
    eternities: 16,
    reward: () => $t("milestone_16_eternities"),
    givenByPelle: () => PelleUpgrade.IDAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerID7: {
    eternities: 17,
    reward: () => $t("milestone_17_eternities"),
    givenByPelle: () => PelleUpgrade.IDAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerID8: {
    eternities: 18,
    reward: () => $t("milestone_18_eternities"),
    givenByPelle: () => PelleUpgrade.IDAutobuyers.isBought,
    pelleUseless: true
  },
  autoUnlockID: {
    eternities: 25,
    reward: () => $t("milestone_25_eternities")
  },
  unlockAllND: {
    eternities: 30,
    reward: () => $t("milestone_30_eternities")
  },
  replicantiNoReset: {
    eternities: 40,
    reward: () => $t("milestone_40_eternities"),
    pelleUseless: true
  },
  autobuyerReplicantiChance: {
    eternities: 50,
    reward: () => $t("milestone_50_eternities"),
    givenByPelle: () => PelleUpgrade.replicantiAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerReplicantiInterval: {
    eternities: 60,
    reward: () => $t("milestone_60_eternities"),
    givenByPelle: () => PelleUpgrade.replicantiAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerReplicantiMaxGalaxies: {
    eternities: 80,
    reward: () => $t("milestone_80_eternities"),
    givenByPelle: () => PelleUpgrade.replicantiAutobuyers.isBought,
    pelleUseless: true
  },
  autobuyerEternity: {
    eternities: 100,
    reward: "解锁永恒自动购买器"
  },
  autoEternities: {
    eternities: 200,
    reward: () => {
      if (!player.options.offlineProgress) return $t("milestone_6_eternities_b");
      const eternities = getEternitiedMilestoneReward(TimeSpan.fromHours(1).totalMilliseconds,
        player.eternities.gte(200));
      // As far as I can tell, using templates here as Codefactor wants would lead to nested templates,
      // which seems messy to say the least.
      const realTime = PlayerProgress.seenAlteredSpeed() ? " real-time" : "";
      // eslint-disable-next-line prefer-template
      return `当离线时，按你的最快永恒速度的 ${formatPercents(0.5)} 获取永恒次数` +
        (eternities.gt(0) ? `（当前 ${format(eternities, 2, 2)} 次每小时）` : "（未启用）");
    },
    activeCondition: () => (player.options.offlineProgress
      ? `必须处于挑战和时间膨胀外，且永恒自动购买器必须被设为 0 永恒点数。该里程碑最多 ${formatInt(33)} 毫秒触发一次。`
      : ""),
      pelleUseless: true
  },
  autoInfinities: {
    eternities: 1000,
    reward: () => {
      if (!player.options.offlineProgress) return $t("milestone_6_eternities_b");
      const infinities = getInfinitiedMilestoneReward(TimeSpan.fromHours(1).totalMilliseconds,
        player.eternities.gte(1000));
      // eslint-disable-next-line prefer-template
      return `当离线时，按你当前永恒的最快无限速度的 ${formatPercents(0.5)} 获取无限次数` +
        (infinities.gt(0) ? `（当前 ${format(infinities, 2, 2)} 次每小时）` : "（未启用）");
    },
    activeCondition: () => (player.options.offlineProgress
      ? `必须处于普通挑战、无限挑战、永恒挑战 4 和永恒挑战 12 之外。大坍缩自动购买器必须打开并设置间隔为小于等于 ${formatInt(5)} 秒，且必须关闭永恒自动购买器。`
      : ""),
      pelleUseless: true
  }
};
