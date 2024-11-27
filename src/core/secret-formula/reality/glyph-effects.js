import { DC } from "../../constants.js";

export const GlyphCombiner = Object.freeze({
  /**
   * @param {number[]} x
   * @returns {number}
   */
  add: x => x.reduce(Number.sumReducer, 0),
  /**
   * @param {number[]} x
   * @returns {number}
   */
  multiply: x => x.reduce(Number.prodReducer, 1),
  /**
   * For exponents, the base value is 1, so when we add two exponents a and b we want to get a + b - 1,
   * so that if a and b are both close to 1 so is their sum. In general, when we add a list x of exponents,
   * we have to add 1 - x.length to the actual sum, so that if all the exponents are close to 1 the result
   * is also close to 1 rather than close to x.length.
   * @param {number[]} x
   * @returns {number}
   */
  addExponents: x => x.reduce(Number.sumReducer, 1 - x.length),
  /**
   * @param {Decimal[]} x
   * @returns {Decimal}
   */
  multiplyDecimal: x => x.reduce(Decimal.prodReducer, DC.D1)
});

export const glyphEffects = {
  timepow: {
    id: "timepow",
    bitmaskIndex: 0,
    isGenerated: true,
    glyphTypes: ["time"],
    singleDesc: () => $t("glyph_effect_12_single"),
    totalDesc: () => $t("glyph_effect_12_total"),
    shortDesc: () => $t("glyph_effect_12_short"),
    effect: (level, strength) => 1.01 + Math.pow(level, 0.32) * Math.pow(strength, 0.45) / 75,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
    enabledInDoomed: true,
  },
  timespeed: {
    id: "timespeed",
    bitmaskIndex: 1,
    isGenerated: true,
    glyphTypes: ["time"],
    singleDesc: () => $t("glyph_effect_13_single"),
    totalDesc: () => $t("glyph_effect_13_total"),
    genericDesc: () => $t("glyph_effect_13_generic"),
    shortDesc: () => $t("glyph_effect_13_short"),
    effect: (level, strength) => (GlyphAlteration.isEmpowered("time")
      ? 1 + Math.pow(level, 0.35)
      : 1 + Math.pow(level, 0.3) * Math.pow(strength, 0.65) / 20),
    formatEffect: x => format(x, 3, 3),
    combine: GlyphCombiner.multiply,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("time"),
    alterationType: ALTERATION_TYPE.EMPOWER,
    enabledInDoomed: true,
  },
  timeetermult: {
    id: "timeetermult",
    bitmaskIndex: 2,
    isGenerated: true,
    glyphTypes: ["time"],
    singleDesc: () => $t("glyph_effect_14_single"),
    totalDesc: () => $t("glyph_effect_14_total"),
    genericDesc: () => $t("glyph_effect_14_generic"),
    shortDesc: () => $t("glyph_effect_14_short"),
    effect: (level, strength) => Math.pow((strength + 3) * level, 0.9) *
      Math.pow(3, GlyphAlteration.sacrificeBoost("time")),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.multiply,
    alteredColor: () => GlyphAlteration.getBoostColor("time"),
    alterationType: ALTERATION_TYPE.BOOST
  },
  timeEP: {
    id: "timeEP",
    bitmaskIndex: 3,
    isGenerated: true,
    glyphTypes: ["time"],
    singleDesc: () => (GlyphAlteration.isAdded("time")
      ? $t("glyph_effect_15_single_altered")
      : $t("glyph_effect_15_single")),
    totalDesc: () => (GlyphAlteration.isAdded("time")
      ? $t("glyph_effect_15_total_altered")
      : $t("glyph_effect_15_total")),
    genericDesc: () => (GlyphAlteration.isAdded("time")
      ? $t("glyph_effect_15_generic_altered")
      : $t("glyph_effect_15_generic")),
    shortDesc: () => (GlyphAlteration.isAdded("time")
      ? $t("glyph_effect_15_short_altered")
      : $t("glyph_effect_15_short")),
    effect: (level, strength) => Math.pow(level * strength, 3) * 100,
    formatEffect: x => format(x, 2, 3),
    combine: GlyphCombiner.multiply,
    conversion: x => 1 + Math.log10(x) / 1000,
    formatSecondaryEffect: x => format(x, 4, 4),
    alteredColor: () => GlyphAlteration.getAdditionColor("time"),
    alterationType: ALTERATION_TYPE.ADDITION
  },
  dilationDT: {
    id: "dilationDT",
    bitmaskIndex: 4,
    isGenerated: true,
    glyphTypes: ["dilation"],
    singleDesc: () => $t("glyph_effect_16_single"),
    totalDesc: () => $t("glyph_effect_16_total"),
    shortDesc: () => $t("glyph_effect_16_short"),
    effect: (level, strength) => (GlyphAlteration.isEmpowered("dilation")
      ? DC.D1_005.pow(level).times(15)
      : Decimal.pow(level * strength, 1.5).times(2)),
    formatEffect: x => format(x, 2, 1),
    combine: GlyphCombiner.multiplyDecimal,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("dilation"),
    alterationType: ALTERATION_TYPE.EMPOWER
  },
  dilationgalaxyThreshold: {
    id: "dilationgalaxyThreshold",
    bitmaskIndex: 5,
    isGenerated: true,
    glyphTypes: ["dilation"],
    singleDesc: () => $t("glyph_effect_17_single"),
    genericDesc: () => $t("glyph_effect_17_generic"),
    shortDesc: () => $t("glyph_effect_17_short"),
    effect: (level, strength) => 1 - Math.pow(level, 0.17) * Math.pow(strength, 0.35) / 100 -
      GlyphAlteration.sacrificeBoost("dilation") / 50,
    formatEffect: x => format(x, 3, 3),
    alteredColor: () => GlyphAlteration.getBoostColor("dilation"),
    alterationType: ALTERATION_TYPE.BOOST,
    combine: effects => {
      const prod = effects.reduce(Number.prodReducer, 1);
      return prod < 0.4
        ? { value: 0.4 - Math.pow(0.4 - prod, 1.7), capped: true }
        : { value: prod, capped: false };
    },
    enabledInDoomed: true,
  },
  dilationTTgen: {
    // TTgen slowly generates TT, value amount is per second, displayed per hour
    id: "dilationTTgen",
    bitmaskIndex: 6,
    isGenerated: true,
    glyphTypes: ["dilation"],
    singleDesc: () => (GlyphAlteration.isAdded("dilation")
      ? $t("glyph_effect_18_single_altered")
      : $t("glyph_effect_18_single")),
    totalDesc: () => (GlyphAlteration.isAdded("dilation")
      ? $t("glyph_effect_18_total_altered")
      : $t("glyph_effect_18_total")),
    genericDesc: () => (GlyphAlteration.isAdded("dilation")
      ? $t("glyph_effect_18_generic_altered")
      : $t("glyph_effect_18_generic")),
    shortDesc: () => (GlyphAlteration.isAdded("dilation")
      ? $t("glyph_effect_18_short_altered")
      : $t("glyph_effect_18_short")),
    effect: (level, strength) => Math.pow(level * strength, 0.5) / 10000,
    /** @type {function(number): string} */
    formatEffect: x => format(3600 * x, 2, 2),
    combine: GlyphCombiner.add,
    conversion: x => Math.clampMin(Math.pow(10000 * x, 1.6), 1),
    formatSecondaryEffect: x => format(x, 2, 2),
    alteredColor: () => GlyphAlteration.getAdditionColor("dilation"),
    alterationType: ALTERATION_TYPE.ADDITION
  },
  dilationpow: {
    id: "dilationpow",
    bitmaskIndex: 7,
    isGenerated: true,
    glyphTypes: ["dilation"],
    singleDesc: () => $t("glyph_effect_19_single"),
    totalDesc: () => $t("glyph_effect_19_total"),
    genericDesc: () => $t("glyph_effect_19_generic"),
    shortDesc: () => $t("glyph_effect_19_short"),
    effect: (level, strength) => 1.1 + Math.pow(level, 0.7) * Math.pow(strength, 0.7) / 25,
    formatEffect: x => format(x, 2, 2),
    formatSingleEffect: x => format(x - 1, 2, 2),
    combine: GlyphCombiner.addExponents,
    enabledInDoomed: true,
  },
  replicationspeed: {
    id: "replicationspeed",
    bitmaskIndex: 8,
    isGenerated: true,
    glyphTypes: ["replication"],
    singleDesc: () => $t("glyph_effect_8_single"),
    totalDesc: () => $t("glyph_effect_8_total"),
    genericDesc: () => $t("glyph_effect_8_generic"),
    shortDesc: () => $t("glyph_effect_8_short"),
    effect: (level, strength) => (GlyphAlteration.isEmpowered("replication")
      ? DC.D1_007.pow(level).times(10)
      : Decimal.times(level, strength).times(3)),
    formatEffect: x => format(x, 2, 1),
    combine: GlyphCombiner.multiplyDecimal,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("replication"),
    alterationType: ALTERATION_TYPE.EMPOWER
  },
  replicationpow: {
    id: "replicationpow",
    bitmaskIndex: 9,
    isGenerated: true,
    glyphTypes: ["replication"],
    singleDesc: () => $t("glyph_effect_9_single"),
    totalDesc: () => $t("glyph_effect_9_total"),
    shortDesc: () => $t("glyph_effect_9_short"),
    effect: (level, strength) => 1.1 + Math.pow(level, 0.5) * strength / 25 +
      GlyphAlteration.sacrificeBoost("replication") * 3,
    formatEffect: x => format(x, 2, 2),
    formatSingleEffect: x => format(x - 1, 2, 2),
    combine: GlyphCombiner.addExponents,
    alteredColor: () => GlyphAlteration.getBoostColor("replication"),
    alterationType: ALTERATION_TYPE.BOOST,
    enabledInDoomed: true,
  },
  replicationdtgain: {
    id: "replicationdtgain",
    bitmaskIndex: 10,
    isGenerated: true,
    glyphTypes: ["replication"],
    singleDesc: () => (GlyphAlteration.isAdded("replication")
      ? $t("glyph_effect_10_single_altered", format(DC.E10000))
      : $t("glyph_effect_10_single", format(DC.E10000))),
    totalDesc: () => (GlyphAlteration.isAdded("replication")
      ? $t("glyph_effect_10_total_altered")
      : $t("glyph_effect_10_total")),
    genericDesc: () => (GlyphAlteration.isAdded("replication")
      ? $t("glyph_effect_10_generic_altered")
      : $t("glyph_effect_10_generic")),
    shortDesc: () => (GlyphAlteration.isAdded("replication")
      ? $t("glyph_effect_10_short_altered", format(DC.E10000))
      : $t("glyph_effect_10_short", format(DC.E10000))),
    effect: (level, strength) => 0.0003 * Math.pow(level, 0.3) * Math.pow(strength, 0.65),
    formatEffect: x => format(10000 * x, 2, 2),
    formatSingleEffect: x => format(10000 * x, 2, 2),
    // It's bad to stack this one additively (N glyphs acts as a DT mult of N) or multiplicatively (the raw number is
    // less than 1), so instead we do a multiplicative stacking relative to the "base" effect of a level 1, 0% glyph.
    // We also introduce a 3x mult per glyph after the first, so that stacking level 1, 0% glyphs still has an effect.
    // This is still just a flat DT mult when stacking multiple glyphs, but at least it's bigger than 2 or 3.
    combine: effects => ({
      value: effects.length === 0 ? 0 : effects.reduce(Number.prodReducer, Math.pow(0.0001, 1 - effects.length)),
      capped: false
    }),
    conversion: x => x,
    formatSecondaryEffect: x => format(x, 2, 3),
    formatSingleSecondaryEffect: x => format(x, 5, 5),
    alteredColor: () => GlyphAlteration.getAdditionColor("replication"),
    alterationType: ALTERATION_TYPE.ADDITION,
  },
  replicationglyphlevel: {
    id: "replicationglyphlevel",
    bitmaskIndex: 11,
    isGenerated: true,
    glyphTypes: ["replication"],
    singleDesc: () => $t("glyph_effect_11_single", format(0.4, 1, 1), format(0.4, 1, 1)),
    totalDesc: () => $t("glyph_effect_11_total", format(0.4, 1, 1), format(0.4, 1, 1)),
    genericDesc: () => $t("glyph_effect_11_generic"),
    shortDesc: () => $t("glyph_effect_11_short"),
    effect: (level, strength) => Math.pow(Math.pow(level, 0.25) * Math.pow(strength, 0.4), 0.5) / 50,
    formatEffect: x => format(x, 3, 3),
    combine: effects => {
      let sum = effects.reduce(Number.sumReducer, 0);
      if (effects.length > 2) sum *= 6 / (effects.length + 4);
      return sum > 0.1
        ? { value: 0.1 + 0.2 * (sum - 0.1), capped: true }
        : { value: sum, capped: effects.length > 2 };
    },
    enabledInDoomed: true,
  },
  infinitypow: {
    id: "infinitypow",
    bitmaskIndex: 12,
    isGenerated: true,
    glyphTypes: ["infinity"],
    singleDesc: () => $t("glyph_effect_4_single"),
    totalDesc: () => $t("glyph_effect_4_total"),
    shortDesc: () => $t("glyph_effect_4_short"),
    effect: (level, strength) => 1.007 + Math.pow(level, 0.21) * Math.pow(strength, 0.4) / 75 +
      GlyphAlteration.sacrificeBoost("infinity") / 50,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
    alteredColor: () => GlyphAlteration.getBoostColor("infinity"),
    alterationType: ALTERATION_TYPE.BOOST,
    enabledInDoomed: true,
  },
  infinityrate: {
    id: "infinityrate",
    bitmaskIndex: 13,
    isGenerated: true,
    glyphTypes: ["infinity"],
    singleDesc: () => $t("glyph_effect_5_single", formatInt(7), formatInt(7)),
    totalDesc: () => $t("glyph_effect_5_total", formatInt(7), formatInt(7)),
    genericDesc: () => $t("glyph_effect_5_generic"),
    shortDesc: () => $t("glyph_effect_5_short"),
    effect: (level, strength) => Math.pow(level, 0.2) * Math.pow(strength, 0.4) * 0.04,
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.add,
    enabledInDoomed: true,
  },
  infinityIP: {
    id: "infinityIP",
    bitmaskIndex: 14,
    isGenerated: true,
    glyphTypes: ["infinity"],
    singleDesc: () => (GlyphAlteration.isAdded("infinity")
      ? $t("glyph_effect_6_short_altered")
      : $t("glyph_effect_6_short")),
    totalDesc: () => (GlyphAlteration.isAdded("infinity")
      ? $t("glyph_effect_6_total_altered")
      : $t("glyph_effect_6_total")),
    genericDesc: () => (GlyphAlteration.isAdded("infinity")
      ? $t("glyph_effect_6_generic_altered")
      : $t("glyph_effect_6_generic")),
    shortDesc: () => (GlyphAlteration.isAdded("infinity")
      ? $t("glyph_effect_6_short_altered")
      : $t("glyph_effect_6_short")),
    effect: (level, strength) => Math.pow(level * (strength + 1), 6) * 10000,
    formatEffect: x => format(x, 2, 3),
    combine: GlyphCombiner.multiply,
    // eslint-disable-next-line no-negated-condition
    softcap: value => ((Effarig.eternityCap !== undefined) ? Math.min(value, Effarig.eternityCap.toNumber()) : value),
    conversion: x => 1 + Math.log10(x) / 1800,
    formatSecondaryEffect: x => format(x, 4, 4),
    alteredColor: () => GlyphAlteration.getAdditionColor("infinity"),
    alterationType: ALTERATION_TYPE.ADDITION
  },
  infinityinfmult: {
    id: "infinityinfmult",
    bitmaskIndex: 15,
    isGenerated: true,
    glyphTypes: ["infinity"],
    singleDesc: () => $t("glyph_effect_7_single"),
    totalDesc: () => $t("glyph_effect_7_total"),
    genericDesc: () => $t("glyph_effect_7_generic"),
    shortDesc: () => $t("glyph_effect_7_short"),
    effect: (level, strength) => (GlyphAlteration.isEmpowered("infinity")
      ? DC.D1_02.pow(level)
      : Decimal.pow(level * strength, 1.5).times(2)),
    formatEffect: x => format(x, 2, 1),
    combine: GlyphCombiner.multiplyDecimal,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("infinity"),
    alterationType: ALTERATION_TYPE.EMPOWER
  },
  powerpow: {
    id: "powerpow",
    bitmaskIndex: 16,
    isGenerated: true,
    glyphTypes: ["power"],
    singleDesc: () => (GlyphAlteration.isAdded("power")
      ? $t("glyph_effect_0_single_altered")
      : $t("glyph_effect_0_single")),
    totalDesc: () => (GlyphAlteration.isAdded("power")
      ? $t("glyph_effect_0_total_altered")
      : $t("glyph_effect_0_total")),
    genericDesc: () => (GlyphAlteration.isAdded("power")
      ? $t("glyph_effect_0_generic_altered")
      : $t("glyph_effect_0_generic")),
    shortDesc: () => (GlyphAlteration.isAdded("power")
      ? $t("glyph_effect_0_short_altered")
      : $t("glyph_effect_0_short")),
    effect: (level, strength) => 1.015 + Math.pow(level, 0.2) * Math.pow(strength, 0.4) / 75,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
    conversion: x => 2 / (x + 1),
    formatSecondaryEffect: x => format(x, 3, 3),
    alteredColor: () => GlyphAlteration.getAdditionColor("power"),
    alterationType: ALTERATION_TYPE.ADDITION,
    enabledInDoomed: true,
  },
  powermult: {
    id: "powermult",
    bitmaskIndex: 17,
    isGenerated: true,
    glyphTypes: ["power"],
    singleDesc: () => $t("glyph_effect_1_single"),
    shortDesc: () => $t("glyph_effect_1_short"),
    effect: (level, strength) => (GlyphAlteration.isEmpowered("power")
      ? DC.D11111.pow(level * 220)
      : Decimal.pow(level * strength * 10, level * strength * 10)),
    formatEffect: x => formatPostBreak(x, 2, 0),
    combine: GlyphCombiner.multiplyDecimal,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("power"),
    alterationType: ALTERATION_TYPE.EMPOWER,
    enabledInDoomed: true,
  },
  powerdimboost: {
    id: "powerdimboost",
    bitmaskIndex: 18,
    isGenerated: true,
    glyphTypes: ["power"],
    singleDesc: () => $t("glyph_effect_2_single"),
    genericDesc: () => $t("glyph_effect_2_generic"),
    shortDesc: () => $t("glyph_effect_2_short"),
    effect: (level, strength) => Math.pow(level * strength, 0.5) *
      Math.pow(1 + GlyphAlteration.sacrificeBoost("power"), 3),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.multiply,
    alteredColor: () => GlyphAlteration.getBoostColor("power"),
    alterationType: ALTERATION_TYPE.BOOST,
    enabledInDoomed: true,
  },
  powerbuy10: {
    id: "powerbuy10",
    bitmaskIndex: 19,
    isGenerated: true,
    glyphTypes: ["power"],
    singleDesc: () => $t("glyph_effect_24_single", formatInt(10)),
    totalDesc: () => $t("glyph_effect_24_total", formatInt(10)),
    genericDesc: () => $t("glyph_effect_24_generic", formatInt(10)),
    shortDesc: () => $t("glyph_effect_24_short", formatInt(10)),
    effect: (level, strength) => 1 + level * strength / 12,
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.addExponents,
    enabledInDoomed: true,
  },
  effarigrm: {
    id: "effarigrm",
    bitmaskIndex: 20,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: () => $t("glyph_effect_21_single"),
    genericDesc: () => $t("glyph_effect_21_generic"),
    shortDesc: () => $t("glyph_effect_21_short"),
    effect: (level, strength) => (GlyphAlteration.isEmpowered("effarig")
      ? Math.pow(level, 1.5)
      : Math.pow(level, 0.6) * strength),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.multiply,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("effarig"),
    alterationType: ALTERATION_TYPE.EMPOWER
  },
  effarigglyph: {
    id: "effarigglyph",
    bitmaskIndex: 21,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: () => $t("glyph_effect_22_single"),
    genericDesc: () => $t("glyph_effect_22_generic"),
    shortDesc: () => $t("glyph_effect_22_short"),
    effect: (level, strength) => Math.floor(10 * Math.pow(level * strength, 0.5)),
    formatEffect: x => formatInt(x),
    combine: GlyphCombiner.add,
  },
  effarigblackhole: {
    id: "effarigblackhole",
    bitmaskIndex: 22,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: () => $t("glyph_effect_20_single"),
    totalDesc: () => $t("glyph_effect_20_total"),
    genericDesc: () => $t("glyph_effect_20_generic"),
    shortDesc: () => $t("glyph_effect_20_short"),
    effect: (level, strength) => 1 + Math.pow(level, 0.25) * Math.pow(strength, 0.4) / 75,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
  },
  effarigachievement: {
    id: "effarigachievement",
    bitmaskIndex: 23,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: () => $t("glyph_effect_23_single"),
    totalDesc: () => $t("glyph_effect_23_total"),
    genericDesc: () => $t("glyph_effect_23_generic"),
    shortDesc: () => $t("glyph_effect_23_short"),
    effect: (level, strength) => 1 + Math.pow(level, 0.4) * Math.pow(strength, 0.6) / 60 +
      GlyphAlteration.sacrificeBoost("effarig") / 10,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
    alteredColor: () => GlyphAlteration.getBoostColor("effarig"),
    alterationType: ALTERATION_TYPE.BOOST
  },
  effarigforgotten: {
    id: "effarigforgotten",
    bitmaskIndex: 24,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: () => (GlyphAlteration.isAdded("effarig")
      ? $t("glyph_effect_24_single_altered", formatInt(10))
      : $t("glyph_effect_24_single", formatInt(10))),
    totalDesc: () => (GlyphAlteration.isAdded("effarig")
      ? $t("glyph_effect_24_total_altered", formatInt(10))
      : $t("glyph_effect_24_total", formatInt(10))),
    genericDesc: () => (GlyphAlteration.isAdded("effarig")
      ? $t("glyph_effect_24_generic_altered", formatInt(10))
      : $t("glyph_effect_24_generic". formatInt(10))),
    shortDesc: () => (GlyphAlteration.isAdded("effarig")
      ? $t("glyph_effect_24_short_altered", formatInt(10))
      : $t("glyph_effect_24_short", formatInt(10))),
    effect: (level, strength) => 1 + 2 * Math.pow(level, 0.25) * Math.pow(strength, 0.4),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.multiply,
    conversion: x => Math.pow(x, 0.4),
    formatSecondaryEffect: x => format(x, 2, 2),
    alteredColor: () => GlyphAlteration.getAdditionColor("effarig"),
    alterationType: ALTERATION_TYPE.ADDITION
  },
  effarigdimensions: {
    id: "effarigdimensions",
    bitmaskIndex: 25,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: () => $t("glyph_effect_25_single"),
    totalDesc: () => $t("glyph_effect_25_total"),
    genericDesc: () => $t("glyph_effect_25_generic"),
    shortDesc: () => $t("glyph_effect_25_short"),
    effect: (level, strength) => 1 + Math.pow(level, 0.25) * Math.pow(strength, 0.4) / 500,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
  },
  effarigantimatter: {
    id: "effarigantimatter",
    bitmaskIndex: 26,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: () => $t("glyph_effect_26_single", formatInt(10), formatInt(10)),
    genericDesc: () => $t("glyph_effect_26_generic"),
    shortDesc: () => $t("glyph_effect_26_short"),
    effect: (level, strength) => 1 + Math.pow(level, 0.25) * Math.pow(strength, 0.4) / 5000,
    formatEffect: x => format(x, 4, 4),
    combine: GlyphCombiner.multiply,
  },
  timeshardpow: {
    id: "timeshardpow",
    bitmaskIndex: 27,
    isGenerated: true,
    // This gets explicitly added to time glyphs elsewhere (once unlocked)
    glyphTypes: [],
    singleDesc: () => $t("glyph_effect_37_single"),
    totalDesc: () => $t("glyph_effect_37_total"),
    genericDesc: () => $t("glyph_effect_37_generic"),
    shortDesc: () => $t("glyph_effect_37_short"),
    effect: (level, strength) => 1 + (strength / 3.5) * Math.pow(level, 0.35) / 400,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
    enabledInDoomed: true,
  },
  cursedgalaxies: {
    id: "cursedgalaxies",
    bitmaskIndex: 0,
    isGenerated: false,
    glyphTypes: ["cursed"],
    singleDesc: () => $t("glyph_effect_31_single"),
    totalDesc: () => $t("glyph_effect_31_total"),
    shortDesc: () => $t("glyph_effect_31_short"),
    // Multiplies by 0.768 per glyph
    effect: level => Math.pow(level, -0.03),
    formatEffect: x => formatPercents(1 - x, 2),
    combine: GlyphCombiner.multiply,
  },
  curseddimensions: {
    id: "curseddimensions",
    bitmaskIndex: 1,
    isGenerated: false,
    glyphTypes: ["cursed"],
    singleDesc: () => $t("glyph_effect_32_single"),
    shortDesc: () => $t("glyph_effect_32_short"),
    // Multiplies by 0.734 per glyph
    effect: level => Math.pow(level, -0.035),
    formatEffect: x => format(x, 3, 3),
    combine: GlyphCombiner.multiply,
  },
  cursedtickspeed: {
    id: "cursedtickspeed",
    bitmaskIndex: 2,
    isGenerated: false,
    glyphTypes: ["cursed"],
    singleDesc: () => $t("glyph_effect_33_single"),
    totalDesc: () => $t("glyph_effect_33_total"),
    shortDesc: () => $t("glyph_effect_33_short"),
    // Additive 3.82 per glyph
    effect: level => Math.clampMin(Math.log10(level), 1),
    formatEffect: x => format(x, 3, 3),
    combine: GlyphCombiner.add,
  },
  cursedEP: {
    id: "cursedEP",
    bitmaskIndex: 3,
    isGenerated: false,
    glyphTypes: ["cursed"],
    singleDesc: () => $t("glyph_effect_34_single"),
    totalDesc: () => $t("glyph_effect_34_total"),
    shortDesc: () => $t("glyph_effect_34_short"),
    // Divides e666.6 per glyph
    effect: level => Decimal.pow10(-level / 10),
    formatEffect: x => format(x.reciprocal()),
    combine: GlyphCombiner.multiplyDecimal,
  },
  realityglyphlevel: {
    id: "realityglyphlevel",
    bitmaskIndex: 4,
    isGenerated: false,
    glyphTypes: ["reality"],
    singleDesc: () => $t("glyph_effect_27_single"),
    totalDesc: () => $t("glyph_effect_27_total"),
    shortDesc: () => $t("glyph_effect_27_short"),
    effect: level => Math.floor(Math.sqrt(level * 90)),
    formatEffect: x => formatInt(x),
    combine: GlyphCombiner.add,
  },
  realitygalaxies: {
    id: "realitygalaxies",
    bitmaskIndex: 5,
    isGenerated: false,
    glyphTypes: ["reality"],
    singleDesc: () => $t("glyph_effect_28_single"),
    totalDesc: () => $t("glyph_effect_28_total"),
    shortDesc: () => $t("glyph_effect_28_short"),
    effect: level => 1 + Math.pow(level / 100000, 0.5),
    formatEffect: x => formatPercents(x - 1, 2),
    combine: GlyphCombiner.multiply,
  },
  realityrow1pow: {
    id: "realityrow1pow",
    bitmaskIndex: 6,
    isGenerated: false,
    glyphTypes: ["reality"],
    singleDesc: () => $t("glyph_effect_29_single"),
    totalDesc: () => $t("glyph_effect_29_total"),
    shortDesc: () => $t("glyph_effect_29_short"),
    effect: level => 1 + level / 125000,
    formatEffect: x => format(x, 3, 3),
    combine: GlyphCombiner.addExponents,
  },
  realityDTglyph: {
    id: "realityDTglyph",
    bitmaskIndex: 7,
    isGenerated: false,
    glyphTypes: ["reality"],
    singleDesc: () => $t("glyph_effect_30_single", format(1.3, 1, 1)),
    totalDesc: () => $t("glyph_effect_30_total", format(1.3, 1, 1)),
    genericDesc: () => $t("glyph_effect_30_generic"),
    shortDesc: () => $t("glyph_effect_30_short"),
    // You can only get this effect on level 25000 reality glyphs anyway, might as well make it look nice
    effect: () => 0.1,
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.add,
  },
  companiondescription: {
    id: "companiondescription",
    bitmaskIndex: 8,
    isGenerated: false,
    glyphTypes: ["companion"],
    singleDesc: () => $t("glyph_effect_35_single"),
    totalDesc: () => $t("glyph_effect_35_total"),
    shortDesc: () => $t("glyph_effect_35_short"),
    effect: () => {
      if (Nameless.isRunning) return 0;
      const cursedCount = Glyphs.active.countWhere(g => g?.type === "cursed");
      if (cursedCount > 0) return Math.pow(0.2 + 0.2 * Math.random(), cursedCount);
      return 0.4 + 0.6 * Math.random();
    },
    formatEffect: x => formatPercents(x, 2, 2),
    combine: GlyphCombiner.add,
    enabledInDoomed: true,
  },
  companionEP: {
    id: "companionEP",
    bitmaskIndex: 9,
    isGenerated: false,
    glyphTypes: ["companion"],
    singleDesc: () => $t("glyph_effect_36_single"),
    shortDesc: () => $t("glyph_effect_36_short"),
    totalDesc: () => ((Nameless.isRunning || Glyphs.active.countWhere(g => g?.type === "cursed")) ? $t("glyph_effect_36_total_2") : $t("glyph_effect_36_total")),
    // The EP value for this is entirely encoded in rarity, but level needs to be present to
    // make sure the proper parameter is being used. The actual glyph level shouldn't do anything.
    // eslint-disable-next-line no-unused-vars
    effect: (level, strength) => Decimal.pow10(1e6 * strengthToRarity(strength)),
    formatEffect: x => formatPostBreak(x, 2),
    combine: GlyphCombiner.multiplyDecimal,
    enabledInDoomed: true,
  }
};
