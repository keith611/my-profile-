/**
 * Public profile shown when an NFC card opens the Vexa profile route.
 * Add only information you want visible to anyone with the link.
 */
export const profile = {
  name: 'David Keith Egwa',
  publicPath: '/profile',
  title: 'Technology Builder · Aspiring Entrepreneur',
  description: "David Keith Egwa's digital contact profile. Connect, call, email, and explore his work with Vexa and Fidika.",
  role: 'CEO',
  organization: 'Vexa · Fidika',
  bio: 'I build digital products from idea to launch—systems, apps, and websites. I work across Python, React and Vite, Kotlin, and databases, bringing the pieces together to create practical tools that work.',
  about: 'An emerging technology professional passionate about creating useful software, building systems, apps, and websites, and turning ideas into working products.',
  location: 'Nairobi, Kenya',
  email: 'keithdavid982@gmail.com',
  phones: ['0799451809', '0787636812'],
  photo: '/david-keith-profile.jpg',
  projects: [
    {
      name: 'Fidika',
      description: 'A finance and transaction insights concept for Kenyan businesses.',
      image: '/projects/fidika.jpg',
      url: 'https://fidika-site.vercel.app',
      status: 'Live website',
    },
    {
      name: 'Vexa',
      description: 'A smarter way to exchange professional identities and build lasting connections.',
      image: '/projects/vexa.jpg',
      status: 'In development',
    },
    {
      name: 'Nia',
      description: 'A vision for an AI-powered home assistant designed around African families.',
      image: '/projects/nia.jpg',
      status: 'Concept',
    },
    {
      name: 'Africa Dining & Travel Guide',
      url: 'https://african-dining-travel.vercel.app',
      status: 'Live website',
    },
  ],
  links: [
    { label: 'Fidika', url: 'https://fidika-site.vercel.app' },
    { label: 'Africa Dining', url: 'https://african-dining-travel.vercel.app' },
    { label: 'GitHub', url: 'https://github.com/keith611' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/david-keith-2420892b8?utm_source=share_via&utm_content=profile&utm_medium=member_android' },
    { label: 'Instagram', url: 'https://www.instagram.com/keithdavid982?obrf=b2M5NzZ0ZHVnbWwz' },
  ],
};
