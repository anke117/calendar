<template>
  <div>
    <full-calendar
      :events="fcEvents"
      :first-day="7"
      locale="zh-ch"
      @changeMonth="changeMonth"
      @eventClick="eventClick"
      @dayClick="dayClick"
    ></full-calendar>
  </div>
</template>
<script>
export default {
  data() {
    return {
      fcEvents: [
        {
          title: "房量88",
          start: "2021-01-01",
          price: "¥1",
          breakfeast: "2"
        },
        {
          title: "房量88",
          start: "2021-01-02",
          price: "¥1",
          breakfeast: "1"
        },
        {
          title: "房量88",
          start: "2021-01-03",
          price: "¥1",
          breakfeast: "1"
        }
      ]
    };
  },
  methods: {
    //   改变当前月份
    changeMonth(currentMonth) {
      console.log("changeMonth", currentMonth);
    },
    // 事件点击
    eventClick(event, clickDate) {
      console.log("eventClick", event, clickDate);
    },
    // 日期点击
    dayClick(clickDate) {
      console.log("dayClick", clickDate);
    },
  },
  components: {
    "full-calendar": require("src/fullCalendar")
  }
};
</script>