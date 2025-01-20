<template>
  <q-card flat>
    <!-- Calendar Header -->
    <q-card-section class="row items-center justify-between q-pb-sm">
      <div class="row items-center q-gutter-sm">
        <q-btn-group flat>
          <q-btn
            flat
            :color="view === 'day' ? 'primary' : 'grey'"
            label="Day"
            @click="view = 'day'"
          />
          <q-btn
            flat
            :color="view === 'week' ? 'primary' : 'grey'"
            label="Week"
            @click="view = 'week'"
          />
          <q-btn
            flat
            :color="view === 'month' ? 'primary' : 'grey'"
            label="Month"
            @click="view = 'month'"
          />
        </q-btn-group>
      </div>

      <div class="row items-center q-gutter-sm">
        <q-btn flat round icon="chevron_left" @click="navigateDate(-1)" />
        <q-btn
          flat
          no-caps
          :label="formatDateRange"
          class="text-weight-medium"
        />
        <q-btn flat round icon="chevron_right" @click="navigateDate(1)" />
        <q-btn
          flat
          label="Today"
          color="primary"
          @click="currentDate = new Date()"
        />
      </div>

      <q-btn
        color="primary"
        icon="add"
        label="New Event"
        @click="showEventDialog = true"
      />
    </q-card-section>

    <!-- Calendar Grid -->
    <q-card-section class="calendar-grid">
      <!-- Week View -->
      <div v-if="view === 'week'" class="row">
        <!-- Time Column -->
        <div class="col-auto time-column">
          <div class="hour-cell" style="height: 50px"></div>
          <div
            v-for="hour in 24"
            :key="hour"
            class="hour-cell"
          >
            {{ formatHour(hour - 1) }}
          </div>
        </div>

        <!-- Days Columns -->
        <div class="col">
          <div class="row">
            <div
              v-for="day in weekDays"
              :key="day.toISOString()"
              class="col day-column"
            >
              <!-- Day Header -->
              <div
                class="day-header q-px-sm q-py-xs"
                :class="{ 'current-day': isToday(day) }"
              >
                <div class="text-subtitle2">
                  {{ formatDay(day) }}
                </div>
                <div
                  class="text-weight-medium"
                  :class="{ 'text-primary': isToday(day) }"
                >
                  {{ day.getDate() }}
                </div>
              </div>

              <!-- Time Slots -->
              <div
                v-for="hour in 24"
                :key="`${day.toISOString()}-${hour}`"
                class="time-slot"
                @click="openNewEventDialog(day, hour - 1)"
              >
                <!-- Events -->
                <template v-for="event in getEventsForSlot(day, hour - 1)" :key="event.id">
                  <q-chip
                    dense
                    class="event-chip"
                    :style="{
                      backgroundColor: event.color || '#1976d2',
                      color: 'white'
                    }"
                    @click.stop="showEventDetails(event)"
                  >
                    {{ event.title }}
                  </q-chip>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Month View -->
      <div v-if="view === 'month'" class="month-view">
        <!-- Weekday Headers -->
        <div class="row month-header">
          <div
            v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
            :key="day"
            class="col month-weekday"
          >
            {{ day }}
          </div>
        </div>

        <!-- Calendar Days -->
        <div class="month-grid">
          <div
            v-for="(week, weekIndex) in monthDays"
            :key="weekIndex"
            class="row"
          >
            <div
              v-for="(day, dayIndex) in week"
              :key="`${weekIndex}-${dayIndex}`"
              class="col month-day"
              :class="{
                'different-month': !isSameMonth(day),
                'current-day': isToday(day),
                'selected-day': isSelectedDate(day)
              }"
              @click="selectDate(day)"
            >
              <!-- Day Number -->
              <div class="day-number" :class="{ 'text-primary': isToday(day) }">
                {{ day.getDate() }}
              </div>

              <!-- Events -->
              <div class="day-events">
                <template v-for="(event, eventIndex) in getDayEvents(day)" :key="event.id">
                  <div 
                    v-if="eventIndex < 3"
                    class="month-event"
                    :style="{ backgroundColor: event.color || '#1976d2' }"
                    @click.stop="showEventDetails(event)"
                  >
                    <div class="event-title">{{ event.title }}</div>
                  </div>
                </template>
                <div 
                  v-if="getDayEvents(day).length > 3" 
                  class="more-events"
                >
                  +{{ getDayEvents(day).length - 3 }} more
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>

    <!-- New Event Dialog -->
    <q-dialog v-model="showEventDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ editingEvent ? 'Edit Event' : 'New Event' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="newEvent.title"
            label="Event Title"
            dense
            outlined
            class="q-mb-md"
          />

          <div class="row q-col-gutter-sm">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="newEvent.date"
                label="Date"
                dense
                outlined
                readonly
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="newEvent.date" mask="YYYY-MM-DD" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            
            <div class="col-12 col-sm-6">
              <q-input
                v-model="newEvent.time"
                label="Time"
                dense
                outlined
                readonly
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="newEvent.time" mask="HH:mm" format24h />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>

          <q-input
            v-model="newEvent.description"
            label="Description"
            type="textarea"
            dense
            outlined
            class="q-mt-md"
          />

          <q-select
            v-model="newEvent.color"
            :options="colorOptions"
            label="Color"
            dense
            outlined
            class="q-mt-md"
          >
            <template v-slot:option="{ itemProps, opt }">
              <q-item v-bind="itemProps">
                <q-item-section avatar>
                  <div
                    class="q-mr-sm"
                    style="width: 20px; height: 20px; border-radius: 4px"
                    :style="{ backgroundColor: opt.value }"
                  ></div>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ opt.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn
            flat
            label="Save"
            color="primary"
            @click="saveEvent"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Event Details Dialog -->
    <q-dialog v-model="showEventDetailsDialog">
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <div class="text-h6">Event Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedEvent">
          <div class="text-h6">{{ selectedEvent.title }}</div>
          <div class="text-subtitle2">
            {{ formatEventDateTime(selectedEvent) }}
          </div>
          <p class="q-mt-md">{{ selectedEvent.description }}</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Delete" color="negative" @click="deleteEvent" />
          <q-btn flat label="Edit" color="primary" @click="editEvent" />
          <q-btn flat label="Close" color="grey" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- More Events Dialog -->
    <q-dialog v-model="showMoreEventsDialog">
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <div class="text-h6">Events for {{ selectedMoreEventsDate }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-list>
            <q-item
              v-for="event in selectedDayEvents"
              :key="event.id"
              clickable
              @click="showEventDetails(event)"
              v-close-popup
            >
              <q-item-section>
                <q-item-label>{{ event.title }}</q-item-label>
                <q-item-label caption>
                  {{ event.time }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <div
                  class="q-mr-sm"
                  style="width: 12px; height: 12px; border-radius: 50%"
                  :style="{ backgroundColor: event.color || '#1976d2' }"
                ></div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { date } from 'quasar'

// Interfaces
interface Event {
  id: string
  title: string
  description?: string
  date: string
  time: string
  color?: string
}

// State
const view = ref<'day' | 'week' | 'month'>('week')
const currentDate = ref(new Date())
const showEventDialog = ref(false)
const showEventDetailsDialog = ref(false)
const showMoreEventsDialog = ref(false)

const events = ref<Event[]>([])
const selectedEvent = ref<Event | null>(null)
const editingEvent = ref(false)
const selectedDayEvents = ref<Event[]>([])
const selectedMoreEventsDate = ref('')

const newEvent = ref<Omit<Event, 'id'>>({
  title: '',
  description: '',
  date: '',
  time: '',
  color: '#1976d2'
})

const colorOptions = [
  { label: 'Blue', value: '#1976d2' },
  { label: 'Green', value: '#2e7d32' },
  { label: 'Red', value: '#d32f2f' },
  { label: 'Purple', value: '#7b1fa2' },
  { label: 'Orange', value: '#f57c00' }
]

// Computed
const weekDays = computed(() => {
  const days: Date[] = []
  const firstDay = new Date(currentDate.value)
  firstDay.setDate(firstDay.getDate() - firstDay.getDay())

  for (let i = 0; i < 7; i++) {
    const day = new Date(firstDay)
    day.setDate(firstDay.getDate() + i)
    days.push(day)
  }

  return days
})

const monthDays = computed(() => {
  const weeks: Date[][] = []
  const firstDay = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1)
  const lastDay = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0)
  
  const start = new Date(firstDay)
  start.setDate(start.getDate() - start.getDay())
  
  const end = new Date(lastDay)
  end.setDate(end.getDate() + (6 - end.getDay()))
  
  const current = new Date(start)
  while (current <= end) {
    const week: Date[] = []
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    weeks.push(week)
  }
  
  return weeks
})

