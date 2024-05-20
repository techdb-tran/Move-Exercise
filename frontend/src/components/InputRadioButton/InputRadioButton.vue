<template>
  <Field :name="name" v-slot="{ field, handleChange }">
    <div class="flex items-center">
      <input
        :id="id"
        type="radio"
        :name="name"
        :value="value"
        :checked="field.value === value"
        @change="handleChange"
      />
      <label :for="id" class="mr-2 dot-radio text-sm"></label>
      <label :for="id" class="cursor-pointer text-[15px]">{{ props.label }}</label>
    </div>
  </Field>
</template>
<script setup>
import { Field } from 'vee-validate';

const props = defineProps({
  label: String,
  value: [String, Number],
  name: String,
  id: String,
});
</script>

<style scoped>
input[type='radio'] {
  display: none;
}

.dot-radio {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #ccc;
  cursor: pointer;
}

.dot-radio::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #fff;
}

input[type='radio']:checked + .dot-radio::after {
  background-color: #13d0b4;
}

input[type='radio']:checked + .dot-radio {
  border-color: #13d0b4;
}
</style>
