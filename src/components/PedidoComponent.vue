<template>
  <div>
    <!-- Alerta semântico reativo (erro de validação / sucesso) -->
    <alerta-component
      :tipo="alerta.tipo"
      :mensagem="alerta.mensagem"
      @fechar="alerta.mensagem = ''"
    />

    <form id="pedido-form" @submit="criarPedido($event)">
      <div>
        <p id="nome-servico-content">
          {{ servico && servico.nome ? servico.nome : "-" }}
        </p>
        <img
          id="foto-content"
          :src="servico && servico.foto ? servico.foto : ''"
          alt="Serviço selecionado"
        />
      </div>

      <div class="inputs">
        <label for="nome-cliente">Nome do tutor *</label>
        <input
          type="text"
          v-model="nomeCliente"
          id="nome-cliente"
          name="nome-cliente"
          placeholder="Ex.: Maria Silva"
        />
      </div>

      <div class="inputs">
        <label for="nome-pet">Nome do pet *</label>
        <input
          type="text"
          v-model="nomePet"
          id="nome-pet"
          name="nome-pet"
          placeholder="Ex.: Thor"
        />
      </div>

      <div class="inputs">
        <label>Porte do pet *</label>
        <select name="porte" id="porte" v-model="porteSelecionado">
          <option value="">Selecione o porte</option>
          <option v-for="porte in listaPortes" :key="porte.id" :value="porte">
            {{ porte.descricao }}
          </option>
        </select>
      </div>

      <div class="inputs">
        <label>Tipo de pelagem</label>
        <select name="pelagem" id="pelagem" v-model="pelagemSelecionada">
          <option value="">Selecione a pelagem</option>
          <option
            v-for="pelagem in listaPelagens"
            :key="pelagem.id"
            :value="pelagem"
          >
            {{ pelagem.descricao }}
          </option>
        </select>
      </div>

      <div class="inputs">
        <label id="opcionais-titulo">Serviços extras</label>
        <label id="opcionais-subtitulo">Deixe o banho ainda mais completo</label>

        <div
          class="checkbox-container"
          v-for="extra in listaServicosExtras"
          :key="extra.id"
        >
          <input
            type="checkbox"
            :name="extra.nome"
            :value="extra"
            v-model="servicosExtrasSelecionados"
          />
          <span>{{ extra.nome }} (+ R$ {{ extra.valor }},00)</span>
        </div>

        <label>Mimos para o pet</label>

        <div class="checkbox-container" v-for="mimo in listaMimos" :key="mimo.id">
          <input
            type="checkbox"
            :name="mimo.nome"
            :value="mimo"
            v-model="mimosSelecionados"
          />
          <span>{{ mimo.nome }} (+ R$ {{ mimo.valor }},00)</span>
        </div>

        <div class="inputs">
          <input
            type="submit"
            class="submit-btn"
            value="Confirmar Agendamento"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import AlertaComponent from "@/components/AlertaComponent.vue";

