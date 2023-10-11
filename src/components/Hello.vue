<template>
    <h1>Hello</h1>
    <q-btn
      label="Add Record (+)"
      @click="openDialog"
      class="q-mt-md q-mb-md bg-button1 text-white"
    />

    <q-dialog v-model="formProfile" persistent transition-show="flip-down" @hide="onHide">
      <div class="q-dialog__inner">
        <div class="q-dialog__title">Dialog Title</div>
        <div class="q-dialog__content">
          <!-- Dialog content goes here -->
        </div>
        <div class="q-dialog__actions">
          <q-btn label="Close" color="primary" @click="closeDialog" />
        </div>
      </div>
    </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const formProfile = ref(false);

const openDialog = ()=> {
  formProfile.value = true;
    console.log('test');
  };

  const closeDialog = ()=> {
    formProfile.value = false;
  };

function onToday () {
      this.$refs.calendar.moveToToday()
    };
</script>