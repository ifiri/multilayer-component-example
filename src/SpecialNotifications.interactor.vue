<template>
  <special-notifications
    :notifications="notifications"
    @close="onClose"
  />
</template>

<script>
import SpecialNotifications from './SpecialNotifications.view';

export default {
  name: 'SpecialNotificationsInteractor',

  inject: ['gateway'],

  props: {
    notifications: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    onClose(notification) {
      this.gateway.removeNotification(notification);
    },
  },

  mounted() {
    this.gateway.initNotifications();
  },

  components: {
    SpecialNotifications,
  },
};
</script>
