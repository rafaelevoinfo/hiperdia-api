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

        this._verificarSituacaoAlimentar(consulta);
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
        this._verificarProblemaRenais(consulta);
        this._verificarProblemasTmc(consulta)
        this._verificarMos(consulta)


        return this._plano;
    }

    _verificarMos(consulta) {
        //parte I
        let soma = ((consulta.apoio_material_ficar_cama ? consulta.apoio_material_ficar_cama : 0) +
            (consulta.apoio_material_ajuda_tarefa_diaria ? consulta.apoio_material_ajuda_tarefa_diaria : 0) +
            (consulta.apoio_material_levar_medico ? consulta.apoio_material_levar_medico : 0) +
            (consulta.apoio_material_preparar_refeicoes ? consulta.apoio_material_preparar_refeicoes : 0));

        if (soma <= 6) {
            this._plano.recomendacoes.push({
                problema: "Apoio Material - Baixa Percepção",
                intervencoes: ['Identificar recursos e programas sociais disponíveis para auxiliar em necessidades materiais. Conectar a pessoa a organizações de apoio financeiro ou programas governamentais.']
            });
        } else if (soma <= 13) {
            this._plano.recomendacoes.push({
                problema: "Apoio Material - Média Percepção",
                intervencoes: ['Avaliar as necessidades materiais específicas e fornecer informações sobre recursos disponíveis. Colaborar com organizações locais para garantir acesso a serviços essenciais.']
            });
        } else {
            this._plano.recomendacoes.push({
                problema: "Apoio Material - Alta Percepção",
                intervencoes: ['Reforçar a autonomia financeira, ajudando na busca por oportunidades de emprego ou treinamento profissional. Oferecer orientação sobre gestão financeira.']
            });
        }

        //Parte 2
        soma = ((consulta.apoio_afetivo_abraco ? consulta.apoio_afetivo_abraco : 0) +
            (consulta.apoio_afetivo_afeto_voce ? consulta.apoio_afetivo_afeto_voce : 0) +
            (consulta.apoio_afetivo_sentir_querido ? consulta.apoio_afetivo_sentir_querido : 0));

        if (soma <= 4) {
            this._plano.recomendacoes.push({
                problema: "Apoio Afetivo - Baixa Percepção",
                intervencoes: ['Identificar redes de suporte social existentes e incentivar a participação em atividades sociais. Explorar a possibilidade de grupos de apoio.']
            });
        } else if (soma <= 10) {
            this._plano.recomendacoes.push({
                problema: "Apoio Afetivo - Média Percepção",
                intervencoes: ['Estimular relações sociais positivas. Facilitar encontros com amigos e familiares. Incentivar a comunicação aberta sobre sentimentos.']
            });
        } else {
            this._plano.recomendacoes.push({
                problema: "Apoio Afetivo - Alta Percepção",
                intervencoes: ['Reforçar a importância das relações afetivas existentes. Promover atividades que fortaleçam laços emocionais, como eventos familiares ou encontros sociais.']
            });
        }

        //Parte 3
        soma = ((consulta.apoio_emocional_ouvilo_falar ? consulta.apoio_emocional_ouvilo_falar : 0) +
            (consulta.apoio_emocional_problemas ? consulta.apoio_emocional_problemas : 0) +
            (consulta.apoio_emocional_bons_conselhos ? consulta.apoio_emocional_bons_conselhos : 0) +
            (consulta.apoio_emocional_compreenda_problemas ? consulta.apoio_emocional_compreenda_problemas : 0) +
            (consulta.apoio_emocional_compreender_situacao ? consulta.apoio_emocional_compreender_situacao : 0) +
            (consulta.apoio_emocional_medos_intimos ? consulta.apoio_emocional_medos_intimos : 0) +
            (consulta.apoio_emocional_quer_conselhos ? consulta.apoio_emocional_quer_conselhos : 0) +
            (consulta.apoio_emocional_sugestao_problema_pessoal ? consulta.apoio_emocional_sugestao_problema_pessoal : 0));

        if (soma <= 12) {
            this._plano.recomendacoes.push({
                problema: "Apoio Emocional/Informacional - Baixa Percepção",
                intervencoes: ['Fornecer informações claras sobre recursos de apoio emocional, como serviços de aconselhamento. Estimular a expressão emocional.']
            });
        } else if (soma <= 28) {
            this._plano.recomendacoes.push({
                problema: "Apoio Emocional/Informacional - Média Percepção",
                intervencoes: ['Oferecer informações sobre serviços de aconselhamento e recursos emocionais disponíveis. Encorajar a busca ativa de apoio quando necessário.']
            });
        } else {
            this._plano.recomendacoes.push({
                problema: "Apoio Emocional/Informacional - Alta Percepção",
                intervencoes: ['Reforçar a importância do autocuidado emocional. Promover a participação em atividades que promovam o bem-estar emocional.']
            });
        }

        //Parte 4
        soma = ((consulta.interacao_social_distrair_cabeca ? consulta.interacao_social_distrair_cabeca : 0) +
            (consulta.interacao_social_divertir_junto ? consulta.interacao_social_divertir_junto : 0) +
            (consulta.interacao_social_fazer_coisas_agradaveis ? consulta.interacao_social_fazer_coisas_agradaveis : 0) +
            (consulta.interacao_social_relaxar ? consulta.interacao_social_relaxar : 0));

        if (soma <= 6) {
            this._plano.recomendacoes.push({
                problema: "Interação social positiva",
                intervencoes: ['Identificar barreiras para a interação social e desenvolver estratégias para superá-las. Incentivar a participação em grupos sociais.']
            });
        } else if (soma <= 13) {
            this._plano.recomendacoes.push({
                problema: "Interação social positiva",
                intervencoes: ['Promover a participação em atividades sociais. Identificar interesses e hobbies para facilitar a conexão com grupos afins.']
            });
        } else {
            this._plano.recomendacoes.push({
                problema: "Interação social positiva",
                intervencoes: ['Incentivar a manutenção de relações sociais positivas. Apoiar a participação em eventos sociais e atividades de grupo.']
            });
        }

    }

    _verificarSituacaoAlimentar(consulta) {
        
        if (consulta.hgt) {
            if (consulta.tipo_situacao_pos_prandial == CONSTANTES.TipoSituacaoPosPrandial[0] ||
                consulta.tipo_situacao_pos_prandial == CONSTANTES.TipoSituacaoPosPrandial[1]) {
                let hiperglicemia = undefined;
                if (consulta.hgt > 250) {
                    hiperglicemia = {
                        problema: "Hiperglicemia (Nível 2)",
                        intervencoes: ['Se o paciente estiver usando insulina, uma dose adicional de insulina rápida ou regular pode ser administrada conforme orientação médica;',
                            'Incentivar a ingestão adequada de líquidos, especialmente água, para ajudar a reduzir os níveis de glicose, ou, sobre prescrição medica infusão de soro fisiológico ou Ringuer simples pela vida endovenosa;',
                            'Estimular a atividade física leve, se apropriado, para ajudar na redução da glicose.']
                    };
                } else if (consulta.hgt > 180) {
                    hiperglicemia = {
                        problema: "Hiperglicemia (Nível 1)",
                        intervencoes: ['Implementar monitoramento frequente dos níveis de glicose para identificar padrões e ajustar o tratamento;',
                            'Considerar ajustes nas doses de medicamentos hipoglicemiantes orais ou insulina, conforme orientação médica;',
                            'Avaliar e ajustar a dieta do paciente, garantindo uma ingestão controlada de carboidratos.']
                    };
                }
                
                if (hiperglicemia) {                    
                    hiperglicemia.outras_informacoes = {
                        titulo: "Outras intervenções casos de hiperglicemia",
                        orientacoes: [
                            {
                                titulo: "Educação do Paciente",
                                items: [
                                    'Educar o paciente sobre o gerenciamento adequado da diabetes, incluindo monitoramento regular, administração de medicamentos conforme prescrito e ajuste da dieta;',
                                    'Ensinar o paciente a reconhecer sintomas de hiperglicemia e cetoacidose para que possam procurar ajuda médica imediatamente.'
                                ]
                            },
                            {
                                titulo: "Acompanhamento Médico",
                                items: [
                                    'Estabelecer consultas de acompanhamento regulares com o médico para avaliar a eficácia do plano de tratamento e ajustá-lo conforme necessário'
                                ]
                            }]
                    }
                    this._plano.recomendacoes.push(hiperglicemia);
                }

                let hipoglicemia = undefined
                if (consulta.hgt < 54) {
                    hipoglicemia = {
                        problema: "Hipoglicemia (Nível 2)",
                        intervencoes: ['Administrar carboidratos de ação rápida, como glicose em gel, comprimidos de glicose ou um copo de suco de laranja;',
                            'Instruir a pessoa a realizar nova medição da glicose após 15 minutos para garantir que os níveis estejam subindo;',
                            'Se os sintomas persistirem ou piorarem, considerar administração adicional de carboidratos e buscar assistência médica se necessário;',
                            'Se a pessoa estiver inconsciente ou não puder ingerir carboidratos por via oral, administrar glicose intravenosa (IV) em ambiente hospitalar.']
                    };
                } else if (consulta.hgt < 71) {
                    hipoglicemia = {
                        problema: "Hipoglicemia (Nível 1)",
                        intervencoes: ['Inicialmente, é importante educar a pessoa sobre os sintomas da hipoglicemia para que ela possa reconhece-los;',
                            'Recomendar a ingestão de carboidratos de rápida absorção, como suco de frutas ou um pequeno lanche contendo açúcares simples;',
                            'Monitorar os níveis de glicose após a intervenção para garantir que eles voltem ao intervalo alvo;',
                            'Avaliar a ingestão recente de insulina ou medicamentos antidiabéticos, ajustando se necessário.']
                    };
                }

                if (hipoglicemia) {
                    hipoglicemia.outras_informacoes = {
                        titulo: "Outras intervenções casos de hipoglicemia",
                        orientacoes: [
                            {
                                titulo: "Educação do Paciente",
                                items: [
                                    'Independentemente do nível de hipoglicemia, é fundamental que a pessoa com diabetes seja monitorada de perto e receba acompanhamento médico para ajustar seu plano de tratamento, incluindo doses de medicamentos, dieta e atividade física;',
                                    'A educação contínua sobre o manejo da hipoglicemia também é essencial para prevenir recorrências.'
                                ]
                            }]
                    }
                    this._plano.recomendacoes.push(hipoglicemia);
                }

            }
        }
    }


    _verificarProblemasTmc(consulta) {
        if (consulta.anti_depressivo) {
            this._plano.recomendacoes.push({
                problema: "Conduta terapêutica para pacientes com TMC",
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

        if ((consulta.feijao_leguminosas === false) || (consulta.legumes_verduras === false)) {
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

        if (consulta.carne_peixe_frango === false) {
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
        if ((consulta.atividades_fisicas === false) ||
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
        if (consulta.uso_medicamento_controle_hipertensao_conforme_prescricao === false) {
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