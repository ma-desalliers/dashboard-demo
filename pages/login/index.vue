# LoginScreen.vue
<template>
  <div class="row full-height">
    <!-- Left side - Carousel -->
    <div class="col-12 col-md-7 bg-primary">
      <q-carousel
        v-model="slide"
        animated
        swipeable
        infinite
        autoplay
        height="100vh"
        transition-prev="slide-right"
        transition-next="slide-left"
        class="bg-primary text-white"
      >
        <q-carousel-slide v-for="(slide, index) in slides" :key="index" :name="index" class="column no-wrap flex-center">
          <div class="q-pa-lg text-center">
            <div class="text-h3 q-mb-md">{{ slide.title }}</div>
            <img :src="slide.image" style="max-width: 400px; height: auto;">
            <div class="text-h5 q-mt-md">{{ slide.description }}</div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>

    <!-- Right side - Login Form -->
    <div class="col-12 col-md-5 flex flex-center">
      <div class="q-pa-xl" style="width: 400px;">
        <div class="text-center q-mb-xl">
          <img src="" alt="Logo" style="max-width: 150px;">
        </div>

        <div class="text-h4 text-weight-bold q-mb-md text-center">Welcome Back</div>
        <div class="text-subtitle1 text-grey-7 q-mb-xl text-center">Please sign in to continue</div>

        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="email"
            type="email"
            label="Email"
            outlined
            dense
            :rules="[val => !!val || 'Email is required', isValidEmail]"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <q-input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            outlined
            dense
            :rules="[val => !!val || 'Password is required']"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <div class="row items-center justify-between q-mb-md">
            <q-checkbox v-model="rememberMe" label="Remember me" dense />
            <q-btn flat color="primary" label="Forgot Password?" dense />
          </div>

          <q-btn
            type="submit"
            color="primary"
            class="full-width"
            label="Sign In"
            :loading="loading"
          />

          <div class="text-center q-mt-sm">
            Don't have an account? 
            <q-btn flat color="primary" label="Sign up" dense />
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Carousel data
const slide = ref(0)
const slides = [
  {
    title: 'Welcome to Our Platform',
    description: 'Discover amazing features and possibilities',
    image: ''
  },
  {
    title: 'Secure & Reliable',
    description: 'Your data is safe with us',
    image: ''
  },
  {
    title: 'Start Your Journey',
    description: 'Join thousands of satisfied users',
    image: ''
  }
]

// Form data
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)

// Email validation
const isValidEmail = (val: string) => {
  const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
  return emailPattern.test(val) || 'Invalid email'
}

// Form submission
const onSubmit = async () => {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    $q.notify({
      type: 'positive',
      message: 'Login successful!'
    })
    
    // Handle successful login here (e.g., redirect to dashboard)
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Login failed. Please try again.'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.q-carousel {
  background: linear-gradient(135deg, var(--q-primary) 0%, darken(var(--q-primary), 20%) 100%);
}

.q-carousel__slide {
  padding: 2rem;
}

/* Add responsive adjustments */
@media (max-width: 1023px) {
  .q-carousel {
    height: 50vh !important;
  }
}
</style>