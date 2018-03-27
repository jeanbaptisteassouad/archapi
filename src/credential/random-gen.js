

module.exports = function(len) {
  let s = ''
  for (let i = len - 1; i >= 0; i--) {
    s += String.fromCharCode(Math.floor(Math.random() * 255))
  }
  return Buffer.from(s).toString('base64')
}

