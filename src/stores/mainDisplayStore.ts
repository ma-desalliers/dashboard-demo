import { defineStore } from 'pinia';
import type { Component } from 'vue';
import { Pages } from '../repository/pages/Page';
import { Client } from '../repository/client/Client';

type ViewName = 'HelloWorld' | 'ClientEditor' | string;
interface DisplayState {
  client?: Client;
  view: string;
  item: any;
  customViewLoading?: boolean;
}

interface PopupState extends DisplayState {
  isOpen: boolean;
  triggerElement: DOMRect | null;
  parentPopup?: PopupState; // Action on close - set values 
}

interface MainDisplayState {
  main: DisplayState;
  popupStack: PopupState[];
}

type DisplayUpdatePayload = Partial<DisplayState>;
type PopupUpdatePayload = Partial<PopupState>;

export const useMainDisplayStore = defineStore('mainDisplayStore', {
  state: (): MainDisplayState => ({
    main: {
      client: undefined,
      view: 'ClientDetails',
      item: null,
      customViewLoading: false,
    },
    popupStack: []
  }),

  actions: {
    updateMainDisplay(payload: DisplayUpdatePayload) {
      this.main = { ...this.main, ...payload };
    },

    pushPopup(payload: Partial<PopupState>) {
      const currentPopup = this.popupStack[this.popupStack.length - 1];
      
      const newPopup = {
        isOpen: true,
        view: payload.view || '',
        item: payload.item || null,
        client: payload.client,
        triggerElement: payload.triggerElement || null,
        parentPopup: currentPopup
      };

      this.popupStack.push(newPopup);
    },

    popPopup() {
      this.popupStack.pop();
    },

    // Compatibility action - works like before but uses stack
    updatePopupDisplay(payload: Partial<PopupState>) {
      if (!this.popup.isOpen && payload.isOpen) {
        // Opening new popup
        this.pushPopup(payload);
      } else if (this.popup.isOpen && !payload.isOpen) {
        // Closing popup
        this.popPopup();
      } else if (this.popup.isOpen) {
        // Updating current popup
        const updatedPopup = { ...this.popup, ...payload };
        this.popupStack[this.popupStack.length - 1] = updatedPopup;
      }
    },

     getPopupTriggerElement(element: HTMLElement | null) {
      const triggerRect = element?.getBoundingClientRect();
      if (!triggerRect) return;    

      return structuredClone(triggerRect)
    },
  },

  getters: {
    popup: (state) => {
      const currentPopup = state.popupStack[state.popupStack.length - 1] || {
        isOpen: false,
        view: '',
        item: null,
        client: undefined,
        triggerElement: null
      };
      return currentPopup;
    }
  }
});