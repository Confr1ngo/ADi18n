import ChallengeGrid from "../../ChallengeGrid.js";
import ChallengeTabHeader from "../../ChallengeTabHeader.js";
import EternityChallengeBox from "./EternityChallengeBox.js";

export default {
  name: "EternityChallengesTab",
  components: {
    ChallengeTabHeader,
    ChallengeGrid,
    EternityChallengeBox
  },
  data() {
    return {
      unlockedCount: 0,
      showAllChallenges: false,
      autoEC: false,
      isAutoECVisible: false,
      hasUpgradeLock: false,
      remainingECTiers: 0,
      untilNextEC: TimeSpan.zero,
      untilAllEC: TimeSpan.zero,
      hasECR: false,
    };
  },
  computed: {
    challenges() {
      return EternityChallenges.all;
    },
    upgradeLockNameText() {
      return RealityUpgrade(12).isLockingMechanics
        ? RealityUpgrade(12).name
        : ImaginaryUpgrade(15).name;
    },
    nextECText() {
      return this.untilNextEC.totalMilliseconds === 0 && !this.autoEC
        ? $t("immediately_upon_unpausing")
        : `${this.untilNextEC} (${$t("real_time")})`;
    },
    allECText() {
      return this.untilAllEC.totalMilliseconds === 0 && !this.autoEC
        ? $t("immediately_upon_unpausing")
        : $t("after_X_real_time",this.untilAllEC);
    }
  },
  methods: {
    update() {
      this.showAllChallenges = player.options.showAllChallenges;
      this.unlockedCount = EternityChallenges.all
        .filter(this.isChallengeVisible)
        .length;
      this.isAutoECVisible = Perk.autocompleteEC1.canBeApplied;
      this.autoEC = player.reality.autoEC;
      const shouldPreventEC7 = TimeDimension(1).amount.gt(0);
      this.hasUpgradeLock = RealityUpgrade(12).isLockingMechanics ||
        (ImaginaryUpgrade(15).isLockingMechanics && shouldPreventEC7 &&
          !Array.range(1, 6).some(ec => !EternityChallenge(ec).isFullyCompleted));
      const remainingCompletions = EternityChallenges.remainingCompletions;
      this.remainingECTiers = remainingCompletions;
      if (remainingCompletions !== 0) {
        const autoECInterval = EternityChallenges.autoComplete.interval;
        const untilNextEC = Math.max(autoECInterval - player.reality.lastAutoEC, 0);
        this.untilNextEC.setFrom(untilNextEC);
        this.untilAllEC.setFrom(untilNextEC + (autoECInterval * (remainingCompletions - 1)));
      }
      this.hasECR = Perk.studyECRequirement.isBought;
    },
    isChallengeVisible(challenge) {
      return challenge.completions > 0 || challenge.isUnlocked || challenge.hasUnlocked ||
        (this.showAllChallenges && PlayerProgress.realityUnlocked());
    }
  },
  template: `
  <div class="l-challenges-tab">
    <ChallengeTabHeader />
    <div v-if="isAutoECVisible">
      {{ $t("auto_ec_disclaimer") }}
    </div>
    <div
      v-if="isAutoECVisible && remainingECTiers > 0"
      class="c-challenges-tab__auto-ec-info l-challenges-tab__auto-ec-info"
    >
      <div class="l-challenges-tab__auto-ec-timers">
        <span
          v-if="hasUpgradeLock"
          class="l-emphasis"
          data-v-eternity-challenges-tab
        >
          {{ $t("auto_ec_disabled_disclaimer", upgradeLockNameText) }}
        </span>
        <span v-if="remainingECTiers > 0">
          {{ $t("next_auto_ec_completion", nextECText) }}
        </span>
        <span>
          {{ $t("all_auto_ec_completions", allECText) }}
        </span>
        <br>
      </div>
    </div>
    <div>
      {{ $t("eternity_challenge_info", formatInt(5)) }}
    </div>
    <div v-if="!hasECR">
      {{ $t("eternity_challenge_info2") }}
    </div>
    <div v-if="unlockedCount !== 12">
      你已见过 {{ formatInt(12) }} 个永恒挑战中的 {{ formatInt(unlockedCount) }} 个。
    </div>
    <div v-else>
      你已见过 {{ formatInt(12) }} 个永恒挑战。
    </div>
    <ChallengeGrid
      v-slot="{ challenge }"
      :challenges="challenges"
      :is-challenge-visible="isChallengeVisible"
    >
      <EternityChallengeBox :challenge="challenge" />
    </ChallengeGrid>
  </div>
  `
};