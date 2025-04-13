export enum RPCPayloadTypes {
  NEW_USER = 'NEW_USER',
}
export enum RabbitMQQueues {
  USER_QUEUE = 'USER_QUEUE',
}
export type ProfileServiceRPCPayload = {
  type: RPCPayloadTypes;
  data: any;
};
