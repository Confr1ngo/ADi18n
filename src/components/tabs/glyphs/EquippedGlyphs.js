import GlyphComponent from "../../GlyphComponent.js";

export default {
  name: "EquippedGlyphs",
  components: {
    GlyphComponent
  },
  data() {
    return {
      glyphs: [],
      dragoverIndex: -1,
      respec: player.reality.respec,
      respecIntoProtected: player.options.respecIntoProtected,
      undoSlotsAvailable: 0,
      undoAvailable: false,
      undoVisible: false,
      cosmeticGlow: false,
    };
  },
  computed: {
    // Empty slots are bigger due to the enlarged drop zone
    GLYPH_SIZE: () => 5,
    slotCount() {
      return this.glyphs.length;
    },
    arrangementRadius() {
      if (this.slotCount === 0) return 0;
      return this.slotCount + 1;
    },
    respecTooltip() {
      const reset = Pelle.isDoomed ? "Armageddon" : $t("reality_noun");
      return this.respec
        ? `Respec is active and will place your currently - equipped Glyphs into your inventory after ${reset}.`
        : `Your currently-equipped Glyphs will stay equipped on ${reset}.`;
    },
    undoTooltip() {
      if (!this.undoSlotsAvailable) return $t("glyph_undo_unavailable_1");
      return this.undoAvailable
        ? ("Unequip the last equipped Glyph and rewind Reality to when you equipped it." +
          " (Most resources will be fully reset)")
        : "Undo is only available for Glyphs equipped during this Reality";
    },
    unequipText() {
      if (Pelle.isDoomed) return $t("unequip_glyphs_on_armageddon");
      return $t("unequip_glyphs_on_reality");
    },
    isDoomed() {
      return Pelle.isDoomed;
    },
    glyphRespecStyle() {
      if (this.respec) {
        return {
          color: "var(--color-reality-light)",
          "background-color": "var(--color-reality)",
          "border-color": "#094e0b",
          cursor: "pointer",
        };
      }
      return {
        cursor: "pointer",
      };
    },
    // "Armageddon" causes the button to have text overflow, so we conditionally make the button taller; this doesn't
    // cause container overflow due to another button being removed entirely when doomed
    unequipClass() {
      return {
        "l-glyph-equip-button": this.isDoomed,
        "l-glyph-equip-button-short": !this.isDoomed,
      };
    },
    unequipGlyphToText() {
      return $t_split(
        this.respecIntoProtected
        ? "unequip_glyphs_to_protected_slots"
        : "unequip_glyphs_to_main_inventory"
      );
    }
  },
  created() {
    this.on$(GAME_EVENT.GLYPHS_EQUIPPED_CHANGED, this.glyphsChanged);
    this.glyphsChanged();
  },
  methods: {
    update() {
      this.respec = player.reality.respec;
      this.respecIntoProtected = player.options.respecIntoProtected;
      this.undoSlotsAvailable = this.respecIntoProtected
        ? Glyphs.totalSlots - GameCache.glyphInventorySpace.value - Glyphs.inventoryList.length > 0
        : GameCache.glyphInventorySpace.value > 0;
      this.undoVisible = TeresaUnlocks.undo.canBeApplied;
      this.undoAvailable = this.undoVisible && this.undoSlotsAvailable && player.reality.glyphs.undo.length > 0;
      this.cosmeticGlow = player.reality.glyphs.cosmetics.glowNotification;
    },
    glyphPositionStyle(idx) {
      const angle = 2 * Math.PI * idx / this.slotCount;
      const dx = -this.GLYPH_SIZE / 2 + this.arrangementRadius * Math.sin(angle);
      const dy = -this.GLYPH_SIZE / 2 + this.arrangementRadius * Math.cos(angle);
      return {
        position: "absolute",
        left: `calc(50% + ${dx}rem)`,
        top: `calc(50% + ${dy}rem)`,
        "z-index": 1,
      };
    },
    dragover(event, idx) {
      if (!event.dataTransfer.types.includes(GLYPH_MIME_TYPE)) return;
      event.preventDefault();
      this.dragoverIndex = idx;
    },
    dragleave(idx) {
      if (this.dragoverIndex === idx) this.dragoverIndex = -1;
    },
    drop(event, idx) {
      this.dragoverIndex = -1;
      const id = parseInt(event.dataTransfer.getData(GLYPH_MIME_TYPE), 10);
      if (isNaN(id)) return;
      const glyph = Glyphs.findById(id);
      if (glyph) Glyphs.equip(glyph, idx);
    },
    toggleRespec() {
      player.reality.respec = !player.reality.respec;
    },
    toggleRespecIntoProtected() {
      player.options.respecIntoProtected = !player.options.respecIntoProtected;
    },
    glyphsChanged() {
      this.glyphs = Glyphs.active.map(GlyphGenerator.copy);
      this.$recompute("slotCount");
    },
    undo() {
      if (!this.undoAvailable || Pelle.isDoomed) return;
      if (player.options.confirmations.glyphUndo) Modal.glyphUndo.show();
      else Glyphs.undo();
    },
    dragEvents(idx) {
      return {
        dragover: $event => this.dragover($event, idx),
        dragleave: () => this.dragleave(idx),
        drop: $event => this.drop($event, idx),
      };
    },
    showEquippedModal() {
      // If there aren't any glyphs equipped, the array is full of nulls which get filtered out by x => x
      if (this.glyphs.filter(x => x).length === 0) return;
      Modal.glyphShowcasePanel.show({
        name: $t("equipped_glyphs"),
        glyphSet: this.glyphs,
        closeEvent: GAME_EVENT.GLYPHS_EQUIPPED_CHANGED,
      });
    },
    showOptionModal() {
      player.reality.glyphs.cosmetics.glowNotification = false;
      Modal.glyphDisplayOptions.show();
    },
    clickGlyph(glyph, idx, increaseSound = false) {
      if (Glyphs.isMusicGlyph(glyph)) {
        const sound = idx + (increaseSound ? 6 : 1);
        new Audio(`audio/note${sound}.mp3`).play();
      }
    }
  },
  template: `
  <div
    class="l-equipped-glyphs"
    data-v-euqipped-glyphs
  >
    <div
      class="l-equipped-glyphs__slots"
      data-v-euqipped-glyphs
    >
      <div
        v-for="(glyph, idx) in glyphs"
        :key="idx"
        class="l-glyph-set-preview"
        :style="glyphPositionStyle(idx)"
        v-on="dragEvents(idx)"
        @click="showEquippedModal"
        data-v-euqipped-glyphs
      >
        <!-- the drop zone is a bit larger than the glyph itself. -->
        <div class="l-equipped-glyphs__dropzone" />
        <GlyphComponent
          v-if="glyph"
          :key="idx"
          :glyph="glyph"
          :circular="true"
          :is-active-glyph="true"
          class="c-equipped-glyph"
          @clicked="clickGlyph(glyph, idx)"
          @shiftClicked="clickGlyph(glyph, idx, true)"
          @ctrlShiftClicked="clickGlyph(glyph, idx, true)"
          data-v-euqipped-glyphs
        />
        <div
          v-else
          :class="['l-equipped-glyphs__empty', 'c-equipped-glyphs__empty',
                   {'c-equipped-glyphs__empty--dragover': dragoverIndex === idx}]"
          data-v-euqipped-glyphs
        />
      </div>
    </div>
    <div
      class="l-equipped-glyphs__buttons"
      data-v-euqipped-glyphs
    >
      <button
        class="c-reality-upgrade-btn"
        :class="unequipClass"
        :style="glyphRespecStyle"
        :ach-tooltip="respecTooltip"
        @click="toggleRespec"
        data-v-euqipped-glyphs
      >
        {{ unequipText }}
      </button>
      <button
        v-if="undoVisible"
        class="l-glyph-equip-button c-reality-upgrade-btn"
        :class="{'c-reality-upgrade-btn--unavailable': !undoAvailable}"
        :ach-tooltip="undoTooltip"
        @click="undo"
        data-v-euqipped-glyphs
      >
        <span>Rewind to <b>undo</b> the last equipped Glyph</span>
      </button>
      <button
        class="l-glyph-equip-button c-reality-upgrade-btn"
        @click="toggleRespecIntoProtected"
        data-v-euqipped-glyphs
      >
        {{ unequipGlyphToText[0] }}
        <br>
        {{ unequipGlyphToText[1] }}
      </button>
      <button
        class="l-glyph-equip-button-short c-reality-upgrade-btn"
        :class="{'tutorial--glow': cosmeticGlow}"
        @click="showOptionModal"
        data-v-euqipped-glyphs
      >
        {{ $t("glyph_visual_options") }}
      </button>
    </div>
  </div>
  `
};