# Lar em Dia

Aplicativo em português para finanças do casal, contas, orçamento, metas e acompanhamento de financiamento de terreno. Next.js, Neon Postgres e Neon Auth.

## Configuração

Variáveis privadas: `DATABASE_URL`, `NEON_AUTH_BASE_URL` e, recomendado, `NEON_AUTH_COOKIE_SECRET` (32 caracteres ou mais). Nunca versionar `.env.local`. Configure a origem de produção como domínio permitido no Neon Auth. O código precisa de Node.js 22 ou posterior.

- `npm ci`: dependências.
- `npm run migrate`: cria as tabelas sem apagar dados, usando `.env.local`.
- `npm run build`: compilação.
- `npm start`: servidor de produção.

## Primeiro acesso

Crie sua conta e um lar. Cadastre uma conta com saldo inicial, depois os movimentos a partir dessa data. Em **Nosso lar**, o responsável gera um código válido por 24 horas. O par cria uma conta separada e informa esse código antes de criar outro lar.

## Regras financeiras

Valores monetários são armazenados em centavos inteiros. Transferências não entram nas despesas ou receitas. Saldos consideram somente movimentos confirmados até hoje e posteriores ao saldo inicial. O gráfico e as métricas mensais usam o período e a pessoa selecionados. Limites mensais incluem despesas pagas e pendentes do casal. Metas são reservas informativas.

O terreno usa o saldo do demonstrativo e subtrai somente principal amortizado registrado após a data-base. Juros e encargos não reduzem o principal. A simulação Price/SAC usa taxa fixa, prazo restante informado e amortização extraordinária imediata; não prevê indexadores, atrasos, reajustes ou taxas variáveis. Atualize saldo e prazo com o credor. Simular não registra um pagamento.

Fotos passam por OCR no navegador e não ficam arquivadas. O ditado depende de SpeechRecognition e do serviço do navegador; não é upload de arquivos de áudio. O reconhecimento exige revisão manual antes de salvar. Se indisponível, use o microfone do teclado ou texto. Não há integração bancária automática.

## Acesso e persistência

Todas as operações financeiras exigem sessão autenticada e associação ao lar. O servidor valida contas, responsável, versão e origem das gravações. Convites são aleatórios, armazenados como hash e usados uma vez. Dados são sincronizados ao abrir, voltar à janela ou atualizar o painel. Não há modo offline.
