<template>
  <div
    class="c-relative inline-block c-hover-btn"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"> 
    <div class="c-hover-text-container row items-center" style="height:100%">
      <slot></slot>
    </div>
    <div
     class="c-hover-buttons"
      :class="{
        'c-hovered': isHovered || isDropdownOpen,
        'c-buttons-container': true,
        'c-hide-background': hideBackground
      }"
      ref="buttonContainer">
      <template v-for="(option, index) in buttons?.filter(button => validateCondition(button))" :key="index">
        <template v-if="!option.isDropdown && !option.requireConfirm">
          <q-btn
            round
            outline
            :size="option.size || 'sm'"
            @click.stop="simpleBtnClick($event, option.action)"
            :color="option.color"
            :text-color="option.textColor"
            :title="option.title"
          >
            <i :class="option.icon" :style="{ color: option.textColor }"></i>
          </q-btn>
        </template>

        <template v-if="!option.isDropdown && option.requireConfirm">
          <ConfirmBtn 
            outline
            @confirm="simpleBtnClick(null, option.action)"
            :icon="option.icon"
            :color="option.color"
            :text-color="option.textColor"
            :title="option.title"
            :size="option.size || 'sm'"
            :label="option.label"
          />
        </template>

        <DropdownBtn
          v-else-if="option.isDropdown"
          ref="dropdownRefs"
          :icon="option.icon"
          :color="option.color"
          :text-color="option.textColor"
          :size="option.size"
          :title="option.title"
          :description="option.description"
          :action-button-text="option.actionButtonText"
          :action-button-color="option.actionButtonColor"
          :loading="option.loading"
          :button-class="option.buttonClass"
          :show-header="option.showHeader"
          :show-button="option.showButton"
          @click.stop="handleDropdownClick($event)"
          @show="() => handleDropdownShow(index, option)"
          @hide="() => handleDropdownHide(index)"
          :onConfirm="(data: any) => handleDropdownAction(index, option, data)"
        >
          <template #inputs="{ formData, 'onUpdate:formData': updateData }">
            <slot
              :name="`dropdown-content-${index}`"
              :formData="formData"
              @update:formData="updateData"
            ></slot>
          </template>
        </DropdownBtn>
      </template>
      <template v-if="props.showExtra">
        <ToolEllipsis :item="item"></ToolEllipsis>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DropdownBtn from './DropdownBtn.vue'
import ToolEllipsis from './ToolEllipsis.vue'
import ConfirmBtn from './ConfirmBtn.vue'

interface BaseButtonOption {
  icon: string
  color?: string
  textColor?: string
  size?: string
  buttonClass?: string
  title?: string
  label?:string
  condition: {value:any, param:string}
  requireConfirm?: boolean
}

interface RegularButtonOption extends BaseButtonOption {
  isDropdown?: false
  action: () => void
}

interface DropdownButtonOption extends BaseButtonOption {
  isDropdown: true
  description?: string
  actionButtonText?: string
  actionButtonColor?: string
  iconSize?: string
  loading?: boolean
  showHeader?: boolean
  showButton?: boolean
  onConfirm: (formData: Record<string, any>, item:any) => Promise<void> | void,
  onOpen: (item:any) => Promise<void> | void
}

type ButtonOption = RegularButtonOption | DropdownButtonOption

const props = defineProps<{
  buttons?: any[]
  item?: any
  showExtra?: Boolean
  hideBackground?: boolean
}>()

const isHovered = ref(false)
const isDropdownOpen = ref(false)
const openDropdownIndex = ref<number | null>(null)
const buttonContainer = ref<HTMLElement | null>(null)

const handleMouseEnter = () => {
  isHovered.value = true
}

const handleMouseLeave = () => {
  if (!isDropdownOpen.value) {
    isHovered.value = false
  }
}

const handleDropdownShow = (index: number, option:DropdownButtonOption) => {
  isDropdownOpen.value = true
  openDropdownIndex.value = index
  if(option.onOpen)
  option.onOpen(props.item)
}

const handleDropdownHide = (index: number) => {
  if (openDropdownIndex.value === index) {
    isDropdownOpen.value = false
    openDropdownIndex.value = null
    if (!buttonContainer.value?.matches(':hover')) {
      isHovered.value = false
    }
  }
}

const handleDropdownAction = async (
  index: number, 
  option: DropdownButtonOption, 
  formData: Record<string, any>
) => {
  await option.onConfirm(formData,props.item)
}

const handleDropdownClick = (event:Event) =>{
  // this function does nothing
  event.stopPropagation()
  event.preventDefault()
}

const simpleBtnClick = (event: Event | null, optionAction: any) => {
  optionAction(event, props.item)
}

const validateCondition = (option:BaseButtonOption)=>{
  if(!option.condition) return true
  return props.item[option.condition.param] == option.condition.value
}
</script>

<style lang="scss" scoped>
.c-buttons-container {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.25s;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0 0.5rem;
  z-index:10;
  background-color: #ffffff;
  &.c-hovered {
    opacity: 1;
  }
}

.c-hover-text-container{
  position:relative;
  z-index:5
}

.c-hide-background{
background-color: unset;
}

.c-hover-btn {
  height: 100%;
  width: 100%;
  display: inline-block;
}

.c-relative {
  position: relative;
}
</style>