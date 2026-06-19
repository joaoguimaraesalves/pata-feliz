<template>
  <div id="main-banner">
    <div class="banner-texto">
      <h1>Banho &amp; Tosa com amor 🐾</h1>
      <p>Seu pet merece sair sempre limpinho, cheiroso e feliz.</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "BannerComponent",
};
</script>
<style scoped>
#main-banner {
  height: 280px;
  background: linear-gradient(120deg, #2aa7a0 0%, #1f7c77 60%, #f7a440 140%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.banner-texto {
  background: rgba(0, 0, 0, 0.25);
  padding: 24px 40px;
  border-radius: 16px;
  max-width: 600px;
}

#main-banner h1 {
  font-size: 38px;
  margin: 0 0 8px 0;
}

#main-banner p {
  font-size: 18px;
  margin: 0;
}
</style>
