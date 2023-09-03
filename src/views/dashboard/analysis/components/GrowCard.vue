<template>
  <div class="md:flex">
    <Card
      size="small"
      :loading="loading"
      :title="FireData.title"
      class="w-full !md:mt-0"
    >
      <div class="py-4 px-4 flex justify-between items-center">
        <CountTo
          prefix="$"
          :startVal="1"
          :endVal="FireData.value"
          class="text-2xl"
        />
        <Icon :icon="FireData.icon" :size="40" />
      </div>

      <div class="p-2 px-4 flex justify-between">
        <span class="text-2xl">{{ FireData.title }}</span>
        <CountTo
          prefix="$"
          :startVal="1"
          :endVal="FireData.total"
          class="text-2xl"
        />
        <!--        <a-button type="primary" @click="send"> 更改目标 </a-button>-->
      </div>
    </Card>
  </div>
</template>
<script lang="ts" setup>
import { CountTo } from "/@/components/CountTo/index";
import Icon from "@/components/Icon/Icon.vue";
import { Tag, Card } from "ant-design-vue";
import { onMounted, reactive } from "vue";
import { useMessage } from "@/hooks/web/useMessage";
import { useI18n } from "@/hooks/web/useI18n";
import { useDesign } from "@/hooks/web/useDesign";
import { useFamilyStore } from "@/store/modules/family";
import { useUserStore } from "@/store/modules/user";

const { prefixCls } = useDesign("login");
const { t } = useI18n();
const { createErrorModal } = useMessage();
const familyStore = useFamilyStore();
const userStore = useUserStore();

const FireData = reactive({
  title: "FIRE 目标",
  icon: "transaction|svg",
  value: 1000.0,
  total: 50000.0,
  color: "purple",
  action: "总",
});

defineProps({
  loading: {
    type: Boolean,
  },
});

onMounted(() => {
  fetchFireGoalData();
});

async function fetchFireGoalData() {
  try {
    const userInfo = userStore.getUserInfo;
    const token = userStore.getToken;
    // console.log(userInfo, token);
    const familyInfo = await familyStore.getFamilyInfo(
      userInfo.family_id,
      userInfo.id,
      token
    );
    if (familyInfo) {
      FireData.value = familyInfo.total_assets;
      FireData.total = familyInfo.fire_goal;
    }
  } catch (error) {
    createErrorModal({
      title: t("sys.api.errorTip"),
      content:
        (error as unknown as Error).message || t("sys.api.networkExceptionMsg"),
      getContainer: () =>
        document.body.querySelector(`.${prefixCls}`) || document.body,
    });
  }
}
</script>
