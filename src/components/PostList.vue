<template>
  <div>
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Listado de Posts</h2>
    <ul class="space-y-4">
      <li
        v-for="post in posts"
        :key="post.id"
        class="bg-white shadow-md rounded-lg p-4 border border-gray-200"
      >
        <h3 class="text-lg font-semibold text-gray-800">{{ post.title }}</h3>
        <p class="text-gray-600">{{ post.content }}</p>
        <div class="flex space-x-4 mt-4">
          <button
            @click="deletePost(post.id)"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Eliminar
          </button>
          <button
            @click="openEditModal(post)"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Editar
          </button>
        </div>
      </li>
    </ul>
    <p v-if="posts.length === 0" class="text-gray-500 text-center">
      No hay posts disponibles. ¡Crea uno nuevo!
    </p>

    <!-- Modal de edición -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg p-6 w-1/2">
        <h3 class="text-xl font-bold mb-4 text-black">Editar Post</h3>
        <form @submit.prevent="editPost">
          <!-- Campo de Título -->
          <div class="mb-4">
            <label for="edit-title" class="block text-sm font-medium text-gray-700">Título</label>
            <input
              id="edit-title"
              v-model="editForm.title"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
            />
            <p v-if="errors.title" class="text-red-500 text-sm">{{ errors.title }}</p>
          </div>

          <!-- Campo de Contenido -->
          <div class="mb-4">
            <label for="edit-content" class="block text-sm font-medium text-gray-700">Contenido</label>
            <textarea
              id="edit-content"
              v-model="editForm.content"
              rows="4"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
            ></textarea>
            <p v-if="errors.content" class="text-red-500 text-sm">{{ errors.content }}</p>
          </div>

          <!-- Botones -->
          <div class="flex justify-end space-x-4">
            <button
              @click="closeEditModal"
              type="button"
              class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center"
              :disabled="loading"
            >
              <span v-if="loading" class="animate-spin h-4 w-4 border-2 border-t-2 border-white border-t-transparent rounded-full mr-2"></span>
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import type { Post } from '../types';

export default defineComponent({
  name: 'PostList',
  setup() {
    const posts = ref<Post[]>([]);
    const showEditModal = ref(false);
    const editForm = ref<Post>({ id: 0, title: '', content: '' });
    const errors = ref<{ title?: string; content?: string }>({});
    const loading = ref(false);

    const fetchPosts = async () => {
      try {
        const response = await axios.get<Post[]>('/posts');
        posts.value = response.data;
      } catch (error) {
        console.error('Error al obtener los posts:', error);
      }
    };

    const deletePost = async (id: number) => {
      try {
        await axios.delete(`/posts/${id}`);
        fetchPosts();
      } catch (error) {
        console.error('Error al eliminar el post:', error);
      }
    };

    const openEditModal = (post: Post) => {
      editForm.value = { ...post }; // Precarga los datos en el formulario
      errors.value = {}; // Resetea errores previos
      showEditModal.value = true;
    };

    const closeEditModal = () => {
      showEditModal.value = false;
      editForm.value = { id: 0, title: '', content: '' }; // Limpia el formulario
    };

    const validateEditForm = () => {
      const newErrors: { title?: string; content?: string } = {};
      if (!editForm.value.title.trim()) newErrors.title = 'El título es obligatorio.';
      if (!editForm.value.content.trim()) newErrors.content = 'El contenido es obligatorio.';
      errors.value = newErrors;
      return Object.keys(newErrors).length === 0;
    };

    const editPost = async () => {
      if (!validateEditForm()) return;

      loading.value = true; // Activa el spinner
      try {
        await axios.put(`/posts/${editForm.value.id}`, {
          title: editForm.value.title,
          content: editForm.value.content,
        });
        alert('¡Post actualizado con éxito!');
        closeEditModal();
        fetchPosts(); // Refresca la lista
      } catch (error) {
        console.error('Error al actualizar el post:', error);
        alert('Hubo un error al actualizar el post.');
      } finally {
        loading.value = false; // Detiene el spinner
      }
    };

    onMounted(fetchPosts);

    return {
      posts,
      showEditModal,
      editForm,
      errors,
      loading,
      fetchPosts,
      deletePost,
      openEditModal,
      closeEditModal,
      editPost,
    };
  },
});
</script>
