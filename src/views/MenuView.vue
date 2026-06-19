<template>
  <div>
    <h1>Nossos Serviços</h1>
    <p class="subtitulo">Escolha o serviço ideal para o seu melhor amigo 🐶🐱</p>
    <div id="scroll-horizontal">
      <div
        id="card-content"
        v-for="servico in listaServicos"
        :key="servico.id"
      >
        <div id="card-linha">
          <div class="foto-servico">
            <span v-if="servico.eh_novidade" class="selo-novidade">Novidade</span>
            <img :src="servico.foto" :alt="servico.nome" />
            <div class="card-coluna">
              <p id="nome-content">{{ servico.nome }}</p>
              <p id="preco-content">R$ {{ servico.valor }},00</p>
              <p id="descricao-content">{{ servico.descricao }}</p>
              <button @click="selecionarServico(servico)">Agendar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuView",
  data() {
    return {
      listaServicos: [],
    };
  },
  methods: {
    async consultarMenu() {
      const response = await fetch(`${this.$apiUrl}/catalogo`);
      const dados = await response.json();
      this.listaServicos = dados.servicos;
    },
    selecionarServico(servicoSelecionado) {
      const param = JSON.stringify(servicoSelecionado);
      const servicoJson = encodeURIComponent(param);
      this.$router.push({ path: "/config", query: { servico: servicoJson } });
    },
  },
  mounted() {
    this.consultarMenu();
  },
};
</script>

<style scoped>
.subtitulo {
  color: #555;
  margin-bottom: 20px;
}

#card-content {
  display: inline-block;
  width: 280px;
  min-height: 500px;
  margin: 20px;
  border: 1px solid #ddd;
  border-radius: 15px;
  box-shadow: 0 4px 8px #ccc;
  position: relative;
  overflow: hidden;
  vertical-align: top;
}

#scroll-horizontal {
  flex: 1;
  overflow-x: auto;
  white-space: nowrap;
  width: 90%;
  max-width: 960px;
  margin: 0 auto;
  box-shadow: inset -10px 0px 15px -15px grey;
}

.foto-servico {
  position: relative;
}

.selo-novidade {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #f7a440;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 20px;
  z-index: 1;
}

.foto-servico img {
  width: 100%;
  object-fit: cover;
  max-height: 200px;
  border-radius: 10px 10px 0 0;
}

#nome-content {
  font-size: 25px;
  font-weight: bold;
  text-align: center;
  width: 100%;
  margin: 12px 0;
  white-space: normal;
}

#preco-content {
  font-size: 35px;
  text-align: center;
  font-weight: bold;
  color: #2aa7a0;
  margin: 16px;
}

#descricao-content {
  font-size: 15px;
  text-align: left;
  color: gray;
  margin: 16px;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
}

.card-coluna button {
  margin-top: auto;
  padding: 10px;
  background-color: #2aa7a0;
  color: #fff;
  font-weight: bold;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  width: 80%;
  margin: 20px;
  cursor: pointer;
  transition: 0.5s;
}

.card-coluna button:hover {
  background-color: transparent;
  color: #1f7c77;
  border: solid 1px #2aa7a0;
}
</style>
