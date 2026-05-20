import React from 'react';
import { ScrollView, Text } from 'react-native';
import { common } from '../../theme';

const SECTIONS = [
  {
    title: null,
    text: 'Chambitas es una plataforma digital que conecta a usuarios con profesionales de distintos oficios. El presente Aviso de Privacidad se emite en cumplimiento de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y su Reglamento.',
  },
  {
    title: 'Responsable de los datos',
    text: 'Chambitas, con domicilio en México, es la responsable del tratamiento de sus datos personales. Para cualquier asunto relacionado con este aviso puede contactarnos en: chambitas.app@gmail.com',
  },
  {
    title: 'Datos personales que recabamos',
    text: 'Recabamos los siguientes datos personales: nombre completo, correo electrónico, número de teléfono, dirección, ciudad y código postal. Estos datos se obtienen directamente de usted al momento de crear su cuenta o editar su perfil.',
  },
  {
    title: 'Finalidad del tratamiento',
    text: 'Sus datos personales son utilizados para: (1) crear y gestionar su cuenta de usuario, (2) conectarle con profesionales de oficios disponibles en su área, (3) gestionar las solicitudes de servicio que realice, (4) mejorar la experiencia dentro de la aplicación.',
  },
  {
    title: 'Transferencia de datos',
    text: 'Sus datos personales no serán transferidos, vendidos ni cedidos a terceros sin su consentimiento previo, salvo en los casos previstos por la LFPDPPP o por disposición legal.',
  },
  {
    title: 'Almacenamiento y seguridad',
    text: 'Sus datos se almacenan de forma segura en servidores de Supabase con medidas de seguridad técnicas y administrativas para proteger su información contra acceso no autorizado, pérdida o alteración.',
  },
  {
    title: 'Derechos ARCO',
    text: 'Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales (derechos ARCO). Para ejercer estos derechos envíe su solicitud a chambitas.app@gmail.com indicando su nombre completo y el derecho que desea ejercer. Atenderemos su solicitud en un plazo máximo de 20 días hábiles.',
  },
  {
    title: 'Cambios al aviso de privacidad',
    text: 'Nos reservamos el derecho de modificar este aviso en cualquier momento. Cualquier cambio será notificado a través de la aplicación. Le recomendamos revisar este aviso periódicamente.',
  },
  {
    title: 'Contacto',
    text: 'Para cualquier duda o aclaración sobre este Aviso de Privacidad puede contactarnos en: chambitas.app@gmail.com',
  },
];

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView style={common.screen}>
      <Text style={common.legalTitle}>Aviso de Privacidad</Text>
      <Text style={[common.legalText, { marginBottom: 16 }]}>
        Última actualización: mayo 2026
      </Text>
      {SECTIONS.map((s, i) => (
        <React.Fragment key={i}>
          {s.title && <Text style={common.legalSubtitle}>{s.title}</Text>}
          <Text style={common.legalText}>{s.text}</Text>
        </React.Fragment>
      ))}
    </ScrollView>
  );
}