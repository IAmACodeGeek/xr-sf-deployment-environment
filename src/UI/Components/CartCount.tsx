import { useCart } from "@shopify/hydrogen-react";

const CartCount = () => {
  const { lines } = useCart();

  // Calculate total quantity from all cart lines
  const totalQuantity = lines?.reduce((total, line) => {
    return total + (line?.quantity || 0);
  }, 0) || 0;

  // Don't render if cart is empty
  if (totalQuantity === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "-8px",
        right: "-8px",
        backgroundColor: "#FF7F32",
        color: "white",
        borderRadius: "50%",
        width: "20px",
        height: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
        fontWeight: "bold",
        fontFamily: "'Poppins', sans-serif",
        border: "2px solid rgba(0, 0, 0, 0.8)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
        zIndex: 10,
        minWidth: "20px",
        minHeight: "20px",
      }}
    >
      {totalQuantity > 99 ? "99+" : totalQuantity}
    </div>
  );
};

export default CartCount; 