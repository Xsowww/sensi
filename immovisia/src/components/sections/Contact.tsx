import { useState } from 'react';
import { Icon } from '@/components/IconSprite';
import { useReveal } from '@/hooks/useReveal';
import { TiltCard } from '@/components/ui/tilt-card';

type FieldName = 'name' | 'email' | 'message';

const validators: Record<FieldName, (value: string) => string> = {
  name: (v) => (v.trim().length < 2 ? 'Indiquez votre nom.' : ''),
  email: (v) => {
    if (!v.trim()) return 'Indiquez votre email.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) {
      return 'Cet email ne semble pas valide.';
    }
    return '';
  },
  message: (v) =>
    v.trim().length < 10 ? 'Décrivez votre projet en quelques mots.' : '',
};

const labels: Record<FieldName, string> = {
  name: 'Nom',
  email: 'Email',
  message: 'Votre projet',
};

export function Contact() {
  const intro = useReveal<HTMLDivElement>();
  const panel = useReveal<HTMLDivElement>();
  const details = useReveal<HTMLUListElement>();

  const [values, setValues] = useState<Record<FieldName, string>>({
    name: '',
    email: '',
    message: '',
  });
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const setField = (field: FieldName, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    // Re-validate only a field already showing an error, so the form does not
    // shout at someone still filling it in.
    if (errors[field]) {
      setErrors((e) => ({ ...e, [field]: validators[field](value) || undefined }));
    }
  };

  const blurField = (field: FieldName) => {
    if (!values[field].trim()) return;
    setErrors((e) => ({ ...e, [field]: validators[field](values[field]) || undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate every field, not just up to the first failure.
    const next: Partial<Record<FieldName, string>> = {};
    (Object.keys(validators) as FieldName[]).forEach((field) => {
      const message = validators[field](values[field]);
      if (message) next[field] = message;
    });
    setErrors(next);

    const firstInvalid = (Object.keys(validators) as FieldName[]).find((f) => next[f]);
    if (firstInvalid) {
      document.getElementById(`f-${firstInvalid}`)?.focus();
      return;
    }

    setStatus('sending');
    // TODO: POST { ...values, phone } to the agency's mail endpoint or CRM.
    // Nothing is sent yet; this only drives the success state.
    window.setTimeout(() => setStatus('sent'), 700);
  };

  const field = (name: FieldName, type: 'text' | 'email' = 'text') => (
    <div className="field">
      <label htmlFor={`f-${name}`}>{labels[name]}</label>
      {name === 'message' ? (
        <textarea
          id="f-message"
          name="message"
          rows={4}
          value={values.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby="e-message"
          onChange={(e) => setField('message', e.target.value)}
          onBlur={() => blurField('message')}
        />
      ) : (
        <input
          id={`f-${name}`}
          name={name}
          type={type}
          autoComplete={name === 'email' ? 'email' : 'name'}
          value={values[name]}
          aria-invalid={errors[name] ? true : undefined}
          aria-describedby={`e-${name}`}
          onChange={(e) => setField(name, e.target.value)}
          onBlur={() => blurField(name)}
        />
      )}
      {errors[name] ? (
        <p className="field__error" id={`e-${name}`}>
          <Icon name="warning-circle" />
          <span>{errors[name]}</span>
        </p>
      ) : null}
    </div>
  );

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap contact__grid">
        <div className={`contact__intro ${intro.className}`} ref={intro.ref}>
          <h2 className="section-title" id="contact-title">
            Parlons de votre projet
          </h2>
          <p className="section-sub">
            Décrivez votre bien ou votre recherche. Nous répondons sous 24 heures
            ouvrées.
          </p>
        </div>

        <div className={`contact__panel-slot ${panel.className}`} ref={panel.ref}>
          <TiltCard className="h-full">
            <div className="contact__panel">
          {status === 'sent' ? (
            <div className="form__done" role="status">
              <span className="form__done-icon" aria-hidden="true">
                <Icon name="check-circle" />
              </span>
              <h3>Demande envoyée</h3>
              <p>Nous revenons vers vous sous 24 heures ouvrées.</p>
            </div>
          ) : (
            <form className="form" onSubmit={handleSubmit} noValidate>
              {field('name')}
              {field('email', 'email')}

              <div className="field">
                <label htmlFor="f-phone">
                  Téléphone <span className="field__opt">facultatif</span>
                </label>
                <input
                  id="f-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {field('message')}

              <button
                className="btn btn--primary btn--block"
                type="submit"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Envoi en cours' : 'Envoyer la demande'}
              </button>
              <p className="form__note">
                Vos coordonnées servent uniquement à traiter votre demande.
              </p>
            </form>
          )}
            </div>
          </TiltCard>
        </div>

        <ul className={`contact__details ${details.className}`} ref={details.ref}>
          <li>
            <span className="contact__ico" aria-hidden="true">
              <Icon name="map-pin" />
            </span>
            <span>
              12 rue Maréchal Joffre
              <br />
              64000 Pau
            </span>
          </li>
          <li>
            <span className="contact__ico" aria-hidden="true">
              <Icon name="phone" />
            </span>
            <a href="tel:+33559000000">05 59 00 00 00</a>
          </li>
          <li>
            <span className="contact__ico" aria-hidden="true">
              <Icon name="envelope-simple" />
            </span>
            <a href="mailto:contact@immovisia.fr">contact@immovisia.fr</a>
          </li>
          <li>
            <span className="contact__ico" aria-hidden="true">
              <Icon name="clock" />
            </span>
            <span>
              Lundi au vendredi, 9h à 18h30
              <br />
              Samedi, 9h30 à 12h30
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
