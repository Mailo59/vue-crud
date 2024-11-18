<template>
  <div class="bg-gray-100 min-h-screen flex flex-col items-center py-10">
    <h1 class="text-4xl font-bold text-center text-indigo-600 mb-8">
      CRUD con Vue.js y Laravel
    </h1>
    <div class="w-full max-w-6xl space-y-8">
      <!-- Formulario -->
      <div class="bg-white shadow-md rounded-lg p-6">
        <PostForm />
      </div>
      <!-- Lista -->
      <div class="bg-white shadow-md rounded-lg p-6">
        <PostList />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PostForm from './components/PostForm.vue';
import PostList from './components/PostList.vue';

export default defineComponent({
  name: 'App',
  components: {
    PostForm,
    PostList,
  },
});
</script>
