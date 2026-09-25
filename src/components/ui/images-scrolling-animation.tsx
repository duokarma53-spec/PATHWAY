"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

const projects = [
  {
    title: "Reception",
    src: "/images/gallery-2.jpeg",
  },
  {
    title: "Welcome Area",
    src: "/images/gallery-9.jpeg",
  },
  {
    title: "Consultation Office",
    src: "/images/gallery-6.jpeg",
  },
  {
    title: "Consultation Desk",
    src: "/images/gallery-1.jpeg",
  },
  {
    title: "Our Team",
    src: "/images/gallery-4.jpeg",
  },
  {
    title: "World Map Wall",
    src: "/images/gallery-7.jpeg",
  },
  {
    title: "Our Entrance",
    src: "/images/gallery-5.jpeg",
  },
  {
    title: "Reception (Day)",
    src: "/images/gallery-3.jpeg",
  },
]

const StickyCard_001 = ({
  i,
  title,
  src,
  progress,
  range,
  targetScale,
}: {
  i: number
  title: string
  src: string
  progress: any
  range: [number, number]
  targetScale: number
}) => {
  const container = useRef<HTMLDivElement>(null)
  const scale = useTransform(progress, range, [1, targetScale])

  return (
    <div
      ref={container}
      className="sticky flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{ top: "10vh", height: "auto" }}
    >
      <motion.div
        style={{
          scale,
          top: `calc(${i * 25}px)`,
        }}
        className="rounded-2xl sm:rounded-3xl relative flex origin-top flex-col overflow-hidden shadow-2xl
                   h-[220px] w-[300px] 
                   sm:h-[260px] sm:w-[380px] 
                   md:h-[320px] md:w-[480px] 
                   lg:h-[380px] lg:w-[580px]"
      >
        <img src={src || "/placeholder.svg"} alt={title} className="h-full w-full object-cover" />
      </motion.div>
    </div>
  )
}

const ImagesScrollingAnimation = () => {
  const container = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  })

  return (
    <div
      ref={container}
      className="relative w-full"
    >
      {projects.map((project, i) => {
        const targetScale = Math.max(0.7, 1 - (projects.length - i - 1) * 0.05)
        return (
          <StickyCard_001
            key={`p_${i}`}
            i={i}
            {...project}
            progress={scrollYProgress}
            range={[i * (1 / projects.length), 1]}
            targetScale={targetScale}
          />
        )
      })}
    </div>
  )
}

export { ImagesScrollingAnimation, StickyCard_001 }
