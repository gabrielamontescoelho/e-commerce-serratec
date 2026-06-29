package com.lojavirtual.exception;

public class PedidoNotFoundException extends RuntimeException {
    public PedidoNotFoundException(Long id) {
        super("Pedido não encontrado com id: " + id);
    }
}
