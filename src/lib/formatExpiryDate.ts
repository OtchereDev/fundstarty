export function formatExpiryDate(event: any, callback: any) {
  const code = event.keyCode
  const allowedKeys = [8]
  if (allowedKeys.indexOf(code) !== -1) {
    return
  }

  event.target.value = event.target.value
    .replace(/^([1-9]\/|[2-9])$/g, '0$1/')
    .replace(/^(0[1-9]|1[0-2])$/g, '$1/')
    .replace(/^1([3-9])$/g, '01/$1')
    .replace(/^0\/|0+$/g, '0')
    .replace(/[^\d|^\/]*/g, '')
    .replace(/\/\//g, '/')

  callback(event)
}
