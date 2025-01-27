<template>
  <div class="">
    <!-- Batch Actions Bar -->
    <div v-if="modelValue.length > 0 && batchActions.length > 0" class="row items-center q-mb-md">
      <div class="text-subtitle1 q-mr-md">{{ modelValue.length }} items selected</div>
      <template v-for="action in batchActions" :key="action.label">
        <q-btn
          :color="action.color || 'primary'"
          :icon="action.icon"
          :label="action.label"
          dense
          @click="() => action.handler(modelValue)"
          class="q-mr-sm"
        />
      </template>
    </div>

    <q-table
      :rows="rows"
      :columns="computedColumns"
      v-model:selected="innerSelected"
      selection="multiple"
      :loading="loading"
      :row-key="rowKey"
      flat
      separator="horizontal"
      table-header-class="bg-primary"
      class="c-table"
      :pagination="pagination"
      @update:pagination="$emit('update:pagination', $event)"
      v-bind="$attrs"
    >
      <!-- Custom Header -->
      <template #header="props">
        <q-tr :props="props">
          <!-- Selection Header -->
          <q-th auto-width>
            <q-checkbox
              v-model="selectAll"
              :indeterminate="hasSelection && !allSelected"
            />
          </q-th>
          
          <!-- Regular Headers -->
          <q-th
            v-for="col in columns"
            :key="col.name"
            :props="props"
            class="c-box-subtitle"
          >
            <slot :name="`header-${col.name}`" v-bind="props">
              {{ col.label }}
            </slot>
          </q-th>
        </q-tr>
      </template>

      <!-- Custom Body -->
      <template #body="props">
        <q-tr :props="props">
          <!-- Selection Column -->
          <q-td auto-width>
            <q-checkbox v-model="props.selected" />
          </q-td>

          <!-- Data Columns -->
          <q-td v-for="col in columns" :key="col.name">
            <slot :name="`cell-${col.name}`" v-bind="{ ...props, value: props.row[col.name] }">
              <template v-if="col.type === 'hover'">
                <hover-button :buttons="hoverButtons" hide-background :item="props.row">
                  {{ props.row[col.name] }}
                </hover-button>
              </template>
              <template v-else-if="col.type === 'icon'">
                <q-icon :name="props.row[col.name]" />
              </template>

              <template v-else-if="col.type === 'button'">
                <q-btn
                  :label="col.buttonLabel || props.row[col.name]"
                  :color="col.buttonColor || 'primary'"
                  dense
                  outline
                  @click="() => col.onClick?.(props.row)"
                />
              </template>

              <template v-else-if="col.type === 'badge'">
                <StatusPopup :current-item="getFieldValue(props.row, col)"  :options="col.options" @update-value="(value) => col.updateFn({item:props.row, value:value})"></StatusPopup>
              </template>

              <template v-else-if="col.type === 'date'">
                {{ formatDate(props.row[col.name]) }}
              </template>

              <template v-else-if="col.type === 'actions'">
                <div class="row items-center q-gutter-x-sm">
                  <template v-for="action in col.actions" :key="action.label">
                    <q-btn
                      :icon="action.icon"
                      :color="action.color || 'grey'"
                      dense
                      flat
                      round
                      size="sm"
                      @click="() => action.handler(props.row)"
                    >
                      <q-tooltip>{{ action.label }}</q-tooltip>
                    </q-btn>
                  </template>
                </div>
              </template>

              <template v-else>
                {{ col.format ? col.format(props.row[col.name]) : props.row[col.name] }}
              </template>
            </slot>
          </q-td>
        </q-tr>
      </template>

      <!-- Empty State -->
      <template #no-data>
        <div class="full-width row flex-center q-pa-md text-grey-8">
          {{ noDataLabel }}
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { date, type QTableProps } from 'quasar'
import { useMainDisplayStore } from '../../stores/mainDisplayStore';

