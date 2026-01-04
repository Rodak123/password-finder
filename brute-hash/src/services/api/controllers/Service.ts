import axios, { type AxiosRequestConfig, type AxiosResponse, type AxiosInstance } from 'axios';
import { ApiError } from './ApiError';

type ApiResponseType = 'data' | 'error';

interface ApiErrorData {
    message: string;
    cause: string;
}

interface ApiResponseData {
    type: ApiResponseType;
    data?: object;
    error?: ApiErrorData;
}

/**
 * Serves as the base class with elemental protocols
 */
export default class Service {
    private axiosInstance: AxiosInstance;
    protected baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
        this.axiosInstance = axios.create({
            baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    private checkResponse(response: AxiosResponse<ApiResponseData>): void {
        if (response.status !== 200)
            throw new ApiError(`Failed with code: ${response.status}`, response.status, 'request');

        if (response.data.type === 'error') {
            throw new ApiError(`Failed: ${response.data.error}`, response.status, 'request');
        }
    }

    // Axios request wrapper methods
    protected async GET<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<ApiResponseData> = await this.axiosInstance.get(url, config);
        this.checkResponse(response);
        return response.data.data as T;
    }

    protected async POST<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<ApiResponseData> = await this.axiosInstance.post(url, data, config);
        this.checkResponse(response);
        return response.data.data as T;
    }
}
