import { Category } from "../components/Category"
import { Input } from "../components/Input"
import { ButtonStyle, Container, Content, ContentSide, LeftSide, RightSide, Title } from "./styles"

function App() {

  return (
    <Container>
      <Content>
        <Title>Buscas em sistemas P2P</Title>

        <ContentSide>

          <LeftSide>

          </LeftSide>
          <RightSide>
            <Input
              type={"text"}
              label={"Node ID"}
              placeholder={"0"}
              value={""}
              setValue={() => ''}
            />
            <Input
              type={"text"}
              label={"Resource ID"}
              placeholder={"0"}
              value={""}
              setValue={() => ''}
            />
            <Input
              type={"text"}
              label={"TTL"}
              placeholder={"0"}
              value={""}
              setValue={() => ''}
            />
            <Category />

            <ButtonStyle>Buscar</ButtonStyle>

          </RightSide>
        </ContentSide>
      </Content>
    </Container>
  )
}

export default App
