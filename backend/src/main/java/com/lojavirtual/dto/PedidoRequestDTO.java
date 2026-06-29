package com.lojavirtual.dto;

import java.util.List;

public class PedidoRequestDTO {
    private String cliente;
    private String cidade;
    private Double valorTotal;
    private List<String> produtos;

    public String getCliente() { return cliente; }
    public void setCliente(String cliente) { this.cliente = cliente; }

    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }

    public Double getValorTotal() { return valorTotal; }
    public void setValorTotal(Double valorTotal) { this.valorTotal = valorTotal; }

    public List<String> getProdutos() { return produtos; }
    public void setProdutos(List<String> produtos) { this.produtos = produtos; }
}
