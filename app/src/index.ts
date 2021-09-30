import { Context } from 'aws-lambda';
import { UserService } from './service';

export const handler: any = async (event: any, context: Context): Promise<any> => {
  let response;
  const userService = new UserService();

  try {
    // const ret = await axios(url);
    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: `hello world userService ${userService.test}`,
        // location: ret.data.trim()
      }),
    };
  } catch (err) {
    console.log(err);
    return err;
  }

  return response;
};
