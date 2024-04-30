// FILEPATH: /home/leolizc/dev/practice/projects/switch-match/tests/matcher.test.ts

import { SMMatcher } from '../src/matcher';

describe('SMMatcher', () => {
  it('should correctly match and return value for case', () => {
    const matcher = new SMMatcher('test', { autoBreak: true });
    matcher.case('test', () => 'matched');
    expect(matcher.value()).toBe('matched');
  });

  it('should correctly break after match if autoBreak is true', () => {
    const matcher = new SMMatcher('test', { autoBreak: true });
    matcher.case('test', () => 'matched');
    matcher.case('test', () => 'not matched');
    expect(matcher.value()).toBe('matched');
  });

  it('should not break after match if autoBreak is false', () => {
    const matcher = new SMMatcher('test', { autoBreak: false });
    matcher.case('test', () => 'matched');
    matcher.case('test', () => 'not matched');
    expect(matcher.value()).toBe('not matched');
  });

  it('should correctly use default handler if no case matched', () => {
    const matcher = new SMMatcher('test', { autoBreak: true });
    matcher.case('not test', () => 'not matched');
    matcher.default(() => 'default');
    expect(matcher.value()).toBe('default');
  });

  it('should correctly use default value if no case matched and no default handler', () => {
    const matcher = new SMMatcher('test', { autoBreak: true });
    matcher.case('not test', () => 'not matched');
    matcher.defaultTo('default');
    expect(matcher.value()).toBe('default');
  });

  it('should correctly break if break method is called', () => {
    const matcher = new SMMatcher('test', { autoBreak: false });
    matcher.case('test', () => 'matched');
    matcher.break();
    matcher.case('test', () => 'not matched');
    expect(matcher.value()).toBe('matched');
  });
});