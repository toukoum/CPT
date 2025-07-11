"use client";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import { MessageSquare, ShoppingBag, Wrench } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import React from "react";

export default function CardsLanding() {
  return (
    <div className="md:py-0 lg:py-0 flex flex-col lg:flex-row items-stretch justify-center w-full gap-4 md:gap-6 mx-auto">
      <Card
        title="Shop"
        description="Browse and purchase AI tools as NFTs to expand your agent's capabilities"
        icon={<ShoppingBag size={24} className="sm:size-6 md:size-7" />}
        href="/shop"
        color="emerald"
      >
        <CanvasRevealEffect
          animationSpeed={5.1}
          containerClassName="bg-black"
          colors={[
            [16, 185, 129],
            [5, 150, 105],
          ]}
          dotSize={2}
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] bg-black/50 dark:bg-black/90" />
      </Card>

      <Card
        title="Build"
        description="Create and sell your own custom AI tools on the marketplace"
        icon={<Wrench size={24} className="sm:size-6 md:size-7" />}
        href="/build"
        color="pink"
      >
        <CanvasRevealEffect
          animationSpeed={3}
          containerClassName="bg-black"
          colors={[
            [236, 72, 153],
            [232, 121, 249],
          ]}
          dotSize={2}
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] bg-black/50 dark:bg-black/90" />
      </Card>

      <Card
        title="Chat"
        description="Interact with your AI agent enhanced with your purchased tools"
        icon={<MessageSquare size={24} className="sm:size-6 md:size-7" />}
        href="/chat"
        color="sky"
      >
        <CanvasRevealEffect
          animationSpeed={3}
          containerClassName="bg-black"
          colors={[
            [14, 165, 233],
            [56, 189, 248]
          ]}
          dotSize={2}
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] bg-black/50 dark:bg-black/90" />
      </Card>
    </div>
  );
}

const Card = ({
  title,
  description,
  icon,
  href,
  color,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color?: string;
  children?: React.ReactNode;
}) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Link href={href} className="flex-1 min-w-0">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="border border-black/[0.2] group/canvas-card flex items-center justify-center dark:border-white/[0.2] w-full mx-auto p-4 md:p-4 relative h-[12rem] sm:h-[14rem] md:h-[16rem] cursor-pointer transition-all duration-300"
      >
        <Icon className="absolute h-3 w-3 sm:h-4 sm:w-4 -top-2 -left-2 dark:text-white text-black" />
        <Icon className="absolute h-3 w-3 sm:h-4 sm:w-4 -bottom-2 -left-2 dark:text-white text-black" />
        <Icon className="absolute h-3 w-3 sm:h-4 sm:w-4 -top-2 -right-2 dark:text-white text-black" />
        <Icon className="absolute h-3 w-3 sm:h-4 sm:w-4 -bottom-2 -right-2 dark:text-white text-black" />

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="h-full w-full absolute inset-0"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-20 flex flex-col items-center justify-center text-center gap-2 sm:gap-3 px-4 sm:px-6 h-full w-full">
          {/* Icon with fade-out animation */}
          <AnimatePresence mode="wait">
            {!hovered && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  type: "tween",
                  ease: "easeOut",
                  duration: 0.3
                }}
                className="text-center w-full flex items-center justify-center"
              >
                {React.cloneElement(icon as React.ReactElement, {
                  className: "text-foreground transition-colors duration-300"
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Title with fade-out animation */}
          <AnimatePresence mode="wait">
            {!hovered && (
              <motion.h2
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{
                  type: "tween",
                  ease: "easeOut",
                  duration: 0.3,
                  delay: 0.05
                }}
                className="text-lg sm:text-xl font-semibold relative z-10 text-black dark:text-white"
              >
                {title}
              </motion.h2>
            )}
          </AnimatePresence>

          {/* Description with fade-in animation */}
          <AnimatePresence mode="wait">
            {hovered && (
              <motion.div
                key="description-container"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{
                  type: "tween",
                  duration: 0.4,
                  ease: "easeOut",
                  delay: 0.1
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <p className="text-sm sm:text-base md:text-lg text-white/95 w-full px-4 mx-auto leading-relaxed">
                  {description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Link>
  );
};

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};