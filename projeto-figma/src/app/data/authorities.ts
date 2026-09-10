export type Authority = {
  name: string;
  desc: string;
  url: string;
};

export const federalAuthorities: Authority[] = [
  {
    name: "Polícia Federal",
    desc: "Crimes cibernéticos federais",
    url: "https://www.gov.br/pf/pt-br/canais_atendimento",
  },
  {
    name: "Disque 190 - Emergência",
    desc: "Em caso de risco imediato",
    url: "tel:190",
  },
  {
    name: "Disque 100 - Direitos Humanos",
    desc: "Denúncias de violações",
    url: "tel:100",
  },
  {
    name: "SaferNet Brasil",
    desc: "Denúncia de crimes digitais",
    url: "https://new.safernet.org.br/denuncie",
  },
  {
    name: "Procon Nacional (consumidor.gov.br)",
    desc: "Defesa do Consumidor - reclamação oficial",
    url: "https://www.consumidor.gov.br/",
  },
  {
    name: "Senacon - Ministério da Justiça",
    desc: "Secretaria Nacional do Consumidor",
    url: "https://www.gov.br/mj/pt-br/assuntos/seus-direitos/consumidor",
  },
  {
    name: "Disque 151 - Procon",
    desc: "Atendimento telefônico do Procon",
    url: "tel:151",
  },
];

export const stateAuthorities: Record<string, Authority[]> = {
  AC: [
    { name: "Polícia Civil do Acre", desc: "Delegacia Virtual AC", url: "https://delegaciavirtual.ac.gov.br/" },
    { name: "Procon Acre", desc: "Defesa do Consumidor AC", url: "https://procon.ac.gov.br/" },
  ],
  AL: [
    { name: "Polícia Civil de Alagoas", desc: "Delegacia Virtual AL", url: "https://www.policiacivil.al.gov.br/delegacia-virtual" },
    { name: "Procon Alagoas", desc: "Defesa do Consumidor AL", url: "https://www.proconalagoas.al.gov.br/" },
  ],
  AP: [
    { name: "Polícia Civil do Amapá", desc: "Delegacia Virtual AP", url: "https://www.policiacivil.ap.gov.br/" },
    { name: "Procon Amapá", desc: "Defesa do Consumidor AP", url: "https://procon.ap.gov.br/" },
  ],
  AM: [
    { name: "Polícia Civil do Amazonas", desc: "Delegacia Virtual AM", url: "https://delegaciainterativa.am.gov.br/" },
    { name: "Procon Amazonas", desc: "Defesa do Consumidor AM", url: "https://procon.am.gov.br/" },
  ],
  BA: [
    { name: "Polícia Civil da Bahia", desc: "Delegacia Digital BA", url: "https://www.delegaciadigital.ba.gov.br/" },
    { name: "Procon Bahia", desc: "Defesa do Consumidor BA", url: "http://www.procon.ba.gov.br/" },
  ],
  CE: [
    { name: "Polícia Civil do Ceará", desc: "Delegacia Eletrônica CE", url: "https://delegaciaeletronica.policiacivil.ce.gov.br/" },
    { name: "Procon Ceará", desc: "Defesa do Consumidor CE", url: "https://www.mpce.mp.br/decon/" },
  ],
  DF: [
    { name: "Polícia Civil do DF", desc: "Delegacia Eletrônica DF", url: "https://www.pcdf.df.gov.br/servicos/delegacia-eletronica" },
    { name: "Procon DF", desc: "Defesa do Consumidor DF", url: "https://www.procon.df.gov.br/" },
  ],
  ES: [
    { name: "Polícia Civil do Espírito Santo", desc: "Delegacia Online ES", url: "https://www.delegaciaonline.es.gov.br/" },
    { name: "Procon Espírito Santo", desc: "Defesa do Consumidor ES", url: "https://procon.es.gov.br/" },
  ],
  GO: [
    { name: "Polícia Civil de Goiás", desc: "Delegacia Virtual GO", url: "https://delegaciavirtual.go.gov.br/" },
    { name: "Procon Goiás", desc: "Defesa do Consumidor GO", url: "https://www.procon.go.gov.br/" },
  ],
  MA: [
    { name: "Polícia Civil do Maranhão", desc: "Delegacia Digital MA", url: "https://www.pc.ma.gov.br/" },
    { name: "Procon Maranhão", desc: "Defesa do Consumidor MA", url: "https://www.procon.ma.gov.br/" },
  ],
  MT: [
    { name: "Polícia Civil de Mato Grosso", desc: "Delegacia Virtual MT", url: "https://www.pjc.mt.gov.br/" },
    { name: "Procon Mato Grosso", desc: "Defesa do Consumidor MT", url: "https://www.procon.mt.gov.br/" },
  ],
  MS: [
    { name: "Polícia Civil de MS", desc: "Delegacia Virtual MS", url: "https://www.pc.ms.gov.br/" },
    { name: "Procon Mato Grosso do Sul", desc: "Defesa do Consumidor MS", url: "https://www.procon.ms.gov.br/" },
  ],
  MG: [
    { name: "Polícia Civil de Minas Gerais", desc: "Delegacia Virtual MG", url: "https://delegaciavirtual.policiacivil.mg.gov.br/" },
    { name: "Procon Minas Gerais", desc: "Defesa do Consumidor MG", url: "https://www.mpmg.mp.br/areas-de-atuacao/defesa-do-cidadao/consumidor/procon-mg/" },
  ],
  PA: [
    { name: "Polícia Civil do Pará", desc: "Delegacia Virtual PA", url: "https://www.policiacivil.pa.gov.br/" },
    { name: "Procon Pará", desc: "Defesa do Consumidor PA", url: "https://www.procon.pa.gov.br/" },
  ],
  PB: [
    { name: "Polícia Civil da Paraíba", desc: "Delegacia Virtual PB", url: "https://delegaciavirtual.pb.gov.br/" },
    { name: "Procon Paraíba", desc: "Defesa do Consumidor PB", url: "https://procon.pb.gov.br/" },
  ],
  PR: [
    { name: "Polícia Civil do Paraná", desc: "Delegacia Eletrônica PR", url: "https://www.delegaciaeletronica.pr.gov.br/" },
    { name: "Procon Paraná", desc: "Defesa do Consumidor PR", url: "https://www.procon.pr.gov.br/" },
  ],
  PE: [
    { name: "Polícia Civil de Pernambuco", desc: "Delegacia Interativa PE", url: "https://www.delegaciainterativa.pe.gov.br/" },
    { name: "Procon Pernambuco", desc: "Defesa do Consumidor PE", url: "https://www.procon.pe.gov.br/" },
  ],
  PI: [
    { name: "Polícia Civil do Piauí", desc: "Delegacia Virtual PI", url: "https://www.pc.pi.gov.br/" },
    { name: "Procon Piauí", desc: "Defesa do Consumidor PI", url: "https://www.procon.pi.gov.br/" },
  ],
  RJ: [
    { name: "Polícia Civil do RJ", desc: "Delegacia Online RJ", url: "https://delegaciavirtual.pcivil.rj.gov.br/" },
    { name: "Procon Rio de Janeiro", desc: "Defesa do Consumidor RJ", url: "https://www.procon.rj.gov.br/" },
  ],
  RN: [
    { name: "Polícia Civil do RN", desc: "Delegacia Virtual RN", url: "https://www.delegaciavirtual.rn.gov.br/" },
    { name: "Procon RN", desc: "Defesa do Consumidor RN", url: "http://www.procon.rn.gov.br/" },
  ],
  RS: [
    { name: "Polícia Civil do RS", desc: "Delegacia Online RS", url: "https://www.delegaciaonline.rs.gov.br/" },
    { name: "Procon Rio Grande do Sul", desc: "Defesa do Consumidor RS", url: "https://www.procon.rs.gov.br/" },
  ],
  RO: [
    { name: "Polícia Civil de Rondônia", desc: "Delegacia Virtual RO", url: "https://www.policiacivil.ro.gov.br/" },
    { name: "Procon Rondônia", desc: "Defesa do Consumidor RO", url: "https://procon.ro.gov.br/" },
  ],
  RR: [
    { name: "Polícia Civil de Roraima", desc: "Delegacia Virtual RR", url: "https://www.pc.rr.gov.br/" },
    { name: "Procon Roraima", desc: "Defesa do Consumidor RR", url: "https://www.procon.rr.gov.br/" },
  ],
  SC: [
    { name: "Polícia Civil de SC", desc: "Delegacia Virtual SC", url: "https://delegaciavirtual.sc.gov.br/" },
    { name: "Procon Santa Catarina", desc: "Defesa do Consumidor SC", url: "https://www.procon.sc.gov.br/" },
  ],
  SP: [
    { name: "Polícia Civil de SP", desc: "Delegacia Eletrônica SP", url: "https://www.delegaciaeletronica.policiacivil.sp.gov.br/" },
    { name: "Procon São Paulo", desc: "Defesa do Consumidor SP", url: "https://www.procon.sp.gov.br/" },
  ],
  SE: [
    { name: "Polícia Civil de Sergipe", desc: "Delegacia Virtual SE", url: "https://www.ssp.se.gov.br/" },
    { name: "Procon Sergipe", desc: "Defesa do Consumidor SE", url: "https://www.procon.se.gov.br/" },
  ],
  TO: [
    { name: "Polícia Civil do Tocantins", desc: "Delegacia Virtual TO", url: "https://www.to.gov.br/sesp/" },
    { name: "Procon Tocantins", desc: "Defesa do Consumidor TO", url: "https://procon.to.gov.br/" },
  ],
};

