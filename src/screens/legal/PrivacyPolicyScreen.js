import React from 'react';
import { ScrollView, Text } from 'react-native';
import { common } from '../../theme';

const SECTIONS = [
  { title: null, text: 'Chambitas es una aplicación de demostración diseñada para conectar usuarios con profesionales de distintos oficios.' },
  { title: 'Información que recopilamos', text: 'Esta aplicación no recopila, almacena ni comparte información personal sensible con terceros. Los datos mostrados (nombre, correo, servicios) se usan únicamente con fines demostrativos.' },
  { title: 'Uso de la información', text: 'No se recopila ubicación en tiempo real, datos bancarios ni información de pago. Si en el futuro se requiere recopilación de datos, esta política será actualizada.' },
  { title: 'Almacenamiento', text: 'Los datos se almacenan localmente en el dispositivo del usuario mediante AsyncStorage.' },
  { title: 'Contacto', text: 'Para cualquier duda sobre esta política, puedes contactarnos desde la aplicación.' },
];

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView style={common.screen}>
      <Text style={common.legalTitle}>Política de Privacidad</Text>
      {SECTIONS.map((s, i) => (
        <React.Fragment key={i}>
          {s.title && <Text style={common.legalSubtitle}>{s.title}</Text>}
          <Text style={common.legalText}>{s.text}</Text>
        </React.Fragment>
      ))}
    </ScrollView>
  );
}