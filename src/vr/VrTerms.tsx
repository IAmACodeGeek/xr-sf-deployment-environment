import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Container, Root, Text } from "@react-three/uikit";
import { Card, Defaults } from "@react-three/uikit-apfel";
import { useComponentStore } from "@/stores/ZustandStores";
import { DynamicImage } from "./DynamicImage";

export default function VrTerms({environmentName,scale,position }: {environmentName: string, scale: [number, number, number], position: [number, number, number]}) {
  const { camera } = useThree();
  const uiRef = useRef(null);
  const termsOpen = useComponentStore((state) => state.isTermsModalOpen);
  const closeTermsModal = useComponentStore((state) => state.closeTermsModal);
  const openSettingsModal = useComponentStore((state) => state.openSettingsModal);
  scale = scale || [1, 1, 1];
  position = position || [0.75, 0, -9];
  useEffect(() => {
    const uiMesh = uiRef.current;
    if (uiMesh) {
      // Set the position slightly in front of the camera (e.g., 1 meter)
      // and center it on the screen
      uiMesh.position.set(position[0], position[1], position[2]);
      uiMesh.scale.set(scale[0], scale[1], scale[2]);
      // // Ensure the UI group is a direct child of the camera
      camera.add(uiMesh);
    }

    // Cleanup: remove the group when the component unmounts
    return () => {
      if (uiMesh) {
        camera.remove(uiMesh);
      }
    };
  }, [camera]);

  return (
    <group ref={uiRef}>
      <Defaults  renderOrder={1000}>
        <Root>
          <Container
            display={termsOpen ? "flex" : "none"}
            flexDirection="column"
            alignItems="flex-start"
            gap={20}
          >
            <Container flexDirection="column" alignItems="center" gap={16}>
              <Card
                width={500}
                height={400}
                borderRadius={32}
                padding={32}
                backgroundColor="#111318"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <Container
                  padding={20}
                  width={"100%"}
                  positionType={"absolute"}
                  flexDirection="row"
                  height={"100%"}
                  justifyContent={"space-evenly"}
                  alignItems="flex-start"
                  gap={16}
                >
                  <Text fontSize={20} color="#fff">
                    Terms and Conditions
                  </Text>
                  <Container
                    positionType={"absolute"}
                    paddingRight={20}
                    width={"100%"}
                    height={30}
                    justifyContent="flex-end"
                    onClick={() => {
                      openSettingsModal();
                      closeTermsModal();
                    }}
                  >
                    <DynamicImage
                      imageUrl="/svg/close.png"
                      width={5}
                      height={5}
                    />
                  </Container>
                </Container>
                <Container
                height={300}
                maxHeight={300}
                overflow={"scroll"}
                  marginTop={50}
                  flexDirection="column"
                  alignItems="flex-start"
                  gap={16}
                >
                    <Card height={"auto"} >
                  <Text padding={12} >
                    Welcome to {environmentName}. These Terms and Conditions govern
                    your use of our website, mobile application, and services.
                    By accessing or using our services, you agree to comply with
                    these terms. If you do not agree, please refrain from using
                    our platform.
                  </Text>
                    </Card>
                  
                    <Card padding={12} height={"auto"} flexDirection={"column"}>
                    <Text  fontSize={20} >1. Eligibility</Text>
                    <Text  >
                      By using our services, you confirm that you are at least
                      18 years old or have legal parental/guardian consent. You
                      also warrant that any information provided is accurate and
                      complete.
                    </Text>
                    </Card>
                    
                  <Card padding={12} height={"auto"} flexDirection={"column"}>
                    <Text  fontSize={20} >2. Orders and Payments</Text>
                    <Text  >
                      All purchases made through our website or mobile application
                      are subject to availability. We reserve the right to cancel
                      or refuse any order at our discretion.
                    </Text>
                  </Card>
                  <Card padding={12} height={"auto"} flexDirection={"column"}>
                    <Text  fontSize={20} >3. Shipping and Delivery</Text>
                    <Text  >
                      We aim to process and ship orders within the estimated delivery timeframe. Shipping charges and estimated delivery times are provided at checkout. Delays due to unforeseen circumstances (e.g., weather conditions, strikes) are beyond our control. Customers must provide accurate shipping information. We are not responsible for delivery failures due to incorrect details.
                    </Text>
                  </Card>
                  <Card padding={12} height={"auto"} flexDirection={"column"}>
                    <Text  fontSize={20} >4. Returns and Refunds</Text>
                    <Text  >
                      We offer a return policy for eligible products within days of delivery. Products must be unused, in original packaging, and accompanied by proof of purchase. Refunds will be processed after verifying the returned item’s condition. Certain items (e.g., personalized or final sale products) may not be eligible for returns.
                    </Text>
                  </Card>
                  <Card padding={12} height={"auto"} flexDirection={"column"}>
                    <Text  fontSize={20} >5. User Conduct</Text>
                    <Text  >
                      Users must not engage in any fraudulent, illegal, or harmful activities on our platform. Harassment, abusive language, and disruptive behavior will not be tolerated. Any misuse of content, trademarks, or intellectual property is strictly prohibited.
                    </Text>
                  </Card>
                  <Card padding={12} height={"auto"} flexDirection={"column"}>
                    <Text  fontSize={20} >6. Intellectual Property</Text>
                    <Text  >
                      All content on the website, including text, images, and logos, is the property of {environmentName} and protected by copyright laws. Unauthorized reproduction, distribution, or modification of any content is prohibited.
                    </Text>
                  </Card>
                  <Card padding={12} height={"auto"} flexDirection={"column"}>
                    <Text  fontSize={20} >7. Limitation of Liability</Text>
                    <Text  >
                      {environmentName} shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. We make reasonable efforts to ensure accurate product descriptions and images, but we do not guarantee absolute accuracy.
                    </Text>
                  </Card>
                  <Card padding={12} height={"auto"} flexDirection={"column"}>
                    <Text  fontSize={20} >8. Termination</Text>
                    <Text  >
                      We reserve the right to suspend or terminate your access to our platform if you violate these terms or engage in prohibited activities.
                    </Text>
                  </Card>
                  <Card padding={12} height={"auto"} flexDirection={"column"}>
                    <Text  fontSize={20} >9. Amendments to Terms</Text>
                    <Text  >
                      We may update these Terms and Conditions periodically. Continued use of our services after any modifications implies acceptance of the updated terms.
                    </Text>
                  </Card>
                  <Card padding={12} height={"auto"} flexDirection={"column"}>
                    <Text  fontSize={20} >10. Governing Law</Text>
                    <Text  >
                      These Terms and Conditions shall be governed by and interpreted in accordance with the laws of India. Thank you for shopping with {environmentName}. We appreciate your trust and support!
                    </Text>
                  </Card>
                </Container>
              </Card>
            </Container>
          </Container>
        </Root>
      </Defaults>
    </group>
  );
}
