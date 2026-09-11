export const PERGUNTAS = [
  {
    id: 'p1',
    campo: null,
    pontua: true,
    pergunta: 'Se você pudesse resolver uma coisa na sua pele este ano, qual seria?',
    ajuda: 'Não existe resposta certa. Escolha a que mais te incomoda hoje.',
    opcoes: [
      { letra: 'A', valor: 'tom', label: 'O tom. Manchas, marcas que ficaram, uma pele que não fica uniforme.' },
      { letra: 'B', valor: 'olhar', label: 'O olhar. A área dos olhos denuncia primeiro, e é a que mais me incomoda.' },
      { letra: 'C', valor: 'firmeza', label: 'A firmeza. O contorno afrouxou, e tem linha que virou permanente.' },
      { letra: 'D', valor: 'barreira', label: 'O conforto. Repuxa, descama, reage a quase tudo que eu passo.' },
    ],
  },
  {
    id: 'p2',
    campo: null,
    pontua: true,
    pergunta: 'No fim do dia, quando você se olha no espelho, o que aparece primeiro?',
    ajuda: null,
    opcoes: [
      { letra: 'A', valor: 'tom', label: 'O tom fica irregular sob a luz. Áreas mais escuras do que de manhã.' },
      { letra: 'B', valor: 'olhar', label: 'Os olhos parecem mais fundos e mais escuros do que estavam cedo.' },
      { letra: 'C', valor: 'firmeza', label: 'O rosto parece descer. O maxilar perde o desenho no fim do dia.' },
      { letra: 'D', valor: 'barreira', label: 'A pele fica opaca e áspera, e a maquiagem começa a marcar.' },
    ],
  },
  {
    id: 'p3',
    campo: 'faixa_etaria',
    pontua: false,
    pergunta: 'Qual é a sua idade?',
    ajuda: 'Isso muda a leitura do seu resultado.',
    opcoes: [
      { letra: 'A', valor: '25-34', label: '25 a 34' },
      { letra: 'B', valor: '35-44', label: '35 a 44' },
      { letra: 'C', valor: '45-54', label: '45 a 54' },
      { letra: 'D', valor: '55-64', label: '55 a 64' },
      { letra: 'E', valor: '65-mais', label: '65 ou mais' },
    ],
  },
  {
    id: 'p4',
    campo: 'estagio_rotina',
    pontua: false,
    pergunta: 'Como está a sua rotina de pele hoje?',
    ajuda: null,
    opcoes: [
      { letra: 'A', valor: 'sem_rotina', label: 'Não tenho rotina. Lavo o rosto e às vezes passo um hidratante.' },
      { letra: 'B', valor: 'satisfeita', label: 'Tenho rotina e estou satisfeita com o que ela entrega.' },
      { letra: 'C', valor: 'estacionou', label: 'Tenho rotina, uso bons produtos — e mesmo assim sinto que estacionei.' },
    ],
  },
];
