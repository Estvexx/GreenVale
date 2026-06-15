# GreenVale

GreenVale é um jogo 2D desenvolvido no âmbito da unidade curricular de
Tecnologias Multimédia, utilizando Phaser 3. O projeto combina agricultura,
exploração, gestão de recursos e combate numa perspetiva top-down.

## Elementos do grupo

- Francisco Manuel Pinheiro Esteves - n.º 32181
- Vasco Gavino - n.º 32746

## Tecnologias utilizadas

- Phaser 3.90.0, instalado através de npm
- TypeScript 6
- Vite 8
- HTML5 e CSS3
- Física Arcade do Phaser
- Tiled, para a construção dos mapas

Optámos por utilizar TypeScript porque permite definir tipos para os dados do
jogo, inventário, lojas, efeitos e ficheiros de gravação. Desta forma,
conseguimos detetar alguns erros durante o desenvolvimento e manter o código
mais organizado. O Vite é utilizado como servidor de desenvolvimento e para
gerar a versão final do projeto.

## Descrição do jogo

O objetivo de GreenVale é desenvolver uma quinta através da compra de sementes,
plantação, rega, colheita e venda de produtos. O jogador começa com recursos
limitados e pode ganhar moedas para comprar novas ferramentas, armas e
sementes.

Existe também uma área de combate onde o jogador pode enfrentar diferentes
criaturas. Ao derrotar inimigos, pode receber Boss Tokens, que são utilizados
na compra de efeitos e skins para as ferramentas.

O jogo inclui um sistema de progressão por níveis. Algumas zonas de cultivo só
ficam disponíveis quando o jogador atinge o nível necessário.

## Funcionalidades implementadas

- Movimento da personagem através do teclado ou do rato
- Mapa principal da quinta e mapa dedicado ao combate
- Colisões com edifícios, objetos e limites do mapa
- Sistema de agricultura com várias culturas e fases de crescimento
- Ciclo de dia e noite com alterações visuais e impacto no crescimento
- Inventário com 28 espaços e barra rápida com 8 espaços
- Armazém para guardar itens
- Lojas de ferramentas, sementes, venda de produtos e skins
- Sistema económico com moedas e Boss Tokens
- Sistema de níveis e experiência
- Combate contra zombie, slime e urso
- Armas com diferentes valores de dano
- Efeitos temporários e permanentes
- Skins para a personagem e para algumas ferramentas
- Sistema de gravação, carregamento, exportação e importação em JSON
- Música de fundo e efeitos sonoros
- Menu principal, menu de definições e manual dentro do jogo
- Suporte para português, inglês e espanhol
- Opções de ecrã completo, áudio e esquema de controlos
- Animações, partículas, iluminação, transições e efeitos de câmara

## Regras e jogabilidade

Para iniciar a produção, o jogador deve comprar sementes e possuir as
ferramentas necessárias. A enxada permite escolher e plantar uma semente numa
zona de cultivo. Depois de plantada, a cultura deve ser regada com um balde de
água. Quando atingir a última fase de crescimento, pode ser colhida com a
foice.

Os produtos recolhidos podem ser vendidos no mercado para obter moedas. As
moedas permitem comprar mais sementes, ferramentas e armas. A experiência
obtida através de várias ações aumenta o nível da quinta e desbloqueia novas
áreas de cultivo.

Na área de combate, o jogador deve selecionar uma arma e clicar nos inimigos
para causar dano. Os inimigos podem deixar Boss Tokens, usados para comprar
efeitos especiais e skins.

## Controlos

| Tecla ou ação   | Função                                       |
| --------------- | -------------------------------------------- |
| `WASD` ou setas | Mover a personagem                           |
| Clique do rato  | Mover a personagem para o local selecionado  |
| `1` a `8`       | Selecionar um espaço da barra rápida         |
| Roda do rato    | Alterar o espaço selecionado                 |
| `E`             | Abrir ou fechar o inventário                 |
| `F`             | Interagir com lojas, poço, armazém e portais |
| `Q`             | Abrir ou fechar o menu de efeitos            |
| `Esc`           | Fechar o menu ou janela atualmente aberta    |
| `K`             | Guardar o progresso no navegador             |
| `L`             | Carregar o progresso guardado                |
| `M`             | Exportar o progresso para um ficheiro JSON   |

As ações relacionadas com a agricultura também podem ser efetuadas através do
rato, desde que o jogador tenha a ferramenta correta selecionada e esteja
próximo do local.

## Idiomas

O jogo encontra-se disponível em:

- Português
- Inglês
- Espanhol

O idioma pode ser alterado no menu de definições. As traduções estão
organizadas em ficheiros JSON separados, localizados na pasta `src/i18n`.

## Como executar

### Requisitos

- Node.js instalado
- npm
- Um navegador moderno, como Chrome, Firefox ou Edge

### Desenvolvimento

Depois de clonar ou descarregar o repositório, abrir um terminal na raiz do
projeto e executar:

```bash
npm install
npm run dev
```

O terminal apresenta o endereço local onde o jogo pode ser aberto no
navegador. Normalmente será semelhante a `http://localhost:5173`.

### Criar a versão final

```bash
npm run build
```

Este comando verifica o código TypeScript e cria a versão final na pasta
`dist`.

Para testar localmente a versão criada:

```bash
npm run preview
```

## Estrutura do projeto

```text
GreenVale/
|-- public/
|   `-- assets/
|       |-- audio/
|       |-- images/
|       `-- map/
|-- src/
|   |-- animations/
|   |-- camera/
|   |-- data/
|   |-- entities/
|   |-- i18n/
|   |-- input/
|   |-- lights/
|   |-- map/
|   |-- scenes/
|   |-- sounds/
|   |-- systems/
|   |-- UI/
|   `-- main.ts
|-- index.html
|-- package.json
|-- tsconfig.json
`-- vite.config.ts
```

O código foi separado por responsabilidade. As cenas controlam as diferentes
áreas do jogo, os sistemas tratam da lógica principal e a pasta `UI` contém os
elementos da interface.

## Aspetos multimédia

O projeto utiliza imagens PNG para personagens, ferramentas, culturas,
elementos dos mapas e interface. As animações dos inimigos são realizadas
através de spritesheets. Os mapas foram criados no Tiled e são carregados pelo
Phaser através de ficheiros TMJ.

Os ficheiros de áudio utilizam o formato OGG, por ser um formato comprimido e
adequado à utilização no navegador. Foram incluídas músicas diferentes para a
quinta e para a área de combate, além de sons para cliques, erros, passos,
ataques, inventário e ambiente.

As imagens dos objetos pequenos possuem dimensões reduzidas e adequadas ao
tamanho em que são apresentadas. As imagens maiores são utilizadas como mapas,
fundos ou elementos do menu. O conjunto de assets do jogo ocupa
aproximadamente 8,6 MB.

## Gravação do progresso

O progresso pode ser guardado no armazenamento local do navegador através da
tecla `K`. A tecla `L` carrega a gravação existente e a tecla `M` permite
exportar os dados para um ficheiro JSON.

No menu principal também é possível importar um ficheiro JSON criado
anteriormente. A opção "Novo jogo" elimina a gravação principal e repõe os
valores iniciais.

## Repositório

<https://github.com/Estvexx/GreenVale>

Projeto desenvolvido para o Trabalho Prático 2 de Tecnologias Multimédia,
ano letivo 2025/2026.

