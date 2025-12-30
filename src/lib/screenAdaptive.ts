function screenAdaptive() {
  const clientWidth = document.documentElement.clientWidth

  // 1. 基础公式：6 + 10 * 比例
  let fontSize = 6 + 10 * (clientWidth / 1920)

  // 2. 安全锁：绝对不能小于 12px
  // 如果算出来是 11.16px，强制变成 12px
  fontSize = Math.max(fontSize, 12)

  // 3. (可选) 上限锁：如果你不希望在 2K以上屏幕上字体过大，也可以加个上限
  // 例如：最大不超过 16px
  fontSize = Math.min(fontSize, 16)

  document.documentElement.style.fontSize = fontSize + 'px'
}

// 初始化和监听
screenAdaptive()

window.addEventListener('load', screenAdaptive)

window.addEventListener('resize', screenAdaptive)
