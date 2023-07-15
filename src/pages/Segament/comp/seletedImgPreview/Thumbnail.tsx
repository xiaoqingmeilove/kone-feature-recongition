import React, { useContext } from "react";
import { CloseCircleOutlined } from '@ant-design/icons';
import { ThumbnailProps } from "@/utils/interfaces"
import AppContext from "../context/createContext";
import './thumbnail.less'

const Thumbnail = ({ imgSrc, idx }: ThumbnailProps) => {
    const {
        showPreviewModal: [, setShowPreviewModal],
        preivewImgSrc: [, setPreivewImgSrc],
        selectedEleList: [selectedEleList, setSelectedEleList]
    } = useContext(AppContext)!;

    const handleClick = () => {
        setShowPreviewModal(true)
        setPreivewImgSrc(imgSrc)
    }

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation()
        selectedEleList.splice(idx, 1)
        setSelectedEleList(selectedEleList)
        // TODO 调用删除交易
    }

    return (
        <div className="thumbnail-wrapper" onClick={handleClick}>
            <img src={imgSrc} />
            <CloseCircleOutlined className="close-icon" onClick={handleRemove} />
        </div>
    )
}

export default Thumbnail;
