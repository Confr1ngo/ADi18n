import FailableEcText from "./FailableEcText.js";
import PrimaryButton from "../PrimaryButton.js";

export default {
  name: "HeaderChallengeDisplay",
  components: {
    FailableEcText,
    PrimaryButton
  },
  data() {
    return {
      activityTokens: [],
      infinityUnlocked: false,
      showExit: false,
      exitText: "",
      resetCelestial: false,
      inPelle: false,
    };
  },
  computed: {
    parts() {
      // We need activityToken for NC/IC/EC because plain check of WhateverChallenge.isRunning
      // won't trigger display update if we, say, switch from one challenge to another
      function celestialReality(celestial, id) {
        return {
          name: () => $t(`${id}_reality`),
          type: "Celestial",
          isActive: token => token,
          activityToken: () => celestial.isRunning,
          tabName: () => id,
        };
      }
      return [
        celestialReality(Teresa, "teresa"),
        celestialReality(Effarig, "effarig"),
        celestialReality(Nameless, "nameless"),
        celestialReality(V, "v"),
        celestialReality(Ra, "ra"),
        celestialReality(Laitela, "laitela"),
        {
          name: () => $t("htp_time_dilation_title"),
          isActive: token => token,
          type: "Time Dilation",
          activityToken: () => player.dilation.active
        },
        {
          name: token => $t(`ec_name`, token.toString()),
          type: "Eternity Challenge",
          isActive: token => token > 0,
          activityToken: () => player.challenge.eternity.current
        },
        {
          name: token => $t(`ic_name`, token.toString()),
          type: "Infinity Challenge",
          isActive: token => token > 0,
          activityToken: () => player.challenge.infinity.current
        },
        {
          name: token => $t(`nc_name`, token.toString()),
          type: "Normal Challenge",
          isActive: token => token > 0,
          activityToken: () => player.challenge.normal.current
        },
      ];
    },
    activeChallengeNames() {
      const names = [];
      for (let i = 0; i < this.activityTokens.length; i++) {
        const token = this.activityTokens[i];
        const part = this.parts[i];
        if (!part.isActive(token)) continue;
        if (part.type === "Eternity Challenge") {
          const currEC = player.challenge.eternity.current;
          const nextCompletion = EternityChallenge(currEC).completions + 1;
          let completionText = "";
          if (Nameless.isRunning && currEC === 1) {
            completionText = `(${formatInt(nextCompletion)}/???)`;
          } else if (nextCompletion === 6) {
            completionText = $t("challenge_display_already_completed");
          } else {
            completionText = `(${formatInt(nextCompletion)}/${formatInt(5)})`;
          }
          names.push({
            name: `${part.name(token)} ${completionText}`,
            token,
            type: part.type
          });
        } else {
          names.push({
            name: part.name(token),
            token,
            type: part.type
          });
        }
      }
      return names;
    },
    isVisible() {
      return this.infinityUnlocked || this.activeChallengeNames.length > 0;
    },
    isInFailableEC() {
      return this.activeChallengeNames.some(str => str.type === "ec" && [4, 12].includes(str.token));
    },
    challengeDisplay() {
      if (this.inPelle && this.activeChallengeNames.length > 0) {
        return $t("challenge_display_doomed_challenge", this.activeChallengeNames.map(part => part.name).join(" + "));
      }
      if (this.inPelle) return $t("challenge_display_doomed");
      if (this.activeChallengeNames.length === 0) {
        return $t("challenge_display_no_active_challenges");
      }
      return $t("challenge_display", this.activeChallengeNames.map(part => part.name).join(" + "));
    },
  },
  methods: {
    update() {
      this.infinityUnlocked = PlayerProgress.infinityUnlocked();
      this.activityTokens = this.parts.map(part => part.activityToken());
      // Dilation in Pelle can't be left once entered, but we still want to allow leaving more nested challenges
      this.showExit = this.inPelle && player.dilation.active
        ? this.activeChallengeNames.length > 1
        : this.activeChallengeNames.length !== 0;
      this.exitText = this.exitDisplay();
      this.resetCelestial = player.options.retryCelestial;
      this.inPelle = Pelle.isDoomed;
    },
    // Process exit requests from the inside out; Challenges first, then dilation, then Celestial Reality. If the
    // relevant option is toggled, we pass a bunch of information over to a modal - otherwise we immediately exit
    exitButtonClicked() {
      let names, clickFn;
      const isEC = Player.anyChallenge instanceof EternityChallengeState;

      // Dilation and ECs can't be exited independently and we have a special dilation-exit modal, so we have
      // to treat that particular case differently. The dilation modal itself will account for EC state
      if (player.dilation.active && (!Player.isInAnyChallenge || isEC)) {
        if (player.options.confirmations.dilation) Modal.exitDilation.show();
        else startDilatedEternityRequest();
        return;
      }

      if (Player.isInAnyChallenge) {
        // Regex replacement is used to remove the "(X/Y)" which appears after ECs. The ternary statement is there
        // because this path gets called for NCs, ICs, and ECs
        const toExit = this.activeChallengeNames[this.activeChallengeNames.length - 1].type;
        names = { chall: toExit, normal: isEC ? "Eternity" : "Infinity" };
        clickFn = () => {
          const oldChall = Player.anyChallenge;
          Player.anyChallenge.exit(false);
          if (player.options.retryChallenge) oldChall.requestStart();
        };
      } else {
        names = { chall: this.activeChallengeNames[0].type, normal: "Reality" };
        clickFn = () => beginProcessReality(getRealityProps(true));
      }

      if (player.options.confirmations.exitChallenge) {
        Modal.exitChallenge.show(
          {
            challengeName: names.chall,
            normalName: names.normal,
            hasHigherLayers: this.inPelle || this.activeChallengeNames.length > 1,
            exitFn: clickFn
          }
        );
      } else {
        clickFn();
      }
    },
    // Bring the player to the tab related to the innermost challenge
    textClicked() {
      if (this.activeChallengeNames.length === 0) return;

      // Iterating back-to-front and breaking ensures we get the innermost restriction
      let type = "", celestial = "";
      for (let i = this.activityTokens.length - 1; i >= 0; i--) {
        const token = this.activityTokens[i];
        const part = this.parts[i];
        if (!part.isActive(token)) continue;
        type = part.type;
        celestial = part.tabName?.();
        break;
      }

      // Normal challenges are matched with an end-of-string metacharacter
      if (type === "Normal Challenge") Tab.challenges.normal.show(true);
      else if (type === "Infinity Challenge") Tab.challenges.infinity.show(true);
      else if (type === "Eternity Challenge") Tab.challenges.eternity.show(true);
      else if (player.dilation.active) Tab.eternity.dilation.show(true);
      else Tab.celestials[celestial].show(true);
    },
    exitDisplay() {
      if (Player.isInAnyChallenge) return player.options.retryChallenge ? "Retry Challenge" : $t("exit_challenge");
      if (player.dilation.active) return "退出膨胀";
      if (this.resetCelestial) return "Restart Reality";
      return "Exit Reality";
    },
    textClassObject() {
      return {
        "l-challenge-display": true,
        "l-challenge-display--clickable": this.activeChallengeNames.length !== 0,
      };
    }
  },
  template: `
  <div
    v-if="isVisible"
    class="l-game-header__challenge-text"
    data-v-header-challenge-display
  >
    <span
      :class="textClassObject()"
      @click="textClicked"
      data-v-header-challenge-display
    >
      {{ challengeDisplay }}
    </span>
    <FailableEcText v-if="isInFailableEC" />
    <span
      class="l-padding-line"
      data-v-header-challenge-display
    />
    <PrimaryButton
      v-if="showExit"
      @click="exitButtonClicked"
    >
      {{ exitText }}
    </PrimaryButton>
  </div>
  `
};