# Trabalho P2 · Delivery — Mesa do Pátio

## Integrantes
- **Integrante 1:** Keinan De Souza Cruz    
- **Integrante 2:** Maycon Douglas Almeida Paixão

## GitHub
Link do repositório: [github.com/KeinanSZ/app-delivery](https://github.com/KeinanSZ/app-delivery).

## Como executar
1. Instale o Node.js (versão LTS).
2. Na pasta `delivery-app`, execute `npm install`.
3. Confira se o arquivo `.env` contém `VITE_API_URL=https://dummyjson.com`.
4. Execute `npm run dev` e abra a URL indicada no terminal.
5. Para validar a versão de entrega, execute `npm run build`.

## Conta de demonstração
- Usuário: `emilys`
- Senha: `emilyspass`

## Funcionalidades
- Login com token, sessão persistida e rotas protegidas.
- Consulta, busca e atualização do cardápio.
- Cadastro, edição e exclusão com confirmação.
- Preço calculado por `R$ 15,00 + R$ 0,50 × (preparo + cozimento)`.
- Layout responsivo para celular; erros exibem mensagem e status HTTP.

O DummyJSON simula as operações de escrita. Alterações ficam no estado da página e somem ao recarregar. Os pratos criados recebem o ID 51; se edição ou exclusão retornar 404, a interface avisa e aplica a alteração somente nesta sessão.

## Organização para entrega
- Publiquem o repositório no GitHub e incluam commits reais dos dois integrantes.
- Os nomes da dupla e o link do GitHub já estão preenchidos.
- Gerem um ZIP da pasta do projeto **sem `node_modules`** e enviem o mesmo arquivo no AVA.

## Divisão da dupla
- Keinan: estrutura inicial, autenticação e integração com a API.
- Maycon: componentes do cardápio, operações de pratos e documentação.
