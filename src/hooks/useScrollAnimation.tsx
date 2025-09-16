'use client'

import { useEffect, useRef, useState } from 'react'

interface UseScrollAnimationProps {
    delay?: number
    threshold?: number
    triggerOnce?: boolean
}

export function useScrollAnimation({
    delay = 0,
    threshold = 0.1,
    triggerOnce = true
}: UseScrollAnimationProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [shouldAnimate, setShouldAnimate] = useState(false)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        setShouldAnimate(true)
                    }, delay)
                    
                    if (triggerOnce) {
                        observer.unobserve(element)
                    }
                } else if (!triggerOnce) {
                    setShouldAnimate(false)
                }
            },
            { threshold }
        )

        observer.observe(element)

        return () => {
            observer.unobserve(element)
        }
    }, [delay, threshold, triggerOnce])

    return { ref, shouldAnimate }
}

export function useStaggeredAnimation(itemCount: number, staggerDelay: number = 100) {
    const ref = useRef<HTMLDivElement>(null)
    const [visibleItems, setVisibleItems] = useState<boolean[]>(
        new Array(itemCount).fill(false)
    )

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Animate items one by one with stagger delay
                    for (let i = 0; i < itemCount; i++) {
                        setTimeout(() => {
                            setVisibleItems(prev => {
                                const newState = [...prev]
                                newState[i] = true
                                return newState
                            })
                        }, i * staggerDelay)
                    }
                    observer.unobserve(element)
                }
            },
            { threshold: 0.1 }
        )

        observer.observe(element)

        return () => {
            observer.unobserve(element)
        }
    }, [itemCount, staggerDelay])

    const isItemAnimated = (index: number) => visibleItems[index]

    return { ref, isItemAnimated }
}

// Hook for parallax scrolling effect
export function useParallaxScroll(speed: number = 0.5) {
    const ref = useRef<HTMLDivElement>(null)
    const [offset, setOffset] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                const scrolled = window.pageYOffset
                const element = ref.current
                const elementTop = element.offsetTop
                const elementHeight = element.offsetHeight
                const windowHeight = window.innerHeight

                // Only apply parallax when element is in view
                if (scrolled + windowHeight > elementTop && scrolled < elementTop + elementHeight) {
                    const yPos = -(scrolled - elementTop) * speed
                    setOffset(yPos)
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [speed])

    return { ref, offset }
}

// Hook for scroll progress tracking
export function useScrollProgress() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight
            const progress = Math.min(scrolled / maxScroll, 1)
            setProgress(progress)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return progress
}
