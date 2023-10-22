<template>
    <div class="row justify-center">
      <div class="q-pa-md q-gutter-sm row">
        <q-btn
          no-caps
          class="button q-mt-md q-mb-md drawerActive text-white"
          style="margin: 2px;"
          @click="$emit('prev')"
        >
          &lt;
        </q-btn>
        <q-btn
          no-caps
          class="button q-mt-md q-mb-md drawerActive text-white"
          style="margin: 2px;"
          @click="$emit('today')"
        >
          Today
        </q-btn>
        <q-btn
          no-caps
          class="button q-mt-md q-mb-md drawerActive text-white"
          style="margin: 2px;"
          @click="$emit('next')"
        >
          &gt;
        </q-btn>
      </div>
    </div>
  </template>

  <style scoped>
  .q-pa-md {
    height: auto !important;
}
</style>