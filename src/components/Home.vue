<template>
  <div class="welcome">
    <h1>Teste Front-end</h1>
    <p>
      Neste teste de Front-end demonstro minhas habilidades utilizando tecnologias
      modernas para um cenário simulado.
    </p>
    <p>
      Utilizo Vue.Js nesse teste por estar familiarizado com sua sintaxe.
    </p>
    <div>
      <h3>Tecnologias utilizadas para o teste</h3>
      <div class="technologies">
        <div class="technology">
          <VueIcon style="width: 50px; height: 50px" />
          Vue.Js
        </div>
        <div class="technology">
          <JsIcon style="width: 50px; height: 50px" />
          JavaScript
        </div>
        <div class="technology">
          <GoogleIcon style="width: 50px; height: 50px"  />
          Chart API
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  p {
    max-width: 200px !important;
  }
}

.technologies {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.welcome {
  flex-flow: column;
  align-items: center;
  display: flex;
  min-height: 500px;
}
p {
  font-size: 16px;
  max-width: 300px;
  min-width: 250px;
}

.technology {
  display: flex;
  justify-content: center;
  flex-flow: column;
  max-width: 75px;
  max-height: 75px;
  align-items: center;
}



</style>