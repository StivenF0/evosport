'use client';
import { useTeams } from '@web/hooks/useApi';

export default function Home() {
  const { data: teams, isLoading, isError } = useTeams();

  if (isLoading) return <p>Carregando tabela de classificação...</p>;
  if (isError) return <p>Erro ao carregar os dados.</p>;

  return (
    <ul>
      {teams?.map((team) => (
        <li key={team.id}>{team.name}</li>
      ))}
    </ul>
  );
}
