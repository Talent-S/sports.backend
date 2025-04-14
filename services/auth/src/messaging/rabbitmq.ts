import { getChannel } from '../config/rabbitmq';
import { v4 as uuid } from 'uuid';
import { RPCPayloadTypes } from '../interfaces';
/**
 To send a request to the RPC server, you can use the following function:
 This function sends a request to the specified RPC queue and waits for a response.

 * @description RPC request to RabbitMQ
 * @param RPC_QUEUE_NAME - The name of the queue to send the request to
 * @param requestPayload - The payload to send in the request
 * @param uuid - The correlation ID for the request
 * @returns The response from the RabbitMQ server
 */
const requestData = async (
  RPC_QUEUE_NAME: string,
  requestPayload: any,
  uuid: string
) => {
  try {
    const channel = await getChannel();

    const q = await channel.assertQueue('', { exclusive: true });

    channel.sendToQueue(
      RPC_QUEUE_NAME,
      Buffer.from(JSON.stringify(requestPayload)),
      {
        replyTo: q.queue,
        correlationId: uuid,
      }
    );

    return new Promise((resolve, reject) => {
      // timeout n
      const timeout = setTimeout(() => {
        channel.close();
        resolve('API could not fullfil the request!');
      }, 8000);
      channel.consume(
        q.queue,
        (msg: any) => {
          if (msg.properties.correlationId == uuid) {
            resolve(JSON.parse(msg.content.toString()));
            clearTimeout(timeout);
          } else {
            reject('data Not found!');
          }
        },
        {
          noAck: true,
        }
      );
    });
  } catch (error) {
    console.log(error);
    return 'error';
  }
};

export const RPCRequest = async (
  RPC_QUEUE_NAME: string,
  requestPayload: {
    type: RPCPayloadTypes;
    data: any;
  }
) => {
  const id = uuid(); // correlationId
  return await requestData(RPC_QUEUE_NAME, requestPayload, id);
};
