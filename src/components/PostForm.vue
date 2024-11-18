<template>
  <div>
    <h2 class="text-2xl font-bold mb-4 text-black">Crear Post</h2>
    <form @submit.prevent="savePost" class="space-y-4">
      <!-- Campo de Título -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">Título</label>
        <input
          id="title"
          v-model="title"
          type="text"
          placeholder="Título"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
        />
        <p v-if="errors.title" class="text-red-500 text-sm">{{ errors.title }}</p>
      </div>

      <!-- Campo de Contenido -->
      <div>
        <label for="content" class="block text-sm font-medium text-gray-700">Contenido</label>
        <textarea
          id="content"
          v-model="content"
          placeholder="Contenido"
          rows="4"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
        ></textarea>
        <p v-if="errors.content" class="text-red-500 text-sm">{{ errors.content }}</p>
      </div>

      <!-- Spinner y Botón Guardar -->
      <div>
        <button
          type="submit"
          class="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="loading"
        >
          <span v-if="loading" class="animate-spin h-4 w-4 border-2 border-t-2 border-white border-t-transparent rounded-full mr-2"></span>
          Guardar
        </button>
      </div>
    </form>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'PostForm',
  setup(_, { emit }) {
    const title = ref('');
    const content = ref('');
    const errors = ref<{ title?: string; content?: string }>({});
    const loading = ref(false);

    const validate = () => {
      const newErrors: { title?: string; content?: string } = {};
      if (!title.value.trim()) newErrors.title = 'El título es obligatorio.';
      if (!content.value.trim()) newErrors.content = 'El contenido es obligatorio.';
      errors.value = newErrors;
      return Object.keys(newErrors).length === 0;
    };

    const savePost = async () => {
      if (!validate()) return;

      loading.value = true; // Activa el spinner
      try {
        const response = await axios.post('/posts', {
          title: title.value,
          content: content.value,
        });
        console.log('Post creado:', response.data);
        title.value = '';
        content.value = '';
        errors.value = {};
        emit('postCreated', response.data); // Emite el nuevo post
        alert('¡Post creado exitosamente!');
      } catch (error) {
        console.error('Error al crear el post:', error);
        alert('Hubo un error al crear el post.');
      } finally {
        loading.value = false; // Detiene el spinner
      }
    };

    return { title, content, errors, loading, savePost };
  },
});
</script>
