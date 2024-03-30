const regexKey = /^\s*([^=|{}[\]]*)=/;
const regexNextField = /\|/m;
const regexEnd = /}}/m;
const regexNest = /(\[\[|\{\{)/m;

function findNested(str: string) {
  const currentNest = RegExp(/^(\{\{|\[\[)(.*)/).exec(str);
  if (!currentNest) return 0;

  let length = currentNest[1].length;
  str = str.slice(length);

  let regexEndNest;
  if (currentNest[1] === '{{') {
    regexEndNest = /\}\}/m;
  } else if (currentNest[1] === '[[') {
    regexEndNest = /\]\]/m;
  }

  let mNest = RegExp(regexNest).exec(str);
  let mEnd = RegExp(regexEndNest ?? '').exec(str);
  while (mNest && (!mEnd || mNest.index < mEnd.index)) {
    str = str.slice(mNest.index);
    const l = findNested(str);
    length += mNest.index + l;
    str = str.slice(l);

    mNest = RegExp(regexNest).exec(str);
    mEnd = RegExp(regexEndNest ?? '').exec(str);
  }

  length += (mEnd?.index ?? 0) + (mEnd?.[0].length ?? 0);
  return length;
}

export default function parseMWTemplate(str: string, templateId: string) {
  const results = [];

  const regexStart = new RegExp('(\\{\\{\\s*' + templateId + '\\s*(\\||\\}\\}))', 'im');
  let m = RegExp(regexStart).exec(str);
  while (m) {
    const d: Record<string, string> = {};
    let numIndex = 1;

    str = str.slice(m.index + m[1].length);
    if (str.startsWith('\n')) str = str.slice(1);

    if (m[2] === '}}') {
      results.push(d);
      m = RegExp(regexStart).exec(str);
      continue;
    }

    let key = null;
    let value = '';
    let done = false;
    while (!done) {
      const mKey = RegExp(regexKey).exec(str);
      const mNest = RegExp(regexNest).exec(str);
      const mNext = RegExp(regexNextField).exec(str);
      const mEnd = RegExp(regexEnd).exec(str);

      if (value === '' && mKey) {
        key = mKey[1].trim();
        str = str.slice(mKey[0].length);
      } else if (mNext && (!mNest || mNext.index < mNest.index) && (!mEnd || mNext.index < mEnd.index)) {
        value += str.slice(0, mNext.index);
        str = str.slice(mNext.index + 1);
        if (value !== '' || key) {
          d[key ?? numIndex] = value.trim();
        }

        numIndex++;
        key = null;
        value = '';
      } else if (mNest && (!mEnd || mNest.index < mEnd.index)) {
        const length = findNested(str.slice(mNest.index));
        value += str.slice(0, mNest.index + length);
        str = str.slice(mNest.index + length);
      } else if (mEnd) {
        value += str.slice(0, mEnd.index);
        str = str.slice(mEnd.index + 2);
        if (value !== '' || key) {
          d[key ?? numIndex] = value.trim();
        }
        results.push(d);
        done = true;
      } else {
        done = true;
      }
    }

    m = RegExp(regexStart).exec(str);
  }

  return results;
}
