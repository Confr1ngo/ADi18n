import { BlackHoleAnimation } from "./black-hole-animation.js";
import BlackHoleChargingSliders from "./BlackHoleChargingSliders.js";
import BlackHoleStateRow from "./BlackHoleStateRow.js";
import BlackHoleUnlockButton from "./BlackHoleUnlockButton.js";
import BlackHoleUpgradeRow from "./BlackHoleUpgradeRow.js";

export default {
  name: "BlackHoleTab",
  components: {
    BlackHoleUpgradeRow,
    BlackHoleStateRow,
    BlackHoleChargingSliders,
    BlackHoleUnlockButton
  },
  data() {
    return {
      isDoomed: false,
      isUnlocked: false,
      isPaused: false,
      isNameless: false,
      pauseMode: 0,
      detailedBH2: "",
      isPermanent: false,
      hasBH2: false,
      blackHoleUptime: [],
      stateChange: "",
	  autoPauseText: "",
    };
  },
  computed: {
    blackHoles: () => BlackHoles.list,
    pauseModeString() {
      const modes = $t("auto_pauses");
      switch (this.pauseMode) {
        case BLACK_HOLE_PAUSE_MODE.NO_PAUSE:
          return modes[0];
        case BLACK_HOLE_PAUSE_MODE.PAUSE_BEFORE_BH1:
          return this.hasBH2 ? modes[1] : modes[2];
        case BLACK_HOLE_PAUSE_MODE.PAUSE_BEFORE_BH2:
          return modes[3];
        default:
          throw new Error("Unrecognized BH offline pausing mode");
      }
    },
    blackHoleUptimeString() {
      const bh1 = formatPercents(this.blackHoleUptime[0], 3);
      if (!this.hasBH2) return $t("active_time_percent", bh1);
      const bh2 = formatPercents(this.blackHoleUptime[1], 3);
      return $t("active_time_percent_2", bh1, bh2);
    },
    bh2Info() {
      return $t("bh2_info");
    }
  },
  mounted() {
    this.startAnimation();
  },
  destroyed() {
    if (this.animation) this.animation.unmount();
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.isUnlocked = BlackHoles.areUnlocked;
      this.isPaused = BlackHoles.arePaused;
      // If stop running nameless, re-mount the black hole animation as it reappears
      if (this.isNameless && !Nameless.isRunning) {
        if (this.animation) this.animation.unmount();
        this.startAnimation();
      }
      this.isNameless = Nameless.isRunning;
      this.isPermanent = BlackHoles.arePermanent;
      this.pauseMode = player.blackHoleAutoPauseMode;
      this.hasBH2 = BlackHole(2).isUnlocked;
      this.blackHoleUptime = [BlackHole(1).duration / BlackHole(1).cycleLength,
        BlackHole(2).duration / BlackHole(2).cycleLength];
      this.detailedBH2 = this.bh2Status();

      if (player.blackHoleNegative < 1) this.stateChange = this.isPaused ? "取消反转" : "反转";
      else this.stateChange = this.isPaused ? "启动" : "暂停";
	  if (player.blackHoleAutoPauseMode == 0) this.autoPauseText = "自动暂停：不自动暂停";
	  else if (player.blackHoleAutoPauseMode == 2) this.autoPauseText = "自动暂停：黑洞 2 激活前暂停";
	  else if (BlackHole(2).isUnlocked) this.autoPauseText = "自动暂停：黑洞 1 激活前暂停";
	  else this.autoPauseText = "自动暂停：激活前暂停";
    },
    bh2Status() {
      const bh1Remaining = BlackHole(1).timeWithPreviousActiveToNextStateChange;
      const bh2Remaining = BlackHole(2).timeWithPreviousActiveToNextStateChange;

      // Both BH active
      if (BlackHole(1).isActive && BlackHole(2).isActive) {
        const bh2Duration = Math.min(bh1Remaining, bh2Remaining);
        return $t("bh2_active_for_next_X", TimeSpan.fromSeconds(bh2Duration).toStringShort());
      }

      // BH1 active, BH2 will trigger before BH1 runs out
      if (BlackHole(1).isActive && (bh2Remaining < bh1Remaining)) {
        const bh2Duration = Math.min(bh1Remaining - bh2Remaining, BlackHole(2).duration);
        return $t("bh2_will_activate_1", TimeSpan.fromSeconds(bh2Duration).toStringShort());
      }

      // BH2 won't start yet next cycle
      if (BlackHole(1).isActive || (bh2Remaining > BlackHole(1).duration)) {
        const cycleCount = BlackHole(1).isActive
          ? Math.floor((bh2Remaining - bh1Remaining) / BlackHole(1).duration) + 1
          : Math.floor(bh2Remaining / BlackHole(1).duration);
        return $p("bh2_will_activate_2", cycleCount, formatInt(cycleCount));
      }

      // BH1 inactive, BH2 ready to go when BH1 activates
      if (BlackHole(2).isCharged) {
        const bh2Duration = Math.min(BlackHole(1).duration, bh2Remaining);
        return $t("bh2_will_activate_3", TimeSpan.fromSeconds(bh2Duration).toStringShort());
      }

      // BH1 inactive, BH2 starts at some point after BH1 activates
      const bh2Duration = Math.min(BlackHole(1).duration - bh2Remaining, BlackHole(2).duration);
      return $t("bh2_will_activate_4", TimeSpan.fromSeconds(bh2Remaining).toStringShort(), TimeSpan.fromSeconds(bh2Duration).toStringShort());
    },
    togglePause() {
      BlackHoles.togglePause();
      if (BlackHoles.arePaused) {
        player.celestials.nameless.isAutoReleasing = false;
      }
      this.update();
    },
    changePauseMode() {
      let steps;
      switch (this.pauseMode) {
        case BLACK_HOLE_PAUSE_MODE.NO_PAUSE:
          // Note: We don't need to check for permanent BH2 because the button disappears at that point
          steps = BlackHole(1).isPermanent ? 2 : 1;
          break;
        case BLACK_HOLE_PAUSE_MODE.PAUSE_BEFORE_BH1:
          steps = this.hasBH2 ? 1 : 2;
          break;
        case BLACK_HOLE_PAUSE_MODE.PAUSE_BEFORE_BH2:
          steps = 1;
          break;
        default:
          throw new Error("Unrecognized BH offline pausing mode");
      }
      player.blackHoleAutoPauseMode = (this.pauseMode + steps) % Object.values(BLACK_HOLE_PAUSE_MODE).length;
    },
    startAnimation() {
      setTimeout(() => {
        if (this.$refs.canvas) {
          this.animation = new BlackHoleAnimation(this.$refs.canvas.getContext("2d"));
        }
      }, 1);
    },
    gridStyle() {
      return this.isPermanent ? "l-black-hole-upgrade-permanent" : "l-black-hole-upgrade-grid";
    },
  },
  template: `
  <div class="l-black-hole-tab">
    <div
      v-if="isNameless || isDoomed"
      class="c-black-hole-disabled-description"
      data-v-black-hole-tab
    >
      <i v-if="isNameless">
        {{ $t("bh_disabled_nameless") }}
        <br>
      </i>
      {{ $t("bh_disabled") }}
    </div>
    <div
      v-else-if="!isUnlocked"
      class="l-pre-unlock-text"
      data-v-black-hole-tab
    >
      <BlackHoleUnlockButton @blackholeunlock="startAnimation" />
      {{ $t("bh_info", formatX(180)) }}
      <br>
      <br>
      Unlocking the Black Hole also gives {{ formatInt(10) }} Automator Points.
    </div>
    <template v-else>
      <div class="c-subtab-option-container">
        <button
          class="o-primary-btn o-primary-btn--subtab-option"
          @click="togglePause"
        >
          {{ stateChange }} Black Hole
        </button>
        <button
          v-if="!isPermanent"
          class="o-primary-btn o-primary-btn--subtab-option l-auto-pause-button"
          @click="changePauseMode"
          data-v-black-hole-tab
        >
          {{ autoPauseText }}
        </button>
      </div>
      <canvas
        ref="canvas"
        class="c-black-hole-canvas"
        width="400"
        height="400"
      />
      <div class="l-black-hole-upgrade-grid">
        <BlackHoleStateRow
          v-for="(blackHole, i) in blackHoles"
          :key="'state' + i"
          :black-hole="blackHole"
        />
        <span v-if="hasBH2 && !isPermanent">
          <b>{{ detailedBH2 }}</b>
          <br>
          {{ bh2Info[0] }}
          <br>
          {{ bh2Info[1] }}
        </span>
        <br>
        <div v-if="!isPermanent">
          {{ $t("black_hole_permanent_info", formatPercents(0.9999, 2)) }}
          <br>
          {{ blackHoleUptimeString }}
        </div>
        <BlackHoleChargingSliders class="l-nameless-shop-container" />
      </div>
      <div :class="gridStyle()">
        <BlackHoleUpgradeRow
          v-for="(blackHole, i) in blackHoles"
          :key="'upgrades' + i"
          :black-hole="blackHole"
        />
      </div>
    </template>
  </div>
  `
};