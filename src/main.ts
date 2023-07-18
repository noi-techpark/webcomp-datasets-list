// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { defineCustomElement } from 'vue';
import DatasetsList from './App.vue';

const DatasetsListCE = defineCustomElement(DatasetsList);

customElements.define('datasets-list-widget', DatasetsListCE);