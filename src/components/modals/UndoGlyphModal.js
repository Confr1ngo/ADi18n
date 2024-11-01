import ModalWrapperChoice from "./ModalWrapperChoice.js";

export default {
  name: "UndoGlyphModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      showStoredGameTime: false,
    };
  },
  methods: {
    update() {
      this.showStoredGameTime = Nameless.isUnlocked;
    },
    realityInvalidate() {
      this.emitClose();
      Modal.message.show("Glyph Undo can only undo with a Reality!",
        { closeEvent: GAME_EVENT.REALITY_RESET_AFTER });
    },
    handleYesClick() {
      this.emitClose();
      Glyphs.undo();
    },
  },
  template: `
  <ModalWrapperChoice
    option="glyphUndo"
    @confirm="handleYesClick"
  >
    <template #header>
      You are about to undo equipping a Glyph
    </template>
    <div
      class="c-modal-message__text c-text-wrapper"
      data-v-undo-glyph-modal
    >
      The last equipped Glyph will be removed.
      Reality will be reset, but some things will be restored to what they were when it was equipped:
      <br>
      <div
        class="c-text-wrapper"
        data-v-undo-glyph-modal
      >
        <br>- Antimatter, Infinity Points, and Eternity Points
        <br>- Dilation Upgrades, Tachyon Particles, and Dilated Time
        <br>- Time Theorems and Eternity Challenge completions
        <br>- Time Dimension and Reality unlocks
        <br>- Time in current Infinity/Eternity/Reality
        <span v-if="showStoredGameTime"><br>- Stored game time</span>
      </div>
      <br>
      Note that if you invalidate special requirements for certain things (such as the achievement for completing
      a Reality without producing antimatter), they will remain invalid even after undoing. In those cases, you will
      need to complete the conditions in a single Reality without using undo.
    </div>
  </ModalWrapperChoice>
  `
};