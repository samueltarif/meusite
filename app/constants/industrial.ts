import type { IndustrialProduct } from '~/types/industrial'

export const productFamilies = [
  { id: 'valvulas', name: 'Válvulas', description: 'Controle e direcionamento de fluxo para processos industriais.', image: '/images/campaign/06510.png' },
  { id: 'reguladores', name: 'Reguladores de pressão', description: 'Regulação para sistemas de gases e aplicações criogênicas.', image: '/images/campaign/gdr.png' },
  { id: 'instrumentacao', name: 'Instrumentação', description: 'Medição de pressão para monitoramento e controle de processos.', image: '/images/campaign/21353.jpg' },
]

const catalogSource = 'https://catalogo-tecnico-qualitec.vercel.app/catalogo'
export const industrialProducts: IndustrialProduct[] = [
  { id: 'gdr', model: 'GDR', name: 'Regulador de pressão para gases', manufacturer: 'Generant', family: 'reguladores', image: '/images/campaign/gdr.png', pdf: '/datasheets/gdr.pdf', source: catalogSource,
    specs: [{ label: 'Conexões', value: '1/4″ a 1″, conforme configuração' }, { label: 'Entrada máxima', value: '40 bar' }, { label: 'Pressão de saída', value: 'Até 31 bar (GDR-500); 15,5 bar (GDR-1000)' }, { label: 'Material', value: 'Latão' }] },
  { id: '591', model: '591.250', name: 'Regulador de alta pressão', manufacturer: 'Qualitec', family: 'reguladores', image: '/images/campaign/591.png', pdf: '/datasheets/591.pdf', source: catalogSource,
    specs: [{ label: 'Entrada máxima', value: '250 bar' }, { label: 'Saída máxima', value: '206 bar (3.000 psi)' }, { label: 'Temperatura', value: '−30 a +70 °C' }, { label: 'Material', value: 'Aço inoxidável' }] },
  { id: 'bprx', model: 'BPRX', name: 'Regulador de contrapressão', manufacturer: 'Generant', family: 'reguladores', image: '/images/campaign/bprx.png', pdf: '/datasheets/bprx.pdf', source: 'https://www.generant.com/product-bprx.html',
    specs: [{ label: 'Entrada máxima', value: '51,7 bar' }, { label: 'Faixas de ajuste', value: '1,0 a 41,4 bar, conforme mola' }, { label: 'Temperatura', value: '−196 a +93 °C' }, { label: 'Conexão', value: '3/8″ ou 1/2″ NPT' }, { label: 'Material', value: 'Latão ou aço inoxidável 316' }] },
  { id: '06510', model: '06510', name: 'Válvula de três vias', manufacturer: 'HEROSE', family: 'valvulas', image: '/images/campaign/06510.png', pdf: '/datasheets/06510.pdf', source: catalogSource,
    specs: [{ label: 'Diâmetro nominal', value: 'DN 20' }, { label: 'Classe de pressão', value: 'PN 50' }, { label: 'Temperatura', value: '−196 a +120 °C' }, { label: 'Material', value: 'Bronze' }, { label: 'Saídas', value: '1/2″ ou 3/4″' }] },
  { id: '06512', model: '06512', name: 'Válvula de três vias', manufacturer: 'HEROSE', family: 'valvulas', image: '/images/campaign/06512.png', pdf: '/datasheets/06512.pdf', source: catalogSource,
    specs: [{ label: 'Diâmetro nominal', value: 'DN 20' }, { label: 'Classe de pressão', value: 'PN 50' }, { label: 'Temperatura', value: '−196 a +120 °C' }, { label: 'Material', value: 'Bronze' }, { label: 'Saídas', value: '1/2″ ou 3/4″' }] },
  { id: '06530', model: '06530', name: 'Válvula de três vias em inox', manufacturer: 'HEROSE', family: 'valvulas', image: '/images/campaign/06530.png', pdf: '/datasheets/06530.pdf', source: catalogSource,
    specs: [{ label: 'Diâmetro nominal', value: 'DN 20' }, { label: 'Classe de pressão', value: 'PN 50' }, { label: 'Temperatura', value: '−196 a +120 °C' }, { label: 'Material', value: 'Aço inoxidável' }, { label: 'Saídas', value: '1/2″ ou 3/4″' }] },
  { id: '21353', model: '213.53', name: 'Manômetro com tubo Bourdon', manufacturer: 'WIKA', family: 'instrumentacao', image: '/images/campaign/21353.jpg', pdf: '/datasheets/21353.pdf', source: 'https://www.wika.com/en-gb/213_53.WIKA',
    specs: [{ label: 'Diâmetros', value: '50, 63 e 100 mm' }, { label: 'Faixas de escala', value: 'Até 0 a 1.000 bar' }, { label: 'Caixa', value: 'Aço inoxidável' }, { label: 'Proteção', value: 'IP65' }, { label: 'Exatidão', value: 'Classe 1,6 (50/63 mm); 1,0 (100 mm)' }] },
  { id: 'a10', model: 'A-10', name: 'Transmissor de pressão', manufacturer: 'WIKA', family: 'instrumentacao', image: '/images/campaign/a10.jpg', pdf: '/datasheets/a10.pdf', source: 'https://www.wika.com/pt-br/a_10.WIKA',
    specs: [{ label: 'Medição', value: 'Pressão relativa, absoluta e vácuo' }, { label: 'Faixas relativas', value: 'De 0 a 0,05 até 0 a 1.000 bar' }, { label: 'Sinal', value: '4 a 20 mA ou tensão, conforme versão' }, { label: 'Aplicações', value: 'Máquinas, hidráulica e pneumática' }] },
]
