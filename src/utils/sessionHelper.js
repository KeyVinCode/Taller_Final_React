/**
 * Helper para restaurar la sesión de Supabase desde localStorage.
 * Supabase guarda la sesión con una clave dinámica: sb-{PROJECT_REF}-auth-token
 * 
 * @returns {boolean} true si la sesión se restauró correctamente
 */
export const restaurarSesion = async (supabase) => {
  try {
    // Intentar 1: Usar getSession() (método estándar de Supabase)
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });
      return true;
    }

    // Intentar 2: Buscar manualmente en localStorage la clave de Supabase
    const storageKey = Object.keys(localStorage).find(
      (key) => key.startsWith("sb-") && key.endsWith("-auth-token")
    );

    if (storageKey) {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.access_token) {
          await supabase.auth.setSession({
            access_token: parsed.access_token,
            refresh_token: parsed.refresh_token,
          });
          return true;
        }
      }
    }

    // Intentar 3: Usar el token del usuario guardado en stardew_usuario
    // no funciona porque solo guarda metadata, no el token de acceso

    return false;
  } catch (e) {
    console.warn("Error restaurando sesión Supabase:", e);
    return false;
  }
};