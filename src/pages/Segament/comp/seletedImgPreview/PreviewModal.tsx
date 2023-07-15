import React, { useContext } from "react";
import { Modal } from 'antd';
import AppContext from "../context/createContext";

const PreviewModal = () => {
    const {
        showPreviewModal: [showPreviewModal, setShowPreviewModal],
        preivewImgSrc: [preivewImgSrc]
    } = useContext(AppContext)!;

    const handleCancel = () => {
        setShowPreviewModal(false)
    }

    return (
        <Modal title="Basic Modal" open={showPreviewModal} footer={null} onCancel={handleCancel}>
            <img src={preivewImgSrc} />
        </Modal>
    )
}

export default PreviewModal;
