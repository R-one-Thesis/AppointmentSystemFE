<template>
  <div class="subcontent">
      <navigation-bar
    @today="onToday"
    @prev="onPrev"
    @next="onNext"
  />
 

  <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap;">
    <div style="font-size: 2em;">{{ this.current_year }}</div>
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
            <template
              v-for="event in eventsMap[timestamp.date]"
              :key="event.id"
            >
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
  parseTimestamp,
  today
} from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass'

import { defineComponent, ref, computed } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'
import AddSchedule from '../components/AddSchedule.vue'


const formProfile = ref(false);



// The function below is used to set up our demo data
const CURRENT_DAY = new Date()
function getCurrentDay (day) {
  const newDay = new Date(CURRENT_DAY)
  newDay.setDate(day)
  const tm = parseDate(newDay)
  return tm.date
}


export default defineComponent({
  name: 'MonthSlotDay',
  components: {
      NavigationBar,
      AddSchedule,
    QCalendarMonth
  },

  setup (props, { slots, emit }) {
  const selectedDate = ref(today())

 

   
  const currentMonth = computed(() => {
      return selectedDate.value.getMonth() + 1; // Adding 1 because months are 0-based
    });

    const currentYear = computed(() => {
      return selectedDate.value.getFullYear();
    });

    return {
      selectedDate,
      currentMonth,
      currentYear,
       formProfile,
      // ... other return values
    };

    

  const formattedMonth = computed(() => {
    const date = new Date(selectedDate.value)
    return monthFormatter().format(date) + ' ' + date.getFullYear()
  })

  function monthFormatter () {
    try {
      return new Intl.DateTimeFormat(locale.value || undefined, {
        month: 'long',
        timeZone: 'UTC'
      })
    }
    catch (e) {
      //
    }
  }

  return {
    
    formattedMonth
  }
},
 

  data () {
    return {
      selectedDate: today(),
      current_year: new Date().getFullYear(),
      
      events: [
        {
          id: 1,
            doctor: 'Dr Achacoso',
            specialisation: 'Orthodox',
            details: 'Available for consultation',
            date: getCurrentDay(10),
            time: '10:00',
            duration: 120,
            bgcolor: 'red',
            icon: 'fas fa-handshake'
        },
       
      ]
    }
  },
  computed: {
    eventsMap () {
      const map = {}
      if (this.events.length > 0) {
        this.events.forEach(event => {
          (map[ event.date ] = (map[ event.date ] || [])).push(event)
          if (event.days !== undefined) {
            let timestamp = parseTimestamp(event.date)
            let days = event.days
            // add a new event for each day
            // skip 1st one which would have been done above
            do {
              timestamp = addToDate(timestamp, { day: 1 })
              if (!map[ timestamp.date ]) {
                map[ timestamp.date ] = []
              }
              map[ timestamp.date ].push(event)
              // already accounted for 1st day
            } while (--days > 1)
          }
        })
      }
      console.log(map)
      return map
    }
  },
  methods: {
    badgeClasses (event, type) {
      return {
        [ `text-white bg-${ event.bgcolor }` ]: true,
        'rounded-border': true
      }

      
    },

    badgeStyles (day, event) {
      const s = {}
      // s.left = day.weekday === 0 ? 0 : (day.weekday * this.parsedCellWidth) + '%'
      // s.top = 0
      // s.bottom = 0
      // s.width = (event.days * this.parsedCellWidth) + '%'
      return s
    },
    
  //   onToday () {
  //     this.$refs.calendar.moveToToday()
  //   },
  //   onPrev () {
  //     this.$refs.calendar.prev()
  //   },
  //   onNext () {
  //     this.$refs.calendar.next()
  //     console.log(this.$refs.calendar)
  //   },
  //   onMoved (data) {
  //     console.log('onMoved', data)
  //   },
  //   onChange (data) {
  //     console.log('onChange', data)
  //     this.current_year = new Date(this.selectedDate).getFullYear()
  //   },
  //   onClickDate (data) {
  //     console.log('onClickDate', data)
  //   },
  //   onClickDay (data) {
  //     console.log('onClickDay', data)
  //   },
  //   onClickWorkweek (data) {
  //     console.log('onClickWorkweek', data)
  //   },
  //   onClickHeadDay (data) {
  //     console.log('onClickHeadDay', data)
  //   },
  //   onClickHeadWorkweek (data) {
  //     console.log('onClickHeadWorkweek', data)
  //   },
  //   openDialog() {
  // formProfile.value = true;
  //   console.log('test');
  // },

  // closeDialog()  {
  //   formProfile.value = false;
  // },
  }
})


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