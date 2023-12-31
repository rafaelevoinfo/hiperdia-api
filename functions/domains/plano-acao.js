const CONSTANTES = require('./constantes.js');
const utils = require('../controllers/utils');

class GeradorPlanoAcao {
    _plano;
    gerarPlano(consulta) {
        console.log('Gerando plano:', consulta.data);
        this._plano = {
            id: 1,
            data_consulta: utils.iso8601ToDate(consulta.data),
            recomendacoes: []
        }

        this._verificarProblemaAgua(consulta);
        this._verificarProblemaGorduras(consulta);
        this._verificarProblemasAlimentacao(consulta);
        this._verificarProblemaObsidade(consulta);
        this._verificarProblemaExercicio(consulta);
        this._verificarPosCovid(consulta);
        this._verificarProblemaFaltaInformacaoMedicacao(consulta);
        this._verificarProblemaTabagismo(consulta);
        this._verificarProblemaEtilista(consulta);
        this._verificarProblemaAutomedicacao(consulta);
        this._verificarProblemaSono(consulta);
        this._verificarProblemaAcompanhamentoMedico(consulta);
        this._verificarProblemaRenais(consulta);
        this._verificarProblemasTcm(consulta)

        return this._plano;
    }

    _verificarProblemasTcm(consulta) {
        if (consulta.anti_depressivo){
            this._plano.recomendacoes.push({
                problema: "Conduta terapêutica para pacientes com TCM",
                intervencoes: ['Acompanhamento com psicológico',
                    'Acompanhamento com psiquiatra',
                    'Terapia coletiva']
            });
        }
    }

    _verificarProblemaAgua(consulta) {
        if (consulta.qtde_agua_dia == CONSTANTES.QtdeAguaDia[0]) {
            this._plano.recomendacoes.push({
                problema: "Ingestão de água insuficiente",
                intervencoes: ['Diminua o consumo de alimentos ricos em gordura (frituras; carnes como pernil, picanha, maçã de peito, costela, asa de frango, linguiça, suã etc.; leite integral; queijos amarelos; salgados e manteiga).',
                    'Prefira leite semidesnatado ou desnatado e carnes magras (músculo, acém, lombo etc.).',
                    'Consuma peixe, assados e cozidos pelo menos, uma vez por semana']
            });
        }
    }

    _verificarProblemaGorduras(consulta) {
        if (consulta.fritura) {
            this._plano.recomendacoes.push({
                problema: "Excesso no consumo de gorduras",
                intervencoes: ['Diminua o consumo de alimentos ricos em gordura (frituras; carnes como pernil, picanha, maçã de peito, costela, asa de frango, linguiça, suã etc.; leite integral; queijos amarelos; salgados e manteiga).',
                    'Prefira leite semidesnatado ou desnatado e carnes magras (músculo, acém, lombo etc.) Consuma peixe, assados e cozidos pelo menos, uma vez por semana']
            });
        }
    }

    _verificarProblemasAlimentacao(consulta) {
        if (consulta.alimentos_processados) {
            this._plano.recomendacoes.push({
                problema: "Excesso de embutidos na alimentação",
                intervencoes: ['Evite consumir alimentos ricos em sal como embutidos (presunto, salame e salsicha), temperos prontos (caldos de carnes e de legumes) e alimentos industrializados (azeitonas, enlatados, chips, sopas e molhos prontos etc.).',
                    'Prefira temperos naturais como alho e ervas aromáticas. Use pouco sal para cozinhar.']
            });
        }

        //nao usar !consulta.frutas pq undefined tbm daria true e so queremos que gere a intervenção se de fato o paciente informou NAO
        if (consulta.frutas === false) {
            this._plano.recomendacoes.push({
                problema: "Falta de frutas na alimentação",
                intervencoes: ['Consuma frutas diariamente. O ideal são três porções diárias (uma porção = 1 maçã média ou 1 banana ou 1 fatia média de mamão ou 1 laranja média).',
                    'Para evitar o aumento da glicemia, prefira consumir as frutas acompanhadas com leite, aveia, linhaça, granola diet ou como sobremesa após as refeições, sendo preferencialmente com casca ou bagaço, por possuírem maiores quantidades de fibras.']
            });
        }

        if ((consulta.feijao_leguminosas===false) || (consulta.legumes_verduras===false)) {
            this._plano.recomendacoes.push({
                problema: "Falta de verduras e legumes na alimentação",
                intervencoes: ['Consumir diariamente verduras (alface, almeirão, couve etc.) e legumes (cenoura, pepino, tomate, abobrinha etc.), preferencialmente crus.Recomenda-se ingerir, pelo menos, três porções diárias (uma porção de verduras = 3 colheres de sopa; e de legumes = 2 colheres de sopa).',
                    'Lembre-se: consumo excessivo de legumes como batata, mandioca e cará não são recomendados.']
            });
        }

        if ((consulta.bolos) && (consulta.bolachas)) {
            this._plano.recomendacoes.push({
                problema: "Excesso de carboidratos na refeição",
                intervencoes: ['Evite o consumo excessivo de alimentos ricos em carboidratos complexos como pães, bolos, biscoitos, arroz, macarrão, angu, mandioca, cará, batata e farinhas, preferindo os integrais.',
                    'O ideal é consumir seis porções diárias (uma porção = 1 pão francês ou 2 fatias de pão de forma ou 4 colheres de sopa de arroz).']
            });
        }

        if (consulta.carne_peixe_frango===false) {
            this._plano.recomendacoes.push({
                problema: "Ingestão pobre em proteínas",
                intervencoes: ['Consumir diariamente verduras (alface, almeirão, couve etc.) e legumes (cenoura, pepino)']
            });
        }
    }

