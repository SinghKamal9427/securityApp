import { Stack, useLocalSearchParams } from "expo-router";
import { Container } from "~/components/Container";
import WelcomeContent from "~/content/welcome";


export default function Welcome() {
    const { name } = useLocalSearchParams();

    return (
        <Container>
            <WelcomeContent/>
        </Container>
    )
}