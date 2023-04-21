import { logEvents } from './log-events';

describe('logEvents', () => {
  it('should work', () => {
    expect(logEvents()).toEqual('log-events');
  });
});
