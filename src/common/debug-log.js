const colors = require('colors');

module.exports = function(...arg) {
  const stack = new Error().stack
  const line = stack.split('\n')[2]
  const match = line.match(/at ([^ ]+) \(([^:]+):([^:]+):([^:]+)\)/)
  const func_name = match[1].red
  const file_name = match[2].blue
  const line_num = match[3].green
  const col_num = match[4].yellow

  console.log(`\n${func_name}:${file_name}:${line_num}:${col_num}\n`, ...arg, '\n')
}
