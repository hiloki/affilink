const fs      = require('fs');
const path    = require('path');
const cheerio = require('cheerio');

class DataFormat {

  constructor(html = '') {
    this.$ = cheerio.load(html);
    this.extractDefinition = new Map();
  }
  
  setDefinitionPath(p = '') {

    let absolutePath = path.resolve(p);

    if (!fs.existsSync(absolutePath)) {
      console.error(`${p} does not exist`);
      return;
    }

    let buffer = fs.readFileSync(absolutePath, {
      encoding: 'utf8'
    });

    let definitions;

    try {
      definitions = JSON.parse(buffer.toString());
    } catch (error) {
      throw error;
    }

    definitions.forEach((definition) => {
      this.extractDefinition.set(definition.key, definition.value);
    });
  }

  extract() {
    
    let object = {};
    let entries = this.extractDefinition.entries();
    
    for (let [key, value] of entries) {
      let $element = this.$(value.selector);
      object[key] = value.attr ? $element.attr(value.attr) : $element.text();
    }
    
    return object;
  }
}

module.exports = DataFormat;