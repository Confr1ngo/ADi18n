import ModalWrapper from "./ModalWrapper.js";
import PrimaryButton from "../PrimaryButton.js";

export default {
  name: "NamelessHintsModal",
  components: {
    ModalWrapper,
    PrimaryButton
  },
  data() {
    return {
      currentStored: 0,
      nextHintCost: 0,
      canGetHint: false,
      shownEntries: [],
      realityHintsLeft: 0,
      glyphHintsLeft: 0,
      hints: 0,
    };
  },
  computed: {
    hintCost() {
      return `${quantify("year", TimeSpan.fromMilliseconds(this.nextHintCost).totalYears, 2)}`;
    },
    formattedStored() {
      return `${quantify("year", TimeSpan.fromMilliseconds(this.currentStored).totalYears, 2)}`;
    },
    hasProgress(id) {
      return this.progressEntries.some(entry => entry.id === id);
    },
    // Note: This calculation seems to behave extremely poorly if the goal has been raised more than 12 hints worth
    // of cost bumps and I'm not entirely sure why. There's probably a numerical issue I can't quite figure out, but
    // considering that much cost raising can't happen in practice I think I'm just going to leave it be.
    timeEstimate() {
      if (this.currentStored >= this.nextHintCost) return "";

      // Relevant values are stored as milliseconds, so multiply the rate by 1000 to get to seconds
      const storeRate = 1000 * (Nameless.isStoringGameTime
        ? Nameless.currentBlackHoleStoreAmountPerMs
        : getGameSpeedupFactor());
      const alreadyWaited = this.currentStored / storeRate;
      const decaylessTime = this.nextHintCost / storeRate;

      // Check if decay is irrelevant and don't do the hard calculations if so
      const minCostEstimate = (TimeSpan.fromYears(1e40).totalMilliseconds - this.currentStored) / storeRate;
      if (TimeSpan.fromSeconds(minCostEstimate).totalDays > this.hints) {
        return `${TimeSpan.fromSeconds(minCostEstimate).toStringShort(true)}`;
      }

      // Decay is 3x per day, but the math needs decay per second
      const K = Math.pow(3, 1 / 86400);
      const x = decaylessTime * Math.log(K) * Math.pow(K, alreadyWaited);
      const timeToGoal = productLog(x) / Math.log(K) - alreadyWaited;
      return `${TimeSpan.fromSeconds(timeToGoal).toStringShort(true)}`;
    }
  },
  methods: {
    update() {
      this.currentStored = player.celestials.nameless.stored;
      this.nextHintCost = Nameless.nextHintCost;
      this.canGetHint = this.currentStored >= this.nextHintCost;
      this.shownEntries = [];

      this.realityHintsLeft = NamelessProgress.all.length;
      for (const prog of NamelessProgress.all) {
        if (prog.hasHint) {
          this.shownEntries.push([false, prog]);
          this.realityHintsLeft--;
        }
      }

      const glyphHintCount = player.celestials.nameless.glyphHintsGiven;
      for (let hintNum = 0; hintNum < glyphHintCount; hintNum++) {
        this.shownEntries.push([true, GameDatabase.celestials.nameless.glyphHints[hintNum]()]);
      }
      this.glyphHintsLeft = GameDatabase.celestials.nameless.glyphHints.length - glyphHintCount;

      this.hints = Nameless.hintCostIncreases;
    },
    giveRealityHint(available) {
      if (available <= 0 || !Nameless.spendTimeForHint()) return;
      NamelessProgress.all.filter(prog => !prog.hasHint).randomElement().unlock();
    },
    giveGlyphHint(available) {
      if (available <= 0 || !Nameless.spendTimeForHint()) return;
      player.celestials.nameless.glyphHintsGiven++;
    }
  },
  template: `
  <ModalWrapper>
    <template #header>
      Cracks in The Nameless Ones' Reality
    </template>
    <div class="c-nameless-hint-modal c-modal--short">
      <div>
        This Reality seems to be resisting your efforts to complete it. So far you have done the following:
      </div>
      <br>
      <div
        v-for="(entry, index) in shownEntries"
        :key="index"
      >
        <div v-if="!entry[0]">
          <span v-if="entry[1].hasHint && !entry[1].hasProgress">
            <i
              class="c-icon-wrapper fas fa-question-circle"
              data-v-nameless-hints-modal
            />
            <b>You have not figured out what this hint means yet.</b>
          </span>
          <span v-else>
            <i
              class="c-icon-wrapper fa-solid fa-house-crack"
              data-v-nameless-hints-modal
            />
            <b>You have exposed a crack in the Reality:</b>
          </span>
          <br>
          - {{ entry[1].hintInfo }}
          <br>
          - {{ entry[1].hasProgress ? entry[1].completedInfo : "?????" }}
        </div>
        <div v-else>
          <i class="fa-solid fa-shapes" /> <b>Glyph hint:</b>
          <br>
          {{ entry[1] }}
        </div>
        <br>
      </div>
      <div v-if="realityHintsLeft + glyphHintsLeft > 0">
        You can spend some time looking for some more cracks in the Reality, but every hint you spend Stored Time on
        will increase the Stored Time needed for the next by a factor of {{ formatInt(3) }}. This cost bump will
        gradually go away over {{ formatInt(24) }} hours and figuring out what the hint means will immediately
        divide the cost by {{ formatInt(2) }}. The cost can't be reduced below {{ format(1e40) }} years.
        <br><br>
        The next hint will cost {{ hintCost }} of Stored Time. You currently have {{ formattedStored }}.
        <span v-if="currentStored < nextHintCost">
          You will reach this if you charge your Black Hole for {{ timeEstimate }}.
        </span>
        <br><br>
        <PrimaryButton
          :enabled="realityHintsLeft > 0 && canGetHint"
          class="l-nameless-hint-button"
          @click="giveRealityHint(realityHintsLeft)"
          data-v-nameless-hints-modal
        >
          Get a hint about the Reality itself ({{ $t("X_time_left", formatInt(realityHintsLeft)) }})
        </PrimaryButton>
        <br>
        <PrimaryButton
          :enabled="glyphHintsLeft > 0 && canGetHint"
          class="l-nameless-hint-button"
          @click="giveGlyphHint(glyphHintsLeft)"
          data-v-nameless-hints-modal
        >
          Get a hint on what Glyphs to use ({{ formatInt(glyphHintsLeft) }} left)
        </PrimaryButton>
      </div>
      <div v-else>
        <b>There are no more hints left!</b>
      </div>
    </div>
  </ModalWrapper>
  `
};