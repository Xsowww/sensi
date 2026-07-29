import { Icon, type IconName } from '@/components/IconSprite';
import { GlowCard } from '@/components/ui/spotlight-card';
import { useReveal } from '@/hooks/useReveal';

interface Service {
  icon: IconName;
  title: string;
  body: string;
}

const services: Service[] = [
  {
    icon: 'chart-line-up',
    title: 'Estimation',
    body: 'Une valeur de marché argumentée, appuyée sur les ventes signées dans votre rue.',
  },
  {
    icon: 'key',
    title: 'Vente',
    body: 'Photographie, diffusion, visites qualifiées et négociation avec un seul interlocuteur.',
  },
  {
    icon: 'buildings',
    title: 'Location et gestion',
    body: 'Recherche de locataires, état des lieux et suivi des loyers toute l’année.',
  },
  {
    icon: 'handshake',
    title: 'Suivi du dossier',
    body: 'Du compromis à l’acte, nous suivons le dossier avec le notaire et votre banque.',
  },
];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <div
      ref={reveal.ref}
      className={reveal.className}
      style={{ '--i': index } as React.CSSProperties}
    >
      <GlowCard
        glowColor="brand"
        variant="light"
        customSize
        className="service service-card"
      >
        <span className="service__icon" aria-hidden="true">
          <Icon name={service.icon} />
        </span>
        <div>
          <h3 className="service__title">{service.title}</h3>
          <p className="service__body">{service.body}</p>
        </div>
      </GlowCard>
    </div>
  );
}

export function Services() {
  const head = useReveal<HTMLElement>();

  return (
    <section className="services" id="services" aria-labelledby="services-title">
      <div className="wrap">
        <header className={`section-head ${head.className}`} ref={head.ref}>
          <h2 className="section-title" id="services-title">
            Ce que nous prenons en charge
          </h2>
        </header>

        <div className="services__grid">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
