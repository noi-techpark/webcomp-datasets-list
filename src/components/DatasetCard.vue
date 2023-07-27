<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    class="dataset-card d-flex flex-column h-100 rounded-2 overflow-hidden bg-white shadow"
  >
    <div class="ratio ratio-16x9 position-relative">
      <img :src="imageSrc" class="w-100" alt="dataset-image" />
      <a
        class="dataset-card-link d-none d-lg-flex justify-content-center align-items-center gap-2 position-absolute h-100 text-decoration-none cursor-pointer"
        :href="`${databrowserBase}/dataset-overview/${dataset.Id}`"
        target="_blank"
      >
        <h4 class="m-0">Open in Databrowser</h4>
        <IconExternal />
      </a>
    </div>
    <div class="d-flex flex-column justify-content-between flex-grow-1 p-3">
      <div>
        <h4>
          <strong>{{ dataset.Shortname }}</strong>
        </h4>
        <span v-if="dataset.Parent">
          <a
            class="text-reset d-flex align-items-center gap-1"
            :href="`${databrowserBase}/dataset-overview/${dataset.Parent.Id}`"
            target="_blank"
          >
            from {{ dataset.Parent.Shortname }}<IconExternal sm />
          </a>
        </span>
        <div class="py-3">
          {{ ApiDescription }}
        </div>
      </div>
      <div class="d-none d-lg-flex row">
        <div class="col-12">
          <div v-if="dataset.Sources" class="w-100 text-truncate">
            Sources:
            <strong>
              {{ dataset.Sources.join(", ") }}
            </strong>
          </div>
          <div v-if="recordCount != null">
            Records:
            <strong>
              {{ recordCount }}
            </strong>
          </div>
        </div>
      </div>
      <a
        :href="`${databrowserBase}/dataset-overview/${dataset.Id}`"
        target="_blank"
        class="align-self-start d-lg-none d-flex justify-content-center align-items-center gap-2 btn btn-primary bg-black border-0"
      >
        <span>Open in Databrowser</span><IconExternal sm />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Dataset } from "../ts/types";
import Placeholder from "../assets/img/placeholder.png";
import IconExternal from "./IconExternal.vue";
import { computed } from "vue";
import { databrowserBase } from "../ts/api";

const { dataset } = defineProps<{
  dataset: Dataset;
}>();

const imageSrc = computed(() => {
  return dataset?.ImageGallery?.[0]?.ImageUrl || Placeholder;
});

const recordCount = computed(() => {
  if (dataset.RecordCount?.open == null || !dataset.RecordCount?.closed == null)
    return null;
  return dataset.RecordCount.open + dataset.RecordCount.closed;
});

const ApiDescription = computed(() => {
  const maxLen = 150;
  if (!dataset.ApiDescription || !dataset.ApiDescription.en) {
    return;
  }
  if (dataset.ApiDescription.en.length > maxLen) {
    return dataset.ApiDescription.en.substring(0, maxLen) + "...";
  } else {
    return dataset.ApiDescription.en;
  }
});
</script>