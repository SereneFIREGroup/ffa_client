<template>
  <Button v-bind="$attrs" :disabled="isStart" @click="handleStart" :loading="loading">
    {{ getButtonText }}
  </Button>
</template>

<script lang="ts">
  import { defineComponent, ref, watchEffect, computed, unref } from 'vue';
  import { Button } from 'ant-design-vue';
  import { useCountdown } from './useCountdown';
  import { isFunction } from '/@/utils/is';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';

  const { notification } = useMessage();
  const userStore = useUserStore();

  const props = {
    value: { type: [Object, Number, String, Array] },
    count: { type: Number, default: 10 },
    phone: { type: String, default: '' },
    beforeStartFunc: {
      type: Function as PropType<() => Promise<boolean>>,
      default: null,
    },
  };

  export default defineComponent({
    name: 'CountButton',
    components: { Button },
    props,
    setup(props) {
      const loading = ref(false);

      const { currentCount, isStart, start, reset } = useCountdown(props.count);
      const { t } = useI18n();

      const getButtonText = computed(() => {
        return !unref(isStart)
          ? t('component.countdown.normalText')
          : t('component.countdown.sendText', [unref(currentCount)]);
      });

      watchEffect(() => {
        props.value === undefined && reset();
      });

      /**
       * @description: 判断是否有外部函数，并且在执行完外部函数后决定是否开始倒计时
       */
      async function handleStart() {
        const { beforeStartFunc } = props;
        console.log('phone:', '+86' + props.phone);
        try {
          loading.value = true;
          // TODO 这里需要捕获错误
          const data = await userStore.verifyPhone({
            phone: '+86' + props.phone,
            mode: 'modal',
          });
          console.log('verifyPhone.data:', data);
          notification.success({
            message: t('sys.login.sendSuccessTitle'),
            duration: 3,
          });

          if (beforeStartFunc && isFunction(beforeStartFunc)) {
            loading.value = true;
            try {
              const canStart = await beforeStartFunc();
              canStart && start();
            } finally {
              loading.value = false;
            }
          } else {
            start();
          }
        } catch (error) {
          console.log(error);
        } finally {
          loading.value = false;
        }
      }

      return { handleStart, currentCount, loading, getButtonText, isStart };
    },
  });
</script>
