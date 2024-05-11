import parseMWTemplate from '@/parse-mediawiki-template';
import { describe, expect, it } from 'vitest';

describe('parseMWTemplate', () => {
  it('without value', () => {
    const result = parseMWTemplate('{{doo}} {{foo}} {{ doo }}', 'doo');

    expect(result).toEqual([{}, {}]);
  });
  it('with text before and after', () => {
    const result = parseMWTemplate('foobar {{doo}} {{foo}} {{ doo }} foobar', 'doo');

    expect(result).toEqual([{}, {}]);
  });
  it('single line', () => {
    const result = parseMWTemplate('{{doo|2345}}', 'doo');

    expect(result).toEqual([{ 1: '2345' }]);
  });
  it('single line, multiple templates', () => {
    const result = parseMWTemplate('{{doo|2345|8765}}\n{{Doo|1=1234|2=2345}}', 'doo');

    expect(result).toEqual([
      { 1: '2345', 2: '8765' },
      { 1: '1234', 2: '2345' },
    ]);
  });
  it('multiple line', () => {
    const result = parseMWTemplate('{{doo\n | foo = 2345\n | bar = text with whitespace }}\n{{Doo|1=1234}}', 'doo');

    expect(result).toEqual([{ foo: '2345', bar: 'text with whitespace' }, { 1: '1234' }]);
  });
  it('nested templates', () => {
    const result = parseMWTemplate(
      '{{doo\n | foo = 2345\n | bar = text with whitespace and {{another template}} embedded | even more complex \n [[e|f]] {{foo|bar}} stuff {{a{{b}} }} }}\n{{Doo|1=1234}}',
      'doo'
    );

    expect(result).toEqual([
      {
        foo: '2345',
        bar: 'text with whitespace and {{another template}} embedded',
        3: 'even more complex \n [[e|f]] {{foo|bar}} stuff {{a{{b}} }}',
      },
      { 1: '1234' },
    ]);
  });
  it('error', () => {
    const result = parseMWTemplate('{{doo}} {{foo}} {{ doo }} {{doo|foo=|\nbar=}} {{ doo [[a|b=]] ', 'doo');

    expect(result).toEqual([{}, {}, { foo: '', bar: '' }]);
  });
});
