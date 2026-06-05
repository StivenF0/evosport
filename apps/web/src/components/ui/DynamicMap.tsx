import dynamic from 'next/dynamic';
import { LoadingSpinner } from './LoadingSpinner';

// Desabilita o Server-Side Rendering (SSR) especificamente para este componente
export const DynamicMap = dynamic(
  () => import('./Map'),
  {
    ssr: false,
    loading: () => <LoadingSpinner message="Carregando o mapa interativo..." />
  }
);
