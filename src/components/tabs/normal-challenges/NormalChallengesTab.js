import ChallengeGrid from "../../ChallengeGrid.js";
import ChallengeTabHeader from "../../ChallengeTabHeader.js";
import NormalChallengeBox from "./NormalChallengeBox.js";

export default {
  name: "NormalChallengesTab",
  components: {
    ChallengeGrid,
    ChallengeTabHeader,
    NormalChallengeBox
  },
  computed: {
    challenges() {
      return NormalChallenges.all;
    }
  },
  template: `
  <div class="l-challenges-tab">
    <ChallengeTabHeader />
    <div>
      某些挑战设有解锁条件。
    </div>
    <div>
      若自动大坍缩购买器已启用，其将在达到无限反物质后立刻试图大坍缩。
    </div>
    <ChallengeGrid
      v-slot="{ challenge }"
      :challenges="challenges"
    >
      <NormalChallengeBox :challenge="challenge" />
    </ChallengeGrid>
  </div>
  `
};