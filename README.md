# Loja Virtual - Backend Spring Boot + n8n + IA

Projeto desenvolvido para a disciplina **Integração de BackEnd, Tecnologias Web e Inteligência Artificial**.

Tema: **Loja Virtual**

O projeto simula uma loja virtual onde o cadastro de um pedido aciona uma automação no **n8n**.  
A automação utiliza **Inteligência Artificial**, por meio do **Google Gemini**, para analisar o pedido, classificar o perfil do cliente, gerar recomendações de produtos e criar uma mensagem personalizada.

---

## Objetivo

Desenvolver uma aplicação de e-commerce onde:

1. O frontend React envia um pedido para o backend Spring Boot;
2. O Spring Boot salva o pedido no banco de dados H2;
3. O Spring Boot envia os dados do pedido para um Webhook do n8n;
4. O n8n utiliza IA para analisar o pedido;
5. A IA gera:
   - Perfil do cliente;
   - Produtos recomendados;
   - Cupom de desconto;
   - Mensagem personalizada;
6. O n8n envia essas informações de volta ao Spring Boot;
7. O React consulta e exibe o resultado da análise ao usuário.

---

## Tecnologias utilizadas

- Java 17
- Spring Boot 3
- Spring Web
- Spring Data JPA
- H2 Database
- Maven
- React
- n8n
- Google Gemini
- ngrok
- GitHub

---

## Fluxo geral da aplicação

```text
React
  ↓
POST /pedidos
  ↓
Spring Boot salva o pedido no banco H2
  ↓
Spring Boot envia o JSON do pedido para o Webhook do n8n
  ↓
n8n envia os dados para a IA Gemini
  ↓
Gemini gera a análise do pedido
  ↓
n8n transforma a resposta da IA no formato esperado pelo backend
  ↓
n8n envia um PUT para o Spring Boot
  ↓
Spring Boot atualiza o pedido com a análise da IA
  ↓
React consulta e exibe o resultado ao usuário
```

---

## Estrutura de pastas

```text
e-commerce-serratec/
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/
│   │       │       └── lojavirtual/
│   │       │           ├── config/
│   │       │           ├── controller/
│   │       │           ├── dto/
│   │       │           ├── exception/
│   │       │           ├── model/
│   │       │           ├── repository/
│   │       │           └── service/
│   │       └── resources/
│   │           └── application.properties
│   ├── pom.xml
│   └── README.md
├── frontend/
├── .gitignore
└── README.md
```

---

# Backend Spring Boot

O backend foi desenvolvido em **Spring Boot**.

Responsabilidade principal:

- Receber pedidos da aplicação frontend;
- Salvar pedidos no banco de dados;
- Enviar os dados do pedido para o n8n;
- Receber a análise da IA;
- Atualizar o pedido com o resultado da análise.

---

## Estrutura do backend

```text
src/main/java/com/lojavirtual/
├── config/        → configurações, como CORS
├── controller/    → endpoints REST
├── dto/           → objetos de entrada e saída
├── exception/     → tratamento de erros
├── model/         → entidade Pedido
├── repository/    → acesso ao banco com JPA
└── service/       → regras de negócio e integração com n8n
```

---

## Banco de dados

O projeto utiliza **H2 Database local em arquivo**, facilitando os testes durante o desenvolvimento.

Configuração atual em:

```text
backend/src/main/resources/application.properties
```

```properties
spring.datasource.url=jdbc:h2:file:./data/lojavirtual
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
n8n.webhook.url=https://jpn8n.app.n8n.cloud/webhook-test/pedido
server.port=8080
```

---

## Acessar o H2 Console

Com o backend rodando, acesse:

```text
http://localhost:8080/h2-console
```

Configuração:

```text
JDBC URL: jdbc:h2:file:./data/lojavirtual
User Name: sa
Password: deixar vazio
```

---

## Como rodar o backend

Entre na pasta do backend:

```bash
cd backend
```

Execute:

```bash
mvn spring-boot:run
```

Ou, se estiver usando VSCode, rode pelo **Spring Boot Dashboard**.

A API sobe em:

```text
http://localhost:8080
```

---

# Endpoints do backend

## 1. Criar pedido

```http
POST /pedidos
```

Exemplo de body:

```json
{
  "cliente": "Maria",
  "cidade": "Petrópolis",
  "valorTotal": 820,
  "produtos": [
    "Notebook",
    "Mouse Gamer"
  ]
}
```

Ao criar um pedido, o Spring Boot:

