# 🐾 Pata Feliz — Banho & Tosa

Sistema de **agendamento de banho e tosa para pets**, desenvolvido em **Vue 3** como projeto
final de Desenvolvimento Web. O projeto evolui a base estrutural do sistema **T-Burguer**
(trabalhada em sala) para um novo segmento de negócio: um **petshop**.

> Em vez de montar um hambúrguer, o cliente agenda um serviço para o seu pet, escolhendo
> **porte**, **tipo de pelagem**, **serviços extras** e **mimos**.

---

## 🔗 Links

| Item                         | URL                                                        |
| ---------------------------- | ---------------------------------------------------------- |
| 🌐 **Produção (GitHub Pages)** | _https://SEU-USUARIO.github.io/pata-feliz/_              |
| 🛰️ **API (JSON Server / Render)** | _https://pata-feliz-api.onrender.com_                |
| 💻 **Repositório (front-end)** | _https://github.com/SEU-USUARIO/pata-feliz_             |
| 🗄️ **Repositório (banco-json)** | _https://github.com/SEU-USUARIO/pata-feliz-banco-json_  |

> Substitua `SEU-USUARIO` e as URLs pelos links reais após o deploy.

---

## 1. Visão geral — do T-Burguer ao Pata Feliz

Partindo da estrutura original (Vue 3 + Vue Router + JSON Server), o sistema foi
**totalmente reidentificado** e teve seus dados, campos e regras adaptados ao novo segmento.

### Principais alterações estruturais

| Antes (T-Burguer)                | Agora (Pata Feliz)                                  |
| -------------------------------- | --------------------------------------------------- |
| Hamburgueria                     | Petshop (banho & tosa)                              |
| Campo **"Ponto da carne"**       | Campo **"Porte do pet"** (obrigatório)             |
| "Selecione um hambúrguer"        | "Agende um serviço"                                 |
| Complementos + Bebidas           | **Serviços extras** + **Mimos**                     |
| `/menu` → `burgues`              | `/catalogo` → `servicos`                            |
| `/tipos_pontos`, `/opcionais`    | `/portes`, `/pelagens`, `/adicionais`              |
| Logo/banner do hambúrguer        | Logo de pata (SVG próprio) + banner em gradiente    |

### Novo campo obrigatório (substituindo "Ponto da carne")

```vue
<!-- src/components/PedidoComponent.vue -->
<div class="inputs">
  <label>Porte do pet *</label>
  <select name="porte" id="porte" v-model="porteSelecionado">
    <option value="">Selecione o porte</option>
    <option v-for="porte in listaPortes" :key="porte.id" :value="porte">
      {{ porte.descricao }}
    </option>
  </select>
</div>
```

### Nova identidade visual

