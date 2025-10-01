import { formatDate } from '../utils/format.js';

const RAW = [
  {
    id: '1',
    title: 'Feira de Tecnologia Comunitária',
    date: '2025-10-15T18:00:00',
    location: 'Centro Cultural – Arcoverde, PE',
    category: 'Tecnologia',
    capacity: 100,
    price: 0,
    description: 'Palestras, oficinas e networking para fomentar inovação local. Entrada gratuita mediante inscrição.',
    banner: '/images/hero-man-coffee.png'
  },
  {
    id: '2',
    title: 'Festival de Música Independente',
    date: '2025-11-02T20:00:00',
    location: 'Praça Central – Arcoverde, PE',
    category: 'Cultura',
    capacity: 500,
    price: 50,
    description: 'Line-up de artistas locais, comidas típicas e área de economia criativa.',
    banner: '/images/woman-phone.png'
  },
  {
    id: '3',
    title: 'Mutirão de Adoção de Animais',
    date: '2025-10-05T09:00:00',
    location: 'Parque Municipal – Arcoverde, PE',
    category: 'Comunidade',
    capacity: 60,
    price: 0,
    description: 'Parceria com ONGs para incentivar a adoção responsável e cuidados com pets.',
    banner: '/images/teamwork.png'
  }
];

const events = RAW.map(e => ({ ...e, formattedDate: formatDate(e.date) }));
export default events;
