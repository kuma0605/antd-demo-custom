import { useEffect, useRef } from 'react'

interface DataNode {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  pulseSpeed: number
  pulseOffset: number
}

interface DataStream {
  x: number
  y: number
  length: number
  speed: number
  chars: string[]
  alpha: number
}

const SciFiBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Data nodes (floating hexagons/circles)
    const nodes: DataNode[] = []
    const nodeCount = 60

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 4 + 2,
        alpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
      })
    }

    // Data streams (matrix-like falling characters)
    const streams: DataStream[] = []
    const streamCount = 15
    const chars = '01001011<>{}[]#$%&@DATA'.split('')

    for (let i = 0; i < streamCount; i++) {
      const streamChars: string[] = []
      const length = Math.floor(Math.random() * 15) + 5
      for (let j = 0; j < length; j++) {
        streamChars.push(chars[Math.floor(Math.random() * chars.length)])
      }
      streams.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        length,
        speed: Math.random() * 2 + 1,
        chars: streamChars,
        alpha: Math.random() * 0.3 + 0.1,
      })
    }

    // Hexagon drawing helper
    const drawHexagon = (x: number, y: number, size: number, alpha: number) => {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6
        const px = x + size * Math.cos(angle)
        const py = y + size * Math.sin(angle)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.strokeStyle = `hsla(180, 100%, 50%, ${alpha})`
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Draw hexagonal grid
    const drawHexGrid = () => {
      const hexSize = 40
      const hexHeight = hexSize * Math.sqrt(3)
      const hexWidth = hexSize * 2

      ctx.strokeStyle = 'hsla(180, 100%, 50%, 0.03)'
      ctx.lineWidth = 1

      for (let row = -1; row < canvas.height / hexHeight + 1; row++) {
        for (let col = -1; col < canvas.width / (hexWidth * 0.75) + 1; col++) {
          const x = col * hexWidth * 0.75
          const y = row * hexHeight + (col % 2 === 0 ? 0 : hexHeight / 2)

          ctx.beginPath()
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i
            const px = x + hexSize * Math.cos(angle)
            const py = y + hexSize * Math.sin(angle)
            if (i === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
          }
          ctx.closePath()
          ctx.stroke()
        }
      }
    }

    // Draw pulsing rings
    const drawPulsingRings = () => {
      const centerX = canvas.width * 0.5
      const centerY = canvas.height * 0.5
      const maxRadius = Math.max(canvas.width, canvas.height) * 0.6

      for (let i = 0; i < 5; i++) {
        const baseRadius = (time * 30 + i * 100) % maxRadius
        const alpha = 1 - baseRadius / maxRadius

        ctx.beginPath()
        ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2)
        ctx.strokeStyle = `hsla(180, 100%, 50%, ${alpha * 0.1})`
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }

    const animate = () => {
      time += 0.016

      // Clear with dark background
      ctx.fillStyle = 'hsl(220, 30%, 5%)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw hexagonal grid
      drawHexGrid()

      // Draw pulsing rings
      drawPulsingRings()

      // Draw and update data streams
      ctx.font = '14px monospace'
      streams.forEach(stream => {
        stream.y += stream.speed

        if (stream.y > canvas.height + stream.length * 20) {
          stream.y = -stream.length * 20
          stream.x = Math.random() * canvas.width
        }

        stream.chars.forEach((char, i) => {
          const y = stream.y + i * 20
          const alpha = i === 0 ? stream.alpha * 2 : stream.alpha * (1 - i / stream.length)
          const hue = i === 0 ? 180 : 180
          ctx.fillStyle = `hsla(${hue}, 100%, ${i === 0 ? 70 : 50}%, ${alpha})`
          ctx.fillText(char, stream.x, y)
        })
      })

      // Draw and update nodes
      nodes.forEach(node => {
        node.x += node.vx
        node.y += node.vy

        if (node.x < 0) node.x = canvas.width
        if (node.x > canvas.width) node.x = 0
        if (node.y < 0) node.y = canvas.height
        if (node.y > canvas.height) node.y = 0

        const pulse = Math.sin(time * node.pulseSpeed * 100 + node.pulseOffset) * 0.5 + 0.5
        const currentAlpha = node.alpha * (0.5 + pulse * 0.5)
        const currentSize = node.size * (0.8 + pulse * 0.4)

        // Draw glow
        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          currentSize * 3
        )
        gradient.addColorStop(0, `hsla(180, 100%, 50%, ${currentAlpha * 0.5})`)
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, currentSize * 3, 0, Math.PI * 2)
        ctx.fill()

        // Draw hexagon node
        drawHexagon(node.x, node.y, currentSize, currentAlpha)
      })

      // Draw connections between nearby nodes
      nodes.forEach((n1, i) => {
        nodes.slice(i + 1).forEach(n2 => {
          const dist = Math.sqrt((n1.x - n2.x) ** 2 + (n1.y - n2.y) ** 2)
          if (dist < 120) {
            const alpha = 0.15 * (1 - dist / 120)

            // Animated dashed line
            ctx.beginPath()
            ctx.setLineDash([5, 5])
            ctx.lineDashOffset = -time * 50
            ctx.moveTo(n1.x, n1.y)
            ctx.lineTo(n2.x, n2.y)
            ctx.strokeStyle = `hsla(180, 100%, 50%, ${alpha})`
            ctx.lineWidth = 1
            ctx.stroke()
            ctx.setLineDash([])
          }
        })
      })

      // Draw corner data indicators
      const cornerSize = 80
      const corners = [
        { x: 30, y: 30 },
        { x: canvas.width - 30, y: 30 },
        { x: 30, y: canvas.height - 30 },
        { x: canvas.width - 30, y: canvas.height - 30 },
      ]

      corners.forEach((corner, i) => {
        const pulse = Math.sin(time * 2 + i * 0.5) * 0.5 + 0.5

        // Corner brackets
        ctx.strokeStyle = `hsla(180, 100%, 50%, ${0.3 + pulse * 0.2})`
        ctx.lineWidth = 2
        ctx.beginPath()

        if (i === 0) {
          ctx.moveTo(corner.x, corner.y + cornerSize)
          ctx.lineTo(corner.x, corner.y)
          ctx.lineTo(corner.x + cornerSize, corner.y)
        } else if (i === 1) {
          ctx.moveTo(corner.x - cornerSize, corner.y)
          ctx.lineTo(corner.x, corner.y)
          ctx.lineTo(corner.x, corner.y + cornerSize)
        } else if (i === 2) {
          ctx.moveTo(corner.x, corner.y - cornerSize)
          ctx.lineTo(corner.x, corner.y)
          ctx.lineTo(corner.x + cornerSize, corner.y)
        } else {
          ctx.moveTo(corner.x - cornerSize, corner.y)
          ctx.lineTo(corner.x, corner.y)
          ctx.lineTo(corner.x, corner.y - cornerSize)
        }
        ctx.stroke()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 -z-10" />

      {/* Scan line effect */}
      <div className="fixed inset-0 pointer-events-none -z-5 overflow-hidden">
        <div className="absolute w-full h-2 bg-gradient-to-b from-transparent via-neon-cyan/10 to-transparent animate-scan-line" />
      </div>

      {/* Vignette effect */}
      <div
        className="fixed inset-0 pointer-events-none -z-5"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, hsl(220, 30%, 5%) 100%)',
        }}
      />

      {/* Noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none -z-5 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  )
}

export default SciFiBackground
