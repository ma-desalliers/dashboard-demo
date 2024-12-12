// types.ts
import type { Component } from 'vue'
import type { Product } from '@/src/repository/product/Product'

export interface HoverButton {
  icon: string
  action: (event: Event, item: any) => void
  color?: string
  textColor?: string
}

export interface EditableEntity {
  uuid?: string
  name: string
  description?: string
  update?: () => Promise<void>
  create?: () => Promise<any>
}

export interface PopupConfig {
  client?: any
  view: string
  isOpen: boolean
  item: EditableEntity
}

// composables/useEntityInteractions.ts
import { computed } from 'vue'
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore'

export function useEntityInteractions(entityType: string) {
  const mainDisplayStore = useMainDisplayStore()

  const getDefaultHoverButtons = (editComponent: string) => {
    return computed<HoverButton[]>(() => [{
      icon: 'fa fa-pen',
      action: (event: Event, item: EditableEntity) => openEditPopup(event, item, editComponent),
      color: 'default',
      textColor: '#333333'
    }])
  }

  const openEditPopup = (event: Event, item: EditableEntity, component: string) => {
    const triggerRect =  mainDisplayStore.getPopupTriggerElement(event.currentTarget as HTMLElement)
    const popup:any= {
      view: component,
      isOpen: true,
      item: item,
      triggerElement : triggerRect
    }

    if ('client' in item) {
      popup.client = item.client
    }

    mainDisplayStore.updatePopupDisplay(popup)
    
  }

  const handleEntityUpdate = async (
    item: EditableEntity,
    onSuccess?: () => void,
    additionalUpdates?: (item: any) => void
  ) => {
    if (!item) return

    try {
      if (item.uuid) {
        await item.update?.()
      } else {
        const newItem = await item.create?.()
        mainDisplayStore.updatePopupDisplay({ item: newItem })

        if (additionalUpdates && newItem) {
          additionalUpdates(newItem)
        }
      }

      mainDisplayStore.updatePopupDisplay({ isOpen: false })
      onSuccess?.()
    } catch (error) {
      console.error(`Error updating ${entityType}:`, error)
      // Handle error appropriately
    }
  }

  return {
    getDefaultHoverButtons,
    openEditPopup,
    handleEntityUpdate
  }
}