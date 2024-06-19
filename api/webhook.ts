import { webhookCallback } from 'grammy';
import { bot } from '../src/bot';

export const config = {
  supportsResponseStreaming: true,
};

export default webhookCallback(bot, 'http');
