import { assoc, curryN } from "ramda";
import { AmqpMessage, AmqpParsedMessage } from "@type/interface";

/**
 * Converts a value to JSON
 * @param v Value to convert
 */
// eslint-disable-next-line consistent-return
function toJSON(v?: Buffer | string): object | undefined {
  // eslint-disable-next-line default-case
  switch (typeof v) {
    case "string": return JSON.parse(v);
    default:
      if (v instanceof Buffer) return JSON.parse(v.toString());
      return undefined;
  }
}

/**
 * Parses the AMQP message to use as object inside the consumers
 * @param msg AMQP Message to parse the content to JSON
 */
/* eslint-disable no-unused-vars*/
export const parseMessage: (<T>(...a: readonly any[]) => any) = curryN(
  1,
  <T extends object>(msg: AmqpMessage): AmqpParsedMessage<T> => {
    return assoc<T, AmqpMessage, "content">(
      "content",
      toJSON(msg.content) as T,
      msg,
    );
  },
);
