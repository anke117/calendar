<template>
  <div class="full-calendar-header">
    <div class="header-center">
      <el-button type="primary" @click.stop="goPrev" icon="el-icon-arrow-left" size="mini">
        上个月
      </el-button>
      <el-date-picker
        v-model="currentMonthValue"
        format="yyyy 第 MM 月"
        type="month"
        :clearable="false"
        @change="goMonth"
        placeholder="选择月"
      />
      <el-button type="primary" @click.stop="goNext" size="mini">
        下个月
        <i class="el-icon-arrow-right el-icon--right" />
      </el-button>
    </div>
  </div>
</template>
<script>
import dateFunc from "./dateFunc";
import moment from "moment";
export default {
  props: {
    currentMonth: {
      type: Object,
      default: () => {
        return moment().startOf("month");
      }
    },
    locale: {
      type: String,
      default: "zh-cn"
    }
  },
  watch: {
    currentMonth: {
      handler(val) {
        this.currentMonthValue = val.locale(this.locale).format("yyyy MM");
      },
      deep: true
    }
  },
  data() {
    return {
      currentMonthValue: ""
    };
  },
  methods: {
    // 向前一个月
    goPrev() {
      var newMonth = moment(this.currentMonth).subtract(1, "months").startOf("month");
      this.$emit("change", newMonth);
    },
    // 向后一个月
    goNext() {
      var newMonth = moment(this.currentMonth).add(1, "months").startOf("month");
      this.$emit("change", newMonth);
    },
    // 选择月份
    goMonth(data) {
      var newMonth = moment(data).startOf("month");
      this.$emit("change", newMonth);
    }
  }
};
</script>
<style lang="scss" scoped>
.full-calendar-header {
  .header-center {
    display: flex;
    justify-content: space-between;
  }
}
</style>
