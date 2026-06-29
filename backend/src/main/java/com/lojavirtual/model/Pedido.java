package com.lojavirtual.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cliente;
    private String cidade;
    private Double valorTotal;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "pedido_produtos", joinColumns = @JoinColumn(name = "pedido_id"))
    @Column(name = "produto")
    private List<String> produtos = new ArrayList<>();

    private String perfilCliente;

    @Column(length = 2000)
    private String recomendacoes;

    private String cupomDesconto;

    @Column(length = 2000)
    private String mensagemIA;

    public Pedido() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCliente() { return cliente; }
    public void setCliente(String cliente) { this.cliente = cliente; }

    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }

    public Double getValorTotal() { return valorTotal; }
    public void setValorTotal(Double valorTotal) { this.valorTotal = valorTotal; }

    public List<String> getProdutos() { return produtos; }
    public void setProdutos(List<String> produtos) { this.produtos = produtos; }

    public String getPerfilCliente() { return perfilCliente; }
    public void setPerfilCliente(String perfilCliente) { this.perfilCliente = perfilCliente; }

    public String getRecomendacoes() { return recomendacoes; }
    public void setRecomendacoes(String recomendacoes) { this.recomendacoes = recomendacoes; }

    public String getCupomDesconto() { return cupomDesconto; }
    public void setCupomDesconto(String cupomDesconto) { this.cupomDesconto = cupomDesconto; }

    public String getMensagemIA() { return mensagemIA; }
    public void setMensagemIA(String mensagemIA) { this.mensagemIA = mensagemIA; }
}
