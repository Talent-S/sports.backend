import config from '.';
import amqp, { Channel, Connection } from 'amqplib';

const RABBITMQ_URL = config.RABBITMQ_URL || 'amqp://localhost';

let connection: Connection | null = null;
let channel: Channel | null = null;

//  Connects to RabbitMQ and creates a channel.
export async function getChannel(): Promise<Channel> {
  if (channel) return channel;
  connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  return channel;
}
