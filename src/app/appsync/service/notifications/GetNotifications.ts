
interface GetNotificationParams {
  customerId: string
  notificationId: string
}

export const GetNotifications = async (params: GetNotificationParams): Promise<any> => {
  return {...params}
}
