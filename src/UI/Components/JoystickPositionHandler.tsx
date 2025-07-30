import React, { useEffect } from "react";
import { useComponentStore } from "../../stores/ZustandStores";

/**
 * JoystickPositionHandler - Pure UI component that handles joystick positioning
 * 
 * This component:
 * - Only handles CSS positioning of the joystick
 * - Does not create or destroy joystick instances
 * - Responds to joystick position changes from the store
 * - Has no side effects on 3D components
 */
const JoystickPositionHandler: React.FC = () => {
  const { joystickPosition } = useComponentStore();

  useEffect(() => {
    const joystickZone = document.getElementById("joystickZone");
    if (!joystickZone) return;

    // Apply position styles based on current joystick position
    // This ensures the position is always correct, even if the joystick was created with a different position
    if (joystickPosition === "right") {
      joystickZone.style.right = "-3vw";
      joystickZone.style.left = "auto";
    } else {
      joystickZone.style.left = "13vw";
      joystickZone.style.right = "auto";
    }
  }, [joystickPosition]);

  // This component renders nothing - it's purely for side effects
  return null;
};

export default JoystickPositionHandler;