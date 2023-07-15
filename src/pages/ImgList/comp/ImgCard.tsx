import React from 'react';
import { request } from 'umi'
import { ImgCardProps } from '@/utils/interfaces'
import { Card, Image, Icon } from 'antd';
import { history } from '@umijs/max';
import './ImgCard.less'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

const { Meta } = Card;

const ImgCard = ({ imgItem, deleteHandler }: ImgCardProps) => {
  const { src, fileName, segamentCount } = imgItem
  const editHandler = async () => {
    await request('http://localhost:5000/api/generate-npy', {
      method: 'post',
      data: {
        fileName,
      },
    })
    history.push(`/imgSegament/${fileName}`)
  }
  // const deleteHandler = () => {}

  return (
    <Card
      className="img-card-warpper"
      title={fileName}
      style={{ width: '20%' }}
      bodyStyle={{ display: 'flex', 'flex-direction': 'column', 'justify-content': 'space-between' }}
      actions={[
        <EditOutlined key="edit" onClick={editHandler} />,
        <DeleteOutlined key="del" onClick={deleteHandler} />,
      ]}
    >
      <Image src={src} />
      <Meta title={`Segament: ${segamentCount}`} />
    </Card>
  )
}

export default ImgCard;
