<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap;">
      <div style="font-size: 2em;">2023</div>
    </div>
    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%;">
        <q-calendar-month
  ref="calendar"
  v-model="selectedDate"
  animated
  bordered
  focusable
  hoverable
  no-active-date
  :day-min-height="60"
  :day-height="0"
  @change="onChange"
  @moved="onMoved"
  @click-date="onClickDate"
  @click-day="onClickDay"
  @click-workweek="onClickWorkweek"
  @click-head-workweek="onClickHeadWorkweek"
  @click-head-day="onClickHeadDay"
>
  <template #day="{ scope: { timestamp } }">
    <template v-for="event in eventsMap[timestamp.date]" :key="event.id">
      <div
        :class="badgeClasses(event, 'day')"
        :style="badgeStyles(event, 'day')"
        class="my-event"
      >
        <div class="title q-calendar__ellipsis">
          {{ event.doctor + (event.time ? ' - ' + event.time : '') }}
          <q-tooltip>{{ event.details }}</q-tooltip>
        </div>
      </div>
    </template>
  </template>
</q-calendar-month>

      </div>
    </div>
    <AddSchedule />
  </div>
</template>

<script>
import {
  QCalendarMonth,
  addToDate,
  parseDate,
  today
} from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass'
import api from "../pages/commonAPI/";
import { defineComponent, ref, computed, onMounted } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'
import AddSchedule from '../components/AddSchedule.vue'

const formProfile = ref(false);
const schedules = ref([]);

const fetchSchedules = () => {
  api.viewAllSched()
    .then((response) => {
      schedules.value = response.schedules;
      console.log('Schedules successfully fetched:', schedules.value);
    })
    .catch((error) => {
      console.error(error);
    });
};

onMounted(() => {
  fetchSchedules(); // Call the fetchSchedules function to fetch schedule data
});

export default defineComponent({
  name: 'MonthSlotDay',
  components: {
    NavigationBar,
    AddSchedule,
    QCalendarMonth
  },

  setup() {
    const selectedDate = ref(today());
    const formattedMonth = computed(() => {
      const date = new Date(selectedDate.value);
      return monthFormatter().format(date) + ' ' + date.getFullYear();
    });

    function monthFormatter() {
      try {
        return new Intl.DateTimeFormat(undefined, {
          month: 'long',
          timeZone: 'UTC'
        });
      } catch (e) {
        //
      }
    }

    return {
      selectedDate,
      formattedMonth
    };
  },

  computed: {
  eventsMap() {
    const map = {};
    if (schedules.value.length > 0) {
      schedules.value.forEach((schedule) => {
        const formattedDate = schedule.date.split(' ')[0];
        (map[formattedDate] = map[formattedDate] || []).push({
          id: schedule.id,
          doctor: schedule.dentist_name,
          details: schedule.specialization,
          date: formattedDate,
          time: schedule.time_start,
          duration: parseFloat(schedule.duration),
          bgcolor: schedule.booked === 1 ? 'grey' : 'red',
          icon: 'fas fa-handshake',
        });
      });
    }
    return map;
  },
},


  methods: {
    badgeClasses(event, type) {
      return {
        [`text-white bg-${event.bgcolor}`]: true,
        'rounded-border': true
      };
    },

    badgeStyles(day, event) {
      const s = {};
      return s;
    },

    onToday() {
      this.$refs.calendar.moveToToday();
    },

    onPrev() {
      this.$refs.calendar.prev();
    },

    onNext() {
      this.$refs.calendar.next();
    },

    onMoved(data) {
      console.log('onMoved', data);
    },

    onChange(data) {
      console.log('onChange', data);
    },

    onClickDate(data) {
      console.log('onClickDate', data);
    },

    onClickDay(data) {
      console.log('onClickDay', data);
    },

    onClickWorkweek(data) {
      console.log('onClickWorkweek', data);
    },

    onClickHeadDay(data) {
      console.log('onClickHeadDay', data);
    },

    onClickHeadWorkweek(data) {
      console.log('onClickHeadWorkweek', data);
    },

    openDialog() {
      formProfile.value = true;
      console.log('test');
    },

    closeDialog() {
      formProfile.value = false;
    }
  }
});
</script>


<style scoped>
.my-event {
  position: relative;
  font-size: 12px;
  width: 100%;
  margin: 1px 0 0 0;
  justify-content: center;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
}
 

.title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
 

.text-white {
  color: white;

}

.bg-blue {
  background: blue;

}

.bg-green {
  background: green;

}

.bg-orange {
  background: orange;

}

  .bg-red {
      background: red;

  }

.bg-teal {
  background: teal;

}

.bg-grey {

  background: grey;
}

.bg-purple {
  background: purple;

}

.rounded-border {
  border-radius: 2px;

}

.subcontent .q-pa-md {
  height: auto !important;
}
</style>