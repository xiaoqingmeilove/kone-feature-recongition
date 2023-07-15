// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

import { createContext } from "react";
import { modelInputProps, selectEle } from "@/utils/interfaces";

interface contextProps {
  clicks: [
    clicks: modelInputProps[] | null,
    setClicks: (e: modelInputProps[] | null) => void
  ];
  image: [
    image: HTMLImageElement | null,
    setImage: (e: HTMLImageElement | null) => void
  ];
  maskImg: [
    maskImg: HTMLImageElement | null,
    setMaskImg: (e: HTMLImageElement | null) => void
  ];
  selectedEleList: [
    selectedEleList: Array<selectEle>,
    setSelectedEleList: (e: Array<selectEle>) => void
  ];
  showPreviewModal: [
    showPreviewModal: boolean,
    setShowPreviewModal: (e: boolean) => void
  ]
  preivewImgSrc: [
    preivewImgSrc: string,
    setPreivewImgSrc: (e: string) => void
  ]
  optedFileName: [
    optedFileName: string,
    setOptedFileName: (e: string) => void
  ]
}

const AppContext = createContext<contextProps | null>(null);

export default AppContext;
