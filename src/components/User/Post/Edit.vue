<script setup lang="ts">
import { defineEmits, defineProps } from "vue";
import { Post } from "@/types";
import { Field, Form, ErrorMessage } from "vee-validate";
import { object, required, string } from "yup";

const props = defineProps(["title", "post"]);
const emit = defineEmits(["close", "edit"]);

const schema = object({
  title: string().required("Название необходимо заполнить"),
  body: string().required("Содержимое необходимо заполнить"),
});

const closeForm = (): void => {
  emit("close");
};

const editPost = (post: Post): void => {
  emit("edit", post);

  closeForm();
};
</script>

<template>
  <div class="form__wrapper">
    <Form
      class="form"
      :validation-schema="schema"
      @submit="editPost"
      :initial-values="{ id: post.id, title: post.title, body: post.body }"
    >
      <div class="form__header">
        <h3>{{ props.title }}</h3>

        <p @click="closeForm" class="form__header__close">Закрыть</p>
      </div>

      <div class="form__input">
        <label id="title">Название</label>

        <Field id="title" name="title" placeholder="Title..." tag="textarea" />

        <ErrorMessage name="title" />
      </div>

      <div class="form__input">
        <label id="body">Содержимое</label>

        <Field id="body" name="body" placeholder="Body..." />

        <ErrorMessage name="body" />
      </div>

      <button class="form__button" type="submit">Изменить</button>
    </Form>
  </div>
</template>

<style lang="scss" scoped>
.form {
  &__wrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    &__close {
      cursor: pointer;
    }
  }

  background: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 10px;
  min-width: 350px;

  &__input {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;

    input,
    textarea {
      box-shadow: 0px 2px 8px 0px rgba(34, 60, 80, 0.2);
      border: 0;
      outline: none;
      padding: 6px 10px;
      resize: vertical;
      width: 100%;
      border-radius: 10px;
    }
  }

  &__button {
    width: 100%;
    padding: 6px 10px;
    border: 0;
    border-radius: 10px;
    box-shadow: 0px 2px 8px 0px rgba(34, 60, 80, 0.2);
  }
}
</style>
