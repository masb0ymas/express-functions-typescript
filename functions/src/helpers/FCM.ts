import * as admin from 'firebase-admin'

require('dotenv').config()

interface sendToDevicesProps {
  deviceTokens: string[]
  message: string
  type: string
  data: string
}

interface sendToMessageProps {
  message: string
  type: string
  data: string
}

const { APP_NAME } = process.env

class FCMHelper {
  /**
   *
   * @param props
   */
  public static async sendToDevices(props: sendToDevicesProps) {
    const message = {
      tokens: props.deviceTokens,
      notification: {
        title: APP_NAME,
        body: props.message,
      },
      data: {
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
        type: props.type,
        data: props.data,
      },
    }

    const data = await admin.messaging().sendMulticast(message)

    return data
  }

  /**
   *
   * @param props
   */
  public static async sendToAll(props: sendToMessageProps) {
    const message = {
      topic: 'all',
      notification: {
        title: APP_NAME,
        body: props.message,
      },
      data: {
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
        type: props.type,
        data: props.data,
      },

      // condition: "'all' in topics || 'forum' in topics || 'event' in topics || 'course' in topics || 'module' in topics",
    }

    const data = await admin.messaging().send(message)

    return data
  }
}

export default FCMHelper
