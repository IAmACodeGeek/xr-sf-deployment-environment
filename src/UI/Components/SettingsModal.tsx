import React, { useRef } from "react";
import { useComponentStore } from "../../stores/ZustandStores";
import { Card, Box, Typography, Switch, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { styled } from "@mui/material/styles";
import { SwitchProps } from "@mui/material/Switch";

const SettingsModal = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const {
    closeSettingsModal,
    isAudioPlaying,
    setAudioPlaying,
    touchSensitivityMultiplier,
    setTouchSensitivityMultiplier,
    playerSpeedMultiplier,
    setPlayerSpeedMultiplier,
    joystickPosition,
    setJoystickPosition,
    openInfoModal,
    openTermsModal,
    openContactModal,
  } = useComponentStore();

  const onClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    const modal = modalRef.current;
    if (modal && !modal.contains(event.target as Node)) closeSettingsModal();
  };

  const handleAudioToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAudioPlaying(event.target.checked);
  };

  const handleJoystickToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJoystickPosition(event.target.checked ? "right" : "left");
  };



  const handleTouchSensitivityChange = (value: number) => {
    setTouchSensitivityMultiplier(value);
  };

  const handlePlayerSpeedChange = (value: number) => {
    setPlayerSpeedMultiplier(value);
  };

  const StyledButton = styled(Button)<{ isActive: boolean }>(({ isActive }) => ({
    padding: "6px 12px",
    borderRadius: "16px",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Poppins', sans-serif",
    fontSize: "11px",
    fontWeight: "medium",
    textTransform: "none",
    minWidth: "auto",
    transition: "all 0.3s ease",
    backgroundColor: isActive ? "#FF6B35" : "rgba(255, 255, 255, 0.1)",
    color: isActive ? "#fff" : "#fff",
    "&:hover": {
      backgroundColor: isActive ? "#FF6B35" : "rgba(255, 255, 255, 0.2)",
    }
  }));

  const IOSSwitch = styled((props: SwitchProps) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "1000ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: "#65C466",
          opacity: 1,
          border: 0,
          ...theme.applyStyles("dark", {
            backgroundColor: "#2ECA45",
          }),
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.grey[100],
        ...theme.applyStyles("dark", {
          color: theme.palette.grey[600],
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.7,
        ...theme.applyStyles("dark", {
          opacity: 0.3,
        }),
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: "#E9E9EA",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
      ...theme.applyStyles("dark", {
        backgroundColor: "#39393D",
      }),
    },
  }));



  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0)",
        pointerEvents: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
      }}
      onClick={onClickOutside}
    >
      <Card
        ref={modalRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: {
            xs: "300px",
            sm: "400px",
            md: "400px",
            lg: "400px",
            xl: "400px",
          },
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)", 
          borderRadius: { xs: "10px", md: "25px" },
          border: "1px solid rgba(255, 255, 255, 0.2)",
          padding: 2,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", color: "white" }}
        >
          <CloseIcon
            sx={{
              backgroundColor: "#424147",
              borderRadius: "50%",
              fontSize: "18px",
              padding: 0.2,
              cursor: "pointer",
            }}
            onClick={closeSettingsModal}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: "bold",
              color: "white",
              fontSize:"24px",
            }}
          >
            Settings
          </Typography>
        </Box>
        <br />
        
        {/* About Us */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: 2,
            backgroundColor: "#424147",
            color: "white",
            borderRadius: "10px",
            cursor: "pointer",
            marginBottom: 1,
          }}
          onClick={() => {
            openContactModal();
          }}
        >
          <Typography
            sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: "medium" }}
          >
            About us
          </Typography>
          <ChevronRightIcon />
        </Box>

        {/* Music Toggle */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 2,
            backgroundColor: "#424147",
            color: "white",
            borderRadius: "10px",
            marginBottom: 1,
          }}
        >
          <Typography
            sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: "medium" }}
          >
            Music
          </Typography>
          <IOSSwitch checked={isAudioPlaying} onChange={handleAudioToggle} />
        </Box>

        {/* Joystick Position Toggle */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 2,
            backgroundColor: "#424147",
            color: "white",
            borderRadius: "10px",
            marginBottom: 1,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: "medium" }}
            >
              Joystick Position
            </Typography>
            <Typography
              sx={{ 
                fontFamily: "'Poppins', sans-serif", 
                fontSize: "12px",
                color: "rgba(255, 255, 255, 0.7)"
              }}
            >
              {joystickPosition === "left" ? "Left" : "Right"}
            </Typography>
          </Box>
          <IOSSwitch 
            checked={joystickPosition === "right"} 
            onChange={handleJoystickToggle} 
          />
        </Box>



        {/* Touch Sensitivity Buttons */}
        <Box
          sx={{
            padding: 2,
            backgroundColor: "#424147",
            color: "white",
            borderRadius: "10px",
            marginBottom: 1,
          }}
        >
          <Typography
            sx={{ 
              fontFamily: "'Poppins', sans-serif", 
              fontWeight: "medium",
              marginBottom: 2
            }}
          >
            Touch Sensitivity
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {[
              { label: "Low", value: 0.5 },
              { label: "Med", value: 1.0 },
              { label: "High", value: 1.5 },
              { label: "Very High", value: 2.0 }
            ].map((option) => (
              <StyledButton
                key={option.label}
                onClick={() => handleTouchSensitivityChange(option.value)}
                isActive={touchSensitivityMultiplier === option.value}
              >
                {option.label}
              </StyledButton>
            ))}
          </Box>
        </Box>

        {/* Player Speed Buttons */}
        <Box
          sx={{
            padding: 2,
            backgroundColor: "#424147",
            color: "white",
            borderRadius: "10px",
            marginBottom: 1,
          }}
        >
          <Typography
            sx={{ 
              fontFamily: "'Poppins', sans-serif", 
              fontWeight: "medium",
              marginBottom: 2
            }}
          >
            Player Speed
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {[
              { label: "Low", value: 0.5 },
              { label: "Med", value: 1.0 },
              { label: "High", value: 1.5 },
              { label: "Very High", value: 2.0 }
            ].map((option) => (
              <StyledButton
                key={option.label}
                onClick={() => handlePlayerSpeedChange(option.value)}
                isActive={playerSpeedMultiplier === option.value}
              >
                {option.label}
              </StyledButton>
            ))}
          </Box>
        </Box>
      </Card>
    </div>
  );
};

export default SettingsModal;
