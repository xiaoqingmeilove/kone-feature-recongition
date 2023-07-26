declare namespace API {
    type GetAllFiles = {
        data: Array<string>;
        success: boolean;
    };

    type GetAllFilesParams = {
        current?: number;
        pageSize?: number;
    };

    type GetAllFeatures = {
        data?: string;
    };

    type GetAllFeaturesParams = {
        id?: string;
    };

    type GenerateNpy = {
        data: string;
        success: boolean;
    };

    type GenerateNpyParams = {
        fileName?: string;
    };

    type UploadFeatureParams = {
        payload?: { name?: string; data?: string }[];
    };

    type UploadFeatureResult = {
        success?: string;
    };

    type DeleteFeatureParams = {
        ids?: string[];
    };
}