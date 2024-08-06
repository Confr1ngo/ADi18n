const formatCost = c => format(c, 2);
// eslint-disable-next-line max-params
const expWithIncreasedScale = (base1, base2, incScale, coeff, x) =>
  Decimal.pow(base1, x).times(Decimal.pow(base2, x - incScale).max(1)).times(coeff);

const rebuyable = config => {
  const { id, description, cost, effect, formatEffect, cap } = config;
  return {
    id,
    description,
    cost: () => expWithIncreasedScale(...cost, player.celestials.pelle.rebuyables[id]),
    formatCost,
    cap,
    effect: (x = player.celestials.pelle.rebuyables[id]) => effect(x),
    formatEffect,
    rebuyable: true
  };
};

export const pelleUpgrades = {
  antimatterDimensionMult: rebuyable({
    id: "antimatterDimensionMult",
    description: () => $t("pelle_upgrade_rebuyable_0_description"),
    cost: [10, 1e3, 41, 100],
    effect: x => Pelle.antimatterDimensionMult(x),
    formatEffect: x => formatX(x, 2, 2),
    cap: 44
  }),
  timeSpeedMult: rebuyable({
    id: "timeSpeedMult",
    description: () => $t("pelle_upgrade_rebuyable_1_description"),
    cost: [20, 1e3, 30, 1e5],
    effect: x => Decimal.pow(1.3, x),
    formatEffect: x => formatX(x, 2, 2),
    cap: 35
  }),
  glyphLevels: rebuyable({
    id: "glyphLevels",
    description: () => $t("pelle_upgrade_rebuyable_2_description"),
    cost: [30, 1e3, 25, 1e15],
    effect: x => Math.floor(((3 * (x + 1)) - 2) ** 1.6),
    formatEffect: x => formatInt(x),
    cap: 26
  }),
  infConversion: rebuyable({
    id: "infConversion",
    description: () => $t("pelle_upgrade_rebuyable_3_description"),
    cost: [40, 1e3, 20, 1e18],
    effect: x => (x * 3.5) ** 0.37,
    formatEffect: x => `+${format(x, 2, 2)}`,
    cap: 21
  }),
  galaxyPower: rebuyable({
    id: "galaxyPower",
    description: () => $t("pelle_upgrade_rebuyable_4_description"),
    cost: [1000, 1e3, 10, 1e30],
    effect: x => 1 + x / 50,
    formatEffect: x => formatX(x, 2, 2),
    cap: 9
  }),
  antimatterDimAutobuyers1: {
    id: 0,
    description: () => $t("pelle_upgrade_0_description"),
    cost: 1e5,
    formatCost,
  },
  dimBoostAutobuyer: {
    id: 1,
    description: () => $t("pelle_upgrade_1_description"),
    cost: 5e5,
    formatCost,
  },
  keepAutobuyers: {
    id: 2,
    description: () => $t("pelle_upgrade_2_description"),
    cost: 5e6,
    formatCost,
  },
  antimatterDimAutobuyers2: {
    id: 3,
    description: () => $t("pelle_upgrade_3_description"),
    cost: 2.5e7,
    formatCost,
  },
  galaxyAutobuyer: {
    id: 4,
    description: () => $t("pelle_upgrade_4_description"),
    cost: 1e8,
    formatCost,
  },
  tickspeedAutobuyer: {
    id: 5,
    description: () => $t("pelle_upgrade_5_description"),
    cost: 1e9,
    formatCost,
  },
  keepInfinityUpgrades: {
    id: 6,
    description: () => $t("pelle_upgrade_6_description"),
    cost: 1e10,
    formatCost,
  },
  dimBoostResetsNothing: {
    id: 7,
    description: () => $t("pelle_upgrade_7_description"),
    cost: 1e11,
    formatCost,
  },
  keepBreakInfinityUpgrades: {
    id: 8,
    description: () => $t("pelle_upgrade_8_description"),
    cost: 1e12,
    formatCost,
  },
  IDAutobuyers: {
    id: 9,
    description: () => $t("pelle_upgrade_9_description"),
    cost: 1e14,
    formatCost,
  },
  keepInfinityChallenges: {
    id: 10,
    description: () => $t("pelle_upgrade_10_description"),
    cost: 1e15,
    formatCost,
  },
  galaxyNoResetDimboost: {
    id: 11,
    description: () => $t("pelle_upgrade_11_description"),
    cost: 1e16,
    formatCost
  },
  replicantiAutobuyers: {
    id: 12,
    description: () => $t("pelle_upgrade_12_description"),
    cost: 1e17,
    formatCost,
  },
  replicantiGalaxyNoReset: {
    id: 13,
    description: () => $t("pelle_upgrade_13_description"),
    cost: 1e19,
    formatCost,
  },
  eternitiesNoReset: {
    id: 14,
    description: () => $t("pelle_upgrade_14_description"),
    cost: 1e20,
    formatCost,
  },
  timeStudiesNoReset: {
    id: 15,
    description: () => $t("pelle_upgrade_15_description"),
    cost: 1e21,
    formatCost,
  },
  replicantiStayUnlocked: {
    id: 16,
    description: () => $t("pelle_upgrade_16_description"),
    cost: 1e22,
    formatCost,
  },
  keepEternityUpgrades: {
    id: 17,
    description: () => $t("pelle_upgrade_17_description"),
    cost: 1e24,
    formatCost,
  },
  TDAutobuyers: {
    id: 18,
    description: () => $t("pelle_upgrade_18_description"),
    cost: 1e25,
    formatCost,
  },
  keepEternityChallenges: {
    id: 19,
    description: () => $t("pelle_upgrade_19_description"),
    cost: 1e26,
    formatCost,
  },
  dilationUpgradesNoReset: {
    id: 20,
    description: () => $t("pelle_upgrade_20_description"),
    cost: 1e45,
    formatCost,
  },
  tachyonParticlesNoReset: {
    id: 21,
    description: () => $t("pelle_upgrade_21_description"),
    cost: 1e50,
    formatCost,
  },
  replicantiGalaxyEM40: {
    id: 22,
    description: () => $t("pelle_upgrade_22_description"),
    cost: 1e30,
    formatCost,
  }
};
