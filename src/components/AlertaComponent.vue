<template>
  <!-- Só renderiza quando há mensagem (reatividade do v-if) -->
  <transition name="alerta-fade">
    <div v-if="mensagem" class="alerta" :class="`alerta--${tipo}`" role="alert">
      <span class="alerta__icone" aria-hidden="true">{{ config.icone }}</span>
      <div class="alerta__texto">
        <strong class="alerta__titulo">{{ config.titulo }}</strong>
        <span class="alerta__mensagem">{{ mensagem }}</span>
      </div>
      <button
        v-if="fechavel"
        class="alerta__fechar"
        type="button"
        aria-label="Fechar alerta"
        @click="$emit('fechar')"
      >
        ×
      </button>
    </div>
  </transition>
</template>

<script>
export default {
  name: "AlertaComponent",
  props: {
    // Texto exibido. Vazio = alerta escondido (reativo).
    mensagem: {
      type: String,
      default: "",
    },
    // Define a paleta semântica e o ícone.
    tipo: {
      type: String,
      default: "info",
      validator: (valor) =>
        ["erro", "aviso", "info", "sucesso"].includes(valor),
    },
    fechavel: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["fechar"],
  computed: {
    // Mapeia cada tipo semântico para título e ícone.
    config() {
      const mapa = {
        erro: { titulo: "Erro", icone: "⛔" },
        aviso: { titulo: "Atenção", icone: "⚠️" },
        info: { titulo: "Informação", icone: "ℹ️" },
        sucesso: { titulo: "Tudo certo!", icone: "✅" },
      };
      return mapa[this.tipo] || mapa.info;
    },
  },
};
</script>

<style scoped>
.alerta {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 600px;
  margin: 0 auto 20px auto;
  padding: 14px 18px;
  border-radius: 12px;
  border-left: 6px solid;
  text-align: left;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-size: 15px;
}

.alerta__icone {
  font-size: 22px;
  line-height: 1;
}

.alerta__texto {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.alerta__titulo {
  font-weight: 700;
}

.alerta__fechar {
  background: transparent;
  border: none;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
}

.alerta__fechar:hover {
  opacity: 1;
}

/* ===== Paleta semântica ===== */
/* Vermelho: erros de preenchimento ou ações inválidas */
.alerta--erro {
  background-color: #fdecea;
  border-color: #d93025;
  color: #b3261e;
}
/* Laranja: alertas e avisos importantes */
.alerta--aviso {
  background-color: #fff4e5;
  border-color: #ef6c00;
  color: #b45309;
}
/* Azul: informações contextuais e gerais */
.alerta--info {
  background-color: #e8f0fe;
  border-color: #1a73e8;
  color: #1557b0;
}
/* Verde: sucesso ao cadastrar, editar ou excluir dados */
.alerta--sucesso {
  background-color: #e6f4ea;
  border-color: #1e8e3e;
  color: #137333;
}

/* Animação de entrada/saída */
.alerta-fade-enter-active,
.alerta-fade-leave-active {
  transition: all 0.3s ease;
}
.alerta-fade-enter-from,
.alerta-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
