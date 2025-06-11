# Exemplo de Frontend

Um dashboard moderno para monitoramento de sensores industriais com análise preditiva usando Machine Learning.

## O que é este projeto?

Este é um sistema de monitoramento industrial que simula dados de sensores IoT em tempo real, incluindo:

- **Monitoramento de Sensores**: Temperatura, velocidade rotacional, torque
- **Análise Preditiva**: Sistema de ML que detecta possíveis falhas
- **Alertas Inteligentes**: Notificações automáticas para anomalias
- **Dashboard Visual**: Gráficos e métricas em tempo real

Os dados são atualizados automaticamente a cada 15 segundos.

## Como executar o projeto

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm, yarn ou bun

### Passos para executar

1. **Instale as dependências**:
   ```bash
   npm install
   ```

2. **Execute o projeto**:
   ```bash
   npm run dev
   ```

3. **Acesse no navegador**:
   - Abra `http://localhost:5173`

Pronto! O dashboard estará funcionando com dados simulados.

## Tecnologias utilizadas

- **React + TypeScript** - Interface principal
- **Vite** - Build e servidor de desenvolvimento
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes de interface
- **Recharts** - Gráficos e visualizações
- **React Query** - Gerenciamento de dados

## Funcionalidades principais

### Monitoramento em Tempo Real
- Temperatura do ar e processo
- Velocidade rotacional (RPM)
- Torque mecânico
- Status da máquina

### Sistema de Alertas
- Detecção de temperatura elevada
- Sobrecarga mecânica
- Desacoplamento de sistema
- Possível travamento

### Análise Preditiva
- Modelo de ML simulado
- Probabilidade de falha
- Fatores de risco identificados
- Status automático (saudável/atenção/crítico)

## Scripts disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build localmente
- `npm run lint` - Verifica código

## Estrutura do projeto
