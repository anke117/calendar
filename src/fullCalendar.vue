<template>
  <div class="comp-full-calendar">
    <!-- 选择月份 -->
    <calendar-header
      :current-month="currentMonth"
      :firstDay="firstDay"
      :locale="locale"
      @change="emitChangeMonth"
    />
    <div class="full-calendar-body">
      <div class="weeks">
        <div
          class="week"
          :class="{ weekNo: index == 0 || index == 6 }"
          v-for="(dayIndex, index) in 7"
          :key="index"
        >
          {{ (dayIndex - 1) | localeWeekDay(firstDay, locale) }}
        </div>
      </div>
      <div class="dates">
        <div class="dates-bg">
          <div class="week-row" v-for="(week, index) in currentDates" :key="index">
            <div
              class="day-cell"
              v-for="(day, indexp) in week"
              :key="indexp"
              :class="{
                today: day.isToday,
                'not-cur-month': !day.isCurMonth,
                'cur-brefore-today': day.isCurMonth && day.isBeforeToday,
                'cur-after-today': day.isCurMonth && !day.isBeforeToday
              }"
            >
              <div class="day-cell-content">
                <div class="day-number">{{ day.monthDay }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 日历和事件 -->
        <div class="dates-events">
          <div class="events-week" v-for="(week, index) in currentDates" :key="index">
            <div
              class="events-day"
              v-for="(day, indexp) in week"
              :key="indexp"
              track-by="$index"
              :class="{
                today: day.isToday,
                'not-cur-month': !day.isCurMonth,
                'cur-brefore-today': day.isCurMonth && day.isBeforeToday,
                'cur-after-today': day.isCurMonth && !day.isBeforeToday
              }"
              @click="dayClick(day.date)"
            >
              <div class="day-cell-content">
                <div class="day-number">{{ day.monthDay }}</div>
                <div class="event-box">
                  <template v-if="day.events.length">
                    <div
                      class="event-item"
                      v-for="(event, indexm) in day.events"
                      :key="indexm"
                      @click.stop="eventClick(event, day.date)"
                    >
                      <div
                        class="price"
                        :class="{
                          'cur-brefore-today': day.isCurMonth && day.isBeforeToday,
                          'cur-after-today': day.isCurMonth && !day.isBeforeToday
                        }"
                      >
                        {{ event.price }}
                      </div>
                      <div class="houseNum">{{ event.title }}</div>
                      <div class="breakfeast">{{ event.breakfeast }}</div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
        <slot name="body-card"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import dateFunc from "./components/dateFunc";
