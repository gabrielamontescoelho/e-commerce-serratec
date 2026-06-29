# Loja Virtual - Backend (Spring Boot)

Backend da Loja Virtual com integração com n8n + IA.
Responsabilidade da **Pessoa 1**: Backend Spring Boot + Banco de Dados (H2).

> Este projeto NÃO cria o fluxo do n8n nem configura IA/Gemini.
> Ele apenas envia os pedidos para uma URL de webhook do n8n e
> expõe um endpoint para receber de volta a análise da IA.

## Tecnologias

- Java 17
- Spring Boot 3
- Spring Web, Spring Data JPA
- Banco de dados H2 (em memória)
- Maven

## Como rodar

```bash
cd backend
./mvnw spring-boot:run
# ou
mvn spring-boot:run
```

A API sobe em `http://localhost:8080`.
Console do H2: `http://localhost:8080/h2-console`
(JDBC URL: `jdbc:h2:mem:lojavirtual`, user: `sa`, sem senha)

## Configuração

Em `src/main/resources/application.properties`:

```
n8n.webhook.url=http://localhost:5678/webhook/pedido
```

Altere essa URL para apontar para o webhook real do n8n.

## Estrutura de pastas

```
src/main/java/com/lojavirtual/
├── controller/   → endpoints REST
├── service/      → regras de negócio + integração com n8n
├── repository/   → acesso ao banco (JPA)
├── model/        → entidade Pedido
├── dto/          → objetos de entrada/saída
├── config/       → CORS
└── exception/    → tratamento de erro
```

## Endpoints

### 1) Criar pedido
`POST /pedidos`

Body:
```json
{
  "cliente": "Maria",
  "cidade": "Petrópolis",
  "valorTotal": 820,
  "produtos": ["Notebook", "Mouse Gamer"]
}
```
Salva no banco, envia para o webhook do n8n e devolve o pedido salvo.
Se o n8n estiver offline, o pedido continua salvo (erro só vai pro log).

### 2) Atualizar análise da IA (chamado pelo n8n)
`PUT /pedidos/{id}/analise`

Body:
```json
{
  "perfilCliente": "Cliente Premium",
  "recomendacoes": "Headset Gamer, SSD 1TB, Mochila para Notebook",
  "cupomDesconto": "TECH10",
  "mensagemIA": "Obrigado pela compra!"
}
```

### 3) Listar pedidos
`GET /pedidos`

### 4) Buscar pedido por id
`GET /pedidos/{id}`

### 5) Deletar pedido
`DELETE /pedidos/{id}`

## Testando no Postman

1. **Criar pedido**
   - Método: `POST`
   - URL: `http://localhost:8080/pedidos`
   - Aba *Body* → *raw* → *JSON* → cole o JSON do exemplo acima.
   - Clique em **Send**. Resposta: o pedido salvo com `id`.

2. **Listar pedidos**
   - Método: `GET`
   - URL: `http://localhost:8080/pedidos`

3. **Buscar por id**
   - Método: `GET`
   - URL: `http://localhost:8080/pedidos/1`

4. **Atualizar análise da IA** (simula o n8n)
   - Método: `PUT`
   - URL: `http://localhost:8080/pedidos/1/analise`
   - Body (raw/JSON): JSON do exemplo da análise.

5. **Deletar pedido**
   - Método: `DELETE`
   - URL: `http://localhost:8080/pedidos/1`
   - Resposta: 204 No Content.

6. **Conferir no banco** abrindo `http://localhost:8080/h2-console`
   e rodando `SELECT * FROM PEDIDOS;`.

## CORS

CORS está liberado para qualquer origem (`*`), então o frontend React
pode chamar a API sem problemas durante o desenvolvimento.
