<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <head>
    <meta name="description" content="List of all datasets available through the Open Data Hub metadata API">
  </head>
  <body data-bs-theme=light :style="`font-family: '${fontName}'`">
    <div class="container-fluid py-4" :class="`${noPadding ? 'p-0' : ''}`">
      <div class="pb-4 row">
        <Select
          class="col col-xl-6"
          @domain-change="(newDomain) => domain = newDomain"
          @search-term-change="(changedTerm) => searchTerm = changedTerm"
        />
        <h4 class="col text-end"><b>{{ filteredDatasets?.length }} Datasets</b></h4>
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
import { Dataset } from './types';
import DatasetCard from "./components/DatasetCard.vue";
import Select from './components/Select.vue';

const {
  fontUrl,
  fontName,
  noPadding,
} = withDefaults(defineProps<{
  fontUrl?: string;
  fontName?: string;
  noPadding?: boolean;
}>(), {
  fontUrl: "https://fonts.testingmachine.eu/open-sans/style.css",
  fontName: "Open Sans",
  noPadding: false,
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

const apiBaseEnv = import.meta.env.VITE_API_BASE as string;
const apiBase = apiBaseEnv.endsWith("/")
  ? apiBaseEnv.slice(0, -1)
  : apiBaseEnv;

const apiVersionEnv = import.meta.env.VITE_API_VERSION as string;
const apiVersion = apiVersionEnv.endsWith("/")
  ? apiVersionEnv.slice(0, -1)
  : apiVersionEnv;

const apiUrl = `${apiBase}/${apiVersion}/MetaData?pagesize=1000&origin=webcomp-datasets-list`

const datasets = ref<Dataset[]>();

fetch(apiUrl)
.then((res) => res.json())
.then((json: { Items: Dataset[] }) => {
  const rootDatasets = json.Items.reduce<Record<string, Dataset>>(
    (prev, dataset) => {
      if (dataset.ApiFilter.length === 0) {
        const key = dataset.PathParam.join('/');
        return { ...prev, [key]: dataset };
      }
      return prev;
    },
    {}
  );

  const withParents = json.Items.map((dataset) => {
    if (dataset.ApiFilter.length === 0) {
      return dataset;
    }
    const key = dataset.PathParam.join('/');
    const parent = rootDatasets[key];
    return { ...dataset, Parent: parent };
  });

  const sorted = withParents.sort((a, b) => a.Shortname < b.Shortname ? -1 : 1);
  
  datasets.value = sorted;
})
.catch((err) => console.error(err));

const domain = ref("all");
const searchTerm = ref<string>("");

const filteredDatasets = computed(() => {
  const byDomain = filterByDomain(datasets.value ?? [], domain.value);
  const byTerm = filterByTerm(byDomain, searchTerm.value);
  return byTerm;
})

function filterByDomain(datasets: Dataset[], domain: string): Dataset[] {
  if (domain === "all") {
    return datasets;
  } else {
    return datasets.filter((dataset) => dataset.BaseUrl.includes(domain))
  }
}

function filterByTerm(datasets: Dataset[], searchTerm: string): Dataset[] {
  if (searchTerm.length > 0) {
    return datasets.filter((dataset) => {
      const titleIncludesTerm = dataset.Shortname.toLowerCase().includes(searchTerm.toLowerCase());
      const descriptionIncludesTerm = dataset.ApiDescription?.en.toLowerCase().includes(searchTerm.toLowerCase());
      return titleIncludesTerm || descriptionIncludesTerm;
    })
  } else {
    return datasets;
  }
}


</script>

<style lang="scss">
@import "./scss/styles.scss";
</style>
