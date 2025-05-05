
import { useSessionService } from './sessionService';
import { createSessionService } from './sessionService';

const sessionService = createSessionService();

export {
  useSessionService,
  sessionService
};
