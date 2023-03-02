import { PingController } from './ping.controller';

describe('AppController (e2e)', () => {
  let pingController: PingController;

  beforeEach(async () => {
    pingController = new PingController();
  });

  it('Ping should return pong', () => {
    const response = pingController.ping();

    expect(response).toBe('pong');
  });
});
