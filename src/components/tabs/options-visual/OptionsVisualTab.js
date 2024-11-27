import ExpandingControlBox from "../../ExpandingControlBox.js";
import OpenModalHotkeysButton from "../../OpenModalHotkeysButton.js";
import OptionsButton from "../../OptionsButton.js";
import PrimaryToggleButton from "../../PrimaryToggleButton.js";
import SelectNotationDropdown from "./SelectNotationDropdown.js";
import SelectThemeDropdown from "./SelectThemeDropdown.js";
import SelectSidebarDropdown from "./SelectSidebarDropdown.js";
import UpdateRateSlider from "./UpdateRateSlider.js";

export default {
  name: "OptionsVisualTab",
  components: {
    UpdateRateSlider,
    PrimaryToggleButton,
    ExpandingControlBox,
    OptionsButton,
    OpenModalHotkeysButton,
    SelectThemeDropdown,
    SelectNotationDropdown,
    SelectSidebarDropdown
  },
  data() {
    return {
      theme: "",
      notation: "",
      sidebarResource: "",
      headerTextColored: true,
      language: ""
    };
  },
  computed: {
    sidebarDB: () => GameDatabase.sidebarResources,
    // languageLabel() {
    //   return $t("X_colon_Y", $t("language_title"), this.language);
    // },
    themeLabel() {
      return $t("X_colon_Y", $t("theme"), Themes.find(this.theme).displayName());
    },
    notationLabel() {
      return $t("X_colon_Y", $t("notation"), $t(`notation_${this.notation.toLowerCase().replace(/\s/g, "_")}`));
    },
    sidebarLabel() {
      return `边注栏 (现代 UI): ${this.sidebarResource}`;
    },
    UILabel() {
      return `UI: ${this.$viewModel.newUI ? "现代" : "经典"}`;
    }
  },
  watch: {
    headerTextColored(newValue) {
      player.options.headerTextColored = newValue;
    },
  },
  methods: {
    update() {
      const options = player.options;
      this.language = Languages.current.formattedName;
      this.theme = Theme.currentName();
      this.notation = options.notation;
      this.sidebarResource = player.options.sidebarResourceID === 0
        ? "上一个资源"
        : $t(this.sidebarDB.find(e => e.id === player.options.sidebarResourceID).optionName);
      this.headerTextColored = options.headerTextColored;
    },
  },
  template: `
  <div class="l-options-tab">
    <div class="l-options-grid">
      <div class="l-options-grid__row">
        <OptionsButton
          class="o-primary-btn--option_font-large"
          onclick="GameOptions.toggleUI()"
        >
          {{ UILabel }}
        </OptionsButton>
        <UpdateRateSlider />
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.newsOptions.show();"
        >
          打开新闻设置
        </OptionsButton>
      </div>
      <div class="l-options-grid__row">
        <ExpandingControlBox
          class="l-options-grid__button c-options-grid__notations"
          button-class="o-primary-btn o-primary-btn--option l-options-grid__notations-header"
          :label="themeLabel"
        >
          <template #dropdown>
            <SelectThemeDropdown />
          </template>
        </ExpandingControlBox>
        <ExpandingControlBox
          class="l-options-grid__button c-options-grid__notations"
          button-class="o-primary-btn o-primary-btn--option l-options-grid__notations-header"
          :label="notationLabel"
        >
          <template #dropdown>
            <SelectNotationDropdown />
          </template>
        </ExpandingControlBox>
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.notation.show();"
        >
          打开指数记数法设置
        </OptionsButton>
      </div>
      <div class="l-options-grid__row">
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.animationOptions.show();"
        >
          打开动画设置
        </OptionsButton>
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.infoDisplayOptions.show()"
        >
          打开信息显示设置
        </OptionsButton>
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.awayProgressOptions.show()"
        >
          打开离线资源设置
        </OptionsButton>
      </div>
      <div class="l-options-grid__row">
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.hiddenTabs.show()"
        >
          修改可见标签页
        </OptionsButton>
        <PrimaryToggleButton
          v-model="headerTextColored"
          class="o-primary-btn--option l-options-grid__button"
          label="高亮资源:"
        />
        <ExpandingControlBox
          v-if="$viewModel.newUI"
          class="l-options-grid__button c-options-grid__notations"
          button-class="o-primary-btn o-primary-btn--option l-options-grid__notations-header"
          :label="sidebarLabel"
        >
          <template #dropdown>
            <SelectSidebarDropdown />
          </template>
        </ExpandingControlBox>
      </div>
      <OpenModalHotkeysButton />
    </div>
  </div>
  `
};