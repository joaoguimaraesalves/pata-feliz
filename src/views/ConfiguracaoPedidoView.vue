<template>
  <div>
    <h1>Agendamento do Serviço</h1>
    <pedido-component-vue :servico="servicoSelecionado" />
  </div>
</template>
<script>
import PedidoComponentVue from "@/components/PedidoComponent.vue";

export default {
  name: "ConfiguracaoPedidoView",
  components: {
    PedidoComponentVue,
  },
  data() {
    return {
      servicoSelecionado: null,
    };
  },
  mounted() {
    const query = this.$route.query;
    if (query.servico) {
      const decodeServico = JSON.parse(decodeURIComponent(query.servico));
      this.servicoSelecionado = decodeServico;
    }
  },
};
</script>
<style scoped></style>
