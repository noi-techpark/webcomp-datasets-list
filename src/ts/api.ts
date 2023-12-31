// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Dataset } from "./types";

function withoutEndingSlash(url: string): string {
  return url.endsWith("/")
  ? url.slice(0, -1)
  : url;
}

const databrowserBaseEnv = import.meta.env.VITE_DATABROWSER_BASE as string;
export const databrowserBase = withoutEndingSlash(databrowserBaseEnv);

const apiBaseEnv = import.meta.env.VITE_API_BASE as string;
export const apiBase = withoutEndingSlash(apiBaseEnv);

const apiVersionEnv = import.meta.env.VITE_API_VERSION as string;
export const apiVersion = withoutEndingSlash(apiVersionEnv);

export async function fetchMetadata(
  apiBase: string,
  apiVersion: string,
  params: string[],
  elaborations?: ((datasets: Dataset[]) => Dataset[])[]
  ): Promise<Dataset[]> {
  const url = `${apiBase}/${apiVersion}/MetaData?${params.join("&")}`
  const res = await fetch(url);
  const json: { Items: Dataset[] } = await res.json();
  const rawDatasets = json.Items;

  if (elaborations) {
    return elaborations.reduce((prev, current) => current(prev), rawDatasets);
  } else {
    return rawDatasets;
  }
}

export function withParents(datasets: Dataset[]): Dataset[] {
  const rootDatasets = datasets.reduce<Record<string, Dataset>>(
    (prev, dataset) => {
      if (dataset.ApiFilter.length === 0) {
        const key = dataset.PathParam.join('/');
        return { ...prev, [key]: dataset };
      }
      return prev;
    },
    {}
  );

  const withParents = datasets.map((dataset) => {
    if (dataset.ApiFilter.length === 0) {
      return dataset;
    }
    const key = dataset.PathParam.join('/');
    const parent = rootDatasets[key];
    return { ...dataset, Parent: parent };
  });

  return withParents;
}

export function withoutDeprecated(datasets: Dataset[]): Dataset[] {
  return datasets.filter((dataset) => !dataset.Deprecated);
}

export function sorted(datasets: Dataset[]): Dataset[] {
  return datasets.sort((a, b) => a.Shortname < b.Shortname ? -1 : 1);
}