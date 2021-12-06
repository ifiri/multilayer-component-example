<template>
  <special-notifications :notifications="notifications" />
</template>

<script>
import SpecialNotifications from './SpecialNotifications.interactor';
import createSpecialNotificationsController from './SpecialNotifications.controller';

export default {
  name: 'SpecialNotificationsInterface',

  specialNotificationsController: createSpecialNotificationsController(),

  provide() {
    const { specialNotificationsController } = this.$options;

    return {
      gateway: {
        async initNotifications() {
          await specialNotificationsController.init();
        },

        removeNotification(notification) {
          specialNotificationsController.removeNotification(notification);
        },
      },
    };
  },

  computed: {
    notifications() {
      return this.$options.specialNotificationsController.notifications;
    },
  },

  components: {
    SpecialNotifications,
  },
};
</script>
