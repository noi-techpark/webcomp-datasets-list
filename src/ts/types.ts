// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export interface Dataset {
  Id: string;

  ImageGallery: [
    {
      ImageUrl: number;
    }
  ];

  Shortname: string;
  ApiDescription: { en: string };

  ApiFilter: string[];
  PathParam: string[];
  BaseUrl: string;
  DataProvider: string[];

  Output: { default: string };
  Sources: string[];
  Deprecated: boolean;
  RecordCount: {
    open: number;
    closed: number;
  };

  Parent?: Dataset;
}
