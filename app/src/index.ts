import { Context } from "aws-lambda";

export const handler: any = async (
  event: any,
  context: Context
): Promise<any> => {
    let response;

    try {
        // const ret = await axios(url);
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'hello world',
                // location: ret.data.trim()
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
