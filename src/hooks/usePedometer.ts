import { Pedometer } from "expo-sensors";
import { useEffect, useState } from "react";

export function usePedometer(isActive: boolean) {
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    let subscription: Pedometer.Subscription | null = null;

    const startTracking = async () => {
      try {
        const isAvailable = await Pedometer.isAvailableAsync();
        if (!isAvailable) {
          console.warn("Pedometer is not available on this device.");
          return;
        }

        const permission = await Pedometer.requestPermissionsAsync();
        if (!permission.granted) {
          console.warn("Pedometer permission denied.");
          return;
        }

        // watchStepCount automatically initializes at 0 for the session
        subscription = Pedometer.watchStepCount((result) => {
          setSteps(result.steps);
        });
      } catch (error) {
        console.error("Failed to start pedometer:", error);
      }
    };

    if (isActive) {
      setSteps(0); // Reset to 0 when a new walk starts
      void startTracking();
    } else {
      setSteps(0); // Clear steps when walk is cancelled/completed
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isActive]);

  return { steps };
}