- **Logo:** `public/img/logo_pata_feliz.svg` (pata desenhada em SVG, sem dependência externa).
- **Paleta:** verde-água `#2aa7a0` + laranja `#f7a440`.
- **Banner:** componente `BannerComponent.vue` com gradiente e mensagem do petshop.
- **Imagens dos serviços:** fotos reais de pets via [placedog.net](https://placedog.net).

---

## 2. Solução técnica dos alertas semânticos

Toda a comunicação visual passa por **um único componente reutilizável**,
o `AlertaComponent.vue`, controlado de forma **reativa** pelo componente pai.

### O componente de alerta

Ele recebe duas props — `tipo` e `mensagem` — e, a partir do `tipo`, escolhe a cor
semântica e o ícone via uma `computed`. Quando `mensagem` está vazia, o `v-if` simplesmente
não renderiza nada (reatividade pura do Vue):

```vue
<!-- src/components/AlertaComponent.vue -->
<template>
  <transition name="alerta-fade">
    <div v-if="mensagem" class="alerta" :class="`alerta--${tipo}`" role="alert">
      <span class="alerta__icone">{{ config.icone }}</span>
      <div class="alerta__texto">
        <strong>{{ config.titulo }}</strong>
        <span>{{ mensagem }}</span>
      </div>
      <button v-if="fechavel" @click="$emit('fechar')">×</button>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    mensagem: { type: String, default: "" },
    tipo: {
      type: String,
      default: "info",
      validator: (v) => ["erro", "aviso", "info", "sucesso"].includes(v),
    },
  },
  computed: {
    config() {
      const mapa = {
        erro:    { titulo: "Erro",        icone: "⛔" },
        aviso:   { titulo: "Atenção",     icone: "⚠️" },
        info:    { titulo: "Informação",  icone: "ℹ️" },
        sucesso: { titulo: "Tudo certo!", icone: "✅" },
      };
      return mapa[this.tipo] || mapa.info;
    },
  },
};
</script>
```

### A paleta semântica (CSS)

Cada tipo aplica uma classe `alerta--*` com a cor exigida:

```css
.alerta--erro    { background:#fdecea; border-color:#d93025; color:#b3261e; } /* Vermelho: erros */
.alerta--aviso   { background:#fff4e5; border-color:#ef6c00; color:#b45309; } /* Laranja: avisos */
.alerta--info    { background:#e8f0fe; border-color:#1a73e8; color:#1557b0; } /* Azul: informações */
.alerta--sucesso { background:#e6f4ea; border-color:#1e8e3e; color:#137333; } /* Verde: sucesso */
```

### Como o alerta é disparado (validação)

No componente pai, um único estado reativo `alerta { tipo, mensagem }` controla tudo.
Antes de enviar o pedido, a função `validarFormulario()` checa os **campos obrigatórios**
e, se algo falta, dispara um alerta **vermelho** e **bloqueia** o envio:

```js
// src/components/PedidoComponent.vue
validarFormulario() {
  if (!this.servico)            return "Selecione um serviço no menu antes de agendar.";
  if (!this.nomeCliente.trim()) return "Informe o nome do tutor para continuar.";
  if (!this.nomePet.trim())     return "Informe o nome do pet para continuar.";
  if (!this.porteSelecionado)   return "Selecione o porte do pet (campo obrigatório).";
  return null;
},

async criarPedido(e) {
  e.preventDefault();
  const erro = this.validarFormulario();
  if (erro) {
    this.mostrarAlerta("erro", erro); // 🔴 bloqueia e avisa
    return;
  }
  // ...envia o POST e mostra alerta verde de sucesso
}
```

Resumo dos quatro tipos usados no sistema:

- 🔴 **Erro** — campos obrigatórios em branco ou falha de comunicação com a API.
- 🟠 **Aviso** — status de um agendamento foi alterado.
- 🔵 **Info** — estado neutro/contextual (estado inicial do alerta).
- 🟢 **Sucesso** — agendamento confirmado ou excluído com êxito.

---

## 3. Experiência do usuário (UX)

### Redirecionamento automático após o pedido

Ao confirmar com sucesso, o sistema exibe o **alerta verde** e, em seguida, navega
automaticamente para a tela de agendamentos:

```js
this.mostrarAlerta("sucesso", `Agendamento de ${this.nomePet} confirmado! Redirecionando...`);
setTimeout(() => {
  this.$router.push("/pedidos"); // navegação automática
}, 1400);
```

### Atualização em tempo real e feedback de remoção

A tela de agendamentos busca os dados no `mounted()`, então o novo registro já aparece
ao chegar. Na exclusão, a lista é **re-renderizada na hora** filtrando o array reativo
(sem precisar recarregar a página), e um alerta verde confirma a ação:

```js
// src/components/ListaPedidoComponent.vue
async deletarPedido(id) {
  await fetch(`${this.$apiUrl}/pedidos/${id}`, { method: "DELETE" });
  // Re-renderização imediata
  this.listaPedidosRealizados = this.listaPedidosRealizados.filter((p) => p.id !== id);
  this.mostrarAlerta("sucesso", `Agendamento #${id} excluído com sucesso.`);
}
```

---

## 4. Estrutura do projeto

```
pata-feliz/
├── db/db.json                       # base local do JSON Server
├── public/img/logo_pata_feliz.svg   # logo SVG próprio
└── src/
    ├── App.vue
    ├── main.js                      # registra $apiUrl global (VUE_APP_API_BASE_URL)
    ├── router/index.js              # rotas: /, /menu, /pedidos, /config
    ├── components/
    │   ├── AlertaComponent.vue       # ⭐ alerta semântico reutilizável
    │   ├── BannerComponent.vue
    │   ├── NavBarComponent.vue
    │   ├── PedidoComponent.vue       # formulário + validação + redirect
    │   └── ListaPedidoComponent.vue  # tabela + re-render ao excluir
    └── views/
        ├── MenuView.vue
        ├── ConfiguracaoPedidoView.vue
        └── PedidosView.vue
```

---

## 5. Como rodar localmente

Pré-requisito: Node.js 18+.

```bash
# 1. instalar dependências
npm install

# 2. subir a API mockada (porta 3000) — deixe rodando em um terminal
npm run bancojson

# 3. em outro terminal, subir o front
npm run serve
```

> O front lê a URL da API da variável `VUE_APP_API_BASE_URL`.
> Em desenvolvimento ela aponta para `http://localhost:3000` (`.env.development`).

---

## 6. Deploy

### Front-end → GitHub Pages

1. Ajuste `publicPath` em `vue.config.js` com o nome do seu repositório:
   ```js
   publicPath: process.env.NODE_ENV === "production" ? "/pata-feliz/" : "/",
   ```
2. Confirme a URL da API publicada em `.env.production`.
3. Gere o build e publique a pasta `dist/`:
   ```bash
   npm run build
   # publique o conteúdo de dist/ no branch gh-pages (ex.: pacote "gh-pages")
   npx gh-pages -d dist
   ```
4. Em **Settings → Pages**, selecione o branch `gh-pages`.

> **SPA + GitHub Pages:** como usamos `createWebHistory`, copie `dist/index.html` para
> `dist/404.html` antes de publicar, para que rotas como `/pedidos` funcionem ao recarregar.

### API → Render

O repositório `pata-feliz-banco-json` contém o `db.json` e o `package.json` prontos.
Veja o passo a passo no README daquele repositório.

---

Projeto acadêmico — Desenvolvimento Web · Vue 3.
