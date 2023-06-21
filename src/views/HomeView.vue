<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useModal, useModalSlot } from "vue-final-modal";
import draggable from "vuedraggable";

import Add from "@/components/User/Post/Add.vue";

import { Post, User } from "@/types";

import UserPost from "@/components/User/Post/index.vue";

const AddPostModal = useModal({
  defaultModelValue: false,
  attrs: {
    clickToClose: true,
    escToClose: true,
  },
  slots: {
    default: useModalSlot({
      component: Add,
      attrs: {
        title: `Добавить пост`,
        onClose() {
          AddPostModal.close();
        },
      },
    }),
  },
});

const route = useRoute();

const users = ref<User[]>([] as User[]);

const fetchUserPosts = async (id: number): Promise<Post[]> => {
  const response = await fetch(
    `${process.env.VUE_APP_API_HOST}/users/${id}/posts`
  );

  return await response.json();
};

const fetchUsers = async (): Promise<void> => {
  const response = await fetch(`${process.env.VUE_APP_API_HOST}/users`);
  const data = await response.json();

  for (let i = 0; i < data.length; i++) {
    const user: User = data[i];

    users.value.push(user);

    user.loading = true;
    user.posts = await fetchUserPosts(user.id);
    user.posts.map((e) => (e.user = user));
    user.loading = false;
  }
};

watch(
  route,
  async () => {
    await fetchUsers();

    const row = document.querySelector(".users__row");
    const gradient = document.querySelector(".users__row__gradient");

    console.log(row.scrollWidth);

    gradient.style.width = `${row.scrollWidth}px`;
  },
  {
    immediate: true,
  }
);

const openAddPostModal = (user: User): void => {
  AddPostModal.patchOptions({
    slots: {
      default: useModalSlot({
        component: Add,
        attrs: {
          title: `Добавить пост ${user.username}`,
          user,
          onAdd: (post: Post) => {
            user.posts.push(post);
            AddPostModal.close();
          },
        },
      }),
    },
  });

  AddPostModal.open();
};

const editPost = (post: Post, newValue: Post): void => {
  post.title = newValue.title;
  post.body = newValue.body;
};

const handlePostGroupChange = (
  status: { added: { element: Post } },
  user: User
): void => {
  if (status.added) {
    status.added.element.userId = user.id;
  }
};
</script>

<template>
  <div class="users__wrapper">
    <h1>Users</h1>

    <div class="users__row">
      <div class="users__row__gradient"></div>

      <div
        v-for="user in users"
        :key="`user-${user.id}`"
        class="users__column__wrapper"
      >
        <div class="users__column">
          <div class="users__column__header">
            <h4>{{ user.username }}</h4>

            <p>{{ user.posts?.length }} постов</p>
          </div>
        </div>

        <div v-if="user.loading" class="users__column__posts">
          <div class="users__column__posts__item">Загрузка...</div>
        </div>

        <draggable
          v-if="user.posts?.length"
          class="users__column__posts"
          :item-key="`user-${user.id}-posts`"
          group="posts"
          :list="user.posts"
          @change="(status) => handlePostGroupChange(status, user)"
        >
          <template #item="{ element, index }">
            <UserPost
              :key="`user-${user.id}-${element.id}`"
              :post="element"
              @edit="(newValue) => editPost(element, newValue)"
              @delete="() => user.posts.splice(index, 1)"
            />
          </template>
        </draggable>

        <button class="users__column__button" @click="openAddPostModal(user)">
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
    overflow-x: auto;
    display: flex;
    position: relative;
    background-color: #eee;
    padding-bottom: 10px;

    &__gradient {
      position: absolute;
      left: 0;
      top: 0;
      background: rgb(124, 239, 156);
      background: linear-gradient(
        90deg,
        rgba(124, 239, 156, 1) 0%,
        rgba(16, 105, 168, 1) 100%
      );
      height: 50px;
      width: 100%;
      z-index: 1;
    }
  }

  &__column {
    padding: 0 14px;
    box-shadow: 0px 2px 8px 0px rgba(34, 60, 80, 0.2);
    border-radius: 10px;
    z-index: 10;
    position: relative;
    background: transparent;
    color: white;
    overflow: hidden;

    &__wrapper {
      min-width: 250px;
      width: 250px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      border-right: 20px #eee solid;
      z-index: 1;
    }

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
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
    }
  }
}
</style>
