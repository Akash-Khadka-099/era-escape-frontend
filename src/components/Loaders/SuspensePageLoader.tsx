import Lottie from "react-lottie";
import LoadingSuspense from "@/assets/JsonAnimation/loadingSuspense.json";

interface SuspensePageLoaderProps {
  height?: number;
  width?: number;
  minHeight?: string;
}

const loadingSuspenseOptions = {
  loop: true,
  autoplay: true,
  animationData: LoadingSuspense,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const SuspensePageLoader = ({
  height = 280,
  width = 280,
  minHeight = "60vh",
}: SuspensePageLoaderProps) => {
  return (
    <div
      style={{
        minHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Lottie options={loadingSuspenseOptions} height={height} width={width} />
    </div>
  );
};

export default SuspensePageLoader;
