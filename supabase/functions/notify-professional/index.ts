import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

serve(async (req) => {
  try {
    const { record } = await req.json();

    // Solo procesar cuando se crea un servicio nuevo (status: pendiente)
    if (!record || record.status !== 'pendiente') {
      return new Response(JSON.stringify({ message: 'No action needed' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Inicializar cliente Supabase con service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Buscar el push_token del profesional
    const { data: professional } = await supabase
      .from('professionals')
      .select('user_id, name')
      .eq('id', record.professional_id)
      .single();

    if (!professional?.user_id) {
      return new Response(JSON.stringify({ message: 'Professional not found' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('push_token, name')
      .eq('id', professional.user_id)
      .single();

    if (!profile?.push_token) {
      return new Response(JSON.stringify({ message: 'No push token found' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Buscar el nombre del cliente
    const { data: client } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', record.user_id)
      .single();

    const clientName = client?.name || 'Un cliente';

    // Enviar notificación push via Expo
    const message = {
      to:    profile.push_token,
      sound: 'default',
      title: '🔔 Nueva solicitud de servicio',
      body:  `${clientName} necesita tu ayuda. ¡Revisa los detalles!`,
      data:  { serviceId: record.id },
    };

    const response = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();
    console.log('Push notification result:', result);

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});