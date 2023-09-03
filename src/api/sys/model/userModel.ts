/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  phone: string;
  password: string;
}

/**
 * @description: auth interface return value
 */
export interface AuthModel {
  family_id: string;
  id: string;
  name: string;
  avatar: string;
  token: string;
}

export interface VerifyCodeParams {
  phone: string;
}

export interface RegisterParams {
  phone: string;
  name: string;
  password: string;
  verify_code: string;
}
