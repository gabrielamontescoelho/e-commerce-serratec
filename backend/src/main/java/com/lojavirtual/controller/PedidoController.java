package com.lojavirtual.controller;

import com.lojavirtual.dto.AnaliseIADTO;
import com.lojavirtual.dto.PedidoRequestDTO;
import com.lojavirtual.model.Pedido;
import com.lojavirtual.service.PedidoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    public ResponseEntity<Pedido> criar(@RequestBody PedidoRequestDTO dto) {
        Pedido pedido = pedidoService.criar(dto);
        return ResponseEntity.status(201).body(pedido);
    }

    @GetMapping
    public ResponseEntity<List<Pedido>> listar() {
        return ResponseEntity.ok(pedidoService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.buscarPorId(id));
    }

    @PutMapping("/{id}/analise")
    public ResponseEntity<Pedido> atualizarAnalise(@PathVariable Long id, @RequestBody AnaliseIADTO dto) {
        return ResponseEntity.ok(pedidoService.atualizarAnalise(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        pedidoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
