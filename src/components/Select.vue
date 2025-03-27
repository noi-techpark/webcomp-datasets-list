<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div>
    <div class="d-flex flex-column flex-lg-row gap-2 gap-lg-4">
      <!-- Dataspace Dropdown -->
      <div class="col-12 col-lg-4 position-relative">
        <select
          class="select-element w-100 form-select bg-light border-0"
          v-model="selectedDataspace"
          aria-label="Select Dataspace"
        >
          <option value="">All Dataspaces</option>
          <option v-for="ds in dataspaces" :key="ds" :value="ds">
            {{ formatDataspaceName(ds) }}
          </option>
        </select>
      </div>

      <!-- Search Input -->
      <div class="col-12 col-lg-4 position-relative">
        <input
          type="text"
          class="select-element w-100 border-0 form-control bg-light text-start"
          placeholder="Search datasets"
          v-model="searchTerm"
        />
        <div
          v-show="searchTerm.length > 0"
          @click="searchTerm = ''"
          class="close-icon"
          role="button"
          aria-label="Clear search"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  dataspaces: string[];
}>();

const emit = defineEmits<{
  dataspaceChange: [dataspace: string];
  searchTermChange: [searchTerm: string];
}>()

const selectedDataspace = ref<string>("");
watch(selectedDataspace, (newValue) => emit("dataspaceChange", newValue));

const searchTerm = ref<string>("");
watch(searchTerm, (newValue) => emit("searchTermChange", newValue));

function formatDataspaceName(dataspace: string): string {
  if (!dataspace) return '';
  return dataspace.charAt(0).toUpperCase() + dataspace.slice(1);
}

</script>