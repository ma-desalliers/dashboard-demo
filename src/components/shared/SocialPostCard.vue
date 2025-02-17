# SocialPost.vue
<template>
  <q-card class="social-post" bordered>
    <!-- Header Section -->
    <q-card-section class="q-pa-md">
      <div class="row items-center">
        <!-- Platform Icon -->
        <q-avatar size="40px" class="platform-icon">
          <q-icon :name="platformIcon" :color="platformColor" size="24px" />
        </q-avatar>

        <div class="q-ml-sm">
          <!-- Platform Name -->
          <div class="text-subtitle1 text-weight-bold">{{ platformName }} post</div>
          <!-- Followers Count -->
          <div class="text-caption text-grey-7">
            {{ formatFollowerCount(followerCount) }} Followers
          </div>
        </div>
      </div>
    </q-card-section>

    <!-- Content Section -->
    <q-card-section class="q-pt-none q-px-md">
      <!-- Title -->
      <div class="text-subtitle1 text-weight-bold q-mb-sm">{{ title }}</div>
      
      <!-- Description -->
      <div class="text-body2 q-mb-md">{{ description }}</div>
      
      <!-- Call to Action -->
      <div class="text-body2 text-weight-medium">{{ callToAction }}</div>
    </q-card-section>

    <q-separator class="q-mt-md" />

    <!-- Interaction Buttons -->
    <q-card-actions align="left" class="q-pa-md">
      <div class="row full-width justify-between items-center">
        <div class="row q-gutter-md">
          <!-- Like Button -->
          <q-btn flat round size="sm" color="grey-7" icon="thumb_up" />
          <!-- Dislike Button -->
          <q-btn flat round size="sm" color="grey-7" icon="thumb_down" />
          <!-- Comment Button -->
          <q-btn flat round size="sm" color="grey-7" icon="comment" />
        </div>
        <!-- Share Button -->
        <q-btn flat round size="sm" color="grey-7" icon="more_horiz" />
      </div>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
interface Props {
  platformName?: string
  platformIcon?: string
  platformColor?: string
  followerCount?: number
  title: string
  description: string
  callToAction?: string
}

const props = withDefaults(defineProps<Props>(), {
  platformName: 'LinkedIn',
  platformIcon: 'fab fa-linkedin-in',
  platformColor: 'blue-7',
  callToAction: 'Read more in our latest blog post!',
  followerCount:1000
})


const formatFollowerCount = (count: number): string => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M'
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K'
  }
  return count.toString()
}
</script>

<style scoped lang="scss">
.social-post {
    margin: 0 auto;
  transition: box-shadow 0.2s ease;
  border-radius:8px;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}

.platform-icon {
  background-color: var(--q-primary);
  
  :deep(.q-icon) {
    color: white;
  }
}
</style>