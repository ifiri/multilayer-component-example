<template>
  <div v-if="isNotificationsExists">
    <special-notification-layout
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
      @close="onClose"
    />
  </div>
</template>

<script>
import SpecialNotificationLayout from './modules/SpecialNotificationLayout';

export default {
  name: 'SpecialNotificationsView',

  props: {
    notifications: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    isNotificationsExists() {
      return !!this.notifications.length;
    },
  },

  methods: {
    onClose(notification) {
      this.$emit('close', notification);
    },
  },

  components: {
    SpecialNotificationLayout,
  },
};
</script>
