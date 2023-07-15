import React from 'react';
import { ConfirmModalProps } from '@/utils/interfaces'
import { Modal } from 'antd'

const ConfirmModal = ({
  title = 'Tips: ',
  content,
  showModal,
  handleOk,
  handleCancel
} : ConfirmModalProps) => {
  return (
    <Modal
      title={title}
      visible={showModal}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p>{content}</p>
    </Modal>
  )
}

export default ConfirmModal
