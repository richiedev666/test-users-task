<script lang="ts" setup>
import { Post } from "@/types";
import { defineProps, defineEmits } from "vue";
import { useModal, useModalSlot } from "vue-final-modal";
import Edit from "@/components/User/Post/Edit.vue";

const props = defineProps<{ post: Post }>();
const emit = defineEmits(["edit", "delete"]);

const EditPostModal = useModal({
  defaultModelValue: false,
  attrs: {
    clickToClose: true,
    escToClose: true,
  },
  slots: {
    default: useModalSlot({
      component: Edit,
      attrs: {
        title: `Изменить пост ${props.post?.user?.username}`,
        post: props.post,
        onClose() {
          EditPostModal.close();
        },
        onEdit(newValue: Post) {
          emit("edit", newValue);
        },
      },
    }),
  },
});

const editPost = (): void => {
  EditPostModal.open();
};

const deletePost = (): void => {
  emit("delete", props.post);
};
</script>

<template>
  <div class="post">
    <h5>{{ post.title }}</h5>

    <p class="post__body">{{ post.body }}</p>

    <div class="post__panel">
      <button @click="editPost">Изменить</button>

      <button @click="deletePost">Удалить</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.post {
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

  &__panel {
    display: flex;
    gap: 10px;

    button {
      flex: 1;
      width: 100%;
      padding: 4px;
    }
  }
}
</style>
