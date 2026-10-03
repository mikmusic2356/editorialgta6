export interface QuickTip {
  id: string;
  category: 'combate' | 'conduccion' | 'supervivencia' | 'dinero' | 'trucos' | 'exploracion';
  categoryLabel: string;
  title: string;
  summary: string;
  stepsOrKeyAdvice: string;
  iconName: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
}

export const QUICK_TIPS_DATA: QuickTip[] = [
  {
    id: 'tip-01',
    category: 'supervivencia',
    categoryLabel: 'Supervivencia & Policía',
    title: 'Deshacerse de 3 estrellas en menos de 60 segundos con cambio de matrícula',
    summary: 'La policía de Vice City rastrea vehículos mediante cámaras OCR en avenidas principales.',
    stepsOrKeyAdvice: 'Entra a un callejón techado, apaga las luces del coche (D-Pad derecha) y cambia la placa o color en un taller Pay & Spray antes de que el helicóptero recupere la línea de visión visual.',
    iconName: 'ShieldAlert',
    difficulty: 'Principiante'
  },
  {
    id: 'tip-02',
    category: 'combate',
    categoryLabel: 'Combate Táctico',
    title: 'Recarga táctica rápida conservando una bala en recámara',
    summary: 'Recargar con munición restante en el cargador es un 40% más rápido que vaciarlo por completo.',
    stepsOrKeyAdvice: 'No esperes a que el contador llegue a cero: pulsa recargar cuando queden entre 2 y 5 balas para evitar la animación completa de amartillado de cerrojo.',
    iconName: 'Crosshair',
    difficulty: 'Intermedio'
  },
  {
    id: 'tip-03',
    category: 'conduccion',
    categoryLabel: 'Conducción & Fugas',
    title: 'Técnica de balanceo de peso en muscle cars para giros cerrados a 90°',
    summary: 'Los vehículos con tracción trasera potente tienden a subvirar si solo usas el freno de mano.',
    stepsOrKeyAdvice: 'Aplica un toque leve de freno de pie para transferir peso al eje delantero justo antes de tirar del freno de mano y contragolpear con acelerador a fondo.',
    iconName: 'Car',
    difficulty: 'Avanzado'
  },
  {
    id: 'tip-04',
    category: 'dinero',
    categoryLabel: 'Dinero Rápido',
    title: 'Ruta de cajas fuertes en gasolineras nocturnas de Kelly County',
    summary: 'Las gasolineras rurales cuentan con guardias solitarios y cajas fuertes de combinación mecánica.',
    stepsOrKeyAdvice: 'Usa una palanca de forzado o un taladro manual silencioso entre las 02:00 AM y las 05:00 AM para obtener entre $3,500 y $7,200 por local sin activar alarmas.',
    iconName: 'Sparkles',
    difficulty: 'Principiante'
  },
  {
    id: 'tip-05',
    category: 'exploracion',
    categoryLabel: 'Exploración Segura',
    title: 'Navegar por Grassrivers de noche sin ser devorado por caimanes gigantes',
    summary: 'Los caimanes de pantano reaccionan inmediatamente al sonido de motores convencionales en aguas bajas.',
    stepsOrKeyAdvice: 'Mantén el hidrodeslizador en marcha constante sin detenerte en zonas de juncos y equipa linterna táctica UV en el fusil para detectar el brillo ocular de los reptiles a 40 metros.',
    iconName: 'Compass',
    difficulty: 'Intermedio'
  },
  {
    id: 'tip-06',
    category: 'trucos',
    categoryLabel: 'Mecánicas Jugables',
    title: 'Sincronizar el modo concentración conjunto de Lucia y Jason',
    summary: 'Cuando el medidor de confianza está al 100%, ambos personajes entran en tiempo bala simultáneo.',
    stepsOrKeyAdvice: 'Mantén pulsados ambos sticks analógicos (L3 + R3) mientras ambos personajes apuntan al mismo grupo de enemigos para limpiar salas blindadas en 3 segundos.',
    iconName: 'Flame',
    difficulty: 'Avanzado'
  }
];
