import { MatterScale } from "./matter-scale.js";
import PrimaryButton from "../../PrimaryButton.js";

export default {
  name: "StatisticsTab",
  components: {
    PrimaryButton
  },
  data() {
    return {
      isDoomed: false,
      realTimeDoomed: TimeSpan.zero,
      totalAntimatter: new Decimal(0),
      realTimePlayed: TimeSpan.zero,
      timeSinceCreation: 0,
      uniqueNews: 0,
      totalNews: 0,
      secretAchievementCount: 0,
      infinity: {
        isUnlocked: false,
        count: new Decimal(0),
        banked: new Decimal(0),
        projectedBanked: new Decimal(0),
        bankRate: new Decimal(0),
        hasBest: false,
        best: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        bestRate: new Decimal(0),
      },
      eternity: {
        isUnlocked: false,
        count: new Decimal(0),
        hasBest: false,
        best: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        bestRate: new Decimal(0),
      },
      reality: {
        isUnlocked: false,
        count: 0,
        best: TimeSpan.zero,
        bestReal: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        totalTimePlayed: TimeSpan.zero,
        bestRate: new Decimal(0),
        bestRarity: 0,
      },
      matterScale: [],
      lastMatterTime: 0,
      paperclips: 0,
      fullTimePlayed: 0,
    };
  },
  computed: {
    // These are here to avoid extra spaces in-game pre-reality and to get around codefactor 120-char limits in the
    // HTML template due to the fact that adding a linebreak also adds a space
    infinityCountString() {
      const num = this.infinity.count;
      return num.gt(0)
        ? `${this.formatDecimalAmount(num)}`
        : "0";
    },
    eternityCountString() {
      const num = this.eternity.count;
      return num.gt(0)
        ? `${this.formatDecimalAmount(num)}`
        : "0";
    },
    fullGameCompletions() {
      return player.records.fullGameCompletions;
    },
    startDate() {
      return Time.toDateTimeString(player.records.gameCreatedTime);
    },
    saveAge() {
      return TimeSpan.fromMilliseconds(this.timeSinceCreation);
    },
  },
  methods: {
    update() {
      const records = player.records;
      this.totalAntimatter.copyFrom(records.totalAntimatter);
      this.realTimePlayed.setFrom(records.realTimePlayed);
      this.fullTimePlayed = TimeSpan.fromMilliseconds(records.previousRunRealTime + records.realTimePlayed);
      this.uniqueNews = NewsHandler.uniqueTickersSeen;
      this.totalNews = player.news.totalSeen;
      this.secretAchievementCount = SecretAchievements.all.filter(a => a.isUnlocked).length;
      this.timeSinceCreation = Date.now() - player.records.gameCreatedTime;

      const progress = PlayerProgress.current;
      const isInfinityUnlocked = progress.isInfinityUnlocked;
      const infinity = this.infinity;
      const bestInfinity = records.bestInfinity;
      infinity.isUnlocked = isInfinityUnlocked;
      if (isInfinityUnlocked) {
        infinity.count.copyFrom(Currency.infinities);
        infinity.banked.copyFrom(Currency.infinitiesBanked);
        infinity.projectedBanked = new Decimal(0).plusEffectsOf(
          Achievement(131).effects.bankedInfinitiesGain,
          TimeStudy(191)
        );
        infinity.bankRate = infinity.projectedBanked.div(Math.clampMin(33, records.thisEternity.time)).times(60000);
        infinity.hasBest = bestInfinity.time < 999999999999;
        infinity.best.setFrom(bestInfinity.time);
        infinity.this.setFrom(records.thisInfinity.time);
        infinity.bestRate.copyFrom(bestInfinity.bestIPminEternity);
      }

      const isEternityUnlocked = progress.isEternityUnlocked;
      const eternity = this.eternity;
      const bestEternity = records.bestEternity;
      eternity.isUnlocked = isEternityUnlocked;
      if (isEternityUnlocked) {
        eternity.count.copyFrom(Currency.eternities);
        eternity.hasBest = bestEternity.time < 999999999999;
        eternity.best.setFrom(bestEternity.time);
        eternity.this.setFrom(records.thisEternity.time);
        eternity.bestRate.copyFrom(bestEternity.bestEPminReality);
      }

      const isRealityUnlocked = progress.isRealityUnlocked;
      const reality = this.reality;
      const bestReality = records.bestReality;
      reality.isUnlocked = isRealityUnlocked;

      if (isRealityUnlocked) {
        reality.count = Math.floor(Currency.realities.value);
        reality.best.setFrom(bestReality.time);
        reality.bestReal.setFrom(bestReality.realTime);
        reality.this.setFrom(records.thisReality.time);
        reality.totalTimePlayed.setFrom(records.totalTimePlayed);
        // Real time tracking is only a thing once reality is unlocked:
        infinity.thisReal.setFrom(records.thisInfinity.realTime);
        infinity.bankRate = infinity.projectedBanked.div(Math.clampMin(33, records.thisEternity.realTime)).times(60000);
        eternity.thisReal.setFrom(records.thisEternity.realTime);
        reality.thisReal.setFrom(records.thisReality.realTime);
        reality.bestRate.copyFrom(bestReality.RMmin);
        reality.bestRarity = Math.max(strengthToRarity(bestReality.glyphStrength), 0);
      }
      this.updateMatterScale();

      this.isDoomed = Pelle.isDoomed;
      this.realTimeDoomed.setFrom(player.records.realTimeDoomed);
      this.paperclips = player.news.specialTickerData.paperclips;
    },
    formatDecimalAmount(value) {
      return value.gt(1e9) ? format(value, 3) : formatInt(Math.floor(value.toNumber()));
    },
    // Only updates once per second to reduce jitter
    updateMatterScale() {
      if (Date.now() - this.lastMatterTime > 1000) {
        this.matterScale = MatterScale.estimate(Currency.antimatter.value);
        this.lastMatterTime = Date.now();
      }
    },
    realityClassObject() {
      return {
        "c-stats-tab-title": true,
        "c-stats-tab-reality": !this.isDoomed,
        "c-stats-tab-doomed": this.isDoomed,
      };
    }
  },
  template: `
  <div
    class="c-stats-tab"
    data-v-statistics-tab
  >
    <div>
      <PrimaryButton onclick="Modal.catchup.show(0)">
        查看内容概要
      </PrimaryButton>
      <div
        class="c-stats-tab-title c-stats-tab-general"
        data-v-statistics-tab
      >
        {{ $t("statistics_general") }}
      </div>
      <div
        class="c-stats-tab-general"
        data-v-statistics-tab
      >
        <div>{{ $p("statistics_total_antimatter", totalAntimatter, format(totalAntimatter, 2, 1)) }}</div>
        <div>{{ $t("statistics_total_time_played", realTimePlayed) }}</div>
        <div v-if="reality.isUnlocked">
          {{ $t("statistics_your_existence_has_spanned", reality.totalTimePlayed) }}
        </div>
        <div>
           {{ $t("statistics_start_date", startDate, saveAge) }}
        </div>
        <br>
        <div>
          {{ $p("statistics_news_seen", totalNews, formatInt(totalNews)) }}
        </div>
        <div>
          你已阅读 {{ formatInt(uniqueNews) }} 条不同新闻。
        </div>
        <div>
          {{ $p("statistics_secret_achievements", secretAchievementCount, formatInt(secretAchievementCount)) }}
        </div>
        <div v-if="paperclips">
          You have {{ quantifyInt("useless paperclip", paperclips) }}.
        </div>
        <div v-if="fullGameCompletions">
          <br>
          <b>
            {{ $p("statistics_game_completed", fullGameCompletions, formatInt("time", fullGameCompletions)) }}.
            <br>
            {{ $t("statistics_total_time_played_all_playthroughs, fullTimePlayed") }}
          </b>
        </div>
      </div>
      <div>
        <br>
        <div
          class="c-matter-scale-container c-stats-tab-general"
          data-v-statistics-tab
        >
          <div
            v-for="(line, i) in matterScale"
            :key="i"
          >
            {{ line }}
          </div>
          <br v-if="matterScale.length < 2">
          <br v-if="matterScale.length < 3">
        </div>
      </div>
      <br>
    </div>
    <div
      v-if="infinity.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
      data-v-statistics-tab
    >
      <div
        class="c-stats-tab-title c-stats-tab-infinity"
        data-v-statistics-tab
      >
        {{ $t("infinity") }}
      </div>
      <div>
	    <span v-if="eternity.isUnlocked">本次永恒中</span>你有 {{ infinityCountString }} 次无限。
      </div>
      <div v-if="infinity.banked.gt(0)">
        你有 {{ formatDecimalAmount(infinity.banked.floor()) }} 次储存的无限次数。
      </div>
      <div v-if="infinity.hasBest">
        你最快的无限消耗了 {{ infinity.best.toStringShort() }}。
      </div>
      <div v-else>
	  <span v-if="eternity.isUnlocked">本次永恒中</span>你没有最快的无限。
      </div>
      <div>
        你已在当前永恒中花费了 {{ infinity.this.toStringShort() }} 的<span v-if="reality.isUnlocked">游戏内</span>时间。<span v-if="reality.isUnlocked">（现实时间 {{ infinity.thisReal.toStringShort() }}）</span>
      </div>
      <div>
	    <span v-if="eternity.count.gt(0)">本次永恒中</span>你最高的无限点数获取速度为 {{ format(infinity.bestRate, 2, 2) }} 每分钟。
      </div>
      <br>
    </div>
    <div
      v-if="eternity.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
      data-v-statistics-tab
    >
      <div
        class="c-stats-tab-title c-stats-tab-eternity"
        data-v-statistics-tab
      >
        {{ $t("tab_eternity") }}
      </div>
      <div>
	    <span v-if="reality.isUnlocked">本次现实中</span>你有 {{ eternityCountString }}<span v-if="reality.isUnlocked"> 次永恒。
      </div>
      <div v-if="infinity.projectedBanked.gt(0)">
        本次永恒时将获得 {{ formatDecimalAmount(infinity.projectedBanked.floor()) }} 次储存的无限次数。（每分钟 {{ formatDecimalAmount(infinity.bankRate) }} 次）
      </div>
      <div v-else-if="infinity.banked.gt(0)">
        You will gain no Banked Infinities on Eternity.
      </div>
      <div v-if="eternity.hasBest">
	    你最快的永恒消耗了 {{ eternity.best.toStringShort() }}。
      </div>
      <div v-else>
	  <span v-if="reality.isUnlocked">本次现实中</span>你没有最快的永恒。
      </div>
      <div>
        你已在当前永恒中花费了 {{ eternity.this.toStringShort() }} 的<span v-if="reality.isUnlocked">游戏内</span>时间。<span v-if="reality.isUnlocked">（现实时间 {{ eternity.thisReal.toStringShort() }}）</span>
      </div>
      <div>
	    <span v-if="reality.isUnlocked">本次现实中</span>你最高的永恒点数获取速度为 {{ format(eternity.bestRate, 2, 2) }} 每分钟。
      </div>
      <br>
    </div>
    <div
      v-if="reality.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
      data-v-statistics-tab
    >
      <div
        :class="realityClassObject()"
        data-v-statistics-tab
      >
        {{ isDoomed ? $t("doomed_reality") : $t("tab_reality") }}
      </div>
      <div>你已进行 {{ formatInt(reality.count) }} 次现实。</div>
      <div>你最快的现实花费了 {{ reality.best.toStringShort() }} 的游戏内时间。</div>
      <div>你最快的现实花费了 {{ reality.bestReal.toStringShort() }} 的现实时间。</div>
      <div
        :class="{ 'c-stats-tab-doomed' : isDoomed }"
        data-v-statistics-tab
      >
        你已在当前{{ isDoomed ? "Armageddon" : "现实" }}中花费了 {{ reality.this.toStringShort() }} 的游戏内时间。（现实时间 {{ reality.thisReal.toStringShort() }}）
      </div>
      <div
        v-if="isDoomed"
        class="c-stats-tab-doomed"
        data-v-statistics-tab
      >
        You have been Doomed for {{ realTimeDoomed.toStringShort() }}, real time.
      </div>
      <div>
        你最高的现实机器获取速度为 {{ format(reality.bestRate, 2, 2) }} 每分钟。
      </div>
      <div>你获得的符文最高稀有度为 {{ formatRarity(reality.bestRarity) }}。</div>
      <br>
    </div>
  </div>
  `
};