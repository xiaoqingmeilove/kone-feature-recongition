import React, { useContext } from "react";
import { request } from 'umi'
import { CloseCircleOutlined } from '@ant-design/icons';
import { ThumbnailProps } from "@/utils/interfaces"
import AppContext from "../context/createContext";
import { DeleteFeature } from '@/services/apis'
import './thumbnail.less'

type IThumbnailProps = ThumbnailProps & { name: string }

const Thumbnail = ({ imgSrc, idx, name, from }: IThumbnailProps) => {
    const {
        showPreviewModal: [, setShowPreviewModal],
        preivewImgSrc: [, setPreivewImgSrc],
        selectedEleList: [selectedEleList, setSelectedEleList]
    } = useContext(AppContext)!;

    const handleClick = () => {
        setShowPreviewModal(true)
        setPreivewImgSrc(imgSrc)
    }

    const handleRemove = async (e: React.MouseEvent) => {
        e.stopPropagation()
        // await request('http://localhost:5000/api/delete-features', {
        //     method: 'delete',
        //     data: {
        //         ids: [name]
        //     },
        // })
        if (from === 'exist') {
            await DeleteFeature({ ids: [name] })
        }
        selectedEleList.splice(idx, 1)
        setSelectedEleList([...selectedEleList])
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
