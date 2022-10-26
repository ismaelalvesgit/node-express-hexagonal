import { applyHandlers, FuncHandler } from "./handlers";
import { Logger } from "@util/logger";
import {
  AmqpChannel,
  AmqpMessage,
  AmqpMessageHandler,
  AmqpOnConsumeFunction,
  FinisherFunction,
} from "@type/interface";

export const onConsume: AmqpOnConsumeFunction = (
  channel: AmqpChannel,
  finisher: FinisherFunction,
  ...msgHandlers: FuncHandler[]
) => {
  return async (message: AmqpMessage | null): Promise<void> => {
    let error = null;

    try {
      const handle = applyHandlers(msgHandlers) as AmqpMessageHandler;
      await handle(message);
    } catch (err:any) {
      error = err;
      Logger.error({ error }, "consume_message_failed");
    } finally {
      finisher(channel, message!, error);
    }
  };
};
