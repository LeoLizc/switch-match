import { SMMatcher } from '../src/matcher';

describe('SMMatcher', () => {

  describe('No Auto Break', () => {

    it('should correctly break after match if autoBreak is false if the match returns a Value', () => {
      const matcher = new SMMatcher('test', { autoBreak: false });
      matcher.case('test', () => 'matched');
      matcher.case('test', () => 'not matched');
      expect(matcher.value()).toBe('matched');
    });

    it('should not break after match if autoBreak is false if the match no returns a Value', () => {
      const matcher = new SMMatcher('test', { autoBreak: false });
      matcher.case('test', () => {'matched';});
      matcher.case('test', () => 'not matched');
      expect(matcher.value()).toBe('not matched');
    });

    it('should correctly break if break method is called', () => {
      const matcher = new SMMatcher('test', { autoBreak: false });
      matcher.case('test', () => {'matched'});
      matcher.case('test', () => 'also matched');
      matcher.break();
      matcher.case('test', () => 'not matched');
      expect(matcher.value()).toBe('also matched');
    });
  });

  describe('General', () => {

    it('should return undefined if no action is set', () => {
      const autoMatcher = new SMMatcher('test', { autoBreak: true });
      expect(autoMatcher.value()).toBeUndefined();

      const matcher = new SMMatcher('test', { autoBreak: false });
      expect(matcher.value()).toBeUndefined();
    });
    
    it('should return undefined if no case matched and no default', () => {
      const mockCase1 = jest.fn();
      const mockCase2 = jest.fn();
      
      const autoMatcher = new SMMatcher('test', { autoBreak: true });
      autoMatcher.case('not test', mockCase1);
      autoMatcher.case('not match', mockCase2);
      expect(autoMatcher.value()).toBeUndefined();
      expect(mockCase1).not.toHaveBeenCalled();
      expect(mockCase2).not.toHaveBeenCalled();

      mockCase1.mockClear();
      mockCase2.mockClear();

      const matcher = new SMMatcher('test', { autoBreak: false });
      matcher.case('not test', mockCase1);
      matcher.case('not match', mockCase2);
      expect(matcher.value()).toBeUndefined();
      expect(mockCase1).not.toHaveBeenCalled();
      expect(mockCase2).not.toHaveBeenCalled();
    });

    it('should return default value if no case matched and default value is set', () => {
      const autoMatcher = new SMMatcher('test', { autoBreak: true });
      autoMatcher.defaultTo('default');
      expect(autoMatcher.value()).toBe('default');
      autoMatcher.case('not test', () => 'not matched');
      autoMatcher.case('not Matched', () => 'not matched');
      expect(autoMatcher.value()).toBe('default');

      const matcher = new SMMatcher('test', { autoBreak: false });
      matcher.defaultTo('default');
      expect(matcher.value()).toBe('default');
      matcher.case('not test', () => 'not matched');
      matcher.case('not matched', () => 'not matched');
      expect(matcher.value()).toBe('default');
    });

    it('should execute default handler if no case matched and default handler is set', () => {
      const mockCase1 = jest.fn();
      const mockCase2 = jest.fn();
      const mockDefault = jest.fn();
      
      
      const autoMatcher = new SMMatcher('test', { autoBreak: true });
      autoMatcher.case('not test', mockCase1);
      autoMatcher.case('not Matched', mockCase2);
      autoMatcher.default(mockDefault);
      expect(autoMatcher.value()).toBeUndefined();
      expect(mockCase1).not.toHaveBeenCalled();
      expect(mockCase2).not.toHaveBeenCalled();
      expect(mockDefault).toHaveBeenCalled();

      mockCase1.mockClear();
      mockCase2.mockClear();
      mockDefault.mockClear();

      const matcher = new SMMatcher('test', { autoBreak: false });
      matcher.case('not test', mockCase1);
      matcher.case('not matched', mockCase2);
      matcher.default(mockDefault);
      expect(matcher.value()).toBeUndefined();
      expect(mockCase1).not.toHaveBeenCalled();
      expect(mockCase2).not.toHaveBeenCalled();
      expect(mockDefault).toHaveBeenCalled();
    });

    it('should correctly use default handler and default value if no case matched', () => {
      const autoMatcher = new SMMatcher('test', { autoBreak: true });
      autoMatcher.default(() => {'default'});
      autoMatcher.defaultTo('defaultValue');
      expect(autoMatcher.value()).toBe('defaultValue');

      const matcher = new SMMatcher('test', { autoBreak: false });
      matcher.default(() => {'default'});
      matcher.defaultTo('defaultValue');
      expect(matcher.value()).toBe('defaultValue');
    });

    it('should call the matchCase function when "match" is matched', () => {
      const matchCase = jest.fn();

      const autoMatcher = new SMMatcher('match', { autoBreak: true });
      autoMatcher.case('no match', ()=>{});
      autoMatcher.case('test', ()=>{});
      autoMatcher.case('match', matchCase);
      autoMatcher.case('no match2', ()=>{});
      autoMatcher.case('match', ()=>{});
      autoMatcher.case('test2', ()=>{});
      expect(autoMatcher.value()).toBeUndefined();
      expect(matchCase).toHaveBeenCalled();

      matchCase.mockClear();

      const matcher = new SMMatcher('match', { autoBreak: false });
      matcher.case('no match', ()=>{});
      matcher.case('test', ()=>{});
      matcher.case('match', matchCase);
      matcher.case('no match2', ()=>{});
      matcher.case('match', ()=>{});
      matcher.case('test2', ()=>{});
      expect(matcher.value()).toBeUndefined();
      expect(matchCase).toHaveBeenCalled();
    });

    it('should not execute previous case handlers if "match" is matched', () => {
      const noMatchCase1 = jest.fn();
      const noMatchCase2 = jest.fn();
      const matchCase = jest.fn();

      const autoMatcher = new SMMatcher('match', { autoBreak: true });
      autoMatcher.case('no match', noMatchCase1);
      autoMatcher.case('test', noMatchCase2);
      autoMatcher.case('match', matchCase);
      autoMatcher.case('no match2', ()=>{});
      autoMatcher.case('match', ()=>{});
      expect(autoMatcher.value()).toBeUndefined();
      expect(noMatchCase1).not.toHaveBeenCalled();
      expect(noMatchCase2).not.toHaveBeenCalled();
      expect(matchCase).toHaveBeenCalled();

      noMatchCase1.mockClear();
      noMatchCase2.mockClear();
      matchCase.mockClear();

      const matcher = new SMMatcher('match', { autoBreak: false });
      matcher.case('no match', noMatchCase1);
      matcher.case('test', noMatchCase2);
      matcher.case('match', matchCase);
      matcher.case('no match2', ()=>{});
      matcher.case('match', ()=>{});
      expect(matcher.value()).toBeUndefined();
      expect(noMatchCase1).not.toHaveBeenCalled();
      expect(noMatchCase2).not.toHaveBeenCalled();
    });

    it('should correctly match and return value for case', () => {
      const autoMatcher = new SMMatcher('test', { autoBreak: true });
      autoMatcher.case('test', () => 'matched');
      expect(autoMatcher.value()).toBe('matched');

      const matcher = new SMMatcher('test', { autoBreak: false });
      matcher.case('test', () => 'matched');
      expect(matcher.value()).toBe('matched');
    });

    it('should not execute next case handlers if match case returns a value', () => {
      const matchCase = jest.fn(() => 'matched');
      const noMatchCase = jest.fn();

      const autoMatcher = new SMMatcher('test', { autoBreak: true });
      autoMatcher.case('test', matchCase);
      autoMatcher.case('test', noMatchCase);
      expect(autoMatcher.value()).toBe('matched');
      expect(matchCase).toHaveBeenCalled();
      expect(noMatchCase).not.toHaveBeenCalled();

      matchCase.mockClear();
      noMatchCase.mockClear();

      const matcher = new SMMatcher('test', { autoBreak: false });
      matcher.case('test', matchCase);
      matcher.case('test', noMatchCase);
      expect(matcher.value()).toBe('matched');
      expect(matchCase).toHaveBeenCalled();
      expect(noMatchCase).not.toHaveBeenCalled();
    });

    it('should correctly match and return value for case with multiple values', () => {
      const autoMatcher = new SMMatcher('test', { autoBreak: true });
      autoMatcher.case('test', () => ['matched', 'also matched']);
      expect(autoMatcher.value()).toEqual(['matched', 'also matched']);

      const matcher = new SMMatcher('test', { autoBreak: false });
      matcher.case('test', () => ['matched', 'also matched']);
      expect(matcher.value()).toEqual(['matched', 'also matched']);
    });
    
    it('should match default case until a match case returns a non-undefined value', () => {
      const matchDefault = jest.fn(() => 'default');
      const matchCase = jest.fn(() => 'matched');

      const autoMatcher = new SMMatcher('test', { autoBreak: true });
      autoMatcher.default(matchDefault);
      expect(autoMatcher.value()).toBe('default');
      autoMatcher.case('test', matchCase);
      expect(autoMatcher.value()).toBe('matched');
      expect(matchDefault).toHaveBeenCalled();
      expect(matchCase).toHaveBeenCalled();

      matchDefault.mockClear();
      matchCase.mockClear();

      const matcher = new SMMatcher('test', { autoBreak: false });
      matcher.default(matchDefault);
      expect(matcher.value()).toBe('default');
      matcher.case('test', matchCase);
      expect(matcher.value()).toBe('matched');
      expect(matchDefault).toHaveBeenCalled();
      expect(matchCase).toHaveBeenCalled();
    });
    
    it('should match default case if no match case', () => {
      const matchCase = jest.fn(() => 'not matched');
      const matchDefault = jest.fn(() => 'default');

      const autoMatcher = new SMMatcher('test', { autoBreak: true });
      autoMatcher.case('not test', matchCase);
      expect(autoMatcher.value()).toBeUndefined();
      expect(matchCase).not.toHaveBeenCalled();
      autoMatcher.default(matchDefault);
      expect(autoMatcher.value()).toBe('default');
      expect(matchDefault).toHaveBeenCalled();

      matchCase.mockClear();
      matchDefault.mockClear();

      const matcher = new SMMatcher('test', { autoBreak: false });
      matcher.case('not test', matchCase);
      expect(matcher.value()).toBeUndefined();
      expect(matchCase).not.toHaveBeenCalled();
      matcher.default(matchDefault);
      expect(matcher.value()).toBe('default');
      expect(matchDefault).toHaveBeenCalled();
    });
    
    it('should execute the next clauses the correct way: case, default, defaultTo', () => {
      const matchDefault1 = jest.fn(() => {'default 1'});
      const matchDefaultTo1 = 'defaultTo 1';
      const matchDefault2 = jest.fn(() => 'default 2');
      const matchCase1 = jest.fn(() => {'matched 1'});
      const noMatchCase1 = jest.fn(() => 'not matched 1');
      const matchCase2 = jest.fn(() => 'matched 2');
      const noMatchCase2 = jest.fn(() => {'not matched 2'});
      const matchDefault3 = jest.fn(() => 'default 3');
      const matchDefaultTo2 = 'defaultTo 2';

      const autoMatcher = new SMMatcher('test', { autoBreak: true });
      autoMatcher.default(matchDefault1);
      expect(autoMatcher.value()).toBeUndefined();
      expect(matchDefault1).toHaveBeenCalled();
      autoMatcher.defaultTo(matchDefaultTo1);
      expect(autoMatcher.value()).toBe(matchDefaultTo1);
      autoMatcher.default(matchDefault2);
      expect(autoMatcher.value()).toBe('default 2');
      expect(matchDefault2).toHaveBeenCalled();
      autoMatcher.case('test', matchCase1);
      expect(autoMatcher.value()).toBe(matchDefaultTo1);
      expect(matchCase1).toHaveBeenCalled();
      autoMatcher.case('not test', noMatchCase1);
      expect(autoMatcher.value()).toBe(matchDefaultTo1);
      expect(noMatchCase1).not.toHaveBeenCalled();
      autoMatcher.case('test', matchCase2);
      expect(autoMatcher.value()).toBe(matchDefaultTo1);
      expect(matchCase2).not.toHaveBeenCalled();
      autoMatcher.case('not test', noMatchCase2);
      expect(autoMatcher.value()).toBe(matchDefaultTo1);
      expect(noMatchCase2).not.toHaveBeenCalled();
      autoMatcher.default(matchDefault3);
      expect(autoMatcher.value()).toBe(matchDefaultTo1);
      expect(matchDefault3).not.toHaveBeenCalled();
      autoMatcher.defaultTo(matchDefaultTo2);
      expect(autoMatcher.value()).toBe(matchDefaultTo2);

      matchDefault1.mockClear();
      matchDefault2.mockClear();
      matchCase1.mockClear();
      noMatchCase1.mockClear();
      matchCase2.mockClear();
      noMatchCase2.mockClear();
      matchDefault3.mockClear();

      const matcher = new SMMatcher('test', { autoBreak: false });
      matcher.default(matchDefault1);
      expect(matcher.value()).toBeUndefined();
      expect(matchDefault1).toHaveBeenCalled();
      matcher.defaultTo(matchDefaultTo1);
      expect(matcher.value()).toBe(matchDefaultTo1);
      matcher.default(matchDefault2);
      expect(matcher.value()).toBe('default 2');
      expect(matchDefault2).toHaveBeenCalled();
      matcher.case('test', matchCase1);
      expect(matcher.value()).toBe(matchDefaultTo1);
      expect(matchCase1).toHaveBeenCalled();
      matcher.case('not test', noMatchCase1);
      expect(matcher.value()).toBe('not matched 1');
      expect(noMatchCase1).toHaveBeenCalled();
      matcher.case('test', matchCase2);
      expect(matcher.value()).toBe('not matched 1');
      expect(matchCase2).not.toHaveBeenCalled();
      matcher.case('not test', noMatchCase2);
      expect(matcher.value()).toBe('not matched 1');
      expect(noMatchCase2).not.toHaveBeenCalled();
      matcher.default(matchDefault3);
      expect(matcher.value()).toBe('not matched 1');
      expect(matchDefault3).not.toHaveBeenCalled();
      matcher.defaultTo(matchDefaultTo2);
      expect(matcher.value()).toBe('not matched 1');
    });
    
    it('should execute the next clauses the correct way: case, default, defaultTo, break', () => {
      const matchDefault1 = jest.fn(() => {'default 1'});
      const matchDefaultTo1 = 'defaultTo 1';
      const matchDefault2 = jest.fn(() => 'default 2');
      const matchCase1 = jest.fn(() => {'matched 1'});
      const noMatchCase1 = jest.fn(() => 'not matched 1');
      const matchCase2 = jest.fn(() => 'matched 2');
      const noMatchCase2 = jest.fn(() => {'not matched 2'});
      const matchDefault3 = jest.fn(() => 'default 3');
      const matchDefaultTo2 = 'defaultTo 2';

      const autoMatcher = new SMMatcher('test', { autoBreak: true });
      autoMatcher.break();
      autoMatcher.default(matchDefault1);
      autoMatcher.break();
      expect(autoMatcher.value()).toBeUndefined();
      expect(matchDefault1).toHaveBeenCalled();
      autoMatcher.defaultTo(matchDefaultTo1);
      autoMatcher.break();
      expect(autoMatcher.value()).toBe(matchDefaultTo1);
      autoMatcher.default(matchDefault2);
      autoMatcher.break();
      expect(autoMatcher.value()).toBe('default 2');
      expect(matchDefault2).toHaveBeenCalled();
      autoMatcher.case('test', matchCase1);
      autoMatcher.break();
      expect(autoMatcher.value()).toBe(matchDefaultTo1);
      expect(matchCase1).toHaveBeenCalled();
      autoMatcher.case('not test', noMatchCase1);
      autoMatcher.break();
      expect(autoMatcher.value()).toBe(matchDefaultTo1);
      expect(noMatchCase1).not.toHaveBeenCalled();
      autoMatcher.case('test', matchCase2);
      autoMatcher.break();
      expect(autoMatcher.value()).toBe(matchDefaultTo1);
      expect(matchCase2).not.toHaveBeenCalled();
      autoMatcher.case('not test', noMatchCase2);
      autoMatcher.break();
      expect(autoMatcher.value()).toBe(matchDefaultTo1);
      expect(noMatchCase2).not.toHaveBeenCalled();
      autoMatcher.default(matchDefault3);
      autoMatcher.break();
      expect(autoMatcher.value()).toBe(matchDefaultTo1);
      expect(matchDefault3).not.toHaveBeenCalled();
      autoMatcher.defaultTo(matchDefaultTo2);
      autoMatcher.break();
      expect(autoMatcher.value()).toBe(matchDefaultTo2);

      matchDefault1.mockClear();
      matchDefault2.mockClear();
      matchCase1.mockClear();
      noMatchCase1.mockClear();
      matchCase2.mockClear();
      noMatchCase2.mockClear();
      matchDefault3.mockClear();

      const matcher = new SMMatcher('test', { autoBreak: false });
      matcher.break();
      matcher.default(matchDefault1);
      matcher.break();
      expect(matcher.value()).toBeUndefined();
      expect(matchDefault1).toHaveBeenCalled();
      matcher.defaultTo(matchDefaultTo1);
      matcher.break();
      expect(matcher.value()).toBe(matchDefaultTo1);
      matcher.default(matchDefault2);
      matcher.break();
      expect(matcher.value()).toBe('default 2');
      expect(matchDefault2).toHaveBeenCalled();
      matcher.case('test', matchCase1);
      matcher.break();
      expect(matcher.value()).toBe(matchDefaultTo1);
      expect(matchCase1).toHaveBeenCalled();
      matcher.case('not test', noMatchCase1);
      matcher.break();
      expect(matcher.value()).toBe(matchDefaultTo1);
      expect(noMatchCase1).not.toHaveBeenCalled();
      matcher.case('test', matchCase2);
      matcher.break();
      expect(matcher.value()).toBe(matchDefaultTo1);
      expect(matchCase2).not.toHaveBeenCalled();
      matcher.case('not test', noMatchCase2);
      matcher.break();
      expect(matcher.value()).toBe(matchDefaultTo1);
      expect(noMatchCase2).not.toHaveBeenCalled();
      matcher.default(matchDefault3);
      matcher.break();
      expect(matcher.value()).toBe(matchDefaultTo1);
      expect(matchDefault3).not.toHaveBeenCalled();
      matcher.defaultTo(matchDefaultTo2);
      matcher.break();
      expect(matcher.value()).toBe(matchDefaultTo2);
    });

    it('should return the value if value is passed instead of a function', () => {
      const autoMatcher = new SMMatcher('test', { autoBreak: true });
      autoMatcher.default('default');
      expect(autoMatcher.value()).toBe('default');
      autoMatcher.case('test', 'matched');
      expect(autoMatcher.value()).toBe('matched');

      const matcher = new SMMatcher('test', { autoBreak: false });
      matcher.default('default');
      expect(matcher.value()).toBe('default');
      matcher.case('test', 'matched');
      expect(matcher.value()).toBe('matched');
    });

    it('should return the value if value is an object', () => {
      const autoMatcher = new SMMatcher('test', { autoBreak: true });
      autoMatcher.default(() => ([{ value: 'default' }]));
      expect(autoMatcher.value()).toEqual([{ value: 'default' }]);
      autoMatcher.case('test', () => ({ value: 'matched' }));
      expect(autoMatcher.value()).toEqual({ value: 'matched' });

      const matcher = new SMMatcher('test', { autoBreak: false });
      matcher.default(() => ([{ value: 'default' }]));
      expect(matcher.value()).toEqual([{ value: 'default' }]);
      matcher.case('test', () => ({ value: 'matched' }));
      expect(matcher.value()).toEqual({ value: 'matched' });
    });
  });

  describe('Auto Break', () => {
  
    it('should correctly break after match if autoBreak is true', () => {
      const matcher = new SMMatcher('test', { autoBreak: true });
      matcher.case('test', () => 'matched');
      matcher.case('test', () => 'not matched');
      expect(matcher.value()).toBe('matched');
    });
  
  });
});