import React, { useContext, useState, useEffect } from "react";
import { request } from 'umi'
import { InferenceSession, Tensor } from "onnxruntime-web";
import npyjs from "npyjs";

import { handleImageScale } from "./comp/helpers/scaleHelper";
import { modelScaleProps, StageWarpperProps } from "@/utils/interfaces";
import { onnxMaskToImage } from "./comp/helpers/maskUtils";
import { modelData } from "./comp/helpers/onnxModelAPI";

import AppContext from "./comp/context/createContext";
import Stage from "./comp/Stage"

const ort = require("onnxruntime-web");
const MODEL_DIR = "/demo/model/sam_onnx_quantized_example.onnx";

const StageWarpper = ({ fileName }: StageWarpperProps ) => {
  const {
    clicks: [clicks],
    image: [myImg, setImage],
    maskImg: [MaskImg, setMaskImg],
    selectedEleList: [selectedEleList, setSelectedEleList]
  } = useContext(AppContext)!;
  const [model, setModel] = useState<InferenceSession | null>(null); // ONNX model
  const [tensor, setTensor] = useState<Tensor | null>(null); // Image embedding tensor
  const [modelScale, setModelScale] = useState<modelScaleProps | null>(null);

  // Decode a Numpy file into a tensor.
  const loadNpyTensor = async (tensorFile: string, dType: string) => {
    let npLoader = new npyjs();
    const npArray = await npLoader.load(tensorFile);
    const tensor = new ort.Tensor(dType, npArray.data, npArray.shape);
    return tensor;
  };

  const loadImage = async (url: URL) => {
    try {
      const img = new Image();
      img.src = url.href;
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const { height, width, samScale } = handleImageScale(img);
        setModelScale({
          height: height,  // original image height
          width: width,  // original image width
          samScale: samScale, // scaling factor for image which has been resized to longest side 1024
        });
        img.width = width;
        img.height = height;
        setImage(img);
      };
    } catch (error) {
      console.log(error);
    }
  };

  const loadImgAndTensor = async () => {
    const imgPath = `http://localhost:5000/uploads/${fileName}`
    const embeddingPath = `http://localhost:5000/npy/${fileName?.split(".")[0]}.npy`
    // const imgPath = `/demo/img/${fileName}`
    // const embeddingPath = `/demo/embedding/${fileName?.split(".")[0]}_embedding.npy`
    const url = new URL(imgPath);
    loadImage(url);

    // Load the Segment Anything pre-computed embedding
    Promise.resolve(loadNpyTensor(embeddingPath, "float32")).then(
      (embedding) => setTensor(embedding)
    );
  }

  const loadFeatures = async () => {
    const result = await request('http://localhost:5000/api/get-all-features', {
      method: 'get',
    })
    const resourceName = fileName?.split(".")[0]
    const featureList = result.data.filter((item:string)=>{
      if(item.split("/")[1].split("-")[0] === resourceName){
        return true
      }
      return false
    }).map((item:string,index:number)=>{
      return  {
        id: item.split("/")[1],
        imgSrc: `http://localhost:5000/${item}`,
        timestamps: new Date().getTime() + index
      }
    })
    setSelectedEleList(featureList)
  }

  useEffect(() => {
    // Initialize the ONNX model
    const initModel = async () => {
      try {
        if (MODEL_DIR === undefined) return;
        const URL: string = MODEL_DIR;
        const model = await InferenceSession.create(URL);
        setModel(model);
      } catch (e) {
        console.log(e);
      }
    };
    initModel();

    loadImgAndTensor();
    // // Load the image
    // const url = new URL(IMAGE_PATH, location.origin);
    // loadImage(url);

    // // Load the Segment Anything pre-computed embedding
    // Promise.resolve(loadNpyTensor(IMAGE_EMBEDDING, "float32")).then(
    //   (embedding) => setTensor(embedding)
    // );

    // load features
    loadFeatures();
  }, []);

  const runONNX = async () => {
    try {
      if (
        model === null ||
        clicks === null ||
        tensor === null ||
        modelScale === null
      )
        return;
      else {
        // Preapre the model input in the correct format for SAM.
        // The modelData function is from onnxModelAPI.tsx.
        const feeds = modelData({
          clicks,
          tensor,
          modelScale,
        });
        if (feeds === undefined) return;
        // Run the SAM ONNX model with the feeds returned from modelData()
        const results = await model.run(feeds);
        console.log("rrrrr",results,model.outputNames)
        const output = results[model.outputNames[0]] as any;
        const myimage = myImg as any
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d') as any;

        // 设置 Canvas 的尺寸为图像的尺寸
        canvas.width = myimage.width;
        canvas.height = myimage.height;
        context.drawImage(myimage, 0, 0);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;


        for (let i = 0; i < output.data.length; i++) {
          if (output.data[i] < 0.0) {
            pixels[4 * i + 3] = 0;
          }
        }

        // 将修改后的像素数据重新放回 Canvas
        context.putImageData(imageData, 0, 0);

        // 创建新的图像元素来显示裁剪后的图像
        const croppedImage = new Image();
        croppedImage.src = canvas.toDataURL();
        const selectedEleObj = {
          id: `${fileName?.split(".")[0]}-${new Date().getTime()}.png`,
          imgSrc: canvas.toDataURL(),
          timestamps: new Date().getTime()
        }

        selectedEleList.push(selectedEleObj)
        setSelectedEleList(selectedEleList)

        // 将裁剪后的图像添加到页面中
        // document.body.appendChild(croppedImage);

        // The predicted mask returned from the ONNX model is an array which is
        // rendered as an HTML image using onnxMaskToImage() from maskUtils.tsx.
        setMaskImg(onnxMaskToImage(output.data, output.dims[2], output.dims[3]));
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Run the ONNX model every time clicks has changed
  useEffect(() => {
    console.log('clicks change', clicks)
    runONNX();
  }, [clicks]);

  return (
    <div>
      {/* <span>Hello world222</span> */}
      <Stage />
    </div>
  )
}

export default StageWarpper
