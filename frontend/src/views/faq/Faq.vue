<template>
  <div class="w-full">
    <HeaderComponent />
    <div class="flex justify-around mb-16">
      <div class="w-1/6 flex justify-center mt-[97px]">
        <div class="flex flex-col">
          <RouterLink class="font-bold" to="/faq">FAQ</RouterLink>
          <RouterLink class="mt-[22px]" to="/community-guidelines">Community Guidelines</RouterLink>
        </div>
      </div>
      <div class="w-5/6 flex justify-center mt-[97px]">
        <div class="w-[970px]">
          <div class="title mb-5">FAQ</div>
          <div v-for="item in faqContent" :key="item.id">
            <div class="">
              <div class="w-full box-shadow mt-2 rounded-xl">
                <div
                  class="flex justify-between h-[46px] items-center cursor-pointer px-4"
                  @click="item.choice = !item.choice"
                >
                  <div class="subtitle" :class="item.choice ? ' !text-primary-color' : ''">
                    {{ item.header }}
                  </div>
                  <div
                    class="w-[20px] h-[20px] rounded-full cursor-pointer flex justify-center items-center"
                    :class="item.choice ? 'hidden' : 'block'"
                  >
                    <PlusIcon />
                  </div>
                  <div
                    class="w-[20px] h-[20px] rounded-full cursor-pointer flex justify-center items-center"
                    :class="item.choice ? 'block' : 'hidden'"
                  >
                    <MinusIcon />
                  </div>
                </div>
                <Transition name="content">
                  <div class="paragraph pb-11 primaryText !text-black px-4" v-if="item.choice">
                    {{ item.content }}
                  </div>
                </Transition>
              </div>
            </div>
          </div>
          <div class="paragraph mt-[74px] primaryText">
            Can’t find an answer?
            <span class="text-primary-color cursor-pointer">Contact us</span> here and we will
            address your problem as soon as possible.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import HeaderComponent from '../../components/Header/HeaderComponent.vue';
import MinusIcon from '../../assets/svg/MinusIcon.vue';
import PlusIcon from '../../assets/svg/PlusIcon.vue';
import { RouterLink } from 'vue-router';

const faqContent = reactive([
  {
    id: 1,
    header: 'Question goes here.',
    content:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic.',
    choice: false,
  },
  {
    id: 2,
    header: 'Question goes here.',
    content:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic.',
    choice: false,
  },
  {
    id: 3,
    header: 'Question goes here.',
    content:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic.',
    choice: false,
  },
  {
    id: 4,
    header: 'Question goes here.',
    content:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic.',
    choice: false,
  },
  {
    id: 5,
    header: 'Question goes here.',
    content:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic.',
    choice: false,
  },
  {
    id: 6,
    header: 'Question goes here.',
    content:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic.',
    choice: false,
  },
  {
    id: 7,
    header: 'Question goes here.',
    content:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic.',
    choice: false,
  },
]);
</script>

<style scoped>
/* transition for turn on,off select */
.content-enter-active {
  transition: all 0.5s ease;
}
.content-leave-active {
  transition: all 0.5s ease;
}
.content-enter-from,
.content-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
/* transition for turn on,off select */

.list-guideline {
  padding-left: 16px;
}

.list-guideline li {
  position: relative;
  margin-top: 16px;
}

.list-guideline li::before {
  content: '\2022';
  position: absolute;
  left: -18px;
  top: 50%;
  transform: translateY(-50%);
}

p,
li {
  font-size: 14px;
}
.box-shadow {
  box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.1);
}
</style>
