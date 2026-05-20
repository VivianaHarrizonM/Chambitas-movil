import React from 'react';
import { ScrollView, Text } from 'react-native';
import { common } from '../../theme';

const SECTIONS = [
  {
    title: null,
    text: 'Al descargar, instalar o utilizar Chambitas, usted acepta los presentes Términos y Condiciones. Si no está de acuerdo con alguno de ellos, le pedimos no utilizar la aplicación.',
  },
  {
    title: '1. Descripción del servicio',
    text: 'Chambitas es una plataforma digital que actúa como intermediario entre usuarios que requieren servicios de oficios (clientes) y personas que ofrecen dichos servicios (profesionales). Chambitas no es empleador ni proveedor directo de los servicios ofrecidos por los profesionales registrados.',
  },
  {
    title: '2. Registro y cuenta',
    text: 'Para usar Chambitas debe crear una cuenta con información verídica y mantenerla actualizada. Usted es responsable de mantener la confidencialidad de su contraseña y de todas las actividades realizadas desde su cuenta. Chambitas se reserva el derecho de suspender cuentas que incumplan estos términos.',
  },
  {
    title: '3. Uso de la plataforma',
    text: 'Usted se compromete a usar Chambitas únicamente para fines lícitos. Queda prohibido: (1) publicar información falsa o engañosa, (2) suplantar la identidad de otras personas, (3) usar la plataforma para actividades ilegales, (4) acosar o amenazar a otros usuarios o profesionales.',
  },
  {
    title: '4. Responsabilidad de los profesionales',
    text: 'Los profesionales registrados en Chambitas son personas independientes y no empleados de la plataforma. Chambitas no garantiza la calidad, seguridad ni resultado de los servicios prestados. Es responsabilidad del usuario verificar las credenciales del profesional antes de contratarlo.',
  },
  {
    title: '5. Calificaciones y reseñas',
    text: 'Las calificaciones y reseñas publicadas en Chambitas deben ser honestas y basadas en experiencias reales. Chambitas se reserva el derecho de eliminar contenido que considere falso, ofensivo o inapropiado.',
  },
  {
    title: '6. Limitación de responsabilidad',
    text: 'Chambitas no se hace responsable por daños directos, indirectos, incidentales o consecuentes derivados del uso de la plataforma o de los servicios contratados a través de ella. La responsabilidad máxima de Chambitas se limita al valor del servicio contratado.',
  },
  {
    title: '7. Propiedad intelectual',
    text: 'El nombre, logotipo, diseño y contenido de Chambitas son propiedad de Viviana Harrizon Macedo. Queda prohibida su reproducción total o parcial sin autorización expresa.',
  },
  {
    title: '8. Modificaciones',
    text: 'Chambitas se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios serán notificados a través de la aplicación y entrarán en vigor desde su publicación.',
  },
  {
    title: '9. Legislación aplicable',
    text: 'Estos Términos y Condiciones se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier controversia será resuelta ante los tribunales competentes de la Ciudad de México.',
  },
  {
    title: 'Contacto',
    text: 'Para cualquier duda sobre estos Términos y Condiciones puede contactarnos en: chambitas.app@gmail.com',
  },
];

export default function TermsScreen() {
  return (
    <ScrollView style={common.screen}>
      <Text style={common.legalTitle}>Términos y Condiciones</Text>
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