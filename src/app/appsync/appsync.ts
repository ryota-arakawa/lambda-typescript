import bunyan from "bunyan"
import { GetNotifications, ListNotificationsByCustomer } from "./service/notifications";
import { ListUsers } from "./service/users";

const logger = bunyan.createLogger({
  name: "appsync",
})

interface HandlerEvent {
  identity: any
  arguments: any
  field: string
}

export const handler = (event: HandlerEvent) => {

  logger.info(event)
  logger.info(`event.field: `)
  logger.info(event.field)

  switch (event.field) {
    case "getNotification":
      return GetNotifications(event.arguments)
    case "listNotificationByCustomer":
      return ListNotificationsByCustomer(event.arguments)
    case "listUsers":
      return ListUsers()
    case "saveNotification":
      return event
    default:
      console.log(`no filed name case`);
      return Promise.reject(`unknown operation: ${event.field}`)
  }
}

