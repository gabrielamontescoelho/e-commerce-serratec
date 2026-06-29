package com.lojavirtual.service;

import com.lojavirtual.dto.AnaliseIADTO;
import com.lojavirtual.dto.PedidoRequestDTO;
import com.lojavirtual.dto.PedidoWebhookDTO;
import com.lojavirtual.exception.PedidoNotFoundException;
import com.lojavirtual.model.Pedido;
import com.lojavirtual.repository.PedidoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class PedidoService {

    private static final Logger log = LoggerFactory.getLogger(PedidoService.class);

    private final PedidoRepository pedidoRepository;
    private final RestTemplate restTemplate;

    @Value("${n8n.webhook.url}")
    private String webhookUrl;

    public PedidoService(PedidoRepository pedidoRepository, RestTemplate restTemplate) {
        this.pedidoRepository = pedidoRepository;
        this.restTemplate = restTemplate;
    }

    public Pedido criar(PedidoRequestDTO dto) {
        Pedido pedido = new Pedido();
        pedido.setCliente(dto.getCliente());
        pedido.setCidade(dto.getCidade());
        pedido.setValorTotal(dto.getValorTotal());
        pedido.setProdutos(dto.getProdutos());

        Pedido salvo = pedidoRepository.save(pedido);

        enviarParaN8n(salvo);

        return salvo;
    }

    private void enviarParaN8n(Pedido pedido) {
        try {
            PedidoWebhookDTO payload = new PedidoWebhookDTO(
                    pedido.getId(),
                    pedido.getCliente(),
                    pedido.getCidade(),
                    pedido.getValorTotal(),
                    pedido.getProdutos()
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<PedidoWebhookDTO> entity = new HttpEntity<>(payload, headers);

            restTemplate.postForEntity(webhookUrl, entity, String.class);
            log.info("Pedido {} enviado ao n8n com sucesso.", pedido.getId());
        } catch (Exception e) {
            log.error("Falha ao enviar pedido {} para o n8n ({}): {}",
                    pedido.getId(), webhookUrl, e.getMessage());
        }
    }

    public List<Pedido> listar() {
        return pedidoRepository.findAll();
    }

    public Pedido buscarPorId(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new PedidoNotFoundException(id));
    }

    public Pedido atualizarAnalise(Long id, AnaliseIADTO dto) {
        Pedido pedido = buscarPorId(id);
        pedido.setPerfilCliente(dto.getPerfilCliente());
        pedido.setRecomendacoes(dto.getRecomendacoes());
        pedido.setCupomDesconto(dto.getCupomDesconto());
        pedido.setMensagemIA(dto.getMensagemIA());
        return pedidoRepository.save(pedido);
    }

    public void deletar(Long id) {
        if (!pedidoRepository.existsById(id)) {
            throw new PedidoNotFoundException(id);
        }
        pedidoRepository.deleteById(id);
    }
}