    _pacienteObeso(consulta) {
        if ((consulta.peso) && (consulta.altura) && (consulta.altura > 0)) {
            let imc = consulta.peso / (consulta.altura * consulta.altura);
            return (imc > 29.9);
        }
        return false;
    }

    _verificarProblemaObsidade(consulta) {
        if (this._pacienteObeso(consulta)) {
            this._plano.recomendacoes.push({
                problema: "Obesidade",
                intervencoes: ['Encaminhar para o nutricionista.']
            });
        }
    }

    _verificarProblemaExercicio(consulta) {
        if ((consulta.atividades_fisicas===false) ||
            (consulta.frequencia_atividade_fisica in [CONSTANTES.FrequenciaAtividadeFisica[0], CONSTANTES.FrequenciaAtividadeFisica[1]]) ||
            (consulta.frequencia_atividade_fisica == CONSTANTES.DuracaoAtividadeFisica[0])) {
            this._plano.recomendacoes.push(
                {
                    problema: "Não realização de exercício físico ou realizar pouco",
                    intervencoes: ['Pratique atividade física regularmente, sob a supervisão de um profissional capacitado, mas realize um lanche 30 minutos antes para ter energia suficiente para realizar o exercício!',
                        'Orientar sobre a importância da atividade física para controle do nível glicêmico, da pressão arterial e para o bem-estar geral.',
                        'Orientar e estimular a participação em grupos de atividade física realizados na unidade de saúde.']
                });
        }
    }

    _verificarPosCovid(consulta) {
        if (consulta.infeccao_covid) {
            this._plano.recomendacoes.push({
                problema: "Pacientes pós COVID-19",
                intervencoes: ['Acompanhamento com equipe profissional frequentemente.',
                    'Verificar intercorrências após infecção por COVID (pneumonia recorrente, cansaço, alterações de humor, outros)']
            });
        }
    }

    _verificarProblemaFaltaInformacaoMedicacao(consulta) {
        if (consulta.uso_medicamento_controle_hipertensao_conforme_prescricao===false) {
            this._plano.recomendacoes.push({
                problema: "Paciente com falta de informação sobre a medicação",
                intervencoes: ['Verificação do uso correto das medicações e informar quanto a sua posologia ideal.',
                    'Não tomar a medicação prescrita para diabetes e não se alimentar corretamente.',
                    'Orientar sobre a necessidade de verificar a glicemia antes de administrar a insulina.']
            });
        }
    }

    _verificarProblemaTabagismo(consulta) {
        if (consulta.uso_tabaco) {
            this._plano.recomendacoes.push({
                problema: "Tabagista",
                intervencoes: ['Orientar a participação em grupo de tabagismo.', 'Atenção Básica de Saúde.']
            });
        }
    }

    _verificarProblemaEtilista(consulta) {
        if ((consulta.consume_bebiba_alcoolica) &&
            (consulta.frequencia_bebiba_alcoolica == CONSTANTES.FrequenciaBebida[0]) &&//todos os dias
            (consulta.quantidade_bebiba_alcoolica == CONSTANTES.QuantidadeBebida[0])) {
            this._plano.recomendacoes.push({
                problema: "Etilista",
                intervencoes: ['Fazer uso consciente de bebidas alcóolicas (reduzir ou parar de beber)']
            });
        }
    }

    _verificarProblemaAutomedicacao(consulta) {
        if (consulta.auto_medicacao) {
            this._plano.recomendacoes.push({
                problema: "Paciente faz automedicação",
                intervencoes: ['Não realizar medicação sem orientação médica.']
            });
        }
    }

    _verificarProblemaSono(consulta) {
        if ((consulta.rotina_sono == CONSTANTES.RotinaSono[2]) || //4-6h
            (consulta.rotina_sono == CONSTANTES.RotinaSono[3])) {//< 4h
            this._plano.recomendacoes.push({
                problema: "Problemas com Sono",
                intervencoes: ['Articular com o paciente/família as medidas de conforto, técnicas de monitoramento do sono e as mudanças no estilo de vida.',
                    'Observar as circunstâncias físicas (apneia do sono, via aérea obstruída, dor/desconforto).',
                    'Necessidade de um ambiente calmo e seguro.',
                    'Monitorar rotina de hábitos diurnos (quantidade de sonecas diurnas)']
            });
        }
    }

    _verificarProblemaAcompanhamentoMedico(consulta) {
        if ((this._pacienteObeso(consulta)) ||
            (consulta.diabetes) ||
            (consulta.hipertensao_arterial) ||
            (consulta.infarto) || (consulta.avc_derrame) || (consulta.cancer)) {
            this._plano.recomendacoes.push({
                problema: "Necessidade de acompanhamento médico",
                intervencoes: ['Acompanhamento rotineiro com a equipe multidisciplinar']
            });
        }

    }

    _verificarProblemaRenais(consulta) {
        if (consulta.problemas_rins) {
            this._plano.recomendacoes.push({
                problema: "Paciente com problemas renais",
                intervencoes: ['Realizar as consultas regularmente com o medico (a) da unidade Básica de Saúde e com o especialista (nefrologista) caso esteja sendo acompanhado.',
                    'Orientar o usuario sempre observar os sinais e sintomas como redução ou dificuldade de urinar, edemas (inchassos) nos MMII (pernas, tornozelos e pés) e buscar por assistência dos profissionais da saúde (médico/enfermeiro)']
            });
        }
    }
}
module.exports = GeradorPlanoAcao;