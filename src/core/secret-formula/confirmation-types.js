export const confirmationTypes = [
  {
    name: "维度提升",
    option: "dimensionBoost",
    isUnlocked: () => PlayerProgress.infinityUnlocked() || player.galaxies > 0 || player.dimensionBoosts > 0,
  }, {
    name: "反物质星系",
    option: "antimatterGalaxy",
    isUnlocked: () => PlayerProgress.infinityUnlocked() || player.galaxies > 0,
  }, {
    name: "维度献祭",
    option: "sacrifice",
    isUnlocked: () => Sacrifice.isVisible,
  }, {
    name: "大坍缩",
    option: "bigCrunch",
    isUnlocked: () => player.break || PlayerProgress.eternityUnlocked(),
  }, {
    name: "挑战",
    option: "challenges",
    isUnlocked: () => PlayerProgress.infinityUnlocked(),
  }, {
    name: "退出挑战",
    option: "exitChallenge",
    isUnlocked: () => PlayerProgress.infinityUnlocked(),
  }, {
    name: "复制器星系",
    option: "replicantiGalaxy",
    isUnlocked: () => PlayerProgress.eternityUnlocked() || player.replicanti.unl,
  }, {
    name: "永恒",
    option: "eternity",
    isUnlocked: () => PlayerProgress.eternityUnlocked(),
  }, {
    name: "膨胀",
    option: "dilation",
    isUnlocked: () => PlayerProgress.realityUnlocked() || !Currency.tachyonParticles.eq(0),
  }, {
    name: "重置现实",
    option: "resetReality",
    isUnlocked: () => PlayerProgress.realityUnlocked(),
  }, {
    name: "替换符文",
    option: "glyphReplace",
    isUnlocked: () => PlayerProgress.realityUnlocked(),
  }, {
    name: "符文献祭",
    option: "glyphSacrifice",
    isUnlocked: () => GlyphSacrificeHandler.canSacrifice,
  }, {
    name: "符文净化",
    option: "autoClean",
    isUnlocked: () => GlyphSacrificeHandler.canSacrifice,
  }, {
    name: "献祭所有符文",
    option: "sacrificeAll",
    isUnlocked: () => GlyphSacrificeHandler.canSacrifice,
  }, {
    name: "符文选择",
    option: "glyphSelection",
    isUnlocked: () => Autobuyer.reality.isUnlocked,
  }, {
    name: "撤销符文",
    option: "glyphUndo",
    isUnlocked: () => TeresaUnlocks.undo.canBeApplied,
  }, {
    name: "选择自动机编辑模式",
    option: "switchAutomatorMode",
    isUnlocked: () => Player.automatorUnlocked,
  }, {
    name: "删除符文预设",
    option: "deleteGlyphSetSave",
    isUnlocked: () => EffarigUnlock.setSaves.isUnlocked,
  }, {
    name: "符文精炼",
    option: "glyphRefine",
    isUnlocked: () => Ra.unlocks.unlockGlyphAlchemy.canBeApplied,
  }, {
    name: "重置末日",
    option: "armageddon",
    isUnlocked: () => Pelle.isDoomed,
  }, {
    name: "重置内购",
    option: "respecIAP",
    isUnlocked: () => Cloud.isAvailable
  }
];
