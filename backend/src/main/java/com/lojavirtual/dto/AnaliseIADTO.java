package com.lojavirtual.dto;

public class AnaliseIADTO {
    private String perfilCliente;
    private String recomendacoes;
    private String cupomDesconto;
    private String mensagemIA;

    public String getPerfilCliente() { return perfilCliente; }
    public void setPerfilCliente(String perfilCliente) { this.perfilCliente = perfilCliente; }

    public String getRecomendacoes() { return recomendacoes; }
    public void setRecomendacoes(String recomendacoes) { this.recomendacoes = recomendacoes; }

    public String getCupomDesconto() { return cupomDesconto; }
    public void setCupomDesconto(String cupomDesconto) { this.cupomDesconto = cupomDesconto; }

    public String getMensagemIA() { return mensagemIA; }
    public void setMensagemIA(String mensagemIA) { this.mensagemIA = mensagemIA; }
}
