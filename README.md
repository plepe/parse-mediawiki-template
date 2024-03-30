# parse-mediawiki-template
Parses all occurences of a Mediawiki Template from Mediawiki text

## INSTALLATION
From npm.js:
```sh
npm install --save parse-mediawiki-template
```

From Github:
```sh
git clone https://github.com/plepe/parse-mediawiki-template
cd parse-mediawiki-template
npm install
```

With script tag in the browser:
```html
<script src="https://cdn.jsdelivr.net/npm/parse-mediawiki-template@0.2.0/dist/parse-mediawiki-template.umd.js"></script>
```

## USAGE
The function will parse wikitext (parameter 1) and find all occurences of the specified template (parameter 2). Mediawiki text is case insensitive.

The result is an array with an entry for each occurence. If the template has parameters, it will list them.

```js
const parseMediawikiTemplate = require('parse-mediawiki-template')

const wikitext = 'Page content {{Template|param1|foo=paramFoo}} {{OtherTemplate}} {{Template|second|occurence}}'
const template = 'template'

const result = parseMediawikiTemplate(wikitext, template)
```

result is:
```json
[
  {
    "1": "param1",
    "foo": "paramFoo"
  },
  {
    "1": "second",
    "2": "occurence"
  }
]
```
