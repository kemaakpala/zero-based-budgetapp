import { generateUniqueId, formatBudgetItemAmount, removeSpace } from './utils'


describe('utils', () => {
  beforeAll(() => {
    const crypto = require('crypto');
    global.crypto = {
      getRandomValues: function(buffer) {
        return crypto.randomFillSync(buffer);
      }
    };
  });
  w
  it('should test that space is removed', () => { 
    expect(removeSpace('hello world')).toBe('helloworld');
  })

  it('should test that unique id is generated', () => {
    expect(generateUniqueId()).toBeTruthy();
  })

  it('should test that amount is formatted', () => {
    expect(formatBudgetItemAmount(100)).toBe('100.00');
  })
})