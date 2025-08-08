
import  LoadingSpinner  from "./LoadingSpinner"
import { cn } from "@/lib/utils"

export default function LoadingOverlay({
  variant = "educational",
  text = "Đang xử lý...",
  blur = true,
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center transition-all duration-300",
        blur ? "bg-background/80 backdrop-blur-sm" : "bg-background/60",
      )}
    >
      <div
        className={cn(
          "bg-card border rounded-lg shadow-lg p-6 max-w-sm w-full mx-4 transition-transform duration-300",
        )}
      >
        <LoadingSpinner variant='educational' size='lg' text='Vui lòng chờ xíu nhennn '/>
      </div>
    </div>
  )
}
