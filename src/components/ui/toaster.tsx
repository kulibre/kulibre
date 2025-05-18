import { useToast } from "@/hooks/use-toast"
import { useSoundEffects } from "@/hooks/use-sound-effects"
import { useEffect } from "react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()
  const { playNotification, playError, playSuccess } = useSoundEffects()

  // Play sound when toasts appear
  useEffect(() => {
    if (toasts.length > 0) {
      const latestToast = toasts[toasts.length - 1]
      
      if (latestToast.variant === "destructive") {
        playError()
      } else if (latestToast.variant === "success" as any) {
        // Using type assertion to avoid TypeScript error
        // The actual variant might be extended in the application
        playSuccess()
      } else {
        playNotification()
      }
    }
  }, [toasts.length, playNotification, playError, playSuccess])

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
