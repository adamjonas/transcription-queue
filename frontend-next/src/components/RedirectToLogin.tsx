import { Container, Heading, Text } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

const RedirectToLogin = () => {
  const [countdown, setCountdown] = useState(8);

  const handleCountdown = useCallback(() => {
    if (countdown < 2) {
      signIn("github");
      return true;
    }
    setCountdown((prev) => (prev -= 1));
    return false;
  }, [countdown]);

  useEffect(() => {
    const secondsCountdown = setInterval(() => {
      const shouldClearCountdown = handleCountdown();
      if (shouldClearCountdown) {
        clearInterval(secondsCountdown);
      }
    }, 1000);

    return () => {
      clearInterval(secondsCountdown);
    };
  }, [handleCountdown]);

  return (
    <Container
      maxW="container.l"
      minH="100%"
      mx="auto"
      textAlign="center"
      pt={5}
    >
      <Heading>You have to be Signed In to view this page</Heading>
      <Text mt={5}>Redirecting to login in {countdown} ... </Text>
    </Container>
  );
};

export default RedirectToLogin;
