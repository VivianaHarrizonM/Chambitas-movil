import React from 'react';
import { ScrollView, Text } from 'react-native';
import { common } from '../../theme';

const SECTIONS = [
  { title: null, text: 'Al utilizar Chambitas, aceptas los presentes términos y condiciones.' },
  { title: 'Uso de la aplicación', text: 'El uso de Chambitas implica la aceptación de estos términos. Esta es una versión de demostración y no representa un servicio real de contratación de profesionales.' },
  { title: 'Responsabilidad', text: 'Chambitas no se hace responsable por acuerdos o servicios realizados fuera de la aplicación. La información mostrada es simulada y de uso educativo.' },
  { title: 'Modificaciones', text: 'El desarrollador se reserva el derecho de modificar o suspender la aplicación en cualquier momento.' },
];

export default function TermsScreen() {
  return (
    <ScrollView style={common.screen}>
      <Text style={common.legalTitle}>Términos y Condiciones</Text>
      {SECTIONS.map((s, i) => (
        <React.Fragment key={i}>
          {s.title && <Text style={common.legalSubtitle}>{s.title}</Text>}
          <Text style={common.legalText}>{s.text}</Text>
        </React.Fragment>
      ))}
    </ScrollView>
  );
}