import moment from "moment";
import calendarHeader from "./components/header.vue";
export default {
  props: {
    // 在日历上的事件
    events: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 语言环境
    locale: {
      type: String,
      default: "zh-cn"
    },
    // 起始日 1: 星期一、 2: 星期二、 3: 星期三、4: 星期四、5: 星期五、6: 星期六、 7: 星期日
    firstDay: {
      type: Number,
      default: 0
    }
  },
  filters: {
    // moment.js语言包本地化过滤器
    localeWeekDay(weekday, firstDay, locale) {
      const localMoment = moment().locale(locale); // moment.js语言包本地化
      return localMoment.localeData().weekdaysShort()[(weekday + firstDay) % 7];
    }
  },
  components: {
    calendarHeader
  },

  data() {
    return {
      currentMonth: undefined, // 当前月份
      isLismit: true,
      selectDay: {}
    };
  },
  computed: {
    currentDates() {
      return this.getCalendar();
    }
  },
  mounted() {
    this.currentMonth = moment().startOf("month");
  },
  methods: {
    // 改变月份
    emitChangeMonth(firstDayOfMonth) {
      this.currentMonth = firstDayOfMonth;
      // let start = dateFunc.getMonthViewStartDate(firstDayOfMonth, this.firstDay);
      // let end = dateFunc.getMonthViewEndDate(firstDayOfMonth, this.firstDay);
      const currentMonth = moment(this.currentMonth).format("YYYY-MM");
      this.$emit("changeMonth", currentMonth);
    },
    // 获取日历表
    getCalendar() {
      let monthViewStartDate = dateFunc.getMonthViewStartDate(this.currentMonth, this.firstDay);
      let calendar = [];
      for (let perWeek = 0; perWeek < 6; perWeek++) {
        let week = [];
        for (let perDay = 0; perDay < 7; perDay++) {
          week.push({
            monthDay: monthViewStartDate.date(),
            isBeforeToday: monthViewStartDate.isBefore(moment(), "day"),
            isToday: monthViewStartDate.isSame(moment(), "day"),
            isCurMonth: monthViewStartDate.isSame(this.currentMonth, "month"),
            weekDay: perDay,
            date: moment(monthViewStartDate),
            events: this.slotEvents(monthViewStartDate)
          });
          monthViewStartDate.add(1, "day");
        }
        calendar.push(week);
      }
      return calendar;
    },
    // 日期事件匹配
    slotEvents(date) {
      let cellIndexArr = [];
      let thisDayEvents = this.events.filter(day => {
        let st = moment(day.start);
        let ed = moment(day.end ? day.end : st);
        return date.isBetween(st, ed, null, "[]");
      });
      return thisDayEvents;
    },
    // 点击时间
    dayClick(day) {
      const clickDate = moment(day).format("YYYY-MM-DD");
      this.$emit("dayClick", clickDate);
    },
    // 点击事件
    eventClick(event, day) {
      const clickDate = moment(day).format("YYYY-MM-DD");
      this.$emit("eventClick", event, clickDate);
    }
  }
};
</script>
<style lang="scss">
.comp-full-calendar {
  padding: 20px;
  background: #fff;
  max-width: 960px;
  margin: 0 auto;
  ul,
  p {
    margin: 0;
    padding: 0;
  }
}
.full-calendar-body {
  margin-top: 10px;
  .weeks {
    display: flex;
    height: 40px;
    align-items: center;
    background: rgba(150, 144, 197, 0.2);
    margin-bottom: 5px;
    .week {
      flex: 1;
      text-align: center;
      font-size: 13px;
      font-weight: bold;
      color: #606266;
    }
    .weekNo {
      color: #909399;
    }
  }
  .dates {
    position: relative;
    .week-row {
      display: flex;
      margin-left: -5px;
      margin-right: -5px;
      .day-cell {
        flex: 1;
        .day-cell-content {
          min-height: 140px;
          margin: 5px;
          background-color: rgba(192, 196, 204, 0.1);
        }
        .day-number {
          text-align: left;
          height: 30px;
          font-size: 14px;
          font-weight: bold;
          padding-left: 10px;
          line-height: 30px;
        }
        &.today {
          // background-color: #fcf8e3;
        }
        &.not-cur-month {
          .day-number {
            color: #909399;
          }
        }
        &.cur-brefore-today {
          .day-number {
            color: #909399;
            background-color: rgba(58, 58, 58, 0.2);
          }
        }
        &.cur-after-today {
          .day-number {
            color: #9690c5;
            background-color: rgba(150, 144, 197, 0.2);
          }
        }
      }
    }
    .dates-events {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      .events-week {
        display: flex;
        margin-left: -5px;
        margin-right: -5px;
        .events-day {
          cursor: pointer;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          .day-cell-content {
            min-height: 140px;
            margin: 5px;
          }
          .day-number {
            text-align: left;
            height: 30px;
            font-size: 14px;
            font-weight: bold;
            padding-left: 10px;
            line-height: 30px;
          }
          &.not-cur-month {
            .day-number {
              color: #909399;
            }
          }
          &.cur-brefore-today {
            .day-number {
              color: #909399;
              background-color: rgba(58, 58, 58, 0.2);
            }
          }
          &.cur-after-today {
            .day-number {
              color: #9690c5;
              background-color: rgba(150, 144, 197, 0.2);
            }
          }
          .event-box {
            .event-item {
              height: 110px;
              text-align: center;
              cursor: pointer;
              font-size: 12px;
              .price {
                padding-top: 20px;
                font-size: 14px;
                color: #606266;
              }
              .houseNum {
                font-size: 14px;
                padding-top: 10px;
                color: #606266;
              }
              .breakfeast {
                font-size: 12px;
                padding-top: 10px;
                color: #606266;
              }
            }
          }
        }
      }
    }
  }
}
</style>