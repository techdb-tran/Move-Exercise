<template>
  <div class="w-ful">
    <HeaderComponent />
    <div class="flex justify-around mb-16">
      <div class="w-1/6 flex justify-center" :style="{ marginTop: '97px' }">
        <div class="flex flex-col">
          <RouterLink class="" to="/faq">FAQ</RouterLink>
          <RouterLink class="mt-[22px] font-bold" to="/community-guidelines">Community Guidelines</RouterLink>
        </div>
      </div>
      <div class="w-5/6 flex justify-center">
        <div :style="{ marginTop: '93px' }" class="w-4/5">
          <h2 class="text-2xl font-bold">Community Guidelines</h2>
          <h5 class="text-base font-bold" :style="{ marginTop: '18px' }">Title goes here</h5>
          <p class="mt-2">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry’s standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type specimen book. It has
            survived not only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </p>
          <ul class="list-guideline">
            <li>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
              has been the industry’s standard dummy text ever since the 1500s, when an unknown
              printer took a galley of type and scrambled it to make a type specimen book.
            </li>
            <li>
              It has survived not only five centuries, but also the leap into electronic
              typesetting, remaining essentially unchanged. It was popularised in the 1960s with the
              release of Letraset sheets containing Lorem Ipsum passages, and more recently with
              desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </li>
            <li>
              It is a long established fact that a reader will be distracted by the readable content
              of a page when looking at its layout. The point of using Lorem Ipsum is that it has a
              more-or-less normal distribution of letters, as opposed to using ‘Content here,
              content here’, making it look like readable English.
            </li>
            <li>
              Many desktop publishing packages and web page editors now use Lorem Ipsum as their
              default model text, and a search for ‘lorem ipsum’ will uncover many web sites still
              in their infancy. Various versions have evolved over the years, sometimes by accident,
              sometimes on purpose (injected humour and the like).
            </li>
          </ul>
          <h5 class="text-base font-bold" :style="{ marginTop: '30px' }">Title goes here</h5>
          <p class="mt-4">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry’s standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type specimen book.
          </p>
          <p class="mt-4">
            It has survived not only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </p>
          <p class="mt-4">
            It is a long established fact that a reader will be distracted by the readable content
            of a page when looking at its layout. The point of using Lorem Ipsum is that it has a
            more-or-less normal distribution of letters, as opposed to using ‘Content here, content
            here’, making it look like readable English.
          </p>
          <p class="mt-4">
            Many desktop publishing packages and web page editors now use Lorem Ipsum as their
            default model text, and a search for ‘lorem ipsum’ will uncover many web sites still in
            their infancy. Various versions have evolved over the years, sometimes by accident,
            sometimes on purpose (injected humour and the like).
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import HeaderComponent from '../Header/HeaderComponent.vue';
</script>
<style scoped>
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
</style>