type AlignValue = 'left' | 'right' | 'center'

interface BaseColumn {
  name: string
  label: string
  field: string | ((row: any) => any)
  required?: boolean
  align?: AlignValue
  sortable?: boolean
  sort?: (a: any, b: any) => number
  format?: (val: any) => string
  updateFn?:any
}

interface TextColumn extends BaseColumn {
  type?: 'text'
}

interface IconColumn extends BaseColumn {
  type: 'icon'
}
interface HoverColumn extends BaseColumn {
  type: 'hover'
}

interface ButtonColumn extends BaseColumn {
  type: 'button'
  buttonLabel?: string
  buttonColor?: string
  onClick?: (row: any) => void
}

interface BadgeColumn extends BaseColumn {
  type: 'badge',
  options:any[]
  badgeColor?: (val: any) => string
}

interface DateColumn extends BaseColumn {
  type: 'date'
}

interface ActionsColumn extends BaseColumn {
  type: 'actions'
  actions: Array<{
    label: string
    icon: string
    color?: string
    handler: (row: any) => void
  }>
}

type Column = TextColumn | IconColumn | ButtonColumn | BadgeColumn | DateColumn | ActionsColumn | HoverColumn

interface BatchAction {
  label: string
  icon?: string
  color?: string
  handler: (selected: any[]) => void
}

interface Props {
  columns: Column[]
  rows: any[]
  modelValue: any[]
  loading?: boolean
  batchActions?: BatchAction[]
  noDataLabel?: string
  pagination?: QTableProps['pagination']
  rowKey?: string
  hoverButtons?: any[] | undefined
  hoverButtonsField?:string
  columnOptions?:{columnName:string, options:any[]}[]
}

//TODO : Implement hover buttons over the "title" column, 
//TODO : Implement the columnOptions to show the GlobalPopup with the options for status, category, etc


const props = withDefaults(defineProps<Props>(), {
  loading: false,
  batchActions: () => [],
  noDataLabel: 'No data available',
  pagination: () => ({
    sortBy: '',
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  }),
  rowKey: 'id',
  modelValue: () => []
})

const emit = defineEmits(['update:modelValue', 'update:pagination'])


const mainDisplayStore = useMainDisplayStore()
const innerSelected = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Select all functionality
const selectAll = computed({
  get: () => allSelected.value,
  set: (val) => {
    if (val) {
      innerSelected.value = [...props.rows]
    } else {
      innerSelected.value = []
    }
  }
})

const hasSelection = computed(() => innerSelected.value.length > 0)
const allSelected = computed(() => innerSelected.value.length === props.rows.length)

// Computed properties
const computedColumns = computed(() => props.columns)
// Helper functions
const formatDate = (dateValue: string | Date) => {
  if (!dateValue) return ''
  return date.formatDate(dateValue, 'YYYY-MM-DD')
}

const getFieldValue = (row: any, col: any) => {
  if (typeof col.field === 'function') {
    return col.field(row) ?? '-'
  }
  return row[col.field] ?? '-'
}

const onBadgeClick = (row: any, col: any, event:Event) =>{

  const triggerRect = mainDisplayStore.getPopupTriggerElement(event.currentTarget as HTMLElement)
console.log(col)
mainDisplayStore.pushPopup({
  triggerElement:triggerRect,
  item:{
    item: row,
    options:col.options,
    closeFn: col.updateFn,
  },
  view:'BadgeSelect',
  isOpen:true
})
}
</script>

<style lang="scss" >

.q-table tbody tr:not(:last-child) td {
  border-bottom: 1px solid #e0e0e0;
}

.c-table .q-table tbody td:before  {
  display:none;
}
.c-box-subtitle{
  font-size:16px;
}

.c-table .c-box-subtitle {
  font-size:16px;
}

.c-table .q-td {
  font-size:16px;
}


:deep(.selected){
  .q-td{
    &::after{
      display:none;
    }
  }
}

</style>