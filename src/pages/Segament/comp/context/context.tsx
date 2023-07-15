// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

import React, { useState } from "react";
import { modelInputProps, selectEle } from "@/utils/interfaces";
import AppContext from "./createContext";

const ContextProvider = (props: {
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}) => {
  const [clicks, setClicks] = useState<Array<modelInputProps> | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [maskImg, setMaskImg] = useState<HTMLImageElement | null>(null);
  const [selectedEleList, setSelectedEleList] = useState<Array<selectEle>>([]);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false)
  const [preivewImgSrc, setPreivewImgSrc] = useState<string>('')
  const [optedFileName, setOptedFileName] = useState<string>('')

  return (
    <AppContext.Provider
      value={{
        clicks: [clicks, setClicks],
        image: [image, setImage],
        maskImg: [maskImg, setMaskImg],
        selectedEleList: [selectedEleList, setSelectedEleList],
        showPreviewModal: [showPreviewModal, setShowPreviewModal],
        preivewImgSrc: [preivewImgSrc, setPreivewImgSrc],
        optedFileName: [optedFileName, setOptedFileName]
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
