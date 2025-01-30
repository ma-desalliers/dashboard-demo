
<template>
  <div class="row full-height full-width c-absolute" :style="`--q-primary:${primaryColor}`">
    <!-- Left side - Carousel -->
    <div class="col-12 col-md-7 bg-primary c-relative carousel-container" style="overflow:hidden">
      <Carousel v-model="slide" :slides="slides"></Carousel>
    </div>

    <!-- Right side - Login Form -->
    <div class="col-12 col-md-5 flex flex-center">
      <div class="q-pa-xl" style="width: 400px;">
        <div class="text-center q-mb-xl">
          <img :src=companyLogo alt="Logo" style="max-width: 150px;">
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
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/src/stores/authStore';
import Carousel from '~/src/components/pages/login/Carousel.vue';
//TODO: set company color in local storage on login

interface Slide {
  id: number;
  title: string;
  image: string;
}

definePageMeta({
  middleware: 'guest',
});

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const store = useAuthStore();
const config = useRuntimeConfig();

// Carousel datap
const slide = ref(0)
const defaultSlides: Slide[] = [
  { id: 1, title: "5 Essential Factors to Consider When Setting Up Blasting Equipment", image: "http://192.168.0.113:3001/_nuxt/public/images/image1.jpeg" },
  { id: 2, title: "6 Common Mistakes to Avoid When Calibrating Blasting Equipment", image: "http://192.168.0.113:3001/_nuxt/public/images/image2.jpeg" },
  { id: 3, title: "7 Best Practices for Maintaining Optimal Blasting Equipment Performance", image: "http://192.168.0.113:3001/_nuxt/public/images/image3.jpeg" },
  { id: 4, title: "8 Tools You Need for Precise Blasting Equipment Calibration", image: "http://192.168.0.113:3001/_nuxt/public/images/image4.jpeg" },
  { id: 5, title: "9 Steps to Achieve Consistent Results in Blasting Operations", image: "http://192.168.0.113:3001/_nuxt/public/images/image5.jpeg" },
];
const slides = ref<Slide[]>([]);
const companyLogo = ref('/public/logo.png.jpg');
const primaryColor = ref('#55B948');


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
    // Prepare the request payload
    const payload = {
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value
    }

    // Make the login API call using Fetch
    const response = await fetch(`${config.public.apiBase}/login`, { // Replace with your API URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Important: include cookies in the request
      body: JSON.stringify(payload)
    })

    // Check if the response status is OK (status code in the range 200-299)
    if (!response.ok) {
      // Extract error message from the response
      const errorData = await response.json()
      throw new Error(errorData.error || 'Login failed. Please try again.')
    }

    // Parse the response data
    const data = await response.json()
    const { accessToken } = data

    if (!accessToken) {
      throw new Error('Access token not provided.')
    }

    // Store the accessToken in Vuex store or another state management solution
    store.setAccessToken(accessToken)

    $q.notify({
      type: 'positive',
      message: 'Login successful!'
    })

    // Redirect to the dashboard or desired page
    router.push('/') // Adjust the route as needed
  } catch (error:any) {
    console.error('Login error:', error)
    $q.notify({
      type: 'negative',
      message: error.message || 'Login failed. Please try again.'
    })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const token = route.query.token as string;
  try {
    if (token == null) throw new Error('Token not provided');
    const base64UrlPayload = token.split('.')[1];
    const base64Payload = base64UrlPayload.replace('-', '+').replace('_', '/');
    const decodedToken = JSON.parse(atob(base64Payload));

    companyLogo.value = decodedToken.companyLogo;
    primaryColor.value = decodedToken.primaryColor;
    const response = await fetch(`${config.public.apiBase}/limited/signup?token=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Invalid token');
    const jsonResponse: any = await response.json();

    let index = 1;
    slides.value = jsonResponse.data.posts.map((item: any) => ({
      id: index++,
      title: item.title,
      image: item.headerImage
    }));
    companyLogo.value = jsonResponse.data.companyLogo;
    primaryColor.value = jsonResponse.data.primaryColor;
  } catch {
    slides.value = defaultSlides;
    companyLogo.value = '/public/logo.png.jpg';
  }
});
</script>

<style scoped>
.q-carousel {
  background: linear-gradient(135deg, var(--q-primary) 0%, darken(var(--q-primary), 20%) 100%);
}

.q-carousel__slide {
  padding: 2rem;
}

.carousel-container{
  height:100%;
}

/* Add responsive adjustments */
@media (max-width: 1023px) {
  .carousel-container{
    height:55%;
  }
}

@media (max-width: 1023px) {
  .q-carousel {
    height: 50vh !important;
  }
}
</style>