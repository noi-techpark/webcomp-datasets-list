<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div>
    <div class="d-flex flex-column flex-lg-row gap-2 gap-lg-4">
      <div
        class="col-12 col-lg-4 position-relative"
      >
        <div
          id="dropdown-title"
          class="select-element w-100 position-relative border-0 form-control bg-light dropdown-toggle text-start"
          @click="toggleDropdown"
        >
          {{ friendlyDomainNames[domain] }}
        </div>
        <div
          id="dropdown"
          class="w-100 position-absolute z-1 mt-2 card shadow"
          :class="`${showDropdown ? 'd-block' : 'd-none'}`"
        >
          <ul class="mb-0 p-2 list-unstyled">
            <li>
              <div class="form-check">
                <input
                  class="form-check-input"
                  id="all-radio"
                  type="radio"
                  value="all"
                  v-model="domain"
                >
                <label class="form-check-label" for="all-radio">
                  {{ friendlyDomainNames.all }}
                </label>
              </div>
            </li>
            <li>
              <div class="form-check">
                <input
                  class="form-check-input"
                  id="tourism-radio"
                  type="radio"
                  value="tourism"
                  v-model="domain"
                >
                <label class="form-check-label" for="tourism-radio">
                  {{ friendlyDomainNames.tourism }}
                </label>
              </div>
            </li>
            <li>
              <div class="form-check">
                <input
                  class="form-check-input"
                  id="mobility-radio"
                  type="radio"
                  value="mobility"
                  v-model="domain"
                >
                <label class="form-check-label" for="mobility-radio">
                  {{ friendlyDomainNames.mobility }}
                </label>
              </div>
            </li>
          </ul>
        </div>
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

const showDropdown = ref(false);
function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

const friendlyDomainNames: Record<string, string> = {
  all: "All domains",
  tourism: "Tourism",
  mobility: "Mobility"
}

const domain = ref("all");
watch(domain, (newValue) => emit("domainChange", newValue));

const searchTerm = ref<string>("");
watch(searchTerm, (newValue) => emit("searchTermChange", newValue));
</script>
