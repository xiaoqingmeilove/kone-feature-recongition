// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.
import React from "react";
import { PageContainer } from '@ant-design/pro-components';
import ContextProvider from './comp/context/context'
import { useParams } from 'umi';

import StageWarpper from "./StageWarpper";
// Define image, embedding and model paths

const Segament = () => {
  const params = useParams();

  return (
    <PageContainer>
      <ContextProvider>
        <StageWarpper fileName={params.id} />
      </ContextProvider>
    </PageContainer>
  )
};

export default Segament;