1. Salva o pedido no banco de dados;
2. Envia os dados do pedido para o Webhook do n8n;
3. Retorna o pedido salvo.

Observação: se o n8n estiver offline, o pedido continua salvo. O erro de envio para o n8n aparece apenas no log da aplicação.

---

## 2. Listar pedidos

```http
GET /pedidos
```

Retorna todos os pedidos cadastrados.

---

## 3. Buscar pedido por ID

```http
GET /pedidos/{id}
```

Exemplo:

```http
GET /pedidos/1
```

---

## 4. Atualizar análise da IA

```http
PUT /pedidos/{id}/analise
```

Esse endpoint é chamado pelo n8n depois que a IA analisa o pedido.

Exemplo de body:

```json
{
  "perfilCliente": "Cliente Premium",
  "recomendacoes": "Headset Gamer, SSD 1TB, Mochila para Notebook",
  "cupomDesconto": "TECH10",
  "mensagemIA": "Obrigado pela compra!"
}
```

---

## 5. Deletar pedido

```http
DELETE /pedidos/{id}
```

Remove um pedido pelo ID.

---

# Testando o backend manualmente

## Criar pedido

No Postman, Insomnia ou Thunder Client:

```http
POST http://localhost:8080/pedidos
```

Body:

```json
{
  "cliente": "João",
  "cidade": "Petrópolis",
  "valorTotal": 950,
  "produtos": [
    "Notebook",
    "Mouse Gamer"
  ]
}
```

---

## Listar pedidos

```http
GET http://localhost:8080/pedidos
```

---

## Buscar pedido por ID

```http
GET http://localhost:8080/pedidos/1
```

---

## Atualizar análise manualmente

Esse teste simula o retorno do n8n:

```http
PUT http://localhost:8080/pedidos/1/analise
```

Body:

```json
{
  "perfilCliente": "Cliente Premium",
  "recomendacoes": "Headset Gamer, SSD 1TB, Mochila para Notebook",
  "cupomDesconto": "TECH10",
  "mensagemIA": "Obrigado pela compra! Você ganhou um cupom especial para sua próxima compra."
}
```

---

## Conferir no banco H2

No H2 Console, é possível rodar:

```sql
SELECT * FROM PEDIDOS;
```

Para visualizar os produtos dos pedidos:

```sql
SELECT * FROM PEDIDO_PRODUTOS;
```

Para juntar pedido e produtos:

```sql
SELECT 
    p.ID,
    p.CLIENTE,
    p.CIDADE,
    p.VALOR_TOTAL,
    pp.PRODUTO
FROM PEDIDOS p
JOIN PEDIDO_PRODUTOS pp ON p.ID = pp.PEDIDO_ID;
```

---

# Integração com n8n + IA

Responsabilidade da automação:

- Criar o Webhook no n8n;
- Receber o JSON do pedido enviado pelo Spring Boot;
- Configurar o nó de IA com Google Gemini;
- Criar o prompt para análise do pedido;
- Transformar a resposta da IA no formato esperado pelo backend;
- Enviar a análise de volta para o Spring Boot usando `PUT /pedidos/{id}/analise`.

---

## Fluxo no n8n

```text
Webhook
  ↓
Google Gemini
  ↓
Code
  ↓
HTTP Request
```

---

## 1. Webhook

O primeiro nó do fluxo é um **Webhook**.

Configuração:

```text
HTTP Method: POST
Path: pedido
Authentication: None
Respond: Immediately
```

Durante os testes, foi utilizada a URL de teste do n8n:

```text
https://jpn8n.app.n8n.cloud/webhook-test/pedido
```

Essa URL está configurada no backend em:

```properties
n8n.webhook.url=https://jpn8n.app.n8n.cloud/webhook-test/pedido
```

Atenção:

```text
/webhook-test/pedido → funciona apenas com o botão "Listen for test event" ativado no n8n
/webhook/pedido      → funciona com o workflow ativo
```

Para apresentação com o workflow ativo, a URL deve ser alterada para a Production URL do n8n:

```properties
n8n.webhook.url=https://jpn8n.app.n8n.cloud/webhook/pedido
```

---

## JSON recebido pelo n8n

Quando um pedido é criado, o Spring Boot envia para o n8n um JSON como este:

```json
{
  "id": 33,
  "cliente": "João",
  "cidade": "Petrópolis",
  "valorTotal": 950,
  "produtos": [
    "Notebook",
    "Mouse Gamer"
  ]
}
```

No n8n, esses dados chegam dentro de:

```text
$json.body
```

