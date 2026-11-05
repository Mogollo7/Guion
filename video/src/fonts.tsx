import '@fontsource/fraunces/500.css';
import '@fontsource/fraunces/600.css';
import '@fontsource/fraunces/700.css';
import '@fontsource/fraunces/500-italic.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/manrope/800.css';
import '@fontsource/jetbrains-mono/500.css';
import React, { useEffect, useState } from 'react';
import { continueRender, delayRender } from 'remotion';

const FACES = [
  '500 64px Fraunces', '600 64px Fraunces', '700 64px Fraunces', 'italic 500 64px Fraunces',
  '400 32px Manrope', '500 32px Manrope', '600 32px Manrope', '700 32px Manrope', '800 32px Manrope', '500 24px "JetBrains Mono"',
];

/** Espera a que las fuentes estén cargadas antes de capturar cualquier cuadro. */
export const FontGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = useState(() => delayRender('Cargando fuentes'));
  useEffect(() => {
    Promise.all(FACES.map((f) => document.fonts.load(f)))
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);
  return <>{children}</>;
};
