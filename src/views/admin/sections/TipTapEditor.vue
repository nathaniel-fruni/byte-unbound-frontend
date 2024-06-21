<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import MaterialButton from '@/components/MaterialButton.vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import axios from 'axios'

const conference = ref({});
const fetchNewestConference = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_ENDPOINT + "/api/get-newestConference"
    );
    conference.value = response.data;
  } catch (error) {
    console.error("Error fetching the newest conference data:", error);
  }
};

const title = ref("");
const editor = useEditor({
  content: '<p></p>',
  extensions: [
    StarterKit,
  ],
});

const savePage = async () => {
  try {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/,"$1");

    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('page_content', editor.value.getHTML());

    const response = await axios.post(
        import.meta.env.VITE_API_ENDPOINT + '/api/create-page',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
    );

    const pageId = response.data.page_id;
    window.location.href = `/page/${pageId}`
  } catch (error) {
    console.error('Error pri pridávaní:', error);
  }
};

onMounted(async () => {
  await fetchNewestConference();
});

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
});
</script>

<template>
  <div class="editor-container card shadow-dark p-3 pt-4">
    <h4 class="text-center mb-3">{{ conference.title }}</h4>
    <input v-model="title" placeholder="Nadpis" class="title-input" />
    <editor-content :editor="editor" class="editor-content" />
    <div class="text-center mb-4">
      <MaterialButton
          variant="gradient"
          color="dark"
          @click="savePage"
          class="col-lg-12 col-sm-12"
      >Uložiť</MaterialButton>
    </div>
  </div>
</template>

<style scoped>
.editor-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  max-width: 800px;
  padding: 20px;
}

.title-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 18px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.editor-content {
  width: 100%;
  min-height: 400px;
  padding: 20px;
  border: 1px solid gray;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}
</style>


