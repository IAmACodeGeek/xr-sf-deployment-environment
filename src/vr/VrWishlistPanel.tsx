import { useComponentStore } from "@/stores/ZustandStores";
import useWishlist from "../UI/Components/WishlistHook.tsx";
import { Container, Text, Image, SuspendingImage, Svg } from "@react-three/uikit";
import { Button, Card } from "@react-three/uikit-apfel";
import { DynamicImage } from "./DynamicImage";

export default function VrWishlistPanel() {
  const  { wishlist, removeItemsFromWishlist, clearWishlist }  = useWishlist();
  const  products  = useComponentStore(state => state.products);
  return (
    <Container width="100%" height="100%" flexDirection="column" alignItems="center" justifyContent="space-between" gap={16}>
    <Text fontSize={24} color="#fff">Your Wishlist</Text>

    <Container width="95%" height="70%" maxHeight={"70%"} overflow={"scroll"}  borderRadius={16} padding={8}>
      <Container width="100%" height="100%" flexDirection="column" gap={12}>
        {wishlist && wishlist?.map((productId: number) => {
          const product = products.find((product) => product.id === productId);
          if (!product) return null;
         const deleteItem = () => {
          removeItemsFromWishlist([product.id]);
        };

          return (
            <Card key={product.id} backgroundColor="#424147" borderRadius={16} padding={8} width="100%" height={66} alignItems="center" justifyContent="space-between" flexDirection="row">
              <Container width={96} height={96} alignItems="center" justifyContent="center">
                <DynamicImage imageUrl={product.images[0].src|| "/fox-logo.png"} width={50} height={50} borderRadius={12} />
              </Container>

              <Container width="60%" height="100%" flexDirection="column" alignItems="flex-start" justifyContent="center" gap={6}>
                <Text fontSize={14} color="#fff">{product.title}</Text>
              </Container>

              <Container width="30%" height="100%" flexDirection="row" alignItems="center" justifyContent="flex-end" gap={8}>
                <Card width={28} height={28} borderRadius={6} alignItems="center" justifyContent="center" backgroundColor="#3A3A3A" onClick={deleteItem}>
                <DynamicImage imageUrl={"/svg/trash.png"}   width={80} height={80} borderRadius={12} />
                </Card>
              </Container>
            </Card>
          );
        })}
      </Container>
    </Container>

    <Container width="90%" height={56} flexDirection="row" alignItems="center" justifyContent="center" gap={16}>
      <Card alignItems="center" justifyContent="center" width="45%" height={40} backgroundColor="#424147" borderRadius={24} onClick={clearWishlist}>
        <Text fontSize={12} color="#fff">Empty Wishlist</Text>
      </Card>
    </Container>
  </Container>
  );
}


