import type { FamilyInfo } from "/#/store";
import { defineStore } from "pinia";
import { store } from "/@/store";
import { FamilyModel } from "@/api/sys/model/familyModel";
import { getFamilyInfo } from "@/api/sys/family";

interface FamilyState {
  familyInfo: Nullable<FamilyInfo>;
  lastUpdateTime: number;
}

export const useFamilyStore = defineStore({
  id: "app-family",
  state: (): FamilyState => ({
    // user info
    familyInfo: null,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getFamilyInfoState(state): FamilyInfo {
      return state.familyInfo || null;
    },
    getLastUpdateTime(state): number {
      return state.lastUpdateTime;
    },
  },
  actions: {
    setFamilyInfo(info: FamilyInfo | null) {
      this.familyInfo = info;
      this.lastUpdateTime = new Date().getTime();
    },
    resetState() {
      this.familyInfo = null;
    },
    /**
     * @description: login
     */
    async getFamilyInfo(
      family_id: string,
      id: string,
      token: string
    ): Promise<FamilyModel | null> {
      try {
        console.log(family_id, id, token);
        const data = await getFamilyInfo(family_id, id, token);
        this.setFamilyInfo(data);
        return data;
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
});

// Need to be used outside the setup
export function useFamilyStoreWithOut() {
  return useFamilyStore(store);
}
