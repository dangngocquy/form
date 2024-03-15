import React, { useEffect } from "react";
import { BsCheck } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";
import { TbExclamationMark } from "react-icons/tb";
import useStateArray from "./function/useStateArray";

const Notification = ({ type, content, onClose }) => {
  const { showNotification, setShowNotification } = useStateArray();
  let bgColor;
  let icon;

  switch (type) {
    case "success":
      bgColor = "#32a846";
      icon = <BsCheck size={40} className="icon-cart-no" />;
      break;
    case "error":
      bgColor = "#d9534f";
      icon = <IoIosClose size={40} className="icon-cart-no" />;
      break;
    case "warning":
      bgColor = "#f08d3c";
      icon = <TbExclamationMark size={40} className="icon-cart-no" />;
      break;
    default:
      bgColor = "transparent";
      icon = null;
  }

  useEffect(() => {
    setShowNotification(true);

    const timeoutId = setTimeout(() => {
      setShowNotification(false);
      onClose();
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [type, content, onClose, setShowNotification]);

  return (
    <div className="flex items-center justify-center">
      <div className={`Niso-Notification ${showNotification ? "show-notificiation" : ""}`} style={{ backgroundColor: bgColor }}>
        <span>{icon}</span>
        <div className="Niso-Notification-text">{content}</div>
      </div>
    </div>
  );
};

export default Notification;
