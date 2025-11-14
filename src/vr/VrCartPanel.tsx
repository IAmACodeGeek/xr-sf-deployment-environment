import { Container, Text, Image } from "@react-three/uikit";
import { Card } from "@react-three/uikit-apfel";
import { useCart } from "@shopify/hydrogen-react";
import { useXRStore } from "@react-three/xr";
import { useEffect, useRef, useState } from "react";
import { DynamicImage } from "./DynamicImage";

export default function VrCartPanel() {
  const { lines, checkoutUrl, linesRemove, linesUpdate } = useCart();

  const store = useXRStore();

  const handleCheckout = () => {
    if ((lines?.length || 0) <= 0) {
      return;
    }
    if (checkoutUrl) {
      store.getState().session?.end();
      window.open(checkoutUrl, "_blank", "noopener,noreferrer");
      return;
    }
  };

  const emptyCart = () => {
    if ((lines?.length || 0) > 0) {
      if(lines) {
        const lineIds = lines.map((item) => item?.id || "");
        linesRemove(lineIds);
      }
      return;
    }
  };

  return (
    <Container width="100%" height="100%" flexDirection="column" alignItems="center" justifyContent="space-between" gap={16}>
      <Text fontSize={24} color="#fff">Your Cart</Text>

      <Container width="95%" height="70%" maxHeight={"70%"} overflow={"scroll"}  borderRadius={16} padding={8}>
        <Container width="100%" height="100%" flexDirection="column" gap={12}>
          {Array.isArray(lines) && lines.length > 0 ? lines.map((line) => {
            const decrement = () => {
              if ((line?.quantity || 0) > 0) {
                linesUpdate([
                  { id: line?.id || "", quantity: (line?.quantity || 0) - 1 },
                ]);
              }
            };
            const increment = () => {
              if ((line?.quantity || 0) < 5) {
                linesUpdate([
                  { id: line?.id || "", quantity: (line?.quantity || 0) + 1 },
                ]);
              }
            };
            const deleteItem = () => {
              linesUpdate([{ id: line?.id || "", quantity: 0 }]);
            };

            return (
              <Card key={line?.id} backgroundColor="#424147" borderRadius={16} padding={8} width="100%" height={66} alignItems="center" justifyContent="space-between" flexDirection="row">
                <Container width={96} height={96} alignItems="center" justifyContent="center">
                  <DynamicImage imageUrl={line?.merchandise?.image?.url || "/fox-logo.png"} width={60} height={60} borderRadius={12}  />
                </Container>

                <Container width="60%" height="100%" flexDirection="column" alignItems="flex-start" justifyContent="center" gap={6}>
                  <Text fontSize={14} color="#fff">{line?.merchandise?.product?.title}</Text>
                  <Text fontSize={12} color="#cacaca">{`${line?.merchandise?.price?.currencyCode || ""} ${line?.merchandise?.price?.amount || ""}`}</Text>
                </Container>

                <Container width="30%" height="100%" flexDirection="row" alignItems="center" justifyContent="flex-end" gap={8}>
                  <Card width={28} height={28} borderRadius={14} alignItems="center" justifyContent="center" backgroundColor={(line?.quantity || 0) > 1 ? "#3A3A3A" : "#2A2A2A"} onClick={decrement}>
                    <Text fontSize={14} color={(line?.quantity || 0) > 1 ? "#fff" : "#666666"}>-</Text>
                  </Card>
                  <Text fontSize={14} color="#c2c2c2">{line?.quantity}</Text>
                  <Card width={28} height={28} borderRadius={14} alignItems="center" justifyContent="center" backgroundColor={(line?.quantity || 0) < 5 ? "#3A3A3A" : "#2A2A2A"} onClick={increment}>
                    <Text fontSize={14} color={(line?.quantity || 0) < 5 ? "#fff" : "#666666"}>+</Text>
                  </Card>
                  <Card hover={{backgroundColor : "rgb(146, 145, 145)"}} width={28}  height={28} borderRadius={6} alignItems="center" justifyContent="center" backgroundColor="#3A3A3A" onClick={deleteItem}>
                  <DynamicImage imageUrl={"/svg/trash.png"} width={80} height={80} borderRadius={12}  />
                  </Card>
                </Container>
              </Card>
            );
          }) : <Container width="100%" height="100%"  alignItems="center" justifyContent="center" gap={16}><Text fontSize={14} color="#fff">No items in cart</Text></Container>}
        </Container>
      </Container>

      <Container width="90%" height={56} flexDirection="row" alignItems="center" justifyContent="center" gap={16}>
        <Card alignItems="center" justifyContent="center" width="45%" height={40} backgroundColor="#424147" borderRadius={24} onClick={emptyCart}>
          <Text fontSize={12} color="#fff">Empty Cart</Text>
        </Card>
        <Card alignItems="center" justifyContent="center" width="45%" height={40} backgroundColor="#424147" borderRadius={24} onClick={handleCheckout}>
          <Text fontSize={12} color="#fff">Checkout</Text>
        </Card>
      </Container>
    </Container>
  );
}


