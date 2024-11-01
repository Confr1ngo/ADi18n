import AnnihilationButton from "./AnnihilationButton.js";
import CelestialQuoteHistory from "../../CelestialQuoteHistory.js";
import DarkMatterDimensionGroup from "./DarkMatterDimensionGroup.js";
import LaitelaAutobuyerPane from "./LaitelaAutobuyerPane.js";
import LaitelaRunButton from "./LaitelaRunButton.js";
import PrimaryButton from "../../PrimaryButton.js";
import SingularityMilestonePane from "./SingularityMilestonePane.js";
import SingularityPane from "./SingularityPane.js";

export default {
  name: "LaitelaTab",
  components: {
    LaitelaRunButton,
    SingularityPane,
    SingularityMilestonePane,
    DarkMatterDimensionGroup,
    AnnihilationButton,
    LaitelaAutobuyerPane,
    CelestialQuoteHistory,
    PrimaryButton
  },
  data() {
    return {
      isDoomed: false,
      darkMatter: new Decimal(0),
      darkMatterGain: new Decimal(0),
      isDMCapped: false,
      maxDarkMatter: new Decimal(0),
      darkEnergy: 0,
      matterExtraPurchasePercentage: 0,
      autobuyersUnlocked: false,
      singularityPanelVisible: false,
      singularitiesUnlocked: false,
      singularityCap: 0,
      singularityWaitTime: 0,
      showAnnihilation: false
    };
  },
  computed: {
    styleObject() {
      return {
        color: this.isDMCapped ? "var(--color-bad)" : "",
      };
    },
    darkMatterAmount() {
      return $p_split("you_have_X_dark_matter", this.darkMatter, format(this.darkMatter, 2));
    }
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.darkMatter.copyFrom(Currency.darkMatter);
      this.isDMCapped = this.darkMatter.eq(Number.MAX_VALUE);
      this.maxDarkMatter.copyFrom(Currency.darkMatter.max);
      this.darkEnergy = player.celestials.laitela.darkEnergy;
      this.matterExtraPurchasePercentage = Laitela.matterExtraPurchaseFactor - 1;
      this.autobuyersUnlocked = SingularityMilestone.darkDimensionAutobuyers.canBeApplied ||
        SingularityMilestone.darkDimensionAutobuyers.canBeApplied ||
        SingularityMilestone.autoCondense.canBeApplied ||
        Laitela.darkMatterMult > 1;
      this.singularityPanelVisible = Currency.singularities.gt(0);
      this.singularitiesUnlocked = Singularity.capIsReached || this.singularityPanelVisible;
      this.singularityCap = Singularity.cap;
      this.singularityWaitTime = TimeSpan.fromSeconds((this.singularityCap - this.darkEnergy) /
        Currency.darkEnergy.productionPerSecond).toStringShort();
      this.showAnnihilation = Laitela.annihilationUnlocked;

      const d1 = DarkMatterDimension(1);
      this.darkMatterGain = d1.amount.times(d1.powerDM).divide(d1.interval).times(1000);
    },
    maxAll() {
      Laitela.maxAllDMDimensions(4);
    },
    showLaitelaHowTo() {
      ui.view.h2pForcedTab = GameDatabase.h2p.tabs.filter(tab => tab.name === "Lai'tela")[0];
      Modal.h2p.show();
    },
  },
  template: `
  <div class="l-laitela-celestial-tab">
    <CelestialQuoteHistory celestial="laitela" />
    <div class="c-subtab-option-container">
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="showLaitelaHowTo()"
      >
        Click for Lai'tela info
      </PrimaryButton>
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="maxAll"
      >
        {{ $t("max_all_dark_matter_dimensions") }}
      </PrimaryButton>
    </div>
    <div class="o-laitela-matter-amount">
      {{ darkMatterAmount[0] }}
      <span :style="styleObject">{{ darkMatterAmount[1] }}</span>
      {{ darkMatterAmount[2] }}<span v-if="isDMCapped"> ({{ $t("capped") }})</span>.
      <span v-if="!isDMCapped">(Average: {{ format(darkMatterGain, 2, 2) }}/s)</span>
    </div>
    <div class="o-laitela-matter-amount">
      Your maximum Dark Matter ever is
      <span :style="styleObject">{{ format(maxDarkMatter, 2) }}</span><span v-if="!isDoomed">,
        giving {{ formatPercents(matterExtraPurchasePercentage, 2) }} more purchases from Continuum</span>.
    </div>
    <div class="o-laitela-matter-amount">
      Dark Matter Dimensions are unaffected by storing real time.
    </div>
    <h2
      v-if="!singularitiesUnlocked"
      class="c-laitela-singularity-container"
    >
      Unlock Singularities in {{ singularityWaitTime }}.
      ({{ format(darkEnergy, 2, 2) }}/{{ format(singularityCap, 2) }} Dark Energy)
    </h2>
    <SingularityPane v-if="singularitiesUnlocked" />
    <LaitelaAutobuyerPane v-if="autobuyersUnlocked" />
    <div class="l-laitela-mechanics-container">
      <LaitelaRunButton />
      <div>
        <DarkMatterDimensionGroup />
        <AnnihilationButton v-if="showAnnihilation" />
      </div>
      <SingularityMilestonePane v-if="singularityPanelVisible" />
    </div>
  </div>
  `
};