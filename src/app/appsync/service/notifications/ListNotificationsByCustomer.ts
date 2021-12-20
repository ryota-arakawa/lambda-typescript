
interface ListParams {
  customerId: string
}

export const ListNotificationsByCustomer = async (params: ListParams): Promise<any> => {
  return {items: [
      {
        ...params,
        notificationId: "2e8b086e-89d7-4d9a-b0fc-4f96f819ebea",
        created: "2019-01-24T02:28:10.161Z",
      },
    ], nextToken: undefined}
}