export const brazilianStates = [
  { code: "AC", name: "Acre" },
  { code: "AL", name: "Alagoas" },
  { code: "AP", name: "Amapá" },
  { code: "AM", name: "Amazonas" },
  { code: "BA", name: "Bahia" },
  { code: "CE", name: "Ceará" },
  { code: "DF", name: "Distrito Federal" },
  { code: "ES", name: "Espírito Santo" },
  { code: "GO", name: "Goiás" },
  { code: "MA", name: "Maranhão" },
  { code: "MT", name: "Mato Grosso" },
  { code: "MS", name: "Mato Grosso do Sul" },
  { code: "MG", name: "Minas Gerais" },
  { code: "PA", name: "Pará" },
  { code: "PB", name: "Paraíba" },
  { code: "PR", name: "Paraná" },
  { code: "PE", name: "Pernambuco" },
  { code: "PI", name: "Piauí" },
  { code: "RJ", name: "Rio de Janeiro" },
  { code: "RN", name: "Rio Grande do Norte" },
  { code: "RS", name: "Rio Grande do Sul" },
  { code: "RO", name: "Rondônia" },
  { code: "RR", name: "Roraima" },
  { code: "SC", name: "Santa Catarina" },
  { code: "SP", name: "São Paulo" },
  { code: "SE", name: "Sergipe" },
  { code: "TO", name: "Tocantins" },
];
