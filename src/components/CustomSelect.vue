<template>
  <div class="relative" ref="selectContainer">
    <!-- Select Button -->
    <button
      @click="toggleDropdown"
      class="min-w-0 w-36 sm:w-auto font-bold px-3 py-2 sm:px-3 sm:py-2 text-base sm:text-base border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 flex items-center justify-between"
      type="button"
    >
      <span>{{ displayValue }}</span>
      <svg
        class="w-5 h-5 ml-2 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </button>

    <!-- Dropdown Options -->
    <div
      v-if="isOpen"
      class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50 max-h-60 overflow-auto"
    >
      <button
        v-for="option in options"
        :key="option.value"
        @click="selectOption(option)"
        class="w-full px-3 py-2 text-left text-base sm:text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 transition-colors"
        :class="{
          'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400':
            option.value === modelValue,
        }"
        type="button"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  modelValue: string;
  options: SelectOption[];
  placeholder?: string;
}

interface Emits {
  (e: "update:modelValue", value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Select an option",
});

const emit = defineEmits<Emits>();

const isOpen = ref(false);
const selectContainer = ref<HTMLElement>();

const displayValue = computed(() => {
  const selectedOption = props.options.find(
    (option) => option.value === props.modelValue
  );
  return selectedOption ? selectedOption.label : props.placeholder;
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (option: SelectOption) => {
  emit("update:modelValue", option.value);
  isOpen.value = false;
};

const closeDropdown = (event: Event) => {
  if (
    selectContainer.value &&
    !selectContainer.value.contains(event.target as Node)
  ) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
});
</script>
