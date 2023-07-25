import type { UserInfo } from "/#/store";
import type { ErrorMessageMode } from "/#/axios";
import { defineStore } from "pinia";
import { store } from "/@/store";
import { PageEnum } from "/@/enums/pageEnum";
import { TOKEN_KEY, USER_ID_KEY, USER_INFO_KEY } from "/@/enums/cacheEnum";
import { getAuthCache, setAuthCache } from "/@/utils/auth";
import {AuthModel,LoginParams,RegisterParams,VerifyCodeParams} from "/@/api/sys/model/userModel";
import { ResponseModel } from "/@/api/sys/model/respModel";
import { doLogout, getUserInfo, loginApi, register, verifyCode } from "/@/api/sys/user";
import { useI18n } from "/@/hooks/web/useI18n";
import { useMessage } from "/@/hooks/web/useMessage";
import { router } from "/@/router";
import { h } from "vue";

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(state): UserInfo {
      return state.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(state): string {
      return state.token || getAuthCache<string>(TOKEN_KEY);
    },
    getUserID(state): string {
      return state.userInfo?.uuid || getAuthCache<string>(USER_ID_KEY);
    },
    getSessionTimeout(state): boolean {
      return !!state.sessionTimeout;
    },
    getLastUpdateTime(state): number {
      return state.lastUpdateTime;
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setUserID() {
      setAuthCache(USER_ID_KEY, this.userInfo.uuid);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<AuthModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const data = await loginApi(loginParams, mode);
        const { token } = data;

        // save token
        this.setToken(token);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<AuthModel | null> {
      if (!this.getToken) return null;
      // get user info
      const userInfo = await this.getUserInfoAction();

      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
      }
      return userInfo;
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      const userInfo = await getUserInfo();
      this.setUserInfo(userInfo);
      return userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await doLogout();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },
    /**
     * @description: verifyPhone Code
     */
    async verifyPhone(
      params: VerifyCodeParams & {
        mode?: ErrorMessageMode;
      },
    ): Promise<ResponseModel | null> {
      try {
        const { mode } = params;
        return await verifyCode(params, mode);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /**
     * @description: register
     */
    async register(
      params: RegisterParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      }
    ): Promise<AuthModel | null> {
      try {
        const { goHome = true, mode, ...registerParams } = params;
        const data = await register(registerParams, mode);
        const { token } = data;

        // save token
        this.setUserInfo(data)
        this.setToken(token);
        this.setUserID();
        return this.afterLoginAction(goHome); // TODO 这里有问题，先不管
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