const formatDateRange = computed(() => {
  if (view.value === 'month') {
    return date.formatDate(currentDate.value, 'MMMM YYYY')
  }

  const start = weekDays.value[0]
  const end = weekDays.value[6]
  const sameMonth = start.getMonth() === end.getMonth()
  const sameYear = start.getFullYear() === end.getFullYear()

  if (sameMonth && sameYear) {
    return `${date.formatDate(start, 'MMMM YYYY')}`
  }
  
  if (sameYear) {
    return `${date.formatDate(start, 'MMM')}`
  }

  return `${date.formatDate(start, 'MMM YYYY')} - ${date.formatDate(end, 'MMM YYYY')}`
})

// Methods
const formatHour = (hour: number): string => {
  return `${hour.toString().padStart(2, '0')}:00`
}

const formatDay = (day: Date): string => {
  return date.formatDate(day, 'ddd')
}

const isToday = (day: Date): boolean => {
  const today = new Date()
  return date.formatDate(day, 'YYYY-MM-DD') === date.formatDate(today, 'YYYY-MM-DD')
}

const navigateDate = (direction: number) => {
  const newDate = new Date(currentDate.value)
  if (view.value === 'week') {
    newDate.setDate(newDate.getDate() + (7 * direction))
  } else {
    newDate.setDate(newDate.getDate() + direction)
  }
  currentDate.value = newDate
}

