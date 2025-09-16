'use client'

import { ReactNode } from 'react'
import { motion, Variants } from 'framer-motion'
import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/useScrollAnimation'

// Animation variants
const fadeInUp: Variants = {
    hidden: {
        opacity: 0,
        y: 60,
        transition: {
            type: "spring",
            damping: 20,
            stiffness: 100
        }
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            damping: 20,
            stiffness: 100
        }
    }
}

const fadeInLeft: Variants = {
    hidden: {
        opacity: 0,
        x: -60,
        transition: {
            type: "spring",
            damping: 20,
            stiffness: 100
        }
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            damping: 20,
            stiffness: 100
        }
    }
}

const fadeInRight: Variants = {
    hidden: {
        opacity: 0,
        x: 60,
        transition: {
            type: "spring",
            damping: 20,
            stiffness: 100
        }
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            damping: 20,
            stiffness: 100
        }
    }
}

const scaleIn: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.8,
        transition: {
            type: "spring",
            damping: 20,
            stiffness: 100
        }
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            damping: 20,
            stiffness: 100
        }
    }
}

const slideInUp: Variants = {
    hidden: {
        opacity: 0,
        y: 100,
        transition: {
            type: "spring",
            damping: 25,
            stiffness: 120
        }
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            damping: 25,
            stiffness: 120
        }
    }
}

// Animation component interfaces
interface AnimationProps {
    children: ReactNode
    className?: string
    delay?: number
    duration?: number
    threshold?: number
    triggerOnce?: boolean
}

// Fade In Up Animation
export function FadeInUp({ 
    children, 
    className = '', 
    delay = 0, 
    threshold = 0.1,
    triggerOnce = true 
}: AnimationProps) {
    const { ref, shouldAnimate } = useScrollAnimation({ 
        delay, 
        threshold, 
        triggerOnce 
    })

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={shouldAnimate ? "visible" : "hidden"}
            variants={fadeInUp}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// Fade In Left Animation
export function FadeInLeft({ 
    children, 
    className = '', 
    delay = 0, 
    threshold = 0.1,
    triggerOnce = true 
}: AnimationProps) {
    const { ref, shouldAnimate } = useScrollAnimation({ 
        delay, 
        threshold, 
        triggerOnce 
    })

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={shouldAnimate ? "visible" : "hidden"}
            variants={fadeInLeft}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// Fade In Right Animation
export function FadeInRight({ 
    children, 
    className = '', 
    delay = 0, 
    threshold = 0.1,
    triggerOnce = true 
}: AnimationProps) {
    const { ref, shouldAnimate } = useScrollAnimation({ 
        delay, 
        threshold, 
        triggerOnce 
    })

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={shouldAnimate ? "visible" : "hidden"}
            variants={fadeInRight}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// Scale In Animation
export function ScaleIn({ 
    children, 
    className = '', 
    delay = 0, 
    threshold = 0.1,
    triggerOnce = true 
}: AnimationProps) {
    const { ref, shouldAnimate } = useScrollAnimation({ 
        delay, 
        threshold, 
        triggerOnce 
    })

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={shouldAnimate ? "visible" : "hidden"}
            variants={scaleIn}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// Slide In Up Animation
export function SlideInUp({ 
    children, 
    className = '', 
    delay = 0, 
    threshold = 0.1,
    triggerOnce = true 
}: AnimationProps) {
    const { ref, shouldAnimate } = useScrollAnimation({ 
        delay, 
        threshold, 
        triggerOnce 
    })

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={shouldAnimate ? "visible" : "hidden"}
            variants={slideInUp}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// Staggered Children Animation
interface StaggeredAnimationProps {
    children: ReactNode[]
    className?: string
    staggerDelay?: number
    itemClassName?: string
    threshold?: number
}

export function StaggeredFadeInUp({
    children,
    className = '',
    staggerDelay = 100,
    itemClassName = '',
    threshold = 0.1
}: StaggeredAnimationProps) {
    const { ref, isItemAnimated } = useStaggeredAnimation(children.length, staggerDelay)

    return (
        <div ref={ref} className={className}>
            {children.map((child, index) => (
                <motion.div
                    key={index}
                    initial="hidden"
                    animate={isItemAnimated(index) ? "visible" : "hidden"}
                    variants={fadeInUp}
                    className={itemClassName}
                >
                    {child}
                </motion.div>
            ))}
        </div>
    )
}

// Reveal Text Animation (for headings)
interface RevealTextProps {
    text: string
    className?: string
    delay?: number
    threshold?: number
}

export function RevealText({ 
    text, 
    className = '', 
    delay = 0,
    threshold = 0.1 
}: RevealTextProps) {
    const { ref, shouldAnimate } = useScrollAnimation({ delay, threshold })
    
    const words = text.split(' ')

    return (
        <span ref={ref} className={className}>
            {words.map((word, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{
                        duration: 0.6,
                        delay: delay + (index * 0.1),
                        ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    className="inline-block mr-2"
                >
                    {word}
                </motion.span>
            ))}
        </span>
    )
}

// Parallax Effect
interface ParallaxProps {
    children: ReactNode
    speed?: number
    className?: string
}

export function Parallax({ 
    children, 
    speed = 0.5, 
    className = '' 
}: ParallaxProps) {
    return (
        <motion.div
            className={className}
            style={{
                y: `${speed * 100}%`
            }}
            transition={{ type: "spring", stiffness: 100, damping: 30 }}
        >
            {children}
        </motion.div>
    )
}

// Floating Animation
export function FloatingAnimation({ 
    children, 
    className = '',
    duration = 3,
    yOffset = 10
}: {
    children: ReactNode
    className?: string
    duration?: number
    yOffset?: number
}) {
    return (
        <motion.div
            className={className}
            animate={{
                y: [0, -yOffset, 0]
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            {children}
        </motion.div>
    )
}

// Rotation Animation
export function RotateAnimation({ 
    children, 
    className = '',
    duration = 10,
    clockwise = true
}: {
    children: ReactNode
    className?: string
    duration?: number
    clockwise?: boolean
}) {
    return (
        <motion.div
            className={className}
            animate={{
                rotate: clockwise ? 360 : -360
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: "linear"
            }}
        >
            {children}
        </motion.div>
    )
}

// Hover Scale Animation
export function HoverScale({ 
    children, 
    className = '',
    scale = 1.05,
    duration = 0.2
}: {
    children: ReactNode
    className?: string
    scale?: number
    duration?: number
}) {
    return (
        <motion.div
            className={className}
            whileHover={{
                scale,
                transition: { duration }
            }}
            whileTap={{
                scale: scale * 0.95
            }}
        >
            {children}
        </motion.div>
    )
}
