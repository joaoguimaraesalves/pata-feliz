<template>
  <div>
    <!-- Alerta semântico reativo da listagem (sucesso/erro/info) -->
    <alerta-component
      :tipo="alerta.tipo"
      :mensagem="alerta.mensagem"
      @fechar="alerta.mensagem = ''"
    />

    <!-- Estado vazio (informativo) -->
    <p v-if="listaPedidosRealizados.length === 0" class="lista-vazia">
      Nenhum agendamento por aqui ainda. 🐾
    </p>

    <div v-else id="pedidos-tabela">
      <div id="pedidos-tabela-cabecalho">
        <div id="ordem-id">#ID</div>
        <div>Tutor</div>
        <div>Pet</div>
        <div>Serviço</div>
        <div>Porte</div>
        <div>Adicionais</div>
        <div>Status</div>
        <div id="div-acoes">Ações</div>
      </div>

      <div
        class="pedidos-tabela-linha"
        v-for="pedido in listaPedidosRealizados"
        :key="pedido.id"
      >
        <div id="ordem-numero">{{ pedido.id }}</div>
        <div>{{ pedido.nomeCliente }}</div>
        <div>{{ pedido.nomePet }}</div>
        <div>{{ pedido.servico.nome }}</div>
        <div>{{ pedido.porte.descricao }}</div>
        <div>
          <ul>
            <li
              v-for="(extra, index) in pedido.servicosExtras"
              :key="'e' + index"
            >
              {{ extra.nome }}
            </li>
            <li v-for="(mimo, index) in pedido.mimos" :key="'m' + index">
              {{ mimo.nome }}
            </li>
          </ul>
        </div>
        <div>
          <select
            name="status"
            class="status"
            @change="atualizarStatusPedido($event, pedido.id)"
          >
            <option value="">Selecione</option>
            <option
              v-for="status in listaStatusPedido"
              :key="status.id"
              :value="status.id"
              :selected="status.id == pedido.statusId"
            >
              {{ status.descricao }}
            </option>
          </select>
        </div>
        <div id="div-acoes">
          <img
            @click="deletarPedido(pedido.id)"
            src="/img/icone_lixeira.png"
            width="35px"
            height="35px"
            alt="Excluir agendamento"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AlertaComponent from "@/components/AlertaComponent.vue";

export default {
  name: "ListaPedidoComponent",
  components: { AlertaComponent },
  data() {
    return {
      listaPedidosRealizados: [],
      listaStatusPedido: [],
      alerta: {
        tipo: "info",
        mensagem: "",
      },
    };
  },
  methods: {
    mostrarAlerta(tipo, mensagem) {
      this.alerta.tipo = tipo;
      this.alerta.mensagem = mensagem;
    },
    async consultarPedidos() {
      const response = await fetch(`${this.$apiUrl}/pedidos`);
      this.listaPedidosRealizados = await response.json();
    },
    async consultarStatusPedido() {
      const response = await fetch(`${this.$apiUrl}/status_pedido`);
      this.listaStatusPedido = await response.json();
    },
    async deletarPedido(id) {
      try {
        const response = await fetch(`${this.$apiUrl}/pedidos/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Falha ao excluir");

        // Re-renderização imediata: remove o item do array reativo
        this.listaPedidosRealizados = this.listaPedidosRealizados.filter(
          (pedido) => pedido.id !== id
        );
        this.mostrarAlerta("sucesso", `Agendamento #${id} excluído com sucesso.`);
      } catch (err) {
        this.mostrarAlerta("erro", "Não foi possível excluir o agendamento.");
      }
    },
    async atualizarStatusPedido(event, idPedido) {
      const novoStatus = event.target.value;
      try {
        await fetch(`${this.$apiUrl}/pedidos/${idPedido}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ statusId: novoStatus }),
        });
        this.mostrarAlerta(
          "aviso",
          `Status do agendamento #${idPedido} atualizado.`
        );
      } catch (err) {
        this.mostrarAlerta("erro", "Não foi possível atualizar o status.");
      }
    },
  },
  mounted() {
    this.consultarPedidos();
    this.consultarStatusPedido();
  },
};
</script>

<style scoped>
.lista-vazia {
  font-size: 18px;
  color: #555;
  margin: 40px 0;
}

#pedidos-tabela {
  width: 100%;
  margin: 0 auto;
}

#pedidos-tabela-cabecalho,
.pedidos-tabela-linha {
  display: flex;
  flex-wrap: wrap;
}

#pedidos-tabela-cabecalho {
  font-weight: bold;
  padding: 12px;
  border-bottom: 2px solid #2aa7a0;
}

#pedidos-tabela-cabecalho div,
.pedidos-tabela-linha div {
  width: 16%;
}

.pedidos-tabela-linha {
  width: 100%;
  padding: 12px;
  border-bottom: 1px dotted #2aa7a0;
}

#pedidos-tabela-cabecalho #ordem-id,
.pedidos-tabela-linha #ordem-numero,
.pedidos-tabela-linha #div-acoes,
#pedidos-tabela-cabecalho #div-acoes {
  width: 5%;
}

.status {
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #2aa7a0;
}

#div-acoes img {
  cursor: pointer;
}
</style>
