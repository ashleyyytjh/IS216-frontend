import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    _useIdToken?: boolean; 
  }
}