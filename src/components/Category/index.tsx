import { Container, CardCategory, TextCategory, Title, Content, } from './styles';

interface ICategory {
  category: number;
  setCategory: (e: any) => void;
}

export function Category({ category, setCategory }: ICategory) {
  const categorys = [
    { id: 0, name: "Flooding" },
    { id: 1, name: "Informed Flooding" },
    { id: 2, name: "Random Walk" },
    { id: 3, name: "Informed Random Walk" },
  ];

  function handleChangeCategory(id: number) {
    setCategory(id);
  }

  const activeCategory = category;

  return (
    <Container>
      <Title>Ordenar por</Title>

      <Content>
        {categorys.map(category =>
          <CardCategory
            key={category.id}
            active={category.id === activeCategory}
            onClick={() => handleChangeCategory(category.id)}
          >
            <TextCategory active={category.id === activeCategory}>
              {category.name}
            </TextCategory>
          </CardCategory>
        )}
      </Content>

    </Container>
  )

}