import React, { useState, useEffect, useCallback } from 'react';
import { request } from 'umi'
import { PageContainer } from '@ant-design/pro-components';
import { imgItem } from '@/utils/interfaces'
import { Spin } from 'antd';
import { getAllFiles } from '@/services/apis'
import ImgCard from './comp/ImgCard'
import ConfirmModal from '@/components/ConfirmModal';
import { WEB_SERVE } from '@/utils/constants';
import "./index.less";

const ImgList: React.FC = () => {
  const [imgList, setImgList] = useState<Array<imgItem>>([]);
  const [loading, setLoading] = useState<boolean>(true)
  const [current, setCurrent] = useState<number>(0)
  const initImgList = async () => {
    setLoading(true)
    // const result = await request('http://localhost:5000/api/get-all-files', {
    //   method: 'get'
    // })
    try {
      const result = await getAllFiles({current, pageSize: 10});
      console.log('调试 ---- ', result);
      console.log('result', result.data)
      setCurrent(current + 1)
      const imgList = result.data.map((item:string) => {
        return {
          src: `${WEB_SERVE}/${item}`,
          fileName: item.split("/")[1],
          segamentCount: 0
        }
      })
      setImgList(imgList)
      setLoading(false)
    } catch (e) {
      console.log('e !!!! --- ', e )
      setLoading(false)
    }
  }

  useEffect(() => {
    initImgList()
  }, [])

  const MODAL_TITLE = '确认删除'
  const MODAL_CONTENT = '确认要删除此文件？'



  const [showModal, setShowModal] = useState<boolean>(false)

  const deleteConfirm = () => {
    setShowModal(true)
  }


  const deleteHandler = () => {
    // TODO 删除数据
    setShowModal(false)
  }

  const cancelDelete = () => {
    // TODO 删除数据
    setShowModal(false)
  }

  return (
    <PageContainer>
      {
        loading &&
        <Spin tip="Loading..." size="large" className='page-loading' />
      }
      <div className='img-list-wrapper'>
        {
          imgList.length > 0 && imgList.map(ele =>
            <ImgCard
              key={ele.fileName}
              imgItem={ele}
              deleteHandler={deleteConfirm}
            />
          )
        }
      </div>
      <ConfirmModal
        title={MODAL_TITLE}
        content={MODAL_CONTENT}
        showModal={showModal}
        handleOk={deleteHandler}
        handleCancel={cancelDelete}
      />
    </PageContainer>
  );
};

export default ImgList;
