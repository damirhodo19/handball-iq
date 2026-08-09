export interface LocalizedMessage {
  key: string;
  params?: Record<string, string | number>;
}

export type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

export function msg(key: string, params?: Record<string, string | number>): LocalizedMessage {
  return params ? { key, params } : { key };
}

export function renderMessage(t: TranslateFn, message: LocalizedMessage): string {
  return message.params ? t(message.key, message.params) : t(message.key);
}

export function renderMessages(t: TranslateFn, messages: LocalizedMessage[]): string {
  return messages.map((m) => renderMessage(t, m)).join(' ');
}