const openNewEventDialog = (day: Date, hour: number) => {
  newEvent.value = {
    title: '',
    description: '',
    date: date.formatDate(day, 'YYYY-MM-DD'),
    time: `${hour.toString().padStart(2, '0')}:00`,
  }
  showEventDialog.value = true
}

const saveEvent = () => {
  events.value.push({
    id: crypto.randomUUID(),
    ...newEvent.value,
  })
  showEventDialog.value = false
}

const getEventsForSlot = (day: Date, hour: number): Event[] => {
  const dayStr = date.formatDate(day, 'YYYY-MM-DD')
  return events.value.filter(event => 
    event.date === dayStr && 
    parseInt(event.time.split(':')[0]) === hour
  )
}


// Add these methods
const isSameMonth = (day: Date): boolean => {
  return day.getMonth() === currentDate.value.getMonth()
}

const isSelectedDate = (day: Date): boolean => {
  return date.formatDate(day, 'YYYY-MM-DD') === date.formatDate(currentDate.value, 'YYYY-MM-DD')
}

const selectDate = (day: Date) => {
  currentDate.value = new Date(day)
  // Optionally switch to day view when a date is selected
  // view.value = 'day'
}

const getDayEvents = (day: Date): Event[] => {
  const dayStr = date.formatDate(day, 'YYYY-MM-DD')
  return events.value.filter(event => event.date === dayStr)
}

const showEventDetails = (event: Event) => {
  selectedEvent.value = event
  showEventDetailsDialog.value = true
}

const formatEventDateTime = (event: Event): string => {
  return `${date.formatDate(event.date, 'MMM D, YYYY')} at ${event.time}`
}

const editEvent = () => {
  if (selectedEvent.value) {
    newEvent.value = { ...selectedEvent.value }
    showEventDetailsDialog.value = false
    showEventDialog.value = true
  }
}

const deleteEvent = () => {
  if (selectedEvent.value) {
    events.value = events.value.filter(e => e.id !== selectedEvent.value?.id)
    showEventDetailsDialog.value = false
  }
}

</script>

<style scoped>
.calendar-grid {
  height: calc(100vh - 150px);
  overflow-y: auto;
}

.time-column {
  width: 60px;
  border-right: 1px solid #ddd;
}

.hour-cell {
  height: 60px;
  padding: 0 8px;
  border-bottom: 1px solid #eeeeee;
  font-size: 12px;
  color: #666;
  text-align: right;
}

.day-column {
  border-right: 1px solid #ddd;
}

.day-header {
  height: 50px;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

.current-day {
  background-color: #f0f7ff;
}

.time-slot {
  height: 60px;
  border-bottom: 1px solid #eeeeee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.time-slot:hover {
  background-color: #f5f5f5;
}

.event-chip {
  margin: 2px;
  max-width: calc(100% - 4px);
}
</style>