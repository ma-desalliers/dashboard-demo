<template>
  <div class="full-width q-pa-md full-height  " :style="{ perspective: '1000px' }">
    <!-- Carousel Stage -->
    <div
      class="relative full-height full-width flex flex-center"
      :style="{ transformStyle: 'preserve-3d' }"
    >
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="carousel-slide absolute"
        :style="getItemStyle(index)"
        @click="currentIndex = index"
      >
        <q-card
          class="carousel-card"
          :style="{
            transform: `${getItemStyle(index)}`,
            opacity: getItemStyle(index).opacity,
          }"
        >
          <img v-if="slide.image" :src="slide.image" />
          <q-card-section class="text-center">
            <div class="text-h5 q-mb-sm">{{ slide.title }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Slide Indicators -->
    <div class="absolute-bottom text-center q-pb-md">
      <q-btn
        v-for="(_, index) in slides"
        :key="index"
        flat
        round
        dense
        :color="currentIndex === index ? 'white' : 'grey-5'"
        :icon="currentIndex === index ? 'radio_button_checked' : 'radio_button_unchecked'"
        @click="currentIndex = index"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface Slide {
  title: string;
  image?: string;
}

// Props
const props = defineProps<{
  modelValue?: number;
  slides: Slide[];
}>();

// Emits
const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

// State
const currentIndex = ref(props.modelValue || 0);

// Watch for v-model changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== undefined && newValue !== currentIndex.value) {
      currentIndex.value = newValue;
    }
  }
);

// Watch currentIndex changes to emit updates
watch(currentIndex, (newValue) => {
  emit("update:modelValue", newValue);
});

// Methods
const rotateCarousel = (direction: "prev" | "next") => {
  if (direction === "next") {
    currentIndex.value =
      currentIndex.value === props.slides.length - 1 ? 0 : currentIndex.value + 1;
  } else {
    currentIndex.value =
      currentIndex.value === 0 ? props.slides.length - 1 : currentIndex.value - 1;
  }
};

const getItemStyle = (itemIndex: number) => {
  let diff = (itemIndex - currentIndex.value + props.slides.length) % props.slides.length;
  if (diff > props.slides.length / 2) {
    diff -= props.slides.length;
  }

  let transform = "";
  let zIndex = 1;
  let opacity = 1;
  let scale = 1;

  switch (diff) {
    case -2: // left-most
      transform = "translate(-175%,0) translateZ(-100px) rotateY(35deg) scale(0.8)";
      zIndex = 3;
      opacity = 0.6;
      scale = 0.8;
      break;
    case -1: // left
      transform = "translate(-100%,0) translateZ(100px) rotateY(25deg) scale(0.9)";
      zIndex = 4;
      opacity = 0.8;
      scale = 0.9;
      break;
    case 0: // center
      transform = "translate(0%,0) translateZ(200px) rotateY(0deg) scale(1)";
      zIndex = 5;
      scale = 1.1;
      break;
    case 1: // right
      transform = "translate(100%,0) translateZ(100px) rotateY(-25deg) scale(0.9)";
      zIndex = 4;
      opacity = 0.8;
      scale = 0.9;
      break;
    case 2: // right-most
      transform = "translate(175%,0) translateZ(-100px) rotateY(-35deg) scale(0.8)";
      zIndex = 3;
      opacity = 0.6;
      scale = 0.8;
      break;
    default:
      opacity = 0;
      transform = "translate(-50%,0) scale(0.5)";
      zIndex = 1;
  }

  return { transform, zIndex, opacity };
};

// Keyboard navigation
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "ArrowLeft") rotateCarousel("prev");
  if (e.key === "ArrowRight") rotateCarousel("next");
};

// Lifecycle hooks
onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);

  window.setInterval(() => rotateCarousel("next"), 2500);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style scoped>
.carousel-slide {
  width: 300px;
  height: 350px;
  transition: all 0.6s;
  cursor: pointer;
}

.carousel-card {
  width: 100%;
  height: 100%;
}

.carousel-container{
  height:100%;

}


@media (max-width: 1023px) {
  .carousel-slide {
    width: 260px;
    height: 350px;
  }
}

@media (max-width: 700px) {
  .carousel-slide {
    width: 175px;
    height: 200px;
  }.absolute-bottom{
    padding-bottom: 4px;
  }
  .carousel-container{
   
  }

  .text-h5{
    font-size:14px;
    line-height: 1.2;
  }

}
</style>