Exemplos usados no prompt:

```text
{{$json.body.id}}
{{$json.body.cliente}}
{{$json.body.cidade}}
{{$json.body.valorTotal}}
{{$json.body.produtos}}
```

---

## 2. Google Gemini

O segundo nó do fluxo utiliza o **Google Gemini** para analisar o pedido.

Ação utilizada:

```text
Google Gemini → Text → Message a Model
```

Modelo utilizado nos testes:

```text
models/gemini-3-flash-preview
```

Também é possível usar outros modelos Flash disponíveis na conta.

---

## Prompt utilizado no Gemini

```text
Você é um consultor de vendas de uma loja virtual de tecnologia.

Analise o pedido recebido.

Dados do pedido:
ID: {{$json.body.id}}
Cliente: {{$json.body.cliente}}
Cidade: {{$json.body.cidade}}
Valor total: {{$json.body.valorTotal}}
Produtos comprados: {{$json.body.produtos}}

Retorne apenas um JSON válido, sem markdown, sem explicações e sem texto antes ou depois.

Formato obrigatório:

{
  "perfilCliente": "",
  "produtosRecomendados": [],
  "cupomDesconto": "",
  "mensagemPersonalizada": ""
}

Regras:
- Se o valor total for maior ou igual a 700, classifique como "Cliente Premium".
- Se o valor total estiver entre 300 e 699, classifique como "Cliente Intermediário".
- Se o valor total for menor que 300, classifique como "Cliente Econômico".
- Recomende 3 produtos relacionados aos produtos comprados.
- Crie um cupom curto.
- Crie uma mensagem personalizada e simpática usando o nome do cliente.
```

---

## Resposta esperada da IA

Exemplo de resposta gerada pelo Gemini:

```json
{
  "perfilCliente": "Cliente Premium",
  "produtosRecomendados": [
    "Headset Gamer 7.1",
    "Mousepad Extra Large",
    "Suporte para Notebook com Cooler"
  ],
  "cupomDesconto": "JOAO10",
  "mensagemPersonalizada": "Olá, João! Ficamos muito felizes com sua compra. Como você adquiriu um novo Notebook e um Mouse Gamer, selecionamos alguns acessórios que vão elevar ainda mais o seu setup."
}
```

---

## 3. Nó Code

O nó **Code** transforma a resposta do Gemini no formato esperado pelo backend Spring Boot.

Código utilizado:

```javascript
const pedido = $('Webhook').first().json.body;

// Pega o texto gerado pelo Gemini
let textoIA = $json.content.parts[0].text;

// Remove possíveis blocos de markdown, caso a IA coloque ```json
textoIA = textoIA
  .replace(/```json/g, '')
  .replace(/```/g, '')
  .trim();

// Converte o texto em JSON
const respostaIA = JSON.parse(textoIA);

return [
  {
    json: {
      id: pedido.id,
      perfilCliente: respostaIA.perfilCliente,
      recomendacoes: respostaIA.produtosRecomendados.join(', '),
      cupomDesconto: respostaIA.cupomDesconto,
      mensagemIA: respostaIA.mensagemPersonalizada
    }
  }
];
```

Saída esperada do nó Code:

```json
{
  "id": 33,
  "perfilCliente": "Cliente Premium",
  "recomendacoes": "Headset Gamer 7.1, Mousepad Extra Large, Suporte para Notebook com Cooler",
  "cupomDesconto": "JOAO10",
  "mensagemIA": "Olá, João! Ficamos muito felizes com sua compra."
}
```

---

## 4. HTTP Request

O último nó do fluxo é um **HTTP Request**, responsável por devolver a análise da IA para o Spring Boot.

Configuração:

```text
Method: PUT
Authentication: None
Send Body: ON
Body Content Type: JSON
Specify Body: Using JSON
```

URL:

```text
https://URL-DO-NGROK/pedidos/{id}/analise
```

No n8n, a URL foi configurada de forma dinâmica para usar o ID do pedido recebido:

```text
https://URL-DO-NGROK/pedidos/{{$json.id}}/analise
```

Body enviado:

```json
{
  "perfilCliente": "{{$json.perfilCliente}}",
  "recomendacoes": "{{$json.recomendacoes}}",
  "cupomDesconto": "{{$json.cupomDesconto}}",
  "mensagemIA": "{{$json.mensagemIA}}"
}
```

---

# Uso do ngrok

Como o backend Spring Boot roda localmente na porta `8080`, o n8n Cloud não consegue acessar diretamente:

```text
http://localhost:8080
```

Para permitir que o n8n Cloud envie a análise de volta para o backend local, foi utilizado o **ngrok**.

Com o backend rodando, execute:

```bash
ngrok http 8080
```

O ngrok gera uma URL pública semelhante a:

```text
https://exemplo.ngrok-free.dev
```

Essa URL deve ser usada no nó **HTTP Request** do n8n:

```text
PUT https://exemplo.ngrok-free.dev/pedidos/{id}/analise
```

---

## Atenção sobre o ngrok

Cada integrante que quiser testar o fluxo em sua própria máquina precisa:

1. Rodar o backend Spring Boot localmente;
2. Rodar o ngrok apontando para a porta 8080;
3. Copiar a URL pública gerada pelo ngrok;
4. Atualizar a URL no nó HTTP Request do n8n.

No plano gratuito do ngrok, a URL pode mudar ao reiniciar o túnel.

---

# Teste validado

A integração foi testada com sucesso.

Fluxo validado:

```text
POST /pedidos
  ↓
