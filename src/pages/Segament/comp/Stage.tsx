// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

import React, { useContext } from "react";
import * as _ from "lodash";
import { request } from 'umi'
import Tool from "./Tool";
import { modelInputProps } from "@/utils/interfaces";
import AppContext from "./context/createContext";
import './stage.less'

import Thumbnail from "./seletedImgPreview/Thumbnail";
import PreviewModal from "./seletedImgPreview/PreviewModal";
import { Button } from 'antd'

const Stage = () => {
  const {
    clicks: [clicks, setClicks],
    image: [image],
    // optedFileName: [optedFileName],
    selectedEleList: [selectedEleList]
  } = useContext(AppContext)!;

  const getClick = (x: number, y: number): modelInputProps => {
    const clickType = 1;
    return { x, y, clickType };
  };

  // const thumbnailList = selectedEleList.get(optedFileName)

  // Get mouse position and scale the (x, y) coordinates back to the natural
  // scale of the image. Update the state of clicks with setClicks to trigger
  // the ONNX model to run and generate a new mask via a useEffect in App.tsx
  const handleMouseMove = _.throttle((e: any) => {
    let el = e.nativeEvent.target;
    const rect = el.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    const imageScale = image ? image.width / el.offsetWidth : 1;
    x *= imageScale;
    y *= imageScale;
    const click = getClick(x, y);
    if (click) setClicks([click]);
  }, 15);

  const handleUpload = async () => {
    await request('http://localhost:5000/api/upload-feature', {
      method: 'post',
      data: {
        payload: selectedEleList.map(item => {
          return {
            name: item.id,
            data: item.imgSrc
          }
        })
      },
    })
  }

  return (
    <div className='stage-warpper'>
      <div className='scene-img'>
        <Tool handleMouseMove={handleMouseMove} />
      </div>
      <div className="feature-list">
        <span className="title">Features</span>
        {
          selectedEleList && selectedEleList.length > 0 && selectedEleList.map((ele, idx) =>
            <Thumbnail key={ele.timestamps} imgSrc={ele.imgSrc} idx={idx} name={ele.id}/>
          )
        }
        <Button className="upload-btn" type="primary" onClick={handleUpload}>Upload</Button>
      </div>
      <PreviewModal />
    </div>
  );
};

export default Stage;
