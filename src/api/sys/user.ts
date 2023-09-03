import { defHttp } from '/@/utils/http/axios';
import {LoginParams,AuthModel,VerifyCodeParams,RegisterParams} from './model/userModel';
import { ResponseModel } from './model/respModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Login = '/auth/sign_in',
  Logout = '/auth/sign_out',
  GetUserInfo = '/auth/me',
  VerifyCode = '/auth/verify_phone',
  Register = '/auth/sign_up',
}

export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<AuthModel>({url: Api.Login,params,},{errorMessageMode: mode});
}

export function getUserInfo(userID: string,token: string) {
  return defHttp.get<AuthModel>({ url: Api.GetUserInfo, headers:{
      'X-User-ID': userID,
      'X-Token': token,
    } }, { errorMessageMode: 'none' });
}

export function doLogout(userID: string,token: string) {
  return defHttp.post({ url: Api.Logout , headers:{
      'X-User-ID': userID,
      'X-Token': token,
    } });
}

export function verifyCode(params: VerifyCodeParams, mode: ErrorMessageMode) {
  return defHttp.post<ResponseModel>({ url: Api.VerifyCode, params }, { errorMessageMode: mode });
}

export function register(params: RegisterParams, mode: ErrorMessageMode) {
  return defHttp.post<AuthModel>({ url: Api.Register, params }, { errorMessageMode: mode });
}
