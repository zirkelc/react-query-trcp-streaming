import type { ChatTransport, UIMessage, ChatRequestOptions } from "ai";
import type { UIMessageChunk } from "ai";
import { trpcClient } from "./trpc";

function convertAsyncIterableToStream<T>(iterable: AsyncIterable<T>): ReadableStream<T> {
  return new ReadableStream<T>({
    async start(controller) {
      try {
        for await (const chunk of iterable) {
          controller.enqueue(chunk);
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

export class TrpcChatTransport implements ChatTransport<UIMessage> {
  async sendMessages(
    options: {
      trigger: `submit-message` | `regenerate-message`;
      chatId: string;
      messageId: string | undefined;
      messages: Array<UIMessage>;
      abortSignal: AbortSignal | undefined;
    } & ChatRequestOptions,
  ): Promise<ReadableStream<UIMessageChunk>> {
    console.log(`[TrpcChatTransport] sendMessages chatId=${options.chatId}`);

    const { chatId, abortSignal } = options;
    const message = options.messages.at(-1);

    if (!message) {
      throw new Error(`No message to send`);
    }

    const response = await trpcClient.sendMessage.mutate(
      {
        chatId,
        message,
      },
      { signal: abortSignal },
    );

    return convertAsyncIterableToStream(response) as ReadableStream<UIMessageChunk>;
  }

  async reconnectToStream(
    options: {
      chatId: string;
    } & ChatRequestOptions,
  ): Promise<ReadableStream<UIMessageChunk> | null> {
    console.log(`[TrpcChatTransport] reconnectToStream chatId=${options.chatId}`);

    const { chatId } = options;
    const response = await trpcClient.resumeMessage.mutate({
      chatId,
    });

    return convertAsyncIterableToStream(response) as ReadableStream<UIMessageChunk>;
  }
}
