import bunyan from 'bunyan';
import { UserService } from "./service";

const logger = bunyan.createLogger({name: "lambda"});

export const handler = async (event: any) => {
    console.log(event);
    logger.info(event);
}
