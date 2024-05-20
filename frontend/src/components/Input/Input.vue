<template>
  <Field :name="name" v-slot="{ field, handleChange, handleBlur }">
    <label class="text-[14px]">{{ label }}</label>
    <br />
    <div class="relative">
      <input
        :type="inputType"
        :placeholder="placeholder"
        v-bind="field"
        @blur="handleBlur"
        @change="handleChange"
        :style="{ width: inputWidth }"
        :disabled="isDisabled"
        :class="[
          'h-[40px] px-2 mt-1 text-[14px] border-[1.5px] rounded-lg outline-primary-color placeholder:text-[14px]',
          isDisabled
            ? 'border-[#ccc] bg-gray-200 cursor-not-allowed text-opacity-50'
            : 'border-[#ccc] focus:border-primary-color',
        ]"
      />
      <EyeOn
        class="absolute right-4 top-4 cursor-pointer w-4 h-4"
        @click="handleShowPassword"
        v-if="type === 'password' && showPassword"
      ></EyeOn>
      <EyeOff
        class="absolute right-4 top-4 cursor-pointer w-4 h-4"
        @click="handleShowPassword"
        v-if="type === 'password' && !showPassword"
      ></EyeOff>
    </div>

    <ErrorMessage :name="name" v-slot="{ message }">
      <p class="text-[14px] text-red-500 mt-1">{{ message }}</p>
    </ErrorMessage>
  </Field>
</template>
<script setup>
import { Field, ErrorMessage } from 'vee-validate';
import { ref, computed } from 'vue';
import EyeOff from '../../assets/svg/EyeOff.vue';
import EyeOn from '../../assets/svg/EyeOn.vue';

const props = defineProps({
  name: String,
  type: String,
  label: String,
  placeholder: String,
  isDisabled: {
    type: Boolean,
    default: false,
  },
  inputWidth: {
    type: [String, Number],
    default: '533px',
  },
});

const isDisabled = ref(props.isDisabled);
const showPassword = ref(false);

const handleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const inputType = computed(() => (showPassword.value ? 'text' : props.type));
</script>
