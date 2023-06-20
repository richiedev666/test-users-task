<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useModal } from "vue-final-modal";

import AddPost from "@/components/AddPost.vue";

const { open, close, destroy, options, patchOptions } = useModal({
  // Open the modal or not when the modal was created, the default value is `false`.
  defaultModelValue: false,
  /**
   * If set `keepAlive` to `true`:
   * 1. The `displayDirective` will be set to `show` by default.
   * 2. The modal component will not be removed after the modal closed until you manually execute `destroy()`.
   */
  keepAlive: false,
  // `component` is optional and the default value is `<VueFinalModal>`.
  attrs: {
    // Bind props to the modal component (VueFinalModal in this case).
    clickToClose: true,
    escToClose: true,
    // Bind events to the modal component (VueFinalModal in this case).
    onBeforeOpen() {
      /* on before open */
    },
    onOpened() {
      /* on opened */
    },
    onBeforeClose() {
      /* on before close */
    },
    onClosed() {
      /* on closed */
    },
  },
  slots: {
    default: AddPost,
  },
});

const route = useRoute();

interface Post {
  id: number;
  title: string;
  body: string;
}

interface User {
  id: number;
  loading: boolean;
  username: string;
  posts: Post[];
}

const users = ref<User[]>([] as User[]);

const fetchUserPosts = async (id: number): Promise<Post[]> => {
  const response = await fetch(
    `${process.env.VUE_APP_API_HOST}/users/${id}/posts`
  );

  return await response.json();
};

const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${process.env.VUE_APP_API_HOST}/users`);
  const data = await response.json();

  for (let i = 0; i < data.length; i++) {
    const user: User = data[i];

    user.loading = true;
    user.posts = await fetchUserPosts(user.id);
    user.loading = false;
  }

  return data;
};

watch(
  route,
  async () => {
    users.value = await fetchUsers();
  },
  {
    immediate: true,
  }
);

const openAddPostModal = (): void => {
  open();
};
</script>

<template>
  <div class="users__wrapper">
    <h1>Users</h1>

    <div class="users__row">
      <div
        v-for="user in users"
        :key="`user-${user.id}`"
        class="users__column__wrapper"
      >
        <p v-if="user.loading">Загрузка...</p>

        <div class="users__column">
          <div class="users__column__header">
            <h4>{{ user.username }}</h4>

            <p>{{ user.posts?.length }}</p>
          </div>
        </div>

        <div v-if="user.posts?.length" class="users__column__posts">
          <div
            v-for="post in user.posts"
            :key="`user-${user.id}-${post.id}`"
            class="users__column__posts__item"
          >
            <h5>{{ post.title }}</h5>

            <p class="users__column__posts__item__body">{{ post.body }}</p>
          </div>
        </div>

        <button
          class="users__column__button"
          @click="openAddPostModal(user.id)"
        >
          Добавить пост
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.users {
  &__wrapper {
    padding: 20px;
    background-color: #eee;
    min-height: 100vh;
  }

  &__row {
    overflow: auto;
    display: flex;
    gap: 20px;
    padding: 20px;
  }

  &__column {
    padding: 14px;
    box-shadow: 0px 2px 8px 0px rgba(34, 60, 80, 0.2);
    border-radius: 10px;
    background-color: white;

    &__wrapper {
      min-width: 250px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__button {
      padding: 10px 20px;
      border-radius: 10px;
      border: 0;
      cursor: pointer;
      width: 100%;
      box-shadow: 0px 2px 8px 0px rgba(34, 60, 80, 0.2);
      background-color: white;
    }

    &__posts {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 70vh;
      overflow-y: auto;

      &__item {
        box-shadow: 0px 2px 8px 0px rgba(34, 60, 80, 0.2);
        background-color: #fbfbfb;
        padding: 10px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        gap: 5px;

        &__body {
          opacity: 0.7;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
