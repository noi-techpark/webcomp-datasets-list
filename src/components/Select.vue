<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div>
    <div class="row gx-4 gy-2">
      <div class="col-12 col-lg-4 position-relative">
        <select
          name="domain"
          id="domain"
          class="select-element w-100 border-0 form-control bg-light text-start"
          v-model="domain"
        >
          <option value="all">All Domains</option>
          <option value="tourism">Tourism</option>
          <option value="mobility">Mobility</option>
        </select>
      </div>
      <div class="col-12 col-lg-4">
        <input
          type="text"
          class="select-element w-100 border-0 form-control bg-light text-start"
          placeholder="Search elements"
          v-model="searchTerm"
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const emit = defineEmits<{
  domainChange: [domain: string];
  searchTermChange: [searchTerm: string];
}>()

const domain = ref("all");
watch(domain, (newValue) => emit("domainChange", newValue));

const searchTerm = ref<string>("");
watch(searchTerm, (newValue) => emit("searchTermChange", newValue));
</script>
