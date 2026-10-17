import { profile as davidProfile } from './profile.js';

export const emmanuelProfile = {
  name: 'Emmanuel Masaka Mwatabu',
  publicPath: '/emmanuel',
  title: 'Co-founder · Developer',
  description: "Emmanuel Masaka Mwatabu's Vexa digital profile. Connect, call, email, and explore shared projects.",
  role: 'Business Operations · Entrepreneurship',
  organization: 'Vexa · Fidika',
  bio: 'I build digital products from idea to launch—systems, apps, and websites. I work across Python, React and Vite, Kotlin, and databases, bringing the pieces together to create practical tools that work. I also work in business operations and entrepreneurship.',
  about: 'I build digital products from idea to launch—systems, apps, and websites. I work across Python, React and Vite, Kotlin, and databases, bringing the pieces together to create practical tools that work. I also work in business operations and entrepreneurship.',
  location: 'Dubai',
  email: 'mwatabuemmanuel@gmail.com',
  phones: ['+971 52 200 5123'],
  photo: '/emmanuel-mwatabu-profile.jpg',
  links: [
    { label: 'Fidika', url: 'https://fidika-site.vercel.app' },
    { label: 'Africa Dining', url: 'https://african-dining-travel.vercel.app' },
    { label: 'Instagram', url: 'https://www.instagram.com/emmanuelmwatabu?xtok=M3Zwc2R4cTlkeGti' },
  ],
  projects: davidProfile.projects.map((project) => ({
    ...project,
    contribution: 'Co-founder · Developer',
  })),
};
