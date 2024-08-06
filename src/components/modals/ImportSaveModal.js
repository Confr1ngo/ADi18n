import ModalWrapperChoice from "./ModalWrapperChoice.js";
import PrimaryButton from "../PrimaryButton.js";

const OFFLINE_PROGRESS_TYPE = {
  IMPORTED: 0,
  LOCAL: 1,
  IGNORED: 2,
};

export default {
  name: "ImportSaveModal",
  components: {
    ModalWrapperChoice,
    PrimaryButton
  },
  data() {
    return {
      input: "",
      offlineImport: OFFLINE_PROGRESS_TYPE.IMPORTED,
    };
  },
  computed: {
    saveCheckString() {
      const save = GameSaveSerializer.deserialize(this.input);
      const rawString = GameStorage.checkPlayerObject(save);
      // Keep the length bounded; we don't want the modal to be too big for the screen for particularly bad errors
      return rawString.length > 300 ? `${rawString.slice(0, 297)}...` : rawString;
    },
    player() {
      return this.saveCheckString === "" ? GameSaveSerializer.deserialize(this.input) : undefined;
    },
    progress() {
      return PlayerProgress.of(this.player);
    },
    fileName() {
      return this.player.options.saveFileName;
    },
    antimatter() {
      return this.player.antimatter || this.player.money;
    },
    infinities() {
      // Infinity count data is stored in either player.infinitied or player.infinities based on if the save is before
      // or after the reality update, and this explicit check is needed as it runs before any migration code.
      const infinityData = this.player.infinitied ? this.player.infinitied : this.player.infinities;
      return new Decimal(infinityData);
    },
    hasInput() {
      return this.input !== "";
    },
    inputIsValid() {
      return this.inputIsValidSave || this.inputIsSecret;
    },
    inputIsValidSave() {
      return this.player !== undefined;
    },
    inputIsSecret() {
      return isSecretImport(this.input) || Theme.isSecretTheme(this.input);
    },
    isFromFuture() {
      return this.player.lastUpdate > Date.now();
    },
    lastOpened() {
      const ms = Date.now() - this.player.lastUpdate;
      return this.isFromFuture
        ? `这个存档来自 ${TimeSpan.fromMilliseconds(-ms).toString()} 后的未来。.`
        : `这个存档上次打开的时间为 ${TimeSpan.fromMilliseconds(ms).toString()} 前。`;
    },
    offlineType() {
      // We update here in the computed method instead of elsewhere because otherwise it initializes the text
      // to a wrong or undefined setting
      this.updateOfflineSettings();

      switch (this.offlineImport) {
        case OFFLINE_PROGRESS_TYPE.IMPORTED:
          return "使用导入存档的设置";
        case OFFLINE_PROGRESS_TYPE.LOCAL:
          return "使用本地存档是设置";
        case OFFLINE_PROGRESS_TYPE.IGNORED:
          return "不计算离线进度";
        default:
          throw new Error("Unrecognized offline progress setting for importing");
      }
    },
    offlineDetails() {
      if (this.offlineImport === OFFLINE_PROGRESS_TYPE.IGNORED) {
        return `存档导入后不会计算离线进度。`;
      }
      if (!GameStorage.offlineEnabled) return "这个设置会导致导入存档后不会计算离线进度。";
      if (this.isFromFuture) return "由于系统时钟时间不一致，无法计算离线进度";

      const durationInMs = Date.now() - this.player.lastUpdate;
      const ticks = GameStorage.maxOfflineTicks(durationInMs);
      return `导入后，将计算 ${TimeSpan.fromMilliseconds(durationInMs / ticks).toStringShort()} 里的 ${formatInt(ticks)} 个游戏间隔。`;
    },
    willLoseCosmetics() {
      const currSets = player.reality.glyphs.cosmetics.unlockedFromNG;
      const importedSets = this.player.reality?.glyphs.cosmetics?.unlockedFromNG ?? [];
      return currSets.filter(set => !importedSets.includes(set)).length > 0;
    },
    willLoseSpeedrun() {
      return player.speedrun.isUnlocked && !this.player.speedrun?.isUnlocked;
    }
  },
  mounted() {
    this.$refs.input.select();
  },
  destroyed() {
    // Explicitly setting this to undefined after closing forces the game to fall-back to the stored settings within
    // the player object if this modal is closed - ie. it makes sure actions in the modal don't persist
    GameStorage.offlineEnabled = undefined;
    GameStorage.offlineTicks = undefined;
  },
  methods: {
    changeOfflineSetting() {
      this.offlineImport = (this.offlineImport + 1) % 3;
    },
    updateOfflineSettings() {
      switch (this.offlineImport) {
        case OFFLINE_PROGRESS_TYPE.IMPORTED:
          // These are default values from a new save, used if importing from pre-reality where these props don't exist
          GameStorage.offlineEnabled = this.player.options.offlineProgress ?? true;
          GameStorage.offlineTicks = this.player.options.offlineTicks ?? 1e5;
          break;
        case OFFLINE_PROGRESS_TYPE.LOCAL:
          GameStorage.offlineEnabled = player.options.offlineProgress;
          GameStorage.offlineTicks = player.options.offlineTicks;
          break;
        case OFFLINE_PROGRESS_TYPE.IGNORED:
          GameStorage.offlineEnabled = false;
          break;
      }
    },
    importSave() {
      if (!this.inputIsValid) return;
      this.emitClose();
      GameStorage.import(this.input);
    },
  },
  template: `
  <ModalWrapperChoice
    :show-cancel="!inputIsValid"
    :show-confirm="false"
  >
    <template #header>
      导入存档
    </template>
    <input
      ref="input"
      v-model="input"
      type="text"
      class="c-modal-input c-modal-import__input"
      @keyup.enter="importSave"
      @keyup.esc="emitClose"
    >
    <div class="c-modal-import__save-info">
      <div v-if="inputIsSecret">
        ???
      </div>
      <template v-else-if="inputIsValidSave">
        <div v-if="fileName">
          文件名称: {{ fileName }}
        </div>
        <div>{{ $t("antimatter") }}: {{ formatPostBreak(antimatter, 2, 1) }}</div>
        <div v-if="progress.isInfinityUnlocked">
          {{ $t("infinities") }}: {{ formatPostBreak(infinities, 2) }}
        </div>
        <div v-if="progress.isEternityUnlocked">
          {{ $t("eternities") }}: {{ formatPostBreak(player.eternities, 2) }}
        </div>
        <div v-if="progress.isRealityUnlocked">
          {{ $t("realities") }}: {{ formatPostBreak(player.realities, 2) }}
        </div>
        <div v-if="progress.hasFullCompletion">
          通关次数: {{ formatInt(player.records.fullGameCompletions) }}
        </div>
        <div class="c-modal-import__warning">
          （注意：这将覆盖你当前的游戏进度！）
        </div>
        <br>
        <div>
          {{ lastOpened }}
          <div
            class="o-primary-btn"
            @click="changeOfflineSetting"
          >
            {{ $t("htp_offline_progress_title") }}: {{ offlineType }}
          </div>
          <span v-html="offlineDetails" />
        </div>
      </template>
      <div v-else-if="hasInput">
        {{ $t("import_save_dialog_invalid_save") }}:
        <br>
        {{ saveCheckString }}
      </div>
      <div
        v-if="player"
        class="c-modal-hard-reset-danger"
      >
        <div v-if="willLoseCosmetics">
          <br>
          {{ $t("will_lose_cosmetics_disclaimer") }}
        </div>
        <div v-if="willLoseSpeedrun">
          <br>
          你将失去进行速通的能力，因为此存档还没有解锁速通。
        </div>
      </div>
    </div>

    <PrimaryButton
      v-if="inputIsValid"
      class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
      @click="importSave"
    >
      {{ $t("import") }}
    </PrimaryButton>
  </ModalWrapperChoice>
  `
};