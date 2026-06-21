"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

interface NavItem {
    name: string
    url: string
    icon: LucideIcon
}

interface NavBarProps {
    items: NavItem[]
    className?: string
    activeName?: string
    onSelect?: (item: NavItem) => void
}

function cn(...inputs: Parameters<typeof clsx>): string {
    return twMerge(clsx(inputs))
}

export function NavBar({ items, className, activeName, onSelect }: NavBarProps): JSX.Element {
    const [activeTab, setActiveTab] = useState(activeName || items[0]?.name)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        if (activeName) {
            setActiveTab(activeName)
        }
    }, [activeName])

    useEffect(() => {
        const handleResize = (): void => {
            setIsMobile(window.innerWidth < 768)
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <div className={cn("fixed left-1/2 top-0 z-50 -translate-x-1/2 pt-4", className)}>
            <div className="flex max-w-[calc(100vw-24px)] items-center gap-1 overflow-x-auto rounded-full border border-[#d8e3e1]/80 bg-white/75 px-1.5 py-1.5 shadow-[0_14px_40px_rgba(1,101,100,0.12)] backdrop-blur-xl">
                {items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.name

                    return (
                        <a
                            key={item.name}
                            href={item.url}
                            onClick={(event) => {
                                event.preventDefault()
                                setActiveTab(item.name)
                                onSelect?.(item)
                            }}
                            className={cn(
                                "relative shrink-0 cursor-pointer rounded-full px-4 py-2 text-[12px] font-bold transition-colors md:px-5",
                                "text-[#5f7774] hover:text-[#016564]",
                                isActive && "text-[#016564]"
                            )}
                            title={isMobile ? item.name : undefined}
                        >
                            <span className="hidden md:inline">{item.name}</span>
                            <span className="md:hidden">
                                <Icon size={18} strokeWidth={2.5} />
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="lamp"
                                    className="absolute inset-0 -z-10 w-full rounded-full bg-[#016564]/8"
                                    initial={false}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                >
                                    <div className="absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-[#016564]">
                                        <div className="absolute -left-2 -top-2 h-6 w-12 rounded-full bg-[#016564]/20 blur-md" />
                                        <div className="absolute -top-1 h-6 w-8 rounded-full bg-[#016564]/20 blur-md" />
                                        <div className="absolute left-2 top-0 size-4 rounded-full bg-[#d0b284]/35 blur-sm" />
                                    </div>
                                </motion.div>
                            )}
                        </a>
                    )
                })}
            </div>
        </div>
    )
}