Spring Boot salva o pedido no H2
  ↓
Spring Boot envia o pedido para o Webhook do n8n
  ↓
Gemini gera a análise do pedido
  ↓
n8n transforma a resposta da IA
  ↓
n8n envia PUT /pedidos/{id}/analise
  ↓
Spring Boot atualiza o pedido
  ↓
GET /pedidos retorna o pedido com a análise preenchida
```

Exemplo de pedido atualizado:

```json
{
  "id": 33,
  "cliente": "João",
  "cidade": "Petrópolis",
  "valorTotal": 950,
  "produtos": [
    "Notebook",
    "Mouse Gamer"
  ],
  "perfilCliente": "Cliente Premium",
  "recomendacoes": "Headset Gamer 7.1, Mousepad Extra Large, Suporte para Notebook com Cooler",
  "cupomDesconto": "JOAO10",
  "mensagemIA": "Olá, João! Ficamos muito felizes com sua compra."
}
```

---

# Frontend React

O frontend React deve ser responsável por:

- Exibir formulário de cadastro de pedido;
- Enviar o pedido para o backend usando `POST /pedidos`;
- Exibir mensagem de carregamento enquanto a análise é feita;
- Consultar o pedido atualizado;
- Mostrar o perfil do cliente, recomendações, cupom e mensagem da IA.

---

## Recursos de acessibilidade no frontend

O frontend deve incluir recursos de acessibilidade, como:

- Uso correto de `label` nos campos do formulário;
- Botões com textos claros;
- Contraste adequado;
- Estrutura semântica com `main`, `section`, `h1`, `h2`;
- Uso de `aria-live` para mensagens dinâmicas, como carregamento da análise da IA.

Exemplo:

```jsx
<p aria-live="polite">
  {carregando ? "Aguardando análise da IA..." : ""}
</p>
```

---

# CORS

CORS está liberado para qualquer origem durante o desenvolvimento.

Isso permite que o frontend React acesse a API Spring Boot sem problemas enquanto estiver rodando localmente.

---

# Cuidados com segurança

Não subir para o GitHub:

- API Key do Gemini;
- Token do ngrok;
- Credenciais do n8n;
- Arquivos `.env`;
- Banco local H2;
- Pasta `target`;
- Pasta `node_modules`;
- Prints mostrando credenciais.

---

# Arquivos ignorados no Git

O projeto deve possuir um `.gitignore` na raiz para evitar o envio de arquivos locais e sensíveis.

Exemplo:

```gitignore
# Java / Spring Boot
target/
backend/target/
*.class

# H2 Database local
backend/data/
data/
*.mv.db
*.trace.db
*.lock.db

# Ambiente / credenciais
.env
.env.*
*.key

# Node / React
node_modules/
frontend/node_modules/
dist/
build/

# IDEs
.idea/
.vscode/

# Sistema operacional
.DS_Store
Thumbs.db
```

---

# Observações para o grupo

Para testar o fluxo completo, é necessário:

1. Rodar o backend;
2. Rodar o ngrok apontando para a porta 8080;
3. Configurar a URL do ngrok no nó HTTP Request do n8n;
4. Deixar o Webhook do n8n em modo teste ou ativar o workflow;
5. Criar um pedido via frontend, Postman ou Thunder Client;
6. Consultar o pedido para verificar se a análise da IA foi salva.

---

# Status da integração

A integração entre **Spring Boot**, **n8n**, **Google Gemini** e retorno para o backend foi concluída e testada com sucesso.