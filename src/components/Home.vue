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
          <VueIcon />
          Vue.Js
        </div>
        <div class="technology">
          <JsIcon />
          JavaScript
        </div>
        <div class="technology">
          <GoogleIcon />
          Chart API
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 768px) {
  .welcome {
    min-width: 426px;
    min-height: 500px;
  }
  p {
    font-size: 18px;
    max-width: 600px;
  }
}

.technologies {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

p {
  font-size: 16px;
  max-width: 200px;
}

.welcome {
  display: flex;
  flex-flow: column;
  align-items: center;
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