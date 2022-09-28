const Alergias = ['Captopril', 'Enalapril','Lisinopril','Ramipril']
const SituacaoAlimentar = ['Jejum', 'Pós-prandial']
const QtdeRefeicoesDia = ['1x ou menos', '2x', '4x', '6x ou mais']
const QtdeAguaDia = ['Menos de 2L', '2L', 'Mais de 2L']

const FrequenciaBebida = ['Todos os dias', 'Apenas finais de semana'];
const QuantidadeBebida = ['Um copo', 'Entre dois e cinco copos', 'Mais que cinco copos'];
const TipoBebida = ['Cerveja', 'Cachaça', 'Vinho', 'Todo tipo de bebida'];
const TipoTabaco = ['Cigarro tradicional', 'Cigarro de palha e fumo', 'Narguilé', 'Cigarro eletrônico', 'Charuto']
const QuantidadeTabaco = ['Um cigarro ao dia', 'Uma carteira  por dia', 'Um maço por semana', 'Mais de uma carteira ao dia', 'Mais de maço por semana'];
const FrequenciaTabaco = ['Uma vez no dia', 'Duas a três vezes ao dia', 'Mais de quatro vezes ao dia'];
const DuracaoTabaco = ['Menos de 30 minutos', '30 minutos', '30 a 60 minutos', 'Mais de 60 minutos'];
const TipoAtividadesFisicas = ['Caminhada', 'Academia', 'Dança', 'Corrida', 'Ciclismo', 'Outra'];
const FrequenciaAtividadeFisica = ['Uma vez por semana', 'Duas vezes por semana', 'Três vezes por semana', 'Acima de quatro vezes por semana'];
const DuracaoAtividadeFisica = ['30 minutos', '30 a 60 minutos', 'Mais de 60 minutos'];
const VacinasCovid = ['Astrazeneca', 'Coronavac', 'Jansen', 'Pfizer', 'Covaxin', 'Sputnik V']
const TempoDescobriuHipertensaoDiabetes = ['Menos de um ano', '6 meses a 1 ano', 'Entre 1 e 5 anos', 'Entre 5 e 10 anos', 'Acima de 10 anos'];
const MedicamentosHipertensaoCronica = ['Anlodipino', 'Espironolactona', 'Furosemida', 'Cloridrato de Hidralazina', 'Hidroclorotiazida',
    'Losartana', 'Metildopa', 'Atenolol', 'Captopril', 'Carvedilol', 'Cloridrato de propranolol', 'Cloridrato de verapamil', 'Maleato de Enalapril',
    'Succinato de metoprolol', 'Tartarato de metoprolol', 'Nifedipino'];
const SintomasProcurarMedico = ['Dores no peito', 'Dor de cabeça', 'Tonturas', 'Zumbido no ouvido', 'Fraqueza', 'Visão embaçada', 'Poliúria', 'Perda de peso', 'Náusea e vômito', 'Boca seca'];
const MedicamentosDiabetes = ['Gliclazida 60mg', 'Glimepirida 2mg', 'Metformina 850 mg', 'Metformina 500mg', 'Glibenclamida 5mg', 'Insulina NPH', 'Insulina Regular'];
const TipoDificuldadeAcessoCuidadoBasicos = ['Acesso a consulta', 'Acesso a medicação', 'Acesso ao monitoramento e controle da doença', 'Todas as situações'];
const AcompanhamentoProfissionaisSaude = ['Atenção básica', 'Rede particular'];
const RecomendacoesProfissionaisSaude = ['Utilizar a dose do medicamento regularmente', 'Controlar a dieta', 'Realizar atividades físicas', 'Monitorar a pressão ou a diabete regularmente',
    'Procurar assistência de algum profissional de saúde em caso de duvida ou descompensação da doença', 'Não recebeu nenhuma orientação'];
const QuandoAvcDerrameInfarto = ['Menos de um ano', 'Mais de um ano'];
const TipoCancer = ['Mama', 'Colo do útero', 'Próstata', 'Colo de reto', 'Pulmão', 'Outro'];
const MotivoInternacao = ['Diabetes descompensada', 'Hipertensão descompensada', 'Outras'];
const ExamesUltimos12Meses = ['Endoscopia', 'Colonoscopia', 'Biópsia', 'Cateterismo', 'Ecografia', 'Mamografia', 'Teste Oral de Tolerância a glicose',
    'Eletrocardiograma', 'Ecocardiograma', 'Radiografia', 'Teste ergométrico (esteira)', 'Holter/MAPA', 'Ressonância magnética', 'Tomografia', 'Angiografia', 'Hemoglobina glicada'];

const Estados = ['Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'];
const RotinaSono = ['Mais de 8 horas', 'Entre 6 e 8 horas', 'Entre 4 e 6 horas', 'Menos de 4 horas'];

module.exports = {QtdeAguaDia, 
                  FrequenciaAtividadeFisica, 
                  DuracaoAtividadeFisica,
                  FrequenciaBebida,
                  QuantidadeBebida,
                  RotinaSono}