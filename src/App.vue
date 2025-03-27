<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <head>
    <meta name="description" content="List of all datasets available through the Open Data Hub metadata API">
  </head>
  <body data-bs-theme=light :style="`font-family: '${fontName}'`">
    <div class="container-fluid py-4">
      <div class="pb-lg-4 row gy-4 align-items-center">
        <Select
          class="col-12 col-xl-6"
          :dataspaces="availableDataspaces"
          @dataspace-change="(newDataspace) => selectedDataspace = newDataspace"
          @search-term-change="(changedTerm) => searchTerm = changedTerm"
        />
        <h4 class="col-12 col-xl-6 text-lg-end"><b>{{ filteredDatasets?.length }} Datasets</b></h4>
      </div>
      <div class="pt-4">
        <div class="row g-4">
          <div
            v-if="filteredDatasets?.length ?? 0 > 0"
            v-for="item in filteredDatasets"
            :key="item.Id"
            class="col-12 col-md-6 col-lg-4 col-xl-3"
          >
            <DatasetCard :dataset="item" />
          </div>
          <h3 v-else>Your search came up empty</h3>
        </div>
      </div>
    </div>
  </body>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Dataset } from './ts/types';
import DatasetCard from "./components/DatasetCard.vue";
import Select from './components/Select.vue';
import { fetchMetadata, withParents, sorted, withoutDeprecated, apiBase, apiVersion } from "./ts/api";

const {
  fontUrl,
  fontName,
} = withDefaults(defineProps<{
  fontUrl?: string;
  fontName?: string;
}>(), {
  fontUrl: "https://fonts.testingmachine.eu/open-sans/style.css",
  fontName: "Open Sans",
})

fetch(fontUrl)
.then((response) => response.text())
.then((cssText) => {
  const fontFaceSheet = new CSSStyleSheet();
  fontFaceSheet.replaceSync(cssText);
  document.adoptedStyleSheets = [
    ...document.adoptedStyleSheets,
    fontFaceSheet,
  ];
});

const allDatasets = ref<Dataset[]>([]);
const availableDataspaces = ref<string[]>([]);
const selectedDataspace = ref<string>(""); // "" represents "All Dataspaces"
const searchTerm = ref<string>("");

const params = [
  "pagesize=1000",
  "origin=webcomp-datasets-list"
];

fetchMetadata(
  apiBase,
  apiVersion,
  params,
  [sorted, withParents]
  // Remove [withoutDeprecated] to add Deprecated datasets into the list of datasets 
)
.then((data) => {
  allDatasets.value = data;

  const dataspaces = new Set<string>();
  data.forEach(dataset => {
    if (typeof dataset.Dataspace === 'string' && dataset.Dataspace.trim() !== '') {
      dataspaces.add(dataset.Dataspace.trim());
    }
  });
  availableDataspaces.value = Array.from(dataspaces).sort();
});

const filteredDatasets = computed(() => {
  let datasetsToFilter = allDatasets.value;
  datasetsToFilter = filterByDataspace(datasetsToFilter, selectedDataspace.value);
  datasetsToFilter = filterByTerm(datasetsToFilter, searchTerm.value);
  return datasetsToFilter;
})

function filterByDataspace(datasets: Dataset[], dataspace: string): Dataset[] {
  if (dataspace === "") {
    return datasets;
  } else {
    return datasets.filter((dataset) => dataset.Dataspace === dataspace);
  }
}

function filterByTerm(datasets: Dataset[], term: string): Dataset[] {
  if (!term || term.trim().length === 0) {
    return datasets;
  }
  const lowerCaseTerm = term.toLowerCase();
  return datasets.filter((dataset) => {
    const titleIncludesTerm = dataset.Shortname?.toLowerCase().includes(lowerCaseTerm);
    const descriptionIncludesTerm = dataset.ApiDescription?.en?.toLowerCase().includes(lowerCaseTerm);
    return titleIncludesTerm || descriptionIncludesTerm;
  });
}

</script>

<style lang="scss">
@import "./scss/styles.scss";
</style>
./ts/api./ts/types