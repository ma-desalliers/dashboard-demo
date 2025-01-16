<template>
  <div class="content-editor" ref="editorRef">
    <div v-html="processedContent" class="editor-content"></div>
    <div 
      v-show="showOptions" 
      class="element-actions"
      :style="actionButtonsStyle"
      @mouseenter="keepOptionsVisible"
      @mouseleave="handleOptionsLeave"
    >
      <q-btn
      class="c-btn-outline"
        icon="edit"
        color="white"
        text-color="primary"
        @click="handleEdit($event)"
      />
      <q-btn
      class="c-btn-outline"
        icon="comment"
        text-color="primary"
        color="white"    
        @click="handleComment"
      />
    </div>
  </div>
  <side-panel v-model="showSidePanel" :width="550" title="Edit Content">
    <div class="q-pa-md column q-col-gutter-md">
      <div class="row justify-between">
        <span class="c-box-title">
          Selected Content:  
        </span>
        <q-btn-group>
          <q-btn ><i class="fa fa-edit"></i></q-btn>
          <q-btn @click="">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-40 20 220 180" style="width:26px">
                  <!-- Large star - left (moved up) -->
                  <path d="M40 40 L60 100 L120 120 L60 140 L40 200 L20 140 L-40 120 L20 100 Z" 
                        fill="#213343"/>
                  <!-- Smaller star - top right (moved left) -->
                  <path d="M120 20 L130 50 L160 60 L130 70 L120 100 L110 70 L80 60 L110 50 Z" 
                        fill="#213343"/>
                  <!-- Smaller star - bottom right -->
                  <path d="M140 120 L150 150 L180 160 L150 170 L140 200 L130 170 L100 160 L130 150 Z" 
                        fill="#213343"/>
                </svg>
             
          </q-btn>
        </q-btn-group>
      </div>
      <div class="" v-html="currentValue"> 
        
      </div>
      <div class="">
        <q-input
          v-model="Comment"
          label="commentaire"
          type="textarea"
          input-style="min-height:150px"
          class="c-textarea full-width"
          outlined
          dense
          autogrow
        />
      </div>


    </div>
  </side-panel>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import { uid } from 'quasar';
import { useMainDisplayStore } from '~/src/stores/mainDisplayStore';


const mainDisplayStore = useMainDisplayStore()
interface ElementOptions {
  id: string;
  type: string;
  content: string;
}

interface Props {
  content: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'edit', element: ElementOptions): void;
  (e: 'comment', element: ElementOptions): void;
}>();

const editorRef = ref<HTMLElement | null>(null);
const processedContent = ref('');
const showOptions = ref(false);
const currentTarget = ref<HTMLElement | null>(null);
const currentElement = ref<ElementOptions | null>(null);
const isHoveringOptions = ref(false);
const showSidePanel = ref(false)
const currentValue = ref('')
const Comment  = ref('')
const defaultActiveStyle = {
    position: '',
    top: ``,
    right: ``,
    transform: ''
}

const actionButtonsStyle = computed(() => {
  if (!currentTarget.value) return defaultActiveStyle;
  
  const rect = currentTarget.value.getBoundingClientRect();
  const editorRect = editorRef.value?.getBoundingClientRect();
  
  if (!editorRect) return defaultActiveStyle

  return {
    position: 'absolute',
    top: `${rect.top - editorRect.top + 20}px`,
    right: `${editorRect.right - rect.right}px`,
    transform: 'translateY(-100%)'
  };
});

const processContent = (htmlContent: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  const elements = doc.querySelectorAll('p, h1, h2, h3');
  
  elements.forEach((element) => {
    if (!element.id) {
      element.id = `element-${uid()}`;
    }
    
    element.setAttribute('data-type', element.tagName.toLowerCase());
    element.classList.add('editor-element');
  });

  return doc.body.innerHTML;
};

const keepOptionsVisible = () => {
  isHoveringOptions.value = true;
  if (currentTarget.value) {
    currentTarget.value.classList.add('element-active');
  }
};

const handleOptionsLeave = () => {
  isHoveringOptions.value = false;
  if (!currentTarget.value) {
    showOptions.value = false;
  }
  if (currentTarget.value) {
    currentTarget.value.classList.remove('element-active');
  }
};

const setupEventListeners = () => {
  if (!editorRef.value) return;

  const elements = editorRef.value.querySelectorAll('.editor-element');
  
  elements.forEach((element) => {
    element.addEventListener('mouseenter', (e) => {
      const target = e.target as HTMLElement;
      if (currentTarget.value) {
        currentTarget.value.classList.remove('element-active');
      }
      currentTarget.value = target;
      target.classList.add('element-active');
      currentElement.value = {
        id: target.id,
        type: target.getAttribute('data-type') || '',
        content: target.textContent || ''
      };
      showOptions.value = true;
    });

    element.addEventListener('mouseleave', (e) => {
      const relatedTarget = e.target as HTMLElement;
      window.setTimeout(() => {
        if (!relatedTarget?.closest('.element-actions') && !isHoveringOptions.value) {
          showOptions.value = false;
          if (currentTarget.value) {
            currentTarget.value.classList.remove('element-active');
          }
        }
      });
    });
  });
};

const handleEdit = (event:Event) => {
  showSidePanel.value = true
  currentValue.value = currentTarget.value?.innerHTML || ''
/*
  const triggerRect = mainDisplayStore.getPopupTriggerElement(event.currentTarget as HTMLElement)
  console.log(triggerRect)
  const popup = {
      view: 'EditContent',
      isOpen: true,
      item:{currentValue : currentTarget.value?.innerHTML, comment: ''},
      triggerElement:triggerRect
    }
    mainDisplayStore.updatePopupDisplay(popup)*/
};

const handleComment = () => {
  if (currentElement.value) {
    emit('comment', currentElement.value);
  }
};

watch(() => props.content, (newContent) => {
  processedContent.value = processContent(newContent);
  nextTick(() => {
    setupEventListeners();
  });
});

onMounted(() => {
  processedContent.value = processContent(props.content);
  nextTick(() => {
    setupEventListeners();
  });
});
</script>

<style lang="scss">
@import url('@/src/styles/landingPage/style.css');
.content-editor {
  position: relative;
  height:100%;
}

.c-btn-outline{
  height:25px;
  width:25px;
}

.editor-content{
  position:absolute;
  inset:0;
  overflow: auto;
}

.editor-element {
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.editor-element:hover,
.editor-element.element-active {
  outline: 2px solid #1976d2;
  outline-offset: 4px;
  border-radius: 3px;
}

.element-actions {
  display: flex;
  gap: 4px;
  padding: 4px;
  z-index: 1000;
}

/* Style overrides for different element types */
.editor-element[data-type="h1"]:hover,
.editor-element[data-type="h1"].element-active {
  outline-color: #1976d2;
}

.editor-element[data-type="h2"]:hover,
.editor-element[data-type="h2"].element-active {
  outline-color: #2196f3;
}

.editor-element[data-type="h3"]:hover,
.editor-element[data-type="h3"].element-active {
  outline-color: #42a5f5;
}

.editor-element[data-type="p"]:hover,
.editor-element[data-type="p"].element-active {
  outline-color: #64b5f6;
}

#cameleon-landing-page .full-page-width{
  width:unset;
  margin-left: unset;

  padding-left:15px;
  padding-right: 15px;;
}

#cameleon-landing-page .section .section-content{
  width:unset;
} 
</style>