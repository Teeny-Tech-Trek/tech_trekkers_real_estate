
import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import AnimationSkeleton from "./AnimationSkeleton";

interface LottieAnimationProps {
  animationPath: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  lazyLoad?: boolean; // Enable lazy loading by default
}

const LottieAnimation = ({
  animationPath,
  className = "",
  loop = true,
  autoplay = true,
  lazyLoad = true,
}: LottieAnimationProps) => {
  const { ref, isVisible } = useScrollAnimation({
    threshold: 0.2,
    rootMargin: '100px',
  });
  
  const [shouldRender, setShouldRender] = useState(!lazyLoad);

  useEffect(() => {
    if (isVisible && lazyLoad) {
      setShouldRender(true);
    }
  }, [isVisible, lazyLoad]);

  if (lazyLoad && !shouldRender) {
    return (
      <div ref={ref} className={className}>
        <AnimationSkeleton animationType="image" className={className} />
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {shouldRender ? (
        <Lottie
          animationData={animationPath}
          loop={loop}
          autoplay={autoplay}
          style={{ width: "100%", height: "100%" }}
          rendererSettings={{
            preserveAspectRatio: "xMidYMid slice",
          }}
        />
      ) : (
        <AnimationSkeleton animationType="image" />
      )}
    </div>
  );
};

export default LottieAnimation;
