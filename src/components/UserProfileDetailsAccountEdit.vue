<template>
  <div class="container-module" id="container-module">
    <div class="headline-container">
      <h1>Account Settings</h1>
      <div class="exit" id="exit" @click="modalClosed">
        <CloseIcon class="close-icon" />
      </div>
    </div>
    <div class="edit-form" id="form1">
      <label for="language" id="language">Language</label>
      <select name="language" id="language" v-model="accountSettings.language">
        <option value="" selected disabled>{{ currentLanguage }}</option>
        <option
          :value="language.name"
          v-for="(language, idx) in languages"
          :key="idx"
        >
          {{ language.name }}
        </option>
      </select>

      <label for="timezone" id="timezone">Time Zone</label>
      <select
        name="time-zone"
        id="time-zone"
        v-model="accountSettings.timezone"
      >
        <option value="" disabled>{{ currentTimeZone }}</option>
        <option
          :value="timezone.name"
          v-for="(timezone, idx) in timezones"
          :key="idx"
        >
          {{ `(${timezone.offset}) ` + timezone.name }}
        </option>
      </select>

      <div class="checkboxes">
        <input
          id="enale"
          type="radio"
          value="true"
          v-model="accountSettings.status"
        />
        <label for="enable">Enabled</label>
        <br />

        <input
          id="disable"
          type="radio"
          value="false"
          v-model="accountSettings.status"
        />
        <label for="disable">Disabled</label>
      </div>

      <button
        type="submit"
        id="save-button"
        class="confirm-btn"
        @click="saveChanges"
        :disabled="doesDataChanged"
      >
        Save
      </button>
    </div>
  </div>
</template>



<script>
import { languages } from "../assets/formLanguages";
import { timeZones } from "../assets/timeZones";
import { mapActions, mapGetters } from "vuex";
import CloseIcon from "./icons/CloseIcon";

export default {
  components: {
    CloseIcon,
  },
  data() {
    return {
      languages: languages,
      timezones: timeZones,
      accountSettings: {
        language: "",
        timezone: "",
        status: true,
      },
    };
  },

  methods: {
    modalClosed: function () {
      this.$emit("close");
    },
    ...mapActions("user", ["updateAccountSettings"]),

    saveChanges() {
      this.updateAccountSettings(this.accountSettings);
      this.modalClosed();
    },
  },
  computed: {
    ...mapGetters("user", {
      currentTimeZone: "getCurrentTimeZone",
      currentLanguage: "getCurrentLanguage",
      currentStatus: "getStatus",
    }),
    doesDataChanged() {
      if (
        this.accountSettings.language == "" ||
        this.accountSettings.timezone == ""
      ) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/main.scss";

.checkboxes {
  display: flex;
  align-self: flex-start;
  margin-top: 1.5rem;

  label {
    margin: 0 1rem 0 0;
  }
  input[type="radio"] {
    margin-right: 10px;
    transform: scale(1.5);
  }
}
</style>