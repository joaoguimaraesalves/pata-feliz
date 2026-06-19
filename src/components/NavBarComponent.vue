<template>
  <div>
    <nav id="nav">
      <router-link to="/" id="logo-url">
        <img src="/img/logo_pata_feliz.svg" id="logo" alt="Pata Feliz" />
        <span id="marca">Pata Feliz</span>
      </router-link>
      <div id="links">
        <router-link to="/">Início</router-link> |
        <router-link to="/menu">Serviços</router-link> |
        <router-link to="/pedidos">Agendamentos</router-link>
      </div>
    </nav>
  </div>
</template>
<script>
export default {
  name: "NavBarComponent",
};
</script>
<style scoped>
#logo {
  width: 50px;
  height: 50px;
}

#logo:hover {
  rotate: 360deg;
  transition: 0.4s;
}

#logo-url {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: auto;
  text-decoration: none;
}

#marca {
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 0.5px;
}

#nav {
  background-color: #2aa7a0;
  border-bottom: #f7a440 4px solid;
  padding: 15px 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#nav a {
  color: #fff;
  text-decoration: none;
  margin-left: 16px;
  font-size: 18px;
}

#links a:hover {
  color: #ffe7c2;
  font-size: 20px;
  transition: 0.2s;
}

#nav a.router-link-exact-active {
  text-decoration: underline;
}
</style>
