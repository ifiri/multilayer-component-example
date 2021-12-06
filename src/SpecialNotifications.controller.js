// @ts-check
import { VuexModule, Module, Action, Mutation } from 'vuex-class-modules';
import createController from '@/controllers/createController';
import { eventsService, notificationService } from '@/services';
import NotificationPayloadAdapter from '@/components/modules/Notificator/NotificationPayloadAdapter';
import { notificationsStore as notificationsStoreModule } from '@/store';
import { SPECIAL_EVENT } from '@/constants';

const SPECIAL_EVENTS = Object.values(SPECIAL_EVENT);

/**
 * @typedef {import('@/store/modules/NotificationsModule').default} NotificationsModule
 */

/**
 * @typedef {object} Notification
 * @property {string} id
 * @property {object} notificationData
 * @property {string} notificationData.text
 * @property {string} eventType
 */

@Module({ generateMutationSetters: true })
class SpecialNotificationsController extends VuexModule {
  /** @type {Notification[]} */
  queuedNotifications = [];

  /**
   * @param {import('vuex-class-modules').RegisterOptions} props
   * @param {object} modules
   * @param {NotificationsModule} [modules.notificationsStore]
   */
  constructor(props, { notificationsStore = notificationsStoreModule } = {}) {
    super(props);
    this.notificationsStore = notificationsStore;
  }

  /**
   * @return {Notification[]}
   */
  get notifications() {
    return this.queuedNotifications;
  }

  /**
   * @return {number}
   */
  get count() {
    return this.queuedNotifications.length;
  }

  @Action
  async init() {
    this.initializeEventSourceIterator();
  }

  @Action
  async initializeEventSourceIterator() {
    const iterator = await eventsService.getSpecialEventIterator(
      SPECIAL_EVENTS,
    );

    for await (const { eventType, payload: serverEventPayload } of iterator) {
      const adapter = NotificationPayloadAdapter.getAdapterByEvent(eventType);
      const notificationData = adapter.adapt(serverEventPayload);
      const timestamp = new Date().getTime();

      this.addNotification({
        id: `${timestamp}.${this.count}`,
        eventType,
        notificationData,
      });
    }
  }

  /**
   * @param {object} options
   * @param {string} options.actionType
   * @param {object} options.payload
   * @return {Promise<any>}
   */
  @Action
  async handleNotificationInteraction({ actionType, payload }) {
    await notificationService.handleNotificationInteraction({
      actionType,
      payload,
    });
  }

  /**
   * @param {Notification} notification
   */
  @Mutation
  addNotification(notification) {
    this.queuedNotifications.push(notification);
  }

  /**
   * @param {Notification} notification
   */
  @Mutation
  removeNotification(notification) {
    this.queuedNotifications = this.queuedNotifications.filter(
      element => element.id !== notification.id,
    );
  }
}

export default () => createController(SpecialNotificationsController);
