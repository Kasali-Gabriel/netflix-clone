import { GqlLocalAuthGuard } from './local-auth.guard';

describe('LocalAuthGuard', () => {
  it('should be defined', () => {
    expect(new GqlLocalAuthGuard()).toBeDefined();
  });
});
