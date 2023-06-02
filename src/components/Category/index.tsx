import { Container, CardCategory, TextCategory, Title, Content, } from './styles';

/* interface ICategory {
} */

export function Category(/* { }: ICategory */) {
  const categorys = [
    { id: 0, name: "Flooding" },
    { id: 1, name: "Informed Flooding" },
    { id: 2, name: "Random Walk" },
    { id: 3, name: "Informed Random Walk" },
  ];

  const activeSortedBy = 0;

  return (
    <Container>
      <Title>Ordenar por</Title>
      <Content>

        {categorys.map(category =>
          <CardCategory
            key={category.id}
            active={activeSortedBy === category.id}
          >
            <TextCategory active={activeSortedBy === category.id}>
              {category.name}
            </TextCategory>
          </CardCategory>
        )}
      </Content>

    </Container>
  )

}