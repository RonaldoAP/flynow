// Vale para os quatro perfis. NAO nomeia a raiz de proposito: o quiz nomeia a
// QUEIXA, e quem revela a raiz e o M1-E2, que chama de "o sinal de reparo". A
// funcao desta linha e criar a lacuna que o e-mail fecha - ela sabe que existe
// um nome, e que vai receber. Se o nome aparecesse aqui, o M1-E1 abriria com
// "a parte que o quiz nao te contou" tendo sido contada.
export const PROMESSA_COMUM =
  'Os quatro resultados possíveis deste quiz têm a mesma coisa por baixo. ' +
  'Ela tem nome, e é a primeira coisa que eu te conto.';

export const RESULTADOS = {
  tom: {
    nome: 'Tom desigual',
    oQueQuerDizer:
      'Sua pele está produzindo pigmento de forma desorganizada. Não é sujeira e não é falta de esfoliação. Quase nunca é uma mancha só — é um padrão que aparece em áreas que já foram inflamadas, marcadas por sol, ou que passaram por alguma agressão anos atrás. O tom fica irregular porque a pele perdeu parte da capacidade de uniformizar o que produz.',
    sinais: [
      'Áreas mais escuras que ficam depois que uma espinha ou irritação some',
      'O tom fica visivelmente mais irregular no fim do dia e sob luz forte',
      'A base cobre, mas você percebe a diferença assim que sai',
    ],
    oQueNaoE:
      'Não é falta de esfoliação. Esfoliar mais uma pele de tom desigual costuma piorar: remove barreira, aumenta inflamação — e inflamação é justamente o que gera pigmento.',
    ponte: 'Tem um motivo para a mancha voltar mesmo quando você trata a mancha. Amanhã eu te mando.',
  },

  olhar: {
    nome: 'Olhar cansado',
    oQueQuerDizer:
      'A área dos olhos tem a pele mais fina do rosto e quase nenhuma glândula. É a primeira região onde qualquer perda de sustentação aparece — antes da bochecha, antes do maxilar. Quando a estrutura por baixo cede um pouco, a região afunda de leve, o que passa por baixo fica mais visível, e o resultado é um olhar que parece cansado mesmo quando você dormiu bem.',
    sinais: [
      'Você dorme bem e mesmo assim ouve que parece cansada',
      'A olheira piora ao longo do dia, e não é pior de manhã',
      'Corretivo marca na região e acumula nas linhas finas',
    ],
    oQueNaoE:
      'Não é necessariamente sono, e quase nunca é falta de beber água. Olheira que não melhora depois de uma boa noite de sono raramente é sobre descanso.',
    ponte: 'A área dos olhos denuncia primeiro por um motivo específico. E não é sono.',
  },

  firmeza: {
    nome: 'Firmeza em queda',
    oQueQuerDizer:
      'Firmeza é sustentação, não hidratação. O que segura o rosto no lugar é uma malha que a sua pele reconstrói continuamente — e essa reconstrução desacelerou. Quando desacelera, o contorno perde definição antes de qualquer ruga aparecer, e as linhas de expressão que sumiam sozinhas começam a ficar.',
    sinais: [
      'O contorno do maxilar perde o desenho no fim do dia',
      'Linhas que antes sumiam quando você relaxava o rosto agora ficam',
      'A pele demora mais para voltar quando você belisca as costas da mão',
    ],
    oQueNaoE:
      'Não é falta de um creme mais caro nem de mais camadas. Firmeza não entra pela superfície — ela é construída por baixo, e leva tempo.',
    ponte: 'Firmeza não se perde por falta de colágeno. Amanhã eu te explico o que realmente falta.',
  },

  barreira: {
    nome: 'Barreira sem conforto',
    oQueQuerDizer:
      'A camada mais externa da sua pele funciona como uma parede: células e gordura que seguram a água dentro e o resto fora. Quando essa parede afrouxa, a água evapora rápido demais e irritante nenhum encontra resistência. O resultado é uma pele que repuxa depois de lavar, descama em pontos, e reage a produtos que antes tolerava bem.',
    sinais: [
      'Repuxa nos primeiros minutos depois de lavar o rosto',
      'Arde ou fica vermelha com produtos que você já usava sem problema',
      'Fica opaca e áspera mesmo logo depois do hidratante',
    ],
    oQueNaoE:
      'Não é falta de beber água. Hidratação de pele é retenção, não ingestão — uma barreira frágil perde água por mais que você beba.',
    ponte: 'Pele que repuxa quase nunca é pele com falta de água. Amanhã eu te mostro o que é.',
  },
};