export default {
  name: "PedidoComponent",
  components: { AlertaComponent },
  props: {
    servico: null,
  },
  data() {
    return {
      listaPortes: [],
      listaPelagens: [],
      listaServicosExtras: [],
      listaMimos: [],
      nomeCliente: "",
      nomePet: "",
      porteSelecionado: "",
      pelagemSelecionada: "",
      servicosExtrasSelecionados: [],
      mimosSelecionados: [],
      // Estado reativo do alerta semântico
      alerta: {
        tipo: "info",
        mensagem: "",
      },
    };
  },
  methods: {
    async getPortes() {
      const response = await fetch(`${this.$apiUrl}/portes`);
      this.listaPortes = await response.json();
    },
    async getPelagens() {
      const response = await fetch(`${this.$apiUrl}/pelagens`);
      this.listaPelagens = await response.json();
    },
    async getAdicionais() {
      const response = await fetch(`${this.$apiUrl}/adicionais`);
      const dados = await response.json();
      this.listaServicosExtras = dados.servicos_extras;
      this.listaMimos = dados.mimos;
    },
    // Centraliza a exibição do alerta semântico
    mostrarAlerta(tipo, mensagem) {
      this.alerta.tipo = tipo;
      this.alerta.mensagem = mensagem;
    },
    // Regras de campos obrigatórios; retorna mensagem de erro ou null
    validarFormulario() {
      if (!this.servico) {
        return "Selecione um serviço no menu antes de agendar.";
      }
      if (!this.nomeCliente.trim()) {
        return "Informe o nome do tutor para continuar.";
      }
      if (!this.nomePet.trim()) {
        return "Informe o nome do pet para continuar.";
      }
      if (!this.porteSelecionado) {
        return "Selecione o porte do pet (campo obrigatório).";
      }
      return null;
    },
    async criarPedido(e) {
      e.preventDefault();

      // 1) Validação: bloqueia agendamento incompleto com alerta vermelho
      const erro = this.validarFormulario();
      if (erro) {
        this.mostrarAlerta("erro", erro);
        return;
      }

      const dadosPedido = {
        nomeCliente: this.nomeCliente,
        nomePet: this.nomePet,
        porte: this.porteSelecionado,
        pelagem: this.pelagemSelecionada || null,
        servicosExtras: Array.from(this.servicosExtrasSelecionados),
        mimos: Array.from(this.mimosSelecionados),
        servico: this.servico,
        statusId: 1,
      };

      try {
        const req = await fetch(`${this.$apiUrl}/pedidos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosPedido),
        });

        if (!req.ok) throw new Error("Falha na requisição");

        // 2) Sucesso: alerta verde e redirecionamento automático
        this.mostrarAlerta(
          "sucesso",
          `Agendamento de ${this.nomePet} confirmado! Redirecionando para os pedidos...`
        );

        setTimeout(() => {
          this.$router.push("/pedidos");
        }, 1400);
      } catch (err) {
        // Erro de comunicação com a API
        this.mostrarAlerta(
          "erro",
          "Não foi possível salvar o agendamento. Verifique se a API está no ar."
        );
      }
    },
  },
  mounted() {
    this.getPortes();
    this.getPelagens();
    this.getAdicionais();
  },
};
</script>

<style scoped>
#foto-content {
  margin-bottom: 16px;
  border-radius: 16px;
  position: relative;
  z-index: -1;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  height: 200px;
  object-fit: cover;
}

#nome-servico-content {
  font-size: 40px;
  font-weight: bold;
  text-align: start;
  margin-bottom: -80px;
  margin-left: 40px;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
  padding: 16px;
}

#pedido-form {
  max-width: 600px;
  margin: 0 auto;
}

.inputs {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

label {
  font-weight: bold;
  margin-bottom: 12px;
  color: #222;
  padding: 5px 12px;
  display: flex;
  border-left: 4px solid #2aa7a0;
}

input,
select {
  padding: 12px;
  width: 300px;
  border: solid #222 1px;
  border-radius: 8px;
  height: 20px;
  font-size: 12px;
}

select {
  height: 45px;
}

#opcionais-titulo {
  width: 100%;
}

#opcionais-subtitulo {
  display: flex;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 12px;
  border-left: 4px solid #f7a440;
  color: #555;
  font-weight: 500;
}

.checkbox-container span {
  margin-left: 6px;
  font-weight: bold;
}

.checkbox-container span,
.checkbox-container input {
  width: auto;
  height: 20px;
}

.submit-btn {
  background-color: #2aa7a0;
  color: #fff;
  font-weight: bold;
  border: none;
  font-size: 18px;
  border-radius: 12px;
  padding: 16px;
  margin: 0 auto;
  cursor: pointer;
  width: 100%;
  height: auto;
  transition: 0.5s;
}

.submit-btn:hover {
  background-color: #1f7c77;
}
</style>
