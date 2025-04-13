import { getChannel } from '../config/rabbitmq';
import { ProfileService } from '../services/profile.service';
import { v4 as uuid } from 'uuid';

// RPCObserver listens for messages on the specified RPC queue and processes them.
export const RPCObserver = async (
  RPC_QUEUE_NAME: string,
  service: ProfileService
) => {
  const channel = await getChannel();
  await channel.assertQueue(RPC_QUEUE_NAME, {
    durable: true,
  });
  channel.prefetch(1);
  channel.consume(
    RPC_QUEUE_NAME,
    async (msg: any) => {
      if (msg.content) {
        const payload = JSON.parse(msg.content.toString());
        console.log('Recived a Payload');
        console.log(payload);
        const response = await service.serveRPCRequest(payload);
        console.log('Got a response');
        console.log(response);
        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify(response)),
          {
            correlationId: msg.properties.correlationId,
          }
        );
        channel.ack(msg);
      }
    },
    {
      noAck: false,
    }
  );
};

// To send a request to the RPC server, you can use the following function:
// This function sends a request to the specified RPC queue and waits for a response.
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
  requestPayload: any
) => {
  const id = uuid(); // correlationId
  return await requestData(RPC_QUEUE_NAME, requestPayload, id);
};

// Uncomment the following code if you need to publish and consume messages from a queue
// /**
//  * Publishes a message to the specified queue.
//  * @param queue The name of the queue.
//  * @param message The message content as an object.
//  */
// export async function publishToQueue(
//   queue: string,
//   message: any
// ): Promise<void> {
//   const channel = await getChannel();
//   await channel.assertQueue(queue, { durable: true });

//   channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
//     persistent: true,
//   });
// }

// export async function consumeFromQueue(
//   queue: string,
//   callback: (msg: any) => Promise<void>
// ): Promise<void> {
//   const channel = await getChannel();

//   await channel.assertQueue(queue, { durable: true });

//   channel.consume(queue, async (msg) => {
//     if (msg) {
//       try {
//         const data = JSON.parse(msg.content.toString());
//         await callback(data);
//         channel.ack(msg);
//       } catch (error) {
//         console.error(`Error processing message from ${queue}:`, error);
//         channel.nack(msg, false, false); // discard the message on error
//       }
//     }
//   });
// }
