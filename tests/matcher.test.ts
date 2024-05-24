import { SMMatcher } from '../src/matcher';

describe('SMMatcher', () => {

  describe('No Auto Break', () => {

    it('should correctly break after match if autoBreak is false if the match returns a Value', () => {
      const matcher = new SMMatcher('test', { autoBreak: false });
      matcher.case('test', () => 'matched');
      matcher.case('test', () => 'not matched');
      expect(matcher.value).toBe('matched');
    });

    it('should not break after match if autoBreak is false if the match no returns a Value', () => {
      const matcher = new SMMatcher('test', { autoBreak: false });
      matcher.case('test', () => {'matched';});
      matcher.case('test', () => 'not matched');
      expect(matcher.value).toBe('not matched');
    });

    it('should correctly break if break method is called', () => {
      const matcher = new SMMatcher('test', { autoBreak: false });
      matcher.case('test', () => {'matched'});
      matcher.case('test', () => 'also matched');
      matcher.break();
      matcher.case('test', () => 'not matched');
      expect(matcher.value).toBe('also matched');
    });
  });

  describe('General', () => {

    it('should return undefined if no action is set', () => {
      const autoMatcher = new SMMatcher('test', { autoBreak: true });
      expect(autoMatcher.value).toBeUndefined();

      const matcher = new SMMatcher('test', { autoBreak: false });
      expect(matcher.value).toBeUndefined();
    });
    
    it('should return undefined if no case matched and no default', () => {
      const mockCase1 = jest.fn();
      const mockCase2 = jest.fn();
      
      const autoMatcher = new SMMatcher('test', { autoBreak: true });
      autoMatcher.case('not test', mockCase1);
      autoMatcher.case('not match', mockCase2);
      expect(autoMatcher.value).toBeUndefined();
      expect(mockCase1).not.toHaveBeenCalled();
      expect(mockCase2).not.toHaveBeenCalled();

      mockCase1.mockClear();
      mockCase2.mockClear();

      const matcher = new SMMatcher('test', { autoBreak: false });
      matcher.case('not test', mockCase1);
      matcher.case('not match', mockCase2);
      expect(matcher.value).toBeUndefined();
      expect(mockCase1).not.toHaveBeenCalled();
      expect(mockCase2).not.toHaveBeenCalled();
    });

    it('should return default value if no case matched and default value is set', () => {
      const autoMatcher = new SMMatcher('test', { autoBreak: true });
      autoMatcher.else('default');
      expect(autoMatcher.value).toBe('default');
      autoMatcher.case('not test', () => 'not matched');
      autoMatcher.case('not Matched', () => 'not matched');
      expect(autoMatcher.value).toBe('default');

      const matcher = new SMMatcher('test', { autoBreak: false });
      matcher.else('default');
      expect(matcher.value).toBe('default');
      matcher.case('not test', () => 'not matched');
      matcher.case('not matched', () => 'not matched');
      expect(matcher.value).toBe('default');
    });

    it('should execute default handler if no case matched and default handler is set', () => {
      const mockCase1 = jest.fn();
      const mockCase2 = jest.fn();
      const mockDefault = jest.fn();
      
      
      const autoMatcher = new SMMatcher('test', { autoBreak: true });
      autoMatcher.case('not test', mockCase1);
      autoMatcher.case('not Matched', mockCase2);
      autoMatcher.default(mockDefault);
      expect(autoMatcher.value).toBeUndefined();
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
      expect(matcher.value).toBeUndefined();
      expect(mockCase1).not.toHaveBeenCalled();
      expect(mockCase2).not.toHaveBeenCalled();
      expect(mockDefault).toHaveBeenCalled();
    });

    it('should correctly use default handler and default value if no case matched', () => {
      const autoMatcher = new SMMatcher('test', { autoBreak: true });
      autoMatcher.default(() => {'default'});
      autoMatcher.else('defaultValue');
      expect(autoMatcher.value).toBe('defaultValue');

      const matcher = new SMMatcher('test', { autoBreak: false });
      matcher.default(() => {'default'});
      matcher.else('defaultValue');
      expect(matcher.value).toBe('defaultValue');
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
      expect(autoMatcher.value).toBeUndefined();
      expect(matchCase).toHaveBeenCalled();

      matchCase.mockClear();

      const matcher = new SMMatcher('match', { autoBreak: false });
      matcher.case('no match', ()=>{});
      matcher.case('test', ()=>{});
      matcher.case('match', matchCase);
      matcher.case('no match2', ()=>{});
      matcher.case('match', ()=>{});
      matcher.case('test2', ()=>{});
      expect(matcher.value).toBeUndefined();
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
      expect(autoMatcher.value).toBeUndefined();
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
      expect(matcher.value).toBeUndefined();
      expect(noMatchCase1).not.toHaveBeenCalled();
      expect(noMatchCase2).not.toHaveBeenCalled();
    });

    it('should correctly match and return value for case', () => {
      const autoMatcher = new SMMatcher('test', { autoBreak: true });
      autoMatcher.case('test', () => 'matched');
      expect(autoMatcher.value).toBe('matched');

      const matcher = new SMMatcher('test', { autoBreak: false });
      matcher.case('test', () => 'matched');
      expect(matcher.value).toBe('matched');
    });

    it('should not execute next case handlers if match case returns a value', () => {
      const matchCase = jest.fn(() => 'matched');
      const noMatchCase = jest.fn();

      const autoMatcher = new SMMatcher('test', { autoBreak: true });
      autoMatcher.case('test', matchCase);
      autoMatcher.case('test', noMatchCase);
      expect(autoMatcher.value).toBe('matched');
      expect(matchCase).toHaveBeenCalled();
      expect(noMatchCase).not.toHaveBeenCalled();

      matchCase.mockClear();
      noMatchCase.mockClear();

      const matcher = new SMMatcher('test', { autoBreak: false });
      matcher.case('test', matchCase);
      matcher.case('test', noMatchCase);
      expect(matcher.value).toBe('matched');
      expect(matchCase).toHaveBeenCalled();
      expect(noMatchCase).not.toHaveBeenCalled();
    });

    it('should correctly match and return value for case with multiple values', () => {
      const autoMatcher = new SMMatcher('test', { autoBreak: true });
      autoMatcher.case('test', () => ['matched', 'also matched']);
      expect(autoMatcher.value).toEqual(['matched', 'also matched']);

      const matcher = new SMMatcher('test', { autoBreak: false });
      matcher.case('test', () => ['matched', 'also matched']);
      expect(matcher.value).toEqual(['matched', 'also matched']);
    });
    
    /* 
    TODO: 
    Probar el encadenamiento de operaciones en cualquier orden
    TODO: Probar que devuelve el valor si matchea un caso que tiene un valor en lugar de una función
    TODO: Probar que matchea correctamente si el valor es un objeto o una lista
    
     */
  });

  describe('Auto Break', () => {
  
    it('should correctly break after match if autoBreak is true', () => {
      const matcher = new SMMatcher('test', { autoBreak: true });
      matcher.case('test', () => 'matched');
      matcher.case('test', () => 'not matched');
      expect(matcher.value).toBe('matched');
    });
  
  });
});